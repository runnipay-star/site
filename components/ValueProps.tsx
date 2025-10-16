

import React from 'react';
// Fix: Import `CheckCircleIcon` to resolve missing icon type.
import { TruckIcon, ShieldCheckIcon, ChatBubbleIcon, CheckCircleIcon } from './icons';
import { ValueProp, IconName } from '../types';

interface ValuePropsProps {
  items: ValueProp[];
  t: (key: string) => string;
}

const iconMap: Record<IconName, React.ReactNode> = {
  Truck: <TruckIcon className="h-10 w-10 text-mango-orange" />,
  ShieldCheck: <ShieldCheckIcon className="h-10 w-10 text-mango-orange" />,
  ChatBubble: <ChatBubbleIcon className="h-10 w-10 text-mango-orange" />,
  // Fix: Add `CheckCircle` to the map to satisfy the `IconName` type.
  CheckCircle: <CheckCircleIcon className="h-10 w-10 text-mango-orange" />,
};

const ValueProps: React.FC<ValuePropsProps> = ({ items, t }) => {
  // A simple mapping for translation keys
  const getTranslationKey = (title: string) => {
    switch (title) {
      case 'Spedizione Veloce': return { title: 'fastShipping', description: 'fastShippingDesc' };
      case 'Pagamenti Sicuri': return { title: 'securePayments', description: 'securePaymentsDesc' };
      case 'Supporto Clienti': return { title: 'customerSupport', description: 'customerSupportDesc' };
      default: return { title: '', description: '' };
    }
  };

  return (
    <section className="bg-mango-light py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {items.map((prop, index) => {
            const keys = getTranslationKey(prop.title);
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-4">{iconMap[prop.icon]}</div>
                <h3 className="text-xl font-bold mb-2 text-mango-dark">{t(keys.title)}</h3>
                <p className="text-gray-600">{t(keys.description)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;