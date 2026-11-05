import { useCallback, useEffect, useRef, useState } from 'react';
import { Question, RoundOutcome, Side } from './types';
import { pickQuestions } from './questions';
import { computePoints, QUESTION_TIME_MS, READING_TIME_MS, THEME_INTRO_MS, AUTO_ADVANCE_MS } from './scoring';
import { decideBotAnswer, BotDecision, DEFAULT_BOT } from './bot';

// Déroulé d'une question :
//  themeIntro (balayage du thème) → reading (question plein écran) →
//  playing (question en haut + réponses) → reveal (feedback) → auto-avance.
export type Phase = 'themeIntro' | 'reading' | 'playing' | 'reveal' | 'done';

const freshSide = (): Side => ({ score: 0, streak: 0, bestStreak: 0 });

export function useDuel(totalQuestions = 7, categoryIds?: string[]) {
  const [questions, setQuestions] = useState<Question[]>(() => pickQuestions(totalQuestions, categoryIds));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('themeIntro');
  const [timeLeftMs, setTimeLeftMs] = useState(QUESTION_TIME_MS);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<RoundOutcome | null>(null);
  const [you, setYou] = useState<Side>(freshSide);
  const [bot, setBot] = useState<Side>(freshSide);

  const indexRef = useRef(0);
  const youRef = useRef<Side>(freshSide());
  const botRef = useRef<Side>(freshSide());
  const startRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const themeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const youAnsRef = useRef<{ index: number; timeMs: number } | null>(null);
  const botAnsRef = useRef<{ decision: BotDecision; timeMs: number } | null>(null);
  const resolvedRef = useRef(false);

  const clearTimers = useCallback(() => {
    [tickRef, botTimerRef, themeTimerRef, readingTimerRef].forEach((r) => {
      if (r.current) {
        clearInterval(r.current as ReturnType<typeof setInterval>);
        clearTimeout(r.current as ReturnType<typeof setTimeout>);
        r.current = null;
      }
    });
  }, []);

  // Résout la manche : calcule les points des deux camps.
  const resolveRound = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    if (tickRef.current) clearInterval(tickRef.current);
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    tickRef.current = null;
    botTimerRef.current = null;

    const q = questions[indexRef.current];
    const ya = youAnsRef.current;
    const ba = botAnsRef.current;

    const youCorrect = !!ya && ya.index === q.correctIndex;
    const botCorrect = !!ba && ba.decision.correct;

    const yr = computePoints({ correct: youCorrect, timeMs: ya ? ya.timeMs : QUESTION_TIME_MS, currentStreak: youRef.current.streak });
    const br = computePoints({ correct: botCorrect, timeMs: ba ? ba.timeMs : QUESTION_TIME_MS, currentStreak: botRef.current.streak });

    // Dernière question : points doublés (permet un comeback sur un match serré).
    const isLast = indexRef.current === questions.length - 1;
    const mult = isLast ? 2 : 1;
    const yPts = yr.points * mult;
    const bPts = br.points * mult;

    youRef.current = { score: youRef.current.score + yPts, streak: yr.newStreak, bestStreak: Math.max(youRef.current.bestStreak, yr.newStreak) };
    botRef.current = { score: botRef.current.score + bPts, streak: br.newStreak, bestStreak: Math.max(botRef.current.bestStreak, br.newStreak) };

    setYou({ ...youRef.current });
    setBot({ ...botRef.current });
    setOutcome({
      correctIndex: q.correctIndex,
      you: { answerIndex: ya ? ya.index : null, correct: youCorrect, points: yPts, timeMs: ya ? ya.timeMs : null },
      bot: { answerIndex: ba ? ba.decision.answerIndex : null, correct: botCorrect, points: bPts, timeMs: ba ? ba.timeMs : null },
    });
    setPhase('reveal');
  }, [questions]);

  // Phase de réponse : chrono + réponse programmée du bot.
  const startAnswering = useCallback(() => {
    const q = questions[indexRef.current];
    setPhase('playing');
    startRef.current = Date.now();

    const decision = decideBotAnswer(q, DEFAULT_BOT);
    botTimerRef.current = setTimeout(() => {
      botAnsRef.current = { decision, timeMs: decision.reactionMs };
      if (youAnsRef.current) resolveRound();
    }, decision.reactionMs);

    tickRef.current = setInterval(() => {
      const left = Math.max(0, QUESTION_TIME_MS - (Date.now() - startRef.current));
      setTimeLeftMs(left);
      if (left <= 0) resolveRound();
    }, 100);
  }, [questions, resolveRound]);

  // Démarre une question : balayage du thème → lecture → réponses.
  const beginQuestion = useCallback(
    (qIndex: number) => {
      clearTimers();
      indexRef.current = qIndex;
      setIndex(qIndex);
      resolvedRef.current = false;
      youAnsRef.current = null;
      botAnsRef.current = null;
      setSelectedIndex(null);
      setOutcome(null);
      setTimeLeftMs(QUESTION_TIME_MS);
      setPhase('themeIntro');

      themeTimerRef.current = setTimeout(() => {
        setPhase('reading');
        readingTimerRef.current = setTimeout(startAnswering, READING_TIME_MS);
      }, THEME_INTRO_MS);
    },
    [clearTimers, startAnswering]
  );

  // (Re)démarre la partie à chaque nouveau jeu de questions (mont + rejouer).
  useEffect(() => {
    beginQuestion(0);
    return () => clearTimers();
  }, [beginQuestion, clearTimers]);

  // Auto-avance après la révélation (écrans synchronisés, pas de bouton).
  useEffect(() => {
    if (phase !== 'reveal') return;
    const t = setTimeout(() => {
      const next = indexRef.current + 1;
      if (next >= questions.length) setPhase('done');
      else beginQuestion(next);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [phase, questions, beginQuestion]);

  const onSelect = useCallback(
    (i: number) => {
      if (phase !== 'playing' || youAnsRef.current) return;
      const timeMs = Date.now() - startRef.current;
      youAnsRef.current = { index: i, timeMs };
      setSelectedIndex(i);
      if (botAnsRef.current) resolveRound();
    },
    [phase, resolveRound]
  );

  const onRestart = useCallback(() => {
    clearTimers();
    youRef.current = freshSide();
    botRef.current = freshSide();
    indexRef.current = 0;
    resolvedRef.current = false;
    youAnsRef.current = null;
    botAnsRef.current = null;
    setYou(freshSide());
    setBot(freshSide());
    // Nouveau jeu de questions → l'effet ci-dessus relance beginQuestion(0).
    setQuestions(pickQuestions(totalQuestions, categoryIds));
  }, [totalQuestions, categoryIds, clearTimers]);

  return {
    phase,
    question: questions[index],
    questionNumber: index + 1,
    totalQuestions: questions.length,
    timeLeftMs,
    selectedIndex,
    outcome,
    you,
    bot,
    onSelect,
    onRestart,
  };
}
