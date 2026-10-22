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
  Flame,
  AlertTriangle,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-safe bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flyer Header Image */}
        <div className="relative aspect-[16/9] w-full bg-black shrink-0">
          <img
            src={show.flyerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'}
            alt={show.title}
            className="w-full h-full object-cover contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/80 text-neutral-300 hover:text-white hover:bg-black backdrop-blur-md border border-neutral-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-black backdrop-blur-md uppercase tracking-wider ${
                  dateInfo.isTonight
                    ? 'bg-red-600 text-white animate-pulse border border-red-400'
                    : 'bg-black/90 text-white border border-neutral-700'
                }`}
              >
                {dateInfo.label} ({show.date})
              </span>

              <span
                className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-md border ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
              >
                {show.genre}
              </span>

              {statusBadge && (
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-md border ${statusBadge.color}`}
                >
                  {statusBadge.text}
                </span>
              )}
            </div>

            <button
              onClick={() => onToggleFavorite(show.id)}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950'
                  : 'bg-black/80 text-neutral-300 border-neutral-700 hover:text-white'
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
                <span className="flex items-center gap-1 text-xs font-black text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-700/60 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  HEADLINER EVENT
                </span>
              )}
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                {show.ageRestriction}
              </span>
              {show.stageDivesAllowed && (
                <span className="text-xs font-black text-lime-400 bg-lime-950/80 px-2.5 py-0.5 rounded border border-lime-700/60 uppercase tracking-wider">
                  STAGE DIVES ENCOURAGED
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase hc-font">
              {show.headliner}
            </h2>
            {show.title !== show.headliner && (
              <p className="text-sm font-bold text-red-500 uppercase tracking-wide mt-1">{show.title}</p>
            )}

            {/* Lineup */}
            {show.supportActs && show.supportActs.length > 0 && (
              <div className="mt-3 p-3.5 rounded-xl bg-black border border-neutral-800 space-y-1">
                <span className="text-xs font-black text-red-400 uppercase tracking-widest block">FULL BILL:</span>
                <div className="text-sm font-bold text-neutral-200 uppercase tracking-wide">
                  <span className="text-white font-black">{show.headliner}</span>
                  {show.supportActs.map((act, i) => (
                    <span key={i} className="text-neutral-400">
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
            <div className="bg-black/80 p-4 rounded-2xl border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>VENUE / LOCATION</span>
                </div>
                <h4 className="font-black text-white text-base uppercase">{show.venue}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">{show.address}</p>
                <p className="text-xs text-neutral-500 font-bold uppercase">{show.city}</p>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>MAP & DIRECTIONS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Schedule & Price Box */}
            <div className="bg-black/80 p-4 rounded-2xl border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>SET TIMES & DAMAGE</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">First Band:</span>
                    <span className="font-black text-white">{formatTime(show.startTime)}</span>
                  </div>
                  {show.doorsTime && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Doors Open:</span>
                      <span className="text-neutral-300 font-bold">{formatTime(show.doorsTime)}</span>
                    </div>
                  )}
                  {show.endTime && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Curfew:</span>
                      <span className="text-neutral-400">{formatTime(show.endTime)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 uppercase font-bold">Admission Damage:</span>
                <span className="text-sm font-black text-red-400">
                  {show.price === 'Free' ? 'FREE / DONATION' : `$${show.price}`}
                </span>
              </div>
            </div>
          </div>

          {/* Description / Show Rules */}
          {show.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>GIG NOTES & PIT INFO</span>
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line bg-black/60 p-4 rounded-2xl border border-neutral-800">
                {show.description}
              </p>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            {show.ticketUrl ? (
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-950 transition-all cursor-pointer border border-red-500"
              >
                <Ticket className="w-5 h-5" />
                <span>GET TICKETS {show.price !== 'Free' ? `($${show.price})` : ''}</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            ) : (
              <div className="w-full text-center py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-neutral-900 text-neutral-300 border border-neutral-800">
                {show.price === 'Free' ? 'FREE ENTRY / SUPPORT THE TOURING BANDS AT MERCH' : `PAY AT DOOR: $${show.price}`}
              </div>
            )}

            {/* Calendar & Share Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => downloadICSFile(show)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-black uppercase border border-neutral-800 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-red-400" />
                <span>ICAL (.ICS)</span>
              </button>

              <a
                href={getGoogleCalendarUrl(show)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-black uppercase border border-neutral-800 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>GOOGLE CAL</span>
              </a>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-black uppercase border border-neutral-800 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-red-400" />
                <span>SHARE GIG</span>
              </button>
            </div>
          </div>

          {/* Admin Edit Shortcut */}
          {isAdmin && onEditShow && (
            <div className="pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => {
                  onClose();
                  onEditShow(show);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950 text-red-300 border border-red-800 hover:bg-red-700 hover:text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>EDIT IN ADMIN</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
