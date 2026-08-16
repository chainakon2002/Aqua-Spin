import { useState, useEffect } from 'react';
import { PlayCircle, Home, MonitorSmartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Level1Garden from './levels/Level1Garden';
import Level2Dam from './levels/Level2Dam';
import Level3Boat from './levels/Level3Boat';
import Level4Quiz from './levels/Level4Quiz';
import { useAudio } from './hooks/useAudio';
import CharacterSprite, { CHARACTERS_DATA, type CharacterInfo } from './components/CharacterSprite';
import HeroScene from './components/HeroScene';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0); // 0 = Char select, 1-4 = Levels, 5 = End
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const { initAudio, playSound, isSoundOn, toggleSound } = useAudio();
  const [hasStarted, setHasStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch leaderboard on mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/scores');
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  // Fetch leaderboard when game ends
  useEffect(() => {
    if (currentLevel === 5 && selectedCharacter) {
      const saveScore = async () => {
        setIsSubmitting(true);
        try {
          // 1. Save score
          await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              playerName,
              characterId: selectedCharacter.id,
              totalScore
            })
          });

          // 2. Fetch updated leaderboard
          const res = await fetch('/api/scores');
          if (res.ok) {
            const data = await res.json();
            setLeaderboard(data);
          }
        } catch (error) {
          console.error("Failed to save score:", error);
        } finally {
          setIsSubmitting(false);
          playSound('win');
        }
      };
      saveScore();
    }
  }, [currentLevel]);

  const handleStart = () => {
    initAudio();
    setHasStarted(true);
    playSound('click');
  };

  const handleSelectCharacter = (char: CharacterInfo) => {
    playSound('click');
    setSelectedCharacter(char);
  };

  const handleStartGame = () => {
    if (!selectedCharacter || !playerName.trim()) {
      playSound('wrong');
      return;
    }
    playSound('click');
    setTotalScore(0);
    setLevelStartTime(Date.now());
    setCurrentLevel(1); // Start at level 1
  };

  const handleLevelComplete = (baseScore: number = 1000) => {
    const timeTakenSeconds = Math.floor((Date.now() - levelStartTime) / 1000);
    // Score calculation: baseScore - (time * 10), minimum 100 points
    const timePenalty = timeTakenSeconds * 10;
    const finalScore = Math.max(100, baseScore - timePenalty);
    setTotalScore(prev => prev + finalScore);
  };

  const nextLevel = (baseScore?: number | any) => {
    playSound('click');
    const score = typeof baseScore === 'number' ? baseScore : 1000;
    handleLevelComplete(score);
    setLevelStartTime(Date.now());
    setCurrentLevel(prev => prev + 1);
  };

  const goHome = () => {
    playSound('click');
    setHasStarted(false);
    setCurrentLevel(0);
    setSelectedCharacter(null);
    setPlayerName('');
    setTotalScore(0);
  };

  const [isPhoneDevice, setIsPhoneDevice] = useState(false);

  // Check for mobile phone device
  useEffect(() => {
    const checkPhone = () => {
      const ua = navigator.userAgent || '';
      // Detect mobile phone user agent (excluding iPad and Android tablets)
      const isPhoneUA = /iPhone|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isSmallScreen = window.innerWidth < 768;
      setIsPhoneDevice(isPhoneUA || isSmallScreen);
    };
    checkPhone();
    window.addEventListener('resize', checkPhone);
    return () => window.removeEventListener('resize', checkPhone);
  }, []);

  // Try to start audio automatically
  useEffect(() => {
    const tryInitAudio = () => {
      initAudio();
      window.removeEventListener('click', tryInitAudio);
      window.removeEventListener('touchstart', tryInitAudio);
      window.removeEventListener('keydown', tryInitAudio);
    };

    tryInitAudio();
    
    window.addEventListener('click', tryInitAudio);
    window.addEventListener('touchstart', tryInitAudio);
    window.addEventListener('keydown', tryInitAudio);

    return () => {
      window.removeEventListener('click', tryInitAudio);
      window.removeEventListener('touchstart', tryInitAudio);
      window.removeEventListener('keydown', tryInitAudio);
    };
  }, [initAudio]);

  // Pass selectedCharacter, playerName, and nextLevel to levels
  const commonProps = { playSound, isSoundOn, toggleSound, onNextLevel: nextLevel, character: selectedCharacter, playerName, quitGame: goHome };

  const renderLevel = () => {
    switch (currentLevel) {
      case 1: return <Level1Garden {...commonProps} />;
      case 2: return <Level2Dam {...commonProps} />;
      case 3: return <Level3Boat {...commonProps} />;
      case 4: return <Level4Quiz {...commonProps} />;
      default: return null;
    }
  };

  const renderScreen = () => {
    if (!hasStarted) {
      return (
        <div
          className="w-full h-screen bg-white flex flex-col font-sans overflow-hidden cursor-pointer"
          onClick={() => initAudio()}
        >
          <div className="flex-1 relative w-full h-full min-h-[50vh]">
            <HeroScene />

            {/* Overlay text for audio */}
            <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-30">
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-white/80 font-bold text-lg drop-shadow-md"
              >
                แตะที่ใดก็ได้เพื่อเปิดเพลง 🎵
              </motion.p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 z-20 flex flex-col lg:flex-row gap-6 items-center justify-between border-t-8 border-sky-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
            <div className="text-center lg:text-left flex-1 flex flex-col items-center lg:items-start">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-sky-500 drop-shadow-sm mb-2">
                สนุกกับ <span className="text-amber-500">พลังงานน้ำ</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-500 font-bold mb-6">
                เกมการเรียนรู้สำหรับเด็กปฐมวัย
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="bg-green-400 hover:bg-green-500 text-white font-black text-3xl md:text-4xl px-10 py-5 rounded-full shadow-[0_8px_0_#166534] hover:shadow-[0_4px_0_#166534] hover:translate-y-1 transition-all flex items-center gap-4 cursor-pointer"
              >
                <PlayCircle size={40} />
                เริ่มเล่นเลย!
              </button>
            </div>

            {/* Leaderboard Section for Start Screen */}
            <div className="w-full lg:w-[400px] bg-amber-50 rounded-3xl p-4 sm:p-6 border-4 border-amber-200 shadow-inner max-h-[250px] lg:max-h-[300px] flex flex-col">
              <h3 className="text-xl sm:text-2xl font-black text-amber-600 text-center mb-3">🏆 ทำเนียบคนเก่ง 🏆</h3>
              <div className="flex flex-col gap-2 overflow-y-auto pr-2 flex-1">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-xl shadow-sm border-2 border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-sm sm:text-base ${index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-slate-300 text-slate-700' :
                            index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                        {index + 1}
                      </div>
                      <div className="font-bold text-slate-700 truncate max-w-[100px] sm:max-w-[120px]">{entry.player_name}</div>
                    </div>
                    <div className="font-black text-sky-600">{entry.total_score.toLocaleString()}</div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-center text-slate-400 font-bold py-4">ยังไม่มีข้อมูล</div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentLevel === 0) {
      return (
        <div className="w-full min-h-screen bg-sky-100 flex items-center justify-center p-4 font-sans relative">
          <button
            onClick={goHome}
            className="absolute top-4 left-4 z-50 bg-white/80 hover:bg-white text-sky-600 font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Home size={20} />
            กลับหน้าแรก
          </button>
          <div className="w-full max-w-5xl bg-white rounded-[3rem] p-8 shadow-2xl border-8 border-sky-300 min-h-[600px] flex flex-col">
            <div className="text-center mb-6 mt-4">
              <h2 className="text-5xl md:text-6xl font-black text-sky-500 mb-3">เลือกตัวละครและตั้งชื่อ</h2>
              <p className="text-2xl text-slate-500 font-bold">เลือกเพื่อนร่วมผจญภัย แล้วพิมพ์ชื่อเล่นของหนูได้เลย!</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 px-4 items-center mb-8">
              {CHARACTERS_DATA.map(char => (
                <motion.button
                  key={char.id}
                  whileHover={{ scale: 1.08, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectCharacter(char)}
                  className={`border-4 rounded-3xl p-6 flex flex-col items-center justify-center h-[280px] shadow-md transition-all cursor-pointer ${selectedCharacter?.id === char.id
                      ? 'bg-amber-100 border-amber-400 shadow-xl scale-105'
                      : 'bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                >
                  <div className="flex items-center justify-center">
                    <CharacterSprite id={char.id} size={140} mood={selectedCharacter?.id === char.id ? 'cheer' : 'happy'} />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center mb-4 mt-auto">
              <input
                type="text"
                placeholder={selectedCharacter ? "ตั้งชื่อตัวละครที่เลือกตรงนี้..." : "กรุณาเลือกตัวละครก่อน..."}
                value={playerName}
                disabled={!selectedCharacter}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full max-w-md text-3xl font-bold text-center text-slate-700 bg-sky-50 border-4 border-sky-200 rounded-full px-6 py-4 focus:outline-none focus:border-sky-500 focus:bg-white shadow-inner transition-all placeholder:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                maxLength={15}
              />

              <button
                onClick={handleStartGame}
                disabled={!selectedCharacter || !playerName.trim()}
                className={`font-black text-3xl md:text-4xl px-12 py-5 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.2)] transition-all flex items-center gap-4 ${selectedCharacter && playerName.trim()
                    ? 'bg-green-400 hover:bg-green-500 text-white hover:translate-y-1 hover:shadow-[0_4px_0_rgba(0,0,0,0.2)] cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
              >
                <PlayCircle size={40} />
                เริ่มผจญภัยเลย!
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentLevel === 5) {
      return (
        <div className="w-full min-h-screen bg-sky-100 flex items-center justify-center p-4 font-sans py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl bg-gradient-to-b from-yellow-300 to-amber-500 rounded-[3rem] p-8 sm:p-12 shadow-2xl border-8 border-white flex flex-col items-center justify-center min-h-[600px]"
          >
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 w-full justify-center">
              <div className="flex flex-col items-center">
                {selectedCharacter && (
                  <CharacterSprite id={selectedCharacter.id} size={160} mood="cheer" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-2">
                  เก่งมาก {playerName}!
                </h1>
                <p className="text-xl md:text-2xl text-amber-950 font-bold mb-4">
                  คะแนนของคุณคือ:
                </p>
                <div className="text-6xl md:text-7xl font-black text-white bg-amber-600/50 px-8 py-2 rounded-full inline-block shadow-inner border-4 border-amber-600">
                  {totalScore.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="w-full bg-white/90 rounded-3xl p-6 shadow-lg mb-8 max-h-[300px] overflow-y-auto">
              <h3 className="text-3xl font-black text-amber-600 text-center mb-6">🏆 ทำเนียบคนเก่ง (Top 10) 🏆</h3>
              {isSubmitting ? (
                <div className="text-center text-slate-500 font-bold py-8">กำลังบันทึกคะแนน...</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-4 ${entry.player_name === playerName && entry.total_score === totalScore
                          ? 'bg-amber-100 border-amber-300 shadow-md'
                          : 'bg-slate-50 border-slate-100'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black ${index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-slate-300 text-slate-700' :
                              index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                          {index + 1}
                        </div>
                        <div className="text-2xl font-bold text-slate-700">{entry.player_name}</div>
                      </div>
                      <div className="text-2xl font-black text-sky-600">{entry.total_score.toLocaleString()}</div>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <div className="text-center text-slate-500 py-4">ยังไม่มีข้อมูลผู้เล่น</div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={goHome}
              className="bg-white text-amber-600 hover:bg-sky-50 hover:text-sky-600 font-black text-3xl md:text-4xl px-12 py-6 rounded-full shadow-[0_8px_0_rgba(0,0,0,0.1)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center gap-4 cursor-pointer"
            >
              <Home size={40} />
              กลับหน้าแรก
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen bg-sky-50 flex items-center justify-center p-4 font-sans relative">
        <button
          onClick={goHome}
          className="absolute top-4 left-4 z-50 bg-white/80 hover:bg-white text-sky-600 font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2 transition-all hover:scale-105"
        >
          <Home size={20} />
          กลับหน้าแรก
        </button>
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
  };

  return (
    <>
      {/* Mobile Blocker Overlay */}
      {isPhoneDevice && (
        <div className="fixed inset-0 bg-sky-500 z-[9999] flex flex-col items-center justify-center p-8 text-center text-white">
          <MonitorSmartphone size={80} className="mb-6 opacity-80 animate-pulse" />
          <h1 className="text-3xl font-black mb-4">ขออภัยค่ะ!</h1>
          <p className="text-xl leading-relaxed">
            เกมนี้ออกแบบมาให้เล่นบน <br /><b>คอมพิวเตอร์</b> หรือ <b>แท็บเล็ต (iPad)</b> เท่านั้นค่ะ
          </p>
          <p className="mt-6 text-white/90 bg-white/20 px-6 py-3 rounded-full text-sm font-bold shadow-inner">
            โปรดเปิดผ่านคอมพิวเตอร์หรือ iPad เพื่อเริ่มเล่นนะคะ
          </p>
        </div>
      )}

      {/* Main Game Container */}
      <div className={`w-full min-h-screen ${isPhoneDevice ? 'hidden' : 'block'}`}>
        {renderScreen()}
      </div>
    </>
  );
}

export default App;
