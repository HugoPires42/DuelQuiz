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
const fmt = (p: number) => (p > 0 ? `+${p}` : '0');

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
  const chrome = useRef(new Animated.Value(0)).current;

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
  const feedback = d.selectedIndex != null || revealed;
  const showAnswers = d.phase === 'playing' || revealed;
  const isLast = d.questionNumber === d.totalQuestions;
  const timePct = Math.max(0, Math.min(1, d.timeLeftMs / QUESTION_TIME_MS));

  const translateY = qT.interpolate({ inputRange: [0, 1], outputRange: [240, 0] });
  const scale = qT.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] });

  const cellState = (i: number): AnswerState => {
    if (!feedback) return 'idle';
    if (i === q.correctIndex) return 'correct';
    if (i === d.selectedIndex) return 'wrong';
    return 'dimmed';
  };

  const renderCell = (i: number) => (
    <View key={i} style={styles.cell}>
      <AnswerButton label={q.options[i]} neonColor={neon} state={cellState(i)} disabled={feedback} onPress={() => d.onSelect(i)} />
    </View>
  );

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
          <View style={styles.progressHead}>
            <Text style={styles.qnum}>
              Question {d.questionNumber}/{d.totalQuestions}
            </Text>
            {isLast && <Text style={styles.doubleBadge}>DERNIÈRE · POINTS ×2</Text>}
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
            <Text style={styles.prompt}>{q.prompt}</Text>
          </View>
        </Animated.View>
      )}

      {/* Réponses : 2 lignes qui remplissent la hauteur, néon de la couleur du thème */}
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

      {/* Points de la manche (incrustation, n'affecte pas la taille des cases) */}
      {revealed && d.outcome && (
        <View style={styles.pointsOverlay} pointerEvents="none">
          <View style={styles.pointsPill}>
            <Text style={styles.pointsTxt}>
              <Text style={{ color: theme.you }}>Toi {fmt(d.outcome.you.points)}</Text>
              <Text style={{ color: theme.textDim }}>{'    ·    '}</Text>
              <Text style={{ color: theme.bot }}>Robo {fmt(d.outcome.bot.points)}</Text>
            </Text>
          </View>
        </View>
      )}

      {streakShown != null && (
        <Animated.View
          pointerEvents="none"
          style={[styles.streakBurst, { opacity: streakAnim, transform: [{ scale: streakAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }]}
        >
          <Text style={styles.streakBurstTxt}>SÉRIE ×{streakShown}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 16 },

  progressWrap: { marginTop: 14 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  qnum: { color: theme.textDim, fontSize: 13, fontFamily: theme.fonts.semiBold },
  doubleBadge: {
    color: theme.accent,
    fontSize: 11,
    fontFamily: theme.fonts.black,
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: theme.accent,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  timerTrack: { height: 8, borderRadius: 4, backgroundColor: theme.surfaceAlt, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 4 },

  qCard: { backgroundColor: theme.surface, borderRadius: 18, padding: 20, marginTop: 16, borderWidth: 1 },
  category: { fontSize: 12, fontFamily: theme.fonts.extraBold, textTransform: 'uppercase', letterSpacing: 1 },
  prompt: { color: theme.text, fontSize: 23, fontFamily: theme.fonts.extraBold, marginTop: 8, lineHeight: 31 },

  answersWrap: { flex: 1, marginTop: 14 },
  row: { flexDirection: 'row', flex: 1 },
  cell: { flex: 1, margin: 6 },

  pointsOverlay: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  pointsPill: { backgroundColor: 'rgba(10,14,31,0.72)', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  pointsTxt: { fontSize: 15, fontFamily: theme.fonts.black },

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
