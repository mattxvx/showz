import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import type { ShowEvent } from './types';

export const firebaseConfig = {
  apiKey: "AIzaSyBRkvSsGxyENWNNeQilsA1z5CqpfXEq8jU",
  authDomain: "showz-64b94.firebaseapp.com",
  projectId: "showz-64b94",
  storageBucket: "showz-64b94.firebasestorage.app",
  messagingSenderId: "967891146109",
  appId: "1:967891146109:web:2225af8ac8b5bb7f246814",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

const SHOWS_COLLECTION = 'shows';

/**
 * Save or update a show in Cloud Firestore.
 * Flyer image is stored directly inside the Firestore document payload
 * (compressed to ~50KB), bypassing Firebase Storage completely.
 * This ensures the app is 100% FREE with ZERO billing / Blaze account required.
 */
export async function syncShowToCloud(show: ShowEvent): Promise<void> {
  try {
    const showRef = doc(db, SHOWS_COLLECTION, show.id);
    await setDoc(
      showRef,
      {
        ...show,
        cloudUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to sync show to Firestore:', err);
    throw err;
  }
}

/**
 * Delete a show from Cloud Firestore
 */
export async function deleteShowFromCloud(showId: string): Promise<void> {
  try {
    const showRef = doc(db, SHOWS_COLLECTION, showId);
    await deleteDoc(showRef);
  } catch (err) {
    console.error('Failed to delete show from Firestore:', err);
    throw err;
  }
}

/**
 * Real-time listener for all shows in Firestore
 */
export function subscribeToCloudShows(
  onShowsUpdate: (shows: ShowEvent[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const q = query(collection(db, SHOWS_COLLECTION), orderBy('date', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const cloudShows: ShowEvent[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ShowEvent;
          cloudShows.push({
            ...data,
            id: docSnap.id,
          });
        });
        onShowsUpdate(cloudShows);
      },
      (err) => {
        console.warn('Firestore subscription notice (using offline local shows):', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn('Could not establish Firestore listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}
