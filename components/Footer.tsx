import React from 'react';
import { View } from '../types';

interface FooterProps {
  setView: (view: View) => void;
  isAuthenticated: boolean;
  siteName: {
    main: string;
    highlight: string;
  };
  t: (key: string) => string;
}

const Footer: React.FC<FooterProps> = ({ setView, isAuthenticated, siteName, t }) => {
  return (
    <footer className="bg-mango-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t('information')}</h3>
            <ul>
              <li className="mb-2"><button onClick={() => setView('about')} className="hover:text-mango-orange transition-colors">{t('aboutUs')}</button></li>
              <li className="mb-2"><button onClick={() => setView('contact')} className="hover:text-mango-orange transition-colors">{t('contacts')}</button></li>
              <li className="mb-2"><button onClick={() => setView('faq')} className="hover:text-mango-orange transition-colors">{t('faq')}</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('shop')}</h3>
            <ul>
              <li className="mb-2"><button onClick={() => setView('shop')} className="hover:text-mango-orange transition-colors">{t('newArrivals')}</button></li>
              <li className="mb-2"><button onClick={() => setView('shop')} className="hover:text-mango-orange transition-colors">{t('bestsellers')}</button></li>
              <li className="mb-2"><button onClick={() => setView('shop')} className="hover:text-mango-orange transition-colors">{t('allCovers')}</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('policy')}</h3>
            <ul>
              <li className="mb-2"><button onClick={() => setView('privacyPolicy')} className="hover:text-mango-orange transition-colors">{t('privacyPolicy')}</button></li>
              <li className="mb-2"><button onClick={() => setView('cookiePolicy')} className="hover:text-mango-orange transition-colors">{t('cookiePolicy')}</button></li>
              <li className="mb-2"><button onClick={() => setView('termsAndConditions')} className="hover:text-mango-orange transition-colors">{t('termsAndConditions')}</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('followUs')}</h3>
            {/* Social Icons would go here */}
            {isAuthenticated && (
              <button 
                onClick={() => setView('admin')}
                className="mt-4 text-sm text-gray-400 hover:text-white"
              >
                {t('adminPanel')}
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {siteName.main} {siteName.highlight}. {t('allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;