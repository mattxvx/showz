import React from 'react';
import type { ShowEvent } from '../types';
import { formatEventDate, formatTime, getGenreColor, getStatusBadge } from '../utils/formatters';
import { downloadICSFile, shareShow } from '../utils/calendar';
import { MapPin, Clock, Heart, Share2, Edit2, Copy, Trash2, Flame, Calendar } from 'lucide-react';

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
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-950 border transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
        show.featured
          ? 'border-red-600/80 hover:border-red-500 shadow-xl shadow-red-950/40'
          : 'border-neutral-800/90 hover:border-neutral-700'
      }`}
    >
      {/* Flyer Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
        <img
          src={show.flyerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'}
          alt={show.title}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[30%] contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

        {/* Date Badge (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black backdrop-blur-md shadow-md tracking-wider ${
              dateInfo.isTonight
                ? 'bg-red-600 text-white animate-pulse border border-red-400'
                : dateInfo.isTomorrow
                ? 'bg-amber-500 text-black font-black'
                : 'bg-black/90 text-neutral-200 border border-neutral-700'
            }`}
          >
            {dateInfo.isTonight && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
            {dateInfo.label}
          </span>

          {show.featured && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black bg-red-700 text-white backdrop-blur-md shadow-md tracking-wider uppercase border border-red-500">
              <Flame className="w-3 h-3 fill-current" />
              <span>HEADLINER</span>
            </span>
          )}
        </div>

        {/* Status Badge & Favorite Button (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {statusBadge && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider backdrop-blur-md border ${statusBadge.color}`}
            >
              {statusBadge.text}
            </span>
          )}

          <button
            onClick={handleHeartClick}
            aria-label="Save to favorites"
            className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
              isFavorite
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'bg-black/80 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Genre & Stage Dives Pill (Bottom Left overlay) */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
          <span
            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider backdrop-blur-md border ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
          >
            {show.genre}
          </span>
          {show.stageDivesAllowed && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/80 text-neutral-300 border border-neutral-700 backdrop-blur-md">
              STAGE DIVES OK
            </span>
          )}
        </div>

        {/* Price Tag (Bottom Right overlay) */}
        <div className="absolute bottom-2 right-3">
          <span className="px-2.5 py-0.5 rounded text-xs font-black bg-black/90 text-white border border-red-600/80 backdrop-blur-md tracking-wider">
            {show.price === 'Free' ? 'FREE ENTRY' : `DAMAGE: $${show.price}`}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Headliner */}
        <h3 className="font-black text-xl text-white group-hover:text-red-400 transition-colors uppercase tracking-tight line-clamp-1 hc-font">
          {show.headliner}
        </h3>

        {/* Support Acts list */}
        <div className="text-xs text-neutral-400 font-bold mb-3 line-clamp-1 uppercase tracking-wide">
          {show.supportActs && show.supportActs.length > 0 ? (
            <span>W/ {show.supportActs.join(' • ')}</span>
          ) : (
            <span className="text-neutral-500">Live Hardcore Gig</span>
          )}
        </div>

        {/* Details: Venue & Timing */}
        <div className="space-y-1.5 text-xs text-neutral-300 mb-4 mt-auto">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-bold text-white uppercase truncate">{show.venue}</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400 truncate">{show.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>Show: <strong className="text-white font-black">{formatTime(show.startTime)}</strong></span>
            {show.doorsTime && (
              <>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">Doors: {formatTime(show.doorsTime)}</span>
              </>
            )}
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400 font-bold uppercase">{show.ageRestriction}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
          {isAdmin ? (
            /* Admin Control Strip */
            <div className="w-full flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
              <span className="text-[11px] font-black text-red-500 mr-auto uppercase tracking-widest">ADMIN</span>
              <button
                onClick={() => onDuplicateShow && onDuplicateShow(show)}
                title="Duplicate gig"
                className="p-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onEditShow && onEditShow(show)}
                title="Edit gig"
                className="p-1.5 rounded-lg bg-red-950 text-red-300 hover:bg-red-700 hover:text-white border border-red-800 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteShow && onDeleteShow(show.id)}
                title="Delete gig"
                className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:bg-red-600 hover:text-white border border-neutral-800 transition-colors"
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
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold border border-neutral-800 transition-colors"
                >
                  <Calendar className="w-3 h-3 text-red-400" />
                  <span>CAL</span>
                </button>
                <button
                  onClick={handleShare}
                  title="Share gig"
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-red-500 group-hover:translate-x-0.5 transition-transform tracking-wider uppercase">
                <span>VIEW GIG</span>
                <span>→</span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
