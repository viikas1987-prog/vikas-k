import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from '../data/products';
import { Product } from '../types';

export interface CouponItem {
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
  usageCount: number;
}

export interface StoreSettings {
  ownerName: string;
  ownerPhone: string;
  freeGiftThreshold: number;
}

interface StoreContextType {
  products: Product[];
  coupons: CouponItem[];
  settings: StoreSettings;
  orders: any[];
  updateProductPrice: (productId: string, newPrice: number) => void;
  addCoupon: (code: string, discountPercent: number, description?: string) => void;
  deleteCoupon: (code: string) => void;
  validateCoupon: (code: string) => { valid: boolean; discountPercent: number; description: string };
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  deleteOrder: (orderId: string) => void;
  addOrder: (orderData: any) => void;
  refreshData: () => void;
}

const defaultCoupons: CouponItem[] = [
  { code: 'VIKAS30', discountPercent: 30, description: 'Vikas Kumar 30% Special Launch Deal', active: true, usageCount: 42 },
  { code: 'VIKASLOVE', discountPercent: 10, description: '10% Family & Friends Welcome Code', active: true, usageCount: 18 },
  { code: 'COZY10', discountPercent: 10, description: 'Newsletter 10% First Order Coupon', active: true, usageCount: 9 },
  { code: 'FESTIVE25', discountPercent: 25, description: '25% Festive Season Promo Discount', active: true, usageCount: 5 },
];

const defaultSettings: StoreSettings = {
  ownerName: 'Vikas Kumar',
  ownerPhone: '8360303562',
  freeGiftThreshold: 1499,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vk_admin_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  // 2. Coupons State
  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    const saved = localStorage.getItem('vk_admin_coupons');
    return saved ? JSON.parse(saved) : defaultCoupons;
  });

  // 3. Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('vk_admin_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // 4. Orders State
  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('vk_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync across tabs / events
  const refreshData = () => {
    const savedProducts = localStorage.getItem('vk_admin_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));

    const savedCoupons = localStorage.getItem('vk_admin_coupons');
    if (savedCoupons) setCoupons(JSON.parse(savedCoupons));

    const savedSettings = localStorage.getItem('vk_admin_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedOrders = localStorage.getItem('vk_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('vk_store_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('vk_store_updated', handleStorageChange);
    };
  }, []);

  const triggerStoreUpdate = () => {
    window.dispatchEvent(new Event('vk_store_updated'));
  };

  // ACTIONS
  const updateProductPrice = (productId: string, newPrice: number) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, price: newPrice } : p));
    setProducts(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  const addCoupon = (code: string, discountPercent: number, description?: string) => {
    const cleanCode = code.trim().toUpperCase();
    const newCoupon: CouponItem = {
      code: cleanCode,
      discountPercent,
      description: description || `${discountPercent}% Storewide Promo Discount`,
      active: true,
      usageCount: 0,
    };
    const updated = [newCoupon, ...coupons.filter((c) => c.code !== cleanCode)];
    setCoupons(updated);
    localStorage.setItem('vk_admin_coupons', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  const deleteCoupon = (code: string) => {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    localStorage.setItem('vk_admin_coupons', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  const validateCoupon = (inputCode: string) => {
    const clean = inputCode.trim().toUpperCase();
    const found = coupons.find((c) => c.code === clean && c.active);
    if (found) {
      return { valid: true, discountPercent: found.discountPercent, description: found.description };
    }
    return { valid: false, discountPercent: 0, description: '' };
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('vk_admin_settings', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.orderId !== orderId);
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  const addOrder = (orderData: any) => {
    const updated = [orderData, ...orders];
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        coupons,
        settings,
        orders,
        updateProductPrice,
        addCoupon,
        deleteCoupon,
        validateCoupon,
        updateSettings,
        updateOrderStatus,
        deleteOrder,
        addOrder,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
