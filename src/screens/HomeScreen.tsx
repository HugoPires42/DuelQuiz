import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>QuizDuel</Text>
      <Text style={styles.tagline}>
        Défie le bot en 1 contre 1.{'\n'}Le plus rapide marque le plus de points !
      </Text>

      <View style={styles.rules}>
        <Rule emoji="⚡" text="Réponds vite : plus tu es rapide, plus tu marques" />
        <Rule emoji="🔥" text="Enchaîne les bonnes réponses pour un bonus de série" />
        <Rule emoji="❌" text="Mauvaise réponse = 0 point et série perdue" />
      </View>

      <Pressable style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]} onPress={onStart}>
        <Text style={styles.ctaText}>JOUER</Text>
      </Pressable>
    </View>
  );
}

function Rule({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.ruleRow}>
      <Text style={styles.ruleEmoji}>{emoji}</Text>
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logo: { fontSize: 48, fontWeight: '900', color: theme.primary, letterSpacing: 1 },
  tagline: { color: theme.textDim, fontSize: 16, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  rules: { marginTop: 36, alignSelf: 'stretch', gap: 16 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ruleEmoji: { fontSize: 22 },
  ruleText: { color: theme.text, fontSize: 15, flex: 1 },
  cta: {
    marginTop: 44,
    backgroundColor: theme.primary,
    paddingVertical: 18,
    paddingHorizontal: 72,
    borderRadius: 999,
  },
  ctaText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
});
