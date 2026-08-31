import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as defaultProducts } from '../data/products';
import { Product } from '../types';
import { fetchAllCloudOrders, pushOrderToCloud, updateCloudOrderStatus } from '../services/cloudOrders';

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
  isCloudSyncing: boolean;
  updateProductPrice: (productId: string, newPrice: number) => void;
  addCoupon: (code: string, discountPercent: number, description?: string) => void;
  deleteCoupon: (code: string) => void;
  validateCoupon: (code: string) => { valid: boolean; discountPercent: number; description: string };
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  deleteOrder: (orderId: string) => void;
  addOrder: (orderData: any) => Promise<void>;
  refreshData: () => void;
  syncWithCloud: () => Promise<void>;
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
    try {
      const saved = localStorage.getItem('vk_admin_products');
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  // 2. Coupons State
  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    try {
      const saved = localStorage.getItem('vk_admin_coupons');
      return saved ? JSON.parse(saved) : defaultCoupons;
    } catch {
      return defaultCoupons;
    }
  });

  // 3. Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('vk_admin_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // 4. Orders State
  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('vk_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Sync with Global Cloud Database
  const syncWithCloud = useCallback(async () => {
    try {
      setIsCloudSyncing(true);
      const cloudOrders = await fetchAllCloudOrders();
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders((prevLocalOrders) => {
          // Normalize and merge unique orders by orderId / id
          const map = new Map<string, any>();
          
          // First add cloud orders
          cloudOrders.forEach((co) => {
            const key = co.orderId || co.id;
            if (key) {
              map.set(key, {
                ...co,
                orderId: co.orderId || co.id,
                id: co.id || co.orderId,
                fullName: co.fullName || co.customerName,
                phone: co.phone || co.customerPhone,
                finalTotal: co.finalTotal || co.total,
                utrNumber: co.utrNumber || co.utr,
              });
            }
          });

          // Merge local orders (local edits might be newer)
          prevLocalOrders.forEach((lo) => {
            const key = lo.orderId || lo.id;
            if (key && !map.has(key)) {
              map.set(key, lo);
            }
          });

          const merged = Array.from(map.values()).sort((a, b) => {
            const timeA = new Date(a.timestamp || a.date || 0).getTime();
            const timeB = new Date(b.timestamp || b.date || 0).getTime();
            return timeB - timeA;
          });

          localStorage.setItem('vk_orders', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      console.warn('[StoreContext] Cloud sync error:', e);
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  // Initial cloud fetch and recurring auto-poll every 12 seconds
  useEffect(() => {
    syncWithCloud();

    const interval = setInterval(() => {
      syncWithCloud();
    }, 12000);

    return () => clearInterval(interval);
  }, [syncWithCloud]);

  // Sync across tabs / window events
  const refreshData = () => {
    try {
      const savedProducts = localStorage.getItem('vk_admin_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCoupons = localStorage.getItem('vk_admin_coupons');
      if (savedCoupons) setCoupons(JSON.parse(savedCoupons));

      const savedSettings = localStorage.getItem('vk_admin_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedOrders = localStorage.getItem('vk_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {}
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
    const updated = orders.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    triggerStoreUpdate();

    // Push status update to global cloud DB asynchronously
    updateCloudOrderStatus(orderId, newStatus).catch(() => {});
  };

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.orderId !== orderId && o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    triggerStoreUpdate();
  };

  const addOrder = async (orderData: any) => {
    const normalized = {
      ...orderData,
      id: orderData.orderId || orderData.id,
      orderId: orderData.orderId || orderData.id,
      fullName: orderData.fullName || orderData.customerName,
      phone: orderData.phone || orderData.customerPhone,
      finalTotal: orderData.finalTotal || orderData.total,
      utrNumber: orderData.utrNumber || orderData.utr,
      timestamp: orderData.timestamp || orderData.date || new Date().toISOString(),
    };

    const updated = [normalized, ...orders.filter((o) => (o.orderId || o.id) !== normalized.id)];
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    triggerStoreUpdate();

    // Instantly push to global cloud database
    await pushOrderToCloud(normalized).catch((err) => {
      console.warn('[StoreContext] Cloud push failed, queued locally:', err);
    });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        coupons,
        settings,
        orders,
        isCloudSyncing,
        updateProductPrice,
        addCoupon,
        deleteCoupon,
        validateCoupon,
        updateSettings,
        updateOrderStatus,
        deleteOrder,
        addOrder,
        refreshData,
        syncWithCloud,
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
