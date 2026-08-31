import React, { useState } from 'react';
import { Terminal, Sparkles, Send, Cpu, ShieldCheck } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

export const AriaTerminal: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'aria' | 'user'; text: string }[]>([
    {
      role: 'aria',
      text: 'A.R.I.A v2.6.4 online. I am Mainframe’s Adaptive Response Interface Agent. How can I assist your exploration of VortxLab Creations & Vikas Kumar Atelier?',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    cozyAudio.playSoftTap();
    const userText = query.trim();
    setQuery('');

    const newMsgs = [...messages, { role: 'user' as const, text: userText }];
    setMessages(newMsgs);

    setTimeout(() => {
      cozyAudio.playSparkle();
      let reply = 'Telemetry received. Mainframe neural synthesis is synchronizing your request with our creative directors.';
      const lower = userText.toLowerCase();
      if (lower.includes('bambi') || lower.includes('bear') || lower.includes('toy')) {
        reply = 'Bambi Cuddle Bear is hand-knitted from 70% organic combed cotton and 30% baby alpaca wool, stuffed with antibacterial bamboo cloud polyfill with safe hand-stitched eyes.';
      } else if (lower.includes('romper') || lower.includes('clothes') || lower.includes('fabric')) {
        reply = 'Our 100% GOTS certified organic ribbed rompers feature natural unlacquered coconut shell buttons for 10-second diaper changes, tagless interior necklines, and pre-washed botanical rinses.';
      } else if (lower.includes('embroidery') || lower.includes('custom') || lower.includes('name')) {
        reply = 'You can personalize any garment in our 3D Name Embroidery Studio below with custom cursive typography, silk thread colors, and motif charms.';
      } else if (lower.includes('vikas') || lower.includes('founder') || lower.includes('who')) {
        reply = 'Cozy Cuddle is founded and crafted by Vikas Kumar, dedicated to pure organic materials, non-toxic botanical dyes, and heirloom newborn comfort.';
      }

      setMessages((prev) => [...prev, { role: 'aria', text: reply }]);
    }, 600);
  };

  return (
    <section id="aria" className="w-full py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="p-6 md:p-8 rounded-3xl bg-black/90 text-white border border-white/15 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
            <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-white/90">
              A.R.I.A · Adaptive Response Intelligence Agent
            </span>
          </div>
          <span className="text-xs text-white/40 font-mono hidden sm:inline">
            Neural Synapse v2.6.4
          </span>
        </div>

        {/* Chat History */}
        <div className="space-y-4 mb-6 font-mono text-xs md:text-sm max-h-56 overflow-y-auto pr-2">
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-2.5 leading-relaxed">
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase flex-shrink-0 ${
                  m.role === 'aria'
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-white/20 text-white border border-white/30'
                }`}
              >
                {m.role === 'aria' ? 'A.R.I.A' : 'Visitor'}
              </span>
              <span className="text-white/90">{m.text}</span>
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask A.R.I.A about 3D models, Bambi bear, organic rompers, embroidery, or Vikas Kumar..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-white transition font-mono placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-white text-black font-bold text-xs md:text-sm btn-cut hover:bg-white/90 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
};
