import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface Props {
  onDuelThemes: () => void;
  onAllThemes: () => void;
}

export function HomeScreen({ onDuelThemes, onAllThemes }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>QuizDuel</Text>
      <Text style={styles.tagline}>
        Défie le bot en 1 contre 1.{'\n'}Le plus rapide marque le plus de points.
      </Text>

      <View style={styles.rules}>
        <Rule text="Réponds vite : plus tu es rapide, plus tu marques" />
        <Rule text="Enchaîne les bonnes réponses pour un bonus de série" />
        <Rule text="Mauvaise réponse : 0 point et série perdue" />
      </View>

      <View style={styles.modes}>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]}
          onPress={onDuelThemes}
        >
          <Text style={styles.primaryTxt}>DUEL DE THÈMES</Text>
        </Pressable>
        <Text style={styles.modeHint}>Chacun choisit un thème, les questions sont mélangées</Text>

        <Pressable
          style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.85 }]}
          onPress={onAllThemes}
        >
          <Text style={styles.secondaryTxt}>TOUS LES THÈMES</Text>
        </Pressable>
        <Text style={styles.modeHint}>Toutes les catégories mélangées</Text>
      </View>
    </View>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <View style={styles.ruleRow}>
      <View style={styles.dot} />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logo: { fontSize: 48, fontWeight: '900', color: theme.primary, letterSpacing: 1 },
  tagline: { color: theme.textDim, fontSize: 16, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  rules: { marginTop: 32, alignSelf: 'stretch', gap: 14 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary },
  ruleText: { color: theme.text, fontSize: 15, flex: 1 },

  modes: { marginTop: 40, alignSelf: 'stretch', alignItems: 'center' },
  primary: {
    backgroundColor: theme.primary,
    paddingVertical: 18,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  primaryTxt: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  secondary: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.surfaceAlt,
  },
  secondaryTxt: { color: theme.text, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  modeHint: { color: theme.textDim, fontSize: 12, marginTop: 8, textAlign: 'center' },
});
