export interface VoiceStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  geminiVoiceName: string; // 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'
  promptPrefix: string;
  color: string;
}

export interface GeneratedAudio {
  id: string;
  text: string;
  styleName: string;
  timestamp: number;
  audioUrl: string; // Blob URL for WAV
  duration: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}
