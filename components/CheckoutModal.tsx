import React from 'react';
import { CheckoutDetails, SiteData } from '../types';
import StandardOrderForm from './StandardOrderForm';
import { LightningBoltIcon } from './icons';

interface CheckoutModalProps {
  details: CheckoutDetails;
  onClose: () => void;
  onOrderSuccess: (formData: Record<string, any>) => void;
  siteData: SiteData;
  t: (key: string) => string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ details, onClose, onOrderSuccess, t }) => {
  const { product, variation } = details;
  const hasProductCustomForm = product.checkoutFormHtml?.trim();
  const customCss = product.checkoutFormCss?.trim();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());
    onOrderSuccess(dataObject);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Add an effect to prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: { [key: string]: string } = { 'EUR': '€', 'PLN': 'zł', 'CZK': 'Kč', 'RON': 'lei', 'USD': '$' };
    return symbols[currencyCode] || currencyCode;
  };

  const currencySymbol = getCurrencySymbol(product.currency);

  return (
    <>
      {customCss && <style>{customCss}</style>}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-start md:items-center p-4 pt-12 md:pt-4 animate-modal-bg"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-modal-content"
          onClick={stopPropagation}
        >
          <div className="p-6 relative border-b">
            <h1 className="text-2xl font-bold text-center text-mango-dark">{t('completeYourOrder')}</h1>
            <button 
              onClick={onClose}
              className="absolute top-1/2 -translate-y-1/2 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t('close')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg lg:order-last">
                <h2 className="text-xl font-bold mb-4 border-b pb-3">{t('orderSummary')}</h2>
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

              {/* Checkout Form */}
              <div className="lg:order-first">
                <h2 className="text-xl font-bold mb-4">{t('shippingDetails')}</h2>
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
      </div>
    </>
  );
};

export default CheckoutModal;