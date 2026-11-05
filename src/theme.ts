export const theme = {
  bg: '#0A0E1F',
  surface: '#141B33',
  surfaceAlt: '#1E2746',
  text: '#F2F5FF',
  textDim: '#94A1C4',
  // Identité : bleu + orange
  primary: '#3B82F6', // bleu
  primaryDark: '#2563EB',
  accent: '#F97316', // orange
  you: '#38BDF8', // joueur = bleu
  bot: '#FB923C', // adversaire = orange
  correct: '#34D399',
  wrong: '#F43F5E',
  streak: '#FBBF24',
  // Ancienne palette des réponses (désormais : néon de la couleur du thème)
  optionColors: ['#3B82F6', '#F97316', '#38BDF8', '#FBBF24'],
  // Famille typographique (Poppins), chargée dans App.tsx
  fonts: {
    black: 'Poppins_900Black',
    extraBold: 'Poppins_800ExtraBold',
    bold: 'Poppins_700Bold',
    semiBold: 'Poppins_600SemiBold',
    medium: 'Poppins_500Medium',
  },
};

export type Theme = typeof theme;
