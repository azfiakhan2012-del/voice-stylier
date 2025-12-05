import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Download, RefreshCw } from 'lucide-react';
import { GeneratedAudio } from '../types';

interface AudioPlayerProps {
  audio: GeneratedAudio;
  onDelete?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audio }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Toggle Play
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateProgress = () => {
      if(audioElement.duration) {
          setProgress((audioElement.currentTime / audioElement.duration) * 100);
      }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(100);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);

    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
    };
  }, []);

  // Simple Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    const draw = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      // Simulate a waveform based on playing state
      if (isPlaying) {
        for (let i = 0; i < width; i++) {
          const amplitude = Math.random() * 20; // Fake amplitude
          ctx.lineTo(i, centerY + Math.sin(i * 0.1 + Date.now() * 0.1) * amplitude);
        }
      } else {
         // Flat line
         ctx.lineTo(width, centerY);
      }
      
      ctx.strokeStyle = '#818cf8'; // Indigo 400
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg animate-fade-in mb-4">
      <audio ref={audioRef} src={audio.audioUrl} className="hidden" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white font-semibold">{audio.styleName}</h4>
          <p className="text-slate-400 text-xs truncate max-w-xs">{audio.text}</p>
        </div>
        <div className="flex gap-2">
            <a 
                href={audio.audioUrl} 
                download={`voice-styler-${audio.id}.wav`}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                title="Download WAV"
            >
                <Download size={18} />
            </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/30"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>

        <div className="flex-1 relative h-12 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50">
             {/* Progress Bar Background */}
             <div 
                className="absolute top-0 left-0 bottom-0 bg-indigo-500/10 transition-all duration-100 ease-linear pointer-events-none"
                style={{ width: `${progress}%` }}
             />
             <canvas 
                ref={canvasRef} 
                width={300} 
                height={48} 
                className="w-full h-full"
             />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
