import React, { useState, useRef } from 'react';
import { Product, QuantityVariation, Review, Category, SiteData, SiteConfiguration } from '../types';
import { supabase } from '../supabaseClient';
import ProductDetailPage from './ProductDetailPage';
import SimpleRichTextEditor from './SimpleRichTextEditor';

interface ProductEditPageProps {
  productToEdit: Product;
  categories: Category[];
  siteConfigs: SiteConfiguration[];
  onSave: (product: Product) => void;
  onCancel: () => void;
  onCategoryAdded: (category: Category) => void;
  siteData: SiteData;
  t: (key: string) => string;
}

const ReviewFormModal: React.FC<{
  review: Review | Omit<Review, 'id'>;
  onSave: (review: Review) => void;
  onCancel: () => void;
}> = ({ review, onSave, onCancel }) => {
  const [formData, setFormData] = useState(review);
  const isNew = !('id' in formData);

  // FIX: Rewrote change handler to be type-safe for different form elements. The previous implementation could cause type errors.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const target = e.currentTarget;

    setFormData(prev => ({
      ...prev,
      [name]: target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target instanceof HTMLInputElement && target.type === 'number'
        ? parseFloat(value)
        : value,
    }));
  };
  
  const handleSave = () => {
      const finalReview = isNew
        ? { ...formData, id: `rev-${Date.now()}` }
        : formData;
      onSave(finalReview as Review);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h4 className="text-xl font-bold mb-4">{isNew ? 'Aggiungi Recensione' : 'Modifica Recensione'}</h4>
        <div className="space-y-4">
            <input name="customerName" value={formData.customerName || ''} onChange={handleChange} placeholder="Nome Cliente" className="w-full p-2 border rounded" />
            <input name="customerImageUrl" value={formData.customerImageUrl || ''} onChange={handleChange} placeholder="URL Immagine Cliente" className="w-full p-2 border rounded" />
            <div className="flex items-center">
                <input type="checkbox" name="showCustomerImage" checked={formData.showCustomerImage} onChange={handleChange} id="showImage" className="h-4 w-4 rounded text-mango-orange focus:ring-mango-orange" />
                <label htmlFor="showImage" className="ml-2">Mostra immagine cliente</label>
            </div>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" />
            <div>
                <label className="block font-medium">Valutazione (1-5)</label>
                <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" className="w-full p-2 border rounded" />
            </div>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Titolo Recensione" className="w-full p-2 border rounded" />
            <textarea name="text" value={formData.text} onChange={handleChange} placeholder="Testo della recensione" className="w-full p-2 border rounded" rows={3}></textarea>
            <input name="mediaUrl" value={formData.mediaUrl || ''} onChange={handleChange} placeholder="URL Media (Foto/Video)" className="w-full p-2 border rounded" />
            <select name="mediaType" value={formData.mediaType || ''} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Nessun Media</option>
                <option value="image">Immagine</option>
                <option value="video">Video</option>
            </select>
        </div>
        <div className="flex justify-end mt-6 gap-4">
            <button onClick={onCancel} className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300">Annulla</button>
            <button onClick={handleSave} className="bg-mango-orange text-white font-bold py-2 px-4 rounded hover:bg-opacity-90">Salva Recensione</button>
        </div>
      </div>
    </div>
  );
};

interface StepIndicatorProps {
    step: number;
    title: string;
    currentStep: number;
    setStep: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, title, currentStep, setStep }) => {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;

    let classes = 'flex items-center space-x-2 text-sm font-medium transition-colors ';
    if (isActive) {
        classes += 'text-mango-orange';
    } else if (isCompleted) {
        classes += 'text-green-600 hover:text-green-800';
    } else {
        classes += 'text-gray-400 hover:text-gray-600';
    }

    return (
        <button onClick={() => setStep(step)} className={classes}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 ${isActive ? 'border-mango-orange' : isCompleted ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                {isCompleted ? '✓' : step}
            </div>
            <span className="hidden md:block">{title}</span>
        </button>
    );
};


const ProductEditPage: React.FC<ProductEditPageProps> = ({ productToEdit, categories, siteConfigs, onSave, onCancel, onCategoryAdded, siteData, t }) => {
  const [formData, setFormData] = useState<Product>(productToEdit);
  const [editingReview, setEditingReview] = useState<Review | Omit<Review, 'id'> | null>(null);
  const isNewProduct = productToEdit.id === 'new';
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const totalSteps = 3;
  
  // State for drag-and-drop UI
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Refs for the logic
  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const stepTitles = [
    "Informazioni Principali",
    "Prezzi e Offerte",
    "Avanzate"
  ];
  
  // Mock functions for preview component
  const mockSetView = () => alert('Questa è un\'anteprima. La navigazione è disabilitata.');
  const mockOnAddToCart = () => alert('Questa è un\'anteprima. L\'aggiunta al carrello è disabilitata.');
  const mockOnOrderSuccess = () => alert('Questa è un\'anteprima.');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.currentTarget;
    let finalValue: string | number | boolean = value;
    if (type === 'number') {
        finalValue = value === '' ? '' : parseFloat(value);
        if(isNaN(finalValue as number)) finalValue = '';
    }
    if (type === 'checkbox') {
        finalValue = (e.currentTarget as HTMLInputElement).checked;
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleVisibilityChange = (configId: string, isVisible: boolean) => {
    setFormData(prev => {
      const currentIds = prev.visibleInConfigIds || [];
      if (isVisible) {
        // Add ID if not present
        return { ...prev, visibleInConfigIds: [...new Set([...currentIds, configId])] };
      } else {
        // Remove ID
        return { ...prev, visibleInConfigIds: currentIds.filter(id => id !== configId) };
      }
    });
  };

  const handleScarcityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // name will be like 'scarcity.enabled', 'scarcity.text', etc.
    const field = name.split('.')[1]; 

    setFormData(prev => ({
        ...prev,
        scarcity: {
            ...prev.scarcity,
            [field]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) || 0 : value
        }
    }));
  };

  const handleDescriptionChange = (newDescription: string) => {
    setFormData(prev => ({ ...prev, description: newDescription }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const files = Array.from(e.target.files);

    const uploadPromises = files.map(async (file) => {
      const filePath = `products/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('product_images') // Assuming a 'product_images' bucket
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Errore nel caricamento dell\'immagine: ' + uploadError.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    });

    const newImageUrls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null);

    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...newImageUrls],
    }));

    setIsUploading(false);
  };

  const handleImageDelete = async (imageUrl: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa immagine?")) {
        return;
    }

    // If it's a local placeholder (relative URL), just remove it from the state.
    if (imageUrl.startsWith('/')) {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter(url => url !== imageUrl),
        }));
        return;
    }
    
    const bucketName = 'product_images';
    try {
        const url = new URL(imageUrl);
        const pathSegments = url.pathname.split('/');
        const bucketNameIndex = pathSegments.indexOf(bucketName);
        if (bucketNameIndex === -1) {
            throw new Error("Impossibile determinare il percorso del file dall'URL.");
        }
        const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

        const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (deleteError) {
            // Log as a warning but proceed to remove from UI.
            // This handles cases where the file doesn't exist in storage anymore.
            console.warn(`Failed to delete image from storage (it may already be gone): ${deleteError.message}`);
        }

        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter(url => url !== imageUrl),
        }));
    } catch (error: any) {
        alert('Errore durante l\'eliminazione dell\'immagine: ' + error.message);
        console.error('Error deleting image:', error);
    }
  };
  
  const handleVariationChange = (index: number, field: keyof QuantityVariation, value: string) => {
    const newVariations = [...formData.quantityVariations];
    const numValue = parseFloat(value);
    if (field === 'badge') {
        newVariations[index][field] = value;
    } else {
        (newVariations[index] as any)[field] = isNaN(numValue) ? 0 : numValue;
    }
    setFormData({ ...formData, quantityVariations: newVariations });
  };

  const addVariation = () => {
    const newVariation: QuantityVariation = { quantity: 2, price: (formData.price || 0) * 2 * 0.9, badge: '' };
    setFormData(prev => ({ ...prev, quantityVariations: [...prev.quantityVariations, newVariation] }));
  };

  const removeVariation = (index: number) => {
    const newVariations = formData.quantityVariations.filter((_, i) => i !== index);
    setFormData({ ...formData, quantityVariations: newVariations });
  };
  
  const handleSaveReview = (review: Review) => {
    let updatedReviews;
    if ('id' in review && formData.reviews.some(r => r.id === review.id)) {
        updatedReviews = formData.reviews.map(r => r.id === review.id ? review : r);
    } else {
        updatedReviews = [...formData.reviews, review];
    }
    setFormData(prev => ({ ...prev, reviews: updatedReviews }));
    setEditingReview(null);
  };
  
  const handleAddNewReview = () => {
    setEditingReview({
        customerName: '',
        showCustomerImage: true,
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        title: '',
        text: ''
    });
  }
  
  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa recensione?')) {
        const updatedReviews = formData.reviews.filter(r => r.id !== reviewId);
        setFormData(prev => ({...prev, reviews: updatedReviews}));
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Il nome della categoria non può essere vuoto.');
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newCategoryName.trim() })
      .select('*')
      .single();

    if (error) {
      alert('Errore nella creazione della categoria: ' + error.message);
    } else if (data) {
      // FIX: The `data` object returned from Supabase is inferred as `unknown`. By casting to `Category`, we provide the necessary type information for `id` and `name` properties.
      const newCategory = data as Category;
      onCategoryAdded(newCategory);
      setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
      setIsCreatingCategory(false);
      setNewCategoryName('');
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    draggedItemIndex.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex.current !== index) {
      dragOverItemIndex.current = index;
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = () => {
    if (draggedItemIndex.current !== null && dragOverItemIndex.current !== null && draggedItemIndex.current !== dragOverItemIndex.current) {
      const reorderedImages = [...formData.imageUrls];
      const [removedItem] = reorderedImages.splice(draggedItemIndex.current, 1);
      reorderedImages.splice(dragOverItemIndex.current, 0, removedItem);

      setFormData(prev => ({
        ...prev,
        imageUrls: reorderedImages,
      }));
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    draggedItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const StepNavigation = () => (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button 
            onClick={() => setCurrentStep(s => s - 1)} 
            disabled={currentStep === 1}
            className="bg-gray-200 py-2 px-6 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Indietro
        </button>
        <div className="text-sm text-gray-500">
            Step {currentStep} di {totalSteps}
        </div>
        <button 
            onClick={() => setCurrentStep(s => s + 1)} 
            disabled={currentStep === totalSteps}
            className="bg-mango-orange text-white font-bold py-2 px-6 rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            Avanti
        </button>
    </div>
  );

  return (
    <>
    {editingReview && (
      <ReviewFormModal 
          review={editingReview}
          onSave={handleSaveReview}
          onCancel={() => setEditingReview(null)}
      />
    )}
    <div>
       <div className="flex justify-between items-center mb-8">
         <h2 className="text-3xl font-bold">{isNewProduct ? 'Aggiungi Nuovo Prodotto' : 'Modifica Prodotto'}</h2>
         <div className="space-x-4">
            <button onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Annulla</button>
            <button onClick={() => onSave(formData)} className="bg-mango-orange text-white font-bold py-2 px-6 rounded hover:bg-opacity-90">Salva Prodotto</button>
         </div>
       </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Left Column: Preview */}
        <div className="relative">
            <div className="xl:sticky top-24">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-600">Anteprima Live</h3>
                <div className="border-4 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gray-100 p-2 flex items-center space-x-1.5">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="w-full h-[80vh] overflow-y-auto bg-gray-50">
                        <ProductDetailPage 
                            product={formData}
                            setView={mockSetView}
                            onAddToCart={mockOnAddToCart}
                            onBuyNow={mockOnAddToCart}
                            siteData={siteData}
                            t={t}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Form */}
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-between border-b pb-6 mb-8 overflow-x-auto">
                {stepTitles.map((title, index) => (
                    <React.Fragment key={index}>
                        <StepIndicator step={index + 1} title={title} currentStep={currentStep} setStep={setCurrentStep} />
                        {index < totalSteps -1 && <div className="flex-1 h-px bg-gray-200 mx-2 hidden md:block"></div>}
                    </React.Fragment>
                ))}
            </div>

            <div className="space-y-8">
              {currentStep === 1 && (
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-xl font-bold px-2">Informazioni Principali</legend>
                    <div className="space-y-4 mt-2">
                        <div>
                            <label className="block font-medium">Nome Prodotto</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block font-medium">Categoria</label>
                            <div className="flex items-center space-x-2">
                              <select 
                                name="categoryId" 
                                value={formData.categoryId || ''} 
                                onChange={(e) => setFormData(prev => ({...prev, categoryId: e.target.value || null}))}
                                className="w-full p-2 border rounded bg-white"
                              >
                                <option value="">Senza Categoria</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                              <button type="button" onClick={() => setIsCreatingCategory(true)} className="flex-shrink-0 bg-blue-500 text-white text-sm py-2 px-3 rounded hover:bg-blue-600">
                                Nuova
                              </button>
                            </div>
                            {isCreatingCategory && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md border flex items-center space-x-2">
                                <input 
                                  type="text"
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  placeholder="Nome nuova categoria"
                                  className="flex-grow p-2 border rounded"
                                  autoFocus
                                />
                                <button type="button" onClick={handleCreateCategory} className="bg-green-500 text-white text-sm py-2 px-3 rounded hover:bg-green-600">Salva</button>
                                <button type="button" onClick={() => setIsCreatingCategory(false)} className="bg-gray-200 text-sm py-2 px-3 rounded hover:bg-gray-300">Annulla</button>
                              </div>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium">Descrizione</label>
                            <SimpleRichTextEditor value={formData.description} onChange={handleDescriptionChange} />
                        </div>
                        <div>
                            <label className="block font-medium">HTML Personalizzato (Prima dell'Immagine)</label>
                            <p className="text-sm text-gray-600 mt-1 mb-2">Questo blocco HTML verrà visualizzato nella pagina del prodotto, subito sopra la galleria di immagini.</p>
                            <textarea
                                name="customHtmlBeforeImage"
                                value={formData.customHtmlBeforeImage || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
                                rows={8}
                                placeholder="<div class='text-center'>...</div>"
                            />
                        </div>
                        
                        <div>
                            <label className="block font-medium">Visibilità sui Siti</label>
                            <p className="text-sm text-gray-500 mt-1 mb-2">Seleziona su quali configurazioni di sito questo prodotto deve essere visibile.</p>
                            <div className="mt-2 p-3 border rounded-md space-y-2 max-h-48 overflow-y-auto">
                                {siteConfigs.map(config => (
                                    <div key={config.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`vis-config-${config.id}`}
                                            checked={formData.visibleInConfigIds?.includes(config.id) ?? false}
                                            onChange={(e) => handleVisibilityChange(config.id, e.target.checked)}
                                            className="h-4 w-4 rounded text-mango-orange focus:ring-mango-orange"
                                        />
                                        <label htmlFor={`vis-config-${config.id}`} className="ml-2 text-sm">
                                            {config.data.siteName.main} {config.data.siteName.highlight} (<code className="text-xs bg-gray-200 p-1 rounded">{config.slug}</code>)
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured || false} onChange={handleChange} id="isFeatured" className="h-4 w-4 rounded text-mango-orange focus:ring-mango-orange" />
                            <label htmlFor="isFeatured" className="ml-2 font-medium">Prodotto in Evidenza in Home Page</label>
                        </div>
                        <div>
                            <label className="block font-medium">Immagini Prodotto</label>
                            <p className="text-sm text-gray-500 mt-1">Trascina le immagini per riordinarle. La prima immagine sarà quella principale.</p>
                            <div className="mt-2 p-4 border-2 border-dashed rounded-lg">
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {formData.imageUrls.map((url, index) => {
                                        let classes = "relative group aspect-w-1 aspect-h-1 bg-gray-100 rounded-md cursor-move transition-all duration-300";
                                        if (draggedIndex === index) {
                                            classes += " opacity-50 scale-95";
                                        }
                                        if (dragOverIndex === index) {
                                            classes += " ring-2 ring-mango-orange ring-offset-2";
                                        }
                                        return (
                                            <div
                                                key={url}
                                                className={classes}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, index)}
                                                onDragEnter={() => handleDragEnter(index)}
                                                onDragLeave={handleDragLeave}
                                                onDragEnd={handleDrop}
                                                onDragOver={(e) => e.preventDefault()}
                                            >
                                                <img src={url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover rounded-md pointer-events-none" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDelete(url)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                                                    aria-label="Elimina immagine"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="image-upload" className={`cursor-pointer text-white py-2 px-4 rounded transition-colors ${isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
                                        Aggiungi Immagini
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                    {isUploading && <p className="ml-4 inline-block animate-pulse">Caricamento in corso...</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium">Dettagli (un dettaglio per riga)</label>
                            <textarea name="details" value={formData.details.join('\n')} onChange={e => setFormData(prev => ({...prev, details: e.target.value.split('\n')}))} className="w-full p-2 border rounded" rows={4}></textarea>
                        </div>
                        <div>
                            <label className="block font-medium">Informazioni sulla Consegna</label>
                            <textarea name="deliveryInfo" value={formData.deliveryInfo} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
                        </div>
                        <div>
                            <label className="block font-medium">Informazioni sulla Garanzia</label>
                            <textarea name="warrantyInfo" value={formData.warrantyInfo} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
                        </div>
                        <div>
                            <label className="block font-medium">Manuale d'Uso</label>
                            <textarea name="manualInfo" value={formData.manualInfo} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
                        </div>
                    </div>
                </fieldset>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-xl font-bold px-2">Prezzi e Valuta</legend>
                        <div className="space-y-4 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">Prezzo Base (1x)</label>
                                    <div className="flex items-center">
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={formData.price} 
                                            onChange={handleChange} 
                                            className="w-full p-2 border rounded-l-md" 
                                            step="0.01" 
                                        />
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={(e) => setFormData(prev => ({...prev, currency: e.target.value}))}
                                            className="p-2 border-t border-b border-r rounded-r-md bg-gray-50 focus:outline-none focus:ring-mango-orange focus:border-mango-orange"
                                        >
                                            <option value="EUR">EUR (€)</option>
                                            <option value="PLN">PLN (zł)</option>
                                            <option value="CZK">CZK (Kč)</option>
                                            <option value="RON">RON (lei)</option>
                                            <option value="USD">USD ($)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-medium">Prezzo Originale (sbarrato)</label>
                                    <input type="number" name="originalPrice" value={formData.originalPrice || ''} onChange={handleChange} className="w-full p-2 border rounded" step="0.01" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">Colore Prezzo Base</label>
                                    <input type="color" name="priceColor" value={formData.priceColor || '#1a1a1a'} onChange={handleChange} className="w-full h-10 p-1 border rounded" />
                                </div>
                                <div>
                                    <label className="block font-medium">Colore Prezzo Originale</label>
                                    <input type="color" name="originalPriceColor" value={formData.originalPriceColor || '#9ca3af'} onChange={handleChange} className="w-full h-10 p-1 border rounded" />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="border p-4 rounded-md">
                    <legend className="text-xl font-bold px-2">Offerte Speciali (Varianti Quantità)</legend>
                    <div className="flex items-center mt-2 mb-4">
                        <input 
                        type="checkbox"
                        id="hasVariations"
                        className="h-4 w-4 text-mango-orange rounded focus:ring-mango-orange"
                        checked={formData.hasQuantityVariations}
                        onChange={e => setFormData(prev => ({...prev, hasQuantityVariations: e.target.checked}))}
                        />
                        <label htmlFor="hasVariations" className="ml-2 font-medium">Abilita varianti di quantità</label>
                    </div>

                    {formData.hasQuantityVariations && (
                        <div className="space-y-3">
                        {formData.quantityVariations.map((variation, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 p-2 border rounded bg-gray-50">
                            <input type="number" placeholder="Quantità" value={variation.quantity} onChange={e => handleVariationChange(index, 'quantity', e.target.value)} className="p-2 border rounded w-full" />
                            <input type="number" step="0.01" placeholder="Prezzo Totale" value={variation.price} onChange={e => handleVariationChange(index, 'price', e.target.value)} className="p-2 border rounded w-full" />
                            <input type="text" placeholder="Badge (es. PIÙ VENDUTO)" value={variation.badge || ''} onChange={e => handleVariationChange(index, 'badge', e.target.value)} className="p-2 border rounded w-full md:col-span-1" />
                            <button onClick={() => removeVariation(index)} className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600">Elimina</button>
                            </div>
                        ))}
                        <button onClick={addVariation} className="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 text-sm">Aggiungi Variante</button>
                        </div>
                    )}
                    </fieldset>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-xl font-bold px-2">Barra di Scarsità</legend>
                        <div className="space-y-4 mt-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="scarcity.enabled"
                                    checked={formData.scarcity.enabled}
                                    onChange={handleScarcityChange}
                                    id="scarcityEnabled"
                                    className="h-4 w-4 rounded text-mango-orange focus:ring-mango-orange"
                                />
                                <label htmlFor="scarcityEnabled" className="ml-2 font-medium">Abilita Barra di Scarsità</label>
                            </div>
                            {formData.scarcity.enabled && (
                                <div className="space-y-4 pl-6 border-l-2 border-mango-orange ml-2">
                                    <div>
                                        <label className="block font-medium">Testo della Barra</label>
                                        <input type="text" name="scarcity.text" value={formData.scarcity.text} onChange={handleScarcityChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-medium">Scorte Iniziali</label>
                                            <input type="number" name="scarcity.initialStock" value={formData.scarcity.initialStock} onChange={handleScarcityChange} className="w-full p-2 border rounded" />
                                        </div>
                                        <div>
                                            <label className="block font-medium">Scorte Attuali</label>
                                            <input type="number" name="scarcity.currentStock" value={formData.scarcity.currentStock} onChange={handleScarcityChange} className="w-full p-2 border rounded" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </fieldset>
                
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-xl font-bold px-2">Impostazioni Avanzate</legend>
                        <div className="space-y-6 mt-2">
                            <div>
                                <label className="block font-medium">Script HTML del Pixel di Facebook</label>
                                <textarea name="facebookPixelHtml" value={formData.facebookPixelHtml || ''} onChange={handleChange} className="w-full p-2 border rounded font-mono text-sm bg-gray-50" rows={8} placeholder="<!-- Facebook Pixel Code --> ... </script>"></textarea>
                            </div>
                            <div>
                                <label className="block font-medium">Script HTML del Pixel di TikTok</label>
                                <textarea name="tiktokPixelHtml" value={formData.tiktokPixelHtml || ''} onChange={handleChange} className="w-full p-2 border rounded font-mono text-sm bg-gray-50" rows={8} placeholder="<!-- TikTok Pixel Code --> ... </script>"></textarea>
                            </div>
                            <div>
                                <label className="block font-medium">URL Webhook</label>
                                <p className="text-sm text-gray-600 mt-1 mb-2">Questo URL verrà usato per inviare i dati dell'ordine per questo specifico prodotto. Se lasciato vuoto, verrà utilizzato il webhook di default del sito.</p>
                                <input type="text" name="webhookUrl" value={formData.webhookUrl || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://tuo-servizio.com/api/nuovo-ordine" />
                            </div>
                            <div>
                                <label className="block font-medium">URL Pagina di Ringraziamento Personalizzata</label>
                                <input type="text" name="thankYouPageUrl" value={formData.thankYouPageUrl || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://pagina-esterna.com/grazie" />
                            </div>
                            <div className="border-t pt-6">
                                <label className="block font-medium">HTML Formulario di Checkout</label>
                                <p className="text-sm text-gray-600 mt-1 mb-2">Lascia vuoto per usare il form di default del sito.</p>
                                <textarea 
                                        name="checkoutFormHtml" 
                                        value={formData.checkoutFormHtml} 
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded font-mono text-sm bg-gray-50 placeholder:text-gray-400 placeholder:opacity-70"
                                        rows={10}
                                        placeholder={siteData.defaultCheckoutFormHtml}
                                    />
                            </div>
                             <div className="border-t pt-6">
                                <label className="block font-medium">CSS Personalizzato per il Formulario</label>
                                <p className="text-sm text-gray-600 mt-1 mb-2">Aggiungi qui il tuo CSS. Verrà applicato solo alla pagina di checkout per questo prodotto.</p>
                                <textarea
                                    name="checkoutFormCss"
                                    value={formData.checkoutFormCss || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
                                    rows={10}
                                    placeholder={`/* Esempio: */\n\n#fullName {\n  border-color: blue;\n}`}
                                />
                            </div>
                        </div>
                    </fieldset>
                    
                    <fieldset className="border p-4 rounded-md">
                      <legend className="text-xl font-bold px-2">Gestione Recensioni</legend>
                      <div className="space-y-4 mt-2">
                          {formData.reviews.map(review => (
                              <div key={review.id} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                                  <div>
                                      <p className="font-semibold">{review.title}</p>
                                      <p className="text-sm text-gray-600">{review.customerName} - {"⭐".repeat(review.rating)}</p>
                                  </div>
                                  <div>
                                      <button onClick={() => setEditingReview(review)} className="text-indigo-600 hover:text-indigo-900 mr-4 text-sm">Modifica</button>
                                      <button onClick={() => handleDeleteReview(review.id)} className="text-red-600 hover:text-red-900 text-sm">Elimina</button>
                                  </div>
                              </div>
                          ))}
                            {formData.reviews.length === 0 && <p className="text-sm text-gray-500">Nessuna recensione per questo prodotto.</p>}
                      </div>
                      <button onClick={handleAddNewReview} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm">Aggiungi Recensione</button>
                    </fieldset>
                </div>
              )}
            </div>

            <StepNavigation />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductEditPage;