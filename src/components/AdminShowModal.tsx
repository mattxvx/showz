import React, { useState, useEffect } from 'react';
import type { ShowEvent, EventGenre, EventStatus, AgeRestriction } from '../types';
import { FLYER_PRESETS } from '../data/sampleShows';
import { X, Upload, Flame, Check } from 'lucide-react';

interface AdminShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (show: ShowEvent) => void;
  editingShow: ShowEvent | null;
}

const GENRES: EventGenre[] = [
  'Beatdown / Heavy HC',
  'Metallic Hardcore',
  'NYHC / Traditional',
  'Crossover Thrash',
  'Fast HC / Powerviolence',
  'Death Metal / Grind',
  'Post-Hardcore / Punk',
  'Mixed Bill',
];

const STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'active', label: 'Active / Tickets Available' },
  { value: 'selling-fast', label: 'Low Tickets Warning' },
  { value: 'sold-out', label: 'Sold Out / No Door Tickets' },
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
    doorsTime: '18:30',
    startTime: '19:00',
    endTime: '23:00',
    genre: 'Beatdown / Heavy HC',
    price: 20,
    ticketUrl: '',
    flyerUrl: FLYER_PRESETS[0].url,
    description: '',
    ageRestriction: 'All Ages',
    status: 'active',
    featured: false,
    stageDivesAllowed: true,
  });

  const [supportsInput, setSupportsInput] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [customFlyerUrl, setCustomFlyerUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingShow) {
      setFormData(editingShow);
      setSupportsInput((editingShow.supportActs || []).join(', '));
      setIsFree(editingShow.price === 'Free');
      setCustomFlyerUrl(editingShow.flyerUrl || '');
    } else {
      setFormData({
        title: '',
        headliner: '',
        supportActs: [],
        venue: '',
        address: '',
        city: 'Local Area',
        date: new Date().toISOString().slice(0, 10),
        doorsTime: '18:30',
        startTime: '19:00',
        endTime: '23:00',
        genre: 'Beatdown / Heavy HC',
        price: 20,
        ticketUrl: '',
        flyerUrl: FLYER_PRESETS[0].url,
        description: '',
        ageRestriction: 'All Ages',
        status: 'active',
        featured: false,
        stageDivesAllowed: true,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.headliner?.trim()) {
      alert('Please enter at least the Headliner / Main band name');
      return;
    }
    if (!formData.venue?.trim()) {
      alert('Please enter the Venue or Hall name');
      return;
    }
    if (!formData.date) {
      alert('Please select a Date for the gig');
      return;
    }

    const supportActs = supportsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const fullShow: ShowEvent = {
      id: editingShow?.id || `gig-${Date.now()}`,
      title: formData.title?.trim() || formData.headliner.trim(),
      headliner: formData.headliner.trim().toUpperCase(),
      supportActs: supportActs.map((s) => s.toUpperCase()),
      venue: formData.venue?.trim() || 'TBA',
      address: formData.address?.trim() || 'Local VFW / Hall',
      city: formData.city?.trim() || 'Local Area',
      date: formData.date || new Date().toISOString().slice(0, 10),
      doorsTime: formData.doorsTime || '18:30',
      startTime: formData.startTime || '19:00',
      endTime: formData.endTime || '23:00',
      genre: (formData.genre as EventGenre) || 'Beatdown / Heavy HC',
      price: isFree ? 'Free' : Number(formData.price) || 0,
      ticketUrl: formData.ticketUrl?.trim() || '',
      flyerUrl: formData.flyerUrl || FLYER_PRESETS[0].url,
      description: formData.description?.trim() || '',
      ageRestriction: (formData.ageRestriction as AgeRestriction) || 'All Ages',
      status: (formData.status as EventStatus) || 'active',
      featured: Boolean(formData.featured),
      stageDivesAllowed: formData.stageDivesAllowed ?? true,
      createdAt: editingShow?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    setIsSaving(true);
    try {
      await onSave(fullShow);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-safe bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-800">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight hc-font">
                {editingShow ? 'EDIT HARDCORE GIG' : 'ADD HARDCORE GIG'}
              </h2>
              <p className="text-xs text-neutral-400">
                Syncs live to Firebase Cloud Database for all attendees.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              1. BANDS & LINEUP
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Headliner / Main Act <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUNAMI, HATEBREED, DRAIN"
                  value={formData.headliner || ''}
                  onChange={(e) => setFormData({ ...formData, headliner: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Tour / Gig Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. REAL BAY SHIT TOUR, BENEFIT GIG"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                Supporting Acts (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. PAIN OF TRUTH, GRIDIRON, TERROR, SPEED"
                value={supportsInput}
                onChange={(e) => setSupportsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 uppercase"
              />
            </div>
          </div>

          {/* Date, Time & Venue */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              2. VENUE, DATE & SET TIMES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Venue Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VFW Post 11, The Meat Locker"
                  value={formData.venue || ''}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 88 Industrial Way"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  City / Region
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brooklyn, NY"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Doors Open
                </label>
                <input
                  type="time"
                  value={formData.doorsTime || ''}
                  onChange={(e) => setFormData({ ...formData, doorsTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  First Band Starts <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime || ''}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Curfew
                </label>
                <input
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-sm font-bold focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          </div>

          {/* Genre & Pricing */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              3. CATEGORY, DAMAGE & STATUS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Hardcore Subgenre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value as EventGenre })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-bold focus:outline-none focus:border-red-600 uppercase"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-bold focus:outline-none focus:border-red-600 uppercase"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">Age Policy</label>
                <select
                  value={formData.ageRestriction}
                  onChange={(e) =>
                    setFormData({ ...formData, ageRestriction: e.target.value as AgeRestriction })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-bold focus:outline-none focus:border-red-600 uppercase"
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
                  <label className="text-xs font-bold text-neutral-300 uppercase">Damage ($)</label>
                  <label className="flex items-center gap-1.5 text-xs text-red-400 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => {
                        setIsFree(e.target.checked);
                        if (e.target.checked) setFormData({ ...formData, price: 'Free' });
                        else setFormData({ ...formData, price: 20 });
                      }}
                      className="rounded bg-black border-neutral-700 text-red-600 focus:ring-0"
                    />
                    <span>FREE / DONATION</span>
                  </label>
                </div>
                <input
                  type="number"
                  disabled={isFree}
                  min="0"
                  step="1"
                  placeholder="e.g. 20"
                  value={isFree ? '' : formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black border text-sm font-bold transition-colors ${
                    isFree
                      ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'border-neutral-800 text-white focus:outline-none focus:border-red-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Ticket Purchase URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.ticketUrl || ''}
                  onChange={(e) => setFormData({ ...formData, ticketUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.stageDivesAllowed)}
                  onChange={(e) => setFormData({ ...formData, stageDivesAllowed: e.target.checked })}
                  className="w-4 h-4 rounded bg-black border-neutral-700 text-red-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-neutral-200 uppercase">
                  Stage Dives Encouraged (No Barricade)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded bg-black border-neutral-700 text-red-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-red-400 uppercase">
                  Spotlight as Headliner Banner
                </span>
              </label>
            </div>
          </div>

          {/* Flyer Selection */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              4. GIG FLYER / ARTWORK
            </h3>

            {/* Presets Gallery */}
            <div>
              <p className="text-xs text-neutral-400 mb-2 font-bold uppercase">
                Choose a hardcore pit preset or upload your local show flyer:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                          ? 'border-red-600 shadow-md shadow-red-950 scale-105'
                          : 'border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover grayscale contrast-125" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 text-[9px] bg-black/90 text-white font-black px-1 py-0.5 truncate text-center uppercase">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL or Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Or Paste Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customFlyerUrl}
                  onChange={(e) => {
                    setCustomFlyerUrl(e.target.value);
                    if (e.target.value) setFormData({ ...formData, flyerUrl: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase">
                  Or Upload From Device (Camera Roll)
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-black border border-dashed border-neutral-700 hover:border-red-500 text-neutral-300 text-xs font-bold cursor-pointer transition-colors uppercase">
                  <Upload className="w-4 h-4 text-red-500" />
                  <span>CHOOSE FLYER FILE...</span>
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

          {/* Description / Pit info */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500">
              5. PIT NOTES & GIG INFO
            </h3>
            <textarea
              rows={3}
              placeholder="e.g. Stage dives strictly encouraged. Respect the venue. Merch table in the back. No fighting / no hate speech."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          {/* Footer CTAs */}
          <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-neutral-800 bg-neutral-950/95 p-4 sm:px-6 flex items-center justify-end gap-3 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 text-xs font-black uppercase transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950 hover:bg-red-500 transition-all cursor-pointer border border-red-500"
            >
              {isSaving ? 'SYNCING TO CLOUD...' : editingShow ? 'SAVE GIG' : 'PUBLISH GIG'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
