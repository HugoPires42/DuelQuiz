import React from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';
import { FACE_COLORS, FRAMES } from './types';

// Pièces d'avatar dessinées dans un repère 0..100 (visage centré ~ (50,52)).
const DARK = '#17172b';
const colorOf = (id: string) => FACE_COLORS.find((c) => c.id === id)?.color ?? '#3B82F6';

export function drawFace(colorId: string) {
  return <Circle cx={50} cy={52} r={34} fill={colorOf(colorId)} />;
}

export function drawEyes(id: string) {
  switch (id) {
    case 'happy':
      return (
        <G stroke={DARK} strokeWidth={3} fill="none" strokeLinecap="round">
          <Path d="M34 50 Q40 44 46 50" />
          <Path d="M54 50 Q60 44 66 50" />
        </G>
      );
    case 'sleepy':
      return (
        <G stroke={DARK} strokeWidth={3} strokeLinecap="round">
          <Line x1={35} y1={49} x2={45} y2={49} />
          <Line x1={55} y1={49} x2={65} y2={49} />
        </G>
      );
    case 'wink':
      return (
        <G>
          <Circle cx={40} cy={48} r={4.5} fill={DARK} />
          <Line x1={55} y1={49} x2={65} y2={49} stroke={DARK} strokeWidth={3} strokeLinecap="round" />
        </G>
      );
    case 'round':
    default:
      return (
        <G fill={DARK}>
          <Circle cx={40} cy={48} r={4.5} />
          <Circle cx={60} cy={48} r={4.5} />
        </G>
      );
  }
}

export function drawMouth(id: string) {
  switch (id) {
    case 'neutral':
      return <Line x1={43} y1={65} x2={57} y2={65} stroke={DARK} strokeWidth={3} strokeLinecap="round" />;
    case 'grin':
      return <Path d="M39 62 Q50 75 61 62 Z" fill={DARK} />;
    case 'smile':
    default:
      return <Path d="M40 62 Q50 72 60 62" stroke={DARK} strokeWidth={3} fill="none" strokeLinecap="round" />;
  }
}

export function drawGlasses(id: string) {
  switch (id) {
    case 'round':
      return (
        <G stroke={DARK} strokeWidth={2.5} fill="none">
          <Circle cx={40} cy={48} r={8} />
          <Circle cx={60} cy={48} r={8} />
          <Line x1={48} y1={48} x2={52} y2={48} />
        </G>
      );
    case 'sun':
      return (
        <G>
          <Circle cx={40} cy={48} r={8} fill={DARK} />
          <Circle cx={60} cy={48} r={8} fill={DARK} />
          <Line x1={48} y1={48} x2={52} y2={48} stroke={DARK} strokeWidth={2.5} />
        </G>
      );
    case 'square':
      return (
        <G stroke={DARK} strokeWidth={2.5} fill="none">
          <Rect x={31} y={41} width={16} height={13} rx={3} />
          <Rect x={53} y={41} width={16} height={13} rx={3} />
          <Line x1={47} y1={47} x2={53} y2={47} />
        </G>
      );
    default:
      return null;
  }
}

export function drawHat(id: string) {
  switch (id) {
    case 'cap':
      return (
        <G fill="#F43F5E">
          <Path d="M28 31 a22 21 0 0 1 44 0 Z" />
          <Ellipse cx={66} cy={31} rx={15} ry={4} />
        </G>
      );
    case 'beanie':
      return (
        <G>
          <Path d="M28 32 a22 18 0 0 1 44 0 Z" fill="#2DD4BF" />
          <Rect x={28} y={31} width={44} height={5} rx={2} fill="#14b8a6" />
        </G>
      );
    case 'crown':
      return <Polygon points="30,30 38,36 44,21 50,34 56,21 62,36 70,30 70,40 30,40" fill="#FBBF24" />;
    case 'party':
      return (
        <G>
          <Polygon points="50,7 40,33 60,33" fill="#F472B6" />
          <Circle cx={50} cy={8} r={3} fill="#FBBF24" />
        </G>
      );
    default:
      return null;
  }
}

export function drawFrame(id: string) {
  if (id === 'none') return null;
  const color = FRAMES.find((x) => x.id === id)?.color ?? '#2a2a44';
  if (id === 'neon') {
    return (
      <G fill="none">
        <Circle cx={50} cy={50} r={47} stroke={color} strokeWidth={6} strokeOpacity={0.25} />
        <Circle cx={50} cy={50} r={47} stroke={color} strokeWidth={3} />
      </G>
    );
  }
  return <Circle cx={50} cy={50} r={47} stroke={color} strokeWidth={id === 'gold' ? 4 : 3} fill="none" />;
}
