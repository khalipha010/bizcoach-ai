import { getAuth, deleteUser } from 'firebase/auth';

/**
 * Deletes the currently signed-in user's Firebase Authentication profile.
 * Returns a promise that resolves if successful, rejects with error otherwise.
 */
export async function deleteCurrentUserProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('No user is currently signed in.');
  return deleteUser(user);
}
