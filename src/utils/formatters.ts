import type { EventGenre, EventStatus } from '../types';

export function formatEventDate(dateStr: string): { label: string; isTonight: boolean; isTomorrow: boolean } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'TONIGHT', isTonight: true, isTomorrow: false };
  } else if (diffDays === 1) {
    return { label: 'TOMORROW', isTonight: false, isTomorrow: true };
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return {
    label: eventDate.toLocaleDateString(undefined, options).toUpperCase(),
    isTonight: false,
    isTomorrow: false,
  };
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const minStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour12}:${minStr} ${ampm}`;
}

export function getGenreColor(genre: EventGenre): { bg: string; text: string; border: string } {
  switch (genre) {
    case 'Beatdown / Heavy HC':
      return { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-600/70' };
    case 'Metallic Hardcore':
      return { bg: 'bg-orange-950/80', text: 'text-orange-400', border: 'border-orange-600/70' };
    case 'NYHC / Traditional':
      return { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-600/70' };
    case 'Crossover Thrash':
      return { bg: 'bg-yellow-950/80', text: 'text-yellow-400', border: 'border-yellow-600/70' };
    case 'Fast HC / Powerviolence':
      return { bg: 'bg-lime-950/80', text: 'text-lime-400', border: 'border-lime-500/70' };
    case 'Death Metal / Grind':
      return { bg: 'bg-zinc-900', text: 'text-zinc-200', border: 'border-zinc-500/70' };
    case 'Post-Hardcore / Punk':
      return { bg: 'bg-neutral-900', text: 'text-neutral-300', border: 'border-neutral-600/70' };
    default:
      return { bg: 'bg-red-950/60', text: 'text-red-300', border: 'border-red-800' };
  }
}

export function getStatusBadge(status: EventStatus): { text: string; color: string } | null {
  switch (status) {
    case 'selling-fast':
      return { text: 'LOW TICKETS', color: 'bg-red-600 text-white border-red-500 font-black animate-pulse' };
    case 'sold-out':
      return { text: 'SOLD OUT / NO DOOR', color: 'bg-neutral-900 text-neutral-400 border-neutral-700 font-black' };
    case 'cancelled':
      return { text: 'GIG CANCELLED', color: 'bg-zinc-950 text-red-500 border-red-900 font-bold' };
    default:
      return null;
  }
}
