import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { Avatar } from '../components/Avatar';
import { Profile } from '../account/account';
import {
  FriendRequest, Friend, sendFriendRequest, getIncomingRequests, acceptRequest, declineRequest, getFriends, removeFriend,
} from '../account/friends';
import { playSound } from '../game/sounds';
import { theme } from '../theme';

interface Props {
  profile: Profile | null;
  onBack: () => void;
}

export function FriendsScreen({ profile, onBack }: Props) {
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!profile) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [r, f] = await Promise.all([getIncomingRequests(profile.uid), getFriends(profile.uid)]);
      setRequests(r);
      setFriends(f);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (!profile) {
    return (
      <View style={styles.center}>
        <ThemedBackground />
        <Text style={styles.offline}>Compte hors ligne</Text>
        <Pressable style={styles.back} onPress={onBack}>
          <Text style={styles.backTxt}>← Retour</Text>
        </Pressable>
      </View>
    );
  }

  const add = async () => {
    setAdding(true);
    setMsg(null);
    try {
      await sendFriendRequest(profile, input);
      setMsg({ ok: true, text: 'Demande envoyée !' });
      setInput('');
      playSound('correct');
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Erreur.' });
      playSound('wrong');
    } finally {
      setAdding(false);
    }
  };

  const accept = async (req: FriendRequest) => {
    await acceptRequest(req, profile.uid);
    playSound('correct');
    reload();
  };
  const decline = async (id: string) => {
    await declineRequest(id);
    reload();
  };
  const remove = async (uid: string) => {
    await removeFriend(profile.uid, uid);
    reload();
  };

  return (
    <View style={styles.container}>
      <ThemedBackground />
      <Pressable style={styles.back} onPress={onBack}>
        <Text style={styles.backTxt}>← Retour</Text>
      </Pressable>
      <Text style={styles.title}>Amis</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Ajouter un ami</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Pseudo#1234"
              placeholderTextColor={theme.textDim}
              autoCapitalize="none"
            />
            <Pressable style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]} onPress={add} disabled={adding || input.trim().length === 0}>
              {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.addTxt}>Ajouter</Text>}
            </Pressable>
          </View>
          {msg && <Text style={[styles.msg, { color: msg.ok ? theme.correct : theme.wrong }]}>{msg.text}</Text>}
        </View>

        {requests.length > 0 && (
          <>
            <Text style={styles.section}>Demandes reçues ({requests.length})</Text>
            {requests.map((r) => (
              <View key={r.id} style={styles.row}>
                <Avatar config={r.fromAvatar} size={40} />
                <Text style={styles.rowName}>
                  {r.fromPseudo}#{r.fromTag}
                </Text>
                <Pressable style={styles.accept} onPress={() => accept(r)}>
                  <Text style={styles.acceptTxt}>Accepter</Text>
                </Pressable>
                <Pressable style={styles.decline} onPress={() => decline(r.id)}>
                  <Text style={styles.declineTxt}>Refuser</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}

        <Text style={styles.section}>Mes amis ({friends.length})</Text>
        {loading ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 16 }} />
        ) : friends.length === 0 ? (
          <Text style={styles.empty}>Aucun ami pour l'instant. Ajoute quelqu'un avec son Pseudo#1234 !</Text>
        ) : (
          friends.map((f) => (
            <View key={f.uid} style={styles.row}>
              <Avatar config={f.avatar} size={40} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>
                  {f.pseudo}#{f.tag}
                </Text>
                <Text style={styles.rowSub}>Niveau {f.level}</Text>
              </View>
              <Pressable style={styles.remove} onPress={() => remove(f.uid)}>
                <Text style={styles.removeTxt}>Retirer</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  offline: { color: theme.text, fontSize: 22, fontFamily: theme.fonts.black, marginBottom: 12 },
  back: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 16 },
  backTxt: { color: theme.textDim, fontSize: 15, fontFamily: theme.fonts.semiBold },
  title: { color: theme.text, fontSize: 30, fontFamily: theme.fonts.black, marginBottom: 14 },

  card: { backgroundColor: theme.surface, borderRadius: 18, padding: 16, marginBottom: 20 },
  label: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.extraBold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  addRow: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, backgroundColor: theme.surfaceAlt, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, color: theme.text, fontSize: 16, fontFamily: theme.fonts.bold },
  addBtn: { backgroundColor: theme.primary, borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center', minWidth: 90, alignItems: 'center' },
  addTxt: { color: '#fff', fontSize: 14, fontFamily: theme.fonts.black },
  msg: { fontSize: 13, fontFamily: theme.fonts.semiBold, marginTop: 10 },

  section: { color: theme.text, fontSize: 16, fontFamily: theme.fonts.extraBold, marginTop: 6, marginBottom: 10 },
  empty: { color: theme.textDim, fontSize: 14, fontFamily: theme.fonts.medium, lineHeight: 20 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.surface, borderRadius: 14, padding: 10, marginBottom: 10 },
  rowName: { color: theme.text, fontSize: 15, fontFamily: theme.fonts.bold, flex: 1 },
  rowSub: { color: theme.textDim, fontSize: 12, fontFamily: theme.fonts.medium },
  accept: { backgroundColor: theme.correct, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  acceptTxt: { color: '#06281b', fontSize: 12, fontFamily: theme.fonts.black },
  decline: { paddingVertical: 7, paddingHorizontal: 8 },
  declineTxt: { color: theme.textDim, fontSize: 12, fontFamily: theme.fonts.bold },
  remove: { paddingVertical: 7, paddingHorizontal: 10 },
  removeTxt: { color: theme.wrong, fontSize: 12, fontFamily: theme.fonts.bold },
});
