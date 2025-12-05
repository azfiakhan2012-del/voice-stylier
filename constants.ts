import { VoiceStyle } from './types';

export const VOICE_STYLES: VoiceStyle[] = [
  {
    id: 'narrator',
    name: 'The Narrator',
    description: 'Deep, calm, and authoritative. Perfect for documentaries or serious readings.',
    icon: 'BookOpen',
    geminiVoiceName: 'Charon',
    promptPrefix: 'Narrate this with a deep, soothing, and authoritative voice, like a movie trailer narrator:',
    color: 'from-blue-600 to-indigo-900'
  },
  {
    id: 'storyteller',
    name: 'The Storyteller',
    description: 'Bright, energetic, and engaging. Ideal for children\'s books or happy announcements.',
    icon: 'Sparkles',
    geminiVoiceName: 'Puck',
    promptPrefix: 'Read this with a bright, energetic, and cheerful tone, full of wonder and excitement:',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'villain',
    name: 'The Villain',
    description: 'Dark, gravelly, and ominous. Best for dramatic, menacing lines.',
    icon: 'Skull',
    geminiVoiceName: 'Fenrir',
    promptPrefix: 'Speak this in a dark, gravelly, and ominous tone, like a classic villain:',
    color: 'from-red-700 to-rose-900'
  },
  {
    id: 'hero',
    name: 'The Hero',
    description: 'Bold, inspiring, and confident. For speeches and calls to action.',
    icon: 'Shield',
    geminiVoiceName: 'Kore',
    promptPrefix: 'Declaim this with a bold, inspiring, and heroic tone, full of confidence:',
    color: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'assistant',
    name: 'The Assistant',
    description: 'Crisp, professional, and helpful. Great for technical explanations.',
    icon: 'Headphones',
    geminiVoiceName: 'Zephyr',
    promptPrefix: 'Speak this in a crisp, clear, and professional manner, like a helpful AI assistant:',
    color: 'from-purple-500 to-fuchsia-700'
  }
];
