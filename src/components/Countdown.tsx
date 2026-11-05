import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { theme } from '../theme';

const useNative = Platform.OS !== 'web';

/** Chiffre du compte à rebours, animé (pop) à chaque changement. */
export function Countdown({ value }: { value: number }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scale.setValue(0.6);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: useNative }),
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: useNative }),
    ]).start();
  }, [value, scale, opacity]);

  return (
    <Animated.Text style={[styles.count, { opacity, transform: [{ scale }] }]}>
      {value > 0 ? value : 'GO'}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  count: { color: theme.primary, fontSize: 96, fontFamily: theme.fonts.black, marginTop: 8 },
});
