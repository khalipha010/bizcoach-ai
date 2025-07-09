import { getAuth, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';

/**
 * Prompts for password, reauthenticates user, then deletes Firebase Auth user.
 * Throws error if reauthentication fails or user is not signed in.
 */
export async function reAuthAndDeleteUser(password) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in.');
  if (!user.email) throw new Error('User does not have an email.');
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteUser(user);
}
