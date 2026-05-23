import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, Sparkles, Zap, Heart, MessageCircle } from 'lucide-react';
import { useUserStore } from '../store/useStore';

const FEATURES = [
  { icon: Sparkles, text: 'Unlimited AI Oracle Consultation' },
  { icon: Zap, text: 'Real-time Transit Personalized Alerts' },
  { icon: Heart, text: 'Deep Compatibility Reports' },
  { icon: MessageCircle, text: 'Voice-enabled Astrology Assistant' },
];

export default function Paywall({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { profile, saveProfile } = useUserStore();

  const handleSubscribe = () => {
    if (profile) {
      saveProfile({ ...profile, isPremium: true });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-[#050208]/95 backdrop-blur-2xl flex items-center justify-center p-6"
        >
          <motion.div 
             initial={{ scale: 0.9, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             exit={{ scale: 0.9, y: 20 }}
             className="w-full max-w-sm glass rounded-[3rem] p-10 relative overflow-hidden border border-celestial-gold/30 shadow-[0_0_80px_rgba(217,119,6,0.1)] bg-[#050208]"
          >
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-gold/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="bg-celestial-gold/20 p-4 rounded-3xl mb-6 shadow-[0_0_30px_rgba(217,119,6,0.2)]">
                <Crown size={32} className="text-celestial-gold" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-serif italic text-white mb-1">Celestial Plus</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-celestial-gold font-bold">The Ultimate Cosmic Power</p>
            </div>

            <div className="flex flex-col gap-5 mb-10 relative z-10 text-white">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                    <Check size={12} className="text-celestial-gold" />
                  </div>
                  <span className="text-sm font-light opacity-80">{f.text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 relative z-10">
               <button 
                onClick={handleSubscribe}
                className="w-full py-5 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
              >
                  Start 7-Day Free Trial
               </button>
               <p className="text-[9px] text-center text-white/30 uppercase tracking-widest">
                 Then $9.99 / month • Cancel anytime
               </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center gap-6 relative z-10">
               <span className="text-[10px] uppercase text-white/20 hover:text-white/40 cursor-pointer">Restore</span>
               <span className="text-[10px] uppercase text-white/20 hover:text-white/40 cursor-pointer">Terms</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
