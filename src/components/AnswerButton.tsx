import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export type AnswerState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

interface Props {
  label: string;
  colorIndex: number;
  onPress: () => void;
  disabled?: boolean;
  state?: AnswerState;
}

export function AnswerButton({ label, colorIndex, onPress, disabled, state = 'idle' }: Props) {
  let bg = theme.optionColors[colorIndex % theme.optionColors.length];
  if (state === 'correct') bg = theme.correct;
  else if (state === 'wrong') bg = theme.wrong;
  else if (state === 'dimmed') bg = theme.surfaceAlt;

  return (
    <Pressable
      onPress={onPress}
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
