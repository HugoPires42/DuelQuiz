import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, View, Text, Pressable, StyleSheet } from 'react-native';
import { useDuel } from '../game/useDuel';
import { QUESTION_TIME_MS } from '../game/scoring';
import { categoryById } from '../game/categories';
import { hapticSuccess, hapticError } from '../game/haptics';
import { AnswerButton, AnswerState } from '../components/AnswerButton';
import { ScoreBar } from '../components/ScoreBar';
import { Countdown } from '../components/Countdown';
import { ThemedBackground } from '../components/ThemedBackground';
import { ResultScreen } from './ResultScreen';
import { theme } from '../theme';

const useNative = Platform.OS !== 'web';

export interface Matchup {
  youLabel: string;
  botLabel: string;
}

interface Props {
  categoryIds?: string[]; // thèmes du duel ; undefined = tous les thèmes
  matchup?: Matchup | null; // thèmes choisis (mode « Duel de thèmes »)
  onHome: () => void;
}

export function DuelScreen({ categoryIds, matchup, onHome }: Props) {
  const d = useDuel(7, categoryIds);

  // Entrée de la carte question (rejouée à chaque nouvelle question).
  const cardAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    cardAnim.setValue(0);
    Animated.timing(cardAnim, { toValue: 1, duration: 300, useNativeDriver: useNative }).start();
  }, [d.questionNumber, cardAnim]);

  // Apparition du bloc révélation.
  const revealAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (d.phase === 'reveal') {
      revealAnim.setValue(0);
      Animated.spring(revealAnim, { toValue: 1, friction: 6, useNativeDriver: useNative }).start();
    }
  }, [d.phase, revealAnim]);

  // Animation de série : « SÉRIE ×N » qui jaillit quand le joueur enchaîne.
  const streakAnim = useRef(new Animated.Value(0)).current;
  const [streakShown, setStreakShown] = useState<number | null>(null);
  useEffect(() => {
    if (d.phase === 'reveal' && d.outcome?.you.correct && d.you.streak >= 2) {
      setStreakShown(d.you.streak);
      streakAnim.setValue(0);
      Animated.sequence([
        Animated.spring(streakAnim, { toValue: 1, friction: 5, useNativeDriver: useNative }),
        Animated.delay(650),
        Animated.timing(streakAnim, { toValue: 0, duration: 320, useNativeDriver: useNative }),
      ]).start(() => setStreakShown(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.phase, d.outcome]);

  // Retour haptique à la révélation (mobile uniquement).
  useEffect(() => {
    if (d.phase === 'reveal' && d.outcome) {
      if (d.outcome.you.correct) hapticSuccess();
      else hapticError();
    }
  }, [d.phase, d.outcome]);

  if (d.phase === 'done') {
    return <ResultScreen you={d.you} bot={d.bot} onRestart={d.onRestart} onHome={onHome} />;
  }

  if (d.phase === 'intro') {
    return (
      <View style={styles.center}>
        <ThemedBackground categoryId={categoryIds ? categoryIds[0] : undefined} />
        <Text style={styles.matchup}>
          {matchup ? `${matchup.youLabel}   contre   ${matchup.botLabel}` : 'Tous les thèmes'}
        </Text>
        <Text style={styles.getReady}>Prépare-toi…</Text>
        <Countdown value={d.countdown} />
      </View>
    );
  }

  const q = d.question;
  const cat = categoryById(q.categoryId);
  const revealed = d.phase === 'reveal';
  const showAnswers = d.phase === 'playing' || revealed;
  const timePct = Math.max(0, Math.min(1, d.timeLeftMs / QUESTION_TIME_MS));
  const last = d.questionNumber >= d.totalQuestions;

  return (
    <View style={styles.container}>
      <ThemedBackground categoryId={q.categoryId} />
      <ScoreBar
        you={{ name: 'Toi', score: d.you.score, streak: d.you.streak, color: theme.you }}
        bot={{ name: 'Robo', score: d.bot.score, streak: d.bot.streak, color: theme.bot }}
      />

      <View style={styles.progressWrap}>
        <Text style={styles.qnum}>
          Question {d.questionNumber}/{d.totalQuestions}
        </Text>
        <View style={styles.timerTrack}>
          <View
            style={[
              styles.timerFill,
              { width: `${timePct * 100}%`, backgroundColor: timePct < 0.3 ? theme.wrong : theme.primary },
            ]}
          />
        </View>
      </View>

      <Animated.View
        style={{
          opacity: cardAnim,
          transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
        }}
      >
        <View style={styles.qCard}>
          <Text style={styles.category}>{cat ? cat.label : ''}</Text>
          <Text style={styles.prompt}>{q.prompt}</Text>
        </View>
      </Animated.View>

      {showAnswers && (
        <View style={styles.grid}>
          {q.options.map((opt, i) => {
            let state: AnswerState = 'idle';
            if (revealed && d.outcome) {
              if (i === d.outcome.correctIndex) state = 'correct';
              else if (i === d.selectedIndex) state = 'wrong';
              else state = 'dimmed';
            } else if (i === d.selectedIndex) {
              state = 'selected';
            }
            return (
              <View key={i} style={styles.cell}>
                <AnswerButton
                  label={opt}
                  colorIndex={i}
                  index={i}
                  state={state}
                  disabled={revealed || d.selectedIndex !== null}
                  onPress={() => d.onSelect(i)}
                />
              </View>
            );
          })}
        </View>
      )}

      {revealed && d.outcome && (
        <Animated.View
          style={[
            styles.reveal,
            { opacity: revealAnim, transform: [{ scale: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] },
          ]}
        >
          <View style={styles.pointsRow}>
            <PointTag label="Toi" pts={d.outcome.you.points} color={theme.you} time={d.outcome.you.timeMs} />
            <PointTag label="Robo" pts={d.outcome.bot.points} color={theme.bot} time={d.outcome.bot.timeMs} />
          </View>
          <Pressable style={({ pressed }) => [styles.next, pressed && { opacity: 0.85 }]} onPress={d.onNext}>
            <Text style={styles.nextTxt}>{last ? 'Voir le résultat' : 'Continuer'}</Text>
          </Pressable>
        </Animated.View>
      )}

      {streakShown != null && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.streakBurst,
            {
              opacity: streakAnim,
              transform: [{ scale: streakAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
            },
          ]}
        >
          <Text style={styles.streakBurstTxt}>SÉRIE ×{streakShown}</Text>
        </Animated.View>
      )}
    </View>
  );
}

function PointTag({ label, pts, color, time }: { label: string; pts: number; color: string; time: number | null }) {
  return (
    <View style={styles.pointTag}>
      <Text style={[styles.pointLabel, { color }]}>{label}</Text>
      <Text style={[styles.pointVal, { color: pts > 0 ? theme.correct : theme.wrong }]}>
        {pts > 0 ? `+${pts}` : '0'}
      </Text>
      <Text style={styles.pointTime}>{time != null ? `${(time / 1000).toFixed(1)}s` : '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  matchup: { color: theme.textDim, fontSize: 15, fontFamily: theme.fonts.bold, marginBottom: 10, textAlign: 'center' },
  getReady: { color: theme.textDim, fontSize: 20, fontFamily: theme.fonts.semiBold },

  progressWrap: { marginTop: 18 },
  qnum: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.semiBold, marginBottom: 6 },
  timerTrack: { height: 8, borderRadius: 4, backgroundColor: theme.surfaceAlt, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 4 },

  qCard: { backgroundColor: theme.surface, borderRadius: 18, padding: 20, marginTop: 18 },
  category: { color: theme.primary, fontSize: 12, fontFamily: theme.fonts.extraBold, textTransform: 'uppercase', letterSpacing: 1 },
  prompt: { color: theme.text, fontSize: 22, fontFamily: theme.fonts.extraBold, marginTop: 8, lineHeight: 30 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 18 },
  cell: { width: '48%', marginBottom: 14 },

  reveal: { marginTop: 4 },
  pointsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  pointTag: { alignItems: 'center' },
  pointLabel: { fontSize: 13, fontFamily: theme.fonts.extraBold },
  pointVal: { fontSize: 26, fontFamily: theme.fonts.black },
  pointTime: { color: theme.textDim, fontSize: 12, fontFamily: theme.fonts.medium },
  next: { backgroundColor: theme.primary, borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  nextTxt: { color: '#fff', fontSize: 17, fontFamily: theme.fonts.black, letterSpacing: 1 },

  streakBurst: { position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center' },
  streakBurstTxt: {
    color: theme.streak,
    fontSize: 36,
    fontFamily: theme.fonts.black,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});
