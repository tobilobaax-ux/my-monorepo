import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { trackEvent, EVENTS } from '../utils/analytics';

import { NavbarConfig } from '../types/navbar';

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6"  y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar: React.FC = () => {
  const [config, setConfig] = useState<NavbarConfig | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    import('../config/navbar.json').then((d) => setConfig(d.default));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogoClick = () =>
    trackEvent(EVENTS.NAV_LOGO_CLICK, { component: 'Navbar', text: config?.logo.text });

  const handleLinkClick = (label: string) =>
    trackEvent(EVENTS.NAV_LINK_CLICK, { component: 'Navbar', label });

  if (!config) return null;

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      <nav
        className={`
          sticky top-0 z-50 w-full transition-all duration-300
          ${scrolled
            ? 'bg-[#fafafa]/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
            : 'bg-transparent border-b border-transparent'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              to={config.logo.href}
              onClick={handleLogoClick}
              data-testid="nav-logo-link"
              className="text-xl font-bold text-gray-900 tracking-tight hover:text-gray-600 transition-colors"
            >
              {config.logo.text}
            </Link>

            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-8">
              {config.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleLinkClick(link.label)}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                  className={`
                    relative py-1 text-sm transition-colors duration-300 group
                    ${isActive(link.href)
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-500 font-medium hover:text-gray-900'}
                  `}
                >
                  {link.label}
                  {/* Left-to-right animated underline */}
                  <span 
                    className={`absolute bottom-0 left-0 h-[2px] bg-gray-900 transition-all duration-300 ease-out
                      ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                  />
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              className="sm:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`
            sm:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileOpen ? 'max-h-80 border-t border-slate-100' : 'max-h-0'}
          `}
        >
          <div className="px-4 pt-3 pb-5 flex flex-col gap-1 bg-white/95 backdrop-blur-xl">
            {config.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleLinkClick(link.label)}
                  className={`
                    px-4 py-3 rounded-lg text-sm transition-all duration-150
                    ${isActive(link.href)
                      ? 'bg-gray-100 text-gray-900 font-semibold'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}
                  `}
                >
                  {link.label}
                </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
