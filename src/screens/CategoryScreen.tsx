import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { CATEGORIES } from '../game/categories';
import { hapticTap } from '../game/haptics';
import { theme } from '../theme';

interface Props {
  onPick: (categoryId: string) => void;
  onBack: () => void;
}

export function CategoryScreen({ onPick, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisis un thème</Text>
      <Text style={styles.subtitle}>7 questions, le plus rapide gagne</Text>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => {
              hapticTap();
              onPick(c.id);
            }}
            style={({ pressed }) => [
              styles.card,
              { borderColor: c.color },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Text style={styles.emoji}>{c.emoji}</Text>
            <Text style={styles.label}>{c.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable onPress={onBack} style={styles.back}>
        <Text style={styles.backTxt}>← Retour</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 24, paddingBottom: 12 },
  title: { color: theme.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: theme.textDim, fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 12 },
  card: {
    width: '48%',
    backgroundColor: theme.surface,
    borderRadius: 18,
    borderWidth: 2,
    paddingVertical: 24,
    paddingHorizontal: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  emoji: { fontSize: 38 },
  label: { color: theme.text, fontSize: 15, fontWeight: '800', marginTop: 10, textAlign: 'center' },
  back: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 24 },
  backTxt: { color: theme.textDim, fontSize: 15, fontWeight: '700' },
});
