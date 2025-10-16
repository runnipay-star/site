import React, { useState, useEffect, useRef } from 'react';
import { Product, View, QuantityVariation, Review, SiteData, ScarcityData } from '../types';
import { StarIcon, CheckBadgeIcon, CalendarIcon, CartIcon, LightningBoltIcon } from './icons';

declare global {
  interface Window {
    fbq: any;
    ttq: any;
  }
}

interface ProductDetailPageProps {
  product: Product;
  setView: (view: View) => void;
  onAddToCart: (product: Product, variation: QuantityVariation) => void;
  onBuyNow: (product: Product, variation: QuantityVariation) => void;
  siteData: SiteData;
  t: (key: string) => string;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 text-yellow-400" filled={i < rating} />
        ))}
    </div>
);

const ReviewCard: React.FC<{ review: Review; t: (key: string) => string; }> = ({ review, t }) => (
    <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-start mb-4">
            {review.showCustomerImage && review.customerImageUrl ? (
                <img src={review.customerImageUrl} alt={review.customerName} className="w-12 h-12 rounded-full mr-4 object-cover" />
            ) : (
                <div className="w-12 h-12 rounded-full mr-4 bg-gray-200 flex items-center justify-center font-bold text-mango-dark">
                    {review.customerName.charAt(0)}
                </div>
            )}
            <div>
                <p className="font-bold text-mango-dark">{review.customerName}</p>
                <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{new Date(review.date).toLocaleDateString('it-IT')}</span>
                    <CheckBadgeIcon className="w-4 h-4 ml-2 text-green-500" />
                    <span className="ml-1">{t('verifiedBuyer')}</span>
                </div>
            </div>
        </div>
        <RatingStars rating={review.rating} />
        <h4 className="font-bold text-lg mt-3 mb-1">{review.title}</h4>
        <p className="text-gray-700">{review.text}</p>
        {review.mediaUrl && review.mediaType === 'image' && (
            <img src={review.mediaUrl} alt="Review media" className="mt-4 rounded-lg max-w-xs" />
        )}
        {review.mediaUrl && review.mediaType === 'video' && (
            <video src={review.mediaUrl} controls className="mt-4 rounded-lg max-w-xs" />
        )}
    </div>
);

const ScarcityBar: React.FC<{ scarcity: ScarcityData; t: (key: string) => string; }> = ({ scarcity, t }) => {
    if (!scarcity.enabled || scarcity.currentStock <= 0 || scarcity.initialStock <= 0) {
        return null;
    }

    const percentage = Math.max(0, Math.min(100, (scarcity.currentStock / scarcity.initialStock) * 100));
    
    const barColorClass = percentage < 25 ? 'bg-red-500' : 'bg-orange-500';

    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 my-4">
            <div className="flex justify-between items-center text-sm mb-1">
                <p className="font-semibold text-mango-dark">{scarcity.text}</p>
                <p className="text-gray-600">
                    {t('remaining')}: <span className="font-bold text-mango-dark">{scarcity.currentStock}</span>
                </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, setView, onAddToCart, onBuyNow, siteData, t }) => {
    const [selectedImage, setSelectedImage] = useState(product.imageUrls[0]);
    const defaultVariation = product.hasQuantityVariations 
        ? product.quantityVariations[0] 
        : { quantity: 1, price: product.price };
    const [selectedVariation, setSelectedVariation] = useState<QuantityVariation>(defaultVariation);
    const [activeTab, setActiveTab] = useState('description');
    
    const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    // Refs and handlers for image swipe gesture
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const minSwipeDistance = 50;

    const findCurrentImageIndex = () => product.imageUrls.indexOf(selectedImage);

    const goToNextImage = () => {
        const currentIndex = findCurrentImageIndex();
        const nextIndex = (currentIndex + 1) % product.imageUrls.length;
        setSelectedImage(product.imageUrls[nextIndex]);
    };

    const goToPrevImage = () => {
        const currentIndex = findCurrentImageIndex();
        const prevIndex = (currentIndex - 1 + product.imageUrls.length) % product.imageUrls.length;
        setSelectedImage(product.imageUrls[prevIndex]);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = 0; // Reset end position
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === 0 || touchEndX.current === 0) return;
        const distance = touchStartX.current - touchEndX.current;

        if (distance > minSwipeDistance) {
            goToNextImage();
        } else if (distance < -minSwipeDistance) {
            goToPrevImage();
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    };


    const handleAddToCartClick = () => {
        onAddToCart(product, selectedVariation);
    };
    
    const handleBuyNowClick = () => {
        onBuyNow(product, selectedVariation);
    };
    
    type TabName = 'description' | 'delivery' | 'warranty' | 'manual';
    const tabButtonClasses = (tabName: TabName) => `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors duration-200
        ${activeTab === tabName 
            ? 'border-mango-orange text-mango-orange' 
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`;

    const getCurrencySymbol = (currencyCode: string) => {
        const symbols: { [key: string]: string } = { 'EUR': '€', 'PLN': 'zł', 'CZK': 'Kč', 'RON': 'lei', 'USD': '$' };
        return symbols[currencyCode] || currencyCode;
    };

    const currencySymbol = getCurrencySymbol(product.currency);

    return (
        <>
            <div className="container mx-auto px-6 py-12">
                <button onClick={() => setView('shop')} className="text-mango-orange mb-6 hover:underline">&larr; {t('backToShop')}</button>
                
                {product.customHtmlBeforeImage && (
                  <div
                    className="prose lg:prose-xl max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: product.customHtmlBeforeImage }}
                  />
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="relative">
                        <div
                            className="relative group aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg mb-4 shadow-lg swipe-container"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <img key={selectedImage} src={selectedImage} alt={product.name} className="w-full h-full object-cover object-center image-fade-in" />
                            
                            {/* Desktop Navigation Arrows */}
                            <button
                                onClick={goToPrevImage}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/60 p-2 rounded-full text-mango-dark hover:bg-white focus:outline-none transition-all opacity-0 group-hover:opacity-100 lg:block hidden"
                                aria-label={t('previousImage')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={goToNextImage}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/60 p-2 rounded-full text-mango-dark hover:bg-white focus:outline-none transition-all opacity-0 group-hover:opacity-100 lg:block hidden"
                                aria-label={t('nextImage')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
                            {product.imageUrls.map(url => (
                                <button key={url} onClick={() => setSelectedImage(url)} className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === url ? 'border-mango-orange' : 'border-transparent'}`}>
                                    <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-mango-dark tracking-tight mb-2 mt-12 lg:mt-0">{product.name}</h1>
                        <div className="flex items-baseline space-x-3 mb-4">
                            <span 
                            className="text-3xl font-bold" 
                            style={{ color: product.priceColor || 'var(--color-dark)' }}
                            >
                            {currencySymbol}{selectedVariation.price.toFixed(2)}
                            </span>
                            {product.hasQuantityVariations ? null : product.originalPrice && (
                                <span 
                                className="text-xl line-through" 
                                style={{ color: product.originalPriceColor || '#9ca3af' }}
                                >
                                {currencySymbol}{product.originalPrice.toFixed(2)}
                                </span>
                            )}
                            {discountPercent > 0 && !product.hasQuantityVariations && (
                                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">-{discountPercent}%</span>
                            )}
                        </div>
                        <p className="text-gray-700 mb-6">{product.details.join(' - ')}</p>
                        
                        {/* Scarcity Bar */}
                        <ScarcityBar scarcity={product.scarcity} t={t} />
                        
                        {/* Quantity Variations */}
                        {product.hasQuantityVariations && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-lg mb-3">{t('chooseQuantity')}:</h3>
                                <div className="space-y-3">
                                    {product.quantityVariations.map(variation => (
                                        <button 
                                            key={variation.quantity} 
                                            onClick={() => setSelectedVariation(variation)}
                                            className={`w-full text-left p-4 border-2 rounded-lg flex justify-between items-center transition-all ${selectedVariation.quantity === variation.quantity ? 'border-mango-orange bg-orange-50 shadow-md' : 'border-gray-300 hover:border-mango-orange'}`}
                                        >
                                            <div>
                                                <p className="font-bold">{variation.quantity}x Cover</p>
                                                <p className="text-sm text-gray-600">{currencySymbol}{(variation.price / variation.quantity).toFixed(2)} {t('perCover')}</p>
                                            </div>
                                            <div className="flex items-center">
                                                {variation.badge && (
                                                    <span className="bg-mango-orange text-white text-xs font-bold px-2 py-1 rounded-full mr-4">{variation.badge}</span>
                                                )}
                                                <p className="font-bold text-lg">{currencySymbol}{variation.price.toFixed(2)}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button 
                                onClick={handleAddToCartClick}
                                className="w-full btn-animated-gradient"
                            >
                                <CartIcon className="h-6 w-6" />
                                <span>{t('addToCart')}</span>
                            </button>
                             <button 
                                onClick={handleBuyNowClick}
                                className="w-full btn-animated-gradient"
                            >
                                <LightningBoltIcon className="h-6 w-6" />
                                <span>{t('buyNow')}</span>
                            </button>
                        </div>
                        
                    </div>

                    {/* Wrapper for bottom content */}
                    <div className="lg:col-span-2">
                        {/* Information Tabs */}
                        <div className="mt-16">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('description')} className={tabButtonClasses('description')}>{t('description')}</button>
                                    <button onClick={() => setActiveTab('delivery')} className={tabButtonClasses('delivery')}>{t('delivery')}</button>
                                    <button onClick={() => setActiveTab('warranty')} className={tabButtonClasses('warranty')}>{t('warranty')}</button>
                                    <button onClick={() => setActiveTab('manual')} className={tabButtonClasses('manual')}>{t('manual')}</button>
                                </nav>
                            </div>
                            <div className="mt-6 text-gray-700 space-y-4">
                                {activeTab === 'description' && <div dangerouslySetInnerHTML={{ __html: product.description }} />}
                                {activeTab === 'delivery' && <p>{product.deliveryInfo}</p>}
                                {activeTab === 'warranty' && <p>{product.warrantyInfo}</p>}
                                {activeTab === 'manual' && <p>{product.manualInfo}</p>}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        {product.reviews && product.reviews.length > 0 && (
                            <div className="mt-16">
                                <h2 className="text-3xl font-bold text-center mb-10 text-mango-dark border-t pt-10">{t('customerReviews')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {product.reviews.map(review => (
                                        <ReviewCard key={review.id} review={review} t={t} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailPage;