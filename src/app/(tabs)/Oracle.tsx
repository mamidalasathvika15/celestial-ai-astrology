import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Wand2, Moon, Brain, Heart, Zap, Share2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useUserStore } from '../../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: string;
}

const ORACLES = [
  { id: 'general', name: 'Spiritual Guide', icon: Sparkles, color: 'text-celestial-gold', endpoint: '/api/astrology/horoscope' },
  { id: 'relationship', name: 'Love Coach', icon: Heart, color: 'text-celestial-magenta', endpoint: '/api/astrology/interpret' },
  { id: 'dream', name: 'Dream Weaver', icon: Moon, color: 'text-indigo-400', endpoint: '/api/astrology/interpret' },
  { id: 'journal', name: 'Life Coach', icon: Brain, color: 'text-blue-400', endpoint: '/api/astrology/interpret' }
];

export default function Oracle() {
  const { profile, setError } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: `Greeting, seeker. I am the Celestial Oracle. How may the planetary energies of ${profile?.zodiacSign || 'the cosmos'} guide you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeOracle, setActiveOracle] = useState(ORACLES[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const payload = activeOracle.id === 'general' 
        ? { sign: profile?.zodiacSign, mood: 'Inquisitive', context: input }
        : { type: activeOracle.id, content: input, profile };

      const response = await axios.post(activeOracle.endpoint, payload);

      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.data.text 
      };
      setMessages(prev => [...prev, assistantMsg]);
      setError(null);
    } catch (error: any) {
      const msg = error.response?.data?.error || "The cosmic signal is being interrupted by stellar winds. Please try again in a moment.";
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: msg
      };
      setMessages(prev => [...prev, errorMsg]);
      if (error.response?.status === 429) {
        setError(msg);
        setTimeout(() => setError(null), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
        { id: '1', role: 'assistant', content: `The energies have been reset. How may I guide you now, seeker?` }
    ]);
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celestial-insight-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-transparent relative">
      {/* Header with actions */}
      <div className="px-8 pt-10 flex justify-between items-center mb-6 shrink-0">
        <div>
            <h1 className="text-3xl font-serif italic text-white tracking-tight leading-none mb-1">Oracle</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Resonance Analysis</p>
        </div>
        <div className="flex gap-2">
            <button onClick={exportChat} className="p-2.5 rounded-full glass border border-white/10 text-white/40 hover:text-white transition-colors" title="Export Ritual Logs">
                <Share2 size={16} />
            </button>
            <button onClick={clearChat} className="p-2.5 rounded-full glass border border-white/10 text-white/40 hover:text-white transition-colors" title="Clear Energies">
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      {/* Oracle Selector */}
      <div className="px-8 mb-4 shrink-0">
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {ORACLES.map((o) => {
            const isActive = activeOracle.id === o.id;
            return (
                <button
                key={o.id}
                onClick={() => setActiveOracle(o)}
                className={`flex-shrink-0 px-4 py-2 rounded-full border flex flex-row items-center gap-2 transition-all relative ${
                    isActive 
                    ? 'glass-premium border-white/30 bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white' 
                    : 'bg-white/[0.03] border-white/5 opacity-40 hover:opacity-100 text-white/70'
                }`}
                >
                <o.icon size={13} className={o.color} />
                <span className="text-[11px] font-medium tracking-wide whitespace-nowrap">{o.name}</span>
                </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 flex flex-col gap-8 no-scrollbar scroll-smooth mb-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={m.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] rounded-[1.5rem] px-5 py-3 ${
                m.role === 'user' 
                ? 'bg-celestial-purple/20 border border-white/10 text-white' 
                : 'glass-premium border border-white/10 text-indigo-50/90'
              } shadow-lg backdrop-blur-3xl`}>
                <p className="text-[15px] leading-relaxed font-light whitespace-pre-wrap">{m.content}</p>
                {m.role === 'assistant' && (
                   <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 opacity-30">
                      <div className="flex items-center gap-2">
                        <Sparkles size={10} className={activeOracle.color} />
                        <span className="text-[8px] uppercase tracking-widest font-bold">Nexus 01 Synced</span>
                      </div>
                   </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="glass-premium border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
                 <div className="flex gap-1.5">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className={`w-1 h-1 rounded-full ${activeOracle.color.replace('text-', 'bg-')}`} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className={`w-1 h-1 rounded-full ${activeOracle.color.replace('text-', 'bg-')}`} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className={`w-1 h-1 rounded-full ${activeOracle.color.replace('text-', 'bg-')}`} />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area - DOCKED */}
      <div className="px-8 pb-32 shrink-0">
        <div className="glass-premium rounded-full p-1 flex items-center gap-2 border border-white/10 shadow-2xl overflow-hidden">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Whisper to the ${activeOracle.name}...`}
            className="flex-1 bg-transparent px-4 py-1.5 text-xs text-white focus:outline-none placeholder:text-white/20 font-light"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black active:scale-95 transition-all disabled:opacity-50 shrink-0"
          >
            <Send size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
