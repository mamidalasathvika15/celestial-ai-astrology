import { motion } from 'framer-motion';
import { Star, Zap, Crown, Flame, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { useUserStore } from '../../store/useStore';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MoonPhase from '../../components/Home/MoonPhase';
import Skeleton from '../../components/UI/Skeleton';
import DailyHighlights from '../../components/Home/DailyHighlights';
import DailyAffirmation from '../../components/Home/DailyAffirmation';
import BirthChartModal from '../../components/Home/BirthChartModal';

export default function Home() {
  const { profile, setError } = useUserStore();
  const navigate = useNavigate();
  const sign = profile?.zodiacSign || 'Leo';
  const [horoscope, setHoroscope] = useState('');
  const [mood, setMood] = useState('Reflective');
  const [loading, setLoading] = useState(true);
  const [isChartOpen, setIsChartOpen] = useState(false);

  // Dynamic simulation of "Energy Score" based on sign and day
  const energyScore = useMemo(() => {
    const daySeed = new Date().getDate();
    const signSeed = sign.length;
    return Math.min(100, Math.max(60, 75 + (daySeed % 10) + (signSeed % 10)));
  }, [sign]);

  const fetchHoroscope = async (currentMood: string) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/astrology/horoscope', {
        sign,
        mood: currentMood,
        context: 'Daily snapshot'
      });
      setHoroscope(response.data.text);
      setError(null);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'The cosmic signal is weak. Try again later.';
      setHoroscope(msg);
      if (error.response?.status === 429) {
        setError(msg);
        setTimeout(() => setError(null), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscope(mood);
  }, [sign]);

  const handleMoodChange = (m: string) => {
    setMood(m);
    fetchHoroscope(m);
  };

  return (
    <div className="flex flex-col min-h-screen pb-32 px-8 pt-8 max-w-lg mx-auto scroll-smooth">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-celestial-purple to-celestial-magenta p-[1px]">
            <div className="w-full h-full rounded-full bg-[#050208] flex items-center justify-center font-serif italic text-lg text-white">C</div>
          </div>
          <span className="text-xs font-light tracking-[0.2em] uppercase opacity-70 text-white">Celestial</span>
        </div>
        <div className="flex gap-4 items-center">
          {!profile?.isPremium && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="px-3 py-1 bg-celestial-gold/10 border border-celestial-gold/20 rounded-full flex items-center gap-2 text-celestial-gold text-[8px] font-bold uppercase tracking-widest"
            >
              <Crown size={10} /> Upgrade
            </motion.button>
          )}
          <div className="text-right">
            <p className="text-[8px] uppercase tracking-widest text-celestial-purple/60 font-bold mb-0.5">Energy</p>
            <div className="flex items-center gap-1.5 justify-end">
                <p className="font-serif italic text-2xl text-celestial-magenta">{energyScore}<span className="text-[10px] ml-1 opacity-50">%</span></p>
                <TrendingUp size={12} className="text-celestial-magenta opacity-50" />
            </div>
          </div>
        </div>
      </header>

      {/* Greeting & Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-end justify-between mb-4">
            <div>
                <h1 className="text-4xl font-serif italic font-light tracking-tight text-white mb-2">
                    Greetings, {profile?.name || 'Leo'}
                </h1>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full border border-celestial-gold/30 bg-celestial-gold/5 text-celestial-gold text-[8px] uppercase font-bold tracking-tighter">
                        {sign} Sun
                    </span>
                    <span className="text-[10px] text-white/30 font-light italic">Rising in the 4th House</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <MoonPhase />
            </div>
        </div>
      </motion.div>

      {/* Daily Horoscope Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass-premium rounded-[2.5rem] p-8 flex flex-col justify-between mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-celestial-purple/5 to-transparent pointer-events-none" />
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-celestial-purple" />
                <h2 className="text-[9px] uppercase tracking-[0.3em] text-celestial-purple font-bold">Daily Cosmic Resonance</h2>
            </div>
            <span className="text-[10px] text-white/30 font-mono italic">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Daily Highlights Summary Badge */}
          <div className="mb-5 flex justify-start">
            <DailyHighlights horoscope={horoscope} loading={loading} />
          </div>
          
          <div className="min-h-[120px]">
            {loading ? (
                <div className="space-y-3">
                    <Skeleton height={20} width="90%" />
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={20} width="85%" />
                </div>
            ) : (
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-lg font-light leading-relaxed text-indigo-50/90 italic"
                >
                    {horoscope}
                </motion.p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 mb-3 font-bold">Emotional Intent</p>
          <div className="flex gap-2 flex-wrap">
             {['Reflective', 'Bold', 'Calm', 'Social'].map(m => (
               <button 
                key={m} 
                onClick={() => handleMoodChange(m)}
                className={`px-4 py-1.5 rounded-xl border text-[8px] uppercase font-bold tracking-widest transition-all ${
                  mood === m 
                  ? 'bg-celestial-magenta border-celestial-magenta text-white shadow-[0_0_20px_rgba(219,39,119,0.3)]' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 active:scale-95'
                }`}
              >
                 {m}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
          <div>
            <p className="text-[7px] uppercase tracking-widest text-white/30 mb-1 font-bold">Lucky Color</p>
            <p className="text-celestial-gold text-[10px] font-medium tracking-wide">Obsidian Black</p>
          </div>
          <div>
            <p className="text-[7px] uppercase tracking-widest text-white/30 mb-1 font-bold">Lucky Cycle</p>
            <p className="text-celestial-gold text-[10px] font-medium tracking-wide">11:11 & 4</p>
          </div>
          <div>
             <p className="text-[7px] uppercase tracking-widest text-white/30 mb-1 font-bold">Aura Pulse</p>
             <div className="flex gap-1 mt-1 font-bold">
                <div className="h-1 flex-1 bg-celestial-magenta rounded-full shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
                <div className="h-1 flex-1 bg-celestial-magenta rounded-full shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
                <div className="h-1 flex-1 bg-white/10 rounded-full" />
             </div>
          </div>
        </div>
      </motion.div>
      
      {/* Daily Affirmation Widget */}
      <DailyAffirmation sign={sign} mood={mood} />

      {/* Middle Grid Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => navigate('/compatibility')}
            className="glass rounded-3xl p-6 border border-white/10 cursor-pointer"
          >
              <div className="flex items-center gap-2 mb-3">
                <Heart size={14} className="text-celestial-magenta" />
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/40">Love Harmony</span>
              </div>
              <p className="text-xs text-white/60 mb-4 line-clamp-2 italic">How do {sign} and Leo align today?</p>
              <div className="flex -space-x-2">
                 <div className="w-6 h-6 rounded-full glass border border-white/20 flex items-center justify-center text-[10px]">♒</div>
                 <div className="w-6 h-6 rounded-full glass border border-white/20 flex items-center justify-center text-[10px]">♌</div>
              </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="glass rounded-3xl p-6 border border-white/10 cursor-pointer"
          >
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} className="text-celestial-gold" />
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/40">Celestial Streak</span>
              </div>
              <p className="text-2xl font-serif italic text-white mb-2">{profile?.streak || 1}<span className="text-[10px] ml-1 opacity-40">Days</span></p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-celestial-gold" />
              </div>
          </motion.div>
      </div>

      {/* AI Bot Quick Preview */}
      <motion.div
        whileHover={{ y: -4 }}
        onClick={() => navigate('/ai')}
        className="p-8 rounded-[2.5rem] border border-celestial-magenta/20 bg-gradient-to-br from-celestial-magenta/[0.08] to-transparent backdrop-blur-xl mb-6 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-celestial-magenta/20 flex items-center justify-center">
                    <Zap size={14} className="text-celestial-magenta" />
                </div>
                <h3 className="text-[9px] uppercase tracking-widest text-celestial-magenta font-bold">Soul System Interpretation</h3>
            </div>
            <div className="flex gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-white animate-pulse delay-75" />
                <div className="w-1 h-1 rounded-full bg-white animate-pulse delay-150" />
            </div>
        </div>
        <p className="text-sm italic text-indigo-100/70 leading-relaxed font-light">
          "I sense a cosmic threshold approaching. The current celestial alignment suggests a powerful moment for internal synthesis of your ${mood.toLowerCase()} energy."
        </p>
      </motion.div>

      {/* Transits Section */}
      <div className="glass rounded-[2rem] p-8 mb-4 border border-white/5">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Current Transits</h3>
            <button 
              onClick={() => setIsChartOpen(true)}
              className="text-[8px] uppercase tracking-widest text-celestial-purple font-bold hover:text-celestial-magenta transition-all cursor-pointer"
            >
              View Full Chart
            </button>
        </div>
        <div className="space-y-3">
          <TransitRow icon="☀️" title={`Sun in ${sign}`} label="Essence" color="text-celestial-gold" />
          <TransitRow icon="🌙" title="Moon in Taurus" label="Emotional" color="text-indigo-400" />
          <TransitRow icon="🪐" title="Saturn Retrograde" label="Discipline" color="text-gray-400" />
        </div>
      </div>

      {/* Imperial Birth Chart Overlay Modal */}
      <BirthChartModal isOpen={isChartOpen} onClose={() => setIsChartOpen(false)} />

    </div>
  );
}

function TransitRow({ icon, title, label, color }: { icon: string, title: string, label: string, color: string }) {
  return (
    <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5 transition-colors hover:bg-white/[0.05]">
      <div className="flex items-center gap-4">
        <span className="text-xl">{icon}</span>
        <span className="text-[13px] font-light text-white/80">{title}</span>
      </div>
      <span className={`text-[8px] uppercase tracking-tighter font-bold ${color} opacity-80`}>{label}</span>
    </div>
  );
}
