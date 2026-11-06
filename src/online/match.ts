import {
  collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, query, where, Unsubscribe,
} from 'firebase/firestore';
import { getFirebase } from '../firebase/config';
import { Profile } from '../account/account';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../avatar/types';
import { pickQuestions } from '../game/questions';
import { Question } from '../game/types';

export interface MatchPlayer {
  pseudo: string;
  tag: string;
  avatar: AvatarConfig;
  level: number;
}

export interface Match {
  id: string;
  host: string;
  playerIds: string[];
  players: Record<string, MatchPlayer>;
  questions: Question[];
  state: 'waiting' | 'playing' | 'done';
  currentIndex: number;
  questionStartedAt: number | null; // ms epoch, posé par l'hôte
  answers: Record<string, Record<string, { i: number; t: number }>>;
  mode: 'friend';
}

export interface MatchInvite {
  id: string;
  from: string;
  to: string;
  matchId: string;
  fromPseudo: string;
  fromTag: string;
  fromAvatar: AvatarConfig;
}

const asPlayer = (p: { pseudo: string; tag: string; avatar?: AvatarConfig; level?: number }): MatchPlayer => ({
  pseudo: p.pseudo,
  tag: p.tag,
  avatar: p.avatar ?? DEFAULT_AVATAR_CONFIG,
  level: p.level ?? 1,
});

/** Crée une partie privée vs un ami + envoie l'invitation. Renvoie l'id de la partie. */
export async function createFriendMatch(
  me: Profile,
  friend: { uid: string; pseudo: string; tag: string; avatar: AvatarConfig; level: number },
): Promise<string> {
  const fb = getFirebase();
  if (!fb) throw new Error('Hors ligne');
  const matchRef = doc(collection(fb.db, 'matches'));
  await setDoc(matchRef, {
    host: me.uid,
    playerIds: [me.uid, friend.uid],
    players: { [me.uid]: asPlayer(me), [friend.uid]: asPlayer(friend) },
    questions: pickQuestions(7),
    state: 'waiting',
    currentIndex: 0,
    questionStartedAt: null,
    answers: {},
    mode: 'friend',
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(fb.db, 'matchInvites', `${friend.uid}_${matchRef.id}`), {
    from: me.uid,
    to: friend.uid,
    matchId: matchRef.id,
    fromPseudo: me.pseudo,
    fromTag: me.tag,
    fromAvatar: me.avatar ?? DEFAULT_AVATAR_CONFIG,
    createdAt: serverTimestamp(),
  });
  return matchRef.id;
}

/** Écoute en temps réel les invitations reçues. */
export function listenMatchInvites(uid: string, cb: (invites: MatchInvite[]) => void): Unsubscribe {
  const fb = getFirebase();
  if (!fb) return () => {};
  const q = query(collection(fb.db, 'matchInvites'), where('to', '==', uid));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MatchInvite, 'id'>) }))),
    () => cb([]),
  );
}

/** Accepte une invitation : lance la partie et supprime l'invite. Renvoie l'id de partie. */
export async function acceptMatchInvite(invite: MatchInvite): Promise<string> {
  const fb = getFirebase();
  if (!fb) throw new Error('Hors ligne');
  await updateDoc(doc(fb.db, 'matches', invite.matchId), { state: 'playing', questionStartedAt: Date.now() });
  await deleteDoc(doc(fb.db, 'matchInvites', invite.id));
  return invite.matchId;
}

export async function declineMatchInvite(inviteId: string): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await deleteDoc(doc(fb.db, 'matchInvites', inviteId)).catch(() => {});
}

/** Écoute en temps réel l'état d'une partie. */
export function listenMatch(matchId: string, cb: (m: Match | null) => void): Unsubscribe {
  const fb = getFirebase();
  if (!fb) return () => {};
  return onSnapshot(
    doc(fb.db, 'matches', matchId),
    (snap) => cb(snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Match, 'id'>) }) : null),
    () => cb(null),
  );
}

/** Écrit la réponse d'un joueur pour la question courante. */
export async function submitAnswer(matchId: string, uid: string, index: number, i: number, t: number): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await updateDoc(doc(fb.db, 'matches', matchId), { [`answers.${uid}.${index}`]: { i, t } });
}

/** (Hôte) Passe à la question suivante, ou termine la partie. */
export async function hostAdvance(matchId: string, nextIndex: number, done: boolean): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  if (done) await updateDoc(doc(fb.db, 'matches', matchId), { state: 'done' });
  else await updateDoc(doc(fb.db, 'matches', matchId), { currentIndex: nextIndex, questionStartedAt: Date.now() });
}

/** Quitte / annule une partie (supprime le document). */
export async function leaveMatch(matchId: string): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await deleteDoc(doc(fb.db, 'matches', matchId)).catch(() => {});
}
