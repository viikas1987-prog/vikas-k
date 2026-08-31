import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as defaultProducts } from '../data/products';
import { Product } from '../types';
import {
  fetchCloudCatalog,
  saveCloudCatalog,
  fetchAllCloudOrders,
  pushOrderToCloud,
  updateCloudOrderStatus,
} from '../services/cloudStore';

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
  lastCloudSyncTime: string | null;
  updateProductPrice: (productId: string, newPrice: number) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addCoupon: (code: string, discountPercent: number, description?: string) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  validateCoupon: (code: string) => { valid: boolean; discountPercent: number; description: string };
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<void>;
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
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  // Sync both Catalog (Products, Prices, Coupons, Settings) and Orders from Cloud
  const syncWithCloud = useCallback(async () => {
    try {
      setIsCloudSyncing(true);

      // 1. Fetch Cloud Catalog
      const cloudCatalog = await fetchCloudCatalog();
      if (cloudCatalog) {
        if (Array.isArray(cloudCatalog.products) && cloudCatalog.products.length > 0) {
          setProducts(cloudCatalog.products);
          localStorage.setItem('vk_admin_products', JSON.stringify(cloudCatalog.products));
        }
        if (Array.isArray(cloudCatalog.coupons) && cloudCatalog.coupons.length > 0) {
          setCoupons(cloudCatalog.coupons);
          localStorage.setItem('vk_admin_coupons', JSON.stringify(cloudCatalog.coupons));
        }
        if (cloudCatalog.settings && cloudCatalog.settings.ownerPhone) {
          setSettings(cloudCatalog.settings);
          localStorage.setItem('vk_admin_settings', JSON.stringify(cloudCatalog.settings));
        }
      }

      // 2. Fetch Cloud Orders
      const cloudOrders = await fetchAllCloudOrders();
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders((prevLocalOrders) => {
          const map = new Map<string, any>();
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

      setLastCloudSyncTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('[StoreContext] Cloud sync error:', e);
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  // Poll cloud database every 10 seconds so any customer anywhere immediately sees updated prices & new catalogue items
  useEffect(() => {
    syncWithCloud();

    const interval = setInterval(() => {
      syncWithCloud();
    }, 10000);

    return () => clearInterval(interval);
  }, [syncWithCloud]);

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

  // Helper to persist catalog to cloud
  const pushCatalogUpdate = async (updatedProducts: Product[], updatedCoupons: CouponItem[], updatedSettings: StoreSettings) => {
    await saveCloudCatalog({
      products: updatedProducts,
      coupons: updatedCoupons,
      settings: updatedSettings,
    }).catch((err) => {
      console.warn('[StoreContext] Failed to push catalog to cloud:', err);
    });
  };

  // ACTIONS
  const updateProductPrice = async (productId: string, newPrice: number) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, price: newPrice } : p));
    setProducts(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    triggerStoreUpdate();

    await pushCatalogUpdate(updated, coupons, settings);
  };

  const addProduct = async (newProduct: Product) => {
    const updated = [newProduct, ...products.filter((p) => p.id !== newProduct.id)];
    setProducts(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    triggerStoreUpdate();

    await pushCatalogUpdate(updated, coupons, settings);
  };

  const deleteProduct = async (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    triggerStoreUpdate();

    await pushCatalogUpdate(updated, coupons, settings);
  };

  const addCoupon = async (code: string, discountPercent: number, description?: string) => {
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

    await pushCatalogUpdate(products, updated, settings);
  };

  const deleteCoupon = async (code: string) => {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    localStorage.setItem('vk_admin_coupons', JSON.stringify(updated));
    triggerStoreUpdate();

    await pushCatalogUpdate(products, updated, settings);
  };

  const validateCoupon = (inputCode: string) => {
    const clean = inputCode.trim().toUpperCase();
    const found = coupons.find((c) => c.code === clean && c.active);
    if (found) {
      return { valid: true, discountPercent: found.discountPercent, description: found.description };
    }
    return { valid: false, discountPercent: 0, description: '' };
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('vk_admin_settings', JSON.stringify(updated));
    triggerStoreUpdate();

    await pushCatalogUpdate(products, coupons, updated);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    triggerStoreUpdate();

    await updateCloudOrderStatus(orderId, newStatus).catch(() => {});
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

    await pushOrderToCloud(normalized).catch((err) => {
      console.warn('[StoreContext] Cloud order push failed:', err);
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
        lastCloudSyncTime,
        updateProductPrice,
        addProduct,
        deleteProduct,
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
