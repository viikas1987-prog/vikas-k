import React, { useState } from 'react';

interface MainframeNavbarProps {
  onNavigate: (section: string) => void;
  onOpenContact: () => void;
}

export const MainframeNavbar: React.FC<MainframeNavbarProps> = ({ onNavigate, onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = ['Labs', 'Studio', 'Openings', 'Shop'];

  const handleLinkClick = (link: string) => {
    setMobileMenuOpen(false);
    onNavigate(link.toLowerCase());
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center bg-transparent">
        {/* Logo */}
        <div
          onClick={() => handleLinkClick('top')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium leading-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none leading-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop Center Links */}
        <div className="hidden md:flex items-center text-[23px] text-black">
          {links.map((link, idx) => (
            <React.Fragment key={link}>
              <button
                onClick={() => handleLinkClick(link)}
                className="hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0 text-[23px] text-black"
              >
                {link}
              </button>
              {idx < links.length - 1 && <span>,&nbsp;</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Desktop Right CTA */}
        <div className="hidden md:block">
          <button
            onClick={onOpenContact}
            className="text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity cursor-pointer bg-transparent border-none p-0"
          >
            Get in touch
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 cursor-pointer z-20 bg-transparent border-none p-0"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 transform ${
              mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 transform ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-[9] md:hidden flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((link) => (
          <button
            key={link}
            onClick={() => handleLinkClick(link)}
            className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity text-left bg-transparent border-none p-0 cursor-pointer"
          >
            {link}
          </button>
        ))}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            onOpenContact();
          }}
          className="text-[32px] font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity text-left bg-transparent border-none p-0 cursor-pointer"
        >
          Get in touch
        </button>
      </div>
    </>
  );
};
