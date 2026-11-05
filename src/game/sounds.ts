import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type SoundName = 'tap' | 'correct' | 'wrong' | 'tick' | 'streak' | 'win' | 'lose' | 'swoosh';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SOURCES: Record<SoundName, number> = {
  tap: require('../../assets/sounds/tap.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
  tick: require('../../assets/sounds/tick.wav'),
  streak: require('../../assets/sounds/streak.wav'),
  win: require('../../assets/sounds/win.wav'),
  lose: require('../../assets/sounds/lose.wav'),
  swoosh: require('../../assets/sounds/swoosh.wav'),
};

type Player = ReturnType<typeof createAudioPlayer>;

const players: Partial<Record<SoundName, Player>> = {};
let muted = false;
let initialized = false;

/** À appeler une fois au démarrage de l'app. */
export function initSounds() {
  if (initialized) return;
  initialized = true;
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
  (Object.keys(SOURCES) as SoundName[]).forEach((name) => {
    try {
      players[name] = createAudioPlayer(SOURCES[name]);
    } catch {
      // ignore (audio indisponible)
    }
  });
}

/** Joue un effet sonore (rejoué depuis le début si déjà en cours). */
export function playSound(name: SoundName) {
  if (muted) return;
  const p = players[name];
  if (!p) return;
  try {
    p.seekTo(0);
    p.play();
  } catch {
    // ignore
  }
}

export function setMuted(m: boolean) {
  muted = m;
}

export function isMuted() {
  return muted;
}
