import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import {
  useFonts,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { DuelScreen, Matchup } from './src/screens/DuelScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AvatarScreen } from './src/screens/AvatarScreen';
import { FriendsScreen } from './src/screens/FriendsScreen';
import { categoryLabel, randomCategory } from './src/game/categories';
import { ensureSignedIn, ensureProfile, Profile } from './src/account/account';
import { initSounds } from './src/game/sounds';
import { theme } from './src/theme';

const useNative = Platform.OS !== 'web';
type Screen = 'home' | 'theme' | 'duel' | 'profile' | 'avatar' | 'friends';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  const [screen, setScreen] = useState<Screen>('home');
  const [categoryIds, setCategoryIds] = useState<string[] | undefined>(undefined);
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Fondu enchaîné à chaque changement d'écran.
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: useNative }).start();
  }, [screen, fade]);

  // Initialise l'audio une fois.
  useEffect(() => {
    initSounds();
  }, []);

  // Compte local auto : connexion anonyme + profil, une fois au démarrage.
  useEffect(() => {
    (async () => {
      try {
        const uid = await ensureSignedIn();
        if (uid) setProfile(await ensureProfile(uid));
      } catch (e) {
        console.warn('Bootstrap du compte échoué', e);
      }
    })();
  }, []);

  // Mode « Tous les thèmes » : toutes les catégories mélangées.
  const startAllThemes = () => {
    setCategoryIds(undefined);
    setMatchup(null);
    setScreen('duel');
  };

  // Mode « Duel de thèmes » : le joueur choisit, le bot tire un autre thème.
  const pickYourTheme = (yourId: string) => {
    const botCat = randomCategory([yourId]);
    setCategoryIds([yourId, botCat.id]);
    setMatchup({ youLabel: categoryLabel(yourId), botLabel: botCat.label });
    setScreen('duel');
  };

  if (!fontsLoaded) {
    return <View style={styles.safe} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.inner, { opacity: fade }]}>
        {screen === 'home' && (
          <HomeScreen
            profile={profile}
            onProfile={() => setScreen('profile')}
            onDuelThemes={() => setScreen('theme')}
            onAllThemes={startAllThemes}
          />
        )}
        {screen === 'theme' && <CategoryScreen onPick={pickYourTheme} onBack={() => setScreen('home')} />}
        {screen === 'duel' && (
          <DuelScreen categoryIds={categoryIds} matchup={matchup} onHome={() => setScreen('home')} />
        )}
        {screen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onBack={() => setScreen('home')}
            onChange={setProfile}
            onCustomize={() => setScreen('avatar')}
            onFriends={() => setScreen('friends')}
          />
        )}
        {screen === 'avatar' && (
          <AvatarScreen profile={profile} onBack={() => setScreen('profile')} onChange={setProfile} />
        )}
        {screen === 'friends' && <FriendsScreen profile={profile} onBack={() => setScreen('home')} />}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  inner: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center' },
});
