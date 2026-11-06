import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { Avatar } from '../components/Avatar';
import { ScoreBar } from '../components/ScoreBar';
import { AnswerButton, AnswerState } from '../components/AnswerButton';
import { Match, listenMatch, leaveMatch } from '../online/match';
import { useOnlineDuel, finalScores } from '../online/useOnlineDuel';
import { QUESTION_TIME_MS } from '../game/scoring';
import { categoryById } from '../game/categories';
import { playSound } from '../game/sounds';
import { Profile } from '../account/account';
import { theme } from '../theme';

interface Props {
  matchId: string;
  me: Profile;
  onLeave: () => void;
}

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

  if (match.state === 'done') {
    return <OnlineResult match={match} me={me} onLeave={quit} />;
  }

  if (match.state === 'playing') {
    return <OnlineDuelPlay matchId={matchId} match={match} myUid={me.uid} onQuit={quit} />;
  }

  // Lobby (en attente que l'ami rejoigne).
  const oppId = match.playerIds.find((u) => u !== me.uid);
  const opp = oppId ? match.players[oppId] : undefined;
  const mePlayer = match.players[me.uid];
  const isHost = match.host === me.uid;
  return (
    <View style={styles.center}>
      <ThemedBackground />
      <Text style={styles.title}>DUEL</Text>
      <View style={styles.vsRow}>
        <View style={styles.vsSide}>
          <Avatar config={mePlayer?.avatar} size={78} />
          <Text style={[styles.vsName, { color: theme.you }]}>{mePlayer?.pseudo ?? 'Toi'}</Text>
        </View>
        <Text style={styles.vsTxt}>VS</Text>
        <View style={styles.vsSide}>
          <Avatar config={opp?.avatar} size={78} />
          <Text style={[styles.vsName, { color: theme.bot }]}>{opp?.pseudo ?? '…'}</Text>
        </View>
      </View>
      <Text style={styles.status}>{isHost ? `En attente que ${opp?.pseudo ?? 'ton ami'} rejoigne…` : 'Connexion…'}</Text>
      <Pressable style={({ pressed }) => [styles.leave, pressed && { opacity: 0.85 }]} onPress={quit}>
        <Text style={styles.leaveTxt}>Quitter</Text>
      </Pressable>
    </View>
  );
}

function OnlineDuelPlay({ matchId, match, myUid, onQuit }: { matchId: string; match: Match; myUid: string; onQuit: () => void }) {
  const d = useOnlineDuel(matchId, match, myUid);
  const me = match.players[myUid];
  const opp = match.players[d.oppUid];
  const cat = d.question ? categoryById(d.question.categoryId) : undefined;
  const neon = cat?.neon ?? theme.primary;
  const revealed = d.phase === 'reveal';
  const feedback = d.mySelected != null || revealed;
  const timePct = Math.max(0, Math.min(1, d.timeLeftMs / QUESTION_TIME_MS));

  // Son instantané quand je réponds.
  useEffect(() => {
    if (d.mySelected == null || !d.question) return;
    playSound(d.mySelected === d.question.correctIndex ? 'correct' : 'wrong');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.mySelected]);

  if (!d.question) {
    return (
      <View style={styles.center}>
        <ThemedBackground />
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const cellState = (i: number): AnswerState => {
    if (!feedback) return 'idle';
    if (i === d.correctIndex) return 'correct';
    if (i === d.mySelected) return 'wrong';
    return 'dimmed';
  };
  const cell = (i: number) => (
    <View key={i} style={styles.cell}>
      <AnswerButton label={d.question.options[i]} neonColor={neon} state={cellState(i)} disabled={feedback} onPress={() => d.onSelect(i)} />
    </View>
  );

  return (
    <View style={styles.playContainer}>
      <ThemedBackground categoryId={d.question.categoryId} />

      <ScoreBar
        you={{ name: me?.pseudo ?? 'Toi', score: d.myScore, streak: d.myStreak, color: theme.you }}
        bot={{ name: opp?.pseudo ?? 'Adv.', score: d.oppScore, streak: d.oppStreak, color: theme.bot }}
      />

      <View style={styles.progressWrap}>
        <View style={styles.progressHead}>
          <Text style={styles.qnum}>
            Question {d.questionNumber}/{d.totalQuestions}
          </Text>
          {d.isLast && <Text style={styles.doubleBadge}>DERNIÈRE · POINTS ×2</Text>}
        </View>
        <View style={styles.timerTrack}>
          <View style={[styles.timerFill, { width: `${timePct * 100}%`, backgroundColor: timePct < 0.3 ? theme.wrong : neon }]} />
        </View>
      </View>

      <View style={[styles.qCard, { borderColor: `${neon}55` }]}>
        <Text style={[styles.category, { color: neon }]}>{cat ? cat.label : ''}</Text>
        <Text style={styles.prompt}>{d.question.prompt}</Text>
      </View>

      <View style={styles.answersWrap}>
        <View style={styles.row}>
          {cell(0)}
          {cell(1)}
        </View>
        <View style={styles.row}>
          {cell(2)}
          {cell(3)}
        </View>
      </View>

      {revealed && (
        <Text style={styles.revealStatus}>
          {d.oppSelected != null ? 'Manche terminée — question suivante…' : "En attente de l'adversaire…"}
        </Text>
      )}
    </View>
  );
}

function OnlineResult({ match, me, onLeave }: { match: Match; me: Profile; onLeave: () => void }) {
  const { myScore, oppScore } = finalScores(match, me.uid);
  const oppId = match.playerIds.find((u) => u !== me.uid);
  const opp = oppId ? match.players[oppId] : undefined;
  const draw = myScore === oppScore;
  const win = myScore > oppScore;

  useEffect(() => {
    playSound(win ? 'win' : draw ? 'win' : 'lose');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.center}>
      <ThemedBackground />
      <Text style={[styles.verdict, { color: draw ? theme.textDim : win ? theme.correct : theme.wrong }]}>
        {draw ? 'ÉGALITÉ' : win ? 'VICTOIRE' : 'DÉFAITE'}
      </Text>
      <View style={styles.resultRow}>
        <View style={styles.resultSide}>
          <Avatar config={match.players[me.uid]?.avatar} size={64} />
          <Text style={[styles.resultName, { color: theme.you }]}>{match.players[me.uid]?.pseudo ?? 'Toi'}</Text>
          <Text style={styles.resultScore}>{myScore}</Text>
        </View>
        <Text style={styles.vsTxt}>—</Text>
        <View style={styles.resultSide}>
          <Avatar config={opp?.avatar} size={64} />
          <Text style={[styles.resultName, { color: theme.bot }]}>{opp?.pseudo ?? 'Adv.'}</Text>
          <Text style={styles.resultScore}>{oppScore}</Text>
        </View>
      </View>
      <Pressable style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]} onPress={onLeave}>
        <Text style={styles.primaryTxt}>RETOUR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  title: { color: theme.text, fontSize: 34, fontFamily: theme.fonts.black, letterSpacing: 2, marginBottom: 28 },

  vsRow: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 28 },
  vsSide: { alignItems: 'center', gap: 8 },
  vsName: { fontSize: 15, fontFamily: theme.fonts.extraBold },
  vsTxt: { color: theme.textDim, fontSize: 16, fontFamily: theme.fonts.black },
  status: { color: theme.textDim, fontSize: 15, fontFamily: theme.fonts.semiBold, textAlign: 'center', marginBottom: 32, lineHeight: 21 },
  leave: { borderWidth: 2, borderColor: theme.surfaceAlt, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 30 },
  leaveTxt: { color: theme.textDim, fontSize: 14, fontFamily: theme.fonts.bold },

  // Duel
  playContainer: { flex: 1, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 16 },
  progressWrap: { marginTop: 14 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  qnum: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.semiBold },
  doubleBadge: { color: theme.accent, fontSize: 11, fontFamily: theme.fonts.black, letterSpacing: 0.5, borderWidth: 1, borderColor: theme.accent, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 2, overflow: 'hidden' },
  timerTrack: { height: 8, borderRadius: 4, backgroundColor: theme.surfaceAlt, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 4 },
  qCard: { backgroundColor: theme.surface, borderRadius: 18, padding: 20, marginTop: 16, borderWidth: 1 },
  category: { fontSize: 12, fontFamily: theme.fonts.extraBold, textTransform: 'uppercase', letterSpacing: 1 },
  prompt: { color: theme.text, fontSize: 22, fontFamily: theme.fonts.extraBold, marginTop: 8, lineHeight: 30 },
  answersWrap: { flex: 1, marginTop: 14 },
  row: { flexDirection: 'row', flex: 1 },
  cell: { flex: 1, margin: 6 },
  revealStatus: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.semiBold, textAlign: 'center', marginTop: 4 },

  // Résultat
  verdict: { fontSize: 40, fontFamily: theme.fonts.black, letterSpacing: 1, marginBottom: 30 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 40 },
  resultSide: { alignItems: 'center', gap: 6 },
  resultName: { fontSize: 14, fontFamily: theme.fonts.extraBold },
  resultScore: { color: theme.text, fontSize: 40, fontFamily: theme.fonts.black },
  primary: { backgroundColor: theme.primary, borderRadius: 999, paddingVertical: 15, paddingHorizontal: 60 },
  primaryTxt: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.black, letterSpacing: 1 },
});
