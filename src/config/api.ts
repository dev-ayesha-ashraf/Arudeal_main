export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  // TIMEOUT: 10000,
  ENDPOINTS: {
    PRODUCTS: {
      FEATURED: "/featured-products",
      BY_CATEGORY: "/products/category",
      SEARCH: "/products/search",
      DETAILS: "/products",
    },
    FEATURED_PRODUCTS: {
      BASE: "/featured-products",
      LIST: "/featured-products",
      CREATE: "/featured-products",
      UPDATE: "/featured-products",
      DELETE: "/featured-products",
      BULK_DELETE: "/featured-products/bulk-delete",
      BULK_UPDATE: "/featured-products/bulk-update",
      REORDER: "/featured-products/reorder",
      METRICS: "/featured-products/analytics/metrics",
      ANALYTICS: "/featured-products/{id}/analytics",
      PUBLIC: "/featured-products/public",
    },
    CATEGORIES: "/categories",
    CATEGORIES_ENHANCED: "/categories-enhanced",
    BANNERS: {
      BASE: "/banners",
      LIST: "/banners",
      CREATE: "/banners",
      UPDATE: "/banners",
      DELETE: "/banners",
      PUBLIC_ACTIVE: "/banners/public/active",
      ORDER: "/banners/order",
      METRICS: "/banners/metrics",
    },
    HERO_SLIDES: "/hero-slides",
    LISTINGS: {
      BASE: "/listings",
      LIST: "/listings",
      CREATE: "/listings",
      UPDATE: "/listings",
      DELETE: "/listings",
      BY_CATEGORY: "/listings/category",
    },
    SELLERS: {
      BASE: "/sellers",
      LIST: "/sellers",
      CREATE: "/sellers",
      UPDATE: "/sellers",
      DELETE: "/sellers",
    },
    UPLOADS: {
      BASE: "/uploads",
      UPLOAD: "/uploads",
      FILES: "/files",
      CHECK: "/files/{filename}/check",
    },
    ANALYTICS: {
      BANNER_CLICK: "/analytics/banner-click",
      BANNER_IMPRESSION: "/analytics/banner-impression",
      PRODUCT_CLICK: "/analytics/product-click",
      PRODUCT_IMPRESSION: "/analytics/product-impression",
    },
    SYSTEM: {
      HEALTH: "/health",
      STATUS: "/status",
      SUMMARY: "/summary",
    },
  },
} as const;

export const API_KEYS = {
  API_KEY: import.meta.env.VITE_API_KEY,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
} as const;

export const APP_CONFIG = {
  NODE_ENV: import.meta.env.MODE, // 'development' | 'production'
  DEV: import.meta.env.DEV, // boolean
  PROD: import.meta.env.PROD, // boolean

  // Featured Products Configuration
  FEATURED_PRODUCTS: {
    MAX_DISPLAY_COUNT: 12,
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
    AUTO_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  },

  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    DIRECTORIES: {
      FEATURED_PRODUCTS: "featured-products",
      BANNERS: "banners",
      CATEGORIES: "categories",
      PRODUCTS: "products",
      LISTINGS: "listings",
    },
  },

  // Analytics Configuration
  ANALYTICS: {
    TRACK_IMPRESSIONS: true,
    TRACK_CLICKS: true,
    BATCH_SIZE: 10,
    FLUSH_INTERVAL: 30000, // 30 seconds
  },

  // UI Configuration
  UI: {
    SIDEBAR_COLLAPSED_WIDTH: 80,
    SIDEBAR_EXPANDED_WIDTH: 256,
    DEFAULT_ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
  },
} as const;

// Helper functions for endpoint building
export const buildEndpoint = {
  featuredProduct: (id?: string) =>
    id
      ? `${API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS.BASE}/${id}`
      : API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS.BASE,

  featuredProductAnalytics: (id: string) =>
    API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS.ANALYTICS.replace("{id}", id),

  banner: (id?: string) =>
    id
      ? `${API_CONFIG.ENDPOINTS.BANNERS.BASE}/${id}`
      : API_CONFIG.ENDPOINTS.BANNERS.BASE,

  listing: (id?: string) =>
    id
      ? `${API_CONFIG.ENDPOINTS.LISTINGS.BASE}/${id}`
      : API_CONFIG.ENDPOINTS.LISTINGS.BASE,

  category: (id?: string) =>
    id
      ? `${API_CONFIG.ENDPOINTS.CATEGORIES_ENHANCED}/${id}`
      : API_CONFIG.ENDPOINTS.CATEGORIES_ENHANCED,

  seller: (id?: string) =>
    id
      ? `${API_CONFIG.ENDPOINTS.SELLERS.BASE}/${id}`
      : API_CONFIG.ENDPOINTS.SELLERS.BASE,

  fileCheck: (filename: string, directory?: string) => {
    const endpoint = API_CONFIG.ENDPOINTS.UPLOADS.CHECK.replace(
      "{filename}",
      filename
    );
    return directory ? `${endpoint}?directory=${directory}` : endpoint;
  },

  uploadToDirectory: (directory: string) =>
    `${API_CONFIG.ENDPOINTS.UPLOADS.UPLOAD}?folderName=${directory}`,
} as const;

// Type definitions for better TypeScript support
export type ApiEndpoints = typeof API_CONFIG.ENDPOINTS;
export type FeaturedProductEndpoints =
  typeof API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS;
export type BannerEndpoints = typeof API_CONFIG.ENDPOINTS.BANNERS;
export type ListingEndpoints = typeof API_CONFIG.ENDPOINTS.LISTINGS;
export type SellerEndpoints = typeof API_CONFIG.ENDPOINTS.SELLERS;
export type UploadEndpoints = typeof API_CONFIG.ENDPOINTS.UPLOADS;
export type AnalyticsEndpoints = typeof API_CONFIG.ENDPOINTS.ANALYTICS;
export type SystemEndpoints = typeof API_CONFIG.ENDPOINTS.SYSTEM;

// Environment validation
export const validateEnvironment = () => {
  const required = ["VITE_API_BASE_URL"];

  const optional = ["VITE_API_KEY", "VITE_CLIENT_ID"];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  const warnings = optional.filter((key) => !import.meta.env[key]);
  if (warnings.length > 0 && APP_CONFIG.DEV) {
    console.warn(
      `Optional environment variables not set: ${warnings.join(", ")}`
    );
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
};

// Configuration utilities
export const getUploadUrl = (directory: string = "uploads") => {
  return `${API_CONFIG.BASE_URL}${buildEndpoint.uploadToDirectory(directory)}`;
};

export const getStaticUrl = (path: string) => {
  return `${API_CONFIG.BASE_URL}/static/${path}`;
};

export const isProduction = () => APP_CONFIG.PROD;
export const isDevelopment = () => APP_CONFIG.DEV;

export default {
  API_CONFIG,
  API_KEYS,
  APP_CONFIG,
  buildEndpoint,
  validateEnvironment,
  getUploadUrl,
  getStaticUrl,
  isProduction,
  isDevelopment,
};
