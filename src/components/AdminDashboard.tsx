import React, { useState } from 'react';
import type { ShowEvent, EventStatus } from '../types';
import { formatEventDate, formatTime } from '../utils/formatters';
import {
  Plus,
  Download,
  Upload,
  RotateCcw,
  Edit2,
  Copy,
  Trash2,
  Search,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Cloud,
} from 'lucide-react';

interface AdminDashboardProps {
  shows: ShowEvent[];
  onOpenAddModal: () => void;
  onEditShow: (show: ShowEvent) => void;
  onDuplicateShow: (show: ShowEvent) => void;
  onDeleteShow: (id: string) => void;
  onStatusChange: (id: string, status: EventStatus) => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => void;
  onResetDefaults: () => void;
  isCloudConnected?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  shows,
  onOpenAddModal,
  onEditShow,
  onDuplicateShow,
  onDeleteShow,
  onStatusChange,
  onExportJSON,
  onImportJSON,
  onResetDefaults,
  isCloudConnected = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalShows = shows.length;
  const activeShows = shows.filter((s) => s.status === 'active' || s.status === 'selling-fast').length;
  const soldOutShows = shows.filter((s) => s.status === 'sold-out').length;
  const uniqueVenues = new Set(shows.map((s) => s.venue)).size;

  const filteredShows = shows.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.headliner.toLowerCase().includes(q) ||
      s.venue.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q)
    );
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          onImportJSON(content);
          alert('Database successfully imported & syncing to cloud!');
        } catch (err: any) {
          alert('Error importing JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neutral-400">TOTAL GIGS</p>
            <p className="text-2xl font-black text-white mt-0.5 hc-font">{totalShows}</p>
          </div>
          <span className="p-3 rounded-xl bg-red-950 text-red-500 border border-red-800">
            <Layers className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neutral-400">ACTIVE / ON SALE</p>
            <p className="text-2xl font-black text-red-400 mt-0.5 hc-font">{activeShows}</p>
          </div>
          <span className="p-3 rounded-xl bg-neutral-900 text-red-500 border border-neutral-800">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neutral-400">SOLD OUT</p>
            <p className="text-2xl font-black text-neutral-400 mt-0.5 hc-font">{soldOutShows}</p>
          </div>
          <span className="p-3 rounded-xl bg-neutral-900 text-neutral-400 border border-neutral-800">
            <AlertTriangle className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neutral-400">LOCAL VENUES</p>
            <p className="text-2xl font-black text-white mt-0.5 hc-font">{uniqueVenues}</p>
          </div>
          <span className="p-3 rounded-xl bg-neutral-900 text-white border border-neutral-800">
            <Calendar className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Admin Operations Toolbar */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-red-900/50 flex flex-wrap items-center justify-between gap-3 shadow-xl shadow-red-950/20">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950 transition-all cursor-pointer border border-red-500"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD LOCAL GIG</span>
          </button>

          <button
            onClick={onExportJSON}
            title="Export all events as JSON backup file"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold uppercase border border-neutral-800 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>EXPORT BACKUP</span>
          </button>

          <label
            title="Import shows from a JSON file"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold uppercase border border-neutral-800 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 text-neutral-400" />
            <span>IMPORT JSON</span>
            <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          </label>
        </div>

        <div className="flex items-center gap-2">
          {isCloudConnected && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-800 text-[10px] font-black uppercase text-red-300">
              <Cloud className="w-3 h-3 text-red-500 animate-pulse" />
              <span>FIRESTORE SYNC ACTIVE</span>
            </div>
          )}

          <button
            onClick={() => {
              if (confirm('Reset to default hardcore shows? This will reload sample bands (Sunami, Hatebreed, Drain, etc.).')) {
                onResetDefaults();
              }
            }}
            title="Reset shows to sample hardcore gig data"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-xs font-bold uppercase border border-neutral-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SAMPLES</span>
          </button>
        </div>
      </div>

      {/* Shows Management Table */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="SEARCH LINEUP, VENUE, OR GENRE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black border border-neutral-800 text-xs font-bold text-white focus:outline-none focus:border-red-600 uppercase"
            />
          </div>
          <div className="text-xs font-bold text-neutral-400 uppercase">
            SHOWING <strong className="text-white">{filteredShows.length}</strong> OF {totalShows} GIGS
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-black text-neutral-400 uppercase tracking-wider font-black border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">BAND / BILL</th>
                <th className="py-3 px-4">DATE & SET TIME</th>
                <th className="py-3 px-4">VENUE & CITY</th>
                <th className="py-3 px-4">DAMAGE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredShows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 font-bold uppercase">
                    No matching gigs found. Click "+ ADD LOCAL GIG" to publish one.
                  </td>
                </tr>
              ) : (
                filteredShows.map((show) => {
                  const dateInfo = formatEventDate(show.date);
                  return (
                    <tr key={show.id} className="hover:bg-neutral-900/60 transition-colors">
                      {/* Artist / Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={show.flyerUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800 grayscale shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-black text-white text-sm uppercase truncate">
                              <span>{show.headliner}</span>
                              {show.featured && (
                                <Flame className="w-3.5 h-3.5 text-red-500 fill-current shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-bold uppercase truncate">
                              {show.title !== show.headliner ? show.title : show.genre}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white uppercase">
                          {dateInfo.label} ({show.date})
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Show: {formatTime(show.startTime)} {show.doorsTime ? `(Doors: ${formatTime(show.doorsTime)})` : ''}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white uppercase">{show.venue}</div>
                        <div className="text-[11px] text-neutral-400 font-bold uppercase">{show.city}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-black text-red-400 uppercase">
                          {show.price === 'Free' ? 'FREE' : `$${show.price}`}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={show.status}
                          onChange={(e) => onStatusChange(show.id, e.target.value as EventStatus)}
                          className="bg-black border border-neutral-700 rounded-lg px-2.5 py-1 text-xs font-black text-neutral-200 uppercase focus:outline-none focus:border-red-600"
                        >
                          <option value="active">Active</option>
                          <option value="selling-fast">Low Tickets</option>
                          <option value="sold-out">Sold Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onDuplicateShow(show)}
                            title="Duplicate gig"
                            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditShow(show)}
                            title="Edit gig"
                            className="p-1.5 rounded-lg bg-red-950 text-red-300 hover:bg-red-700 hover:text-white border border-red-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${show.headliner}"? This will remove it from all devices.`)) {
                                onDeleteShow(show.id);
                              }
                            }}
                            title="Delete gig"
                            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:bg-red-600 hover:text-white border border-neutral-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
