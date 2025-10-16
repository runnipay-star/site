import React from 'react';
import { View } from '../types';
import { SearchIcon, UserIcon } from './icons';
import { languages, Language } from '../languages';

interface HeaderProps {
  setView: (view: View, options?: { bypassTakeover?: boolean }) => void;
  isAuthenticated: boolean;
  siteName: {
    main: string;
    highlight: string;
  };
  t: (key: string) => string;
  setLanguage: (language: Language) => void;
  currentLanguage: Language;
}

const Header: React.FC<HeaderProps> = ({ setView, isAuthenticated, siteName, t, setLanguage, currentLanguage }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 
            className="text-2xl font-bold text-mango-dark cursor-pointer" 
            onClick={() => setView('home', { bypassTakeover: true })}
          >
            {siteName.main}<span className="text-mango-orange"> {siteName.highlight}</span>
          </h1>
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => setView('home', { bypassTakeover: true })} className="text-gray-600 hover:text-mango-orange transition-colors">{t('home')}</button>
            <button onClick={() => setView('shop')} className="text-gray-600 hover:text-mango-orange transition-colors">{t('shop')}</button>
            <button onClick={() => setView('about')} className="text-gray-600 hover:text-mango-orange transition-colors">{t('about')}</button>
            <button onClick={() => setView('contact')} className="text-gray-600 hover:text-mango-orange transition-colors">{t('contacts')}</button>
            <button onClick={() => setView('faq')} className="text-gray-600 hover:text-mango-orange transition-colors">{t('faq')}</button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-mango-orange"
          >
            {Object.keys(languages).map((lang) => (
              <option key={lang} value={lang}>{languages[lang as Language].name}</option>
            ))}
          </select>
          <button className="text-gray-600 hover:text-mango-orange transition-colors">
            <SearchIcon className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setView(isAuthenticated ? 'admin' : 'login')}
            className="text-gray-600 hover:text-mango-orange transition-colors"
          >
            <UserIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;