// ───────────────────────────────────────────────────────────
// Règles de scoring (style QuizUp)
// - Réponse juste  -> points de base + bonus de vitesse
// - Plus tu réponds vite, plus le bonus est grand (donc le 1er
//   à cliquer marque plus que le 2nd)
// - Série de bonnes réponses -> multiplicateur croissant
// - Réponse fausse ou temps écoulé -> 0 point, série remise à 0
// ───────────────────────────────────────────────────────────

export const QUESTION_TIME_MS = 10_000; // temps max par question
export const BASE_POINTS = 20; // points garantis si la réponse est juste
export const MAX_SPEED_BONUS = 80; // bonus max pour une réponse instantanée
export const READING_TIME_MS = 1500; // délai de lecture de la question avant l'affichage des réponses

/**
 * Multiplicateur de série. `streakAfter` = nombre de bonnes réponses
 * consécutives EN INCLUANT la réponse en cours.
 */
export function streakMultiplier(streakAfter: number): number {
  if (streakAfter >= 5) return 2.0;
  if (streakAfter === 4) return 1.8;
  if (streakAfter === 3) return 1.5;
  if (streakAfter === 2) return 1.2;
  return 1.0;
}

/**
 * Calcule les points gagnés sur une question et la nouvelle série.
 * @param correct     la réponse est-elle juste ?
 * @param timeMs      temps mis pour répondre (ms)
 * @param currentStreak série AVANT cette réponse
 */
export function computePoints(args: {
  correct: boolean;
  timeMs: number;
  currentStreak: number;
}): { points: number; newStreak: number; multiplier: number } {
  if (!args.correct) {
    return { points: 0, newStreak: 0, multiplier: 1 };
  }
  const remaining = Math.max(0, QUESTION_TIME_MS - args.timeMs);
  const speedFraction = remaining / QUESTION_TIME_MS; // 0..1
  const base = BASE_POINTS + Math.round(MAX_SPEED_BONUS * speedFraction);
  const newStreak = args.currentStreak + 1;
  const multiplier = streakMultiplier(newStreak);
  const points = Math.round(base * multiplier);
  return { points, newStreak, multiplier };
}
