import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, Star, CheckCircle2, XCircle, Home } from 'lucide-react';

// ข้อมูลคำถามและรูปภาพ (ใช้ Emoji ตัวใหญ่แทนรูปภาพเพื่อให้มีสีสันสดใสดึงดูดเด็ก)
const QUIZ_DATA = [
  {
    id: 1,
    question: "ข้อใดคือการใช้ประโยชน์จาก 'พลังงานน้ำ' ?",
    options: [
      { id: 'a', imageSrc: '/images/water_wheel.jpg', text: 'กังหันน้ำปั่นไฟ', isCorrect: true },
      { id: 'b', imageSrc: '/images/car.jpg', text: 'ขับรถยนต์', isCorrect: false },
      { id: 'c', imageSrc: '/images/tv.jpg', text: 'ดูทีวี', isCorrect: false },
    ]
  },
  {
    id: 2,
    question: "น้ำที่ไหลแรงๆ สามารถทำให้เกิดอะไรได้?",
    options: [
      { id: 'a', imageSrc: '/images/campfire.jpg', text: 'กองไฟ', isCorrect: false },
      { id: 'b', imageSrc: '/images/lightbulb.jpg', text: 'ไฟฟ้าสว่าง', isCorrect: true },
      { id: 'c', imageSrc: '/images/cloud.jpg', text: 'ก้อนเมฆ', isCorrect: false },
    ]
  },
  {
    id: 3,
    question: "รูปไหนคือ 'กังหันน้ำ' ที่ช่วยผลิตไฟฟ้า?",
    options: [
      { id: 'a', imageSrc: '/images/water_wheel.jpg', text: 'กังหันน้ำ', isCorrect: true },
      { id: 'b', imageSrc: '/images/bicycle.jpg', text: 'จักรยาน', isCorrect: false },
      { id: 'c', imageSrc: '/images/sailboat.jpg', text: 'เรือใบ', isCorrect: false },
    ]
  }
];

export default function Level4Quiz({ quitGame, onNextLevel, character, playSound, isSoundOn, toggleSound }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (selectedOption) return; 
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      playSound('correct');
      setScore((prev: number) => prev + 1);
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestion < QUIZ_DATA.length - 1) {
        setCurrentQuestion((prev: number) => prev + 1);
      } else {
        setShowResult(true);
        playSound('win');
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const question = QUIZ_DATA[currentQuestion];

  return (
    <div className="w-full max-w-4xl mx-auto bg-sky-50 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white flex flex-col font-sans select-none min-h-[650px]">
      
      {/* Header */}
      <div className="bg-sky-400 p-4 sm:p-6 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={quitGame}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center"
          >
             <Home size={28} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl hidden sm:inline-block">{character?.emoji}</span>
            <Star className="w-8 h-8 fill-yellow-300 text-yellow-300 ml-2" />
            <span className="text-xl md:text-2xl font-black bg-white/20 px-4 py-1 rounded-full">
              คะแนน: {score}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={toggleSound}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            {isSoundOn ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </button>
          <button 
            onClick={resetGame}
            className="p-3 bg-rose-400 hover:bg-rose-500 rounded-full transition-colors shadow-sm"
          >
            <RotateCcw size={28} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10 flex flex-col relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2UwayOGU2IiAvPjwvc3ZnPg==')]">
        
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key={currentQuestion}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Question Text */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 mb-8 shadow-lg border-4 border-sky-200 relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-sky-500 text-white font-black text-xl px-6 py-2 rounded-full shadow-md">
                  ข้อที่ {currentQuestion + 1} / {QUIZ_DATA.length}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-700 text-center leading-relaxed mt-4">
                  {question.question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                {question.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const showCorrect = selectedOption && opt.isCorrect;
                  const showWrong = isSelected && !opt.isCorrect;

                  return (
                    <motion.button
                      key={opt.id}
                      disabled={selectedOption !== null}
                      whileHover={!selectedOption ? { scale: 1.05 } : {}}
                      whileTap={!selectedOption ? { scale: 0.95 } : {}}
                      onClick={() => handleOptionClick(opt.id, opt.isCorrect)}
                      className={`
                        relative flex flex-col items-center justify-center p-6 rounded-3xl border-8 transition-all duration-300
                        ${!selectedOption ? 'bg-white border-sky-100 hover:border-sky-300 hover:shadow-xl cursor-pointer shadow-md' : ''}
                        ${showCorrect ? 'bg-green-100 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : ''}
                        ${showWrong ? 'bg-rose-100 border-rose-400 opacity-70' : ''}
                        ${selectedOption && !showCorrect && !showWrong ? 'bg-white border-slate-100 opacity-50' : ''}
                      `}
                    >
                      <img 
                        src={opt.imageSrc} 
                        alt={opt.text} 
                        className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-4 rounded-2xl shadow-sm"
                        draggable="false"
                      />
                      <div className="text-2xl font-bold text-slate-700 text-center">
                        {opt.text}
                      </div>

                      {/* Status Icons */}
                      {showCorrect && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }}
                          className="absolute -top-4 -right-4 bg-white rounded-full text-green-500 shadow-lg"
                        >
                          <CheckCircle2 size={48} className="fill-green-100" />
                        </motion.div>
                      )}
                      {showWrong && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }}
                          className="absolute -top-4 -right-4 bg-white rounded-full text-rose-500 shadow-lg"
                        >
                          <XCircle size={48} className="fill-rose-100" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Result Screen */
            <motion.div 
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-200"
            >
              <div className="flex gap-4 mb-6">
                {[...Array(QUIZ_DATA.length)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: i < score ? 1 : 0.5, rotate: 0 }}
                    transition={{ delay: i * 0.2, type: "spring" }}
                  >
                    <Star 
                      size={64} 
                      className={i < score ? "fill-yellow-400 text-yellow-500 drop-shadow-lg" : "fill-slate-200 text-slate-300"} 
                    />
                  </motion.div>
                ))}
              </div>
              
              <h2 className="text-5xl font-black text-sky-500 mb-4">
                {score === QUIZ_DATA.length ? 'ยอดเยี่ยมมาก!' : 'เก่งมากจ้า!'}
              </h2>
              <h2 className="text-4xl font-black text-sky-500 mb-6">ได้คะแนน {score} / {QUIZ_DATA.length}</h2>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={resetGame}
                  className="flex-1 bg-rose-400 hover:bg-rose-500 text-white text-2xl font-black py-4 rounded-full shadow-[0_6px_0_#be123c] hover:translate-y-1 hover:shadow-[0_4px_0_#be123c] transition-all"
                >
                  เล่นด่านนี้ใหม่
                </button>
                <button 
                  onClick={onNextLevel}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-2xl font-black py-4 rounded-full shadow-[0_6px_0_#0284c7] hover:translate-y-1 hover:shadow-[0_4px_0_#0284c7] transition-all"
                >
                  เสร็จสิ้น ➡️
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
