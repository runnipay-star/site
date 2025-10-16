import React, { useState } from 'react';
import { SiteConfiguration, Product } from '../types';

interface SiteManagementPanelProps {
  configs: SiteConfiguration[];
  products: Product[];
  onEdit: (config: SiteConfiguration) => void;
  onCreate: (slug: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdateTakeover: (configId: string, productId: string | null) => Promise<void>;
}

const SiteManagementPanel: React.FC<SiteManagementPanelProps> = ({ configs, products, onEdit, onCreate, onDelete, onUpdateTakeover }) => {
  const [newSlug, setNewSlug] = useState('');

  const handleCreate = async () => {
    if (!newSlug) {
      alert('Per favore, inserisci un codice per la nuova configurazione.');
      return;
    }
    if (configs.some(c => c.slug === newSlug)) {
        alert('Questo codice esiste già. Scegline uno diverso.');
        return;
    }
    await onCreate(newSlug);
    setNewSlug('');
  };

  const handleDelete = async (config: SiteConfiguration) => {
    if (config.slug === 'default') {
      alert("La configurazione 'default' non può essere eliminata.");
      return;
    }
    if (window.confirm(`Sei sicuro di voler eliminare la configurazione "${config.slug}"? L'azione è irreversibile.`)) {
      await onDelete(config.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Gestione Configurazioni Sito</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-bold mb-4">Crea Nuova Configurazione</h3>
        <p className="text-sm text-gray-600 mb-2">Verrà creata una copia della configurazione 'default'.</p>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="Codice (es. cliente-nuovo)"
            className="flex-grow p-2 border rounded"
          />
          <button onClick={handleCreate} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            Crea
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Sito</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Codice (Slug)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Esempio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Homepage Takeover</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {configs.map(config => (
              <tr key={config.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{config.data.siteName.main} {config.data.siteName.highlight}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm bg-gray-200 p-1 rounded">{config.slug}</code>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                  <a href={`/?config=${config.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {`/`}{config.slug !== 'default' && `?config=${config.slug}`}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <select
                        value={config.data.homePageProductTakeoverId || ''}
                        onChange={(e) => onUpdateTakeover(config.id, e.target.value || null)}
                        className="w-full max-w-xs p-2 border rounded bg-white text-sm focus:ring-mango-orange focus:border-mango-orange"
                    >
                        <option value="">-- Homepage Normale --</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onEdit(config)} className="text-indigo-600 hover:text-indigo-900 mr-4">Modifica</button>
                  <button onClick={() => handleDelete(config)} className={`text-red-600 hover:text-red-900 ${config.slug === 'default' ? 'opacity-50 cursor-not-allowed' : ''}`}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiteManagementPanel;