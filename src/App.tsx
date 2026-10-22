import { useState, useEffect, useMemo } from 'react';
import type { ShowEvent, ViewFilter, EventGenre, SortOption, EventStatus } from './types';
import {
  loadShowsFromStorage,
  saveShowsToStorage,
  loadFavorites,
  saveFavorites,
  exportShowsAsJSON,
  importShowsFromJSON,
  resetShowsToDefaults,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ShowCard } from './components/ShowCard';
import { ShowDetailModal } from './components/ShowDetailModal';
import { AdminShowModal } from './components/AdminShowModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { InstallPrompt } from './components/InstallPrompt';
import {
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  Radio,
} from 'lucide-react';

export function App() {
  // State
  const [shows, setShows] = useState<ShowEvent[]>(() => loadShowsFromStorage());
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('gigpulse_is_admin') === 'true';
  });

  // Modals & Active Selections
  const [selectedShow, setSelectedShow] = useState<ShowEvent | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<ShowEvent | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Filters & Display
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<ViewFilter>('all');
  const [selectedGenre, setSelectedGenre] = useState<EventGenre | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // PWA Install prompt capture
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  // Toggle Admin Mode
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      sessionStorage.removeItem('gigpulse_is_admin');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('gigpulse_is_admin', 'true');
  };

  // Favorites
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id];
      saveFavorites(next);
      return next;
    });
  };

  // Show Operations
  const handleSaveShow = (showToSave: ShowEvent) => {
    setShows((prev) => {
      const exists = prev.some((s) => s.id === showToSave.id);
      let updated: ShowEvent[];
      if (exists) {
        updated = prev.map((s) => (s.id === showToSave.id ? showToSave : s));
      } else {
        updated = [showToSave, ...prev];
      }
      saveShowsToStorage(updated);
      return updated;
    });

    if (selectedShow?.id === showToSave.id) {
      setSelectedShow(showToSave);
    }
  };

  const handleDuplicateShow = (showToDuplicate: ShowEvent) => {
    const duplicated: ShowEvent = {
      ...showToDuplicate,
      id: `gig-${Date.now()}`,
      title: `${showToDuplicate.title} (New Date)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setShows((prev) => {
      const updated = [duplicated, ...prev];
      saveShowsToStorage(updated);
      return updated;
    });
    setEditingShow(duplicated);
    setIsAddEditOpen(true);
  };

  const handleDeleteShow = (id: string) => {
    setShows((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveShowsToStorage(updated);
      return updated;
    });
    if (selectedShow?.id === id) {
      setSelectedShow(null);
    }
  };

  const handleStatusChange = (id: string, status: EventStatus) => {
    setShows((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, status, updatedAt: Date.now() } : s));
      saveShowsToStorage(updated);
      return updated;
    });
  };

  const handleExportJSON = () => {
    exportShowsAsJSON(shows);
  };

  const handleImportJSON = (jsonStr: string) => {
    const imported = importShowsFromJSON(jsonStr);
    setShows(imported);
  };

  const handleResetDefaults = () => {
    const defaults = resetShowsToDefaults();
    setShows(defaults);
  };

  // Helper date diffs
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const tonightCount = useMemo(() => {
    return shows.filter((s) => s.date === todayStr).length;
  }, [shows, todayStr]);

  // Filtered & Sorted Shows
  const filteredShows = useMemo(() => {
    return shows.filter((show) => {
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(show.id)) {
        return false;
      }

      // Genre filter
      if (selectedGenre !== 'All' && show.genre !== selectedGenre) {
        return false;
      }

      // Date filter
      const [year, month, day] = show.date.split('-').map(Number);
      const showDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffDays = Math.round((showDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === 'tonight' && diffDays !== 0) {
        return false;
      } else if (dateFilter === 'weekend') {
        const dayOfWeek = showDate.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
        const isUpcomingWeekend = diffDays >= 0 && diffDays <= 7 && (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0);
        if (!isUpcomingWeekend) return false;
      } else if (dateFilter === 'upcoming') {
        if (diffDays < 0) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHeadliner = show.headliner.toLowerCase().includes(q);
        const matchesTitle = show.title.toLowerCase().includes(q);
        const matchesVenue = show.venue.toLowerCase().includes(q);
        const matchesCity = show.city.toLowerCase().includes(q);
        const matchesGenre = show.genre.toLowerCase().includes(q);
        const matchesSupports = show.supportActs?.some((act) => act.toLowerCase().includes(q));
        if (
          !matchesHeadliner &&
          !matchesTitle &&
          !matchesVenue &&
          !matchesCity &&
          !matchesGenre &&
          !matchesSupports
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-asc') {
        return a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);
      } else if (sortBy === 'date-desc') {
        return b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime);
      } else if (sortBy === 'price-asc') {
        const pA = a.price === 'Free' ? 0 : a.price;
        const pB = b.price === 'Free' ? 0 : b.price;
        return pA - pB;
      } else if (sortBy === 'price-desc') {
        const pA = a.price === 'Free' ? 0 : a.price;
        const pB = b.price === 'Free' ? 0 : b.price;
        return pB - pA;
      }
      return 0;
    });
  }, [shows, favorites, showOnlyFavorites, selectedGenre, dateFilter, searchQuery, sortBy]);

  // Featured Hero Show
  const featuredShow = useMemo(() => {
    return shows.find((s) => s.featured) || shows[0];
  }, [shows]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onOpenAddModal={() => {
          setEditingShow(null);
          setIsAddEditOpen(true);
        }}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavoritesOnly={() => setShowOnlyFavorites((prev) => !prev)}
        canInstall={canInstall}
        onInstallApp={handleInstallApp}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Admin Mode Warning / Quick Banner */}
        {isAdmin && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-purple-950/80 border border-purple-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-purple-950/20">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-purple-200">
                Admin Mode Active: You can add new concerts, edit schedules, and manage events.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingShow(null);
                  setIsAddEditOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
              >
                + Add Show
              </button>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  sessionStorage.removeItem('gigpulse_is_admin');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                Exit Admin
              </button>
            </div>
          </div>
        )}

        {/* Admin Dashboard vs Public Attendee View */}
        {isAdmin ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Admin Event Center</h1>
                <p className="text-xs text-slate-400">
                  Manage all local gigs, track ticket status, and backup data.
                </p>
              </div>
            </div>

            <AdminDashboard
              shows={shows}
              onOpenAddModal={() => {
                setEditingShow(null);
                setIsAddEditOpen(true);
              }}
              onEditShow={(show) => {
                setEditingShow(show);
                setIsAddEditOpen(true);
              }}
              onDuplicateShow={handleDuplicateShow}
              onDeleteShow={handleDeleteShow}
              onStatusChange={handleStatusChange}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
              onResetDefaults={handleResetDefaults}
            />
          </div>
        ) : (
          /* Public Attendee View */
          <div className="space-y-8">
            {/* Hero Featured Showcase (Shown when not filtering favorites) */}
            {!showOnlyFavorites && !searchQuery && featuredShow && (
              <div
                onClick={() => setSelectedShow(featuredShow)}
                className="relative rounded-3xl overflow-hidden border border-purple-500/40 bg-slate-900 shadow-2xl group cursor-pointer"
              >
                <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-slate-950">
                  <img
                    src={featuredShow.flyerUrl}
                    alt={featuredShow.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Hero Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-600 text-white shadow-lg shadow-purple-900/50">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        SPOTLIGHT SHOW
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                        {featuredShow.genre}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                      {featuredShow.headliner}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-1 mb-4">
                      {featuredShow.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-white">{featuredShow.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <span>{featuredShow.venue}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/30">
                        {featuredShow.price === 'Free' ? 'Free Admission' : `$${featuredShow.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              tonightCount={tonightCount}
            />

            {/* Shows Header Count */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                <h3 className="text-lg font-extrabold text-white">
                  {showOnlyFavorites
                    ? 'Saved Shows'
                    : dateFilter === 'tonight'
                    ? 'Happening Tonight'
                    : dateFilter === 'weekend'
                    ? 'This Weekend'
                    : 'Upcoming Shows'}
                </h3>
                <span className="text-xs text-slate-400">({filteredShows.length} found)</span>
              </div>

              {showOnlyFavorites && (
                <button
                  onClick={() => setShowOnlyFavorites(false)}
                  className="text-xs text-purple-400 hover:text-purple-300 underline font-semibold cursor-pointer"
                >
                  View all shows
                </button>
              )}
            </div>

            {/* Shows Grid / List */}
            {filteredShows.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-3xl bg-slate-900/50 border border-slate-800 p-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
                  <Compass className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">No shows found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {showOnlyFavorites
                      ? 'You haven’t saved any shows yet. Tap the heart on any gig to bookmark it!'
                      : 'Try resetting your search query or switching date/genre filters.'}
                  </p>
                </div>
                {(searchQuery || selectedGenre !== 'All' || dateFilter !== 'all' || showOnlyFavorites) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('All');
                      setDateFilter('all');
                      setShowOnlyFavorites(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredShows.map((show) => (
                  <ShowCard
                    key={show.id}
                    show={show}
                    isFavorite={favorites.includes(show.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={setSelectedShow}
                    isAdmin={isAdmin}
                    onEditShow={(s) => {
                      setEditingShow(s);
                      setIsAddEditOpen(true);
                    }}
                    onDuplicateShow={handleDuplicateShow}
                    onDeleteShow={handleDeleteShow}
                  />
                ))}
              </div>
            ) : (
              /* Compact List View */
              <div className="space-y-3">
                {filteredShows.map((show) => (
                  <ShowCard
                    key={show.id}
                    show={show}
                    isFavorite={favorites.includes(show.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={setSelectedShow}
                    isAdmin={isAdmin}
                    onEditShow={(s) => {
                      setEditingShow(s);
                      setIsAddEditOpen(true);
                    }}
                    onDuplicateShow={handleDuplicateShow}
                    onDeleteShow={handleDeleteShow}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 pt-6 safe-bottom px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Showz PWA</span>
            <span>•</span>
            <span>Hosted on GitHub Pages</span>
            <span>•</span>
            <span className="text-emerald-400">Offline-Ready Service Worker</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleAdmin}
              className="text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              {isAdmin ? 'Exit Admin Mode' : 'Admin Login (Demo: 1234)'}
            </button>
            <button
              onClick={() => {
                if (confirm('Reset shows to fresh demo dataset?')) {
                  handleResetDefaults();
                }
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Reset Sample Shows
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <ShowDetailModal
        show={selectedShow}
        onClose={() => setSelectedShow(null)}
        isFavorite={selectedShow ? favorites.includes(selectedShow.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isAdmin={isAdmin}
        onEditShow={(s) => {
          setEditingShow(s);
          setIsAddEditOpen(true);
        }}
      />

      <AdminShowModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingShow(null);
        }}
        onSave={handleSaveShow}
        editingShow={editingShow}
      />

      <AdminAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <InstallPrompt canInstall={canInstall} onInstall={handleInstallApp} />
    </div>
  );
}

export default App;
