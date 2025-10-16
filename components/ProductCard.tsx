import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductSelect: (id: string) => void;
  t: (key: string) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect, t }) => {
  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  
  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: { [key: string]: string } = { 'EUR': '€', 'PLN': 'zł', 'CZK': 'Kč', 'RON': 'lei', 'USD': '$' };
    return symbols[currencyCode] || currencyCode;
  };

  const currencySymbol = getCurrencySymbol(product.currency);

  return (
    <div 
      className="group relative bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => onProductSelect(product.id)}
    >
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 bg-mango-orange text-white text-xs font-bold px-2 py-1 rounded z-10">
          -{discountPercent}%
        </div>
      )}
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-mango-dark">{product.name}</h3>
        <div className="mt-1 text-md flex justify-center items-baseline space-x-2">
            <span 
              className="text-lg font-bold" 
              style={{ color: product.priceColor || 'var(--color-dark)' }}
            >
              {currencySymbol}{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
                <span 
                  className="text-sm line-through"
                  style={{ color: product.originalPriceColor || '#9ca3af' }}
                >
                  {currencySymbol}{product.originalPrice.toFixed(2)}
                </span>
            )}
        </div>
      </div>
       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 bg-mango-orange text-white font-bold py-2 px-6 rounded-full transition-opacity duration-300 transform group-hover:scale-105">
          {t('view')}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;