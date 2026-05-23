import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface DailyHighlightsProps {
  horoscope: string;
  loading: boolean;
}

const ADJECTIVES = [
  'Cosmic', 'Ethereal', 'Luminous', 'Mystic', 'Serene', 
  'Profound', 'Vibrant', 'Infinite', 'Stellar', 'Ancestral', 
  'Divine', 'Celestial', 'Radiant', 'Quantum', 'Sacred',
  'Astral', 'Harmonic', 'Empowered', 'Intuitive', 'Silent'
];

const NOUNS = [
  'Resonance', 'Alignment', 'Awakening', 'Clarity', 'Gateway', 
  'Pulse', 'Wisdom', 'Expansion', 'Flow', 'Catalyst', 
  'Transition', 'Aura', 'Ascension', 'Surrender', 'Harmony',
  'Threshold', 'Gravity', 'Ignition', 'Sovereignty', 'Synthesis'
];

// Simple hash helper to ensure the same horoscope text always maps to same highlights
function getDeterministicSummary(text: string): string {
  if (!text) return 'Celestial Alignment';
  
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  const absHash = Math.abs(hash);
  const adjIdx = absHash % ADJECTIVES.length;
  const nounIdx = (absHash >> 3) % NOUNS.length;
  
  return `${ADJECTIVES[adjIdx]} ${NOUNS[nounIdx]}`;
}

export default function DailyHighlights({ horoscope, loading }: DailyHighlightsProps) {
  const summary = useMemo(() => {
    return getDeterministicSummary(horoscope);
  }, [horoscope]);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-celestial-purple" />
        <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">Tuning Frequency...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-celestial-purple/20 to-celestial-magenta/10 border border-celestial-purple/30 shadow-[0_0_15px_rgba(109,40,217,0.15)] cursor-pointer group transition-all hover:border-celestial-purple/50"
      title="Daily energetic signature summary"
    >
      <Sparkles size={10} className="text-celestial-magenta group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-[9px] uppercase tracking-[0.15em] font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-celestial-gold">
        {summary}
      </span>
    </motion.div>
  );
}
