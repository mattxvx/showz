import type { EventGenre, EventStatus } from '../types';

export function formatEventDate(dateStr: string): { label: string; isTonight: boolean; isTomorrow: boolean } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'Tonight', isTonight: true, isTomorrow: false };
  } else if (diffDays === 1) {
    return { label: 'Tomorrow', isTonight: false, isTomorrow: true };
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return {
    label: eventDate.toLocaleDateString(undefined, options),
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
    case 'Indie Rock':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'Electronic':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'Jazz & Blues':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'Punk / Metal':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
    case 'Hip-Hop':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'Acoustic & Folk':
      return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' };
    case 'Synthwave':
      return { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' };
    default:
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
  }
}

export function getStatusBadge(status: EventStatus): { text: string; color: string } | null {
  switch (status) {
    case 'selling-fast':
      return { text: 'Selling Fast', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
    case 'sold-out':
      return { text: 'Sold Out', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    case 'cancelled':
      return { text: 'Cancelled', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    default:
      return null;
  }
}
