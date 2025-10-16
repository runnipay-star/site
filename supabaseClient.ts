

import { createClient } from '@supabase/supabase-js';
import { Product, QuantityVariation, Review, SiteData, Category, ScarcityData, SiteConfiguration } from './types';
// Fix: Import 'Language' directly from its source file to resolve the module export error.
import { Language } from './languages';

type ProductRow = {
  id: string;
  created_at: string;
  name: string;
  description: string;
  custom_html_before_image: string | null;
  delivery_info: string;
  warranty_info: string;
  manual_info: string;
  price: number;
  currency: string | null;
  original_price: number | null;
  price_color: string | null;
  original_price_color: string | null;
  image_urls: string[] | null;
  reviews: Review[] | null;
  details: string[] | null;
  availability: string;
  has_quantity_variations: boolean;
  quantity_variations: QuantityVariation[] | null;
  checkout_form_html: string;
  checkout_form_css: string | null;
  is_featured: boolean;
  category_id: string | null;
  facebook_pixel_html: string | null;
  tiktok_pixel_html: string | null;
  webhook_url: string | null;
  thank_you_page_url: string | null;
  scarcity: ScarcityData | null;
  product_site_configurations: { site_configuration_id: string }[] | null;
};

// FIX: Added CategoryRow to accurately represent the database table, including the default `created_at` field.
// This fixes a type inference issue with Supabase when retrieving an inserted row.
type CategoryRow = {
  id: string;
  name: string;
  created_at: string;
};

type SiteConfigurationRow = {
    id: string;
    slug: string;
    data: SiteData;
    updated_at: string;
    language: string;
};


// Dichiarazione del tipo per il database, anche se semplice, aiuta con l'autocompletamento
export type Database = {
  public: {
    Tables: {
      // Fix: Explicitly defined Insert and Update types to prevent Supabase from inferring them as 'never', which was causing all database mutation errors.
      products: {
        Row: Omit<ProductRow, 'product_site_configurations'>;
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'product_site_configurations'>;
        // FIX: Corrected the Update type to also omit 'created_at', which is a common source of type mismatches and errors with Supabase.
        Update: Partial<Omit<ProductRow, 'id' | 'created_at' | 'product_site_configurations'>>;
      };
      categories: {
        // FIX: Changed Row type from Category to CategoryRow to match the actual database schema.
        Row: CategoryRow;
        Insert: { name: string };
        Update: Partial<{ name: string }>;
      };
      site_configurations: {
        Row: SiteConfigurationRow;
        Insert: { slug: string; data: SiteData; language: string; };
        Update: Partial<{ slug: string; data: SiteData; language: string; }>;
      };
      admin_credentials: {
        Row: { username: string; password: string };
        Insert: { username: string; password: string };
        Update: Partial<{ username: string; password: string }>;
      };
      product_site_configurations: {
        Row: { product_id: string; site_configuration_id: string; };
        Insert: { product_id: string; site_configuration_id: string; };
        Update: never;
      }
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};

const supabaseUrl = 'https://wrmapnfqybltrntisegh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybWFwbmZxeWJsdHJudGlzZWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MzI5ODAsImV4cCI6MjA3NjAwODk4MH0.Cgn2QoHZIy5lf1KKGjPXZTLEVCHBGYxvxCRSpdYDATs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Funzioni helper per mappare i nomi tra snake_case (DB) e camelCase (JS)

export const productToCamelCase = (dbProduct: ProductRow): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  customHtmlBeforeImage: dbProduct.custom_html_before_image ?? undefined,
  deliveryInfo: dbProduct.delivery_info,
  warrantyInfo: dbProduct.warranty_info,
  manualInfo: dbProduct.manual_info,
  price: dbProduct.price,
  currency: dbProduct.currency ?? 'EUR',
  originalPrice: dbProduct.original_price ?? undefined,
  priceColor: dbProduct.price_color ?? undefined,
  originalPriceColor: dbProduct.original_price_color ?? undefined,
  imageUrls: dbProduct.image_urls ?? [],
  reviews: dbProduct.reviews ?? [],
  details: dbProduct.details ?? [],
  availability: dbProduct.availability,
  hasQuantityVariations: dbProduct.has_quantity_variations,
  quantityVariations: dbProduct.quantity_variations ?? [],
  checkoutFormHtml: dbProduct.checkout_form_html,
  checkoutFormCss: dbProduct.checkout_form_css ?? '',
  visibleInConfigIds: dbProduct.product_site_configurations?.map(link => link.site_configuration_id) ?? [],
  isFeatured: dbProduct.is_featured,
  categoryId: dbProduct.category_id,
  facebookPixelHtml: dbProduct.facebook_pixel_html ?? undefined,
  tiktokPixelHtml: dbProduct.tiktok_pixel_html ?? undefined,
  webhookUrl: dbProduct.webhook_url ?? undefined,
  thankYouPageUrl: dbProduct.thank_you_page_url ?? undefined,
  scarcity: dbProduct.scarcity ?? {
    enabled: false,
    text: 'Attenzione: scorte in esaurimento!',
    initialStock: 50,
    currentStock: 10,
  },
});


// Fix: Removed explicit return type to allow TypeScript to infer it. This ensures compatibility with the Insert type inferred by Supabase.
export const productToSnakeCase = (product: Omit<Product, 'visibleInConfigIds'>) => {
    // Rimuovi l'ID per le operazioni di inserimento/aggiornamento dove non è necessario o è immutabile
    const { id, ...rest } = product;
    return {
        name: rest.name,
        description: rest.description,
        custom_html_before_image: rest.customHtmlBeforeImage ?? null,
        delivery_info: rest.deliveryInfo,
        warranty_info: rest.warrantyInfo,
        manual_info: rest.manualInfo,
        price: rest.price,
        currency: rest.currency,
        original_price: rest.originalPrice ?? null,
        price_color: rest.priceColor ?? null,
        original_price_color: rest.originalPriceColor ?? null,
        image_urls: rest.imageUrls,
        reviews: rest.reviews,
        details: rest.details,
        availability: rest.availability,
        has_quantity_variations: rest.hasQuantityVariations,
        quantity_variations: rest.quantityVariations,
        checkout_form_html: rest.checkoutFormHtml,
        checkout_form_css: rest.checkoutFormCss ?? null,
        is_featured: rest.isFeatured,
        category_id: rest.categoryId,
        facebook_pixel_html: rest.facebookPixelHtml ?? null,
        tiktok_pixel_html: rest.tiktokPixelHtml ?? null,
        webhook_url: rest.webhookUrl ?? null,
        thank_you_page_url: rest.thankYouPageUrl ?? null,
        scarcity: rest.scarcity ?? null,
    };
};