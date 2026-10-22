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
  'Beatdown / Heavy HC',
  'Metallic Hardcore',
  'NYHC / Traditional',
  'Crossover Thrash',
  'Fast HC / Powerviolence',
  'Death Metal / Grind',
  'Post-Hardcore / Punk',
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
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search bands, venues, cities (e.g. Sunami, Pain of Truth, VFW)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all uppercase"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Date Filter Segmented Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-950 border border-neutral-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => onDateFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              dateFilter === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ALL DATES
          </button>

          <button
            onClick={() => onDateFilterChange('tonight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              dateFilter === 'tonight'
                ? 'bg-red-700 text-white shadow-sm'
                : 'text-neutral-400 hover:text-red-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>TONIGHT</span>
            {tonightCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-black bg-red-950 text-red-200 border border-red-800">
                {tonightCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onDateFilterChange('weekend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              dateFilter === 'weekend'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            THIS WEEKEND
          </button>

          <button
            onClick={() => onDateFilterChange('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              dateFilter === 'upcoming'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            UPCOMING
          </button>
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-neutral-300 focus:outline-none focus:border-red-600 uppercase"
          >
            <option value="date-asc">DATE (SOONEST)</option>
            <option value="date-desc">DATE (LATEST)</option>
            <option value="price-asc">DAMAGE (LOWEST)</option>
            <option value="price-desc">DAMAGE (HIGHEST)</option>
          </select>

          {/* Grid vs List View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-950 border border-neutral-800">
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
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
              className={`px-3 py-1.5 rounded-xl font-bold uppercase whitespace-nowrap border transition-all cursor-pointer tracking-wider ${
                isSelected
                  ? 'bg-red-600 text-white border-red-500 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
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
