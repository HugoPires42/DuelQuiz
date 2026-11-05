import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { categoryById, NEON_DEFAULT } from '../game/categories';
import { NeonIcon, IconKey } from './NeonIcon';
import { theme } from '../theme';

const useNative = Platform.OS !== 'web';

// Jeu d'icônes par thème.
const ICONS: Record<string, IconKey[]> = {
  geo: ['globe', 'pin', 'mountain'],
  hist: ['column', 'hourglass', 'crown'],
  sci: ['molecule', 'atom', 'flask'],
  sport: ['basketball', 'soccer', 'trophy'],
  arts: ['palette', 'note', 'mask'],
  ent: ['clap', 'reel', 'star'],
};
const GENERIC: IconKey[] = ['star', 'spark', 'bulb', 'question'];

interface Slot {
  top: string;
  left: string;
  size: number;
  rot: number;
  dur: number;
  range: number;
  delay: number;
}

// Positions fixes (pas de hasard au rendu → pas de « saut » des doodles).
const SLOTS: Slot[] = [
  { top: '5%', left: '8%', size: 66, rot: -12, dur: 4200, range: 10, delay: 0 },
  { top: '13%', left: '70%', size: 52, rot: 14, dur: 3600, range: 8, delay: 400 },
  { top: '37%', left: '82%', size: 72, rot: -8, dur: 4800, range: 12, delay: 200 },
  { top: '56%', left: '3%', size: 58, rot: 10, dur: 4000, range: 9, delay: 600 },
  { top: '70%', left: '66%', size: 64, rot: -16, dur: 4400, range: 11, delay: 300 },
  { top: '85%', left: '14%', size: 50, rot: 8, dur: 3800, range: 8, delay: 500 },
  { top: '27%', left: '38%', size: 40, rot: 18, dur: 5000, range: 7, delay: 700 },
  { top: '47%', left: '44%', size: 44, rot: -20, dur: 4600, range: 9, delay: 150 },
];

function FloatingDoodle({ slot, icon, color }: { slot: Slot; icon: IconKey; color: string }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: slot.dur, delay: slot.delay, easing: Easing.inOut(Easing.sin), useNativeDriver: useNative }),
        Animated.timing(t, { toValue: 0, duration: slot.dur, easing: Easing.inOut(Easing.sin), useNativeDriver: useNative }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t, slot]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-slot.range, slot.range] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: [`${slot.rot - 4}deg`, `${slot.rot + 4}deg`] });

  return (
    <Animated.View style={{ position: 'absolute', top: slot.top as any, left: slot.left as any, transform: [{ translateY }, { rotate }] }}>
      <NeonIcon icon={icon} size={slot.size} color={color} />
    </Animated.View>
  );
}

/**
 * Fond néon thématique : un dégradé léger pour la profondeur + des doodles
 * (liés au thème) qui flottent doucement. `categoryId` undefined = jeu générique.
 */
export function ThemedBackground({ categoryId }: { categoryId?: string }) {
  const cat = categoryId ? categoryById(categoryId) : undefined;
  const neon = cat?.neon ?? NEON_DEFAULT;
  const icons = (categoryId && ICONS[categoryId]) || GENERIC;

  // Fondu à chaque changement de thème (ex. questions de thèmes différents).
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: useNative }).start();
  }, [categoryId, fade]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={[theme.bg, `${neon}14`, theme.bg]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]}>
        {SLOTS.map((slot, i) => (
          <FloatingDoodle key={i} slot={slot} icon={icons[i % icons.length]} color={neon} />
        ))}
      </Animated.View>
    </View>
  );
}
