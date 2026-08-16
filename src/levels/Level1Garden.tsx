import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Home, Volume2, VolumeX, RotateCcw, Droplets } from 'lucide-react';

export default function Level1Garden({ quitGame, onNextLevel, character, playSound, isSoundOn, toggleSound }: any) {
  const [gateY, setGateY] = useState(0);
  const [isWaterFlowing, setIsWaterFlowing] = useState(false);
  const [plantGrowth, setPlantGrowth] = useState(0); // 0 to 100
  const [isWin, setIsWin] = useState(false);

  const waterAnim = useAnimation();
  const wheelAnim = useAnimation();

  useEffect(() => {
    if (gateY < -40) {
      if (!isWaterFlowing) {
        setIsWaterFlowing(true);
        playSound('splash');
        
        waterAnim.start({
          scaleY: 1,
          opacity: 0.8,
          transition: { duration: 0.5 }
        });
        
        wheelAnim.start({
          rotate: 360,
          transition: { duration: 2, repeat: Infinity, ease: "linear" }
        });
      }
    } else {
      if (isWaterFlowing) {
        setIsWaterFlowing(false);
        waterAnim.start({
          scaleY: 0,
          opacity: 0,
          transition: { duration: 0.5 }
        });
        wheelAnim.stop();
      }
    }
  }, [gateY, isWaterFlowing, playSound, waterAnim, wheelAnim]);

  useEffect(() => {
    let interval: any;
    if (isWaterFlowing && !isWin) {
      interval = setInterval(() => {
        setPlantGrowth(prev => {
          const next = prev + 5;
          if (next >= 100) {
            setIsWin(true);
            playSound('win');
            return 100;
          }
          return next;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isWaterFlowing, isWin, playSound]);

  const resetLevel = () => {
    setGateY(0);
    setIsWaterFlowing(false);
    setPlantGrowth(0);
    setIsWin(false);
    waterAnim.set({ scaleY: 0, opacity: 0 });
    wheelAnim.stop();
    playSound('click');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-green-50 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white flex flex-col font-sans select-none min-h-[650px] relative">
      
      {/* Header */}
      <div className="bg-green-500 p-4 sm:p-6 flex justify-between items-center text-white shadow-md z-20">
        <div className="flex items-center gap-4">
          <button onClick={quitGame} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
             <Home size={28} />
          </button>
          <div className="flex items-center gap-2">
             <span className="text-3xl">{character?.emoji}</span>
             <h2 className="text-2xl font-black hidden sm:block">ด่านที่ 1: กังหันวิดน้ำรดผัก</h2>
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

      <div className="flex-1 relative bg-gradient-to-b from-sky-200 to-green-300 p-4 overflow-hidden flex items-end">
        
        {/* Instruction */}
        {!isWin && plantGrowth === 0 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/80 px-6 py-3 rounded-full text-xl font-bold text-green-700 shadow-md animate-bounce z-30">
            ลากประตูน้ำขึ้น เพื่อปล่อยน้ำไปหมุนกังหัน! 👆
          </div>
        )}

        {/* Scene */}
        
        {/* Water Source (Upper River) */}
        <div className="absolute top-20 left-0 w-32 h-64 bg-blue-400 border-r-8 border-b-8 border-blue-600 rounded-br-3xl flex justify-center z-10">
          {/* Sluice Gate Mechanism */}
          <div className="w-16 h-full bg-slate-700 absolute right-[-8px] flex justify-center">
            <motion.div
              drag="y"
              dragConstraints={{ top: -100, bottom: 0 }}
              dragElastic={0.1}
              onDrag={(_, info) => setGateY(info.point.y - info.offset.y < -40 ? info.offset.y : Math.max(info.offset.y, -100))}
              onDragEnd={(_, info) => {
                if (info.offset.y < -40) setGateY(-80);
                else setGateY(0);
              }}
              animate={{ y: gateY }}
              className="w-20 h-32 bg-stone-400 border-4 border-stone-600 absolute bottom-0 rounded-t-md cursor-grab active:cursor-grabbing flex items-center justify-center flex-col gap-2 shadow-lg"
            >
               <div className="w-8 h-2 bg-stone-600 rounded-full"></div>
               <div className="w-8 h-2 bg-stone-600 rounded-full"></div>
               <div className="w-8 h-2 bg-stone-600 rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Falling Water */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={waterAnim}
          style={{ transformOrigin: 'top' }}
          className="absolute top-[336px] left-[100px] w-12 h-[150px] bg-blue-300 rounded-b-full z-0 flex justify-center overflow-hidden"
        >
           <motion.div 
             animate={{ y: [0, 100] }} 
             transition={{ repeat: Infinity, duration: 0.3, ease: 'linear' }}
             className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] opacity-50"
           />
        </motion.div>

        {/* Water Wheel */}
        <div className="absolute bottom-20 left-[80px] z-10 flex flex-col items-center">
          <motion.div 
            animate={wheelAnim}
            className="w-40 h-40 relative flex items-center justify-center"
          >
            {/* Blades */}
            {[0, 45, 90, 135].map(deg => (
              <div key={deg} className={`absolute w-40 h-6 bg-amber-600 rounded-full border-2 border-amber-800 rotate-[${deg}deg]`} style={{ transform: `rotate(${deg}deg)` }}>
                {/* Buckets */}
                <div className="absolute -top-2 -left-2 w-6 h-8 bg-amber-700 rounded-sm"></div>
                <div className="absolute -top-2 -right-2 w-6 h-8 bg-amber-700 rounded-sm"></div>
              </div>
            ))}
            <div className="absolute w-12 h-12 bg-slate-700 rounded-full z-10 border-4 border-slate-400"></div>
          </motion.div>
          {/* Base */}
          <div className="w-20 h-24 bg-stone-600 mt-[-20px] rounded-t-2xl border-4 border-stone-800 -z-10"></div>
        </div>

        {/* Water Pipe to Garden */}
        <div className="absolute bottom-10 left-[180px] right-20 h-8 bg-slate-300 border-y-4 border-slate-500 z-0">
          {isWaterFlowing && (
             <motion.div 
               className="h-full bg-blue-400 opacity-80"
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ duration: 1 }}
             />
          )}
        </div>

        {/* Garden & Rabbit */}
        <div className="absolute bottom-20 right-[50px] flex items-end gap-4 z-10">
          
          <div className="flex gap-4">
             {[1, 2, 3].map(i => (
                <div key={i} className="relative w-16 h-24 flex items-end justify-center">
                   {/* Dirt */}
                   <div className="absolute bottom-0 w-20 h-6 bg-amber-800 rounded-full -ml-2 blur-[1px]"></div>
                   
                   {/* Carrot / Plant */}
                   <motion.div
                     initial={{ y: 20, scale: 0.2 }}
                     animate={{ 
                       y: 20 - (plantGrowth / 100) * 40,
                       scale: 0.2 + (plantGrowth / 100) * 0.8 
                     }}
                     className="text-6xl origin-bottom"
                   >
                     🥕
                   </motion.div>
                   
                   {/* Water Drops when flowing */}
                   {isWaterFlowing && (
                     <motion.div 
                       initial={{ y: -40, opacity: 0 }}
                       animate={{ y: 0, opacity: [0, 1, 0] }}
                       transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                       className="absolute text-blue-500"
                     >
                       <Droplets size={24} />
                     </motion.div>
                   )}
                </div>
             ))}
          </div>

          <motion.div 
            animate={{ 
              y: isWin ? [0, -20, 0] : 0,
            }}
            transition={{ repeat: isWin ? Infinity : 0, duration: 0.5 }}
            className="text-8xl drop-shadow-lg z-20 origin-bottom"
          >
            {isWin ? '🐰💖' : '🐰'}
          </motion.div>
        </div>

        {/* River at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-500 border-t-8 border-blue-600">
           {isWaterFlowing && (
             <motion.div 
                className="w-full h-4 bg-blue-300 opacity-50 absolute top-2 rounded-full"
                animate={{ x: [-50, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
             />
           )}
        </div>

      </div>

      {isWin && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/40 z-40 flex items-center justify-center backdrop-blur-sm"
        >
          <div className="bg-white p-8 rounded-3xl text-center border-8 border-green-400 shadow-2xl max-w-md">
             <div className="text-7xl mb-4">🌟🥕</div>
             <h2 className="text-4xl font-black text-green-500 mb-4">สำเร็จแล้ว!</h2>
             <p className="text-2xl text-slate-700 font-bold mb-8">
               พลังงานน้ำช่วยหมุนกังหัน รดน้ำแครอทให้คุณกระต่ายได้สำเร็จ!
             </p>
             <button onClick={onNextLevel} className="bg-green-500 text-white text-3xl font-black px-10 py-4 rounded-full w-full shadow-[0_6px_0_#166534] active:translate-y-2 active:shadow-none transition-all">
               ด่านต่อไป ➡️
             </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
