import { QUESTION_TIME_MS } from './scoring';

export interface BotProfile {
  name: string;
  accuracy: number; // probabilité de répondre juste (0..1)
  minReactionMs: number;
  maxReactionMs: number;
}

export const DEFAULT_BOT: BotProfile = {
  name: 'Robo',
  accuracy: 0.72,
  minReactionMs: 1200,
  maxReactionMs: 6500,
};

export interface BotDecision {
  answerIndex: number;
  reactionMs: number; // quand le bot "clique"
  correct: boolean;
}

/**
 * Simule la réponse du bot : il répond juste avec une probabilité
 * `accuracy`, et son temps de réaction est tiré aléatoirement dans
 * sa fourchette (plafonné au temps de la question).
 */
export function decideBotAnswer(
  question: { options: string[]; correctIndex: number },
  profile: BotProfile = DEFAULT_BOT
): BotDecision {
  const correct = Math.random() < profile.accuracy;

  let answerIndex: number;
  if (correct) {
    answerIndex = question.correctIndex;
  } else {
    const wrongChoices = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.correctIndex);
    answerIndex = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
  }

  const span = profile.maxReactionMs - profile.minReactionMs;
  const reactionMs = Math.min(
    QUESTION_TIME_MS - 100,
    Math.round(profile.minReactionMs + Math.random() * span)
  );

  return { answerIndex, reactionMs, correct };
}
