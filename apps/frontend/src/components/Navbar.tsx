import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent, EVENTS } from '../utils/analytics';

interface NavbarConfig {
  logo: {
    text: string;
    href: string;
  };
  links: {
    label: string;
    href: string;
  }[];
}

const Navbar: React.FC = () => {
  const [config, setConfig] = useState<NavbarConfig | null>(null);

  useEffect(() => {
    import('../config/navbar.json').then((data) => setConfig(data.default));
  }, []);

  const handleLogoClick = () => {
    trackEvent(EVENTS.NAV_LOGO_CLICK, {
      component: 'Navbar',
      text: config?.logo.text,
    });
  };

  const handleLinkClick = (label: string) => {
    trackEvent(EVENTS.NAV_LINK_CLICK, {
      component: 'Navbar',
      label,
    });
  };

  if (!config) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to={config.logo.href}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              onClick={handleLogoClick}
              data-testid="nav-logo-link"
            >
              {config.logo.text}
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {config.links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                onClick={() => handleLinkClick(link.label)}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
