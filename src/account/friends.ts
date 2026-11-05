import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { getFirebase } from '../firebase/config';
import { Profile } from './account';
import { AvatarConfig, DEFAULT_AVATAR_CONFIG } from '../avatar/types';

export interface FriendRequest {
  id: string;
  from: string;
  to: string;
  fromPseudo: string;
  fromTag: string;
  fromAvatar: AvatarConfig;
}

export interface Friend {
  uid: string;
  pseudo: string;
  tag: string;
  avatar: AvatarConfig;
  level: number;
}

const usernameKey = (pseudo: string, tag: string) => `${pseudo.trim().toLowerCase()}#${tag}`;
const pairId = (a: string, b: string) => [a, b].sort().join('_');

/** Cherche un joueur par « Pseudo#1234 ». Renvoie son uid, ou null si introuvable. */
export async function findUserByTag(input: string): Promise<string | null> {
  const fb = getFirebase();
  if (!fb) return null;
  const m = input.trim().match(/^(.+)#(\d{1,4})$/);
  if (!m) throw new Error('Format attendu : Pseudo#1234');
  const key = usernameKey(m[1], m[2].padStart(4, '0'));
  const snap = await getDoc(doc(fb.db, 'usernames', key));
  if (!snap.exists()) return null;
  return (snap.data() as { uid: string }).uid;
}

/** Envoie une demande d'ami à « Pseudo#1234 ». */
export async function sendFriendRequest(me: Profile, input: string): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  const targetUid = await findUserByTag(input);
  if (!targetUid) throw new Error('Joueur introuvable.');
  if (targetUid === me.uid) throw new Error("Tu ne peux pas t'ajouter toi-même.");

  const friendship = await getDoc(doc(fb.db, 'friendships', pairId(me.uid, targetUid)));
  if (friendship.exists()) throw new Error('Vous êtes déjà amis.');

  // id déterministe pour éviter les doublons de demande.
  await setDoc(doc(fb.db, 'friendRequests', `${me.uid}_${targetUid}`), {
    from: me.uid,
    to: targetUid,
    fromPseudo: me.pseudo,
    fromTag: me.tag,
    fromAvatar: me.avatar ?? DEFAULT_AVATAR_CONFIG,
    createdAt: serverTimestamp(),
  });
}

/** Demandes reçues (en attente). */
export async function getIncomingRequests(uid: string): Promise<FriendRequest[]> {
  const fb = getFirebase();
  if (!fb) return [];
  const q = query(collection(fb.db, 'friendRequests'), where('to', '==', uid));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => {
    const x = d.data() as Omit<FriendRequest, 'id'>;
    return { id: d.id, ...x };
  });
}

/** Accepte une demande : crée l'amitié et supprime la demande. */
export async function acceptRequest(req: FriendRequest, myUid: string): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await setDoc(doc(fb.db, 'friendships', pairId(req.from, myUid)), {
    users: [req.from, myUid],
    since: serverTimestamp(),
  });
  await deleteDoc(doc(fb.db, 'friendRequests', req.id));
}

export async function declineRequest(reqId: string): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await deleteDoc(doc(fb.db, 'friendRequests', reqId));
}

/** Liste des amis (avec leur profil à jour). */
export async function getFriends(uid: string): Promise<Friend[]> {
  const fb = getFirebase();
  if (!fb) return [];
  const q = query(collection(fb.db, 'friendships'), where('users', 'array-contains', uid));
  const snaps = await getDocs(q);
  const otherUids = snaps.docs
    .map((d) => (d.data() as { users: string[] }).users.find((u) => u !== uid))
    .filter((u): u is string => !!u);

  const friends: Friend[] = [];
  for (const ouid of otherUids) {
    const u = await getDoc(doc(fb.db, 'users', ouid));
    if (u.exists()) {
      const p = u.data() as Profile;
      friends.push({ uid: ouid, pseudo: p.pseudo, tag: p.tag, avatar: p.avatar, level: p.level ?? 1 });
    }
  }
  return friends;
}

export async function removeFriend(myUid: string, friendUid: string): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await deleteDoc(doc(fb.db, 'friendships', pairId(myUid, friendUid)));
}
