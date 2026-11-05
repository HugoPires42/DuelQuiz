import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { DuelScreen } from './src/screens/DuelScreen';
import { theme } from './src/theme';

type Screen = 'home' | 'category' | 'duel';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [categoryId, setCategoryId] = useState<string>('all');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.inner}>
        {screen === 'home' && <HomeScreen onStart={() => setScreen('category')} />}
        {screen === 'category' && (
          <CategoryScreen
            onPick={(id) => {
              setCategoryId(id);
              setScreen('duel');
            }}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'duel' && <DuelScreen categoryId={categoryId} onHome={() => setScreen('home')} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  inner: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center' },
});
