import type { ShowEvent } from '../types';
import { getInitialSampleShows } from '../data/sampleShows';

const STORAGE_KEY = 'gigpulse_shows_v1';
const FAVORITES_KEY = 'gigpulse_favorites_v1';

export function loadShowsFromStorage(): ShowEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleShows();
      saveShowsToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialSampleShows();
    saveShowsToStorage(initial);
    return initial;
  } catch (err) {
    console.error('Failed to read shows from storage:', err);
    return getInitialSampleShows();
  }
}

export function saveShowsToStorage(shows: ShowEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shows));
  } catch (err) {
    console.error('Failed to save shows to storage:', err);
  }
}

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favs: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch (err) {
    console.error('Failed to save favorites:', err);
  }
}

export function exportShowsAsJSON(shows: ShowEvent[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(shows, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `gigpulse-shows-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importShowsFromJSON(jsonString: string): ShowEvent[] {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid format: root must be an array of shows');
  }
  // Validate basic fields
  for (const item of parsed) {
    if (!item.id || !item.title || !item.venue || !item.date) {
      throw new Error('Invalid show record found in JSON file');
    }
  }
  saveShowsToStorage(parsed);
  return parsed;
}

export function resetShowsToDefaults(): ShowEvent[] {
  const initial = getInitialSampleShows();
  saveShowsToStorage(initial);
  return initial;
}
