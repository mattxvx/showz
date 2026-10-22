import { ShowEvent } from '../types';

function formatICSDate(dateStr: string, timeStr: string): string {
  // dateStr is YYYY-MM-DD, timeStr is HH:mm
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = timeStr.split(':');
  return `${year}${month}${day}T${hour}${minute}00`;
}

export function downloadICSFile(show: ShowEvent): void {
  const dtStart = formatICSDate(show.date, show.startTime || '20:00');
  const endTimeStr = show.endTime || '23:30';
  const dtEnd = formatICSDate(show.date, endTimeStr);

  const cleanDescription = (show.description || '')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GigPulse//Local Music Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${show.id}-${Date.now()}@gigpulse.app`,
    `DTSTAMP:${formatICSDate(new Date().toISOString().slice(0, 10), '12:00')}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${show.title}`,
    `DESCRIPTION:${cleanDescription}\\n\\nHeadliner: ${show.headliner}\\nPrice: ${show.price === 'Free' ? 'Free' : '$' + show.price}`,
    `LOCATION:${show.venue}, ${show.address}, ${show.city}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${show.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(show: ShowEvent): string {
  const start = formatICSDate(show.date, show.startTime || '20:00');
  const end = formatICSDate(show.date, show.endTime || '23:30');
  const title = encodeURIComponent(show.title);
  const details = encodeURIComponent(
    `${show.description}\n\nHeadliner: ${show.headliner}\nDoors: ${show.doorsTime}\nTickets: ${show.ticketUrl || 'At door'}`
  );
  const location = encodeURIComponent(`${show.venue}, ${show.address}, ${show.city}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export async function shareShow(show: ShowEvent): Promise<{ shared: boolean; message: string }> {
  const shareData = {
    title: show.title,
    text: `Check out ${show.headliner} live at ${show.venue} on ${show.date}!`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { shared: true, message: 'Shared successfully!' };
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Share error:', err);
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(`${show.title} @ ${show.venue} (${show.date}) - ${window.location.href}`);
    return { shared: true, message: 'Event details copied to clipboard!' };
  } catch {
    return { shared: false, message: 'Could not copy to clipboard' };
  }
}
