import React, { useState, useEffect } from 'react';
import type { ShowEvent, EventGenre, EventStatus, AgeRestriction } from '../types';
import { FLYER_PRESETS } from '../data/sampleShows';
import { X, Upload, Sparkles, Check } from 'lucide-react';

interface AdminShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (show: ShowEvent) => void;
  editingShow: ShowEvent | null;
}

const GENRES: EventGenre[] = [
  'Indie Rock',
  'Electronic',
  'Jazz & Blues',
  'Punk / Metal',
  'Hip-Hop',
  'Acoustic & Folk',
  'Synthwave',
  'Classical / Ambient',
  'Other',
];

const STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'active', label: 'Active / On Sale' },
  { value: 'selling-fast', label: 'Selling Fast' },
  { value: 'sold-out', label: 'Sold Out' },
  { value: 'cancelled', label: 'Cancelled' },
];

const AGES: AgeRestriction[] = ['All Ages', '18+', '21+'];

export const AdminShowModal: React.FC<AdminShowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingShow,
}) => {
  const [formData, setFormData] = useState<Partial<ShowEvent>>({
    title: '',
    headliner: '',
    supportActs: [],
    venue: '',
    address: '',
    city: '',
    date: new Date().toISOString().slice(0, 10),
    doorsTime: '19:30',
    startTime: '20:30',
    endTime: '23:30',
    genre: 'Indie Rock',
    price: 15,
    ticketUrl: '',
    flyerUrl: FLYER_PRESETS[0].url,
    description: '',
    ageRestriction: '18+',
    status: 'active',
    featured: false,
  });

  const [supportsInput, setSupportsInput] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [customFlyerUrl, setCustomFlyerUrl] = useState('');

  useEffect(() => {
    if (editingShow) {
      setFormData(editingShow);
      setSupportsInput((editingShow.supportActs || []).join(', '));
      setIsFree(editingShow.price === 'Free');
      setCustomFlyerUrl(editingShow.flyerUrl || '');
    } else {
      // Reset form for new show
      setFormData({
        title: '',
        headliner: '',
        supportActs: [],
        venue: '',
        address: '',
        city: 'Local Area',
        date: new Date().toISOString().slice(0, 10),
        doorsTime: '19:30',
        startTime: '20:30',
        endTime: '23:30',
        genre: 'Indie Rock',
        price: 15,
        ticketUrl: '',
        flyerUrl: FLYER_PRESETS[0].url,
        description: '',
        ageRestriction: '18+',
        status: 'active',
        featured: false,
      });
      setSupportsInput('');
      setIsFree(false);
      setCustomFlyerUrl('');
    }
  }, [editingShow, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setFormData((prev) => ({ ...prev, flyerUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.headliner?.trim()) {
      alert('Please enter at least the Headliner / Artist name');
      return;
    }
    if (!formData.venue?.trim()) {
      alert('Please enter the Venue name');
      return;
    }
    if (!formData.date) {
      alert('Please select a Date for the event');
      return;
    }

    const supportActs = supportsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const fullShow: ShowEvent = {
      id: editingShow?.id || `gig-${Date.now()}`,
      title: formData.title?.trim() || formData.headliner.trim(),
      headliner: formData.headliner.trim(),
      supportActs,
      venue: formData.venue?.trim() || 'TBA',
      address: formData.address?.trim() || 'Main Hall',
      city: formData.city?.trim() || 'Local City',
      date: formData.date || new Date().toISOString().slice(0, 10),
      doorsTime: formData.doorsTime || '19:30',
      startTime: formData.startTime || '20:30',
      endTime: formData.endTime || '23:30',
      genre: (formData.genre as EventGenre) || 'Indie Rock',
      price: isFree ? 'Free' : Number(formData.price) || 0,
      ticketUrl: formData.ticketUrl?.trim() || '',
      flyerUrl: formData.flyerUrl || FLYER_PRESETS[0].url,
      description: formData.description?.trim() || '',
      ageRestriction: (formData.ageRestriction as AgeRestriction) || 'All Ages',
      status: (formData.status as EventStatus) || 'active',
      featured: Boolean(formData.featured),
      createdAt: editingShow?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(fullShow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">
                {editingShow ? 'Edit Show / Gig' : 'Add New Local Show'}
              </h2>
              <p className="text-xs text-slate-400">
                {editingShow ? 'Update show details, lineup, or status' : 'Publish a new concert to the local roster'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              1. Artist & Lineup
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Headliner / Main Act <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arctic Monkeys, The Black Keys"
                  value={formData.headliner || ''}
                  onChange={(e) => setFormData({ ...formData, headliner: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Show / Tour Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Solstice Fest, Album Tour"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Supporting Acts (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Band A, Band B, DJ Neon"
                value={supportsInput}
                onChange={(e) => setSupportsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              2. Venue, Date & Timing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Venue Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Empty Bottle"
                  value={formData.venue || ''}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1035 N Western Ave"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  City / Neighborhood
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chicago, IL"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Doors Open
                </label>
                <input
                  type="time"
                  value={formData.doorsTime || ''}
                  onChange={(e) => setFormData({ ...formData, doorsTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Show Starts <span className="text-rose-400">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime || ''}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Curfew / End
                </label>
                <input
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Genre, Tickets & Price */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              3. Category, Pricing & Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value as EventGenre })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Age Policy</label>
                <select
                  value={formData.ageRestriction}
                  onChange={(e) =>
                    setFormData({ ...formData, ageRestriction: e.target.value as AgeRestriction })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {AGES.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Admission Price ($)</label>
                  <label className="flex items-center gap-1.5 text-xs text-purple-300 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => {
                        setIsFree(e.target.checked);
                        if (e.target.checked) setFormData({ ...formData, price: 'Free' });
                        else setFormData({ ...formData, price: 15 });
                      }}
                      className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Free Entry Show</span>
                  </label>
                </div>
                <input
                  type="number"
                  disabled={isFree}
                  min="0"
                  step="0.5"
                  placeholder="e.g. 15"
                  value={isFree ? '' : formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm transition-colors ${
                    isFree
                      ? 'border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'border-slate-800 text-white focus:outline-none focus:border-purple-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ticket Purchase URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://eventbrite.com/e/..."
                  value={formData.ticketUrl || ''}
                  onChange={(e) => setFormData({ ...formData, ticketUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="featuredCheck" className="text-xs font-medium text-slate-200 cursor-pointer">
                Spotlight this event as a <strong className="text-purple-300">Featured Gig</strong> on the homepage
              </label>
            </div>
          </div>

          {/* Flyer Image Selector */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              4. Event Flyer / Cover Artwork
            </h3>

            {/* Presets Gallery */}
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Choose a pre-curated concert atmosphere or upload your own flyer:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {FLYER_PRESETS.map((preset) => {
                  const isSelected = formData.flyerUrl === preset.url;
                  return (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => {
                        setFormData({ ...formData, flyerUrl: preset.url });
                        setCustomFlyerUrl('');
                      }}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-purple-500 shadow-md shadow-purple-900/50 scale-105'
                          : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 text-[10px] bg-slate-950/80 text-slate-300 px-1 py-0.5 truncate text-center">
                        {preset.genre}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL or File Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Or enter image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={customFlyerUrl}
                    onChange={(e) => {
                      setCustomFlyerUrl(e.target.value);
                      if (e.target.value) setFormData({ ...formData, flyerUrl: e.target.value });
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Or upload image file from device
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-purple-500 text-slate-300 text-xs font-medium cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>Choose local file...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              5. Description & Sound Notes
            </h3>
            <textarea
              rows={3}
              placeholder="Tell attendees what to expect: music style, stage vibe, set times, drink specials, merch table..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Footer CTAs */}
          <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-slate-800 bg-slate-900/95 p-4 sm:px-6 flex items-center justify-end gap-3 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:brightness-110 transition-all cursor-pointer"
            >
              {editingShow ? 'Save Changes' : 'Publish Show'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
