import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon } from 'react-native-svg';

export type IconKey =
  | 'globe' | 'pin' | 'mountain'
  | 'column' | 'hourglass' | 'crown'
  | 'molecule' | 'atom' | 'flask'
  | 'basketball' | 'soccer' | 'trophy'
  | 'palette' | 'note' | 'mask'
  | 'clap' | 'reel' | 'star'
  | 'spark' | 'bulb' | 'question';

// Formes dessinées dans un repère 0..64. Pas de stroke ici : il est hérité
// du <G> parent (ce qui permet le double tracé « glow + trait » néon).
function IconShapes({ icon }: { icon: IconKey }) {
  switch (icon) {
    case 'globe':
      return (
        <>
          <Circle cx={32} cy={32} r={24} />
          <Ellipse cx={32} cy={32} rx={10} ry={24} />
          <Line x1={8} y1={32} x2={56} y2={32} />
          <Line x1={12} y1={20} x2={52} y2={20} />
          <Line x1={12} y1={44} x2={52} y2={44} />
        </>
      );
    case 'pin':
      return (
        <>
          <Path d="M32 8 a16 16 0 0 1 16 16 c0 12 -16 32 -16 32 S16 36 16 24 A16 16 0 0 1 32 8 z" />
          <Circle cx={32} cy={24} r={6} />
        </>
      );
    case 'mountain':
      return (
        <>
          <Path d="M6 50 L24 20 L34 36 L44 16 L58 50 Z" />
          <Line x1={20} y1={28} x2={28} y2={28} />
        </>
      );
    case 'column':
      return (
        <>
          <Path d="M12 14 L32 6 L52 14 Z" />
          <Line x1={10} y1={20} x2={54} y2={20} />
          <Line x1={16} y1={20} x2={16} y2={48} />
          <Line x1={26} y1={20} x2={26} y2={48} />
          <Line x1={38} y1={20} x2={38} y2={48} />
          <Line x1={48} y1={20} x2={48} y2={48} />
          <Line x1={10} y1={52} x2={54} y2={52} />
        </>
      );
    case 'hourglass':
      return (
        <>
          <Line x1={16} y1={10} x2={48} y2={10} />
          <Line x1={16} y1={54} x2={48} y2={54} />
          <Path d="M16 10 L48 10 L34 32 L48 54 L16 54 L30 32 Z" />
        </>
      );
    case 'crown':
      return (
        <>
          <Path d="M12 44 L12 22 L22 32 L32 16 L42 32 L52 22 L52 44 Z" />
          <Line x1={12} y1={48} x2={52} y2={48} />
        </>
      );
    case 'molecule':
      return (
        <>
          <Circle cx={20} cy={24} r={6} />
          <Circle cx={44} cy={20} r={6} />
          <Circle cx={32} cy={44} r={6} />
          <Circle cx={48} cy={42} r={5} />
          <Line x1={24} y1={27} x2={40} y2={22} />
          <Line x1={22} y1={29} x2={30} y2={40} />
          <Line x1={36} y1={44} x2={44} y2={43} />
          <Line x1={44} y1={25} x2={46} y2={37} />
        </>
      );
    case 'atom':
      return (
        <>
          <Circle cx={32} cy={32} r={3} />
          <Ellipse cx={32} cy={32} rx={26} ry={9} />
          <Ellipse cx={32} cy={32} rx={9} ry={26} />
          <Circle cx={32} cy={32} r={19} />
        </>
      );
    case 'flask':
      return (
        <>
          <Path d="M26 12 V24 L15 46 a4 4 0 0 0 4 6 h26 a4 4 0 0 0 4 -6 L38 24 V12" />
          <Line x1={23} y1={12} x2={41} y2={12} />
          <Line x1={20} y1={40} x2={44} y2={40} />
        </>
      );
    case 'basketball':
      return (
        <>
          <Circle cx={32} cy={32} r={26} />
          <Line x1={6} y1={32} x2={58} y2={32} />
          <Line x1={32} y1={6} x2={32} y2={58} />
          <Path d="M12 14 Q32 32 12 50" />
          <Path d="M52 14 Q32 32 52 50" />
        </>
      );
    case 'soccer':
      return (
        <>
          <Circle cx={32} cy={32} r={26} />
          <Polygon points="32,22 42,29 38,41 26,41 22,29" />
          <Line x1={32} y1={8} x2={32} y2={22} />
          <Line x1={42} y1={29} x2={55} y2={25} />
          <Line x1={38} y1={41} x2={47} y2={52} />
          <Line x1={26} y1={41} x2={17} y2={52} />
          <Line x1={22} y1={29} x2={9} y2={25} />
        </>
      );
    case 'trophy':
      return (
        <>
          <Path d="M22 12 h20 v9 a10 10 0 0 1 -20 0 z" />
          <Path d="M22 15 h-6 a7 7 0 0 0 7 9" />
          <Path d="M42 15 h6 a7 7 0 0 1 -7 9" />
          <Line x1={32} y1={31} x2={32} y2={40} />
          <Path d="M24 44 h16 v5 h-16 z" />
        </>
      );
    case 'palette':
      return (
        <>
          <Path d="M32 10 a22 20 0 1 0 3 40 c3 0 4 -3 3 -6 c-1 -4 2 -6 6 -6 h3 a9 9 0 0 0 9 -10 C58 20 46 10 32 10 z" />
          <Circle cx={22} cy={24} r={2.5} />
          <Circle cx={32} cy={19} r={2.5} />
          <Circle cx={43} cy={23} r={2.5} />
          <Circle cx={46} cy={34} r={2.5} />
        </>
      );
    case 'note':
      return (
        <>
          <Line x1={26} y1={14} x2={26} y2={44} />
          <Line x1={46} y1={10} x2={46} y2={40} />
          <Line x1={26} y1={14} x2={46} y2={10} />
          <Circle cx={21} cy={44} r={6} />
          <Circle cx={41} cy={40} r={6} />
        </>
      );
    case 'mask':
      return (
        <>
          <Path d="M16 14 h32 v12 a16 20 0 0 1 -32 0 z" />
          <Circle cx={26} cy={24} r={2} />
          <Circle cx={38} cy={24} r={2} />
          <Path d="M25 34 q7 5 14 0" />
        </>
      );
    case 'clap':
      return (
        <>
          <Path d="M12 28 h40 v22 h-40 z" />
          <Path d="M12 20 L52 15 L54 23 L14 28 Z" />
          <Line x1={20} y1={17} x2={24} y2={25} />
          <Line x1={30} y1={16} x2={34} y2={24} />
          <Line x1={40} y1={15} x2={44} y2={23} />
        </>
      );
    case 'reel':
      return (
        <>
          <Circle cx={32} cy={32} r={24} />
          <Circle cx={32} cy={32} r={6} />
          <Circle cx={32} cy={14} r={4} />
          <Circle cx={32} cy={50} r={4} />
          <Circle cx={14} cy={32} r={4} />
          <Circle cx={50} cy={32} r={4} />
        </>
      );
    case 'star':
      return <Path d="M32 8 L39 26 L58 26 L43 38 L48 56 L32 45 L16 56 L21 38 L6 26 L25 26 Z" />;
    case 'spark':
      return <Path d="M32 8 L36 28 L56 32 L36 36 L32 56 L28 36 L8 32 L28 28 Z" />;
    case 'bulb':
      return (
        <>
          <Path d="M32 10 a14 14 0 0 1 8 25 v5 h-16 v-5 a14 14 0 0 1 8 -25 z" />
          <Line x1={26} y1={46} x2={38} y2={46} />
          <Line x1={28} y1={52} x2={36} y2={52} />
        </>
      );
    case 'question':
    default:
      return (
        <>
          <Path d="M22 24 a10 10 0 1 1 16 8 c-4 3 -6 5 -6 10" />
          <Circle cx={32} cy={50} r={2.5} />
        </>
      );
  }
}

interface Props {
  icon: IconKey;
  size: number;
  color: string;
}

/** Icône au trait « néon » : un halo large translucide + un trait fin lumineux. */
export function NeonIcon({ icon, size, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <G stroke={color} strokeWidth={6} strokeOpacity={0.12} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <IconShapes icon={icon} />
      </G>
      <G stroke={color} strokeWidth={2} strokeOpacity={0.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <IconShapes icon={icon} />
      </G>
    </Svg>
  );
}
