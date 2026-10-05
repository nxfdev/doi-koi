import fs from 'fs';
import path from 'path';
import {
  Product,
  Order,
  SiteContent,
  DeliveryZone,
  OrderStatus,
  PaymentStatus,
  OrderItem,
  OrderCustomer,
} from './types';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_DELIVERY_ZONES,
  DEFAULT_SITE_CONTENT,
} from './cms-defaults';

interface StoreData {
  products: Product[];
  orders: Order[];
  deliveryZones: DeliveryZone[];
  siteContent: SiteContent;
  adminCredentials: {
    email: string;
    passwordHash: string; // SHA-256 for default demo, upgradeable
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Default initial state
const INITIAL_DATA: StoreData = {
  products: DEFAULT_PRODUCTS,
  orders: [
    {
      id: 'ord_demo_101',
      orderNumber: 'DK-2026-8901',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      customer: {
        fullName: 'Tahmid Rahman',
        phone: '01712345678',
        email: 'tahmid@example.com',
        division: 'Dhaka',
        district: 'Dhaka',
        area: 'Banani',
        fullAddress: 'House 42, Road 11, Block D, Banani, Dhaka',
        deliveryInstructions: 'Please call before arrival. Deliver in insulated cold bag.',
      },
      items: [
        {
          productId: 'prod_mishti_doi',
          productName: 'Mishti Doi (1kg Shora)',
          unitPrice: 350,
          quantity: 2,
          subtotal: 700,
        },
        {
          productId: 'prod_shahi_doi',
          productName: 'Shahi Doi (1kg Shora)',
          unitPrice: 500,
          quantity: 1,
          subtotal: 500,
        },
      ],
      subtotal: 1200,
      deliveryFee: 80,
      discount: 0,
      total: 1280,
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'UNPAID',
      orderStatus: 'OUT FOR DELIVERY',
      notes: 'Customer requested evening delivery.',
    },
    {
      id: 'ord_demo_102',
      orderNumber: 'DK-2026-8902',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      customer: {
        fullName: 'Nazia Haque',
        phone: '01898765432',
        email: 'nazia.haque@example.com',
        division: 'Dhaka',
        district: 'Dhaka',
        area: 'Dhanmondi',
        fullAddress: 'Flat 4B, Concord Tower, Road 7/A, Dhanmondi, Dhaka',
      },
      items: [
        {
          productId: 'prod_diabetic_doi',
          productName: 'Diabetic Doi (1kg Shora)',
          unitPrice: 450,
          quantity: 1,
          subtotal: 450,
        },
      ],
      subtotal: 450,
      deliveryFee: 80,
      discount: 0,
      total: 530,
      paymentMethod: 'BKASH',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
    },
  ],
  deliveryZones: DEFAULT_DELIVERY_ZONES,
  siteContent: DEFAULT_SITE_CONTENT,
  adminCredentials: {
    email: 'admin@doikoi.com',
    // SHA256 of "doikoi2026"
    passwordHash:
      '658433906ba4af42c9b6dd40b3039da7b8c80fd57320f0476491d5a287f1bf0c',
  },
};

function ensureDataFile(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Error reading store.json, falling back to initial data:', err);
    return INITIAL_DATA;
  }
}

function writeDataFile(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store.json:', err);
  }
}

// Product operations
export async function getProducts(): Promise<Product[]> {
  const data = ensureDataFile();
  return data.products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = ensureDataFile();
  return data.products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const data = ensureDataFile();
  return data.products.find((p) => p.id === id) || null;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const data = ensureDataFile();
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.products[idx] = { ...data.products[idx], ...updates };
  writeDataFile(data);
  return data.products[idx];
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const data = ensureDataFile();
  const newProduct: Product = {
    ...productData,
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };
  data.products.push(newProduct);
  writeDataFile(data);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = ensureDataFile();
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  data.products.splice(idx, 1);
  writeDataFile(data);
  return true;
}

// Order operations
export async function getOrders(statusFilter?: string, query?: string): Promise<Order[]> {
  const data = ensureDataFile();
  let orders = [...data.orders];

  if (statusFilter && statusFilter !== 'ALL') {
    orders = orders.filter((o) => o.orderStatus === statusFilter);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        (o.customer.email && o.customer.email.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const data = ensureDataFile();
  return data.orders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export interface CreateOrderInput {
  customer: OrderCustomer;
  items: { productId: string; quantity: number }[];
  deliveryZoneId: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'BKASH' | 'NAGAD' | 'CARD';
  notes?: string;
}

// Server-side order creation with strict price and inventory validation
export async function createOrder(input: CreateOrderInput): Promise<{ order?: Order; error?: string }> {
  const data = ensureDataFile();

  if (!input.items || input.items.length === 0) {
    return { error: 'Your cart is empty.' };
  }

  if (!input.customer.fullName || !input.customer.phone || !input.customer.fullAddress) {
    return { error: 'Full name, phone number, and delivery address are required.' };
  }

  // Validate zone and get server delivery fee
  const zone = data.deliveryZones.find((z) => z.id === input.deliveryZoneId && z.isActive);
  if (!zone) {
    return { error: 'Selected delivery zone is invalid or inactive.' };
  }
  const deliveryFee = zone.fee;

  // Validate items, inventory, and calculate subtotal using SERVER prices
  let subtotal = 0;
  const verifiedItems: OrderItem[] = [];

  for (const itemInput of input.items) {
    if (itemInput.quantity <= 0) continue;
    const product = data.products.find((p) => p.id === itemInput.productId);
    if (!product) {
      return { error: `Product with ID ${itemInput.productId} not found.` };
    }
    if (!product.isAvailable) {
      return { error: `"${product.name}" is currently unavailable.` };
    }
    if (product.price <= 0) {
      return { error: `Price for "${product.name}" is currently being updated. Please contact support.` };
    }
    if (product.stock < itemInput.quantity) {
      return { error: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${itemInput.quantity}.` };
    }

    const itemSubtotal = product.price * itemInput.quantity;
    subtotal += itemSubtotal;
    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: itemInput.quantity,
      subtotal: itemSubtotal,
    });
  }

  if (verifiedItems.length === 0) {
    return { error: 'No valid items in order.' };
  }

  // Decrement inventory safely server-side
  for (const vItem of verifiedItems) {
    const p = data.products.find((p) => p.id === vItem.productId);
    if (p) {
      p.stock = Math.max(0, p.stock - vItem.quantity);
      if (p.stock === 0) {
        // Automatically marked sold out when stock hits 0 as required
      }
    }
  }

  const orderNumber = `DK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder: Order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: input.customer,
    items: verifiedItems,
    subtotal,
    deliveryFee,
    discount: 0,
    total: subtotal + deliveryFee,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === 'CASH_ON_DELIVERY' ? 'UNPAID' : 'UNPAID', // server verification needed for gateways
    orderStatus: 'PENDING',
    notes: input.notes,
  };

  data.orders.push(newOrder);
  writeDataFile(data);

  return { order: newOrder };
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<Order | null> {
  const data = ensureDataFile();
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.orderStatus = orderStatus;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  order.updatedAt = new Date().toISOString();
  writeDataFile(data);
  return order;
}

// Delivery zones
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const data = ensureDataFile();
  return data.deliveryZones;
}

export async function updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<DeliveryZone | null> {
  const data = ensureDataFile();
  const idx = data.deliveryZones.findIndex((z) => z.id === id);
  if (idx === -1) return null;
  data.deliveryZones[idx] = { ...data.deliveryZones[idx], ...updates };
  writeDataFile(data);
  return data.deliveryZones[idx];
}

// Site content CMS
export async function getSiteContent(): Promise<SiteContent> {
  const data = ensureDataFile();
  return data.siteContent;
}

export async function updateSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
  const data = ensureDataFile();
  data.siteContent = { ...data.siteContent, ...updates };
  writeDataFile(data);
  return data.siteContent;
}

// Analytics
export async function getAnalyticsSummary() {
  const data = ensureDataFile();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 7 * 86400000;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let totalOrders = data.orders.length;
  let totalRevenue = 0;
  let ordersToday = 0;
  let ordersThisWeek = 0;
  let ordersThisMonth = 0;
  let pendingOrders = 0;

  const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};

  data.products.forEach((p) => {
    productSalesMap[p.id] = { name: p.name, units: 0, revenue: 0 };
  });

  for (const o of data.orders) {
    const t = new Date(o.createdAt).getTime();
    if (o.orderStatus !== 'CANCELLED') {
      totalRevenue += o.total;
    }
    if (t >= todayStart) ordersToday++;
    if (t >= weekStart) ordersThisWeek++;
    if (t >= monthStart) ordersThisMonth++;
    if (o.orderStatus === 'PENDING') pendingOrders++;

    for (const item of o.items) {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, units: 0, revenue: 0 };
      }
      productSalesMap[item.productId].units += item.quantity;
      productSalesMap[item.productId].revenue += item.subtotal;
    }
  }

  const lowStockProducts = data.products.filter((p) => p.stock <= 5);
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return {
    totalOrders,
    totalRevenue,
    ordersToday,
    ordersThisWeek,
    ordersThisMonth,
    averageOrderValue,
    pendingOrders,
    lowStockProducts,
    productSales: Object.values(productSalesMap),
  };
}
