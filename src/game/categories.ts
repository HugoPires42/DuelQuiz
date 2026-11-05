import { Category } from './types';

// Thèmes jouables. `all` est un pseudo-thème pour l'écran de sélection
// (« Aléatoire ») : il n'est jamais attribué à une question.
export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Aléatoire', emoji: '🎲', color: '#7C4DFF' },
  { id: 'geo', label: 'Géographie', emoji: '🌍', color: '#26A69A' },
  { id: 'hist', label: 'Histoire', emoji: '🏛️', color: '#8D6E63' },
  { id: 'sci', label: 'Sciences', emoji: '🔬', color: '#42A5F5' },
  { id: 'sport', label: 'Sport', emoji: '⚽', color: '#66BB6A' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎨', color: '#EC407A' },
  { id: 'ent', label: 'Ciné & Divertissement', emoji: '🎬', color: '#FFA726' },
];

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
