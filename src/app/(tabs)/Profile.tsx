import { motion } from 'framer-motion';
import { User, Settings, Shield, Book, Star, MapPin, Calendar, LogOut, Edit3, Crown } from 'lucide-react';
import { useUserStore } from '../../store/useStore';
import { logout } from '../../lib/firebase';

export default function Profile() {
  const { user, profile, resetProfile, saveProfile } = useUserStore();

  const getSignIcon = (s: string) => {
    const icons: Record<string, string> = {
      'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
      'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
      'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
    };
    return icons[s] || '✨';
  };

  const togglePremium = () => {
    if (profile) {
      saveProfile({ isPremium: !profile.isPremium });
    }
  };

  const handleLogout = async () => {
    await logout();
    resetProfile();
  };

  const handleEdit = () => {
    if (profile) {
        saveProfile({ onboarded: false });
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-40 px-8 pt-12 max-w-lg mx-auto bg-[#050208]">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif italic font-light text-white">Your Essence</h1>
        <div className="flex gap-2">
            <button 
                onClick={togglePremium}
                className={`p-3 rounded-full border transition-all ${profile?.isPremium ? 'bg-celestial-gold/20 border-celestial-gold/30 text-celestial-gold' : 'bg-white/5 border-white/5 text-white/20'}`}
            >
                <Crown size={20} />
            </button>
            <button onClick={handleLogout} className="p-3 rounded-full bg-white/5 border border-white/5 text-white/40 hover:text-white transition-colors">
                <LogOut size={20} />
            </button>
        </div>
      </header>

      {/* Profile Card */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-celestial-purple via-celestial-magenta to-celestial-gold p-[1px] shadow-[0_0_40px_rgba(109,40,217,0.2)]">
             <div className="w-full h-full rounded-full bg-[#050208] flex items-center justify-center text-4xl text-white">
                {getSignIcon(profile?.zodiacSign || 'Leo')}
             </div>
          </div>
          {profile?.isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-celestial-gold rounded-full p-1.5 border-4 border-[#050208]">
                <Star size={14} className="text-black" fill="currentColor" />
            </div>
          )}
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-serif italic mb-1 text-white">{profile?.name || user?.displayName || 'Stellar Seeker'}</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-celestial-purple font-bold">
                {profile?.zodiacSign} Sun • Spiritual Seeker
            </p>
            {user?.email && <p className="text-[9px] text-white/20 mt-2 font-mono uppercase tracking-widest">{user.email}</p>}
        </div>
      </div>

      {/* Birth Chart Preview */}
      <div className="glass rounded-[2.5rem] p-8 mb-8 border border-white/10">
        <h3 className="text-[10px] uppercase tracking-widest text-white/30 mb-8 font-bold border-b border-white/5 pb-4 flex items-center gap-2">
           <Book size={14} className="text-white" /> Birth Chart Details
        </h3>
        <div className="flex flex-col gap-6">
           <ProfileInfoRow icon={<Calendar size={16} />} title="Birth Date" value={profile?.birthDate || 'Nov 14, 1990'} />
           <ProfileInfoRow icon={<MapPin size={16} />} title="Location" value={profile?.birthLocation || 'Mumbai, India'} />
           <ProfileInfoRow icon={<Settings size={16} />} title="Birth Time" value={profile?.birthTime || '14:30'} />
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-3xl p-6 text-center border border-white/5">
            <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-2 font-bold">Cosmic Streak</span>
            <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-serif italic text-celestial-magenta block"
            >
                {profile?.streak || 1}
            </motion.span>
            <span className="text-[10px] block opacity-40 text-white">Days Aligned</span>
        </div>
        <div className="glass rounded-3xl p-6 text-center border border-white/5">
            <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-2 font-bold">Status</span>
            <span className={`text-xl font-serif italic block ${profile?.isPremium ? 'text-celestial-gold' : 'text-white/40'}`}>
                {profile?.isPremium ? 'Premium' : 'Standard'}
            </span>
            <span className="text-[10px] block opacity-40 text-white">Celestial Member</span>
        </div>
      </div>

      <button 
        onClick={handleEdit}
        className="w-full py-4 rounded-2xl border border-white/10 text-white/60 text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
      >
        <Edit3 size={14} /> Edit Cosmic Identity
      </button>
    </div>
  );
}

function ProfileInfoRow({ icon, title, value }: { icon: any, title: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3 text-white/40">
          {icon}
          <span className="text-[10px] uppercase font-bold tracking-widest">{title}</span>
       </div>
       <span className="text-sm font-light italic text-indigo-50">{value}</span>
    </div>
  );
}
