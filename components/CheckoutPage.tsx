import React, { useEffect, useRef } from 'react';
import { CheckoutDetails, SiteData, View } from '../types';
import StandardOrderForm from './StandardOrderForm';
import { LightningBoltIcon } from './icons';

interface CheckoutPageProps {
  details: CheckoutDetails | null;
  onOrderSuccess: (formData: Record<string, any>) => void;
  setView: (view: View) => void;
  siteData: SiteData;
  t: (key: string) => string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ details, onOrderSuccess, setView, siteData, t }) => {
  useEffect(() => {
    if (!details) {
      // If there are no checkout details, redirect to the shop
      setView('shop');
    }
  }, [details, setView]);

  if (!details) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">{t('cartIsEmpty')}</h2>
        <button onClick={() => setView('shop')} className="mt-4 bg-mango-orange text-white font-bold py-3 px-8 rounded-full">
          {t('backToShop')}
        </button>
      </div>
    );
  }

  const { product, variation } = details;
  const hasProductCustomForm = product.checkoutFormHtml?.trim();
  const customCss = product.checkoutFormCss?.trim();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());
    onOrderSuccess(dataObject);
  }

  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: { [key: string]: string } = { 'EUR': '€', 'PLN': 'zł', 'CZK': 'Kč', 'RON': 'lei', 'USD': '$' };
    return symbols[currencyCode] || currencyCode;
  };

  const currencySymbol = getCurrencySymbol(product.currency);

  return (
    <>
      {customCss && (
        <style>{customCss}</style>
      )}
      <div className="bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-center mb-10 text-mango-dark">{t('completeYourOrder')}</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:order-last">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">{t('orderSummary')}</h2>
              <div className="flex items-center space-x-4">
                <img src={product.imageUrls[0]} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-600">{t('quantity')}: {variation.quantity}</p>
                </div>
                <p className="font-bold text-lg ml-auto">{currencySymbol}{variation.price.toFixed(2)}</p>
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('total')}</span>
                  <span>{currencySymbol}{variation.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{t('codNoExtraCost')}</p>
              </div>
            </div>

            {/* Checkout Form Container */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:order-first">
              <h2 className="text-2xl font-bold mb-4">{t('enterShippingDetails')}</h2>
              
              <form onSubmit={handleFormSubmit}>
                {hasProductCustomForm ? (
                  <div dangerouslySetInnerHTML={{ __html: product.checkoutFormHtml }} />
                ) : (
                  <StandardOrderForm t={t} />
                )}
                
                {!hasProductCustomForm && (
                  <div className="mt-8">
                    <button 
                      type="submit"
                      className="w-full btn-animated-gradient"
                    >
                      <LightningBoltIcon className="h-6 w-6" />
                      <span>{t('completeOrderAndPay')}</span>
                    </button>
                  </div>
                )}
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;