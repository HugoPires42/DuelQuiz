import { Question } from './types';

// Banque de questions de départ (FR, culture générale).
// À terme : déplacée côté serveur / Firebase, par catégories.
export const QUESTIONS: Question[] = [
  { id: 'q1', category: 'Géographie', prompt: "Quelle est la capitale de l'Australie ?", options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctIndex: 2 },
  { id: 'q2', category: 'Maths', prompt: 'Combien de côtés a un hexagone ?', options: ['5', '6', '7', '8'], correctIndex: 1 },
  { id: 'q3', category: 'Art', prompt: 'Qui a peint la Joconde ?', options: ['Van Gogh', 'Léonard de Vinci', 'Picasso', 'Monet'], correctIndex: 1 },
  { id: 'q4', category: 'Sciences', prompt: 'Quelle planète est la plus proche du Soleil ?', options: ['Vénus', 'Mars', 'Mercure', 'Terre'], correctIndex: 2 },
  { id: 'q5', category: 'Histoire', prompt: 'En quelle année a eu lieu la Révolution française ?', options: ['1789', '1815', '1776', '1848'], correctIndex: 0 },
  { id: 'q6', category: 'Géographie', prompt: 'Quel est le plus grand océan du monde ?', options: ['Atlantique', 'Indien', 'Arctique', 'Pacifique'], correctIndex: 3 },
  { id: 'q7', category: 'Sport', prompt: "Combien de joueurs composent une équipe de football sur le terrain ?", options: ['9', '10', '11', '12'], correctIndex: 2 },
  { id: 'q8', category: 'Sciences', prompt: 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?', options: ['Oxygène', 'Dioxyde de carbone', 'Azote', 'Hydrogène'], correctIndex: 1 },
  { id: 'q9', category: 'Culture', prompt: 'Quelle langue compte le plus de locuteurs natifs ?', options: ['Anglais', 'Espagnol', 'Mandarin', 'Hindi'], correctIndex: 2 },
  { id: 'q10', category: 'Littérature', prompt: "Qui a écrit « Les Misérables » ?", options: ['Victor Hugo', 'Émile Zola', 'Molière', 'Voltaire'], correctIndex: 0 },
  { id: 'q11', category: 'Sciences', prompt: "Quel est le symbole chimique de l'or ?", options: ['Ag', 'Au', 'Fe', 'Or'], correctIndex: 1 },
  { id: 'q12', category: 'Géographie', prompt: 'Combien y a-t-il de continents ?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 'q13', category: 'Nature', prompt: 'Quel est le plus grand animal du monde ?', options: ['Éléphant', 'Baleine bleue', 'Girafe', 'Requin blanc'], correctIndex: 1 },
  { id: 'q14', category: 'Géographie', prompt: 'Dans quel pays se trouve la tour Eiffel ?', options: ['Italie', 'Espagne', 'France', 'Belgique'], correctIndex: 2 },
  { id: 'q15', category: 'Maths', prompt: 'Combien font 7 × 8 ?', options: ['54', '56', '63', '48'], correctIndex: 1 },
  { id: 'q16', category: 'Culture', prompt: 'Quelle est la monnaie du Japon ?', options: ['Yuan', 'Won', 'Yen', 'Ringgit'], correctIndex: 2 },
  { id: 'q17', category: 'Sciences', prompt: 'Quel organe pompe le sang dans le corps ?', options: ['Foie', 'Cœur', 'Poumon', 'Rein'], correctIndex: 1 },
  { id: 'q18', category: 'Histoire', prompt: "En quelle année l'homme a-t-il marché sur la Lune ?", options: ['1965', '1969', '1972', '1958'], correctIndex: 1 },
  { id: 'q19', category: 'Géographie', prompt: "Quelle est la capitale de l'Italie ?", options: ['Milan', 'Rome', 'Naples', 'Turin'], correctIndex: 1 },
  { id: 'q20', category: 'Maths', prompt: 'Combien de minutes dans une heure ?', options: ['30', '45', '60', '90'], correctIndex: 2 },
];

/** Tire n questions au hasard, sans répétition. */
export function pickQuestions(n: number): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}
