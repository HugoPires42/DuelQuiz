import { Question } from './types';

// Banque de questions (FR). Organisée par thème (categoryId).
// À terme : déplacée côté serveur / Firebase.
export const QUESTIONS: Question[] = [
  // ───────── Géographie ─────────
  { id: 'g1', categoryId: 'geo', prompt: "Quelle est la capitale de l'Australie ?", options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctIndex: 2 },
  { id: 'g2', categoryId: 'geo', prompt: 'Quel est le plus grand océan du monde ?', options: ['Atlantique', 'Indien', 'Arctique', 'Pacifique'], correctIndex: 3 },
  { id: 'g3', categoryId: 'geo', prompt: 'Combien y a-t-il de continents ?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 'g4', categoryId: 'geo', prompt: "Quelle est la capitale de l'Italie ?", options: ['Milan', 'Rome', 'Naples', 'Turin'], correctIndex: 1 },
  { id: 'g5', categoryId: 'geo', prompt: 'Dans quel pays se trouve la tour Eiffel ?', options: ['Italie', 'Espagne', 'France', 'Belgique'], correctIndex: 2 },
  { id: 'g6', categoryId: 'geo', prompt: 'Quelle est la capitale du Canada ?', options: ['Toronto', 'Montréal', 'Vancouver', 'Ottawa'], correctIndex: 3 },
  { id: 'g7', categoryId: 'geo', prompt: 'Quel est le plus grand désert chaud du monde ?', options: ['Gobi', 'Sahara', 'Kalahari', 'Atacama'], correctIndex: 1 },
  { id: 'g8', categoryId: 'geo', prompt: 'Dans quel pays se trouve le Machu Picchu ?', options: ['Chili', 'Pérou', 'Bolivie', 'Mexique'], correctIndex: 1 },
  { id: 'g9', categoryId: 'geo', prompt: 'Quel fleuve traverse Paris ?', options: ['La Loire', 'Le Rhône', 'La Seine', 'La Garonne'], correctIndex: 2 },

  // ───────── Histoire ─────────
  { id: 'h1', categoryId: 'hist', prompt: 'En quelle année a eu lieu la Révolution française ?', options: ['1789', '1815', '1776', '1848'], correctIndex: 0 },
  { id: 'h2', categoryId: 'hist', prompt: "En quelle année l'homme a-t-il marché sur la Lune ?", options: ['1965', '1969', '1972', '1958'], correctIndex: 1 },
  { id: 'h3', categoryId: 'hist', prompt: 'Quel général a été couronné empereur des Français en 1804 ?', options: ['Louis XIV', 'Napoléon', 'Charlemagne', 'De Gaulle'], correctIndex: 1 },
  { id: 'h4', categoryId: 'hist', prompt: 'En quelle année est tombé le mur de Berlin ?', options: ['1979', '1985', '1989', '1991'], correctIndex: 2 },
  { id: 'h5', categoryId: 'hist', prompt: "Qui a atteint l'Amérique en 1492 ?", options: ['Magellan', 'Christophe Colomb', 'Vasco de Gama', 'James Cook'], correctIndex: 1 },
  { id: 'h6', categoryId: 'hist', prompt: 'En quelle année a débuté la Première Guerre mondiale ?', options: ['1912', '1914', '1918', '1939'], correctIndex: 1 },
  { id: 'h7', categoryId: 'hist', prompt: 'Quelle civilisation a construit les pyramides de Gizeh ?', options: ['Romains', 'Grecs', 'Égyptiens', 'Mayas'], correctIndex: 2 },
  { id: 'h8', categoryId: 'hist', prompt: 'En quelle année a coulé le Titanic ?', options: ['1905', '1912', '1920', '1898'], correctIndex: 1 },

  // ───────── Sciences ─────────
  { id: 's1', categoryId: 'sci', prompt: 'Quelle planète est la plus proche du Soleil ?', options: ['Vénus', 'Mars', 'Mercure', 'Terre'], correctIndex: 2 },
  { id: 's2', categoryId: 'sci', prompt: 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?', options: ['Oxygène', 'Dioxyde de carbone', 'Azote', 'Hydrogène'], correctIndex: 1 },
  { id: 's3', categoryId: 'sci', prompt: "Quel est le symbole chimique de l'or ?", options: ['Ag', 'Au', 'Fe', 'Or'], correctIndex: 1 },
  { id: 's4', categoryId: 'sci', prompt: 'Quel organe pompe le sang dans le corps ?', options: ['Foie', 'Cœur', 'Poumon', 'Rein'], correctIndex: 1 },
  { id: 's5', categoryId: 'sci', prompt: "Combien d'os compte le corps humain adulte ?", options: ['186', '206', '226', '250'], correctIndex: 1 },
  { id: 's6', categoryId: 'sci', prompt: 'Quelle est la planète la plus grande du système solaire ?', options: ['Saturne', 'Jupiter', 'Neptune', 'Terre'], correctIndex: 1 },
  { id: 's7', categoryId: 'sci', prompt: "À quelle température l'eau bout-elle (au niveau de la mer) ?", options: ['50 °C', '80 °C', '100 °C', '120 °C'], correctIndex: 2 },
  { id: 's8', categoryId: 'sci', prompt: "Quel est l'élément le plus abondant dans l'univers ?", options: ['Oxygène', 'Hélium', 'Hydrogène', 'Carbone'], correctIndex: 2 },
  { id: 's9', categoryId: 'sci', prompt: 'Combien de pattes a une araignée ?', options: ['6', '8', '10', '12'], correctIndex: 1 },

  // ───────── Sport ─────────
  { id: 'sp1', categoryId: 'sport', prompt: 'Combien de joueurs composent une équipe de football sur le terrain ?', options: ['9', '10', '11', '12'], correctIndex: 2 },
  { id: 'sp2', categoryId: 'sport', prompt: "Tous les combien d'années a lieu la Coupe du monde de football ?", options: ['2 ans', '3 ans', '4 ans', '5 ans'], correctIndex: 2 },
  { id: 'sp3', categoryId: 'sport', prompt: 'Dans quel sport réalise-t-on un « strike » ?', options: ['Tennis', 'Bowling', 'Golf', 'Boxe'], correctIndex: 1 },
  { id: 'sp4', categoryId: 'sport', prompt: "Combien de joueurs par équipe sur un terrain de basket ?", options: ['5', '6', '7', '11'], correctIndex: 0 },
  { id: 'sp5', categoryId: 'sport', prompt: 'Dans quel pays le judo a-t-il été créé ?', options: ['Chine', 'Corée', 'Japon', 'Thaïlande'], correctIndex: 2 },
  { id: 'sp6', categoryId: 'sport', prompt: 'Le Tour de France est une course de quel sport ?', options: ['Course à pied', 'Cyclisme', 'Moto', 'Automobile'], correctIndex: 1 },
  { id: 'sp7', categoryId: 'sport', prompt: 'Combien de trous compte un parcours de golf standard ?', options: ['9', '12', '18', '24'], correctIndex: 2 },
  { id: 'sp8', categoryId: 'sport', prompt: 'Combien de points vaut un essai au rugby à XV ?', options: ['3', '5', '6', '7'], correctIndex: 1 },

  // ───────── Arts & Culture ─────────
  { id: 'a1', categoryId: 'arts', prompt: 'Qui a peint la Joconde ?', options: ['Van Gogh', 'Léonard de Vinci', 'Picasso', 'Monet'], correctIndex: 1 },
  { id: 'a2', categoryId: 'arts', prompt: "Qui a écrit « Les Misérables » ?", options: ['Victor Hugo', 'Émile Zola', 'Molière', 'Voltaire'], correctIndex: 0 },
  { id: 'a3', categoryId: 'arts', prompt: 'Combien de cordes a une guitare classique ?', options: ['4', '5', '6', '7'], correctIndex: 2 },
  { id: 'a4', categoryId: 'arts', prompt: "Quel peintre s'est coupé une partie de l'oreille ?", options: ['Monet', 'Dalí', 'Van Gogh', 'Picasso'], correctIndex: 2 },
  { id: 'a5', categoryId: 'arts', prompt: "Qui a écrit « Roméo et Juliette » ?", options: ['Molière', 'Shakespeare', 'Victor Hugo', 'Dante'], correctIndex: 1 },
  { id: 'a6', categoryId: 'arts', prompt: 'Quel instrument possède des touches noires et blanches ?', options: ['Violon', 'Piano', 'Flûte', 'Harpe'], correctIndex: 1 },
  { id: 'a7', categoryId: 'arts', prompt: 'Quel pays a offert la statue de la Liberté aux États-Unis ?', options: ['Angleterre', 'France', 'Italie', 'Espagne'], correctIndex: 1 },
  { id: 'a8', categoryId: 'arts', prompt: "Qui a composé la « 5ᵉ Symphonie » ?", options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'], correctIndex: 2 },

  // ───────── Ciné & Divertissement ─────────
  { id: 'e1', categoryId: 'ent', prompt: 'Dans quelle saga entend-on « Je suis ton père » ?', options: ['Star Wars', 'Harry Potter', 'Matrix', 'Avatar'], correctIndex: 0 },
  { id: 'e2', categoryId: 'ent', prompt: 'Quel studio a créé Mickey Mouse ?', options: ['Pixar', 'Disney', 'Warner', 'DreamWorks'], correctIndex: 1 },
  { id: 'e3', categoryId: 'ent', prompt: "Combien de films composent la trilogie du « Seigneur des Anneaux » ?", options: ['2', '3', '4', '5'], correctIndex: 1 },
  { id: 'e4', categoryId: 'ent', prompt: "Quel super-héros est surnommé « l'homme-araignée » ?", options: ['Batman', 'Spider-Man', 'Iron Man', 'Hulk'], correctIndex: 1 },
  { id: 'e5', categoryId: 'ent', prompt: "Comment s'appelle l'héroïne du film « Titanic » ?", options: ['Rose', 'Daisy', 'Kate', 'Lily'], correctIndex: 0 },
  { id: 'e6', categoryId: 'ent', prompt: 'À quelle maison appartient Harry Potter ?', options: ['Serpentard', 'Gryffondor', 'Serdaigle', 'Poufsouffle'], correctIndex: 1 },
  { id: 'e7', categoryId: 'ent', prompt: 'Quel animal est Simba dans « Le Roi Lion » ?', options: ['Tigre', 'Lion', 'Guépard', 'Léopard'], correctIndex: 1 },
  { id: 'e8', categoryId: 'ent', prompt: "Qui a écrit « Le Petit Prince » ?", options: ['Jules Verne', 'Saint-Exupéry', 'Albert Camus', 'Marcel Pagnol'], correctIndex: 1 },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Tire n questions au hasard, sans répétition.
 * @param categoryIds  thèmes à inclure. `undefined` ou vide = tous les thèmes.
 *                     Avec plusieurs thèmes, le tirage est équilibré entre eux
 *                     (on pioche à tour de rôle dans chaque thème).
 */
export function pickQuestions(n: number, categoryIds?: string[]): Question[] {
  // Tous les thèmes (ou aucun filtre) : simple tirage aléatoire.
  if (!categoryIds || categoryIds.length === 0) {
    return shuffle(QUESTIONS).slice(0, Math.min(n, QUESTIONS.length));
  }

  // Un seul thème.
  if (categoryIds.length === 1) {
    const pool = QUESTIONS.filter((q) => q.categoryId === categoryIds[0]);
    return shuffle(pool).slice(0, Math.min(n, pool.length));
  }

  // Plusieurs thèmes : mix équilibré (round-robin entre les thèmes).
  const buckets = categoryIds.map((id) => shuffle(QUESTIONS.filter((q) => q.categoryId === id)));
  const result: Question[] = [];
  let i = 0;
  while (result.length < n && buckets.some((b) => b.length > 0)) {
    const next = buckets[i % buckets.length].shift();
    if (next) result.push(next);
    i++;
  }
  // Re-mélange pour éviter une alternance stricte thème A / thème B.
  return shuffle(result).slice(0, n);
}
