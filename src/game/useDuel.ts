import { useCallback, useEffect, useRef, useState } from 'react';
import { Question, RoundOutcome, Side } from './types';
import { pickQuestions } from './questions';
import { computePoints, QUESTION_TIME_MS } from './scoring';
import { decideBotAnswer, BotDecision, DEFAULT_BOT } from './bot';

export type Phase = 'intro' | 'playing' | 'reveal' | 'done';

const freshSide = (): Side => ({ score: 0, streak: 0, bestStreak: 0 });

/**
 * Machine à états d'un duel contre le bot.
 * Gère : compte à rebours d'intro, chrono par question, réponse du
 * joueur, réponse programmée du bot, résolution de la manche et score.
 */
export function useDuel(totalQuestions = 7) {
  const [questions, setQuestions] = useState<Question[]>(() => pickQuestions(totalQuestions));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [countdown, setCountdown] = useState(3);
  const [timeLeftMs, setTimeLeftMs] = useState(QUESTION_TIME_MS);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<RoundOutcome | null>(null);
  const [you, setYou] = useState<Side>(freshSide);
  const [bot, setBot] = useState<Side>(freshSide);

  // Sources de vérité synchrones (évitent les closures périmées dans les timers)
  const indexRef = useRef(0);
  const youRef = useRef<Side>(freshSide());
  const botRef = useRef<Side>(freshSide());
  const startRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const youAnsRef = useRef<{ index: number; timeMs: number } | null>(null);
  const botAnsRef = useRef<{ decision: BotDecision; timeMs: number } | null>(null);
  const resolvedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    tickRef.current = null;
    botTimerRef.current = null;
  }, []);

  // Résout la manche (une seule fois) : calcule les points des deux camps.
  const resolveRound = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    clearTimers();

    const q = questions[indexRef.current];
    const ya = youAnsRef.current;
    const ba = botAnsRef.current;

    const youCorrect = !!ya && ya.index === q.correctIndex;
    const botCorrect = !!ba && ba.decision.correct;

    const yr = computePoints({
      correct: youCorrect,
      timeMs: ya ? ya.timeMs : QUESTION_TIME_MS,
      currentStreak: youRef.current.streak,
    });
    const br = computePoints({
      correct: botCorrect,
      timeMs: ba ? ba.timeMs : QUESTION_TIME_MS,
      currentStreak: botRef.current.streak,
    });

    youRef.current = {
      score: youRef.current.score + yr.points,
      streak: yr.newStreak,
      bestStreak: Math.max(youRef.current.bestStreak, yr.newStreak),
    };
    botRef.current = {
      score: botRef.current.score + br.points,
      streak: br.newStreak,
      bestStreak: Math.max(botRef.current.bestStreak, br.newStreak),
    };

    setYou({ ...youRef.current });
    setBot({ ...botRef.current });
    setOutcome({
      correctIndex: q.correctIndex,
      you: { answerIndex: ya ? ya.index : null, correct: youCorrect, points: yr.points, timeMs: ya ? ya.timeMs : null },
      bot: { answerIndex: ba ? ba.decision.answerIndex : null, correct: botCorrect, points: br.points, timeMs: ba ? ba.timeMs : null },
    });
    setPhase('reveal');
  }, [questions, clearTimers]);

  // Démarre une question donnée : chrono + réponse programmée du bot.
  const beginQuestion = useCallback(
    (qIndex: number) => {
      const q = questions[qIndex];
      resolvedRef.current = false;
      youAnsRef.current = null;
      botAnsRef.current = null;
      setSelectedIndex(null);
      setOutcome(null);
      setTimeLeftMs(QUESTION_TIME_MS);
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
    },
    [questions, resolveRound]
  );

  // Compte à rebours d'intro (3, 2, 1, GO) puis lance la 1re question.
  useEffect(() => {
    if (phase !== 'intro') return;
    if (countdown <= 0) {
      beginQuestion(indexRef.current);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 750);
    return () => clearTimeout(t);
  }, [phase, countdown, beginQuestion]);

  // Nettoyage si le composant est démonté.
  useEffect(() => clearTimers, [clearTimers]);

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

  const onNext = useCallback(() => {
    const next = indexRef.current + 1;
    if (next >= questions.length) {
      setPhase('done');
      return;
    }
    indexRef.current = next;
    setIndex(next);
    beginQuestion(next);
  }, [questions, beginQuestion]);

  const onRestart = useCallback(() => {
    clearTimers();
    setQuestions(pickQuestions(totalQuestions));
    indexRef.current = 0;
    youRef.current = freshSide();
    botRef.current = freshSide();
    youAnsRef.current = null;
    botAnsRef.current = null;
    resolvedRef.current = false;
    setIndex(0);
    setYou(freshSide());
    setBot(freshSide());
    setSelectedIndex(null);
    setOutcome(null);
    setTimeLeftMs(QUESTION_TIME_MS);
    setCountdown(3);
    setPhase('intro');
  }, [totalQuestions, clearTimers]);

  return {
    phase,
    countdown,
    question: questions[index],
    questionNumber: index + 1,
    totalQuestions: questions.length,
    timeLeftMs,
    selectedIndex,
    outcome,
    you,
    bot,
    onSelect,
    onNext,
    onRestart,
  };
}
