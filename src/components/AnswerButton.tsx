import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { hapticTap } from '../game/haptics';

export type AnswerState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

interface Props {
  label: string;
  colorIndex: number;
  index: number; // position dans la grille (pour l'entrée en cascade)
  onPress: () => void;
  disabled?: boolean;
  state?: AnswerState;
}

const useNative = Platform.OS !== 'web';

export function AnswerButton({ label, colorIndex, index, onPress, disabled, state = 'idle' }: Props) {
  const enter = useRef(new Animated.Value(0)).current; // entrée en cascade au montage
  const pop = useRef(new Animated.Value(1)).current; // pop bonne / mauvaise réponse

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 260,
      delay: index * 70,
      useNativeDriver: useNative,
    }).start();
  }, [enter, index]);

  useEffect(() => {
    if (state === 'correct') {
      Animated.sequence([
        Animated.timing(pop, { toValue: 1.06, duration: 130, useNativeDriver: useNative }),
        Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: useNative }),
      ]).start();
    } else if (state === 'wrong') {
      Animated.sequence([
        Animated.timing(pop, { toValue: 0.95, duration: 90, useNativeDriver: useNative }),
        Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: useNative }),
      ]).start();
    }
  }, [state, pop]);

  let bg = theme.optionColors[colorIndex % theme.optionColors.length];
  if (state === 'correct') bg = theme.correct;
  else if (state === 'wrong') bg = theme.wrong;
  else if (state === 'dimmed') bg = theme.surfaceAlt;

  const handlePress = () => {
    hapticTap();
    onPress();
  };

  return (
    <Animated.View
      style={{
        width: '100%',
        opacity: enter,
        transform: [
          { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
          { scale: pop },
        ],
      }}
    >
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: bg,
            opacity: state === 'dimmed' ? 0.4 : pressed ? 0.85 : 1,
            borderWidth: state === 'selected' ? 3 : 0,
            borderColor: '#fff',
          },
        ]}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.bold, textAlign: 'center' },
});
