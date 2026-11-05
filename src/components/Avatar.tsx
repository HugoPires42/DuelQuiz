import React from 'react';
import Svg from 'react-native-svg';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../avatar/types';
import { drawFace, drawEyes, drawMouth, drawGlasses, drawHat, drawFrame } from '../avatar/parts';

/** Affiche un avatar composé à partir d'une config (visage + traits + cadre). */
export function Avatar({ config, size = 96 }: { config?: Partial<AvatarConfig> | null; size?: number }) {
  const c: AvatarConfig = { ...DEFAULT_AVATAR_CONFIG, ...(config ?? {}) };
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {drawFace(c.color)}
      {drawEyes(c.eyes)}
      {drawMouth(c.mouth)}
      {drawGlasses(c.glasses)}
      {drawHat(c.hat)}
      {drawFrame(c.frame)}
    </Svg>
  );
}
