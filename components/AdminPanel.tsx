// Fix: Implemented the AdminPanel component for product management.
import React from 'react';
import { Product, Category } from '../types';
import { StarIcon } from './icons';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  onDeleteProduct: (id: string) => Promise<void>;
  onEditProduct: (id: string) => void;
  onAddProduct: () => void;
  onToggleFeature: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, categories, onDeleteProduct, onEditProduct, onAddProduct, onToggleFeature }) => {

  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto? L\'azione è irreversibile.')) {
      await onDeleteProduct(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Prodotti</h2>
        <button onClick={onAddProduct} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Aggiungi Prodotto
        </button>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immagine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prezzo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibilità</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Vetrina</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => {
              const category = categories.find(c => c.id === product.categoryId);
              const isVisible = (product.visibleInConfigIds?.length ?? 0) > 0;
              return (
                <tr key={product.id} className={`${isVisible ? '' : 'opacity-60 bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 object-cover rounded"/>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                      {category?.name || 'N/D'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price.toFixed(2)} {product.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {isVisible
                      ? `Visibile su ${product.visibleInConfigIds.length} sito/i`
                      : 'Nascosto'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => onToggleFeature(product.id)} className="cursor-pointer">
                          <StarIcon className={`h-6 w-6 ${product.isFeatured ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} filled={product.isFeatured} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onEditProduct(product.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Modifica</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Elimina</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;