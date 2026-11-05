import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { hapticTap } from '../game/haptics';

export type AnswerState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

const useNative = Platform.OS !== 'web';

interface Props {
  label: string;
  neonColor: string; // couleur néon du thème de la question
  onPress: () => void;
  disabled?: boolean;
  state?: AnswerState;
}

export function AnswerButton({ label, neonColor, onPress, disabled, state = 'idle' }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  // Entrée (les 4 cases apparaissent en même temps).
  useEffect(() => {
    Animated.spring(enter, { toValue: 1, friction: 6, tension: 80, useNativeDriver: useNative }).start();
  }, [enter]);

  // Pop au feedback juste / faux.
  useEffect(() => {
    if (state === 'correct' || state === 'wrong') {
      Animated.sequence([
        Animated.timing(pop, { toValue: state === 'correct' ? 1.05 : 0.96, duration: 110, useNativeDriver: useNative }),
        Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: useNative }),
      ]).start();
    }
  }, [state, pop]);

  let borderColor = neonColor;
  let bg = 'rgba(255,255,255,0.04)';
  let textColor = '#fff';
  let glow = neonColor;
  if (state === 'correct') {
    borderColor = theme.correct;
    bg = theme.correct;
    glow = theme.correct;
  } else if (state === 'wrong') {
    borderColor = theme.wrong;
    bg = theme.wrong;
    glow = theme.wrong;
  } else if (state === 'dimmed') {
    borderColor = theme.surfaceAlt;
    bg = 'rgba(255,255,255,0.02)';
    glow = 'transparent';
    textColor = theme.textDim;
  }

  const handlePress = () => {
    hapticTap();
    onPress();
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: state === 'dimmed' ? 0.5 : enter,
        transform: [{ scale: Animated.multiply(enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }), pop) }],
      }}
    >
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [styles.btn, { borderColor, backgroundColor: bg, shadowColor: glow, opacity: pressed ? 0.9 : 1 }]}
      >
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  label: { fontSize: 18, fontFamily: theme.fonts.bold, textAlign: 'center' },
});
