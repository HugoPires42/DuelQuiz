import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { Avatar } from '../components/Avatar';
import { Match, listenMatch, leaveMatch } from '../online/match';
import { Profile } from '../account/account';
import { theme } from '../theme';

interface Props {
  matchId: string;
  me: Profile;
  onLeave: () => void;
}

/**
 * Lobby de duel en ligne (étape A1). Les 2 joueurs écoutent la partie en
 * temps réel. Le duel synchronisé (questions/réponses) arrive à l'étape A2.
 */
export function OnlineDuelScreen({ matchId, me, onLeave }: Props) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenMatch(matchId, (m) => {
      setMatch(m);
      setLoading(false);
    });
    return unsub;
  }, [matchId]);

  const quit = async () => {
    await leaveMatch(matchId);
    onLeave();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ThemedBackground />
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.center}>
        <ThemedBackground />
        <Text style={styles.status}>Partie terminée ou annulée.</Text>
        <Pressable style={styles.leave} onPress={onLeave}>
          <Text style={styles.leaveTxt}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const oppId = match.playerIds.find((u) => u !== me.uid);
  const opp = oppId ? match.players[oppId] : undefined;
  const mePlayer = match.players[me.uid];
  const isHost = match.host === me.uid;

  return (
    <View style={styles.center}>
      <ThemedBackground />
      <Text style={styles.title}>DUEL</Text>

      <View style={styles.vs}>
        <View style={styles.side}>
          <Avatar config={mePlayer?.avatar} size={78} />
          <Text style={[styles.name, { color: theme.you }]}>{mePlayer?.pseudo ?? 'Toi'}</Text>
        </View>
        <Text style={styles.vsTxt}>VS</Text>
        <View style={styles.side}>
          <Avatar config={opp?.avatar} size={78} />
          <Text style={[styles.name, { color: theme.bot }]}>{opp?.pseudo ?? '…'}</Text>
        </View>
      </View>

      {match.state === 'waiting' ? (
        <Text style={styles.status}>
          {isHost ? `En attente que ${opp?.pseudo ?? 'ton ami'} rejoigne…` : 'Connexion…'}
        </Text>
      ) : match.state === 'playing' ? (
        <Text style={styles.status}>Connectés ! Le duel synchronisé arrive à l'étape suivante.</Text>
      ) : (
        <Text style={styles.status}>Partie terminée.</Text>
      )}

      <Pressable style={({ pressed }) => [styles.leave, pressed && { opacity: 0.85 }]} onPress={quit}>
        <Text style={styles.leaveTxt}>Quitter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  title: { color: theme.text, fontSize: 34, fontFamily: theme.fonts.black, letterSpacing: 2, marginBottom: 28 },
  vs: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 28 },
  side: { alignItems: 'center', gap: 8 },
  name: { fontSize: 15, fontFamily: theme.fonts.extraBold },
  vsTxt: { color: theme.textDim, fontSize: 16, fontFamily: theme.fonts.black },
  status: { color: theme.textDim, fontSize: 15, fontFamily: theme.fonts.semiBold, textAlign: 'center', marginBottom: 32, lineHeight: 21 },
  leave: { borderWidth: 2, borderColor: theme.surfaceAlt, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 30 },
  leaveTxt: { color: theme.textDim, fontSize: 14, fontFamily: theme.fonts.bold },
});
