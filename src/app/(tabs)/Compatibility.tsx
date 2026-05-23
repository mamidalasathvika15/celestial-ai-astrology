import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Users, Sparkles, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '../../store/useStore';
import axios from 'axios';

const ZODIAC_SIGNS = [
  { sign: 'Aries', icon: '♈' }, { sign: 'Taurus', icon: '♉' },
  { sign: 'Gemini', icon: '♊' }, { sign: 'Cancer', icon: '♋' },
  { sign: 'Leo', icon: '♌' }, { sign: 'Virgo', icon: '♍' },
  { sign: 'Libra', icon: '♎' }, { sign: 'Scorpio', icon: '♏' },
  { sign: 'Sagittarius', icon: '♐' }, { sign: 'Capricorn', icon: '♑' },
  { sign: 'Aquarius', icon: '♒' }, { sign: 'Pisces', icon: '♓' }
];

export default function Compatibility() {
  const { profile, setError } = useUserStore();
  const userSign = profile?.zodiacSign || 'Leo';
  const [partnerSign, setPartnerSign] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!partnerSign) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/astrology/interpret', {
        type: 'relationship',
        content: `Relationship between ${userSign} and ${partnerSign}`,
        profile
      });
      setReport(response.data.text);
      setError(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Planetary interpretation failed.";
      if (error.response?.status === 429) {
        setError(msg);
        setTimeout(() => setError(null), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getSignIcon = (s: string) => ZODIAC_SIGNS.find(z => z.sign === s)?.icon || '✨';

  return (
    <div className="flex flex-col min-h-screen pb-32 px-8 pt-12 max-w-lg mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-serif italic text-white mb-2">Synastry</h1>
        <p className="text-white/40 text-sm italic">Discover the cosmic threads between two souls.</p>
      </header>

      {/* Selection Area */}
      <div className="glass-premium rounded-[2.5rem] p-8 mb-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-celestial-purple/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 mb-8">
           <div className="w-16 h-16 rounded-full bg-celestial-purple/20 border border-celestial-purple/30 flex flex-col items-center justify-center">
             <span className="text-2xl">{getSignIcon(userSign)}</span>
             <span className="text-[8px] uppercase font-bold text-celestial-purple tracking-widest">{userSign}</span>
           </div>
           <div className="relative flex-1">
             <div className="h-px bg-white/10 w-full" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050208] p-2">
                <Heart size={16} className={partnerSign ? 'text-celestial-magenta animate-pulse' : 'text-white/20'} fill={partnerSign ? 'currentColor' : 'none'} />
             </div>
           </div>
           <div className={`w-16 h-16 rounded-full border transition-all flex flex-col items-center justify-center ${
             partnerSign ? 'bg-celestial-magenta/20 border-celestial-magenta/30 shadow-[0_0_20px_rgba(219,39,119,0.2)]' : 'bg-white/5 border-white/10'
           }`}>
             {partnerSign ? (
               <>
                 <span className="text-2xl">{getSignIcon(partnerSign)}</span>
                 <span className="text-[8px] uppercase font-bold text-celestial-magenta tracking-widest">{partnerSign}</span>
               </>
             ) : (
               <Search size={20} className="text-white/20" />
             )}
           </div>
        </div>

        <h3 className="text-center text-[10px] uppercase tracking-widest text-white/30 mb-8 font-bold">Select Partner Sign</h3>
        
        <div className="grid grid-cols-4 gap-3">
           {ZODIAC_SIGNS.map(z => (
             <button 
               key={z.sign} 
               onClick={() => setPartnerSign(z.sign)}
               className={`w-full aspect-square rounded-2xl bg-white/5 border flex flex-col items-center justify-center gap-1 hover:border-celestial-magenta/40 transition-all ${
                 partnerSign === z.sign ? 'border-celestial-magenta bg-celestial-magenta/10 shadow-[0_0_10px_rgba(219,39,119,0.1)]' : 'border-white/5 opacity-50 hover:opacity-100'
               }`}
             >
               <span className="text-xl">{z.icon}</span>
               <span className="text-[7px] uppercase font-bold tracking-tighter text-white/60">{z.sign}</span>
             </button>
           ))}
        </div>
      </div>

      {partnerSign && !report && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
           <InsightCard 
            icon={<TrendingUp size={18} />} 
            title="Compatibility Focus" 
            value="High Resonance" 
            desc={`The universe suggests a powerful alignment between ${userSign} and ${partnerSign} in this cycle.`}
          />
          <button 
            onClick={generateReport}
            disabled={loading}
            className="w-full mt-6 p-6 rounded-[2.5rem] bg-gradient-to-tr from-celestial-purple to-celestial-magenta text-white font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-[0_20px_60px_rgba(109,40,217,0.3)] active:scale-95 transition-transform"
          >
            {loading ? (
              <span className="animate-pulse">Synthesizing Energies...</span>
            ) : (
              <>
                <Sparkles size={16} /> Deep Synastry Analysis
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Full Report View */}
      <AnimatePresence>
        {report && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-premium rounded-[2.5rem] p-10 border border-white/20 relative"
          >
             <button onClick={() => setReport(null)} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors">
               <X size={24} />
             </button>
             <div className="flex items-center gap-3 mb-8">
                <Sparkles size={18} className="text-celestial-magenta" />
                <h3 className="text-celestial-magenta font-serif italic text-2xl">Cosmic Bound</h3>
             </div>
             <p className="text-indigo-50/90 leading-relaxed italic text-[15px] whitespace-pre-wrap font-light">{report}</p>
             <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center opacity-30">
                <span className="text-[9px] uppercase font-bold tracking-widest text-white">Vibrational Map</span>
                <span className="text-[9px] font-mono text-white">X-774</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsightCard({ icon, title, value, desc }: { icon: any, title: string, value: string, desc: string }) {
  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-celestial-magenta">{icon}</div>
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40">{title}</h4>
        </div>
        <span className="text-xl font-serif italic text-white">{value}</span>
      </div>
      <p className="text-sm text-white/60 leading-relaxed italic">"{desc}"</p>
    </div>
  );
}
