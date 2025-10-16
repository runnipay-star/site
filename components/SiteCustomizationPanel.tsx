import React, { useState, useEffect } from 'react';
import { SiteConfiguration, View, ValueProp, FaqItem, Product } from '../types';

interface SiteCustomizationPanelProps {
  config: SiteConfiguration;
  products: Product[];
  onUpdateSiteConfig: (newConfig: SiteConfiguration) => void;
  setView: (view: View) => void;
  onLogout: () => void;
}

const SiteCustomizationPanel: React.FC<SiteCustomizationPanelProps> = ({ config, products, onUpdateSiteConfig, setView, onLogout }) => {
  const [formData, setFormData] = useState<SiteConfiguration>(config);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  
  useEffect(() => {
    setFormData(config); // Sync with prop changes
  }, [config]);

  const setChanged = () => {
    if (!hasChanges) {
      setHasChanges(true);
    }
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({...prev, slug: newSlug }));
      setChanged();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section: keyof SiteConfiguration['data'], field?: string | number, subfield?: string) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        const newFormData = { ...prev };
        let currentSection = newFormData.data[section] as any;

        if (field !== undefined && subfield !== undefined) {
          currentSection[field][subfield] = value;
        } else if (field !== undefined) {
          currentSection[field] = value;
        } else {
          // This case handles fields at the root of SiteData
           if (name === 'defaultCheckoutFormHtml' || name === 'defaultWebhookUrl') {
            (newFormData.data as any)[name] = value;
          } else {
             // Fallback, should not happen with current structure
          }
        }

        return newFormData;
    });
    setChanged();
  };

   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, section: keyof SiteConfiguration['data'], field: string) => {
    const { checked } = e.target;
    setFormData(prev => {
        const newFormData = { ...prev };
        (newFormData.data[section] as any)[field] = checked;
        return newFormData;
    });
    setChanged();
  };
  
  const handleNestedArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: keyof SiteConfiguration['data'], index: number, field: keyof ValueProp | keyof FaqItem) => {
    const { value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev };
      const array = (newFormData.data[section] as any).items || (newFormData.data[section] as any);
      array[index][field] = value;
      return newFormData;
    });
    setChanged();
  };
  
  const handleParagraphChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
      const { value } = e.target;
      setFormData(prev => {
          const newAbout = { ...prev.data.about };
          newAbout.paragraphs[index] = value;
          return { ...prev, data: {...prev.data, about: newAbout} };
      });
      setChanged();
  };

  const handleSaveChanges = () => {
    onUpdateSiteConfig(formData);
    setHasChanges(false);
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Personalizza Configurazione: <span className="text-mango-orange">{config.slug}</span></h2>
        <div className="space-x-2">
            <button onClick={() => setView('siteManagement')} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                Torna a Gestione
            </button>
            <button 
              onClick={handleSaveChanges} 
              className={`text-white py-2 px-4 rounded font-bold transition-colors ${hasChanges ? 'bg-mango-orange hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!hasChanges}
            >
                Salva Modifiche
            </button>
             <button 
              onClick={onLogout}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Logout
            </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
        
        {/* Config Slug */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-xl font-bold px-2">Codice di Configurazione (URL)</legend>
            <div className="mt-2">
                <label className="block font-medium">Codice (slug)</label>
                <p className="text-sm text-gray-600 mt-1 mb-2">Questo codice verrà usato nell'URL (es. `?config={formData.slug || '...'}`). Usa solo lettere minuscole, numeri e trattini.</p>
                <input 
                  type="text" 
                  value={formData.slug} 
                  onChange={handleSlugChange} 
                  className="w-full p-2 border rounded font-mono" 
                  disabled={formData.slug === 'default'}
                />
                 {formData.slug === 'default' && <p className="text-sm text-red-600 mt-1">Il codice 'default' non può essere modificato.</p>}
            </div>
        </fieldset>
        
        {/* Site Name */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-xl font-bold px-2">Nome del Sito</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                    <label className="block font-medium">Nome Principale</label>
                    <input type="text" value={formData.data.siteName.main} onChange={(e) => handleInputChange(e, 'siteName', 'main')} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block font-medium">Parte Evidenziata</label>
                    <input type="text" value={formData.data.siteName.highlight} onChange={(e) => handleInputChange(e, 'siteName', 'highlight')} className="w-full p-2 border rounded" />
                </div>
            </div>
        </fieldset>

        {/* Default Order Settings */}
        <fieldset className="border p-4 rounded-md">
           <legend className="text-xl font-bold px-2">Impostazioni Ordini Default</legend>
           <div className="space-y-6 mt-2">
                <div>
                    <label htmlFor="defaultWebhookUrl" className="block font-medium">URL Webhook di Default</label>
                    <p className="text-sm text-gray-600 mt-1 mb-2">Questo URL verrà usato per tutti i prodotti che non hanno un webhook personalizzato.</p>
                    <input
                        id="defaultWebhookUrl"
                        name="defaultWebhookUrl"
                        type="text"
                        value={formData.data.defaultWebhookUrl || ''}
                        onChange={(e) => handleInputChange(e, 'defaultWebhookUrl' as any)}
                        className="w-full p-2 border rounded"
                        placeholder="https://tuo-servizio.com/api/default-ordini"
                    />
                </div>
                <div className="border-t pt-6">
                   <label className="block font-medium">HTML Formulario di Checkout Default</label>
                   <p className="text-sm text-gray-600 mt-1 mb-2">Questo HTML verrà usato per tutti i prodotti che non hanno un formulario personalizzato.</p>
                   <textarea 
                        name="defaultCheckoutFormHtml" 
                        value={formData.data.defaultCheckoutFormHtml} 
                        onChange={(e) => handleInputChange(e, 'defaultCheckoutFormHtml' as any)}
                        className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
                        rows={15}
                        placeholder='<div class="space-y-4">...</div>'
                    />
                </div>
            </div>
        </fieldset>
        
        {/* Tracking & Analytics */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-bold px-2">Tracking & Analytics (Sito Globale)</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Facebook Pixel */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Facebook Pixel</h3>
               <div className="space-y-2">
                <label className="block font-medium">Script HTML del Pixel di Facebook</label>
                <p className="text-sm text-gray-600">Incolla qui l'intero script del pixel fornito da Facebook.</p>
                <textarea 
                    value={formData.data.tracking.facebookPixelHtml} 
                    onChange={(e) => handleInputChange(e, 'tracking', 'facebookPixelHtml')} 
                    className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
                    rows={8}
                    placeholder="<!-- Facebook Pixel Code --> ... </script>"
                />
              </div>
            </div>
            {/* TikTok Pixel */}
            <div>
              <h3 className="text-lg font-semibold mb-2">TikTok Pixel</h3>
               <div className="space-y-2">
                <label className="block font-medium">Script HTML del Pixel di TikTok</label>
                <p className="text-sm text-gray-600">Incolla qui l'intero script del pixel fornito da TikTok.</p>
                <textarea 
                    value={formData.data.tracking.tiktokPixelHtml} 
                    onChange={(e) => handleInputChange(e, 'tracking', 'tiktokPixelHtml')} 
                    className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
                    rows={8}
                    placeholder="<!-- TikTok Pixel Code --> ... </script>"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Theme Colors */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-bold px-2">Colori del Tema</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block font-medium">Colore Primario</label>
              <input type="color" name="primaryColor" value={formData.data.theme.primaryColor} onChange={(e) => handleInputChange(e, 'theme', 'primaryColor')} className="w-full h-10" />
            </div>
            <div>
              <label className="block font-medium">Colore Scuro</label>
              <input type="color" name="darkColor" value={formData.data.theme.darkColor} onChange={(e) => handleInputChange(e, 'theme', 'darkColor')} className="w-full h-10" />
            </div>
          </div>
        </fieldset>
        
        {/* Hero Section */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-bold px-2">Sezione Hero</legend>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block font-medium">Titolo</label>
              <input type="text" value={formData.data.hero.title} onChange={(e) => handleInputChange(e, 'hero', 'title')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Sottotitolo</label>
              <textarea value={formData.data.hero.subtitle} onChange={(e) => handleInputChange(e, 'hero', 'subtitle')} className="w-full p-2 border rounded" rows={2}></textarea>
            </div>
             <div>
              <label className="block font-medium">URL Immagine di Sfondo</label>
              <input type="text" value={formData.data.hero.imageUrl} onChange={(e) => handleInputChange(e, 'hero', 'imageUrl')} className="w-full p-2 border rounded" />
            </div>
          </div>
        </fieldset>
        
        {/* Promo Banner Section */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-bold px-2">Banner Promozionale</legend>
          <div className="space-y-4 mt-2">
             <div className="flex items-center">
              <input type="checkbox" id="promoEnabled" checked={formData.data.promoBanner.enabled} onChange={(e) => handleCheckboxChange(e, 'promoBanner', 'enabled')} className="h-4 w-4 text-mango-orange border-gray-300 rounded focus:ring-mango-orange"/>
              <label htmlFor="promoEnabled" className="ml-2 block text-sm font-medium text-gray-700">Abilita Banner</label>
            </div>
             <div>
              <label className="block font-medium">URL Immagine Banner</label>
              <input type="text" value={formData.data.promoBanner.imageUrl} onChange={(e) => handleInputChange(e, 'promoBanner', 'imageUrl')} className="w-full p-2 border rounded" disabled={!formData.data.promoBanner.enabled} />
            </div>
             <div>
              <label className="block font-medium">Titolo Banner</label>
              <input type="text" value={formData.data.promoBanner.title} onChange={(e) => handleInputChange(e, 'promoBanner', 'title')} className="w-full p-2 border rounded" disabled={!formData.data.promoBanner.enabled} />
            </div>
            <div>
              <label className="block font-medium">Sottotitolo Banner</label>
              <textarea value={formData.data.promoBanner.subtitle} onChange={(e) => handleInputChange(e, 'promoBanner', 'subtitle')} className="w-full p-2 border rounded" rows={2} disabled={!formData.data.promoBanner.enabled}></textarea>
            </div>
             <div>
              <label className="block font-medium">Testo del Pulsante</label>
              <input type="text" value={formData.data.promoBanner.buttonText} onChange={(e) => handleInputChange(e, 'promoBanner', 'buttonText')} className="w-full p-2 border rounded" disabled={!formData.data.promoBanner.enabled} />
            </div>
             <div>
              <label className="block font-medium">Link del Pulsante (es. 'shop')</label>
              <input type="text" value={String(formData.data.promoBanner.buttonLink)} onChange={(e) => handleInputChange(e, 'promoBanner', 'buttonLink')} className="w-full p-2 border rounded" disabled={!formData.data.promoBanner.enabled} />
            </div>
          </div>
        </fieldset>

        {/* Value Props */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-bold px-2">Proposte di Valore</legend>
          <div className="space-y-4 mt-2">
            {formData.data.valueProps.map((prop, index) => (
              <div key={index} className="border-b pb-2">
                <label className="block font-medium">Proposta {index + 1}</label>
                <input type="text" value={prop.title} onChange={(e) => handleNestedArrayChange(e, 'valueProps', index, 'title')} className="w-full p-2 border rounded mb-2" />
                <input type="text" value={prop.description} onChange={(e) => handleNestedArrayChange(e, 'valueProps', index, 'description')} className="w-full p-2 border rounded" />
              </div>
            ))}
          </div>
        </fieldset>
        
        {/* About Page */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-xl font-bold px-2">Pagina "Chi Siamo"</legend>
            <div className="space-y-4 mt-2">
                {formData.data.about.paragraphs.map((p, i) => (
                     <div key={i}>
                        <label className="block font-medium">Paragrafo {i + 1}</label>
                        <textarea value={p} onChange={(e) => handleParagraphChange(e, i)} className="w-full p-2 border rounded" rows={4}></textarea>
                    </div>
                ))}
            </div>
        </fieldset>

        {/* FAQ Page */}
        <fieldset className="border p-4 rounded-md">
            <legend className="text-xl font-bold px-2">Pagina FAQ</legend>
             <div className="space-y-4 mt-2">
                {formData.data.faq.items.map((item, index) => (
                <div key={index} className="border-b pb-2">
                    <label className="block font-medium">Domanda {index + 1}</label>
                    <input type="text" value={item.question} onChange={(e) => handleNestedArrayChange(e, 'faq', index, 'question')} className="w-full p-2 border rounded mb-2" />
                    <label className="block font-medium">Risposta {index + 1}</label>
                    <textarea value={item.answer} onChange={(e) => handleNestedArrayChange(e, 'faq', index, 'answer')} className="w-full p-2 border rounded" rows={3}></textarea>
                </div>
                ))}
            </div>
        </fieldset>
        
         {/* Newsletter */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-xl font-bold px-2">Newsletter</legend>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block font-medium">Titolo</label>
              <input type="text" value={formData.data.newsletter.title} onChange={(e) => handleInputChange(e, 'newsletter', 'title')} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Descrizione</label>
              <textarea value={formData.data.newsletter.description} onChange={(e) => handleInputChange(e, 'newsletter', 'description')} className="w-full p-2 border rounded" rows={2}></textarea>
            </div>
          </div>
        </fieldset>

      </div>

      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-[100]">
            <button
            onClick={handleSaveChanges}
            className="bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:bg-green-700 transition-all transform hover:scale-105 flex items-center space-x-3 animate-pulse"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-lg">SALVA</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default SiteCustomizationPanel;