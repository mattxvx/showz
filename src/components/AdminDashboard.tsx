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
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
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
          alert('Database successfully imported!');
        } catch (err: any) {
          alert('Error importing JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Shows</p>
            <p className="text-2xl font-black text-white mt-0.5">{totalShows}</p>
          </div>
          <span className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
            <Layers className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Active / On Sale</p>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{activeShows}</p>
          </div>
          <span className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Sold Out</p>
            <p className="text-2xl font-black text-rose-400 mt-0.5">{soldOutShows}</p>
          </div>
          <span className="p-3 rounded-xl bg-rose-600/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Local Venues</p>
            <p className="text-2xl font-black text-indigo-400 mt-0.5">{uniqueVenues}</p>
          </div>
          <span className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Calendar className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Admin Operations Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-purple-900/40 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-purple-950/20">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Local Show</span>
          </button>

          <button
            onClick={onExportJSON}
            title="Export all events as JSON backup file"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Backup</span>
          </button>

          <label
            title="Import shows from a previously exported JSON backup"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Reset shows database to default sample concerts? This will overwrite existing changes.')) {
                onResetDefaults();
              }
            }}
            title="Reset database to fresh sample gigs"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-slate-800 hover:border-rose-900/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Samples</span>
          </button>
        </div>
      </div>

      {/* Shows Management Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by artist, venue, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredShows.length}</strong> of {totalShows} shows
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Event / Artist</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Venue & City</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredShows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching shows found. Click "+ Add Local Show" to create one.
                  </td>
                </tr>
              ) : (
                filteredShows.map((show) => {
                  const dateInfo = formatEventDate(show.date);
                  return (
                    <tr key={show.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Artist / Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={show.flyerUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-white text-sm truncate">
                              <span>{show.headliner}</span>
                              {show.featured && (
                                <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-current shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {show.title !== show.headliner ? show.title : show.genre}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">
                          {dateInfo.label} ({show.date})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Show: {formatTime(show.startTime)} {show.doorsTime ? `(Doors: ${formatTime(show.doorsTime)})` : ''}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-200">{show.venue}</div>
                        <div className="text-[11px] text-slate-400">{show.city}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-emerald-400">
                          {show.price === 'Free' ? 'Free' : `$${show.price}`}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={show.status}
                          onChange={(e) => onStatusChange(show.id, e.target.value as EventStatus)}
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
                        >
                          <option value="active">Active</option>
                          <option value="selling-fast">Selling Fast</option>
                          <option value="sold-out">Sold Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onDuplicateShow(show)}
                            title="Duplicate show"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditShow(show)}
                            title="Edit show"
                            className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/40 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${show.headliner}"?`)) {
                                onDeleteShow(show.id);
                              }
                            }}
                            title="Delete show"
                            className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition-colors"
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
