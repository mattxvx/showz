export type EventGenre =
  | 'Indie Rock'
  | 'Electronic'
  | 'Jazz & Blues'
  | 'Punk / Metal'
  | 'Hip-Hop'
  | 'Acoustic & Folk'
  | 'Synthwave'
  | 'Classical / Ambient'
  | 'Other';

export type EventStatus = 'active' | 'selling-fast' | 'sold-out' | 'cancelled';
export type AgeRestriction = 'All Ages' | '18+' | '21+';

export interface ShowEvent {
  id: string;
  title: string;
  headliner: string;
  supportActs?: string[];
  venue: string;
  address: string;
  city: string;
  date: string; // YYYY-MM-DD
  doorsTime: string; // HH:mm
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  genre: EventGenre;
  price: number | 'Free';
  ticketUrl?: string;
  flyerUrl: string;
  description: string;
  ageRestriction: AgeRestriction;
  status: EventStatus;
  featured?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type ViewFilter = 'all' | 'tonight' | 'weekend' | 'upcoming';
export type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';
