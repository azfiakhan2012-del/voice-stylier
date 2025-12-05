import React, { useState } from 'react';
import VoiceSelector from './components/VoiceSelector';
import AudioPlayer from './components/AudioPlayer';
import { GeneratedAudio, VoiceStyle } from './types';
import { VOICE_STYLES } from './constants';
import { generateCharacterSpeech } from './services/geminiService';
import { Mic, Wand2, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<VoiceStyle>(VOICE_STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedAudio[]>([]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateCharacterSpeech(inputText, selectedStyle);
      setHistory((prev) => [result, ...prev]);
      setInputText(''); // Optional: clear input on success? Maybe keep it for tweaks. Let's keep it.
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate audio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Mic className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">AI Voice Styler</h1>
              <p className="text-slate-400">Bring your text to life with character</p>
            </div>
          </div>
        </header>

        {/* Main Interface */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Input Area */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                Enter your script
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type something amazing here..."
                className="w-full h-40 bg-slate-800 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-lg leading-relaxed"
                disabled={isGenerating}
              />
              <div className="mt-2 text-right text-xs text-slate-500">
                {inputText.length} characters
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-semibold text-white">Select a Style</h2>
              </div>
              <VoiceSelector 
                selectedId={selectedStyle.id}
                onSelect={setSelectedStyle}
                disabled={isGenerating}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!inputText.trim() || isGenerating}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99]
                ${!inputText.trim() || isGenerating 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white shadow-xl shadow-indigo-500/25'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Generate Voice
                </>
              )}
            </button>
          </div>

          {/* Right Column: Library */}
          <div className="lg:col-span-5">
             <div className="sticky top-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl h-[calc(100vh-8rem)] flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span>Generated Audio</span>
                  <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">{history.length}</span>
                </h2>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 border-2 border-dashed border-slate-700 rounded-xl p-8">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                        <Mic className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-center text-sm">No audio generated yet.<br/>Type something and pick a style!</p>
                    </div>
                  ) : (
                    history.map((audio) => (
                      <AudioPlayer key={audio.id} audio={audio} />
                    ))
                  )}
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
