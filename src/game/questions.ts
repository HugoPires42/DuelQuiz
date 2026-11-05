import { Question } from './types';

// Banque de questions (FR), par thème et par difficulté (1 facile → 5 difficile).
// À terme : déplacée côté serveur / Firebase.
export const QUESTIONS: Question[] = [
  // ─────────────────────────── Géographie ───────────────────────────
  { id: 'g1', categoryId: 'geo', difficulty: 1, prompt: 'Quelle est la capitale de la France ?', options: ['Paris', 'Lyon', 'Marseille', 'Nice'], correctIndex: 0 },
  { id: 'g2', categoryId: 'geo', difficulty: 1, prompt: 'Dans quel pays se trouve la tour Eiffel ?', options: ['Italie', 'France', 'Espagne', 'Belgique'], correctIndex: 1 },
  { id: 'g3', categoryId: 'geo', difficulty: 2, prompt: "Quelle est la capitale de l'Italie ?", options: ['Milan', 'Rome', 'Naples', 'Turin'], correctIndex: 1 },
  { id: 'g4', categoryId: 'geo', difficulty: 2, prompt: 'Quel est le plus grand océan du monde ?', options: ['Atlantique', 'Pacifique', 'Indien', 'Arctique'], correctIndex: 1 },
  { id: 'g5', categoryId: 'geo', difficulty: 2, prompt: 'Combien y a-t-il de continents ?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 'g6', categoryId: 'geo', difficulty: 3, prompt: "Quelle est la capitale de l'Australie ?", options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'], correctIndex: 1 },
  { id: 'g7', categoryId: 'geo', difficulty: 3, prompt: 'Quel est le plus grand désert chaud du monde ?', options: ['Gobi', 'Sahara', 'Kalahari', 'Atacama'], correctIndex: 1 },
  { id: 'g8', categoryId: 'geo', difficulty: 3, prompt: 'Quelle est la capitale du Canada ?', options: ['Toronto', 'Ottawa', 'Montréal', 'Vancouver'], correctIndex: 1 },
  { id: 'g9', categoryId: 'geo', difficulty: 4, prompt: 'Dans quel pays se trouve le Machu Picchu ?', options: ['Chili', 'Pérou', 'Bolivie', 'Équateur'], correctIndex: 1 },
  { id: 'g10', categoryId: 'geo', difficulty: 4, prompt: 'Quelle est la capitale de la Nouvelle-Zélande ?', options: ['Auckland', 'Wellington', 'Christchurch', 'Dunedin'], correctIndex: 1 },
  { id: 'g11', categoryId: 'geo', difficulty: 4, prompt: 'Dans quel pays se trouve le mont Kilimandjaro ?', options: ['Kenya', 'Tanzanie', 'Éthiopie', 'Ouganda'], correctIndex: 1 },
  { id: 'g12', categoryId: 'geo', difficulty: 5, prompt: 'Quel est le plus petit pays du monde ?', options: ['Monaco', 'Vatican', 'Nauru', 'Saint-Marin'], correctIndex: 1 },
  { id: 'g13', categoryId: 'geo', difficulty: 5, prompt: 'Quelle est la capitale du Kazakhstan ?', options: ['Almaty', 'Astana', 'Bichkek', 'Tachkent'], correctIndex: 1 },

  // ─────────────────────────── Histoire ───────────────────────────
  { id: 'h1', categoryId: 'hist', difficulty: 1, prompt: 'En quelle année a eu lieu la Révolution française ?', options: ['1789', '1815', '1848', '1914'], correctIndex: 0 },
  { id: 'h2', categoryId: 'hist', difficulty: 1, prompt: 'Quelle civilisation a construit les pyramides de Gizeh ?', options: ['Grecs', 'Égyptiens', 'Romains', 'Perses'], correctIndex: 1 },
  { id: 'h3', categoryId: 'hist', difficulty: 2, prompt: "En quelle année l'homme a-t-il marché sur la Lune ?", options: ['1965', '1969', '1972', '1958'], correctIndex: 1 },
  { id: 'h4', categoryId: 'hist', difficulty: 2, prompt: "Qui a atteint l'Amérique en 1492 ?", options: ['Magellan', 'Christophe Colomb', 'Vasco de Gama', 'James Cook'], correctIndex: 1 },
  { id: 'h5', categoryId: 'hist', difficulty: 2, prompt: 'En quelle année a débuté la Première Guerre mondiale ?', options: ['1912', '1914', '1918', '1939'], correctIndex: 1 },
  { id: 'h6', categoryId: 'hist', difficulty: 3, prompt: 'Quel général est devenu empereur des Français en 1804 ?', options: ['Louis XIV', 'Napoléon', 'Charlemagne', 'De Gaulle'], correctIndex: 1 },
  { id: 'h7', categoryId: 'hist', difficulty: 3, prompt: 'En quelle année est tombé le mur de Berlin ?', options: ['1979', '1989', '1991', '1995'], correctIndex: 1 },
  { id: 'h8', categoryId: 'hist', difficulty: 3, prompt: 'En quelle année a coulé le Titanic ?', options: ['1905', '1912', '1920', '1898'], correctIndex: 1 },
  { id: 'h9', categoryId: 'hist', difficulty: 4, prompt: 'Qui était le premier président des États-Unis ?', options: ['Lincoln', 'Washington', 'Jefferson', 'Adams'], correctIndex: 1 },
  { id: 'h10', categoryId: 'hist', difficulty: 4, prompt: "Quelle reine d'Égypte s'est alliée à Jules César ?", options: ['Néfertiti', 'Cléopâtre', 'Hatchepsout', 'Néfertari'], correctIndex: 1 },
  { id: 'h11', categoryId: 'hist', difficulty: 4, prompt: 'En quelle année a pris fin la Seconde Guerre mondiale ?', options: ['1943', '1945', '1947', '1950'], correctIndex: 1 },
  { id: 'h12', categoryId: 'hist', difficulty: 5, prompt: 'Quel empire était dirigé par Gengis Khan ?', options: ['Ottoman', 'Mongol', 'Perse', 'Romain'], correctIndex: 1 },
  { id: 'h13', categoryId: 'hist', difficulty: 5, prompt: 'En quelle année a été signée la Magna Carta ?', options: ['1066', '1215', '1348', '1492'], correctIndex: 1 },

  // ─────────────────────────── Sciences ───────────────────────────
  { id: 's1', categoryId: 'sci', difficulty: 1, prompt: 'Quelle planète est la plus proche du Soleil ?', options: ['Vénus', 'Mercure', 'Mars', 'Terre'], correctIndex: 1 },
  { id: 's2', categoryId: 'sci', difficulty: 1, prompt: 'Combien de pattes a une araignée ?', options: ['6', '8', '10', '12'], correctIndex: 1 },
  { id: 's3', categoryId: 'sci', difficulty: 2, prompt: 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?', options: ['Oxygène', 'Dioxyde de carbone', 'Azote', 'Hydrogène'], correctIndex: 1 },
  { id: 's4', categoryId: 'sci', difficulty: 2, prompt: 'Quel organe pompe le sang dans le corps ?', options: ['Foie', 'Cœur', 'Poumon', 'Rein'], correctIndex: 1 },
  { id: 's5', categoryId: 'sci', difficulty: 2, prompt: "À quelle température l'eau bout-elle au niveau de la mer ?", options: ['50 °C', '80 °C', '100 °C', '120 °C'], correctIndex: 2 },
  { id: 's6', categoryId: 'sci', difficulty: 3, prompt: "Quel est le symbole chimique de l'or ?", options: ['Ag', 'Au', 'Fe', 'Go'], correctIndex: 1 },
  { id: 's7', categoryId: 'sci', difficulty: 3, prompt: 'Quelle est la plus grande planète du système solaire ?', options: ['Saturne', 'Jupiter', 'Neptune', 'Uranus'], correctIndex: 1 },
  { id: 's8', categoryId: 'sci', difficulty: 3, prompt: "Combien d'os compte le corps humain adulte ?", options: ['186', '206', '226', '250'], correctIndex: 1 },
  { id: 's9', categoryId: 'sci', difficulty: 4, prompt: 'Quel scientifique a formulé la théorie de la relativité ?', options: ['Newton', 'Einstein', 'Bohr', 'Galilée'], correctIndex: 1 },
  { id: 's10', categoryId: 'sci', difficulty: 4, prompt: "Quel gaz compose majoritairement l'atmosphère terrestre ?", options: ['Oxygène', 'Azote', 'Dioxyde de carbone', 'Argon'], correctIndex: 1 },
  { id: 's11', categoryId: 'sci', difficulty: 4, prompt: "Quelle est l'unité de mesure de la force ?", options: ['Watt', 'Newton', 'Joule', 'Pascal'], correctIndex: 1 },
  { id: 's12', categoryId: 'sci', difficulty: 5, prompt: "Quel est l'élément le plus abondant dans l'univers ?", options: ['Oxygène', 'Hélium', 'Hydrogène', 'Carbone'], correctIndex: 2 },
  { id: 's13', categoryId: 'sci', difficulty: 5, prompt: "Combien de chromosomes possède l'être humain ?", options: ['23', '44', '46', '48'], correctIndex: 2 },

  // ─────────────────────────── Sport ───────────────────────────
  { id: 'sp1', categoryId: 'sport', difficulty: 1, prompt: 'Combien de joueurs dans une équipe de football sur le terrain ?', options: ['9', '10', '11', '12'], correctIndex: 2 },
  { id: 'sp2', categoryId: 'sport', difficulty: 1, prompt: 'Dans quel sport réalise-t-on un « strike » ?', options: ['Tennis', 'Bowling', 'Golf', 'Boxe'], correctIndex: 1 },
  { id: 'sp3', categoryId: 'sport', difficulty: 2, prompt: 'Combien de joueurs par équipe sur un terrain de basket ?', options: ['5', '6', '7', '11'], correctIndex: 0 },
  { id: 'sp4', categoryId: 'sport', difficulty: 2, prompt: "Tous les combien d'années a lieu la Coupe du monde de football ?", options: ['2', '3', '4', '5'], correctIndex: 2 },
  { id: 'sp5', categoryId: 'sport', difficulty: 2, prompt: 'Le Tour de France est une course de quel sport ?', options: ['Course à pied', 'Cyclisme', 'Moto', 'Aviron'], correctIndex: 1 },
  { id: 'sp6', categoryId: 'sport', difficulty: 3, prompt: 'Combien de trous compte un parcours de golf standard ?', options: ['9', '12', '18', '24'], correctIndex: 2 },
  { id: 'sp7', categoryId: 'sport', difficulty: 3, prompt: 'Dans quel pays le judo a-t-il été créé ?', options: ['Chine', 'Corée', 'Japon', 'Thaïlande'], correctIndex: 2 },
  { id: 'sp8', categoryId: 'sport', difficulty: 3, prompt: 'Combien de points vaut un essai au rugby à XV ?', options: ['3', '5', '6', '7'], correctIndex: 1 },
  { id: 'sp9', categoryId: 'sport', difficulty: 4, prompt: 'Quel pays a remporté la Coupe du monde de football 2018 ?', options: ['Croatie', 'France', 'Brésil', 'Allemagne'], correctIndex: 1 },
  { id: 'sp10', categoryId: 'sport', difficulty: 4, prompt: "Dans quelle ville se sont tenus les JO d'été de 2021 ?", options: ['Rio', 'Londres', 'Tokyo', 'Paris'], correctIndex: 2 },
  { id: 'sp11', categoryId: 'sport', difficulty: 4, prompt: 'Combien de temps dure un quart-temps en NBA ?', options: ['10 min', '12 min', '15 min', '20 min'], correctIndex: 1 },
  { id: 'sp12', categoryId: 'sport', difficulty: 5, prompt: "Quel joueur détient le record de Ballons d'Or ?", options: ['Cristiano Ronaldo', 'Lionel Messi', 'Michel Platini', 'Zinédine Zidane'], correctIndex: 1 },
  { id: 'sp13', categoryId: 'sport', difficulty: 5, prompt: 'En quelle année ont eu lieu les premiers JO modernes ?', options: ['1886', '1896', '1900', '1912'], correctIndex: 1 },

  // ─────────────────────────── Arts & Culture ───────────────────────────
  { id: 'a1', categoryId: 'arts', difficulty: 1, prompt: 'Qui a peint la Joconde ?', options: ['Van Gogh', 'Léonard de Vinci', 'Picasso', 'Monet'], correctIndex: 1 },
  { id: 'a2', categoryId: 'arts', difficulty: 1, prompt: 'Combien de cordes a une guitare classique ?', options: ['4', '5', '6', '7'], correctIndex: 2 },
  { id: 'a3', categoryId: 'arts', difficulty: 2, prompt: "Qui a écrit « Les Misérables » ?", options: ['Victor Hugo', 'Émile Zola', 'Molière', 'Voltaire'], correctIndex: 0 },
  { id: 'a4', categoryId: 'arts', difficulty: 2, prompt: 'Quel instrument possède des touches noires et blanches ?', options: ['Violon', 'Piano', 'Flûte', 'Harpe'], correctIndex: 1 },
  { id: 'a5', categoryId: 'arts', difficulty: 2, prompt: "Quel peintre s'est coupé une partie de l'oreille ?", options: ['Monet', 'Dalí', 'Van Gogh', 'Picasso'], correctIndex: 2 },
  { id: 'a6', categoryId: 'arts', difficulty: 3, prompt: "Qui a écrit « Roméo et Juliette » ?", options: ['Molière', 'Shakespeare', 'Victor Hugo', 'Dante'], correctIndex: 1 },
  { id: 'a7', categoryId: 'arts', difficulty: 3, prompt: 'Quel pays a offert la statue de la Liberté aux États-Unis ?', options: ['Angleterre', 'France', 'Italie', 'Espagne'], correctIndex: 1 },
  { id: 'a8', categoryId: 'arts', difficulty: 3, prompt: "Qui a composé la « 5ᵉ Symphonie » ?", options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'], correctIndex: 2 },
  { id: 'a9', categoryId: 'arts', difficulty: 4, prompt: 'Dans quel musée est exposée la Joconde ?', options: ['Prado', 'Louvre', 'Ermitage', 'Offices'], correctIndex: 1 },
  { id: 'a10', categoryId: 'arts', difficulty: 4, prompt: 'Quel mouvement artistique est associé à Salvador Dalí ?', options: ['Cubisme', 'Surréalisme', 'Impressionnisme', 'Fauvisme'], correctIndex: 1 },
  { id: 'a11', categoryId: 'arts', difficulty: 4, prompt: 'Qui a sculpté « Le Penseur » ?', options: ['Rodin', 'Michel-Ange', 'Giacometti', 'Donatello'], correctIndex: 0 },
  { id: 'a12', categoryId: 'arts', difficulty: 5, prompt: 'Qui a peint « La Nuit étoilée » ?', options: ['Monet', 'Van Gogh', 'Cézanne', 'Gauguin'], correctIndex: 1 },
  { id: 'a13', categoryId: 'arts', difficulty: 5, prompt: 'Quel compositeur est devenu sourd à la fin de sa vie ?', options: ['Mozart', 'Beethoven', 'Bach', 'Vivaldi'], correctIndex: 1 },

  // ─────────────────────────── Ciné & Divertissement ───────────────────────────
  { id: 'e1', categoryId: 'ent', difficulty: 1, prompt: 'Quel studio a créé Mickey Mouse ?', options: ['Pixar', 'Disney', 'Warner', 'DreamWorks'], correctIndex: 1 },
  { id: 'e2', categoryId: 'ent', difficulty: 1, prompt: "Quel super-héros est surnommé « l'homme-araignée » ?", options: ['Batman', 'Spider-Man', 'Iron Man', 'Hulk'], correctIndex: 1 },
  { id: 'e3', categoryId: 'ent', difficulty: 2, prompt: 'Dans quelle saga entend-on « Je suis ton père » ?', options: ['Star Wars', 'Harry Potter', 'Matrix', 'Avatar'], correctIndex: 0 },
  { id: 'e4', categoryId: 'ent', difficulty: 2, prompt: 'Quel animal est Simba dans « Le Roi Lion » ?', options: ['Tigre', 'Lion', 'Guépard', 'Panthère'], correctIndex: 1 },
  { id: 'e5', categoryId: 'ent', difficulty: 2, prompt: "Combien de films composent la trilogie du « Seigneur des Anneaux » ?", options: ['2', '3', '4', '5'], correctIndex: 1 },
  { id: 'e6', categoryId: 'ent', difficulty: 3, prompt: 'À quelle maison appartient Harry Potter ?', options: ['Serpentard', 'Gryffondor', 'Serdaigle', 'Poufsouffle'], correctIndex: 1 },
  { id: 'e7', categoryId: 'ent', difficulty: 3, prompt: "Qui a écrit « Le Petit Prince » ?", options: ['Jules Verne', 'Saint-Exupéry', 'Albert Camus', 'Marcel Pagnol'], correctIndex: 1 },
  { id: 'e8', categoryId: 'ent', difficulty: 3, prompt: "Comment s'appelle l'héroïne du film « Titanic » ?", options: ['Rose', 'Daisy', 'Kate', 'Lily'], correctIndex: 0 },
  { id: 'e9', categoryId: 'ent', difficulty: 4, prompt: 'Qui a réalisé le film « Inception » ?', options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'Quentin Tarantino'], correctIndex: 1 },
  { id: 'e10', categoryId: 'ent', difficulty: 4, prompt: 'Quel acteur incarne Jack Sparrow ?', options: ['Johnny Depp', 'Orlando Bloom', 'Brad Pitt', 'Tom Cruise'], correctIndex: 0 },
  { id: 'e11', categoryId: 'ent', difficulty: 4, prompt: 'Dans quelle saga trouve-t-on le personnage de Dark Vador ?', options: ['Star Trek', 'Star Wars', 'Dune', 'Alien'], correctIndex: 1 },
  { id: 'e12', categoryId: 'ent', difficulty: 5, prompt: "Quel film a remporté l'Oscar du meilleur film en 2020 ?", options: ['1917', 'Parasite', 'Joker', 'Green Book'], correctIndex: 1 },
  { id: 'e13', categoryId: 'ent', difficulty: 5, prompt: 'Qui a composé la musique de « Star Wars » ?', options: ['Hans Zimmer', 'John Williams', 'Ennio Morricone', 'Danny Elfman'], correctIndex: 1 },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Tire n questions, en couvrant toutes les difficultés présentes (1→5),
 * puis en complétant au hasard, et enfin en les ordonnant du plus facile
 * au plus difficile (le duel « monte » en difficulté).
 * @param categoryIds thèmes à inclure ; undefined ou vide = tous les thèmes.
 */
export function pickQuestions(n: number, categoryIds?: string[]): Question[] {
  const pool =
    !categoryIds || categoryIds.length === 0
      ? QUESTIONS
      : QUESTIONS.filter((q) => categoryIds.includes(q.categoryId));

  const used = new Set<string>();
  const chosen: Question[] = [];

  // 1) Au moins une question de chaque difficulté 1→5 (si disponible).
  for (let diff = 1; diff <= 5; diff++) {
    const cands = shuffle(pool.filter((q) => q.difficulty === diff && !used.has(q.id)));
    if (cands.length > 0 && chosen.length < n) {
      chosen.push(cands[0]);
      used.add(cands[0].id);
    }
  }

  // 2) Compléter au hasard jusqu'à n.
  for (const q of shuffle(pool.filter((q) => !used.has(q.id)))) {
    if (chosen.length >= n) break;
    chosen.push(q);
    used.add(q.id);
  }

  // 3) Ordre croissant de difficulté (la dernière question est la plus dure).
  chosen.sort((a, b) => a.difficulty - b.difficulty);
  return chosen.slice(0, n);
}
