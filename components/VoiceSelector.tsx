import React from 'react';
import { VoiceStyle } from '../types';
import { VOICE_STYLES } from '../constants';
import * as Icons from 'lucide-react';

interface VoiceSelectorProps {
  selectedId: string;
  onSelect: (style: VoiceStyle) => void;
  disabled: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedId, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {VOICE_STYLES.map((style) => {
        // Dynamic Icon Component
        const IconComponent = (Icons as any)[style.icon] || Icons.Mic;
        const isSelected = selectedId === style.id;

        return (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            disabled={disabled}
            className={`
              relative group overflow-hidden rounded-xl p-6 transition-all duration-300 border text-left
              ${isSelected 
                ? `border-transparent ring-2 ring-white/50 bg-slate-800` 
                : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Background Gradient on Select */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-20' : 'group-hover:opacity-10'}`} 
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className={`p-3 rounded-lg inline-block mb-3 bg-gradient-to-br ${style.color}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{style.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{style.description}</p>
              </div>
              
              {isSelected && (
                <div className="absolute top-0 right-0 p-2">
                   <Icons.CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default VoiceSelector;
