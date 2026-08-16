import { motion } from 'framer-motion';

export interface CharacterInfo {
  id: string;
  name: string;
  color: string;
}

export const CHARACTERS_DATA: CharacterInfo[] = [
  { id: 'boy', name: 'น้องภูมิ', color: '#38bdf8' },
  { id: 'girl', name: 'น้องฟ้า', color: '#f472b6' },
  { id: 'cat', name: 'น้องเหมียว', color: '#fb923c' },
  { id: 'dog', name: 'น้องตูบ', color: '#a3e635' },
];

interface CharacterSpriteProps {
  id: string;
  size?: number;
  mood?: 'idle' | 'happy' | 'cheer' | 'jump';
  className?: string;
}

export default function CharacterSprite({ id, size = 120, mood = 'idle', className = '' }: CharacterSpriteProps) {
  const getAnimation = (): any => {
    switch (mood) {
      case 'jump':
      case 'cheer':
        return {
          y: [0, -20, 0, -15, 0],
          rotate: [-3, 3, -3, 3, 0],
          transition: { repeat: Infinity, duration: 1.2 }
        };
      case 'happy':
        return {
          scale: [1, 1.05, 1],
          y: [0, -6, 0],
          transition: { repeat: Infinity, duration: 1.5 }
        };
      case 'idle':
      default:
        return {
          y: [0, -4, 0],
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        };
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      style={{ width: size, height: size * 1.3 }}
      className={`relative inline-flex items-end justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 130"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {id === 'boy' && <BoyModel mood={mood} />}
        {id === 'girl' && <GirlModel mood={mood} />}
        {id === 'cat' && <CatModel mood={mood} />}
        {id === 'dog' && <DogModel mood={mood} />}
      </svg>
    </motion.div>
  );
}

// 👦 น้องภูมิ
function BoyModel({ mood }: { mood: string }) {
  return (
    <g>
      {/* Shadow */}
      <ellipse cx="50" cy="126" rx="28" ry="4" fill="#000000" fillOpacity="0.15" />
      {/* Shoes */}
      <ellipse cx="40" cy="122" rx="10" ry="5" fill="#3b82f6" />
      <ellipse cx="60" cy="122" rx="10" ry="5" fill="#3b82f6" />
      {/* Legs */}
      <rect x="36" y="98" width="8" height="24" rx="4" fill="#1e293b" />
      <rect x="56" y="98" width="8" height="24" rx="4" fill="#1e293b" />
      {/* Body / Overalls */}
      <rect x="32" y="68" width="36" height="34" rx="8" fill="#38bdf8" />
      <rect x="35" y="60" width="30" height="15" rx="4" fill="#fbbf24" /> {/* Shirt */}
      <rect x="37" y="68" width="6" height="32" fill="#0284c7" /> {/* Suspenders */}
      <rect x="57" y="68" width="6" height="32" fill="#0284c7" />
      {/* Arms */}
      {mood === 'cheer' || mood === 'jump' ? (
        <>
          <path d="M30 68 Q16 45 22 36" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" />
          <circle cx="22" cy="35" r="5" fill="#fed7aa" />
          <path d="M70 68 Q84 45 78 36" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" />
          <circle cx="78" cy="35" r="5" fill="#fed7aa" />
        </>
      ) : (
        <>
          <path d="M32 68 Q22 82 28 92" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
          <circle cx="28" cy="92" r="5" fill="#fed7aa" />
          <path d="M68 68 Q78 82 72 92" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
          <circle cx="72" cy="92" r="5" fill="#fed7aa" />
        </>
      )}
      {/* Head */}
      <circle cx="50" cy="40" r="24" fill="#fed7aa" />
      {/* Hair */}
      <path d="M26 38 C26 20 40 14 50 14 C60 14 74 20 74 38 C70 30 64 24 50 24 C36 24 30 30 26 38 Z" fill="#451a03" />
      <path d="M26 36 Q34 22 50 22 Q66 22 74 36 Q74 28 66 18 Q50 12 34 18 Q26 28 26 36 Z" fill="#78350f" />
      {/* Cap */}
      <path d="M28 28 Q50 12 72 28" fill="#38bdf8" />
      <ellipse cx="50" cy="24" rx="22" ry="8" fill="#0284c7" />
      {/* Face */}
      {/* Eyes */}
      <circle cx="42" cy="38" r="3.5" fill="#1e293b" />
      <circle cx="43" cy="36.5" r="1.2" fill="#ffffff" />
      <circle cx="58" cy="38" r="3.5" fill="#1e293b" />
      <circle cx="59" cy="36.5" r="1.2" fill="#ffffff" />
      {/* Cheeks */}
      <circle cx="36" cy="44" r="4" fill="#fb7185" fillOpacity="0.5" />
      <circle cx="64" cy="44" r="4" fill="#fb7185" fillOpacity="0.5" />
      {/* Mouth */}
      {mood === 'cheer' || mood === 'jump' || mood === 'happy' ? (
        <path d="M44 44 Q50 53 56 44" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" fill="#ef4444" />
      ) : (
        <path d="M45 44 Q50 49 55 44" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </g>
  );
}

// 👧 น้องฟ้า
function GirlModel({ mood }: { mood: string }) {
  return (
    <g>
      {/* Shadow */}
      <ellipse cx="50" cy="126" rx="28" ry="4" fill="#000000" fillOpacity="0.15" />
      {/* Shoes */}
      <ellipse cx="40" cy="122" rx="9" ry="5" fill="#ec4899" />
      <ellipse cx="60" cy="122" rx="9" ry="5" fill="#ec4899" />
      {/* Legs */}
      <rect x="37" y="98" width="7" height="24" rx="3.5" fill="#fed7aa" />
      <rect x="56" y="98" width="7" height="24" rx="3.5" fill="#fed7aa" />
      {/* Dress */}
      <path d="M36 64 L24 100 L76 100 L64 64 Z" fill="#f472b6" />
      <path d="M24 100 Q50 106 76 100" stroke="#db2777" strokeWidth="3" fill="#fbcfe8" />
      <rect x="36" y="58" width="28" height="15" rx="5" fill="#ffffff" />
      {/* Bow on chest */}
      <circle cx="50" cy="65" r="3" fill="#ec4899" />
      {/* Arms */}
      {mood === 'cheer' || mood === 'jump' ? (
        <>
          <path d="M34 66 Q18 45 24 36" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
          <path d="M66 66 Q82 45 76 36" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M34 66 Q24 80 30 90" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
          <path d="M66 66 Q76 80 70 90" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
        </>
      )}
      {/* Hair Back */}
      <circle cx="30" cy="44" r="12" fill="#78350f" />
      <circle cx="70" cy="44" r="12" fill="#78350f" />
      {/* Head */}
      <circle cx="50" cy="40" r="23" fill="#fed7aa" />
      {/* Hair Front */}
      <path d="M27 36 C27 18 40 14 50 14 C60 14 73 18 73 36 C66 26 58 24 50 24 C42 24 34 26 27 36 Z" fill="#92400e" />
      {/* Hair Ribbons */}
      <circle cx="28" cy="32" r="5" fill="#ec4899" />
      <circle cx="72" cy="32" r="5" fill="#ec4899" />
      {/* Eyes */}
      <circle cx="42" cy="38" r="3.5" fill="#1e293b" />
      <circle cx="43" cy="36.5" r="1.3" fill="#ffffff" />
      <circle cx="58" cy="38" r="3.5" fill="#1e293b" />
      <circle cx="59" cy="36.5" r="1.3" fill="#ffffff" />
      {/* Cheeks */}
      <circle cx="36" cy="44" r="4" fill="#fb7185" fillOpacity="0.6" />
      <circle cx="64" cy="44" r="4" fill="#fb7185" fillOpacity="0.6" />
      {/* Mouth */}
      {mood === 'cheer' || mood === 'jump' || mood === 'happy' ? (
        <path d="M44 44 Q50 53 56 44" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" fill="#ef4444" />
      ) : (
        <path d="M45 44 Q50 49 55 44" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </g>
  );
}

// 🐱 น้องเหมียว
function CatModel({ mood }: { mood: string }) {
  return (
    <g>
      {/* Shadow */}
      <ellipse cx="50" cy="126" rx="28" ry="4" fill="#000000" fillOpacity="0.15" />
      {/* Tail */}
      <motion.path
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{ originX: '70px', originY: '95px' }}
        d="M68 95 Q88 85 82 65"
        stroke="#ea580c"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Feet */}
      <ellipse cx="38" cy="122" rx="9" ry="5" fill="#ea580c" />
      <ellipse cx="62" cy="122" rx="9" ry="5" fill="#ea580c" />
      {/* Legs */}
      <rect x="34" y="98" width="8" height="24" rx="4" fill="#fb923c" />
      <rect x="58" y="98" width="8" height="24" rx="4" fill="#fb923c" />
      {/* Body */}
      <rect x="30" y="65" width="40" height="38" rx="16" fill="#fb923c" />
      {/* Tummy */}
      <ellipse cx="50" cy="85" rx="13" ry="15" fill="#ffedd5" />
      {/* Scarf */}
      <path d="M30 65 Q50 74 70 65 L66 70 Q50 78 34 70 Z" fill="#ef4444" />
      <circle cx="50" cy="71" r="5" fill="#facc15" />
      {/* Arms */}
      {mood === 'cheer' || mood === 'jump' ? (
        <>
          <path d="M32 68 Q16 48 24 38" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="24" cy="38" rx="5" ry="4" fill="#ffedd5" />
          <path d="M68 68 Q84 48 76 38" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="76" cy="38" rx="5" ry="4" fill="#ffedd5" />
        </>
      ) : (
        <>
          <path d="M32 68 Q22 82 28 92" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="28" cy="92" rx="4" ry="4" fill="#ffedd5" />
          <path d="M68 68 Q78 82 72 92" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="72" cy="92" rx="4" ry="4" fill="#ffedd5" />
        </>
      )}
      {/* Head */}
      <ellipse cx="50" cy="44" rx="26" ry="22" fill="#fb923c" />
      {/* Ears */}
      <polygon points="26,34 34,14 44,28" fill="#fb923c" />
      <polygon points="29,32 35,18 42,28" fill="#f472b6" />
      <polygon points="74,34 66,14 56,28" fill="#fb923c" />
      <polygon points="71,32 65,18 58,28" fill="#f472b6" />
      {/* Stripes on forehead */}
      <path d="M50 24 L50 32 M44 26 L45 32 M56 26 L55 32" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
      {/* Face */}
      <circle cx="41" cy="42" r="3.5" fill="#1e293b" />
      <circle cx="42" cy="40.5" r="1.2" fill="#ffffff" />
      <circle cx="59" cy="42" r="3.5" fill="#1e293b" />
      <circle cx="60" cy="40.5" r="1.2" fill="#ffffff" />
      {/* Nose & Whiskers */}
      <polygon points="48,47 52,47 50,50" fill="#f43f5e" />
      <path d="M50 50 Q46 54 42 52 M50 50 Q54 54 58 52" stroke="#431407" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M33 46 L22 44 M33 49 L21 50 M67 46 L78 44 M67 49 L79 50" stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="34" cy="48" r="4" fill="#fb7185" fillOpacity="0.5" />
      <circle cx="66" cy="48" r="4" fill="#fb7185" fillOpacity="0.5" />
    </g>
  );
}

// 🐶 น้องตูบ
function DogModel({ mood }: { mood: string }) {
  return (
    <g>
      {/* Shadow */}
      <ellipse cx="50" cy="126" rx="28" ry="4" fill="#000000" fillOpacity="0.15" />
      {/* Tail */}
      <motion.path
        animate={{ rotate: [-15, 15, -15] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
        style={{ originX: '68px', originY: '95px' }}
        d="M68 95 Q85 85 86 70"
        stroke="#854d0e"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Feet */}
      <ellipse cx="38" cy="122" rx="9" ry="5" fill="#713f12" />
      <ellipse cx="62" cy="122" rx="9" ry="5" fill="#713f12" />
      {/* Legs */}
      <rect x="34" y="98" width="8" height="24" rx="4" fill="#a16207" />
      <rect x="58" y="98" width="8" height="24" rx="4" fill="#a16207" />
      {/* Body & Vest */}
      <rect x="30" y="65" width="40" height="38" rx="14" fill="#a16207" />
      <rect x="34" y="65" width="32" height="32" rx="6" fill="#84cc16" /> {/* Green Vest */}
      <ellipse cx="50" cy="85" rx="8" ry="10" fill="#fef08a" />
      {/* Arms */}
      {mood === 'cheer' || mood === 'jump' ? (
        <>
          <path d="M32 68 Q16 48 24 38" stroke="#a16207" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="24" cy="38" rx="5" ry="4" fill="#fef08a" />
          <path d="M68 68 Q84 48 76 38" stroke="#a16207" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="76" cy="38" rx="5" ry="4" fill="#fef08a" />
        </>
      ) : (
        <>
          <path d="M32 68 Q22 82 28 92" stroke="#a16207" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="28" cy="92" rx="4" ry="4" fill="#fef08a" />
          <path d="M68 68 Q78 82 72 92" stroke="#a16207" strokeWidth="8" strokeLinecap="round" />
          <ellipse cx="72" cy="92" rx="4" ry="4" fill="#fef08a" />
        </>
      )}
      {/* Floppy Ears */}
      <path d="M28 32 Q14 44 20 62 Q28 64 30 48 Z" fill="#713f12" />
      <path d="M72 32 Q86 44 80 62 Q72 64 70 48 Z" fill="#713f12" />
      {/* Head */}
      <ellipse cx="50" cy="44" rx="25" ry="22" fill="#ca8a04" />
      {/* Patch over one eye */}
      <ellipse cx="40" cy="42" rx="10" ry="11" fill="#854d0e" />
      {/* Face */}
      <circle cx="40" cy="42" r="3.5" fill="#1e293b" />
      <circle cx="41" cy="40.5" r="1.2" fill="#ffffff" />
      <circle cx="60" cy="42" r="3.5" fill="#1e293b" />
      <circle cx="61" cy="40.5" r="1.2" fill="#ffffff" />
      {/* Snout */}
      <ellipse cx="50" cy="50" rx="10" ry="8" fill="#fef08a" />
      <ellipse cx="50" cy="46" rx="4" ry="3" fill="#1e293b" />
      <path d="M50 49 Q46 54 43 52 M50 49 Q54 54 57 52" stroke="#431407" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tongue out when happy/cheer */}
      {mood !== 'idle' && (
        <path d="M48 53 C48 57 52 57 52 53 Z" fill="#f43f5e" />
      )}
    </g>
  );
}
