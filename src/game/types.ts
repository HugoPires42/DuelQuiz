export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Question {
  id: string;
  categoryId: string; // référence à Category.id
  prompt: string;
  options: string[]; // 4 propositions
  correctIndex: number; // index de la bonne réponse (0..3)
}

export interface Side {
  score: number;
  streak: number; // série de bonnes réponses en cours
  bestStreak: number; // meilleure série de la partie
}

/** Détail d'une manche, pour l'affichage du résultat de la question. */
export interface RoundOutcome {
  correctIndex: number;
  you: AnswerInfo;
  bot: AnswerInfo;
}

export interface AnswerInfo {
  answerIndex: number | null; // null = pas répondu (timeout)
  correct: boolean;
  points: number;
  timeMs: number | null; // temps mis pour répondre
}
