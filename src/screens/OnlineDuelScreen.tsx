import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedBackground } from '../components/ThemedBackground';
import { Avatar } from '../components/Avatar';
import { ScoreBar } from '../components/ScoreBar';
import { ThemeBanner } from '../components/ThemeBanner';
import { Countdown } from '../components/Countdown';
import { AnswerButton, AnswerState } from '../components/AnswerButton';
import { Match, listenMatch, leaveMatch } from '../online/match';
import { useOnlineDuel, finalScores } from '../online/useOnlineDuel';
import { QUESTION_TIME_MS } from '../game/scoring';
import { categoryById } from '../game/categories';
import { playSound } from '../game/sounds';
import { hapticSuccess, hapticError } from '../game/haptics';
import { Profile } from '../account/account';
import { theme } from '../theme';

const useNative = Platform.OS !== 'web';

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

function OnlineDuelPlay({ matchId, match, myUid }: { matchId: string; match: Match; myUid: string; onQuit: () => void }) {
  const d = useOnlineDuel(matchId, match, myUid);
  const me = match.players[myUid];
  const opp = match.players[d.oppUid];
  const cat = d.question ? categoryById(d.question.categoryId) : undefined;
  const neon = cat?.neon ?? theme.primary;
  const label = cat?.label ?? '';

  // Morph de la carte question (lecture grand/centré → réponse en haut) + chrome.
  const qT = useRef(new Animated.Value(0)).current;
  const chrome = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (d.phase === 'themeIntro' || d.phase === 'reading') {
      qT.setValue(0);
      Animated.timing(chrome, { toValue: 0, duration: 180, useNativeDriver: useNative }).start();
    } else if (d.phase === 'playing' || d.phase === 'reveal') {
      Animated.parallel([
        Animated.timing(qT, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.cubic), useNativeDriver: useNative }),
        Animated.timing(chrome, { toValue: 1, duration: 420, delay: 160, useNativeDriver: useNative }),
      ]).start();
    }
  }, [d.phase, qT, chrome]);

  // Compte à rebours : tic sur 3-2-1, cloche sur GO.
  useEffect(() => {
    if (d.phase !== 'countdown') return;
    if (d.countdownValue > 0) playSound('tick');
    else playSound('bell');
  }, [d.phase, d.countdownValue]);

  // Swoosh à l'arrivée du thème.
  useEffect(() => {
    if (d.phase === 'themeIntro') playSound('swoosh');
  }, [d.phase]);

  // Feedback instantané (haptique + son) dès que je réponds.
  const prevSel = useRef<number | null>(null);
  useEffect(() => {
    if (d.mySelected == null || !d.question) {
      prevSel.current = null;
      return;
    }
    if (prevSel.current === d.mySelected) return;
    prevSel.current = d.mySelected;
    if (d.mySelected === d.question.correctIndex) {
      hapticSuccess();
      playSound('correct');
    } else {
      hapticError();
      playSound('wrong');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.mySelected]);

  // Son des points qui se remplissent à la révélation.
  useEffect(() => {
    if (d.phase === 'reveal') playSound('points');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.phase]);

  if (!d.question) {
    return (
      <View style={styles.center}>
        <ThemedBackground />
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  // Compte à rebours de début de match (3-2-1-GO).
  if (d.phase === 'countdown') {
    return (
      <View style={styles.center}>
        <ThemedBackground categoryId={d.question.categoryId} />
        <Text style={styles.getReady}>Prépare-toi au combat…</Text>
        <Countdown value={d.countdownValue} />
      </View>
    );
  }

  const revealed = d.phase === 'reveal';
  const feedback = d.mySelected != null || revealed;
  const showAnswers = d.phase === 'playing' || revealed;
  const timePct = Math.max(0, Math.min(1, d.timeLeftMs / QUESTION_TIME_MS));

  const translateY = qT.interpolate({ inputRange: [0, 1], outputRange: [240, 0] });
  const scale = qT.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] });

  const cellState = (i: number): AnswerState => {
    if (!feedback) return 'idle';
    if (i === d.correctIndex) return 'correct';
    if (i === d.mySelected) return 'wrong';
    return 'dimmed';
  };
  const renderCell = (i: number) => (
    <View key={i} style={styles.cell}>
      <AnswerButton label={d.question.options[i]} neonColor={neon} state={cellState(i)} disabled={feedback} onPress={() => d.onSelect(i)} />
    </View>
  );

  return (
    <View style={styles.playContainer}>
      <ThemedBackground categoryId={d.question.categoryId} />

      {d.phase === 'themeIntro' && <ThemeBanner label={label} color={neon} />}

      {/* Chrome : score + progression (fondu à l'entrée de la phase réponse) */}
      <Animated.View style={{ opacity: chrome }}>
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
      </Animated.View>

      {/* Carte question : grande/centrée (lecture) → petite/en haut (réponse) */}
      {d.phase !== 'themeIntro' && (
        <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
          <View style={[styles.qCard, { borderColor: `${neon}55` }]}>
            <Text style={[styles.category, { color: neon }]}>{label}</Text>
            <Text style={styles.prompt}>{d.question.prompt}</Text>
          </View>
        </Animated.View>
      )}

      {/* Réponses : 2 lignes qui remplissent la hauteur */}
      {showAnswers && (
        <Animated.View style={[styles.answersWrap, { opacity: chrome }]}>
          <View style={styles.row}>
            {renderCell(0)}
            {renderCell(1)}
          </View>
          <View style={styles.row}>
            {renderCell(2)}
            {renderCell(3)}
          </View>
        </Animated.View>
      )}

      {revealed && (
        <View style={styles.revealOverlay} pointerEvents="none">
          <Text style={styles.revealStatus}>
            {d.oppSelected != null ? 'Manche terminée — question suivante…' : "En attente de l'adversaire…"}
          </Text>
        </View>
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
  getReady: { color: theme.textDim, fontSize: 20, fontFamily: theme.fonts.semiBold },
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
  revealOverlay: { position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' },
  revealStatus: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.semiBold, textAlign: 'center' },

  // Résultat
  verdict: { fontSize: 40, fontFamily: theme.fonts.black, letterSpacing: 1, marginBottom: 30 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 40 },
  resultSide: { alignItems: 'center', gap: 6 },
  resultName: { fontSize: 14, fontFamily: theme.fonts.extraBold },
  resultScore: { color: theme.text, fontSize: 40, fontFamily: theme.fonts.black },
  primary: { backgroundColor: theme.primary, borderRadius: 999, paddingVertical: 15, paddingHorizontal: 60 },
  primaryTxt: { color: '#fff', fontSize: 16, fontFamily: theme.fonts.black, letterSpacing: 1 },
});
