import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Platform, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

const useNative = Platform.OS !== 'web';
const { width } = Dimensions.get('window');

/**
 * Bandeau d'intro d'un thème : le nom arrive d'un côté (décélère),
 * marque un temps, puis repart de l'autre (accélère).
 */
export function ThemeBanner({ label, color }: { label: string; color: string }) {
  const x = useRef(new Animated.Value(0)).current; // 0 = gauche, 1 = centre, 2 = droite
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    x.setValue(0);
    op.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(x, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: useNative }),
        Animated.timing(op, { toValue: 1, duration: 280, useNativeDriver: useNative }),
      ]),
      Animated.delay(320),
      Animated.parallel([
        Animated.timing(x, { toValue: 2, duration: 460, easing: Easing.in(Easing.cubic), useNativeDriver: useNative }),
        Animated.timing(op, { toValue: 0, duration: 300, delay: 160, useNativeDriver: useNative }),
      ]),
    ]).start();
  }, [label, x, op]);

  const translateX = x.interpolate({ inputRange: [0, 1, 2], outputRange: [-width * 0.85, 0, width * 0.85] });

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Animated.Text style={[styles.label, { color, opacity: op, transform: [{ translateX }], textShadowColor: color }]}>
        {label}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  label: {
    fontSize: 42,
    fontFamily: theme.fonts.black,
    letterSpacing: 1,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
});
