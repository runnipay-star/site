// Fix: Created the main App component, managed state, and handled view routing.
// Fix: Imported useState and useEffect from React to resolve missing name errors.
// Fix: Corrected the React import statement to include useState and useEffect, resolving multiple downstream type errors.
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ValueProps from './components/ValueProps';
import Newsletter from './components/Newsletter';
import AdminPanel from './components/AdminPanel';
import SiteCustomizationPanel from './components/SiteCustomizationPanel';
import SiteManagementPanel from './components/SiteManagementPanel';
import PromoBanner from './components/PromoBanner';
import LoginPage from './components/LoginPage'; 
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import ThankYouPage from './components/ThankYouPage';
import ProductEditPage from './components/ProductEditPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import CookiePolicyPage from './components/CookiePolicyPage';
import TermsAndConditionsPage from './components/TermsAndConditionsPage';
import CheckoutModal from './components/CheckoutModal';
import AdminLayout from './components/AdminLayout';
import ThankYouSettingsPage from './components/ThankYouSettingsPage';
import PixelInjector from './components/PixelInjector';
import { View, Product, SiteData, FaqItem, QuantityVariation, CheckoutDetails, ThankYouPageData, SiteConfiguration, Category } from './types';
import { INITIAL_SITE_DATA } from './constants';
import { supabase, productToCamelCase, productToSnakeCase } from './supabaseClient';
import { languages, Language, getTranslations } from './languages';

// Simple page components
const HomePage: React.FC<{ siteData: SiteData; products: Product[]; setView: (view: View) => void; onProductSelect: (id: string) => void; t: (key: string) => string; }> = ({ siteData, products, setView, onProductSelect, t }) => (
    <>
        <Hero {...siteData.hero} t={t} />
        <ValueProps items={siteData.valueProps} t={t} />
        <ProductGrid title={siteData.featuredProductsTitle} products={products} onProductSelect={onProductSelect} t={t} />
        {siteData.promoBanner.enabled && <PromoBanner bannerData={siteData.promoBanner} setView={setView} t={t} />}
        <Newsletter {...siteData.newsletter} t={t} />
    </>
);

const ShopPage: React.FC<{ products: Product[]; onProductSelect: (id: string) => void; t: (key: string) => string; }> = ({ products, onProductSelect, t }) => (
    <div className="py-12">
        <ProductGrid title={t('allProducts')} products={products} onProductSelect={onProductSelect} t={t} />
    </div>
);

const AboutPage: React.FC<{ paragraphs: string[]; siteName: { main: string, highlight: string }; t: (key: string) => string; }> = ({ paragraphs, siteName, t }) => (
    <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-8 text-mango-dark">{t('aboutUs')}</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700">
            {paragraphs.map((p, i) => <p key={i}>{p.replace(/HUSITON GADGET/g, `${siteName.main} ${siteName.highlight}`)}</p>)}
        </div>
    </div>
);

const ContactPage: React.FC<{ siteName: { main: string, highlight: string }; t: (key: string) => string; }> = ({ siteName, t }) => (
    <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4 text-mango-dark">{t('contactUs')}</h2>
        <p className="text-lg text-gray-700">{t('contactInfo')} <a href={`mailto:info@${siteName.main.toLowerCase()}${siteName.highlight.toLowerCase()}.com`} className="text-mango-orange hover:underline">{`info@${siteName.main.toLowerCase()}${siteName.highlight.toLowerCase()}.com`}</a>.</p>
    </div>
);

const FaqPage: React.FC<{ items: FaqItem[]; t: (key: string) => string; }> = ({ items, t }) => (
    <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-mango-dark">{t('faqTitle')}</h2>
        <div className="max-w-3xl mx-auto space-y-8">
            {items.map((item, index) => (
                <div key={index}>
                    <h3 className="text-2xl font-semibold mb-2 text-mango-dark">{item.question}</h3>
                    <p className="text-gray-700 text-lg">{item.answer}</p>
                </div>
            ))}
        </div>
    </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteConfigs, setSiteConfigs] = useState<SiteConfiguration[]>([]);
  const [activeSiteConfig, setActiveSiteConfig] = useState<SiteConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(sessionStorage.getItem('isAuthenticated') === 'true');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | 'new' | null>(null);
  const [isTakeoverBypassed, setIsTakeoverBypassed] = useState(false);
  const [editingSiteConfig, setEditingSiteConfig] = useState<SiteConfiguration | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutModalDetails, setCheckoutModalDetails] = useState<CheckoutDetails | null>(null);
  const [language, setLanguage] = useState<Language>('it');

  const t = getTranslations(language);

  const siteData = activeSiteConfig ? activeSiteConfig.data : INITIAL_SITE_DATA;
  
  // Effect to fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(window.location.search);
        const configSlug = params.get('config') || 'default';
        const viewFromUrl = params.get('view') as View;
        
        // Fetch products with their site configuration links
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, product_site_configurations(site_configuration_id)')
          .order('created_at', { ascending: true });
        if (productsError) throw productsError;
        setProducts(productsData.map(p => productToCamelCase(p as any)));
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);

        // Fetch all site configurations for admin panel
        const { data: allConfigsData, error: allConfigsError } = await supabase
          .from('site_configurations')
          .select('*');
        if (allConfigsError) throw allConfigsError;
        setSiteConfigs(allConfigsData as SiteConfiguration[]);
        
        // Fetch active site configuration
        const activeConfig = allConfigsData.find(c => c.slug === configSlug);

        if (activeConfig) {
          const config = activeConfig as SiteConfiguration;
          setActiveSiteConfig(config);
          setLanguage(config.language);
        } else {
          // Fallback to default if slug not found
          const defaultConfig = allConfigsData.find(c => c.slug === 'default');
          if (defaultConfig) {
              const config = defaultConfig as SiteConfiguration;
              setActiveSiteConfig(config);
              setLanguage(config.language);
          } else {
              throw new Error(`Configurazione '${configSlug}' non trovata e nessuna configurazione 'default' di fallback disponibile.`);
          }
        }
        
        if (viewFromUrl) {
            setView(viewFromUrl);
        }

      } catch (err: any) {
        setError("Impossibile caricare i dati dal database. " + err.message);
        console.error("Error fetching data from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Effect to check for takeover bypass URL parameter on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('bypassTakeover') === 'true') {
        setIsTakeoverBypassed(true);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, currentProductId]);

  useEffect(() => {
    if (siteData) {
        document.title = `${siteData.siteName.main} ${siteData.siteName.highlight}`;
    }
  }, [siteData?.siteName]);

  useEffect(() => {
    if (siteData) {
        if (siteData.theme.primaryColor) {
            document.documentElement.style.setProperty('--color-primary', siteData.theme.primaryColor);
        }
        if (siteData.theme.darkColor) {
            document.documentElement.style.setProperty('--color-dark', siteData.theme.darkColor);
        }
    }
  }, [siteData?.theme]);

  const handleLogin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('password')
        .eq('username', user)
        .single();
        
      if (error || !data) {
        console.error('Login error:', error?.message);
        return false;
      }

      if (data.password === pass) {
        setIsAuthenticated(true);
        sessionStorage.setItem('isAuthenticated', 'true');
        setView('admin');
        return true;
      }
    } catch (err: any) {
        console.error("An exception occurred during login:", err.message);
    }
    
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setView('home');
  };
  
  const handleProductSelect = (id: string) => {
    setCurrentProductId(id);
    setView('productDetail');
  };

  const handleAddToCart = (product: Product, variation: QuantityVariation) => {
    setCurrentProductId(product.id); // Ensure current product is set for checkout pixel
    setCheckoutDetails({ product, variation });
    setView('checkout');
  };

  const handleBuyNow = (product: Product, variation: QuantityVariation) => {
    setCurrentProductId(product.id); // Ensure current product is set for modal pixel
    setCheckoutModalDetails({ product, variation });
    setIsCheckoutModalOpen(true);
  };

  const handleOrderSuccess = async (formData: Record<string, any>) => {
    if (!checkoutDetails) return;
    const { product, variation } = checkoutDetails;
  
    // Determine which webhook URL to use. Prioritize product-specific URL.
    const webhookUrlToUse = product.webhookUrl || siteData.defaultWebhookUrl;
  
    // 1. Webhook Logic
    if (webhookUrlToUse) {
      const payload = {
        orderDetails: formData,
        productInfo: {
          id: product.id,
          name: product.name,
          sku: product.id, // Using ID as a stand-in for SKU
        },
        variationInfo: variation,
        timestamp: new Date().toISOString()
      };
      
      try {
        const response = await fetch(webhookUrlToUse, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          console.error('Webhook failed with status:', response.status, await response.text());
        } else {
            console.log('Webhook sent successfully.');
        }
      } catch (error) {
        console.error('Error sending webhook:', error);
      }
    }
  
    // Determine if the product has a custom form to decide on the thank you page
    const hasCustomSettings = product.checkoutFormHtml && product.checkoutFormHtml.trim().length > 0;
    const thankYouPageUrlToUse = hasCustomSettings ? product.thankYouPageUrl : null;
  
    // 2. Thank You Page Logic
    if (thankYouPageUrlToUse) {
      window.location.href = thankYouPageUrlToUse;
    } else {
      setView('thankYou'); // Use the default, site-wide thank you page
    }
  };

  const handleModalOrderSuccess = async (formData: Record<string, any>) => {
    if (!checkoutModalDetails) return;
    const { product, variation } = checkoutModalDetails;

    // Determine which webhook URL to use. Prioritize product-specific URL.
    const webhookUrlToUse = product.webhookUrl || siteData.defaultWebhookUrl;

    if (webhookUrlToUse) {
        const payload = {
            orderDetails: formData,
            productInfo: { id: product.id, name: product.name, sku: product.id },
            variationInfo: variation,
            timestamp: new Date().toISOString()
        };
        try {
            const response = await fetch(webhookUrlToUse, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                console.error('Webhook from modal failed with status:', response.status, await response.text());
            } else {
                console.log('Webhook from modal sent successfully.');
            }
        } catch (error) {
            console.error('Error sending webhook from modal:', error);
        }
    }

    // Close the modal first
    setIsCheckoutModalOpen(false);

    // Thank you page logic remains dependent on custom form settings
    const hasCustomSettings = product.checkoutFormHtml && product.checkoutFormHtml.trim().length > 0;
    const thankYouPageUrlToUse = hasCustomSettings ? product.thankYouPageUrl : null;
    
    if (thankYouPageUrlToUse) {
        window.location.href = thankYouPageUrlToUse;
    } else {
        // For the internal thank you page, we need to pass the details.
        // The ThankYouPage component reads from `checkoutDetails` state.
        setCheckoutDetails(checkoutModalDetails);
        setView('thankYou');
    }
    
    // Clean up modal state
    setCheckoutModalDetails(null);
  };

  const handleNavigate = (newView: View, options?: { bypassTakeover?: boolean }) => {
      // FIX: The previous logic for a hard reload was not consistently working.
      // The root cause is that the `checkoutDetails` state was not being cleared
      // after leaving the thank you page. This new logic explicitly clears the state when navigating away, ensuring a clean slate.
      if (view === 'thankYou') {
          setCheckoutDetails(null);
      }
      if (options?.bypassTakeover) {
          setIsTakeoverBypassed(true);
      }
      setView(newView);
  };
  
  const handleSaveProduct = async (productToSave: Product) => {
    try {
        const { visibleInConfigIds, ...productData } = productToSave;
        
        if (productToSave.id === 'new') {
            // Insert new product
            const { data, error } = await supabase
                .from('products')
                .insert(productToSnakeCase(productData))
                .select()
                .single();

            if (error) throw error;
            const newProduct = productToCamelCase(data as any);
            
            // Link to site configurations
            if (visibleInConfigIds && visibleInConfigIds.length > 0) {
              const links = visibleInConfigIds.map(configId => ({
                  product_id: newProduct.id,
                  site_configuration_id: configId,
              }));
              const { error: linkError } = await supabase.from('product_site_configurations').insert(links);
              if (linkError) throw linkError;
            }

            setProducts(prev => [...prev, { ...newProduct, visibleInConfigIds }]);

        } else {
            // Update existing product
            const { error: updateError } = await supabase
                .from('products')
                .update(productToSnakeCase(productData))
                .eq('id', productToSave.id);

            if (updateError) throw updateError;
            
            // Update links to site configurations (delete all then re-insert)
            const { error: deleteError } = await supabase
                .from('product_site_configurations')
                .delete()
                .eq('product_id', productToSave.id);
            if (deleteError) throw deleteError;

            if (visibleInConfigIds && visibleInConfigIds.length > 0) {
              const links = visibleInConfigIds.map(configId => ({
                  product_id: productToSave.id,
                  site_configuration_id: configId,
              }));
              const { error: insertError } = await supabase.from('product_site_configurations').insert(links);
              if (insertError) throw insertError;
            }

            setProducts(prev => prev.map(p => p.id === productToSave.id ? productToSave : p));
        }
        
        setView('admin');
        setEditingProductId(null);
    } catch (error: any) {
        alert("Errore nel salvataggio del prodotto: " + error.message);
        console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      alert("Errore nell'eliminazione del prodotto: " + error.message);
    }
  };
  
  const handleToggleFeature = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const updatedProduct = { ...product, isFeatured: !product.isFeatured };
    
    const { error } = await supabase
      .from('products')
      .update({ is_featured: updatedProduct.isFeatured })
      .eq('id', id);

    if (error) {
      alert("Errore nell'aggiornamento: " + error.message);
    } else {
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
    }
  };

  const handleUpdateSiteData = async (newConfig: SiteConfiguration) => {
    try {
      const { error } = await supabase
        .from('site_configurations')
        .update({ data: newConfig.data, slug: newConfig.slug, language: newConfig.language })
        .eq('id', newConfig.id);

      if (error) throw error;
      
      const updatedConfigs = siteConfigs.map(c => c.id === newConfig.id ? newConfig : c);
      setSiteConfigs(updatedConfigs);
      
      if(activeSiteConfig && activeSiteConfig.id === newConfig.id) {
          setActiveSiteConfig(newConfig);
      }
      
      alert('Configurazione salvata con successo!');
      
    } catch (error: any) {
      alert('Errore nel salvataggio della configurazione: ' + error.message);
      console.error(error);
    }
  };
  
  const handleLanguageChange = async (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (activeSiteConfig) {
      try {
        const { error } = await supabase
          .from('site_configurations')
          .update({ language: newLanguage })
          .eq('id', activeSiteConfig.id);
        
        if (error) throw error;

        const updatedConfig = { ...activeSiteConfig, language: newLanguage };
        setActiveSiteConfig(updatedConfig);
        setSiteConfigs(prev => prev.map(c => c.id === updatedConfig.id ? updatedConfig : c));
      } catch(error: any) {
        console.error("Failed to save language change:", error.message);
      }
    }
  };
  
  const handleCreateSiteConfig = async (slug: string) => {
      const defaultConfig = siteConfigs.find(c => c.slug === 'default');
      if (!defaultConfig) {
          alert("Configurazione 'default' non trovata. Impossibile creare una nuova configurazione.");
          return;
      }
      
      const newConfigData = {
          ...defaultConfig.data,
          siteName: { main: 'Nuovo', highlight: 'Sito' },
      };
      
      try {
          const { data, error } = await supabase
            .from('site_configurations')
            .insert({ slug, data: newConfigData, language: 'it' })
            .select()
            .single();
          
          if (error) throw error;
          
          setSiteConfigs(prev => [...prev, data as SiteConfiguration]);
          
      } catch (error: any) {
          alert('Errore nella creazione della configurazione: ' + error.message);
      }
  };
  
  const handleDeleteSiteConfig = async (id: string) => {
      try {
          const { error } = await supabase.from('site_configurations').delete().eq('id', id);
          if (error) throw error;
          setSiteConfigs(prev => prev.filter(c => c.id !== id));
      } catch (error: any) {
          alert("Errore nell'eliminazione della configurazione: " + error.message);
      }
  };

  const handleUpdateTakeoverProduct = async (configId: string, productId: string | null) => {
    const configToUpdate = siteConfigs.find(c => c.id === configId);
    if (!configToUpdate) {
        console.error("Configurazione non trovata per l'aggiornamento del takeover.");
        return;
    }

    const newSiteData = { ...configToUpdate.data, homePageProductTakeoverId: productId || '' };
    const newConfig = { ...configToUpdate, data: newSiteData };

    try {
        const { error } = await supabase
            .from('site_configurations')
            .update({ data: newSiteData })
            .eq('id', configId);

        if (error) throw error;

        const updatedConfigs = siteConfigs.map(c => c.id === configId ? newConfig : c);
        setSiteConfigs(updatedConfigs);

        if (activeSiteConfig && activeSiteConfig.id === configId) {
            setActiveSiteConfig(newConfig);
        }
    } catch (error: any) {
        alert("Errore nell'aggiornamento del prodotto in homepage: " + error.message);
        console.error(error);
    }
  };

  const getProductToEdit = (id: string | 'new'): Product => {
    if (id === 'new') {
        const firstCategory = categories.length > 0 ? categories[0].id : null;
        return {
            id: 'new',
            name: 'Nuovo Prodotto',
            description: '<p>Inserisci qui una descrizione accattivante per il tuo prodotto.</p>',
            deliveryInfo: 'Spedizione gratuita 24/48 ore.',
            warrantyInfo: 'Garanzia Soddisfatti o Rimborsati 30 giorni.',
            manualInfo: 'Istruzioni incluse nella confezione.',
            price: 19.99,
            currency: 'EUR',
            imageUrls: ['/images/placeholder.png'],
            reviews: [],
            details: ['Dettaglio 1', 'Dettaglio 2', 'Dettaglio 3'],
            availability: 'Disponibile',
            hasQuantityVariations: false,
            quantityVariations: [],
            checkoutFormHtml: siteData.defaultCheckoutFormHtml || '',
            checkoutFormCss: '',
            visibleInConfigIds: activeSiteConfig ? [activeSiteConfig.id] : [],
            isFeatured: false,
            categoryId: firstCategory,
            scarcity: {
                enabled: false, text: 'Attenzione: scorte in esaurimento!', initialStock: 50, currentStock: 10
            }
        };
    }
    return products.find(p => p.id === id) || getProductToEdit('new'); // Fallback
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">{t('loading')}</div></div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl text-red-600 p-8 bg-red-50 rounded-lg">{error}</div></div>;
  }
  
  if (!activeSiteConfig) {
      return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">{t('siteConfigNotFound')}</div></div>;
  }

  // Determine which products are visible for the current site config
  const visibleProducts = products.filter(p => p.visibleInConfigIds.includes(activeSiteConfig.id));
  const featuredProducts = visibleProducts.filter(p => p.isFeatured);

  // Takeover logic
  const takeoverProductId = siteData.homePageProductTakeoverId;
  const takeoverProduct = takeoverProductId ? products.find(p => p.id === takeoverProductId) : null;
  const showTakeover = takeoverProduct && view === 'home' && !isTakeoverBypassed;


  const renderContent = () => {
    if (showTakeover && takeoverProduct) {
        return (
            <ProductDetailPage 
                product={takeoverProduct} 
                setView={handleNavigate} 
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                siteData={siteData}
                t={t}
            />
        );
    }
    
    switch(view) {
      case 'home': return <HomePage siteData={siteData} products={featuredProducts} setView={handleNavigate} onProductSelect={handleProductSelect} t={t} />;
      case 'shop': return <ShopPage products={visibleProducts} onProductSelect={handleProductSelect} t={t} />;
      case 'about': return <AboutPage paragraphs={siteData.about.paragraphs} siteName={siteData.siteName} t={t} />;
      case 'contact': return <ContactPage siteName={siteData.siteName} t={t} />;
      case 'faq': return <FaqPage items={siteData.faq.items} t={t} />;
      case 'login': return <LoginPage onLogin={handleLogin} t={t} />;
      case 'privacyPolicy': return <PrivacyPolicyPage siteName={siteData.siteName} />;
      case 'cookiePolicy': return <CookiePolicyPage />;
      case 'termsAndConditions': return <TermsAndConditionsPage siteName={siteData.siteName} />;
      case 'productDetail': {
        const product = products.find(p => p.id === currentProductId);
        return product 
            ? <ProductDetailPage 
                product={product} 
                setView={handleNavigate} 
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                siteData={siteData}
                t={t}
              /> 
            : <ShopPage products={visibleProducts} onProductSelect={handleProductSelect} t={t} />;
      }
      case 'checkout': return <CheckoutPage details={checkoutDetails} onOrderSuccess={handleOrderSuccess} setView={handleNavigate} siteData={siteData} t={t} />;
      case 'thankYou': return <ThankYouPage pageData={siteData.thankYouPage} siteData={siteData} checkoutDetails={checkoutDetails} t={t} />;
      case 'thankYouPreview': {
          const previewProduct = products[0] || getProductToEdit('new');
          const previewDetails: CheckoutDetails = {
              product: previewProduct,
              variation: previewProduct.hasQuantityVariations ? previewProduct.quantityVariations[0] : { quantity: 1, price: previewProduct.price }
          };
          if (!products[0]) {
              return <div className="text-center py-10">{t('addProductToPreview')}</div>
          }
          return <ThankYouPage pageData={siteData.thankYouPage} siteData={siteData} checkoutDetails={previewDetails} t={t} />;
      }
      case 'admin':
      case 'siteManagement':
      case 'thankYouSettings':
      case 'customize':
      case 'editProduct':
        if (!isAuthenticated) return <LoginPage onLogin={handleLogin} t={t} />;
        return (
          <AdminLayout activeView={view} setView={setView} onLogout={handleLogout} fullWidth={view === 'editProduct'}>
            {view === 'admin' && <AdminPanel 
              products={products} 
              categories={categories} 
              onDeleteProduct={handleDeleteProduct} 
              onEditProduct={(id) => { setEditingProductId(id); setView('editProduct'); }}
              onAddProduct={() => { setEditingProductId('new'); setView('editProduct'); }}
              onToggleFeature={handleToggleFeature}
            />}
            {view === 'siteManagement' && <SiteManagementPanel configs={siteConfigs} products={products} onEdit={(config) => {setEditingSiteConfig(config); setView('customize')}} onCreate={handleCreateSiteConfig} onDelete={handleDeleteSiteConfig} onUpdateTakeover={handleUpdateTakeoverProduct}/>}
            {view === 'customize' && editingSiteConfig && <SiteCustomizationPanel config={editingSiteConfig} products={products} onUpdateSiteConfig={handleUpdateSiteData} setView={setView} onLogout={handleLogout} />}
            {view === 'editProduct' && editingProductId && (
                <ProductEditPage
                    productToEdit={getProductToEdit(editingProductId)}
                    categories={categories}
                    siteConfigs={siteConfigs}
                    onSave={handleSaveProduct}
                    onCancel={() => { setEditingProductId(null); setView('admin'); }}
                    onCategoryAdded={(newCat) => setCategories(c => [...c, newCat])}
                    siteData={siteData}
                    t={t}
                />
            )}
            {view === 'thankYouSettings' && <ThankYouSettingsPage pageData={siteData.thankYouPage} onUpdate={(data) => handleUpdateSiteData({...activeSiteConfig, data: {...siteData, thankYouPage: data}})} setView={setView} />}
          </AdminLayout>
        );
      default: return <HomePage siteData={siteData} products={featuredProducts} setView={handleNavigate} onProductSelect={handleProductSelect} t={t} />;
    }
  };

  const productForPixel = currentProductId ? products.find(p => p.id === currentProductId) : null;

  return (
    <div className="flex flex-col min-h-screen bg-mango-light">
      <PixelInjector 
          facebookPixelHtml={siteData.tracking.facebookPixelHtml}
          tiktokPixelHtml={siteData.tracking.tiktokPixelHtml}
      />
      {view === 'thankYou' && 
        <PixelInjector 
          facebookPixelHtml={siteData.thankYouPage.facebookPixelHtml}
          tiktokPixelHtml={siteData.thankYouPage.tiktokPixelHtml}
        />
      }
      {productForPixel && 
        <PixelInjector 
          facebookPixelHtml={productForPixel.facebookPixelHtml}
          tiktokPixelHtml={productForPixel.tiktokPixelHtml}
        />
      }
      
      {isCheckoutModalOpen && checkoutModalDetails && (
        <CheckoutModal 
            details={checkoutModalDetails}
            onClose={() => setIsCheckoutModalOpen(false)}
            onOrderSuccess={handleModalOrderSuccess}
            siteData={siteData}
            t={t}
        />
      )}
      
      {!showTakeover && <Header setView={handleNavigate} isAuthenticated={isAuthenticated} siteName={siteData.siteName} t={t} setLanguage={handleLanguageChange} currentLanguage={language} />}
      <main className="flex-grow">
          {renderContent()}
      </main>
      {!showTakeover && <Footer setView={handleNavigate} isAuthenticated={isAuthenticated} siteName={siteData.siteName} t={t} />}
    </div>
  );
};

export default App;