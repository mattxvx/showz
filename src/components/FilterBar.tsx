import React from 'react';
import type { ViewFilter, EventGenre, SortOption } from '../types';
import { Search, LayoutGrid, List } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dateFilter: ViewFilter;
  onDateFilterChange: (df: ViewFilter) => void;
  selectedGenre: EventGenre | 'All';
  onGenreChange: (g: EventGenre | 'All') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  tonightCount: number;
}

const ALL_GENRES: (EventGenre | 'All')[] = [
  'All',
  'Indie Rock',
  'Electronic',
  'Jazz & Blues',
  'Punk / Metal',
  'Hip-Hop',
  'Acoustic & Folk',
  'Synthwave',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  tonightCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Search & Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search artists, venues, city, or genres..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Date Filter Segmented Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => onDateFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              dateFilter === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Dates
          </button>

          <button
            onClick={() => onDateFilterChange('tonight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              dateFilter === 'tonight'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Tonight</span>
            {tonightCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-200">
                {tonightCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onDateFilterChange('weekend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              dateFilter === 'weekend'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Weekend
          </button>

          <button
            onClick={() => onDateFilterChange('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              dateFilter === 'upcoming'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="date-asc">Date (Soonest)</option>
            <option value="date-desc">Date (Latest)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>

          {/* Grid vs List View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {ALL_GENRES.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};
