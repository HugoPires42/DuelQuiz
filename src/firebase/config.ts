import { Platform } from 'react-native';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Config lue depuis les variables d'environnement Expo (fichier .env.local,
// NON versionné). Voir .env.example pour la liste des clés attendues.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** Vrai une fois la vraie config collée. Tant que c'est faux, l'app tourne
 *  normalement (jeu solo) et les fonctions réseau sont désactivées. */
export const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 10;

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function makeAuth(a: FirebaseApp): Auth {
  // Sur le web, getAuth() gère déjà la persistance (localStorage/IndexedDB).
  if (Platform.OS === 'web') return getAuth(a);
  // Sur mobile (React Native) : persistance de la session via AsyncStorage.
  // require() conditionnel : getReactNativePersistence n'existe que dans le build RN.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return initializeAuth(a, { persistence: getReactNativePersistence(AsyncStorage) });
}

/** Initialise Firebase une seule fois. Renvoie null si pas encore configuré. */
export function getFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    authInstance = makeAuth(app);
    dbInstance = getFirestore(app);
  }
  return { app, auth: authInstance as Auth, db: dbInstance as Firestore };
}
