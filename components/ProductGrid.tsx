import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  title: string;
  products: Product[];
  onProductSelect: (id: string) => void;
  t: (key: string) => string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products, onProductSelect, t }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-mango-dark">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;