import { Category } from './types';

// Thèmes jouables. Chaque joueur en choisit un dans le mode « Duel de thèmes ».
export const CATEGORIES: Category[] = [
  { id: 'geo', label: 'Géographie', color: '#26A69A' },
  { id: 'hist', label: 'Histoire', color: '#8D6E63' },
  { id: 'sci', label: 'Sciences', color: '#42A5F5' },
  { id: 'sport', label: 'Sport', color: '#66BB6A' },
  { id: 'arts', label: 'Arts & Culture', color: '#EC407A' },
  { id: 'ent', label: 'Ciné & Divertissement', color: '#FFA726' },
];

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function categoryLabel(id: string): string {
  return categoryById(id)?.label ?? id;
}

/** Choisit un thème au hasard, en excluant ceux passés en paramètre. */
export function randomCategory(exclude: string[] = []): Category {
  const pool = CATEGORIES.filter((c) => !exclude.includes(c.id));
  const list = pool.length > 0 ? pool : CATEGORIES;
  return list[Math.floor(Math.random() * list.length)];
}
