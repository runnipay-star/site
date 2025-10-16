import React from 'react';
import { PromoBannerData, View } from '../types';
import { ArrowRightIcon } from './icons';

interface PromoBannerProps {
  bannerData: PromoBannerData;
  setView: (view: View) => void;
  t: (key: string) => string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ bannerData, setView, t }) => {
  const { imageUrl, title, subtitle, buttonText, buttonLink } = bannerData;

  const handleButtonClick = () => {
    // Simple check if it's a valid view. If not, it could be treated as an external link, but for now we assume it's a view.
    if (['home', 'shop', 'about', 'contact', 'faq'].includes(buttonLink as string)) {
        setView(buttonLink as View);
    }
  };

  return (
    <section className="bg-mango-light py-16">
        <div className="container mx-auto px-6">
            <div className="relative rounded-lg overflow-hidden shadow-xl group">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                ></div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="relative z-10 text-center text-white p-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">{title}</h2>
                        <p className="text-lg mb-6 max-w-xl drop-shadow-md">{subtitle}</p>
                        <button 
                            onClick={handleButtonClick}
                            className="btn-animated-gradient"
                        >
                            <span>{t('buyNow')}</span>
                            <ArrowRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                 <div className="relative h-80"></div> {/* Spacer div to maintain height */}
            </div>
        </div>
    </section>
  );
};

export default PromoBanner;