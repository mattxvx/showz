import React, { useEffect } from 'react';
import type { ShowEvent } from '../types';
import { formatEventDate, formatTime, getGenreColor, getStatusBadge } from '../utils/formatters';
import { downloadICSFile, getGoogleCalendarUrl, shareShow } from '../utils/calendar';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Heart,
  Share2,
  ExternalLink,
  Navigation,
  Edit2,
  Sparkles,
} from 'lucide-react';

interface ShowDetailModalProps {
  show: ShowEvent | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isAdmin: boolean;
  onEditShow?: (show: ShowEvent) => void;
}

export const ShowDetailModal: React.FC<ShowDetailModalProps> = ({
  show,
  onClose,
  isFavorite,
  onToggleFavorite,
  isAdmin,
  onEditShow,
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!show) return null;

  const dateInfo = formatEventDate(show.date);
  const genreStyle = getGenreColor(show.genre);
  const statusBadge = getStatusBadge(show.status);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${show.venue}, ${show.address}, ${show.city}`
  )}`;

  const handleShare = async () => {
    const res = await shareShow(show);
    if (!navigator.share) {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-safe bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flyer Header Image */}
        <div className="relative aspect-[16/9] w-full bg-slate-950 shrink-0">
          <img
            src={show.flyerUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'}
            alt={show.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/70 text-slate-200 hover:text-white hover:bg-slate-950 backdrop-blur-md border border-slate-700/50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                  dateInfo.isTonight
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-900/90 text-white border border-slate-700'
                }`}
              >
                {dateInfo.label} ({show.date})
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
              >
                {show.genre}
              </span>

              {statusBadge && (
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${statusBadge.color}`}
                >
                  {statusBadge.text}
                </span>
              )}
            </div>

            <button
              onClick={() => onToggleFavorite(show.id)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-900/40'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Title & Artist Section */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              {show.featured && (
                <span className="flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Featured Gig
                </span>
              )}
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {show.ageRestriction}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {show.headliner}
            </h2>
            {show.title !== show.headliner && (
              <p className="text-base text-purple-300 font-medium mt-0.5">{show.title}</p>
            )}

            {/* Lineup */}
            {show.supportActs && show.supportActs.length > 0 && (
              <div className="mt-3 flex items-start gap-2 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-400 shrink-0">Lineup:</span>
                <div>
                  <span className="font-bold text-white">{show.headliner}</span>
                  {show.supportActs.map((act, i) => (
                    <span key={i} className="text-slate-300">
                      {' '}• {act}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Venue & Schedule Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Venue Box */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Venue Location</span>
                </div>
                <h4 className="font-bold text-white text-base">{show.venue}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{show.address}</p>
                <p className="text-xs text-slate-500">{show.city}</p>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (Maps)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Schedule & Price Box */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Schedule & Entry</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Show Time:</span>
                    <span className="font-bold text-white">{formatTime(show.startTime)}</span>
                  </div>
                  {show.doorsTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Doors Open:</span>
                      <span className="text-slate-200">{formatTime(show.doorsTime)}</span>
                    </div>
                  )}
                  {show.endTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Curfew / End:</span>
                      <span className="text-slate-400">{formatTime(show.endTime)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Admission:</span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {show.price === 'Free' ? 'FREE ENTRY' : `$${show.price}`}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {show.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                About this Event
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/30 p-4 rounded-2xl border border-slate-800/60">
                {show.description}
              </p>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Ticket CTA button */}
            {show.ticketUrl ? (
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white hover:brightness-110 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                <span>Get Tickets {show.price !== 'Free' ? `($${show.price})` : ''}</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            ) : (
              <div className="w-full text-center py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800/60 text-slate-300 border border-slate-700/60">
                {show.price === 'Free' ? '🎉 Free Admission at the Door' : `Pay at Door: $${show.price}`}
              </div>
            )}

            {/* Secondary Action Row: Calendar & Share */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => downloadICSFile(show)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Apple/iCal (.ics)</span>
              </button>

              <a
                href={getGoogleCalendarUrl(show)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Google Calendar</span>
              </a>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>Share Gig</span>
              </button>
            </div>
          </div>

          {/* Admin Edit Shortcut */}
          {isAdmin && onEditShow && (
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  onClose();
                  onEditShow(show);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit this Event in Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
