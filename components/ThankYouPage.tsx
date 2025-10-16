import React from 'react';
import { View, ThankYouPageData, CheckoutDetails, SiteData } from '../types';
import { CheckCircleIcon, HomeIcon } from './icons';

interface ThankYouPageProps {
  pageData: ThankYouPageData;
  siteData: SiteData;
  checkoutDetails: CheckoutDetails | null;
  t: (key: string) => string;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ pageData, siteData, checkoutDetails, t }) => {

  const handleGoHome = () => {
    // IMPORTANTE: Sostituisci questo URL con l'URL esatto della tua pagina Elementor
    // dove è incorporato l'iframe. Esempio: 'https://miocliente.it/pagina-prodotto/'.
    const elementorSiteUrl = 'https://husiton-gadget.com/ai-studio-test/'; 
    
    // Questa istruzione forza il ricaricamento dell'intera pagina del browser (la pagina Elementor),
    // non solo il contenuto dell'iframe. Questo "resetta" completamente lo stato.
    if (window.top) {
      window.top.location.href = elementorSiteUrl;
    } else {
      // Fallback nel caso in cui l'app non sia in un iframe (es. durante lo sviluppo)
      window.location.href = elementorSiteUrl;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center px-4 py-16 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl shadow-lg">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-mango-dark mb-4">{t('thankYouTitle')}</h1>
          <p className="text-lg text-gray-700 mb-8">
            {t('thankYouMessage')}
          </p>
          <button 
            onClick={handleGoHome}
            className="btn-animated-gradient"
          >
            <HomeIcon className="h-6 w-6" />
            <span>{t('backToHome')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;