import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { Avatar } from '../components/Avatar';
import { Profile, saveAvatar } from '../account/account';
import {
  AvatarConfig, DEFAULT_AVATAR_CONFIG, FACE_COLORS, EYES, MOUTHS, GLASSES, HATS, FRAMES, PartOption, unlockLabel,
} from '../avatar/types';
import { playSound } from '../game/sounds';
import { theme } from '../theme';

interface Props {
  profile: Profile | null;
  onBack: () => void;
  onChange: (p: Profile) => void;
}

const CATEGORIES: { key: string; label: string; field: keyof AvatarConfig; options: PartOption[] }[] = [
  { key: 'color', label: 'Couleur', field: 'color', options: FACE_COLORS },
  { key: 'eyes', label: 'Yeux', field: 'eyes', options: EYES },
  { key: 'mouth', label: 'Bouche', field: 'mouth', options: MOUTHS },
  { key: 'glasses', label: 'Lunettes', field: 'glasses', options: GLASSES },
  { key: 'hat', label: 'Chapeau', field: 'hat', options: HATS },
  { key: 'frame', label: 'Cadre', field: 'frame', options: FRAMES },
];

export function AvatarScreen({ profile, onBack, onChange }: Props) {
  const [cfg, setCfg] = useState<AvatarConfig>(profile?.avatar ?? DEFAULT_AVATAR_CONFIG);
  const [catKey, setCatKey] = useState('color');
  const [saving, setSaving] = useState(false);

  const cat = CATEGORIES.find((c) => c.key === catKey) ?? CATEGORIES[0];

  const pick = (optId: string) => {
    playSound('tap');
    setCfg((prev) => ({ ...prev, [cat.field]: optId }));
  };

  const save = async () => {
    if (!profile) {
      onBack();
      return;
    }
    setSaving(true);
    try {
      const updated = await saveAvatar(profile.uid, cfg);
      if (updated) onChange(updated);
      playSound('correct');
      onBack();
    } catch {
      playSound('wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedBackground />

      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backTxt}>← Retour</Text>
        </Pressable>
        <Pressable onPress={save} style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>ENREGISTRER</Text>}
        </Pressable>
      </View>

      <View style={styles.previewWrap}>
        <Avatar config={cfg} size={150} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {CATEGORIES.map((c) => (
          <Pressable key={c.key} onPress={() => setCatKey(c.key)} style={[styles.tab, c.key === catKey && styles.tabActive]}>
            <Text style={[styles.tabTxt, c.key === catKey && styles.tabTxtActive]}>{c.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {cat.options.map((opt) => {
          const selected = cfg[cat.field] === opt.id;
          const badge = unlockLabel(opt.unlock);
          return (
            <Pressable key={opt.id} onPress={() => pick(opt.id)} style={[styles.cell, selected && styles.cellSel]}>
              <Avatar config={{ ...cfg, [cat.field]: opt.id }} size={58} />
              <Text style={styles.cellLabel} numberOfLines={1}>
                {opt.label}
              </Text>
              {badge && <Text style={styles.cellBadge}>{badge}</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 12 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { paddingVertical: 8, paddingRight: 12 },
  backTxt: { color: theme.textDim, fontSize: 15, fontFamily: theme.fonts.semiBold },
  saveBtn: { backgroundColor: theme.primary, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 22 },
  saveTxt: { color: '#fff', fontSize: 14, fontFamily: theme.fonts.black, letterSpacing: 1 },

  previewWrap: { alignItems: 'center', marginVertical: 14 },

  tabs: { flexGrow: 0, marginBottom: 12 },
  tabsContent: { gap: 8, paddingRight: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: theme.surface },
  tabActive: { backgroundColor: theme.primary },
  tabTxt: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.bold },
  tabTxtActive: { color: '#fff' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 16 },
  cell: {
    width: '31%',
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cellSel: { borderColor: theme.primary },
  cellLabel: { color: theme.text, fontSize: 12, fontFamily: theme.fonts.semiBold, marginTop: 6 },
  cellBadge: { color: theme.accent, fontSize: 10, fontFamily: theme.fonts.bold, marginTop: 2 },
});
