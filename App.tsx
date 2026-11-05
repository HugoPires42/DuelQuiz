import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { DuelScreen, Matchup } from './src/screens/DuelScreen';
import { categoryLabel, randomCategory } from './src/game/categories';
import { theme } from './src/theme';

type Screen = 'home' | 'theme' | 'duel';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [categoryIds, setCategoryIds] = useState<string[] | undefined>(undefined);
  const [matchup, setMatchup] = useState<Matchup | null>(null);

  // Mode « Tous les thèmes » : toutes les catégories mélangées.
  const startAllThemes = () => {
    setCategoryIds(undefined);
    setMatchup(null);
    setScreen('duel');
  };

  // Mode « Duel de thèmes » : le joueur choisit, le bot tire un autre thème,
  // les questions sont un mix des deux.
  const pickYourTheme = (yourId: string) => {
    const botCat = randomCategory([yourId]);
    setCategoryIds([yourId, botCat.id]);
    setMatchup({ youLabel: categoryLabel(yourId), botLabel: botCat.label });
    setScreen('duel');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.inner}>
        {screen === 'home' && (
          <HomeScreen onDuelThemes={() => setScreen('theme')} onAllThemes={startAllThemes} />
        )}
        {screen === 'theme' && (
          <CategoryScreen onPick={pickYourTheme} onBack={() => setScreen('home')} />
        )}
        {screen === 'duel' && (
          <DuelScreen categoryIds={categoryIds} matchup={matchup} onHome={() => setScreen('home')} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  inner: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center' },
});
