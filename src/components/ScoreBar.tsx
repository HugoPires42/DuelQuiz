import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface SideInfo {
  name: string;
  score: number;
  streak: number;
  color: string;
}

export function ScoreBar({ you, bot }: { you: SideInfo; bot: SideInfo }) {
  return (
    <View style={styles.row}>
      <SideBadge info={you} align="flex-start" />
      <Text style={styles.vs}>VS</Text>
      <SideBadge info={bot} align="flex-end" />
    </View>
  );
}

function SideBadge({ info, align }: { info: SideInfo; align: 'flex-start' | 'flex-end' }) {
  return (
    <View style={[styles.side, { alignItems: align }]}>
      <Text style={[styles.name, { color: info.color }]}>{info.name}</Text>
      <Text style={styles.score}>{info.score}</Text>
      {info.streak >= 2 && (
        <Text style={styles.streak}>🔥 série x{info.streak}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  side: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800' },
  score: { fontSize: 30, fontWeight: '900', color: theme.text, lineHeight: 34 },
  streak: { fontSize: 12, color: theme.streak, fontWeight: '800' },
  vs: { color: theme.textDim, fontWeight: '900', marginHorizontal: 10, fontSize: 13 },
});
