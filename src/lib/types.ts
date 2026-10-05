export type Product = {
  id: string;
  slug: string;
  name: string;
  bengaliName?: string;
  price: number;
  tagline: string;
  description: string;
  weight: string; // e.g. "1kg Terracotta Pot"
  potType: string; // e.g. "Traditional Bogura Mati Shora"
  ingredients: string[];
  nutritionalInfo: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
  };
  storageInstructions: string;
  shelfLife: string;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  images: string[];
  videos?: string[];
};

export type CartItem = {
  productId: string;
  product: Product;
  quantity: number;
};

export type DeliveryZone = {
  id: string;
  name: string;
  description: string;
  fee: number;
  estimatedDays: string;
  isActive: boolean;
};

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT FOR DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'BKASH' | 'NAGAD' | 'CARD';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export type OrderCustomer = {
  fullName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  deliveryInstructions?: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
};

export type SiteContent = {
  hero: {
    tagline: string;
    subheading: string;
    ctaText: string;
    speedSeconds: number;
  };
  about: {
    heading: string;
    subheading: string;
    bodyParagraphs: string[];
    videoUrl: string;
    videoPoster: string;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
  };
  heritage: {
    heading: string;
    intro: string;
    timeline: {
      phase: string;
      title: string;
      description: string;
    }[];
  };
  map: {
    heading: string;
    subheading: string;
    originName: string;
    originDetail: string;
    destinationName: string;
    destinationDetail: string;
  };
  productStory: {
    heading: string;
    quote: string;
    artisanNote: string;
  };
  footer: {
    tagline: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    copyright: string;
  };
};

export type UserRole = 'ADMIN' | 'CUSTOMER';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
};
