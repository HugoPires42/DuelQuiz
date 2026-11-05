import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useDuel } from '../game/useDuel';
import { QUESTION_TIME_MS } from '../game/scoring';
import { AnswerButton, AnswerState } from '../components/AnswerButton';
import { ScoreBar } from '../components/ScoreBar';
import { ResultScreen } from './ResultScreen';
import { theme } from '../theme';

export function DuelScreen({ onHome }: { onHome: () => void }) {
  const d = useDuel(7);

  if (d.phase === 'done') {
    return <ResultScreen you={d.you} bot={d.bot} onRestart={d.onRestart} onHome={onHome} />;
  }

  if (d.phase === 'intro') {
    return (
      <View style={styles.center}>
        <Text style={styles.getReady}>Prépare-toi…</Text>
        <Text style={styles.count}>{d.countdown > 0 ? d.countdown : 'GO'}</Text>
      </View>
    );
  }

  const q = d.question;
  const revealed = d.phase === 'reveal';
  const timePct = Math.max(0, Math.min(1, d.timeLeftMs / QUESTION_TIME_MS));
  const last = d.questionNumber >= d.totalQuestions;

  return (
    <View style={styles.container}>
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

      <View style={styles.qCard}>
        <Text style={styles.category}>{q.category}</Text>
        <Text style={styles.prompt}>{q.prompt}</Text>
      </View>

      <View style={styles.answers}>
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
            <AnswerButton
              key={i}
              label={opt}
              colorIndex={i}
              state={state}
              disabled={revealed || d.selectedIndex !== null}
              onPress={() => d.onSelect(i)}
            />
          );
        })}
      </View>

      {revealed && d.outcome && (
        <View style={styles.reveal}>
          <View style={styles.pointsRow}>
            <PointTag label="Toi" pts={d.outcome.you.points} color={theme.you} time={d.outcome.you.timeMs} />
            <PointTag label="Robo" pts={d.outcome.bot.points} color={theme.bot} time={d.outcome.bot.timeMs} />
          </View>
          <Pressable style={({ pressed }) => [styles.next, pressed && { opacity: 0.85 }]} onPress={d.onNext}>
            <Text style={styles.nextTxt}>{last ? 'Voir le résultat →' : 'Continuer →'}</Text>
          </Pressable>
        </View>
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
  getReady: { color: theme.textDim, fontSize: 20, fontWeight: '700' },
  count: { color: theme.primary, fontSize: 96, fontWeight: '900', marginTop: 8 },

  progressWrap: { marginTop: 18 },
  qnum: { color: theme.textDim, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  timerTrack: { height: 8, borderRadius: 4, backgroundColor: theme.surfaceAlt, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 4 },

  qCard: { backgroundColor: theme.surface, borderRadius: 18, padding: 20, marginTop: 18 },
  category: { color: theme.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  prompt: { color: theme.text, fontSize: 21, fontWeight: '800', marginTop: 8, lineHeight: 28 },

  answers: { marginTop: 18 },

  reveal: { marginTop: 8 },
  pointsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  pointTag: { alignItems: 'center' },
  pointLabel: { fontSize: 13, fontWeight: '800' },
  pointVal: { fontSize: 26, fontWeight: '900' },
  pointTime: { color: theme.textDim, fontSize: 12 },
  next: { backgroundColor: theme.primary, borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  nextTxt: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 1 },
});
