import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, View, Text, StyleSheet } from 'react-native';
import { useDuel } from '../game/useDuel';
import { QUESTION_TIME_MS } from '../game/scoring';
import { categoryById } from '../game/categories';
import { hapticSuccess, hapticError } from '../game/haptics';
import { AnswerButton, AnswerState } from '../components/AnswerButton';
import { ScoreBar } from '../components/ScoreBar';
import { ThemeBanner } from '../components/ThemeBanner';
import { ThemedBackground } from '../components/ThemedBackground';
import { ResultScreen } from './ResultScreen';
import { theme } from '../theme';

const useNative = Platform.OS !== 'web';

export interface Matchup {
  youLabel: string;
  botLabel: string;
}

interface Props {
  categoryIds?: string[];
  matchup?: Matchup | null;
  onHome: () => void;
}

export function DuelScreen({ categoryIds, onHome }: Props) {
  const d = useDuel(7, categoryIds);

  const qT = useRef(new Animated.Value(0)).current; // 0 = lecture (grand/centré) → 1 = réponse (en haut)
  const chrome = useRef(new Animated.Value(0)).current; // score + progression + réponses

  // Morph question (lecture → réponse) + apparition du « chrome ».
  useEffect(() => {
    if (d.phase === 'themeIntro' || d.phase === 'reading') {
      qT.setValue(0);
      Animated.timing(chrome, { toValue: 0, duration: 180, useNativeDriver: useNative }).start();
    } else if (d.phase === 'playing') {
      Animated.parallel([
        Animated.timing(qT, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.cubic), useNativeDriver: useNative }),
        Animated.timing(chrome, { toValue: 1, duration: 420, delay: 160, useNativeDriver: useNative }),
      ]).start();
    }
  }, [d.phase, qT, chrome]);

  // Feedback haptique instantané dès que le joueur répond.
  useEffect(() => {
    if (d.selectedIndex == null || !d.question) return;
    if (d.selectedIndex === d.question.correctIndex) hapticSuccess();
    else hapticError();
  }, [d.selectedIndex, d.question]);

  // Animation de série.
  const streakAnim = useRef(new Animated.Value(0)).current;
  const [streakShown, setStreakShown] = useState<number | null>(null);
  useEffect(() => {
    if (d.phase === 'reveal' && d.outcome?.you.correct && d.you.streak >= 2) {
      setStreakShown(d.you.streak);
      streakAnim.setValue(0);
      Animated.sequence([
        Animated.spring(streakAnim, { toValue: 1, friction: 5, useNativeDriver: useNative }),
        Animated.delay(500),
        Animated.timing(streakAnim, { toValue: 0, duration: 300, useNativeDriver: useNative }),
      ]).start(() => setStreakShown(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.phase, d.outcome]);

  if (d.phase === 'done') {
    return <ResultScreen you={d.you} bot={d.bot} onRestart={d.onRestart} onHome={onHome} />;
  }

  const q = d.question;
  const cat = categoryById(q.categoryId);
  const neon = cat?.neon ?? theme.primary;
  const label = cat?.label ?? '';
  const revealed = d.phase === 'reveal';
  const feedback = d.selectedIndex != null || revealed; // feedback dès qu'on répond
  const showAnswers = d.phase === 'playing' || revealed;
  const timePct = Math.max(0, Math.min(1, d.timeLeftMs / QUESTION_TIME_MS));

  const translateY = qT.interpolate({ inputRange: [0, 1], outputRange: [240, 0] });
  const scale = qT.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] });

  return (
    <View style={styles.container}>
      <ThemedBackground categoryId={q.categoryId} />

      {d.phase === 'themeIntro' && <ThemeBanner label={label} color={neon} />}

      {/* Chrome : score + progression */}
      <Animated.View style={{ opacity: chrome }}>
        <ScoreBar
          you={{ name: 'Toi', score: d.you.score, streak: d.you.streak, color: theme.you }}
          bot={{ name: 'Robo', score: d.bot.score, streak: d.bot.streak, color: theme.bot }}
        />
        <View style={styles.progressWrap}>
          <Text style={styles.qnum}>
            Question {d.questionNumber}/{d.totalQuestions}
          </Text>
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
            <Text style={styles.prompt}>{q.prompt}</Text>
          </View>
        </Animated.View>
      )}

      {/* Réponses (néon de la couleur du thème) + feedback instantané */}
      {showAnswers && (
        <Animated.View style={[styles.answersWrap, { opacity: chrome }]}>
          <View style={styles.grid}>
            {q.options.map((opt, i) => {
              let state: AnswerState = 'idle';
              if (feedback) {
                if (i === q.correctIndex) state = 'correct';
                else if (i === d.selectedIndex) state = 'wrong';
                else state = 'dimmed';
              }
              return (
                <View key={i} style={styles.cell}>
                  <AnswerButton label={opt} neonColor={neon} state={state} disabled={feedback} onPress={() => d.onSelect(i)} />
                </View>
              );
            })}
          </View>

          {revealed && d.outcome && (
            <View style={styles.pointsRow}>
              <PointTag label="Toi" pts={d.outcome.you.points} color={theme.you} time={d.outcome.you.timeMs} />
              <PointTag label="Robo" pts={d.outcome.bot.points} color={theme.bot} time={d.outcome.bot.timeMs} />
            </View>
          )}
        </Animated.View>
      )}

      {streakShown != null && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.streakBurst,
            { opacity: streakAnim, transform: [{ scale: streakAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] },
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
      <Text style={[styles.pointVal, { color: pts > 0 ? theme.correct : theme.wrong }]}>{pts > 0 ? `+${pts}` : '0'}</Text>
      <Text style={styles.pointTime}>{time != null ? `${(time / 1000).toFixed(1)}s` : '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },

  progressWrap: { marginTop: 14 },
  qnum: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.semiBold, marginBottom: 6 },
  timerTrack: { height: 8, borderRadius: 4, backgroundColor: theme.surfaceAlt, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 4 },

  qCard: { backgroundColor: theme.surface, borderRadius: 18, padding: 20, marginTop: 16, borderWidth: 1 },
  category: { fontSize: 12, fontFamily: theme.fonts.extraBold, textTransform: 'uppercase', letterSpacing: 1 },
  prompt: { color: theme.text, fontSize: 23, fontFamily: theme.fonts.extraBold, marginTop: 8, lineHeight: 31 },

  answersWrap: { marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '48%', marginBottom: 14 },

  pointsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 2 },
  pointTag: { alignItems: 'center' },
  pointLabel: { fontSize: 13, fontFamily: theme.fonts.extraBold },
  pointVal: { fontSize: 26, fontFamily: theme.fonts.black },
  pointTime: { color: theme.textDim, fontSize: 12, fontFamily: theme.fonts.medium },

  streakBurst: { position: 'absolute', top: '42%', left: 0, right: 0, alignItems: 'center' },
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
