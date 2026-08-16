import { useRef, useCallback, useState, useEffect } from 'react';

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  
  // BGM State
  const bgmRef = useRef<{ isPlaying: boolean; timeout: number; nextNoteTime: number; currentNote: number }>({
    isPlaying: false,
    timeout: 0,
    nextNoteTime: 0,
    currentNote: 0
  });

  const stopBGM = useCallback(() => {
    bgmRef.current.isPlaying = false;
    window.clearTimeout(bgmRef.current.timeout);
  }, []);

  const playBGM = useCallback(() => {
    if (!audioCtxRef.current || !isSoundOn) return;
    const ctx = audioCtxRef.current;
    
    if (bgmRef.current.isPlaying) return;
    if (ctx.state === 'suspended') ctx.resume();
    
    bgmRef.current.isPlaying = true;
    bgmRef.current.currentNote = 0;
    bgmRef.current.nextNoteTime = ctx.currentTime + 0.1;

    // Mary Had a Little Lamb (Frequencies in Hz)
    const melody = [
      329.63, 293.66, 261.63, 293.66, 329.63, 329.63, 329.63, 0,
      293.66, 293.66, 293.66, 0, 329.63, 392.00, 392.00, 0,
      329.63, 293.66, 261.63, 293.66, 329.63, 329.63, 329.63, 329.63,
      293.66, 293.66, 329.63, 293.66, 261.63, 0, 0, 0
    ];

    const scheduleNotes = () => {
      if (!bgmRef.current.isPlaying) return;

      const scheduleAheadTime = 0.2; // seconds

      while (bgmRef.current.nextNoteTime < ctx.currentTime + scheduleAheadTime) {
        const freq = melody[bgmRef.current.currentNote % melody.length];
        const noteLength = 0.35; // Speed of the song
        
        if (freq > 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine'; // Cute music box sound
          osc.frequency.value = freq;
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          // Soft envelope
          gain.gain.setValueAtTime(0, bgmRef.current.nextNoteTime);
          gain.gain.linearRampToValueAtTime(0.04, bgmRef.current.nextNoteTime + 0.05); // Low volume (0.04)
          gain.gain.exponentialRampToValueAtTime(0.001, bgmRef.current.nextNoteTime + noteLength - 0.05);
          
          osc.start(bgmRef.current.nextNoteTime);
          osc.stop(bgmRef.current.nextNoteTime + noteLength);
        }

        bgmRef.current.nextNoteTime += noteLength;
        bgmRef.current.currentNote++;
      }
      
      bgmRef.current.timeout = window.setTimeout(scheduleNotes, 100);
    };

    scheduleNotes();
  }, [isSoundOn]);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        audioCtxRef.current = new Ctx();
      }
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    
    // Start BGM on initialization if sound is on
    if (isSoundOn) {
      playBGM();
    }
  }, [isSoundOn, playBGM]);

  // Handle sound toggle for BGM
  useEffect(() => {
    if (isSoundOn) {
      playBGM();
    } else {
      stopBGM();
    }
  }, [isSoundOn, playBGM, stopBGM]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'win' | 'click' | 'splash' | 'engine') => {
    if (!isSoundOn || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'win') {
      osc.type = 'sine';
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      });
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'splash') {
      // Noise burst for water splash
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      // Filter for splash sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
      
      noise.connect(filter);
      filter.connect(gainNode);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      noise.start();
    } else if (type === 'engine') {
       osc.type = 'sawtooth';
       osc.frequency.setValueAtTime(50, ctx.currentTime);
       
       gainNode.gain.setValueAtTime(0, ctx.currentTime);
       gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
       gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
       
       osc.start();
       osc.stop(ctx.currentTime + 0.5);
    }
  }, [isSoundOn]);

  const toggleSound = useCallback(() => setIsSoundOn(p => !p), []);

  return { initAudio, playSound, isSoundOn, toggleSound };
}
