import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Signal } from '../types';
import { queryOracle } from '../services/geminiService';

interface OracleChatProps {
  signals: Signal[];
}

interface Message {
    role: 'user' | 'ai';
    content: string;
}

const OracleChat: React.FC<OracleChatProps> = ({ signals }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
      { role: 'ai', content: 'I am the Oracle of Form. I have analyzed the current signal field. Ask me about emerging materials, specific artists, or fabrication techniques.' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
        const response = await queryOracle(userMsg, signals);
        setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (e) {
        setMessages(prev => [...prev, { role: 'ai', content: "Connection severed." }]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-stone-900 rounded-lg border border-stone-800 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center gap-2">
            <Sparkles className="text-bronze-400" size={18} />
            <h3 className="text-stone-100 font-serif font-semibold">Foresight Oracle</h3>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4" ref={scrollRef}>
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-stone-800 text-stone-100 rounded-br-none' 
                        : 'bg-stone-950 border border-stone-800 text-stone-300 rounded-bl-none'
                    }`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {loading && (
                 <div className="flex justify-start">
                    <div className="bg-stone-950 border border-stone-800 p-3 rounded-lg rounded-bl-none">
                        <span className="animate-pulse text-stone-500 text-xs">Divining...</span>
                    </div>
                 </div>
            )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-stone-800 bg-stone-950">
            <div className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about 'bronze prices' or 'AI fabrication'..."
                    className="w-full bg-stone-900 border border-stone-800 text-stone-200 rounded-md py-3 pl-4 pr-12 focus:outline-none focus:border-bronze-500 focus:ring-1 focus:ring-bronze-500 transition-all placeholder:text-stone-600"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="absolute right-2 top-2 p-1.5 text-stone-400 hover:text-bronze-400 disabled:opacity-50 transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default OracleChat;