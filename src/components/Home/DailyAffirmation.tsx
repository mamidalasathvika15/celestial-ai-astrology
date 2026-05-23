import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Copy, BookOpen, Check } from 'lucide-react';
import axios from 'axios';
import { useUserStore } from '../../store/useStore';

interface DailyAffirmationProps {
  sign: string;
  mood: string;
}

const DEFAULT_AFFIRMATIONS: Record<string, string> = {
  Aries: "I am a beacon of solar courage, directing my innate fire to build rather than consume.",
  Taurus: "I am anchored in cosmic abundance, growing my spiritual root system in silence and grace.",
  Gemini: "I am a bridge of light, weaving diverse cosmic signals into a higher tapestry of truth.",
  Cancer: "I am an ocean of deep emotional intelligence, protected by the silver armor of the moon.",
  Leo: "I am the sun centered in my divine power, shining warmth upon all souls without condition.",
  Virgo: "I am a pure conduit of earthly wisdom, organizing my physical realm to reflect divine order.",
  Libra: "I am the scale of perfect cosmic balance, vibrating with absolute harmony and magnetic core peace.",
  Scorpio: "I am the master of alchemy, transmuting every shadow particle into radiant soul frequency.",
  Sagittarius: "I am a seeker of infinite horizons, guided by the fiery arrow of eternal truth and luck.",
  Capricorn: "I am the solid mountain peaks of devotion, scaling heights to anchor practical, divine energy.",
  Aquarius: "I am the revolutionary water-bearer, flowing with visionary insights to liberate collective consciousness.",
  Pisces: "I am a celestial ocean of dreaming, dissolved into the pure unconditional love of the cosmos."
};

export default function DailyAffirmation({ sign, mood }: DailyAffirmationProps) {
  const { addJournalEntry, setError } = useUserStore();
  const [affirmation, setAffirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [journaled, setJournaled] = useState(false);

  const keyName = `celestial_affirmation_${sign}_${new Date().toDateString()}`;

  const fetchAffirmation = async (force: boolean = false) => {
    // Try localStorage if not forcing
    if (!force) {
      const cached = localStorage.getItem(keyName);
      if (cached) {
        setAffirmation(cached);
        return;
      }
    }

    setLoading(true);
    setJournaled(false);
    try {
      const response = await axios.post('/api/astrology/affirmation', {
        sign,
        mood
      });
      const text = response.data.text;
      setAffirmation(text);
      localStorage.setItem(keyName, text);
    } catch (err: any) {
      console.warn("Failed to generate AI affirmation, using solar fallback", err);
      const fallback = DEFAULT_AFFIRMATIONS[sign] || DEFAULT_AFFIRMATIONS['Leo'];
      setAffirmation(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(keyName);
    if (cached) {
      setAffirmation(cached);
    } else {
      // Delay fetching by 1200ms to prevent simultaneous backend requests on tab load
      const timer = setTimeout(() => {
        fetchAffirmation(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [sign]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Celestial Affirmation: ${affirmation}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToJournal = async () => {
    if (journaled) return;
    try {
      await addJournalEntry(`Affirmed today: "${affirmation}" during a ${mood.toLowerCase()} astrological state.`);
      setJournaled(true);
      setTimeout(() => setJournaled(false), 3000);
    } catch (err) {
      setError("Spirit failed to log entry to database.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden w-full rounded-[2rem] p-6 border border-white/5 bg-gradient-to-br from-[#100620]/30 to-[#030107]/40 backdrop-blur-2xl mb-6 group/aff"
    >
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-celestial-purple/10 rounded-full blur-[40px] pointer-events-none group-hover/aff:bg-celestial-purple/20 transition-colors duration-500" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles size={11} className="text-celestial-gold animate-pulse" />
          <p className="text-[9px] uppercase tracking-[0.25em] text-celestial-gold font-bold">Daily Soul Affirmation</p>
        </div>
        <button
          onClick={() => fetchAffirmation(true)}
          disabled={loading}
          className="p-1.5 rounded-full bg-white/5 border border-white/5 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/10 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
          title="Re-align cosmic frequency"
        >
          <RefreshCw size={10} className={`${loading ? 'animate-spin text-celestial-magenta' : ''}`} />
        </button>
      </div>

      <div className="min-h-[50px] flex items-center justify-center py-2 relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-aff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <div className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-celestial-gold animate-bounce" />
                <span className="w-1 h-1 rounded-full bg-celestial-gold animate-bounce delay-75" />
                <span className="w-1 h-1 rounded-full bg-celestial-gold animate-bounce delay-150" />
              </div>
              <span className="text-[8px] tracking-widest text-white/30 uppercase mt-1">Casting solar intent...</span>
            </motion.div>
          ) : (
            <motion.p
              key={affirmation}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm font-serif italic text-white/90 leading-relaxed text-center font-light px-3"
            >
              "{affirmation}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5 relative z-10">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] uppercase tracking-wider font-bold rounded-lg text-white/50 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <Check size={10} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={10} />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={handleAddToJournal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] uppercase tracking-wider font-bold rounded-lg text-white/50 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
        >
          {journaled ? (
            <>
              <Check size={10} className="text-celestial-gold" />
              <span className="text-celestial-gold">Logged to Journal</span>
            </>
          ) : (
            <>
              <BookOpen size={10} />
              <span>Seal in Journal</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
