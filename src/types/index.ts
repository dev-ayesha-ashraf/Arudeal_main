export interface FeaturedProduct {
  id: number;
  name: string;
  discount?: string;
  price?: string;
  originalPrice?: string;
  image: string;
  category?: string;
  inStock?: boolean;
}

export interface MainProduct {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  category?: string;
  description?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  bgGradient: string;
  isActive?: boolean;
  link?: string;
}

export interface Category {
  id: number;
  icon: string;
  name: string;
  hasSubmenu: boolean;
  subcategories?: Category[];
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  total?: number;
  page?: number;
  limit?: number;
}
