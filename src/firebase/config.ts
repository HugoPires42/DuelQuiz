import { Platform } from 'react-native';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// ⚠️ À REMPLACER par la config de ta console Firebase :
//    Paramètres du projet (⚙️) → section « Tes applications » → app Web → SDK config.
const firebaseConfig = {
  apiKey: 'REMPLACE_MOI',
  authDomain: 'REMPLACE_MOI',
  projectId: 'REMPLACE_MOI',
  storageBucket: 'REMPLACE_MOI',
  messagingSenderId: 'REMPLACE_MOI',
  appId: 'REMPLACE_MOI',
};

/** Vrai une fois la vraie config collée. Tant que c'est faux, l'app tourne
 *  normalement (jeu solo) et les fonctions réseau sont désactivées. */
export const isFirebaseConfigured =
  firebaseConfig.apiKey !== 'REMPLACE_MOI' && firebaseConfig.apiKey.length > 10;

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
