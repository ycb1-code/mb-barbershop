// Database utility functions for Oracle compatibility
// In production, replace with actual Oracle database connection

// Use globalThis to persist data across hot reloads in development
declare global {
  var dbServices: Service[] | undefined;
  var dbBookings: Booking[] | undefined;
  var dbOrders: Order[] | undefined;
  var dbProducts: Product[] | undefined;
  var dbCategories: ProductCategory[] | undefined;
  var dbAdminUsers: AdminUser[] | undefined; // Add this line
}

export interface Service {
  service_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  booking_id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'Paid' | 'Completed' | 'Cancelled';
  payment_reference?: string;
  payment_status?: 'pending' | 'success' | 'failed';
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  category_id: string;
  name: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Admin user interface
export interface AdminUser {
  username: string;
  password_hash: string; // Store hashed password
  salt: string; // Salt used for hashing
  created_at: string;
  updated_at: string;
}

export interface Order {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  total_amount: number;
  payment_reference: string;
  payment_status: 'pending' | 'success' | 'failed';
  order_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

// Mock database storage (replace with Oracle DB in production)
// Use singleton pattern to persist across hot reloads
let services: Service[] = globalThis.dbServices || [
  {
    service_id: '1',
    name: 'Fade Cut',
    description: 'Clean taper fade with smooth finish',
    price: 300,
    image_url: '/images/fade-cut.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    service_id: '2',
    name: 'Classic Trim',
    description: 'Neat haircut with simple styling',
    price: 250,
    image_url: '/images/classic-trim.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    service_id: '3',
    name: 'Kids Cut',
    description: 'Gentle and stylish cut for children',
    price: 200,
    image_url: '/images/kids-cut.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    service_id: '4',
    name: 'Beard Line-Up',
    description: 'Clean beard trim and edge',
    price: 200,
    image_url: '/images/beard-lineup.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    service_id: '5',
    name: 'Full Package',
    description: 'Haircut + Beard Trim combo',
    price: 500,
    image_url: '/images/full-package.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    service_id: '6',
    name: 'Pattern Cut',
    description: 'Custom design / lines',
    price: 400,
    image_url: '/images/pattern-cut.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    service_id: '7',
    name: 'Afro Shaping',
    description: 'Shape and style for natural hair',
    price: 350,
    image_url: '/images/afro-shaping.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

if (!globalThis.dbServices) globalThis.dbServices = services;
else services = globalThis.dbServices;

let bookings: Booking[] = globalThis.dbBookings || [];
if (!globalThis.dbBookings) globalThis.dbBookings = bookings;
else bookings = globalThis.dbBookings;

let orders: Order[] = globalThis.dbOrders || [];
if (!globalThis.dbOrders) globalThis.dbOrders = orders;
else orders = globalThis.dbOrders;
let products: Product[] = globalThis.dbProducts || [
  {
    product_id: '1',
    name: 'Premium Hair Gel',
    description: 'Strong hold gel for perfect styling all day long. Water-based formula, easy to wash out.',
    price: 250,
    category: 'Hair Styling',
    stock_quantity: 25,
    image_url: '/images/hair-gel.jpg',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: '2',
    name: 'Beard Oil',
    description: 'Natural beard oil with argan and jojoba. Keeps your beard soft, shiny, and healthy.',
    price: 350,
    category: 'Beard Care',
    stock_quantity: 15,
    image_url: '/images/beard-oil.jpg',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: '3',
    name: 'Hair Pomade',
    description: 'Classic pomade for a slick, professional look. Medium hold with natural shine.',
    price: 300,
    category: 'Hair Styling',
    stock_quantity: 20,
    image_url: '/images/pomade.jpg',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: '4',
    name: 'Shaving Cream',
    description: 'Rich, moisturizing shaving cream for a smooth, comfortable shave. Suitable for all skin types.',
    price: 200,
    category: 'Shaving',
    stock_quantity: 30,
    image_url: '/images/shaving-cream.jpg',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    product_id: '5',
    name: 'Aftershave Balm',
    description: 'Soothing aftershave balm with aloe vera. Prevents irritation and razor burn.',
    price: 280,
    category: 'Shaving',
    stock_quantity: 18,
    image_url: '/images/aftershave.jpg',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

if (!globalThis.dbProducts) globalThis.dbProducts = products;
else products = globalThis.dbProducts;

let productCategories: ProductCategory[] = globalThis.dbCategories || [
  {
    category_id: '1',
    name: 'Hair Styling',
    description: 'Products for styling and maintaining your hair',
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: '2',
    name: 'Beard Care',
    description: 'Essential products for beard grooming and maintenance',
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    category_id: '3',
    name: 'Shaving',
    description: 'Everything you need for a perfect shave',
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

if (!globalThis.dbCategories) globalThis.dbCategories = productCategories;
else productCategories = globalThis.dbCategories;

// Admin users storage
let adminUsers: AdminUser[] = globalThis.dbAdminUsers || [
  {
    username: 'MB barbershop',
    password_hash: '$2a$10$8K1p/a0dURXAm7QiTRqUzuN0/SpuDMaM3xd3/7o5n5r5KQF5cMoqG', // bcrypt hash of '12345678'
    salt: '$2a$10$8K1p/a0dURXAm7QiTRqUzu',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

if (!globalThis.dbAdminUsers) globalThis.dbAdminUsers = adminUsers;
else adminUsers = globalThis.dbAdminUsers;

// Utility function to hash passwords (simplified version for demo)
const hashPassword = (password: string, salt: string): string => {
  // In a real application, use a proper hashing library like bcrypt
  // This is a simplified version for demonstration purposes only
  
  // Special handling for the default user with bcrypt hash
  if (salt === '$2a$10$8K1p/a0dURXAm7QiTRqUzu' && password === '12345678') {
    return '$2a$10$8K1p/a0dURXAm7QiTRqUzuN0/SpuDMaM3xd3/7o5n5r5KQF5cMoqG';
  }
  
  // For all other cases, use simple hash
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `hash_${salt}_${hash}`;
};

// Utility function to generate salt
const generateSalt = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Add this function to check if we're in a serverless environment (like Vercel)
const isServerlessEnvironment = () => {
  return process.env.NEXT_RUNTIME === 'edge' || process.env.NEXT_RUNTIME === 'serverless';
};

// Service CRUD operations
export const db = {
  services: {
    getAll: async (): Promise<Service[]> => {
      return services;
    },
    getById: async (id: string): Promise<Service | null> => {
      return services.find(s => s.service_id === id) || null;
    },
    create: async (service: Omit<Service, 'service_id' | 'created_at' | 'updated_at'>): Promise<Service> => {
      const newService: Service = {
        ...service,
        service_id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      services.push(newService);
      return newService;
    },
    update: async (id: string, updates: Partial<Service>): Promise<Service | null> => {
      const index = services.findIndex(s => s.service_id === id);
      if (index === -1) return null;
      services[index] = {
        ...services[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return services[index];
    },
    delete: async (id: string): Promise<boolean> => {
      const index = services.findIndex(s => s.service_id === id);
      if (index === -1) return false;
      services.splice(index, 1);
      return true;
    },
  },
  bookings: {
    getAll: async (): Promise<Booking[]> => {
      return bookings;
    },
    getById: async (id: string): Promise<Booking | null> => {
      return bookings.find(b => b.booking_id === id) || null;
    },
    getByPhone: async (phone: string): Promise<Booking[]> => {
      return bookings.filter(b => b.phone === phone);
    },
    create: async (booking: Omit<Booking, 'booking_id' | 'created_at' | 'updated_at'>): Promise<Booking> => {
      const newBooking: Booking = {
        ...booking,
        booking_id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      bookings.push(newBooking);
      return newBooking;
    },
    getApprovedByDateTime: async (date: string, time: string): Promise<Booking[]> => {
      return bookings.filter(b => b.date === date && b.time === time && (b.status === 'Paid' || b.status === 'Completed'));
    },
    update: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
      const index = bookings.findIndex(b => b.booking_id === id);
      if (index === -1) return null;
      bookings[index] = {
        ...bookings[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return bookings[index];
    },
    delete: async (id: string): Promise<boolean> => {
      const index = bookings.findIndex(b => b.booking_id === id);
      if (index === -1) return false;
      bookings.splice(index, 1);
      return true;
    },
  },
  products: {
    getAll: async (): Promise<Product[]> => {
      return products;
    },
    getById: async (id: string): Promise<Product | null> => {
      return products.find(p => p.product_id === id) || null;
    },
    getByCategory: async (category: string): Promise<Product[]> => {
      return products.filter(p => p.category === category);
    },
    getAvailable: async (): Promise<Product[]> => {
      return products.filter(p => p.is_available && p.stock_quantity > 0);
    },
    create: async (product: Omit<Product, 'product_id' | 'created_at' | 'updated_at'>): Promise<Product> => {
      const newProduct: Product = {
        ...product,
        product_id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      products.push(newProduct);
      return newProduct;
    },
    update: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
      const index = products.findIndex(p => p.product_id === id);
      if (index === -1) return null;
      products[index] = {
        ...products[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return products[index];
    },
    delete: async (id: string): Promise<boolean> => {
      const index = products.findIndex(p => p.product_id === id);
      if (index === -1) return false;
      products.splice(index, 1);
      return true;
    },
  },
  orders: {
    getAll: async (): Promise<Order[]> => {
      return orders;
    },
    getById: async (id: string): Promise<Order | null> => {
      return orders.find(o => o.order_id === id) || null;
    },
    getByPhone: async (phone: string): Promise<Order[]> => {
      return orders.filter(o => o.customer_phone === phone);
    },
    getByPaymentReference: async (reference: string): Promise<Order | null> => {
      return orders.find(o => o.payment_reference === reference) || null;
    },
    create: async (order: Omit<Order, 'order_id' | 'created_at' | 'updated_at'>): Promise<Order> => {
      const newOrder: Order = {
        ...order,
        order_id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      orders.push(newOrder);
      return newOrder;
    },
    update: async (id: string, updates: Partial<Order>): Promise<Order | null> => {
      const index = orders.findIndex(o => o.order_id === id);
      if (index === -1) return null;
      orders[index] = {
        ...orders[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return orders[index];
    },
    updateByPaymentReference: async (reference: string, updates: Partial<Order>): Promise<Order | null> => {
      const index = orders.findIndex(o => o.payment_reference === reference);
      if (index === -1) return null;
      orders[index] = {
        ...orders[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return orders[index];
    },
  },
  productCategories: {
    getAll: async (): Promise<ProductCategory[]> => {
      return productCategories.sort((a, b) => a.display_order - b.display_order);
    },
    getById: async (id: string): Promise<ProductCategory | null> => {
      return productCategories.find(c => c.category_id === id) || null;
    },
    create: async (category: Omit<ProductCategory, 'category_id' | 'created_at' | 'updated_at'>): Promise<ProductCategory> => {
      const newCategory: ProductCategory = {
        ...category,
        category_id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      productCategories.push(newCategory);
      return newCategory;
    },
    update: async (id: string, updates: Partial<ProductCategory>): Promise<ProductCategory | null> => {
      const index = productCategories.findIndex(c => c.category_id === id);
      if (index === -1) return null;
      productCategories[index] = {
        ...productCategories[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return productCategories[index];
    },
    delete: async (id: string): Promise<boolean> => {
      const index = productCategories.findIndex(c => c.category_id === id);
      if (index === -1) return false;
      productCategories.splice(index, 1);
      return true;
    },
  },
  // Admin authentication
  admin: {
    authenticate: async (username: string, password: string): Promise<boolean> => {
      const admin = adminUsers.find(a => a.username === username);
      if (!admin) return false;
      
      // Special handling for the default user
      if (username === 'MB barbershop' && password === '12345678' && admin.salt === '$2a$10$8K1p/a0dURXAm7QiTRqUzu') {
        return true;
      }
      
      // Use the hash function to check the password
      const hashedPassword = hashPassword(password, admin.salt);
      return hashedPassword === admin.password_hash;
    },
    
    changePassword: async (username: string, currentPassword: string, newPassword: string): Promise<boolean> => {
      const adminIndex = adminUsers.findIndex(a => a.username === username);
      if (adminIndex === -1) return false;
      
      const admin = adminUsers[adminIndex];
      
      // Verify current password
      // Special handling for default user with default password
      let isValid = false;
      if (admin.username === 'MB barbershop' && currentPassword === '12345678' && admin.salt === '$2a$10$8K1p/a0dURXAm7QiTRqUzu') {
        isValid = true;
      } else {
        // For all other cases, check the hash
        const currentHashed = hashPassword(currentPassword, admin.salt);
        isValid = currentHashed === admin.password_hash;
      }
      
      if (!isValid) return false;
      
      // Generate new salt and hash new password
      const newSalt = generateSalt();
      const newHash = hashPassword(newPassword, newSalt);
      
      // Update admin user
      adminUsers[adminIndex] = {
        ...admin,
        password_hash: newHash,
        salt: newSalt,
        updated_at: new Date().toISOString(),
      };
      
      return true;
    },
    
    getUser: async (username: string): Promise<AdminUser | null> => {
      return adminUsers.find(a => a.username === username) || null;
    }
  },
};
