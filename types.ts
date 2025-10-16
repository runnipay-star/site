// Fix: Defined all the necessary type interfaces and type aliases for the application.
import { Language } from './languages';

export type View = 'home' | 'shop' | 'about' | 'contact' | 'faq' | 'login' | 'admin' | 'customize' | 'productDetail' | 'checkout' | 'thankYou' | 'editProduct' | 'thankYouSettings' | 'privacyPolicy' | 'cookiePolicy' | 'termsAndConditions' | 'siteManagement' | 'thankYouPreview';

export interface QuantityVariation {
  quantity: number;
  price: number;
  badge?: string;
}

export interface CheckoutDetails {
  product: Product;
  variation: QuantityVariation;
}

export interface Review {
  id: string;
  customerName: string;
  customerImageUrl?: string;
  showCustomerImage: boolean;
  date: string; // "YYYY-MM-DD"
  rating: number; // 1-5
  title: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Category {
  id: string;
  name: string;
}

export interface ScarcityData {
  enabled: boolean;
  text: string;
  initialStock: number;
  currentStock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  customHtmlBeforeImage?: string;
  deliveryInfo: string;
  warrantyInfo: string;
  manualInfo: string;
  price: number;
  currency: string;
  originalPrice?: number;
  priceColor?: string;
  originalPriceColor?: string;
  imageUrls: string[];
  reviews: Review[];
  details: string[];
  availability: string;
  hasQuantityVariations: boolean;
  quantityVariations: QuantityVariation[];
  checkoutFormHtml: string;
  checkoutFormCss: string;
  visibleInConfigIds: string[];
  isFeatured: boolean;
  categoryId: string | null;
  facebookPixelHtml?: string;
  tiktokPixelHtml?: string;
  webhookUrl?: string;
  thankYouPageUrl?: string;
  scarcity: ScarcityData;
}

export type IconName = 'Truck' | 'ShieldCheck' | 'ChatBubble' | 'CheckCircle';

export interface ValueProp {
  icon: IconName;
  title: string;
  description: string;
}

export interface PromoBannerData {
  enabled: boolean;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: View | string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface ThankYouPageData {
    title: string;
    message: string;
    facebookPixelHtml: string;
    tiktokPixelHtml: string;
}

export interface TrackingSettings {
    facebookPixelHtml: string;
    tiktokPixelHtml: string;
}

export interface SiteData {
  siteName: {
    main: string;
    highlight: string;
  };
  theme: {
    primaryColor: string;
    darkColor: string;
  };
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  valueProps: ValueProp[];
  featuredProductsTitle: string;
  promoBanner: PromoBannerData;
  newsletter: {
    title:string;
    description: string;
  };
  about: {
    paragraphs: string[];
  };
  faq: {
    items: FaqItem[];
  };
  thankYouPage: ThankYouPageData;
  homePageProductTakeoverId: string;
  tracking: TrackingSettings;
  defaultCheckoutFormHtml: string;
  defaultWebhookUrl: string;
}

export interface SiteConfiguration {
  id: string;
  slug: string;
  data: SiteData;
  language: Language;
}