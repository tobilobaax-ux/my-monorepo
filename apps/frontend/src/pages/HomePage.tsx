import React, { useState, useEffect } from 'react';
import { HeroConfig } from '../types/hero';
import ComponentRenderer from '../components/ComponentRenderer';

const HomePage: React.FC = () => {
  const [config, setConfig] = useState<HeroConfig | null>(null);

  useEffect(() => {
    import('../config/hero.json').then((data) => {
      setConfig(data.default as HeroConfig);
    });
  }, []);

  if (!config) return null;
  if (!config.flags?.hero_section_enabled) return <div className="p-20 text-center text-gray-400">Hero Section is currently disabled.</div>;

  return <ComponentRenderer type="HeroSection" props={{ externalConfig: config }} />;
};

export default HomePage;
