import React from 'react';
import { ShowEvent } from '../types';
import { formatEventDate, formatTime, getGenreColor, getStatusBadge } from '../utils/formatters';
import { downloadICSFile, shareShow } from '../utils/calendar';
import { MapPin, Calendar, Clock, Ticket, Heart, Share2, Edit2, Copy, Trash2, Sparkles } from 'lucide-react';

interface ShowCardProps {
  show: ShowEvent;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (show: ShowEvent) => void;
  isAdmin: boolean;
  onEditShow?: (show: ShowEvent) => void;
  onDuplicateShow?: (show: ShowEvent) => void;
  onDeleteShow?: (id: string) => void;
}

export const ShowCard: React.FC<ShowCardProps> = ({
  show,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isAdmin,
  onEditShow,
  onDuplicateShow,
  onDeleteShow,
}) => {
  const dateInfo = formatEventDate(show.date);
  const genreStyle = getGenreColor(show.genre);
  const statusBadge = getStatusBadge(show.status);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await shareShow(show);
    if (!navigator.share) {
      alert(res.message);
    }
  };

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadICSFile(show);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(show.id);
  };

  return (
    <article
      onClick={() => onSelect(show)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900/90 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
        show.featured
          ? 'border-purple-500/50 hover:border-purple-400 shadow-lg shadow-purple-950/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Flyer Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={show.flyerUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'}
          alt={show.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Date Badge (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${
              dateInfo.isTonight
                ? 'bg-rose-500 text-white animate-pulse'
                : dateInfo.isTomorrow
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900/85 text-slate-200 border border-slate-700/60'
            }`}
          >
            {dateInfo.isTonight && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
            {dateInfo.label}
          </span>

          {show.featured && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-purple-600/90 text-white backdrop-blur-md shadow-md">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Status Badge & Favorite Button (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {statusBadge && (
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border ${statusBadge.color}`}
            >
              {statusBadge.text}
            </span>
          )}

          <button
            onClick={handleHeartClick}
            aria-label="Save to favorites"
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isFavorite
                ? 'bg-pink-600 text-white shadow-md shadow-pink-900/50'
                : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Genre Pill (Bottom Left overlay) */}
        <div className="absolute bottom-2 left-3">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md border ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
          >
            {show.genre}
          </span>
        </div>

        {/* Price Tag (Bottom Right overlay) */}
        <div className="absolute bottom-2 right-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-900/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            {show.price === 'Free' ? 'FREE ENTRY' : `$${show.price}`}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Headliner & Title */}
        <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors line-clamp-1">
          {show.headliner}
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-3 line-clamp-1">
          {show.title !== show.headliner ? show.title : show.supportActs?.length ? `w/ ${show.supportActs.join(', ')}` : 'Live in Concert'}
        </p>

        {/* Support Acts if any */}
        {show.supportActs && show.supportActs.length > 0 && show.title === show.headliner && (
          <div className="text-xs text-slate-400 mb-2 truncate">
            <span className="text-slate-500">Supports:</span> {show.supportActs.join(', ')}
          </div>
        )}

        {/* Details: Venue & Timing */}
        <div className="space-y-1.5 text-xs text-slate-300 mb-4 mt-auto">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold text-slate-200 truncate">{show.venue}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 truncate">{show.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Show: <strong className="text-white">{formatTime(show.startTime)}</strong></span>
            {show.doorsTime && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Doors: {formatTime(show.doorsTime)}</span>
              </>
            )}
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{show.ageRestriction}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {isAdmin ? (
            /* Admin Control Strip */
            <div className="w-full flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] font-medium text-purple-400 mr-auto uppercase tracking-wider">Admin</span>
              <button
                onClick={() => onDuplicateShow && onDuplicateShow(show)}
                title="Duplicate show"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onEditShow && onEditShow(show)}
                title="Edit show"
                className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteShow && onDeleteShow(show.id)}
                title="Delete show"
                className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Public Attendee Action Strip */
            <>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleAddToCalendar}
                  title="Add to Calendar (.ics)"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cal</span>
                </button>
                <button
                  onClick={handleShare}
                  title="Share event"
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-purple-400 group-hover:translate-x-0.5 transition-transform">
                <span>View Details</span>
                <span>→</span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
