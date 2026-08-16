import { useState } from 'react';
import { PlayCircle, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Level1Garden from './levels/Level1Garden';
import Level2Dam from './levels/Level2Dam';
import Level3Boat from './levels/Level3Boat';
import Level4Quiz from './levels/Level4Quiz';
import { useAudio } from './hooks/useAudio';
import CharacterSprite, { CHARACTERS_DATA, type CharacterInfo } from './components/CharacterSprite';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0); // 0 = Char select, 1-4 = Levels, 5 = End
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo | null>(null);
  const { initAudio, playSound, isSoundOn, toggleSound } = useAudio();
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    initAudio();
    setHasStarted(true);
    playSound('click');
  };

  const handleSelectCharacter = (char: CharacterInfo) => {
    playSound('click');
    setSelectedCharacter(char);
    setCurrentLevel(1); // Start at level 1
  };

  const nextLevel = () => {
    playSound('click');
    setCurrentLevel(prev => prev + 1);
  };

  const restartGame = () => {
    playSound('click');
    setSelectedCharacter(null);
    setCurrentLevel(0);
  };

  if (!hasStarted) {
    return (
      <div className="w-full min-h-screen bg-sky-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-4xl bg-gradient-to-b from-sky-400 to-blue-500 rounded-[3rem] p-8 shadow-2xl border-8 border-white text-center flex flex-col items-center justify-center min-h-[600px]">
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-6"
          >
            🌊💡
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-4" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
            สนุกกับ<br/><span className="text-yellow-300">พลังงานน้ำ</span>
          </h1>
          <p className="text-2xl text-white/90 font-bold mb-10 drop-shadow-md">
            เกมการเรียนรู้สำหรับเด็กปฐมวัย
          </p>
          <button 
            onClick={handleStart}
            className="bg-green-400 hover:bg-green-500 text-white font-black text-4xl px-12 py-6 rounded-full shadow-[0_8px_0_#166534] hover:shadow-[0_4px_0_#166534] hover:translate-y-1 transition-all flex items-center gap-4 cursor-pointer"
          >
            <PlayCircle size={48} />
            เริ่มเล่นเลย!
          </button>
        </div>
      </div>
    );
  }

  if (currentLevel === 0) {
    return (
      <div className="w-full min-h-screen bg-sky-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-5xl bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-sky-300 min-h-[600px] flex flex-col">
          <div className="text-center mb-8 mt-4">
            <h2 className="text-5xl md:text-6xl font-black text-sky-500 mb-3">เลือกตัวละคร</h2>
            <p className="text-2xl text-slate-500 font-bold">เลือกเพื่อนร่วมผจญภัยไปกับเรา!</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1 px-4 items-center">
            {CHARACTERS_DATA.map(char => (
               <motion.button
                 key={char.id}
                 whileHover={{ scale: 1.08, y: -8 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => handleSelectCharacter(char)}
                 className="bg-sky-50 border-4 border-sky-200 hover:border-sky-400 hover:bg-sky-100/70 rounded-3xl p-6 flex flex-col items-center justify-between h-[300px] shadow-md hover:shadow-2xl transition-all cursor-pointer"
               >
                 <div className="flex-1 flex items-center justify-center">
                   <CharacterSprite id={char.id} size={140} mood="happy" />
                 </div>
                 <div className="text-3xl font-black text-slate-700 bg-white/80 px-6 py-2 rounded-full shadow-sm mt-2">
                   {char.name}
                 </div>
               </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentLevel === 5) {
     return (
        <div className="w-full min-h-screen bg-sky-100 flex items-center justify-center p-4 font-sans">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl bg-gradient-to-b from-yellow-300 to-amber-500 rounded-[3rem] p-12 shadow-2xl border-8 border-white text-center flex flex-col items-center justify-center min-h-[600px]"
          >
             <div className="mb-6">
               {selectedCharacter && (
                 <CharacterSprite id={selectedCharacter.id} size={200} mood="cheer" />
               )}
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-4">
                เก่งมาก {selectedCharacter?.name}!
             </h1>
             <p className="text-2xl md:text-3xl text-amber-950 font-bold mb-10">
                ผจญภัยเรียนรู้เรื่องพลังงานน้ำครบทุกด่านแล้ว! 🌟🎉
             </p>
             <button 
                onClick={restartGame}
                className="bg-white text-amber-600 hover:bg-sky-50 hover:text-sky-600 font-black text-3xl md:text-4xl px-12 py-6 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.1)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center gap-4 cursor-pointer"
              >
                <Home size={40} />
                กลับหน้าแรก
              </button>
          </motion.div>
        </div>
     );
  }

  // Pass selectedCharacter and nextLevel to levels
  const commonProps = { playSound, isSoundOn, toggleSound, onNextLevel: nextLevel, character: selectedCharacter, quitGame: restartGame };

  const renderLevel = () => {
    switch(currentLevel) {
      case 1: return <Level1Garden {...commonProps} />;
      case 2: return <Level2Dam {...commonProps} />;
      case 3: return <Level3Boat {...commonProps} />;
      case 4: return <Level4Quiz {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-sky-50 flex items-center justify-center p-4 font-sans">
      <AnimatePresence mode="wait">
         <motion.div 
           key={currentLevel}
           initial={{ opacity: 0, x: 100 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -100 }}
           className="w-full h-full flex items-center justify-center"
         >
           {renderLevel()}
         </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
