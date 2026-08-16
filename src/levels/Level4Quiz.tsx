import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, Star, CheckCircle2, XCircle, Home } from 'lucide-react';
import CharacterSprite from '../components/CharacterSprite';

// Pool of questions using existing images
const ALL_QUIZ_DATA = [
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
    question: "น้ำที่ไหลแรงๆ สามารถนำไปผลิตอะไรได้?",
    options: [
      { id: 'a', imageSrc: '/images/campfire.jpg', text: 'กองไฟ', isCorrect: false },
      { id: 'b', imageSrc: '/images/lightbulb.jpg', text: 'กระแสไฟฟ้า', isCorrect: true },
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
  },
  {
    id: 4,
    question: "พาหนะใดใช้พลังงานลมในการแล่นบนน้ำ?",
    options: [
      { id: 'a', imageSrc: '/images/sailboat.jpg', text: 'เรือใบ', isCorrect: true },
      { id: 'b', imageSrc: '/images/bicycle.jpg', text: 'จักรยาน', isCorrect: false },
      { id: 'c', imageSrc: '/images/car.jpg', text: 'รถยนต์', isCorrect: false },
    ]
  },
  {
    id: 5,
    question: "สิ่งใดที่ต้องใช้ 'ไฟฟ้า' เพื่อให้แสงสว่าง?",
    options: [
      { id: 'a', imageSrc: '/images/lightbulb.jpg', text: 'หลอดไฟ', isCorrect: true },
      { id: 'b', imageSrc: '/images/campfire.jpg', text: 'กองไฟ', isCorrect: false },
      { id: 'c', imageSrc: '/images/cloud.jpg', text: 'ก้อนเมฆ', isCorrect: false },
    ]
  },
  {
    id: 6,
    question: "น้ำฝนที่เราใช้ ตกลงมาจากอะไรเอ่ย?",
    options: [
      { id: 'a', imageSrc: '/images/cloud.jpg', text: 'ก้อนเมฆ', isCorrect: true },
      { id: 'b', imageSrc: '/images/tv.jpg', text: 'ทีวี', isCorrect: false },
      { id: 'c', imageSrc: '/images/water_wheel.jpg', text: 'กังหันน้ำ', isCorrect: false },
    ]
  },
  {
    id: 7,
    question: "ยานพาหนะชนิดใดต้องใช้ 'น้ำ' และ 'ลม' ในการเดินทาง?",
    options: [
      { id: 'a', imageSrc: '/images/sailboat.jpg', text: 'เรือใบ', isCorrect: true },
      { id: 'b', imageSrc: '/images/bicycle.jpg', text: 'จักรยาน', isCorrect: false },
      { id: 'c', imageSrc: '/images/car.jpg', text: 'รถยนต์', isCorrect: false },
    ]
  },
  {
    id: 8,
    question: "พลังงานน้ำสามารถนำไปผลิตเป็นสิ่งใดให้เราใช้ในบ้าน?",
    options: [
      { id: 'a', imageSrc: '/images/lightbulb.jpg', text: 'ไฟฟ้า (หลอดไฟ)', isCorrect: true },
      { id: 'b', imageSrc: '/images/campfire.jpg', text: 'กองไฟ', isCorrect: false },
      { id: 'c', imageSrc: '/images/cloud.jpg', text: 'ก้อนเมฆ', isCorrect: false },
    ]
  },
  {
    id: 9,
    question: "ถ้าเราไม่มี 'น้ำ' สิ่งใดต่อไปนี้จะแล่นไม่ได้เลย?",
    options: [
      { id: 'a', imageSrc: '/images/sailboat.jpg', text: 'เรือใบ', isCorrect: true },
      { id: 'b', imageSrc: '/images/bicycle.jpg', text: 'จักรยาน', isCorrect: false },
      { id: 'c', imageSrc: '/images/car.jpg', text: 'รถยนต์', isCorrect: false },
    ]
  },
  {
    id: 10,
    question: "เครื่องมือใดใช้วิธี 'หมุนตามน้ำ' เพื่อสร้างพลังงาน?",
    options: [
      { id: 'a', imageSrc: '/images/water_wheel.jpg', text: 'กังหันน้ำ', isCorrect: true },
      { id: 'b', imageSrc: '/images/tv.jpg', text: 'โทรทัศน์', isCorrect: false },
      { id: 'c', imageSrc: '/images/bicycle.jpg', text: 'จักรยาน', isCorrect: false },
    ]
  }
];

export default function Level4Quiz({ quitGame, onNextLevel, character, playerName, playSound, isSoundOn, toggleSound }: any) {
  const [activeQuiz, setActiveQuiz] = useState<typeof ALL_QUIZ_DATA>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // Pick 3 random questions when the component mounts
    const shuffled = [...ALL_QUIZ_DATA].sort(() => 0.5 - Math.random());
    setActiveQuiz(shuffled.slice(0, 3));
  }, []);

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (selectedOption) return;
    
    window.speechSynthesis.cancel();
    setSelectedOption(optionId);
    
    if (isCorrect) {
      playSound('correct');
      setScore((prev: number) => prev + 1);
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestion < activeQuiz.length - 1) {
        setCurrentQuestion((prev: number) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const speakQuestion = (q: any) => {
    window.speechSynthesis.cancel();
    const optionsText = q.options.map((opt: any, i: number) => `ตัวเลือกที่ ${i + 1}, ${opt.text}`).join(' ... ');
    const textToRead = `${q.question} ... ${optionsText}`;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'th-TH';
    utterance.pitch = 1.3;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const question = activeQuiz[currentQuestion];

  if (!question) return null;

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
              <div className="flex items-center gap-4 mb-6">
                {character && (
                  <div className="hidden sm:flex flex-col items-center shrink-0">
                    <CharacterSprite 
                      id={character.id} 
                      size={90} 
                      mood={selectedOption ? 'cheer' : 'happy'} 
                    />
                  </div>
                )}
                <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-4 border-sky-200 relative">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-sky-500 text-white font-black text-xl px-6 py-2 rounded-full shadow-md">
                    ข้อที่ {currentQuestion + 1} / {activeQuiz.length}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-700 text-center leading-relaxed">
                      {question.question}
                    </h2>
                    <button 
                      onClick={() => speakQuestion(question)}
                      className="bg-sky-100 p-2 sm:p-3 rounded-full hover:bg-sky-200 transition-colors shadow-sm active:scale-95 shrink-0"
                      title="ฟังคำถามและตัวเลือก"
                    >
                      <Volume2 size={28} className="text-sky-600" />
                    </button>
                  </div>
                </div>
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
                        ${!selectedOption ? 'bg-white border-sky-300 hover:border-sky-500 hover:shadow-2xl cursor-pointer shadow-lg animate-pulse hover:animate-none' : ''}
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
                {[...Array(activeQuiz.length)].map((_, i) => (
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
              
              <h3 className="text-3xl sm:text-5xl font-black text-amber-500 mb-4">
                {score === activeQuiz.length ? `ยอดเยี่ยมมาก ${playerName}!` : `เก่งมากจ้า ${playerName}!`}
              </h3>
              <h2 className="text-4xl font-black text-sky-500 mb-6">ได้คะแนน {score} / {activeQuiz.length}</h2>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={resetGame}
                  className="flex-1 bg-rose-400 hover:bg-rose-500 text-white text-2xl font-black py-4 rounded-full shadow-[0_6px_0_#be123c] hover:translate-y-1 hover:shadow-[0_4px_0_#be123c] transition-all"
                >
                  เล่นด่านนี้ใหม่
                </button>
                <button 
                  onClick={() => onNextLevel(score * 500)}
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
