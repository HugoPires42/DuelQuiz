export const theme = {
  bg: '#0E0B1E',
  surface: '#1B1636',
  surfaceAlt: '#272150',
  text: '#F5F3FF',
  textDim: '#A59FC9',
  primary: '#7C4DFF',
  primaryDark: '#5E35D6',
  you: '#4DD0E1',
  bot: '#FF7043',
  correct: '#43D17A',
  wrong: '#F04D6E',
  streak: '#FFB300',
  // Les 4 couleurs des boutons de réponse (style QuizUp)
  optionColors: ['#5C6BC0', '#26A69A', '#EC407A', '#FFA726'],
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
