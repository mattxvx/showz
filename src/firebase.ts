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
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
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
export const storage = getStorage(app);

const SHOWS_COLLECTION = 'shows';

/**
 * Uploads a base64 or dataURL image to Firebase Storage,
 * returning the public download URL. Falls back to original string if upload fails.
 */
export async function uploadFlyerImage(showId: string, dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:image')) {
    return dataUrl; // Already a regular URL
  }
  try {
    const storageRef = ref(storage, `flyers/${showId}_${Date.now()}.jpg`);
    await uploadString(storageRef, dataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase Storage upload notice (using compressed data fallback):', err);
    return dataUrl;
  }
}

/**
 * Save or update a show in Cloud Firestore
 */
export async function syncShowToCloud(show: ShowEvent): Promise<void> {
  try {
    let flyerUrl = show.flyerUrl;
    if (flyerUrl && flyerUrl.startsWith('data:image')) {
      flyerUrl = await uploadFlyerImage(show.id, flyerUrl);
    }

    const showRef = doc(db, SHOWS_COLLECTION, show.id);
    await setDoc(
      showRef,
      {
        ...show,
        flyerUrl,
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
