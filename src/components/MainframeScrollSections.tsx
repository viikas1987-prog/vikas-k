import React, { useState } from 'react';

interface MainframeScrollSectionsProps {
  onOpenContact: () => void;
  activePillModal: string | null;
  onClosePillModal: () => void;
}

export const MainframeScrollSections: React.FC<MainframeScrollSectionsProps> = ({
  onOpenContact,
  activePillModal,
  onClosePillModal,
}) => {
  const [ariaQuery, setAriaQuery] = useState('');
  const [ariaLog, setAriaLog] = useState<{ role: string; text: string }[]>([
    {
      role: 'A.R.I.A',
      text: 'Mainframe Adaptive Response initialized. Awaiting creative coordinates.',
    },
  ]);

  const handleAriaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ariaQuery.trim()) return;
    const q = ariaQuery.trim();
    setAriaLog((prev) => [
      ...prev,
      { role: 'You', text: q },
      {
        role: 'A.R.I.A',
        text: `Synthesizing telemetry for "${q}"... Transmitting to Mainframe Studio Directors.`,
      },
    ]);
    setAriaQuery('');
  };

  const caseStudies = [
    {
      title: 'Neural Kinetic Identity',
      client: 'Vortx Systems',
      year: '2026',
      tag: 'Generative Realtime UI',
      desc: 'Autonomous reactive design system powered by machine vision and sound synthesis.',
    },
    {
      title: 'Heirloom Tactile E-Commerce',
      client: 'Cozy Cuddle Atelier',
      year: '2026',
      tag: '3D Spatial Commerce',
      desc: 'Next-generation 3D organic garment customizer with Web Audio tactile feedback.',
    },
    {
      title: 'Hyper-Dimensional Interface',
      client: 'Kroma Labs',
      year: '2025',
      tag: 'WebGL & Shader Engine',
      desc: 'Frictionless mouse-scrubbed dimensional storytelling with zero latency.',
    },
  ];

  const openings = [
    { role: 'Creative Technologist', dept: 'Mainframe Labs', loc: 'New York / Remote' },
    { role: 'Principal Interaction Designer', dept: 'Studio', loc: 'London / Remote' },
    { role: 'Real-Time Shader Engineer', dept: 'R&D', loc: 'Tokyo / Remote' },
  ];

  return (
    <div className="relative z-10 bg-white/95 text-black backdrop-blur-md transition-colors border-t border-black/10">
      
      {/* 1. Labs Section */}
      <section id="labs" className="max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-black/50 font-mono block mb-2">
              01 / Mainframe Labs
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Exploration beyond<br />the interface boundary.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-black/70 max-w-sm">
            We build proprietary real-time interaction paradigms, adaptive intelligence agents, and computational aesthetics.
          </p>
        </div>

        {/* Interactive A.R.I.A Console */}
        <div className="bg-black text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10">
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-white/80 uppercase tracking-wider">
                A.R.I.A Terminal Active
              </span>
            </div>
            <span className="text-xs text-white/40 font-mono">v2.6.4</span>
          </div>

          <div className="space-y-3 mb-6 font-mono text-xs sm:text-sm max-h-48 overflow-y-auto">
            {ariaLog.map((msg, i) => (
              <div key={i} className="flex gap-2">
                <span className={msg.role === 'A.R.I.A' ? 'text-emerald-400 font-bold' : 'text-[#F9B7B2]'}>
                  [{msg.role}]:
                </span>
                <span className="text-white/90">{msg.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAriaSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={ariaQuery}
              onChange={(e) => setAriaQuery(e.target.value)}
              placeholder="Ask A.R.I.A anything about Mainframe's capabilities..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition font-mono"
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full hover:bg-white/80 transition cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </section>

      {/* 2. Studio Showcase Section */}
      <section id="studio" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-t border-black/10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-black/50 font-mono block mb-2">
              02 / Studio Works
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Select Engagements
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-black/5 hover:bg-black hover:text-white transition-all duration-300 flex flex-col justify-between group cursor-pointer border border-black/5"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-black/50 group-hover:text-white/50 mb-6 font-mono">
                  <span>{item.client}</span>
                  <span>{item.year}</span>
                </div>
                <h3
                  className="text-2xl font-bold tracking-tight mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-black/10 group-hover:bg-white/20 mb-4">
                  {item.tag}
                </span>
                <p className="text-sm text-black/70 group-hover:text-white/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/10 group-hover:border-white/20 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span>View Case Study</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Openings Section */}
      <section id="openings" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-t border-black/10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-black/50 font-mono block mb-2">
              03 / Careers
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Open Positions
            </h2>
          </div>
          <button
            onClick={onOpenContact}
            className="text-sm font-semibold underline underline-offset-2 hover:opacity-60 cursor-pointer"
          >
            General Inquiry →
          </button>
        </div>

        <div className="divide-y divide-black/10">
          {openings.map((op, i) => (
            <div
              key={i}
              onClick={onOpenContact}
              className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:px-4 hover:bg-black/5 transition-all cursor-pointer rounded-2xl group"
            >
              <div>
                <h4 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-black">
                  {op.role}
                </h4>
                <span className="text-xs text-black/50 font-mono">{op.dept}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-xs font-semibold text-black/70">{op.loc}</span>
                <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-t border-black/10 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-black/60 font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-black text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
            Mainframe®
          </span>
          <span>© 2026 Mainframe Studios Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="cursor-pointer hover:text-black transition">Privacy Policy</span>
          <span className="cursor-pointer hover:text-black transition">Terms of Service</span>
          <button onClick={onOpenContact} className="cursor-pointer hover:text-black transition underline">
            hello@mainframe.co
          </button>
        </div>
      </footer>

      {/* Pill Click / Contact Dialog Modal */}
      {activePillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-black/10 relative animate-fade-in">
            <button
              onClick={onClosePillModal}
              className="absolute top-6 right-6 text-black/50 hover:text-black font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <span className="text-xs font-mono uppercase tracking-widest text-black/50 block mb-1">
              Mainframe Dispatch
            </span>
            <h3
              className="text-2xl font-bold mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {activePillModal}
            </h3>

            <p className="text-sm text-black/70 mb-6 leading-relaxed">
              You clicked on <strong className="text-black">"{activePillModal}"</strong>. Send us a message or direct proposal to initiate synchronization with our directors.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 block mb-1">
                  Your Name / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Satoshi / Stellar Labs"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/20 focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/20 focus:outline-none focus:border-black text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/70 block mb-1">
                  Brief Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="What are we building together?"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/20 focus:outline-none focus:border-black text-sm"
                />
              </div>

              <button
                onClick={() => {
                  alert('Message transmitted to Mainframe Directors. Thank you!');
                  onClosePillModal();
                }}
                className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-black/80 transition cursor-pointer text-sm"
              >
                Transmit to Mainframe
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
