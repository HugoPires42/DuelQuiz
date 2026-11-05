import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { theme } from '../theme';
import { Side } from '../game/types';

interface Props {
  you: Side;
  bot: Side;
  onRestart: () => void;
  onHome: () => void;
}

export function ResultScreen({ you, bot, onRestart, onHome }: Props) {
  const draw = you.score === bot.score;
  const win = you.score > bot.score;
  const verdict = draw ? 'ÉGALITÉ' : win ? 'VICTOIRE' : 'DÉFAITE';
  const verdictColor = draw ? theme.textDim : win ? theme.correct : theme.wrong;

  return (
    <View style={styles.container}>
      <ThemedBackground />
      <Text style={[styles.verdict, { color: verdictColor }]}>{verdict}</Text>

      <View style={styles.scores}>
        <Column name="Toi" color={theme.you} score={you.score} best={you.bestStreak} />
        <Text style={styles.dash}>—</Text>
        <Column name="Robo" color={theme.bot} score={bot.score} best={bot.bestStreak} />
      </View>

      <Pressable style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]} onPress={onRestart}>
        <Text style={styles.primaryTxt}>REJOUER</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={onHome}>
        <Text style={styles.secondaryTxt}>Accueil</Text>
      </Pressable>
    </View>
  );
}

function Column({ name, color, score, best }: { name: string; color: string; score: number; best: number }) {
  return (
    <View style={styles.col}>
      <Text style={[styles.cName, { color }]}>{name}</Text>
      <Text style={styles.cScore}>{score}</Text>
      <Text style={styles.cBest}>série max {best}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  verdict: { fontSize: 42, fontFamily: theme.fonts.black, letterSpacing: 1 },
  scores: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 48 },
  col: { alignItems: 'center', flex: 1 },
  cName: { fontSize: 16, fontFamily: theme.fonts.extraBold },
  cScore: { fontSize: 52, fontFamily: theme.fonts.black, color: theme.text },
  cBest: { fontSize: 12, color: theme.textDim, fontFamily: theme.fonts.medium, marginTop: 4 },
  dash: { color: theme.textDim, fontSize: 28, marginHorizontal: 8 },
  primary: { backgroundColor: theme.primary, paddingVertical: 16, paddingHorizontal: 64, borderRadius: 999 },
  primaryTxt: { color: '#fff', fontSize: 18, fontFamily: theme.fonts.black, letterSpacing: 2 },
  secondary: { marginTop: 18, paddingVertical: 10, paddingHorizontal: 24 },
  secondaryTxt: { color: theme.textDim, fontSize: 15, fontFamily: theme.fonts.semiBold },
});
