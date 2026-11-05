import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { isMuted, setMuted, playSound } from '../game/sounds';
import { theme } from '../theme';

interface Props {
  profile?: { pseudo: string; tag: string } | null;
  onProfile: () => void;
  onDuelThemes: () => void;
  onAllThemes: () => void;
}

export function HomeScreen({ profile, onProfile, onDuelThemes, onAllThemes }: Props) {
  const [soundOn, setSoundOn] = useState(!isMuted());
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setMuted(!next);
    if (next) playSound('tap');
  };

  return (
    <View style={styles.container}>
      <ThemedBackground />
      {profile && (
        <Pressable style={styles.profileChip} onPress={onProfile}>
          <View style={styles.profileDot} />
          <Text style={styles.profileTxt}>
            {profile.pseudo}#{profile.tag}
          </Text>
        </Pressable>
      )}
      <Pressable style={styles.soundToggle} onPress={toggleSound}>
        <View style={[styles.soundDot, { backgroundColor: soundOn ? theme.correct : theme.textDim }]} />
        <Text style={styles.soundTxt}>{soundOn ? 'Son activé' : 'Son coupé'}</Text>
      </Pressable>
      <Text style={styles.logo}>QuizDuel</Text>
      <Text style={styles.tagline}>
        Défie le bot en 1 contre 1.{'\n'}Le plus rapide marque le plus de points.
      </Text>

      <View style={styles.rules}>
        <Rule text="Réponds vite : plus tu es rapide, plus tu marques" />
        <Rule text="Enchaîne les bonnes réponses pour un bonus de série" />
        <Rule text="Mauvaise réponse : 0 point et série perdue" />
      </View>

      <View style={styles.modes}>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]}
          onPress={onDuelThemes}
        >
          <Text style={styles.primaryTxt}>DUEL DE THÈMES</Text>
        </Pressable>
        <Text style={styles.modeHint}>Chacun choisit un thème, les questions sont mélangées</Text>

        <Pressable
          style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.85 }]}
          onPress={onAllThemes}
        >
          <Text style={styles.secondaryTxt}>MIXUP</Text>
        </Pressable>
        <Text style={styles.modeHint}>Toutes les catégories mélangées</Text>
      </View>
    </View>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <View style={styles.ruleRow}>
      <View style={styles.dot} />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  profileChip: {
    position: 'absolute',
    top: 14,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: theme.surface,
  },
  profileDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary },
  profileTxt: { color: theme.text, fontSize: 12, fontFamily: theme.fonts.bold },
  soundToggle: {
    position: 'absolute',
    top: 14,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: theme.surface,
  },
  soundDot: { width: 8, height: 8, borderRadius: 4 },
  soundTxt: { color: theme.textDim, fontSize: 12, fontFamily: theme.fonts.semiBold },
  logo: { fontSize: 50, fontFamily: theme.fonts.black, color: theme.primary, letterSpacing: 0.5 },
  tagline: { color: theme.textDim, fontSize: 16, fontFamily: theme.fonts.medium, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  rules: { marginTop: 32, alignSelf: 'stretch', gap: 14 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary },
  ruleText: { color: theme.text, fontSize: 15, fontFamily: theme.fonts.medium, flex: 1 },

  modes: { marginTop: 40, alignSelf: 'stretch', alignItems: 'center' },
  primary: {
    backgroundColor: theme.primary,
    paddingVertical: 18,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  primaryTxt: { color: '#fff', fontSize: 18, fontFamily: theme.fonts.black, letterSpacing: 1 },
  secondary: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 999,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.accent,
  },
  secondaryTxt: { color: theme.accent, fontSize: 16, fontFamily: theme.fonts.extraBold, letterSpacing: 1 },
  modeHint: { color: theme.textDim, fontSize: 12, fontFamily: theme.fonts.medium, marginTop: 8, textAlign: 'center' },
});
