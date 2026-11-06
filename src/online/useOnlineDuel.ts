import { useCallback, useEffect, useRef, useState } from 'react';
import { computePoints, QUESTION_TIME_MS, AUTO_ADVANCE_MS, THEME_INTRO_MS, READING_TIME_MS } from '../game/scoring';
import { Match, submitAnswer, hostAdvance } from './match';

const COUNTDOWN_MS = 2800; // 3-2-1-GO avant la 1re question

export type OnlinePhase = 'countdown' | 'themeIntro' | 'reading' | 'playing' | 'reveal';

interface Scores {
  myScore: number;
  oppScore: number;
  myStreak: number;
  oppStreak: number;
}

/** Scores déterministes à partir des réponses (identiques des 2 côtés). */
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
    const mult = i === lastQ ? 2 : 1;
    myScore += mr.points * mult;
    myStreak = mr.newStreak;
    oppScore += or.points * mult;
    oppStreak = or.newStreak;
  }
  return { myScore, oppScore, myStreak, oppStreak };
}

export function finalScores(match: Match, myUid: string): Scores {
  const oppUid = match.playerIds.find((u) => u !== myUid) as string;
  return computeScores(match, myUid, oppUid, match.questions.length - 1);
}

/**
 * Moteur d'un duel en ligne. Le timing (compte à rebours, séquence, chrono)
 * est 100% LOCAL — démarré quand CE client affiche la question — pour éviter
 * tout décalage d'horloge entre les 2 appareils. L'hôte fait avancer la partie.
 */
export function useOnlineDuel(matchId: string, match: Match, myUid: string) {
  const oppUid = match.playerIds.find((u) => u !== myUid) as string;
  const idx = match.currentIndex;
  const q = match.questions[idx];
  const total = match.questions.length;
  const isLast = idx === total - 1;
  const isHost = match.host === myUid;

  const myAns = match.answers?.[myUid]?.[String(idx)];
  const oppAns = match.answers?.[oppUid]?.[String(idx)];

  const startRef = useRef(Date.now());
  const [nowMs, setNowMs] = useState(Date.now());
  const [localSel, setLocalSel] = useState<number | null>(null);

  // Nouvelle question → on redémarre l'horloge locale.
  useEffect(() => {
    startRef.current = Date.now();
    setLocalSel(null);
    setNowMs(Date.now());
  }, [idx]);

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 100);
    return () => clearInterval(t);
  }, [idx]);

  const elapsed = nowMs - startRef.current;
  const offset = idx === 0 ? COUNTDOWN_MS : 0; // compte à rebours seulement au début
  const themeEnd = offset + THEME_INTRO_MS;
  const readingEnd = themeEnd + READING_TIME_MS;
  const answeringElapsed = Math.max(0, elapsed - readingEnd);
  const answeringTimedOut = elapsed >= readingEnd && answeringElapsed >= QUESTION_TIME_MS;
  const bothAnswered = !!myAns && !!oppAns;
  const resolved = bothAnswered || answeringTimedOut;

  let phase: OnlinePhase;
  if (resolved) phase = 'reveal';
  else if (elapsed < offset) phase = 'countdown';
  else if (elapsed < themeEnd) phase = 'themeIntro';
  else if (elapsed < readingEnd) phase = 'reading';
  else phase = 'playing';

  const countdownValue = Math.max(0, 3 - Math.floor(elapsed / 700));
  const timeLeftMs = Math.max(0, QUESTION_TIME_MS - answeringElapsed);

  const onSelect = useCallback(
    (i: number) => {
      if (phase !== 'playing' || myAns || localSel != null) return;
      const t = Math.min(QUESTION_TIME_MS, answeringElapsed);
      setLocalSel(i);
      submitAnswer(matchId, myUid, idx, i, t);
    },
    [phase, myAns, localSel, answeringElapsed, matchId, myUid, idx],
  );

  // L'hôte fait avancer après un court délai de révélation.
  useEffect(() => {
    if (!isHost || !resolved) return;
    const t = setTimeout(() => hostAdvance(matchId, idx + 1, isLast), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [isHost, resolved, isLast, idx, matchId]);

  const scores = computeScores(match, myUid, oppUid, phase === 'reveal' ? idx : idx - 1);

  return {
    phase,
    countdownValue,
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
