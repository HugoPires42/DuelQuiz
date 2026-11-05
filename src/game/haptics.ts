import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Les retours haptiques n'existent que sur mobile ; no-op ailleurs (web).
const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export function hapticTap() {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticSuccess() {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function hapticError() {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
