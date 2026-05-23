import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Compass, MapPin, Calendar, Clock, Star, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useUserStore } from '../../store/useStore';

interface BirthChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BirthChartModal({ isOpen, onClose }: BirthChartModalProps) {
  const { profile } = useUserStore();
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Default values to protect against undefined objects
  const name = profile?.name || 'Seeker';
  const zodiacSign = profile?.zodiacSign || 'Leo';
  const birthDate = profile?.birthDate || 'July 23';
  const birthTime = profile?.birthTime || '12:00 PM';
  const birthLocation = profile?.birthLocation || 'Celestial Sphere';

  // Compute elemental balance based on sign
  const elementalAffiliation = (() => {
    const fire = ['Aries', 'Leo', 'Sagittarius'];
    const earth = ['Taurus', 'Virgo', 'Capricorn'];
    const air = ['Gemini', 'Libra', 'Aquarius'];
    const water = ['Cancer', 'Scorpio', 'Pisces'];

    if (fire.includes(zodiacSign)) return { element: 'Fire', color: 'text-rose-400', desc: 'Passionate spirit, creative friction, solar sparks.' };
    if (earth.includes(zodiacSign)) return { element: 'Earth', color: 'text-amber-500', desc: 'Grounded intelligence, tactical root growth, physical order.' };
    if (air.includes(zodiacSign)) return { element: 'Air', color: 'text-indigo-300', desc: 'Bridges of light, divine communication, celestial signals.' };
    return { element: 'Water', color: 'text-cyan-400', desc: 'Oceanic depths, lunar tides, ancestral medium channel.' };
  })();

  const fetchBirthChartReading = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/astrology/birthchart', {
        profile
      });
      setReading(response.data.text);
    } catch (err: any) {
      console.error(err);
      setReading("The stellar nodes are currently out of reach. Please invoke the cosmic catalyst in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !reading && !loading) {
      fetchBirthChartReading();
    }
  }, [isOpen]);

  // Node coordinate configurations for beautiful rotating SVG alignment
  const solarSysNodes = [
    { name: 'Sun Node', symbol: '☀️', sign: zodiacSign, degree: "14°", house: "1st House", desc: "Core identity, primary essence, conscious ego." },
    { name: 'Moon Node', symbol: '🌙', sign: 'Taurus', degree: "08°", house: "4th House", desc: "Subconscious instinct, shadow self, emotional roots." },
    { name: 'Ascendant Node', symbol: '🌌', sign: 'Aquarius', degree: "22°", house: "1st House", desc: "The external gate, first impressions, solar mask." },
    { name: 'Mercury Node', symbol: '☿', sign: 'Virgo', degree: "11°", house: "8th House", desc: "Mind mapping, signals, celestial intellect." },
    { name: 'Venus Node', symbol: '♀', sign: 'Cancer', degree: "19°", house: "5th House", desc: "Artistic attraction, resonance bounds, soul harmony." },
    { name: 'Mars Node', symbol: '♂', sign: 'Scorpius', degree: "03°", house: "10th House", desc: "Primal drive, alchemical fire, sovereign ambition." }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] w-full h-full bg-black/95 backdrop-blur-xl overflow-y-auto px-6 py-12 flex justify-center text-white"
        >
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#160b2d]/40 to-transparent pointer-events-none" />
          
          <div className="relative w-full max-w-lg flex flex-col items-center">
            
            {/* Header Controls */}
            <div className="w-full flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <Compass className="text-celestial-gold animate-spin-slow" size={20} />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-bold">Birth Chart blueprint</span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile Capsule */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif italic text-white/95 mb-3">{name}'s Birth Chart</h2>
              <div className="flex flex-wrap gap-2.5 justify-center items-center">
                <span className="flex items-center gap-1 text-[10px] text-white/40 font-light border border-white/5 bg-white/[0.02] px-3 py-1 rounded-full">
                  <Calendar size={10} className="text-celestial-purple" /> {birthDate}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-white/40 font-light border border-white/5 bg-white/[0.02] px-3 py-1 rounded-full">
                  <Clock size={10} className="text-celestial-purple" /> {birthTime}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-white/40 font-light border border-white/5 bg-white/[0.02] px-3 py-1 rounded-full">
                  <MapPin size={10} className="text-celestial-purple" /> {birthLocation}
                </span>
              </div>
            </div>

            {/* Speactacular SVG Rotating Chart Wheel */}
            <div className="relative w-72 h-72 mb-10 flex items-center justify-center group">
              {/* Outer Glow Halo */}
              <div className="absolute w-64 h-64 bg-celestial-purple/10 rounded-full blur-[35px] pointer-events-none animate-pulse" />
              
              {/* Spinning SVG Constellation Mask */}
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
                className="absolute w-full h-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                viewBox="0 0 200 200"
              >
                <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(219,39,119,0.05)" strokeWidth="0.5" />
                
                {/* Crosshairs & Houses */}
                <line x1="5" y1="100" x2="195" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <line x1="100" y1="5" x2="100" y2="195" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                <line x1="33" y1="33" x2="167" y2="167" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="167" y1="33" x2="33" y2="167" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                
                {/* Golden Aspect Conjunction Lines */}
                <path d="M 50 100 L 100 50 L 150 100" fill="none" stroke="rgba(234,179,8,0.1)" strokeWidth="0.5" strokeDasharray="2,2" />
                <path d="M 100 150 L 150 100 L 100 50" fill="none" stroke="rgba(109,40,217,0.12)" strokeWidth="0.5" strokeDasharray="2,2" />
              </motion.svg>

              {/* Central Spiritual Hub Core */}
              <div className="absolute w-12 h-12 bg-black border border-white/25 rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Star className="text-celestial-gold" size={14} fill="currentColor" />
              </div>

              {/* Render Planetary Node Coordinates on the edge */}
              {solarSysNodes.map((node, idx) => {
                const angle = (idx * (360 / solarSysNodes.length)) * (Math.PI / 180);
                const radius = 105; // layout distance
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                const isActive = activeNode === node.name;

                return (
                  <motion.button
                    key={node.name}
                    style={{ x, y }}
                    whileHover={{ scale: 1.15 }}
                    onMouseEnter={() => setActiveNode(node.name)}
                    onMouseLeave={() => setActiveNode(null)}
                    className={`absolute w-10 h-10 rounded-full border flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-celestial-purple border-celestial-gold shadow-[0_0_15px_rgba(234,179,8,0.4)] text-white' 
                        : 'bg-black/90 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <span className="text-sm select-none">{node.symbol}</span>
                    <span className="text-[7px] font-bold opacity-60 mt-0.5">{node.degree}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Dynamic Node Detail Explainer Display */}
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-h-[75px] mb-8 relative">
              <p className="text-[7px] uppercase tracking-wider text-celestial-gold font-bold mb-1">Interactive Node Analyzer</p>
              <AnimatePresence mode="wait">
                {activeNode ? (
                  <motion.div
                    key={activeNode}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {solarSysNodes.filter(n => n.name === activeNode).map(n => (
                      <div key={n.name} className="flex justify-between items-start">
                        <div className="pr-4">
                          <p className="text-xs font-serif text-white flex items-center gap-1.5 font-bold">
                            {n.symbol} {n.name} <span className="text-[9px] font-sans text-celestial-purple">in {n.sign} ({n.house})</span>
                          </p>
                          <p className="text-[11px] text-white/50 leading-relaxed font-light mt-1">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="default-analyzer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 py-1"
                  >
                    <HelpCircle size={14} className="text-white/20" />
                    <p className="text-[10px] text-white/30 font-light italic">Hover over planetary aspect coordinates to analyze key celestial transits in your chart.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Elements Balance Snapshot */}
            <div className="w-full grid grid-cols-2 gap-4 mb-8">
              <div className="glass-premium border border-white/5 rounded-2xl p-5">
                <p className="text-[7px] uppercase tracking-widest text-white/30 font-bold mb-1.5">Dominant Elemental Core</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${elementalAffiliation.color}`}>{elementalAffiliation.element}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-celestial-magenta shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-light italic">{elementalAffiliation.desc}</p>
              </div>

              <div className="glass-premium border border-white/5 rounded-2xl p-5">
                <p className="text-[7px] uppercase tracking-widest text-white/30 font-bold mb-1.5">Cosmic Alignment Rate</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-serif text-celestial-gold italic">0.963</span>
                  <span className="text-[8px] text-white/30 uppercase font-mono">Phi Ratio</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3">
                  <div className="bg-gradient-to-r from-celestial-purple to-celestial-magenta h-full w-[96.3%]" />
                </div>
              </div>
            </div>

            {/* Deep AI Reading Box */}
            <div className="w-full relative overflow-hidden rounded-[2rem] p-7 border border-celestial-purple/20 bg-gradient-to-b from-celestial-purple/[0.04] to-[#04010a]/50 mb-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient from-celestial-purple/10 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={11} className="text-celestial-magenta" />
                <h3 className="text-[9px] uppercase tracking-[0.25em] text-celestial-magenta font-bold">Deep AI Chart Synthesis</h3>
              </div>

              <div className="min-h-[140px]">
                {loading ? (
                  <div className="space-y-3.5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-celestial-magenta animate-ping" />
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Initiating Conclave Algorithm...</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 8 }} className="h-full bg-celestial-magenta" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 bg-white/5 rounded-full w-[95%] animate-pulse" />
                      <div className="h-2.5 bg-white/5 rounded-full w-[85%] animate-pulse delay-75" />
                      <div className="h-2.5 bg-white/5 rounded-full w-[90%] animate-pulse delay-150" />
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs leading-relaxed text-indigo-50/70 font-light space-y-4 whitespace-pre-wrap"
                  >
                    {reading}
                  </motion.div>
                )}
              </div>
            </div>

            <p className="text-[8px] uppercase tracking-widest text-white/20 text-center mb-8">Celestial Dynamics Engine • Nexus Synced</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
