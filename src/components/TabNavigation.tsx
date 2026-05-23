import { motion } from 'framer-motion';
import { Home, Compass, MessageCircle, User, Sparkles, BookOpen, Crown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'ai', icon: null, label: '' }, // FAB
  { id: 'compatibility', icon: Compass, label: 'Synastry' },
  { id: 'profile', icon: User, label: 'Profile' }
];

export default function TabNavigation({ onPremiumClick }: { onPremiumClick: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md h-20 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl flex items-center justify-around px-4 z-50">
      {tabs.map((tab, idx) => {
        if (tab.id === 'ai') {
           return (
            <div key="fab-container" className="relative w-12 h-12">
               <button
                key="fab"
                onClick={() => navigate('/ai')}
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-celestial-purple via-celestial-magenta to-celestial-gold p-[1px] shadow-[0_0_30px_rgba(219,39,119,0.4)] active:scale-95 transition-transform"
              >
                <div className="w-full h-full rounded-full bg-[#050208] flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
              </button>
            </div>
           );
        }

        const isActive = location.pathname.includes(tab.id) || (tab.id === 'home' && location.pathname === '/');
        
        return (
          <button
            key={tab.id}
            onClick={() => navigate(`/${tab.id}`)}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                className="w-1 h-1 rounded-full bg-celestial-magenta mb-1 shadow-[0_0_8px_rgba(219,39,119,0.8)]"
              />
            )}
            {!isActive && <div className="h-1 mb-1" />}
            {tab.icon && <tab.icon 
              size={18} 
              className={`transition-colors duration-300 ${isActive ? 'text-celestial-magenta' : 'text-white/30'}`} 
            />}
            <span className={`text-[8px] uppercase tracking-tighter font-bold transition-colors ${isActive ? 'text-celestial-magenta' : 'text-white/30'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
