import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Home, Volume2, VolumeX, RotateCcw, AlertTriangle } from 'lucide-react';

export default function Level3Boat({ quitGame, onNextLevel, character, playSound, isSoundOn, toggleSound }: any) {
  const [rocks, setRocks] = useState([
    { id: 1, removed: false, startX: 200, startY: 250 },
    { id: 2, removed: false, startX: 350, startY: 220 },
    { id: 3, removed: false, startX: 500, startY: 280 }
  ]);
  
  const [isWin, setIsWin] = useState(false);
  const boatAnim = useAnimation();

  const handleDragEnd = (id: number, info: any) => {
    // If dragged out of the river bounds (y < 150 or y > 350)
    // River is roughly y: 200 to 400 in our container
    if (info.point.y < 150 || info.point.y > 450) {
      playSound('splash');
      setRocks(prev => prev.map(r => r.id === id ? { ...r, removed: true } : r));
    }
  };

  useEffect(() => {
    const allRemoved = rocks.every(r => r.removed);
    if (allRemoved && !isWin) {
      setIsWin(true);
      playSound('win');
      boatAnim.start({
        x: 650, // Move to right edge
        transition: { duration: 3, ease: 'linear' }
      });
    }
  }, [rocks, isWin, playSound, boatAnim]);

  const resetLevel = () => {
    setRocks([
      { id: 1, removed: false, startX: 200, startY: 250 },
      { id: 2, removed: false, startX: 350, startY: 220 },
      { id: 3, removed: false, startX: 500, startY: 280 }
    ]);
    setIsWin(false);
    boatAnim.set({ x: 0 });
    playSound('click');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-amber-50 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white flex flex-col font-sans select-none min-h-[650px] relative">
      
      {/* Header */}
      <div className="bg-sky-500 p-4 sm:p-6 flex justify-between items-center text-white shadow-md z-20">
        <div className="flex items-center gap-4">
          <button onClick={quitGame} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
             <Home size={28} />
          </button>
          <div className="flex items-center gap-2">
             <span className="text-3xl">{character?.emoji}</span>
             <h2 className="text-2xl font-black hidden sm:block">ด่านที่ 3: เรือใบพลังสายน้ำ</h2>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={toggleSound} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            {isSoundOn ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </button>
          <button onClick={resetLevel} className="p-3 bg-rose-400 hover:bg-rose-500 rounded-full transition-colors">
            <RotateCcw size={28} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-amber-100 p-4 overflow-hidden flex flex-col">
        
        {/* Instruction */}
        {!isWin && !rocks.every(r => r.removed) && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/80 px-6 py-3 rounded-full text-xl font-bold text-sky-700 shadow-md animate-bounce z-30 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" /> ลากก้อนหินออกไปให้พ้นทางน้ำ! 🪨
          </div>
        )}

        {/* Scene: Background banks */}
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-green-400 border-b-8 border-green-600 rounded-b-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-green-400 border-t-8 border-green-600 rounded-t-3xl z-0"></div>

        {/* Scene: River */}
        <div className="absolute top-[180px] bottom-[180px] left-0 right-0 bg-blue-400 z-0 flex items-center justify-center overflow-hidden">
          {/* Water current animation - flows faster if no rocks */}
          <motion.div 
             className="w-[200%] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] absolute"
             animate={{ x: [-200, 0] }}
             transition={{ 
               repeat: Infinity, 
               duration: rocks.every(r => r.removed) ? 2 : 8, 
               ease: 'linear' 
             }}
          />
        </div>

        {/* Scene: Destination (Right Bank) */}
        <div className="absolute right-10 top-[250px] z-10 flex flex-col items-center">
           <div className="text-6xl animate-pulse">🦆✨</div>
           <div className="text-green-800 font-black bg-green-200/80 px-4 py-1 rounded-full mt-2 shadow-sm">จุดหมาย</div>
        </div>

        {/* Scene: Duck Boat (Left) */}
        <motion.div 
          animate={boatAnim}
          className="absolute left-[20px] top-[260px] z-10 text-8xl drop-shadow-xl"
          style={{ originX: 0.5, originY: 1 }}
          whileInView={!isWin ? { rotate: [-2, 2, -2] } : {}}
          transition={!isWin ? { repeat: Infinity, duration: 2 } : {}}
        >
          ⛵
        </motion.div>

        {/* Scene: Draggable Rocks */}
        {rocks.map((rock) => (
          <motion.div
            key={rock.id}
            drag
            dragMomentum={false}
            onDragEnd={(e, info) => handleDragEnd(rock.id, info)}
            initial={{ x: rock.startX, y: rock.startY, scale: 1 }}
            animate={rock.removed ? { scale: 0.5, opacity: 0.5 } : { scale: 1, opacity: 1 }}
            className={`absolute z-20 text-7xl cursor-grab active:cursor-grabbing drop-shadow-md ${rock.removed ? 'pointer-events-none' : ''}`}
            whileHover={!rock.removed ? { scale: 1.1 } : {}}
            whileTap={!rock.removed ? { scale: 0.95 } : {}}
          >
            🪨
          </motion.div>
        ))}

      </div>

      {isWin && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-white/40 z-40 flex items-center justify-center backdrop-blur-sm"
        >
          <div className="bg-sky-100 p-8 rounded-3xl text-center border-8 border-sky-400 shadow-[0_0_50px_#38bdf8] max-w-md">
             <div className="text-7xl mb-4">⛵🦆</div>
             <h2 className="text-4xl font-black text-sky-500 mb-4">เย้! เดินทางสำเร็จ!</h2>
             <p className="text-2xl text-slate-700 font-bold mb-8">
               เมื่อไม่มีสิ่งกีดขวาง น้ำจะไหลได้แรงและผลักเรือไปข้างหน้าได้!
             </p>
             <button onClick={onNextLevel} className="bg-sky-500 text-white text-3xl font-black px-10 py-4 rounded-full w-full shadow-[0_6px_0_#0284c7] active:translate-y-2 active:shadow-none transition-all">
               ด่านต่อไป ➡️
             </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
