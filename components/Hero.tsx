
import React from 'react';
import { ArrowRightIcon } from './icons';

interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  t: (key: string) => string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, imageUrl, t }) => {
  return (
    <div className="relative h-[60vh] md:h-[80vh] bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl}')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{title}</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md">
          {subtitle}
        </p>
        <button className="btn-animated-gradient">
          <span>{t('discoverNewProducts')}</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Hero;