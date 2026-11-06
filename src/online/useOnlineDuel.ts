import { useCallback, useEffect, useState } from 'react';
import { computePoints, QUESTION_TIME_MS, AUTO_ADVANCE_MS } from '../game/scoring';
import { Match, submitAnswer, hostAdvance } from './match';

export type OnlinePhase = 'playing' | 'reveal';

interface Scores {
  myScore: number;
  oppScore: number;
  myStreak: number;
  oppStreak: number;
}

/** Calcule les scores de façon déterministe à partir des réponses (identique
 *  des 2 côtés). `upto` = dernier index inclus dans le calcul. */
function computeScores(match: Match, myUid: string, oppUid: string, upto: number): Scores {
  let myScore = 0;
  let oppScore = 0;
  let myStreak = 0;
  let oppStreak = 0;
  const lastQ = match.questions.length - 1;
  for (let i = 0; i <= upto; i++) {
    const q = match.questions[i];
    if (!q) break;
    const ma = match.answers?.[myUid]?.[String(i)];
    const oa = match.answers?.[oppUid]?.[String(i)];
    const mr = computePoints({ correct: !!ma && ma.i === q.correctIndex, timeMs: ma ? ma.t : QUESTION_TIME_MS, currentStreak: myStreak });
    const or = computePoints({ correct: !!oa && oa.i === q.correctIndex, timeMs: oa ? oa.t : QUESTION_TIME_MS, currentStreak: oppStreak });
    const mult = i === lastQ ? 2 : 1; // dernière question : points doublés
    myScore += mr.points * mult;
    myStreak = mr.newStreak;
    oppScore += or.points * mult;
    oppStreak = or.newStreak;
  }
  return { myScore, oppScore, myStreak, oppStreak };
}

/** Scores finaux (toutes les questions). */
export function finalScores(match: Match, myUid: string): Scores {
  const oppUid = match.playerIds.find((u) => u !== myUid) as string;
  return computeScores(match, myUid, oppUid, match.questions.length - 1);
}

/** Moteur d'un duel en ligne synchronisé via le document de partie. */
export function useOnlineDuel(matchId: string, match: Match, myUid: string) {
  const oppUid = match.playerIds.find((u) => u !== myUid) as string;
  const idx = match.currentIndex;
  const q = match.questions[idx];
  const total = match.questions.length;
  const isLast = idx === total - 1;
  const isHost = match.host === myUid;
  const startedAt = match.questionStartedAt ?? 0;

  const myAns = match.answers?.[myUid]?.[String(idx)];
  const oppAns = match.answers?.[oppUid]?.[String(idx)];

  const [timeLeftMs, setTimeLeftMs] = useState(QUESTION_TIME_MS);
  const [localSel, setLocalSel] = useState<number | null>(null);

  // Nouvelle question → réinitialise l'état local.
  useEffect(() => {
    setLocalSel(null);
    setTimeLeftMs(QUESTION_TIME_MS);
  }, [idx]);

  // Chrono local, calé sur questionStartedAt (posé par l'hôte).
  useEffect(() => {
    if (!startedAt) return;
    const tick = () => setTimeLeftMs(Math.max(0, QUESTION_TIME_MS - (Date.now() - startedAt)));
    tick();
    const t = setInterval(tick, 100);
    return () => clearInterval(t);
  }, [startedAt, idx]);

  const bothAnswered = !!myAns && !!oppAns;
  const resolved = bothAnswered || timeLeftMs <= 0;
  const phase: OnlinePhase = resolved ? 'reveal' : 'playing';

  const onSelect = useCallback(
    (i: number) => {
      if (resolved || myAns || localSel != null) return;
      const t = Math.min(QUESTION_TIME_MS, Date.now() - startedAt);
      setLocalSel(i);
      submitAnswer(matchId, myUid, idx, i, t);
    },
    [resolved, myAns, localSel, startedAt, idx, matchId, myUid],
  );

  // L'hôte fait avancer la partie après un court délai de révélation.
  useEffect(() => {
    if (!isHost || !resolved) return;
    const t = setTimeout(() => hostAdvance(matchId, idx + 1, isLast), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [isHost, resolved, isLast, idx, matchId]);

  const scores = computeScores(match, myUid, oppUid, phase === 'reveal' ? idx : idx - 1);

  return {
    phase,
    question: q,
    questionNumber: idx + 1,
    totalQuestions: total,
    isLast,
    timeLeftMs,
    correctIndex: q ? q.correctIndex : -1,
    mySelected: myAns ? myAns.i : localSel,
    oppSelected: phase === 'reveal' && oppAns ? oppAns.i : null,
    oppUid,
    onSelect,
    ...scores,
  };
}
