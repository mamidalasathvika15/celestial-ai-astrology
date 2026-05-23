import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, onSnapshot, orderBy, addDoc, getDocFromServer } from 'firebase/firestore';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  sentiment?: string;
  insight?: string;
}

export interface UserProfile {
  name: string;
  zodiacSign: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  onboarded: boolean;
  streak: number;
  lastVisit: string;
  isPremium: boolean;
  journal: JournalEntry[];
}

export function useUserStore() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<Omit<UserProfile, 'journal'> | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setProfileData(null);
        setJournal([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Sync Profile
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<UserProfile, 'journal'>;
        setProfileData(data);
        
        // Auto-update streak if needed
        const today = new Date().toDateString();
        if (data.lastVisit !== today) {
            updateDoc(userDocRef, {
                streak: (data.streak || 0) + 1,
                lastVisit: today
            }).catch(e => console.warn("Streak update failed:", e));
        }
      } else {
        setProfileData(null);
      }
      setLoading(false);
    }, (err) => {
        console.error("Profile Snapshot Error:", err);
        setError(err.message);
        setLoading(false);
    });

    return () => unsubProfile();
  }, [user]);

  // Sync Journal
  useEffect(() => {
    if (!user) return;

    const journalRef = collection(db, 'users', user.uid, 'journal');
    const journalQuery = query(journalRef, orderBy('date', 'desc'));

    const unsubJournal = onSnapshot(journalQuery, (snap) => {
      const entries = snap.docs.map(d => ({ id: d.id, ...d.data() })) as JournalEntry[];
      setJournal(entries);
    }, (err) => {
        console.error("Journal Snapshot Error:", err);
    });

    return () => unsubJournal();
  }, [user]);

  const saveProfile = async (newProfile: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
        const initialProfile: UserProfile = {
            name: user.displayName || 'Seeker',
            zodiacSign: 'Leo',
            birthDate: '',
            birthTime: '',
            birthLocation: '',
            onboarded: false,
            streak: 1,
            lastVisit: new Date().toDateString(),
            isPremium: false,
            journal: [],
            ...newProfile
        };
        
        // Remove journal from payload
        const { journal: _, ...dataToSave } = newProfile as any;
        
        await setDoc(userDocRef, profileData ? dataToSave : initialProfile, { merge: true });
        setError(null);
    } catch (err: any) {
        console.error("Save Profile Error:", err);
        setError(`Failed to save essence: ${err.message}`);
    }
  };

  const addJournalEntry = async (content: string) => {
    if (!user) {
        setError("Not authenticated");
        return;
    }
    const journalRef = collection(db, 'users', user.uid, 'journal');
    try {
        const entryId = Date.now().toString();
        await setDoc(doc(journalRef, entryId), {
            id: entryId,
            date: new Date().toISOString(),
            content
        });
        setError(null);
    } catch (err: any) {
        console.error("Add Journal Error:", err);
        setError(`Failed to seal entry: ${err.message}`);
    }
  };

  const resetProfile = async () => {
    // In Firebase version, reset might mean local state, but we really want sign out
    setProfileData(null);
    setJournal([]);
  };

  const combinedProfile: UserProfile | null = profileData ? { ...profileData, journal } : null;

  return { user, profile: combinedProfile, saveProfile, addJournalEntry, resetProfile, setError, loading, error };
}
