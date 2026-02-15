export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface RestaurantConfig {
  name: string;
  primaryColor: string;
  currency: string;
  logo: string;
  qrColor: string;
  qrBgColor: string;
}

export type ViewMode = 'LANDING' | 'DASHBOARD' | 'CUSTOMER_PREVIEW';

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: { name: string; choice: string; price: number }[];
}
