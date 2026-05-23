import React from 'react';
import { Moon } from 'lucide-react';

export default function MoonPhase() {
  const getMoonPhase = () => {
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const date = new Date();
    // Simplified lunar cycle logic for visual variety
    const day = date.getDate();
    return phases[day % 8];
  };

  const phase = getMoonPhase();

  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-2 border border-white/5">
      <Moon size={14} className="text-indigo-200" />
      <div className="flex flex-col">
        <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Moon Phase</span>
        <span className="text-[10px] text-white font-medium italic">{phase}</span>
      </div>
    </div>
  );
}
