import React, { useState, useMemo } from 'react';
import type { ShowEvent } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface MiniCalendarProps {
  shows: ShowEvent[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  shows,
  selectedDate,
  onSelectDate,
}) => {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date();
  });

  // Map of YYYY-MM-DD -> ShowEvent[]
  const showsByDate = useMemo(() => {
    const map: Record<string, ShowEvent[]> = {};
    shows.forEach((show) => {
      if (!map[show.date]) {
        map[show.date] = [];
      }
      map[show.date].push(show);
    });
    return map;
  }, [shows]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month calculation
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Adjust so Monday is 0, Sunday is 6
  const startingDayIndex = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const todayStr = now.toISOString().slice(0, 10);
    onSelectDate(todayStr);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  const dayHeaders = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startingDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  // Count gigs scheduled in current month
  const totalGigsInMonth = useMemo(() => {
    let count = 0;
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    Object.keys(showsByDate).forEach((d) => {
      if (d.startsWith(prefix)) {
        count += showsByDate[d].length;
      }
    });
    return count;
  }, [showsByDate, year, month]);

  return (
    <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 shadow-xl">
      {/* Month Header Navigation */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-red-500" />
          <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider hc-font">
            {monthNames[month]} {year}
          </h3>
          {totalGigsInMonth > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded font-black bg-red-950 text-red-400 border border-red-800">
              {totalGigsInMonth} GIG{totalGigsInMonth === 1 ? '' : 'S'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={jumpToToday}
            className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[10px] font-black uppercase text-neutral-300 border border-neutral-800 transition-colors"
          >
            TODAY
          </button>
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {dayHeaders.map((dh) => (
          <div key={dh} className="text-[10px] font-black text-neutral-500 uppercase tracking-widest py-1">
            {dh}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((dayNum, idx) => {
          if (dayNum === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const dayGigs = showsByDate[dateStr] || [];
          const hasGigs = dayGigs.length > 0;
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onSelectDate(null); // Toggle off if clicked again
                } else {
                  onSelectDate(dateStr);
                }
              }}
              title={
                hasGigs
                  ? `${dayGigs.length} gig(s): ${dayGigs.map((g) => g.headliner).join(', ')}`
                  : dateStr
              }
              className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-black transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950 scale-105 border border-red-400 z-10'
                  : hasGigs
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 border border-red-900/60 hover:border-red-600'
                  : 'bg-black/60 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-900'
              } ${isToday && !isSelected ? 'ring-1 ring-neutral-500' : ''}`}
            >
              <span>{dayNum}</span>

              {/* Red dot visual clue for dates with shows */}
              {hasGigs && (
                <div className="absolute bottom-1 flex items-center justify-center gap-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? 'bg-white'
                        : 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                    }`}
                  />
                  {dayGigs.length > 1 && (
                    <span
                      className={`text-[8px] font-black leading-none ${
                        isSelected ? 'text-white' : 'text-red-400'
                      }`}
                    >
                      {dayGigs.length}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Selected Date info */}
      <div className="mt-3 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          <span className="font-bold uppercase tracking-wider text-neutral-300">
            {selectedDate
              ? `${showsByDate[selectedDate]?.length || 0} GIG(S) ON ${selectedDate}`
              : 'RED DOT = HARDCORE GIG SCHEDULED'}
          </span>
        </div>

        {selectedDate && (
          <button
            type="button"
            onClick={() => onSelectDate(null)}
            className="flex items-center gap-1 text-[11px] font-black text-red-400 hover:text-red-300 uppercase tracking-wider"
          >
            <X className="w-3 h-3" />
            <span>SHOW ALL DATES</span>
          </button>
        )}
      </div>
    </div>
  );
};
