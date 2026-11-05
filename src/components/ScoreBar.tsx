import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface SideInfo {
  name: string;
  score: number;
  streak: number;
  color: string;
}

/** Fait « monter » un nombre de sa valeur précédente à la nouvelle. */
function useCountUp(value: number, duration = 650) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = Date.now();
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    step();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return display;
}

export function ScoreBar({ you, bot }: { you: SideInfo; bot: SideInfo }) {
  return (
    <View>
      <View style={styles.row}>
        <SideBadge info={you} align="flex-start" />
        <Text style={styles.vs}>VS</Text>
        <SideBadge info={bot} align="flex-end" />
      </View>
      <VsBar you={you.score} bot={bot.score} youColor={you.color} botColor={bot.color} />
    </View>
  );
}

function SideBadge({ info, align }: { info: SideInfo; align: 'flex-start' | 'flex-end' }) {
  const display = useCountUp(info.score);
  return (
    <View style={[styles.side, { alignItems: align }]}>
      <Text style={[styles.name, { color: info.color }]}>{info.name}</Text>
      <Text style={styles.score}>{display}</Text>
      {info.streak >= 2 && <Text style={styles.streak}>série x{info.streak}</Text>}
    </View>
  );
}

/** Barre « tir à la corde » : la frontière penche vers le joueur en tête. */
function VsBar({ you, bot, youColor, botColor }: { you: number; bot: number; youColor: string; botColor: string }) {
  const total = you + bot;
  const frac = total === 0 ? 0.5 : you / total;
  const anim = useRef(new Animated.Value(frac)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: frac, friction: 8, tension: 60, useNativeDriver: false }).start();
  }, [frac, anim]);

  const leftW = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.vsTrack, { backgroundColor: botColor }]}>
      <Animated.View style={[styles.vsYou, { width: leftW, backgroundColor: youColor }]} />
      <View style={styles.vsCenter} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  side: { flex: 1 },
  name: { fontSize: 14, fontFamily: theme.fonts.extraBold },
  score: { fontSize: 30, fontFamily: theme.fonts.black, color: theme.text, lineHeight: 36 },
  streak: { fontSize: 12, color: theme.streak, fontFamily: theme.fonts.extraBold },
  vs: { color: theme.textDim, fontFamily: theme.fonts.black, marginHorizontal: 10, fontSize: 13 },

  vsTrack: { height: 10, borderRadius: 5, marginTop: 10, overflow: 'hidden' },
  vsYou: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 5 },
  vsCenter: { position: 'absolute', left: '50%', top: -2, bottom: -2, width: 2, marginLeft: -1, backgroundColor: 'rgba(255,255,255,0.5)' },
});
