import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { hapticTap } from '../game/haptics';

export type AnswerState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

interface Props {
  label: string;
  colorIndex: number;
  onPress: () => void;
  disabled?: boolean;
  state?: AnswerState;
}

const useNative = Platform.OS !== 'web';

export function AnswerButton({ label, colorIndex, onPress, disabled, state = 'idle' }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'correct') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 120, useNativeDriver: useNative }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: useNative }),
      ]).start();
    } else if (state === 'wrong') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: useNative }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: useNative }),
      ]).start();
    }
  }, [state, scale]);

  let bg = theme.optionColors[colorIndex % theme.optionColors.length];
  if (state === 'correct') bg = theme.correct;
  else if (state === 'wrong') bg = theme.wrong;
  else if (state === 'dimmed') bg = theme.surfaceAlt;

  const handlePress = () => {
    hapticTap();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: bg,
            opacity: state === 'dimmed' ? 0.45 : pressed ? 0.85 : 1,
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
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginVertical: 6,
    minHeight: 60,
    justifyContent: 'center',
  },
  label: { color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center' },
});
