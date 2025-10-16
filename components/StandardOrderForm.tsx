import React from 'react';

interface StandardOrderFormProps {
  t: (key: string) => string;
}

const StandardOrderForm: React.FC<StandardOrderFormProps> = ({ t }) => {
  return (
    <div className="space-y-4 text-left">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
        <input type="text" id="fullName" name="fullName" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder={t('fullNamePlaceholder')} />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t('fullAddress')}</label>
        <input type="text" id="address" name="address" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder={t('fullAddressPlaceholder')} />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('phoneNumber')}</label>
        <input type="tel" id="phone" name="phone" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder={t('phoneNumberPlaceholder')} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('emailOptional')}</label>
        <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder={t('emailPlaceholder')} />
      </div>
    </div>
  );
};

export default StandardOrderForm;