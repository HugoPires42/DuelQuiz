// Modèle d'avatar modulaire + catalogue des pièces.
// Chaque pièce porte une "condition de déblocage" (unlock) : gratuit, coins,
// ou défi — tout est sélectionnable en proto, mais le système est prêt.

export type UnlockCond =
  | { type: 'free' }
  | { type: 'coins'; amount: number }
  | { type: 'challenge'; id: string; label: string };

export interface PartOption {
  id: string;
  label: string;
  unlock: UnlockCond;
}
export interface ColorOption extends PartOption {
  color: string;
}

export interface AvatarConfig {
  color: string; // id dans FACE_COLORS
  eyes: string;
  mouth: string;
  glasses: string; // 'none' ou id
  hat: string; // 'none' ou id
  frame: string; // 'none' ou id
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  color: 'blue',
  eyes: 'round',
  mouth: 'smile',
  glasses: 'none',
  hat: 'none',
  frame: 'ring',
};

const free: UnlockCond = { type: 'free' };

export const FACE_COLORS: ColorOption[] = [
  { id: 'blue', label: 'Bleu', color: '#3B82F6', unlock: free },
  { id: 'orange', label: 'Orange', color: '#F97316', unlock: free },
  { id: 'teal', label: 'Turquoise', color: '#2DD4BF', unlock: free },
  { id: 'purple', label: 'Violet', color: '#A78BFA', unlock: free },
  { id: 'green', label: 'Vert', color: '#4ADE80', unlock: free },
  { id: 'pink', label: 'Rose', color: '#F472B6', unlock: free },
  { id: 'yellow', label: 'Jaune', color: '#FBBF24', unlock: free },
  { id: 'red', label: 'Rouge', color: '#F43F5E', unlock: free },
];

export const EYES: PartOption[] = [
  { id: 'round', label: 'Ronds', unlock: free },
  { id: 'happy', label: 'Joyeux', unlock: free },
  { id: 'sleepy', label: 'Cool', unlock: free },
  { id: 'wink', label: "Clin d'œil", unlock: free },
];

export const MOUTHS: PartOption[] = [
  { id: 'smile', label: 'Sourire', unlock: free },
  { id: 'neutral', label: 'Neutre', unlock: free },
  { id: 'grin', label: 'Rire', unlock: free },
];

export const GLASSES: PartOption[] = [
  { id: 'none', label: 'Aucune', unlock: free },
  { id: 'round', label: 'Rondes', unlock: free },
  { id: 'sun', label: 'Soleil', unlock: free },
  { id: 'square', label: 'Carrées', unlock: free },
];

export const HATS: PartOption[] = [
  { id: 'none', label: 'Aucun', unlock: free },
  { id: 'cap', label: 'Casquette', unlock: free },
  { id: 'beanie', label: 'Bonnet', unlock: free },
  { id: 'crown', label: 'Couronne', unlock: { type: 'challenge', id: 'win10', label: '10 victoires' } },
  { id: 'party', label: 'Fête', unlock: { type: 'coins', amount: 500 } },
];

export const FRAMES: ColorOption[] = [
  { id: 'none', label: 'Aucun', color: 'transparent', unlock: free },
  { id: 'ring', label: 'Anneau', color: '#2a2a44', unlock: free },
  { id: 'neon', label: 'Néon', color: '#3B82F6', unlock: free },
  { id: 'teal', label: 'Cyan', color: '#2DD4BF', unlock: { type: 'coins', amount: 300 } },
  { id: 'gold', label: 'Or', color: '#FBBF24', unlock: { type: 'challenge', id: 'perfect', label: 'Partie parfaite' } },
];

/** Libellé court de la condition de déblocage (null si gratuit). */
export function unlockLabel(u: UnlockCond): string | null {
  if (u.type === 'free') return null;
  if (u.type === 'coins') return `${u.amount} pièces`;
  return u.label;
}
