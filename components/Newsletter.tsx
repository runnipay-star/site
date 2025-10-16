
import React from 'react';
import { PaperAirplaneIcon } from './icons';

interface NewsletterProps {
  title: string;
  description: string;
  t: (key: string) => string;
}

const Newsletter: React.FC<NewsletterProps> = ({ title, description, t }) => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-3 text-mango-dark">{t('stayUpdated')}</h2>
        <p className="text-gray-600 mb-8">
          {t('newsletterDescription')}
        </p>
        <form className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder={t('yourEmail')}
            className="w-full px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-mango-orange"
          />
          <button
            type="submit"
            className="bg-mango-dark text-white font-bold px-6 py-3 rounded-r-full hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <span>{t('subscribe')}</span>
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;