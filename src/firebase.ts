import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  type Firestore
} from 'firebase/firestore';

export interface ScoreEntry {
  id: string;
  player_name: string;
  character_id: string;
  total_score: number;
  created_at?: any;
}

// Firebase configuration (with default fallback for seamless Vercel deployment)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBXscBKKyMIr_3Ecn0yLYD29RSu31-yyIg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aqua-spin.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aqua-spin",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aqua-spin.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "322966427194",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:322966427194:web:44a5793696ea9a0e8f0703",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KKT5BGDG4W"
};

// Check if Firebase is properly configured
const isConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'YOUR_API_KEY'
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase is not configured yet. Using localStorage fallback. Please configure .env or Vercel Environment Variables.");
}

// LocalStorage fallback helper
const LOCAL_STORAGE_KEY = 'aqua_spin_scores';

function getLocalScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalScore(entry: ScoreEntry) {
  try {
    const scores = getLocalScores();
    scores.push(entry);
    scores.sort((a, b) => b.total_score - a.total_score);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scores.slice(0, 50)));
  } catch (e) {
    console.error("Failed to save local score:", e);
  }
}

/**
 * Fetch top 10 scores from Firestore (or localStorage fallback)
 */
export async function getScores(): Promise<ScoreEntry[]> {
  if (db) {
    try {
      const scoresRef = collection(db, 'scores');
      const q = query(scoresRef, orderBy('total_score', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      const scores: ScoreEntry[] = [];
      querySnapshot.forEach((doc: any) => {
        const data = doc.data();
        scores.push({
          id: doc.id,
          player_name: data.player_name || 'ผู้เล่น',
          character_id: data.character_id || '',
          total_score: Number(data.total_score) || 0,
          created_at: data.created_at
        });
      });
      return scores;
    } catch (error) {
      console.error("Firestore getScores error (falling back to localStorage):", error);
      return getLocalScores().slice(0, 10);
    }
  }

  return getLocalScores().slice(0, 10);
}

/**
 * Save a new player score to Firestore (and localStorage backup)
 */
export async function saveScore(playerName: string, characterId: string, totalScore: number): Promise<void> {
  const newEntry: ScoreEntry = {
    id: 'local_' + Date.now(),
    player_name: playerName,
    character_id: characterId,
    total_score: totalScore,
    created_at: new Date().toISOString()
  };

  // Always save locally as backup
  saveLocalScore(newEntry);

  if (db) {
    try {
      const scoresRef = collection(db, 'scores');
      await addDoc(scoresRef, {
        player_name: playerName,
        character_id: characterId,
        total_score: totalScore,
        created_at: serverTimestamp()
      });
    } catch (error) {
      console.error("Firestore saveScore error:", error);
    }
  }
}
