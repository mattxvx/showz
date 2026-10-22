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
import {
  syncShowToCloud,
  deleteShowFromCloud,
  subscribeToCloudShows,
} from './firebase';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ShowCard } from './components/ShowCard';
import { ShowDetailModal } from './components/ShowDetailModal';
import { AdminShowModal } from './components/AdminShowModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { InstallPrompt } from './components/InstallPrompt';
import {
  Flame,
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
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

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

  // Real-time Cloud Sync with Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToCloudShows(
      (cloudShows) => {
        setIsCloudConnected(true);
        if (cloudShows.length > 0) {
          setShows(cloudShows);
          saveShowsToStorage(cloudShows);
        } else {
          // If Firestore is completely fresh and empty, seed it with sample hardcore shows!
          const initialShows = loadShowsFromStorage();
          initialShows.forEach((show) => {
            syncShowToCloud(show).catch(() => {});
          });
        }
      },
      () => {
        // Fallback to local storage if Firestore connection has an issue
        setIsCloudConnected(false);
      }
    );

    return () => unsubscribe();
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

  // Show Operations (writes to LocalStorage AND syncs to Firebase Cloud!)
  const handleSaveShow = async (showToSave: ShowEvent) => {
    // 1. Optimistic Local Update
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

    // 2. Cloud Firestore & Storage Sync
    try {
      await syncShowToCloud(showToSave);
    } catch (err) {
      console.warn('Saved locally, cloud sync pending:', err);
    }
  };

  const handleDuplicateShow = (showToDuplicate: ShowEvent) => {
    const duplicated: ShowEvent = {
      ...showToDuplicate,
      id: `gig-${Date.now()}`,
      title: `${showToDuplicate.title} (NEW DATE)`,
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

  const handleDeleteShow = async (id: string) => {
    setShows((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveShowsToStorage(updated);
      return updated;
    });
    if (selectedShow?.id === id) {
      setSelectedShow(null);
    }

    // Cloud Delete
    try {
      await deleteShowFromCloud(id);
    } catch (err) {
      console.warn('Deleted locally, cloud delete notice:', err);
    }
  };

  const handleStatusChange = async (id: string, status: EventStatus) => {
    const targetShow = shows.find((s) => s.id === id);
    if (!targetShow) return;

    const updatedShow = { ...targetShow, status, updatedAt: Date.now() };

    setShows((prev) => {
      const updated = prev.map((s) => (s.id === id ? updatedShow : s));
      saveShowsToStorage(updated);
      return updated;
    });

    try {
      await syncShowToCloud(updatedShow);
    } catch (err) {
      console.warn('Status updated locally:', err);
    }
  };

  const handleExportJSON = () => {
    exportShowsAsJSON(shows);
  };

  const handleImportJSON = async (jsonStr: string) => {
    const imported = importShowsFromJSON(jsonStr);
    setShows(imported);
    // Sync all imported to cloud
    for (const show of imported) {
      syncShowToCloud(show).catch(() => {});
    }
  };

  const handleResetDefaults = () => {
    const defaults = resetShowsToDefaults();
    setShows(defaults);
    // Sync defaults to cloud
    for (const show of defaults) {
      syncShowToCloud(show).catch(() => {});
    }
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
        const dayOfWeek = showDate.getDay();
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
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 selection:bg-red-600 selection:text-white">
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
        isCloudConnected={isCloudConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Admin Mode Warning Banner */}
        {isAdmin && (
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-red-600/80 flex flex-wrap items-center justify-between gap-3 shadow-xl shadow-red-950/40">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-black uppercase text-red-400 tracking-wider">
                ADMIN MODE ACTIVE: All shows published are saved live to Firebase Cloud.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingShow(null);
                  setIsAddEditOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow transition-all cursor-pointer border border-red-500"
              >
                + ADD GIG
              </button>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  sessionStorage.removeItem('gigpulse_is_admin');
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold uppercase border border-neutral-700 transition-all cursor-pointer"
              >
                EXIT ADMIN
              </button>
            </div>
          </div>
        )}

        {/* Admin Dashboard vs Public Attendee View */}
        {isAdmin ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight hc-font">HARDCORE GIG MANAGER</h1>
                <p className="text-xs text-neutral-400 font-bold uppercase">
                  Manage all local hardcore shows, lineups, damage, and flyer photos.
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
              isCloudConnected={isCloudConnected}
            />
          </div>
        ) : (
          /* Public Attendee View */
          <div className="space-y-8">
            {/* Hardcore Hero Showcase */}
            {!showOnlyFavorites && !searchQuery && featuredShow && (
              <div
                onClick={() => setSelectedShow(featuredShow)}
                className="relative rounded-3xl overflow-hidden border-2 border-red-600/80 bg-neutral-950 shadow-2xl group cursor-pointer"
              >
                <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-black">
                  <img
                    src={featuredShow.flyerUrl}
                    alt={featuredShow.title}
                    className="w-full h-full object-cover grayscale-[20%] contrast-125 transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />

                  {/* Hero Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black bg-red-600 text-white shadow-lg uppercase tracking-wider">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        SPOTLIGHT HEADLINER
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-black bg-black/90 text-red-400 border border-red-700 uppercase tracking-wider backdrop-blur-md">
                        {featuredShow.genre}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase group-hover:text-red-400 transition-colors hc-font">
                      {featuredShow.headliner}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 mt-1 mb-4 font-bold uppercase tracking-wide">
                      {featuredShow.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-white">{featuredShow.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{featuredShow.venue}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded font-black text-white bg-red-950 border border-red-700">
                        {featuredShow.price === 'Free' ? 'FREE ENTRY' : `DAMAGE: $${featuredShow.price}`}
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
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider hc-font">
                  {showOnlyFavorites
                    ? 'BOOKMARKED GIGS'
                    : dateFilter === 'tonight'
                    ? 'PITS TONIGHT'
                    : dateFilter === 'weekend'
                    ? 'THIS WEEKEND'
                    : 'UPCOMING SHOWS'}
                </h3>
                <span className="text-xs font-bold text-neutral-500">({filteredShows.length} FOUND)</span>
              </div>

              {showOnlyFavorites && (
                <button
                  onClick={() => setShowOnlyFavorites(false)}
                  className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider underline cursor-pointer"
                >
                  VIEW ALL GIGS
                </button>
              )}
            </div>

            {/* Shows Grid / List */}
            {filteredShows.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-3xl bg-neutral-950 border border-neutral-800 p-8">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 mx-auto flex items-center justify-center text-red-500 border border-neutral-800">
                  <Compass className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white uppercase hc-font">NO GIGS FOUND</h4>
                  <p className="text-xs font-bold text-neutral-400 max-w-sm mx-auto uppercase">
                    {showOnlyFavorites
                      ? 'No saved gigs yet. Hit the heart button on any show card to bookmark it!'
                      : 'Try clearing your search query or switching date filters.'}
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
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase hover:bg-red-500 transition-colors cursor-pointer border border-red-500"
                  >
                    RESET ALL FILTERS
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
      <footer className="mt-auto border-t border-neutral-900 bg-black/95 pt-6 safe-bottom px-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
            <span className="text-white">SHOWZ HARDCORE PWA</span>
            <span>•</span>
            <span className="text-red-500">REALTIME CLOUD SYNC</span>
            <span>•</span>
            <span className="text-neutral-400">OFFLINE READY</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={handleToggleAdmin}
              className="text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              {isAdmin ? 'EXIT ADMIN' : 'ADMIN LOGIN (DEMO: 1234)'}
            </button>
            <button
              onClick={() => {
                if (confirm('Reset to sample hardcore bands (Sunami, Hatebreed, Drain, etc.)?')) {
                  handleResetDefaults();
                }
              }}
              className="text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              RESET SAMPLE GIGS
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
