import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { Avatar } from '../components/Avatar';
import { Profile, setPseudo, fullTag } from '../account/account';
import { playSound } from '../game/sounds';
import { theme } from '../theme';

interface Props {
  profile: Profile | null;
  onBack: () => void;
  onChange: (p: Profile) => void;
  onCustomize: () => void;
  onFriends: () => void;
}

export function ProfileScreen({ profile, onBack, onChange, onCustomize, onFriends }: Props) {
  const [pseudo, setPseudoInput] = useState(profile?.pseudo ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) {
    return (
      <View style={styles.center}>
        <ThemedBackground />
        <Text style={styles.offline}>Compte hors ligne</Text>
        <Text style={styles.offlineSub}>Connexion au serveur impossible pour l'instant.</Text>
        <Pressable style={styles.back} onPress={onBack}>
          <Text style={styles.backTxt}>← Retour</Text>
        </Pressable>
      </View>
    );
  }

  const save = async () => {
    const clean = pseudo.trim();
    if (clean === profile.pseudo) {
      setError('C\'est déjà ton pseudo.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await setPseudo(profile.uid, clean);
      if (updated) {
        onChange(updated);
        playSound('correct');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur, réessaie.');
      playSound('wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedBackground />

      <Pressable style={styles.back} onPress={onBack}>
        <Text style={styles.backTxt}>← Retour</Text>
      </Pressable>

      <View style={styles.avatarHeader}>
        <Avatar config={profile.avatar} size={112} />
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.tag}>{fullTag(profile)}</Text>
        <View style={styles.headerBtns}>
          <Pressable style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.85 }]} onPress={onCustomize}>
            <Text style={styles.headerBtnTxt}>Avatar</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.85 }]} onPress={onFriends}>
            <Text style={styles.headerBtnTxt}>Amis</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Pseudo</Text>
        <TextInput
          style={styles.input}
          value={pseudo}
          onChangeText={setPseudoInput}
          maxLength={16}
          placeholder="Ton pseudo"
          placeholderTextColor={theme.textDim}
          autoCapitalize="none"
        />
        <Text style={styles.hint}>
          Un #numéro unique est ajouté automatiquement pour te différencier et permettre les ajouts en ami.
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]} onPress={save} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>ENREGISTRER</Text>}
        </Pressable>
      </View>

      <View style={styles.stats}>
        <Stat label="Niveau" value={profile.level} />
        <Stat label="XP" value={profile.xp} />
        <Stat label="Victoires" value={profile.wins} />
        <Stat label="Défaites" value={profile.losses} />
      </View>

      <View style={styles.cloud}>
        <Text style={styles.cloudTitle}>Sauvegarder ma progression</Text>
        <Text style={styles.cloudSub}>Lie un compte Google pour retrouver ton profil sur un autre appareil.</Text>
        <View style={styles.googleBtn}>
          <Text style={styles.googleTxt}>Lier un compte Google — bientôt</Text>
        </View>
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },

  back: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 16 },
  backTxt: { color: theme.textDim, fontSize: 15, fontFamily: theme.fonts.semiBold },

  avatarHeader: { alignItems: 'center' },
  title: { color: theme.text, fontSize: 26, fontFamily: theme.fonts.black, marginTop: 10 },
  tag: { color: theme.primary, fontSize: 18, fontFamily: theme.fonts.extraBold, marginTop: 2, marginBottom: 12 },
  headerBtns: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  headerBtn: { borderWidth: 2, borderColor: theme.primary, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 22 },
  headerBtnTxt: { color: theme.primary, fontSize: 13, fontFamily: theme.fonts.bold },

  card: { backgroundColor: theme.surface, borderRadius: 18, padding: 18 },
  label: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.extraBold, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    marginTop: 8,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: theme.text,
    fontSize: 18,
    fontFamily: theme.fonts.bold,
  },
  hint: { color: theme.textDim, fontSize: 12, fontFamily: theme.fonts.medium, marginTop: 8, lineHeight: 17 },
  error: { color: theme.wrong, fontSize: 13, fontFamily: theme.fonts.semiBold, marginTop: 8 },
  saveBtn: { backgroundColor: theme.primary, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  saveTxt: { color: '#fff', fontSize: 15, fontFamily: theme.fonts.black, letterSpacing: 1 },

  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  stat: { alignItems: 'center', flex: 1 },
  statVal: { color: theme.text, fontSize: 24, fontFamily: theme.fonts.black },
  statLabel: { color: theme.textDim, fontSize: 11, fontFamily: theme.fonts.semiBold, marginTop: 2 },

  cloud: { marginTop: 28, backgroundColor: theme.surface, borderRadius: 18, padding: 18 },
  cloudTitle: { color: theme.text, fontSize: 16, fontFamily: theme.fonts.extraBold },
  cloudSub: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.medium, marginTop: 6, lineHeight: 18 },
  googleBtn: { marginTop: 12, borderWidth: 2, borderColor: theme.surfaceAlt, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  googleTxt: { color: theme.textDim, fontSize: 14, fontFamily: theme.fonts.bold },

  offline: { color: theme.text, fontSize: 22, fontFamily: theme.fonts.black },
  offlineSub: { color: theme.textDim, fontSize: 14, fontFamily: theme.fonts.medium, marginTop: 8, textAlign: 'center' },
});
