import React from 'react';
import { Signal } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants';
import { ExternalLink, Zap } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const color = CATEGORY_COLORS[signal.category] || '#9ca3af';

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 hover:border-bronze-600 transition-all duration-300 group shadow-lg flex flex-col h-full relative overflow-hidden">
        {/* Accent Bar */}
        <div 
            className="absolute top-0 left-0 w-1 h-full opacity-60 transition-opacity group-hover:opacity-100" 
            style={{ backgroundColor: color }}
        />
        
        <div className="flex justify-between items-start mb-3 pl-3">
            <span 
                className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded bg-stone-950 border border-stone-800"
                style={{ color: color }}
            >
                {CATEGORY_LABELS[signal.category]}
            </span>
            <div className="flex items-center text-stone-500 text-xs">
                 <Zap size={12} className="mr-1 text-bronze-500" />
                 {signal.score.toFixed(2)}
            </div>
        </div>

        <h3 className="text-lg font-serif font-semibold text-stone-100 mb-2 leading-tight pl-3 group-hover:text-bronze-400 transition-colors">
            {signal.title}
        </h3>

        <p className="text-stone-400 text-sm mb-4 flex-grow pl-3 line-clamp-3 leading-relaxed">
            {signal.summary}
        </p>

        <div className="flex justify-between items-center text-xs text-stone-600 pl-3 mt-auto border-t border-stone-800 pt-3">
            <span>{signal.source}</span>
            <span className="flex items-center gap-1 group-hover:text-stone-300">
                {new Date(signal.published).toLocaleDateString()}
                <ExternalLink size={10} />
            </span>
        </div>
    </div>
  );
};

export default SignalCard;