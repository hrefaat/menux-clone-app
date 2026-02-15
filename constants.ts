import { Category, MenuItem, RestaurantConfig } from './types';

export const INITIAL_CONFIG: RestaurantConfig = {
  name: "Burger & Co.",
  primaryColor: "#EA580C", // Burnt Orange (Tailwind orange-600)
  currency: "SAR", // Changed to SAR for Arabic context default
  logo: "https://lucide.dev/icons/chef-hat", // Placeholder
  qrColor: "#000000",
  qrBgColor: "#ffffff"
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Popular' },
  { id: 'cat_2', name: 'Burgers' },
  { id: 'cat_3', name: 'Sides' },
  { id: 'cat_4', name: 'Drinks' },
];

export const MOCK_ITEMS: MenuItem[] = [
  {
    id: 'item_1',
    categoryId: 'cat_1',
    name: 'Truffle Smash Burger',
    description: 'Double smash patty, truffle mayo, aged cheddar, caramelized onions.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    tags: ['Bestseller', 'Chef Choice']
  },
  {
    id: 'item_2',
    categoryId: 'cat_2',
    name: 'Classic Cheeseburger',
    description: 'Quarter pounder with american cheese, lettuce, tomato, and house sauce.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
    tags: []
  },
  {
    id: 'item_3',
    categoryId: 'cat_2',
    name: 'Spicy Chicken Sandwich',
    description: 'Fried chicken breast, spicy coleslaw, pickles, brioche bun.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
    tags: ['Spicy']
  },
  {
    id: 'item_4',
    categoryId: 'cat_3',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with cheese sauce, bacon bits, and green onions.',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?q=80&w=800&auto=format&fit=crop',
    tags: ['Sharing']
  },
  {
    id: 'item_5',
    categoryId: 'cat_4',
    name: 'Craft Lemonade',
    description: 'Freshly squeezed lemons with a hint of mint.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    tags: ['Vegan']
  },
];
