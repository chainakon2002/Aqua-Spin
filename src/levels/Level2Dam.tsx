import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Home, Volume2, VolumeX, RotateCcw, Zap } from 'lucide-react';
import CharacterSprite from '../components/CharacterSprite';

export default function Level2Dam({ quitGame, onNextLevel, character, playSound, isSoundOn, toggleSound }: any) {
  const [isPressing, setIsPressing] = useState(false);
  const [powerGenerated, setPowerGenerated] = useState(0);
  const [isWin, setIsWin] = useState(false);
  
  const waterAnim = useAnimation();
  const turbineAnim = useAnimation();

  // Water release logic
  useEffect(() => {
    if (isPressing && !isWin) {
      playSound('splash');
      waterAnim.start({
        scaleY: 1,
        opacity: 0.9,
        transition: { duration: 0.3 }
      });
      turbineAnim.start({
        rotate: 360,
        transition: { duration: 0.5, repeat: Infinity, ease: 'linear' }
      });
      
      const interval = setInterval(() => {
        setPowerGenerated(prev => {
          if (prev >= 100) {
            setIsWin(true);
            playSound('win');
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      waterAnim.start({
        scaleY: 0,
        opacity: 0,
        transition: { duration: 0.5 }
      });
      turbineAnim.stop();
    }
  }, [isPressing, isWin, playSound, turbineAnim, waterAnim]);

  const speakInstruction = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("กดปุ่มค้างไว้เพื่อปล่อยน้ำปั่นไฟ");
    utterance.lang = 'th-TH';
    utterance.pitch = 1.3;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const resetLevel = () => {
    setIsPressing(false);
    setPowerGenerated(0);
    setIsWin(false);
    playSound('click');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-600 flex flex-col font-sans select-none min-h-[650px] relative">
      
      {/* Header */}
      <div className="bg-slate-700 p-4 sm:p-6 flex justify-between items-center text-white shadow-md z-20">
        <div className="flex items-center gap-4">
          <button onClick={quitGame} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
             <Home size={28} />
          </button>
          <div className="flex items-center gap-2">
             <span className="text-3xl">{character?.emoji}</span>
             <h2 className="text-2xl font-black hidden sm:block text-amber-300">ด่านที่ 2: เขื่อนปั่นไฟส่องสว่าง</h2>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={toggleSound} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            {isSoundOn ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </button>
          <button onClick={resetLevel} className="p-3 bg-rose-500 hover:bg-rose-600 rounded-full transition-colors">
            <RotateCcw size={28} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-gradient-to-b from-slate-800 to-indigo-900 p-4 overflow-hidden">
        
        {/* Instruction */}
        {!isWin && powerGenerated === 0 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-amber-200/95 px-6 py-3 rounded-full text-xl font-bold text-amber-800 shadow-[0_0_20px_#fcd34d] animate-bounce z-30 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="fill-amber-500" /> 
              <span>กดปุ่มค้างไว้เพื่อปล่อยน้ำปั่นไฟ!</span>
            </div>
            <button 
              onClick={speakInstruction}
              className="bg-amber-100/50 p-2 rounded-full hover:bg-amber-100 transition-colors shadow-sm active:scale-95 ml-2"
              title="ฟังคำอธิบาย"
            >
              <Volume2 size={24} className="text-amber-700" />
            </button>
          </div>
        )}

        {/* Scene: Dam (Left) */}
        <div className="absolute left-0 top-10 bottom-0 w-[200px] bg-slate-500 border-r-8 border-slate-700 z-10 flex flex-col">
           {/* Water Reservoir */}
           <div className="h-40 bg-blue-500 border-b-8 border-slate-700 relative overflow-hidden">
              <motion.div 
                className="absolute bottom-0 w-[200%] h-4 bg-blue-400 opacity-50 rounded-t-full"
                animate={{ x: [-100, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white/50 font-black text-2xl">เขื่อน</div>
           </div>
           
           {/* Dam Wall */}
           <div className="flex-1 bg-slate-500 relative flex flex-col items-center justify-center gap-3">
              {character && (
                <div className="flex flex-col items-center">
                  <CharacterSprite 
                    id={character.id} 
                    size={100} 
                    mood={isWin ? 'cheer' : isPressing ? 'jump' : 'idle'} 
                  />
                </div>
              )}
              {/* Button */}
              <button 
                onMouseDown={() => setIsPressing(true)}
                onMouseUp={() => setIsPressing(false)}
                onMouseLeave={() => setIsPressing(false)}
                onTouchStart={() => setIsPressing(true)}
                onTouchEnd={() => setIsPressing(false)}
                className={`
                  w-40 h-40 rounded-full border-8 font-black text-4xl shadow-2xl transition-all select-none touch-none cursor-pointer flex flex-col items-center justify-center gap-2
                  ${isPressing ? 'bg-amber-500 border-amber-600 scale-95 shadow-none text-white' : 'bg-rose-500 border-rose-600 text-white pb-3 animate-pulse'}
                `}
                style={!isPressing ? { boxShadow: '0 12px 0 #9f1239' } : {}}
              >
                {/* Empty button, just pulse effect */}
              </button>
           </div>
        </div>

        {/* Scene: Falling Water */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={waterAnim}
          style={{ transformOrigin: 'top' }}
          className="absolute top-[160px] left-[150px] w-24 h-[250px] bg-blue-400 border-x-4 border-blue-500 z-0 flex overflow-hidden"
        >
          {/* Water effect */}
           <motion.div 
             animate={{ y: [0, 200] }} 
             transition={{ repeat: Infinity, duration: 0.2, ease: 'linear' }}
             className="w-full h-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMyIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+')] opacity-60"
           />
        </motion.div>

        {/* Scene: Turbine Generator */}
        <div className="absolute top-[380px] left-[130px] z-20 flex flex-col items-center">
          <div className="w-32 h-32 bg-slate-800 rounded-full border-8 border-slate-600 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <motion.div animate={turbineAnim} className="w-24 h-24 relative flex items-center justify-center">
               <div className="absolute w-24 h-4 bg-sky-400 rounded-full"></div>
               <div className="absolute w-4 h-24 bg-sky-400 rounded-full"></div>
               <div className="absolute w-16 h-16 bg-sky-300 rounded-full rotate-45 border-4 border-sky-400"></div>
               <div className="absolute w-6 h-6 bg-slate-200 rounded-full"></div>
            </motion.div>
          </div>
          <div className="w-20 h-20 bg-amber-500 mt-2 rounded-lg border-4 border-amber-600 flex items-center justify-center shadow-[0_0_15px_#f59e0b]">
             <Zap className="text-white fill-white" size={36} />
          </div>
        </div>

        {/* Power Line */}
        <div className="absolute top-[460px] left-[230px] right-20 h-4 bg-slate-700 z-10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${powerGenerated}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Scene: Village (Right) */}
        <div className="absolute top-20 right-10 bottom-20 w-1/2 flex flex-wrap gap-6 justify-end items-end content-end z-20 p-4">
          {[1, 2, 3, 4, 5].map(i => {
            // House lights up based on power generated (each house needs 20%)
            const isLit = powerGenerated >= i * 20;
            return (
              <div key={i} className="relative w-28 h-32 flex flex-col items-center justify-end drop-shadow-xl">
                 {/* Glow Effect */}
                 {isLit && (
                   <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full"></div>
                 )}
                 {/* Roof */}
                 <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[50px] border-b-rose-700 z-10 relative"></div>
                 {/* Body */}
                 <div className={`w-24 h-20 border-4 border-slate-700 z-0 flex items-center justify-center ${isLit ? 'bg-amber-100' : 'bg-slate-600'}`}>
                    {/* Window */}
                    <div className={`w-12 h-12 border-4 border-slate-700 grid grid-cols-2 grid-rows-2 ${isLit ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24]' : 'bg-slate-800'}`}>
                       <div className="border-r-2 border-b-2 border-slate-700"></div>
                       <div className="border-b-2 border-slate-700"></div>
                       <div className="border-r-2 border-slate-700"></div>
                       <div></div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>

        {/* Stars in sky */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 -z-0 opacity-50">
           {[...Array(10)].map((_, i) => (
             <motion.div 
               key={i} 
               className="w-2 h-2 bg-white rounded-full absolute"
               style={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%` 
               }}
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ duration: 1.5 + Math.random(), repeat: Infinity }}
             />
           ))}
        </div>

      </div>

      {isWin && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center backdrop-blur-sm"
        >
          <div className="bg-slate-800 p-8 rounded-3xl text-center border-8 border-amber-400 shadow-[0_0_50px_#fbbf24] max-w-md">
             <div className="text-7xl mb-4">💡🌟</div>
             <h2 className="text-4xl font-black text-amber-400 mb-4">เก่งมาก!</h2>
             <p className="text-2xl text-slate-200 font-bold mb-8">
               พลังงานน้ำเปลี่ยนเป็นไฟฟ้า ช่วยเปิดไฟให้หมู่บ้านสว่างไสว!
             </p>
             <button onClick={onNextLevel} className="bg-amber-500 text-slate-900 text-3xl font-black px-10 py-4 rounded-full w-full shadow-[0_6px_0_#b45309] active:translate-y-2 active:shadow-none transition-all">
               ด่านต่อไป ➡️
             </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
