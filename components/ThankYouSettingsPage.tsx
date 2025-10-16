import React, { useState } from 'react';
import { ThankYouPageData, View } from '../types';

interface ThankYouSettingsPageProps {
  pageData: ThankYouPageData;
  onUpdate: (data: ThankYouPageData) => void;
  setView: (view: View) => void;
}

const ThankYouSettingsPage: React.FC<ThankYouSettingsPageProps> = ({ pageData, onUpdate, setView }) => {
  const [formData, setFormData] = useState<ThankYouPageData>(pageData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    onUpdate(formData);
    alert('Modifiche salvate con successo!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Impostazioni Pagina di Ringraziamento</h2>
        <button onClick={handleSaveChanges} className="bg-mango-orange text-white py-2 px-4 rounded hover:bg-opacity-90">
            Salva Modifiche
        </button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
        <fieldset className="border p-4 rounded-md">
            <legend className="text-xl font-bold px-2">Contenuto Pagina</legend>
            <div className="space-y-4 mt-2">
                <div>
                    <label className="block font-medium">Titolo</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block font-medium">Messaggio</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
                </div>
            </div>
        </fieldset>
        
        <fieldset className="border p-4 rounded-md">
            <legend className="text-xl font-bold px-2">Anteprima</legend>
            <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">
                    Clicca sul link qui sotto per visualizzare un'anteprima della pagina di ringraziamento con un prodotto di esempio. 
                    Questo è utile per controllare l'aspetto della pagina senza dover completare un ordine.
                </p>
                <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                    <button 
                        onClick={() => setView('thankYouPreview')} 
                        className="text-blue-600 hover:underline"
                    >
                        Visualizza Anteprima Pagina di Ringraziamento
                    </button>
                </div>
                 <p className="text-xs text-gray-500 mt-2">
                    Esempio URL per il tuo sito Vercel: <code>https://tuo-sito.vercel.app/?view=thankYouPreview</code>
                </p>
            </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
            <legend className="text-xl font-bold px-2">Tracking Conversioni</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Facebook Pixel */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Facebook Pixel</h3>
                    <div className="space-y-2">
                        <label className="block font-medium">Script HTML del Pixel di Facebook</label>
                         <p className="text-sm text-gray-600">Questo script verrà eseguito sulla Thank You Page. Assicurati che includa l'evento di conversione (es. 'Purchase').</p>
                        <textarea 
                            name="facebookPixelHtml" 
                            value={formData.facebookPixelHtml} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
                            rows={8}
                            placeholder="<!-- Facebook Pixel Code --> ... fbq('track', 'Purchase'); ... </script>"
                        />
                    </div>
                </div>
                {/* TikTok Pixel */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">TikTok Pixel</h3>
                    <div className="space-y-2">
                        <label className="block font-medium">Script HTML del Pixel di TikTok</label>
                        <p className="text-sm text-gray-600">Questo script verrà eseguito sulla Thank You Page. Assicurati che includa l'evento di conversione (es. 'CompletePayment').</p>
                         <textarea 
                            name="tiktokPixelHtml" 
                            value={formData.tiktokPixelHtml} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
                            rows={8}
                            placeholder="<!-- TikTok Pixel Code --> ... ttq.track('CompletePayment'); ... </script>"
                        />
                    </div>
                </div>
            </div>
        </fieldset>
      </div>
    </div>
  );
};

export default ThankYouSettingsPage;