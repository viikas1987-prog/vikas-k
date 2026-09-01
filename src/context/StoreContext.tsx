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
import { cozyAudio } from '../utils/audioSynth';

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

export interface AdminNotification {
  id: string;
  type: 'HANDOVER_SCAN' | 'CUSTOMER_CANCELLED' | 'ADMIN_CANCELLED' | 'NEW_ORDER';
  title: string;
  message: string;
  orderId: string;
  timestamp: string;
  read: boolean;
  courierName?: string;
}

interface StoreContextType {
  products: Product[];
  coupons: CouponItem[];
  settings: StoreSettings;
  orders: any[];
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  isCloudSyncing: boolean;
  lastCloudSyncTime: string | null;
  updateProductPrice: (productId: string, newPrice: number) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addCoupon: (code: string, discountPercent: number, description?: string) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  validateCoupon: (code: string) => { valid: boolean; discountPercent: number; description: string };
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string, metadata?: any) => Promise<void>;
  deleteOrder: (orderId: string) => void;
  addOrder: (orderData: any) => Promise<void>;
  addNotification: (n: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
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

  // 5. Live Admin Notifications State
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('vk_admin_notifications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'notif-welcome',
          type: 'NEW_ORDER',
          title: 'Central Cloud Database Connected',
          message: 'Real-time order synchronization and Barcode Delivery Handover is active.',
          orderId: 'VK-SYSTEM',
          timestamp: new Date().toLocaleTimeString(),
          read: false,
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vk_admin_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const addNotification = useCallback((n: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AdminNotification = {
      id: 'notif-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 5),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      read: false,
      ...n,
    };
    try {
      cozyAudio.playCelebration();
    } catch (e) {}

    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Cloud Sync
  const syncWithCloud = useCallback(async () => {
    setIsCloudSyncing(true);
    try {
      const [cloudCatalog, cloudOrders] = await Promise.all([
        fetchCloudCatalog(),
        fetchAllCloudOrders(),
      ]);

      if (cloudCatalog && cloudCatalog.products && Array.isArray(cloudCatalog.products)) {
        setProducts(cloudCatalog.products);
        localStorage.setItem('vk_admin_products', JSON.stringify(cloudCatalog.products));
        if (cloudCatalog.coupons) {
          setCoupons(cloudCatalog.coupons);
          localStorage.setItem('vk_admin_coupons', JSON.stringify(cloudCatalog.coupons));
        }
        if (cloudCatalog.settings) {
          setSettings(cloudCatalog.settings);
          localStorage.setItem('vk_admin_settings', JSON.stringify(cloudCatalog.settings));
        }
      }

      if (cloudOrders && Array.isArray(cloudOrders)) {
        setOrders(cloudOrders);
        localStorage.setItem('vk_orders', JSON.stringify(cloudOrders));
      }

      setLastCloudSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Cloud sync background note:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncWithCloud();
    const interval = setInterval(syncWithCloud, 10000);
    return () => clearInterval(interval);
  }, [syncWithCloud]);

  const updateProductPrice = async (productId: string, newPrice: number) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, price: Number(newPrice) } : p));
    setProducts(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    await saveCloudCatalog({ products: updated, coupons, settings });
  };

  const addProduct = async (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    await saveCloudCatalog({ products: updated, coupons, settings });
  };

  const deleteProduct = async (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    await saveCloudCatalog({ products: updated, coupons, settings });
  };

  const addCoupon = async (code: string, discountPercent: number, description?: string) => {
    const newCoupon: CouponItem = {
      code: code.toUpperCase().trim(),
      discountPercent,
      description: description || `${discountPercent}% Off Storewide Promo`,
      active: true,
      usageCount: 0,
    };
    const updated = [newCoupon, ...coupons.filter((c) => c.code !== newCoupon.code)];
    setCoupons(updated);
    localStorage.setItem('vk_admin_coupons', JSON.stringify(updated));
    await saveCloudCatalog({ products, coupons: updated, settings });
  };

  const deleteCoupon = async (code: string) => {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    localStorage.setItem('vk_admin_coupons', JSON.stringify(updated));
    await saveCloudCatalog({ products, coupons: updated, settings });
  };

  const validateCoupon = (code: string) => {
    const found = coupons.find((c) => c.code === code.toUpperCase().trim() && c.active);
    if (found) {
      return { valid: true, discountPercent: found.discountPercent, description: found.description };
    }
    return { valid: false, discountPercent: 0, description: '' };
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem('vk_admin_settings', JSON.stringify(merged));
    await saveCloudCatalog({ products, coupons, settings: merged });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, metadata?: any) => {
    const updated = orders.map((o) => {
      if (o.orderId === orderId || o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          lastStatusUpdate: new Date().toISOString(),
          ...(metadata || {}),
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
    await updateCloudOrderStatus(orderId, newStatus);
  };

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.orderId !== orderId && o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
  };

  const addOrder = async (orderData: any) => {
    const newOrders = [orderData, ...orders];
    setOrders(newOrders);
    localStorage.setItem('vk_orders', JSON.stringify(newOrders));
    await pushOrderToCloud(orderData);

    // Notify Admin Panel
    addNotification({
      type: 'NEW_ORDER',
      title: 'New Customer Order Placed',
      message: `Order #${orderData.orderId || orderData.id} placed by ${orderData.fullName} (₹${orderData.finalTotal || orderData.total})`,
      orderId: orderData.orderId || orderData.id,
    });
  };

  const refreshData = () => syncWithCloud();

  return (
    <StoreContext.Provider
      value={{
        products,
        coupons,
        settings,
        orders,
        notifications,
        unreadNotificationsCount,
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
        addNotification,
        markNotificationRead,
        clearNotifications,
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
