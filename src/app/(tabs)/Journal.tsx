import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Calendar, Sparkles, Plus, X, Search, Sparkle } from 'lucide-react';
import { useUserStore } from '../../store/useStore';
import { format } from 'date-fns';
import axios from 'axios';

export default function Journal() {
  const { profile, addJournalEntry, setError } = useUserStore();
  const [isAdding, setIsAdding] = useState(false);
  const [note, setNote] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Record<string, string>>({});

  const [isSaving, setIsSaving] = useState(false);

  const entries = profile?.journal || [];

  const handleSave = async () => {
    if (!note.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await addJournalEntry(note);
      setNote('');
      setIsAdding(false);
      setError(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const analyzeEntry = async (id: string, content: string) => {
    setAnalyzingId(id);
    try {
      const response = await axios.post('/api/astrology/interpret', {
        type: 'journal',
        content,
        profile
      });
      setAnalysis(prev => ({ ...prev, [id]: response.data.text }));
      setError(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Planetary interpretation failed.";
      if (error.response?.status === 429) {
        setError(msg);
        setTimeout(() => setError(null), 5000);
      }
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-40 px-8 pt-12 max-w-lg mx-auto">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-serif italic text-white mb-2">Soul Journal</h1>
          <p className="text-white/40 text-sm italic">Capture your cosmic reflections.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 rounded-full bg-celestial-purple flex items-center justify-center text-white shadow-lg shadow-celestial-purple/20 active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Stats row */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 glass rounded-2xl p-4 border border-white/5">
          <p className="text-[8px] uppercase tracking-widest text-celestial-gold mb-1 font-bold">Total Entries</p>
          <p className="text-xl font-serif text-white">{entries.length}</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-4 border border-white/5">
          <p className="text-[8px] uppercase tracking-widest text-white/30 mb-1 font-bold">Inspiration State</p>
          <p className="text-xl font-serif text-white">Flowing</p>
        </div>
      </div>

      {/* Entry List */}
      <div className="flex flex-col gap-6">
        {entries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full glass-premium border-white/10 flex items-center justify-center mb-4 text-white/20">
                <PenLine size={32} />
            </div>
            <p className="font-serif italic text-2xl text-white tracking-tight">Your celestial archive is empty</p>
            <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Record your first vibrational shift</p>
            <button 
                onClick={() => setIsAdding(true)}
                className="mt-4 px-6 py-3 rounded-full border border-celestial-purple/30 text-celestial-purple text-[10px] uppercase font-bold tracking-widest hover:bg-celestial-purple/10 active:scale-95 transition-all"
            >
                Begin Record
            </button>
          </motion.div>
        ) : (
          [...entries].reverse().map((entry, idx) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-premium rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient from-celestial-purple/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <Calendar size={12} />
                   </div>
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{format(new Date(entry.date), 'MMMM dd, yyyy')}</span>
                </div>
                {!analysis[entry.id] && (
                   <button 
                    onClick={() => analyzeEntry(entry.id, entry.content)}
                    disabled={analyzingId === entry.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-celestial-magenta/10 border border-celestial-magenta/20 text-celestial-magenta transition-all hover:bg-celestial-magenta/20"
                  >
                    <Sparkles size={12} className={analyzingId === entry.id ? 'animate-spin' : 'animate-pulse'} />
                    <span className="text-[8px] uppercase font-bold tracking-widest">Interpret</span>
                  </button>
                )}
              </div>
              
              <p className="text-[15px] text-indigo-50 leading-relaxed italic mb-6 font-light">
                "{entry.content}"
              </p>
              
              <div className="flex items-center justify-between opacity-10 group-hover:opacity-40 transition-opacity mb-4">
                 <div className="h-px flex-1 bg-white" />
                 <span className="mx-4 text-[8px] uppercase tracking-[0.5em] font-bold">Nexus 01 Log</span>
                 <div className="h-px flex-1 bg-white" />
              </div>

              <AnimatePresence>
                {analysis[entry.id] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                       <Sparkle size={10} className="text-celestial-gold" />
                       <span className="text-[9px] uppercase font-bold tracking-widest text-celestial-gold">Celestial Perception</span>
                    </div>
                    <div className="glass bg-celestial-gold/5 border-celestial-gold/10 p-5 rounded-3xl">
                        <p className="text-[12px] text-indigo-50/70 leading-relaxed italic">
                        {analysis[entry.id]}
                        </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050208]/90 backdrop-blur-xl flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-[#050208] border-t border-white/10 rounded-t-[3rem] p-10 pb-16 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif italic text-white">New Reflection</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <textarea 
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your current energy or a recent dream..."
                className="w-full h-40 bg-transparent text-white text-lg font-light leading-relaxed focus:outline-none resize-none placeholder:text-white/10 italic"
              />

              <button 
                onClick={handleSave}
                disabled={!note.trim() || isSaving}
                className="w-full py-4 mt-8 bg-white text-black font-bold uppercase tracking-widest rounded-2xl active:scale-95 transition-transform disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Sparkles size={18} />
                  </motion.div>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Seal Entry</span>
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
