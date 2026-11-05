import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, runTransaction, serverTimestamp, Firestore } from 'firebase/firestore';
import { getFirebase } from '../firebase/config';

export interface Profile {
  uid: string;
  pseudo: string;
  tag: string; // discriminateur « 0042 » → identité complète = pseudo#tag
  avatarId: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  draws: number;
}

export const DEFAULT_AVATAR = 'a1';
export const fullTag = (p: Pick<Profile, 'pseudo' | 'tag'>) => `${p.pseudo}#${p.tag}`;

function randomTag(): string {
  return String(1 + Math.floor(Math.random() * 9999)).padStart(4, '0');
}
const usernameKey = (pseudo: string, tag: string) => `${pseudo.trim().toLowerCase()}#${tag}`;

/**
 * Réserve un identifiant pseudo#tag de façon atomique (unicité garantie).
 * Essaie plusieurs tags au hasard jusqu'à en trouver un libre.
 */
async function claimUsername(db: Firestore, uid: string, pseudo: string, tries = 10): Promise<{ pseudo: string; tag: string }> {
  const clean = pseudo.trim();
  for (let i = 0; i < tries; i++) {
    const tag = randomTag();
    try {
      await runTransaction(db, async (tx) => {
        const uref = doc(db, 'usernames', usernameKey(clean, tag));
        const u = await tx.get(uref);
        if (u.exists()) throw new Error('taken');
        tx.set(uref, { uid });
      });
      return { pseudo: clean, tag };
    } catch {
      // tag déjà pris → on réessaie
    }
  }
  throw new Error('Impossible de générer un identifiant unique, réessaie.');
}

/** Connexion anonyme = compte local auto. Renvoie l'uid (ou null si non configuré). */
export async function ensureSignedIn(): Promise<string | null> {
  const fb = getFirebase();
  if (!fb) return null;
  if (fb.auth.currentUser) return fb.auth.currentUser.uid;
  const cred = await signInAnonymously(fb.auth);
  return cred.user.uid;
}

/** Crée le profil au 1er lancement (pseudo par défaut + tag unique), sinon le renvoie. */
export async function ensureProfile(uid: string): Promise<Profile | null> {
  const fb = getFirebase();
  if (!fb) return null;
  const ref = doc(fb.db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as Profile;

  const { pseudo, tag } = await claimUsername(fb.db, uid, 'Joueur');
  const profile: Profile = {
    uid, pseudo, tag, avatarId: DEFAULT_AVATAR,
    level: 1, xp: 0, wins: 0, losses: 0, draws: 0,
  };
  await setDoc(ref, { ...profile, createdAt: serverTimestamp() });
  return profile;
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const fb = getFirebase();
  if (!fb) return null;
  const snap = await getDoc(doc(fb.db, 'users', uid));
  return snap.exists() ? (snap.data() as Profile) : null;
}

/** Change le pseudo : réserve un nouvel identifiant unique et libère l'ancien. */
export async function setPseudo(uid: string, newPseudo: string): Promise<Profile | null> {
  const fb = getFirebase();
  if (!fb) return null;
  const clean = newPseudo.trim();
  if (clean.length < 2 || clean.length > 16) throw new Error('Le pseudo doit faire 2 à 16 caractères.');

  const ref = doc(fb.db, 'users', uid);
  const current = (await getDoc(ref)).data() as Profile | undefined;

  const { pseudo, tag } = await claimUsername(fb.db, uid, clean);
  await setDoc(ref, { pseudo, tag }, { merge: true });

  // Libère l'ancien identifiant (best effort).
  if (current && (current.pseudo !== pseudo || current.tag !== tag)) {
    try {
      await deleteDoc(doc(fb.db, 'usernames', usernameKey(current.pseudo, current.tag)));
    } catch {
      // ignore
    }
  }
  return { ...(current as Profile), pseudo, tag };
}
