import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Settings,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Phone,
  MapPin,
  MessageSquare,
  Printer,
  ShieldCheck,
  ChevronRight,
  Truck,
  Lock,
  LogOut,
  Store,
  Barcode,
  Sparkles,
  RefreshCw,
  Cloud,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { useStore, CouponItem, StoreSettings } from '../../context/StoreContext';
import { cozyAudio } from '../../utils/audioSynth';
import { ShippingWaybillModal } from './ShippingWaybillModal';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { Product } from '../../types';

interface AdminStandalonePageProps {
  onReturnToStore: () => void;
}

export const AdminStandalonePage: React.FC<AdminStandalonePageProps> = ({ onReturnToStore }) => {
  const {
    products,
    coupons,
    settings,
    orders,
    updateProductPrice,
    addProduct,
    deleteProduct,
    addCoupon,
    deleteCoupon,
    updateSettings,
    updateOrderStatus,
    deleteOrder,
    isCloudSyncing,
    lastCloudSyncTime,
    syncWithCloud,
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vk_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'settings'>('overview');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'dispatched' | 'delivered' | 'cancelled'>('all');
  const [selectedOrderForWaybill, setSelectedOrderForWaybill] = useState<any | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Product Editing & Adding State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'clothes' | 'sleepwear' | 'nursery' | 'essentials' | 'gift-sets'>('clothes');
  const [newProdPrice, setNewProdPrice] = useState(1499);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(2199);
  const [newProdDescription, setNewProdDescription] = useState('Handcrafted with certified 100% organic cotton for infant comfort.');
  const [newProdImage, setNewProdImage] = useState('/images/products/boston-91-combo-pack.png');
  const [newProdStock, setNewProdStock] = useState(25);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Coupon Creation State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Settings State
  const [ownerNameInput, setOwnerNameInput] = useState(settings.ownerName || 'Vikas Kumar');
  const [ownerPhoneInput, setOwnerPhoneInput] = useState(settings.ownerPhone || '8360303562');
  const [thresholdInput, setThresholdInput] = useState(settings.freeGiftThreshold || 1499);
  const [isSavedSettings, setIsSavedSettings] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (settings) {
      setOwnerNameInput(settings.ownerName || 'Vikas Kumar');
      setOwnerPhoneInput(settings.ownerPhone || '8360303562');
      setThresholdInput(settings.freeGiftThreshold || 1499);
    }
  }, [settings]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (clean === 'cozycuddle007') {
      setIsAuthenticated(true);
      localStorage.setItem('vk_admin_auth', 'true');
      setAuthError(false);
      cozyAudio.playCelebration();
      showToast('Welcome back, Vikas Kumar! Cloud Database connected.');
    } else {
      setAuthError(true);
      cozyAudio.playSoftTap();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vk_admin_auth');
  };

  // Product Price Edit
  const handleSavePrice = async (prodId: string) => {
    if (editPriceValue <= 0) return;
    await updateProductPrice(prodId, editPriceValue);
    setEditingProductId(null);
    cozyAudio.playSparkle();
    showToast('✓ Product price updated and live worldwide!');
  };

  // Add Product Submit
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    setIsSavingProduct(true);
    cozyAudio.playCelebration();

    const newProduct: Product = {
      id: 'prod-' + Date.now().toString(36),
      sku: 'VK-' + Math.floor(1000 + Math.random() * 9000),
      name: newProdName.trim(),
      brand: 'Vikas Kumar Atelier',
      category: newProdCategory,
      department: 'Infant & Baby Essentials',
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      discountPercent: Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100) || 20,
      rating: 4.9,
      reviewsCount: 1,
      ratingBreakdown: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
      isNew: true,
      inStock: true,
      stockCount: Number(newProdStock),
      deliveryDays: 3,
      estimatedDelivery: '3-4 Business Days',
      tagline: 'Handcrafted Organic Artisan Comfort',
      description: newProdDescription,
      features: [
        '100% GOTS Certified Organic Fabric',
        'Hypoallergenic & Breathable Weave',
        'Reinforced Seams for Active Movements',
      ],
      specifications: {
        Fabric: '100% Organic Pure Cotton',
        Fit: 'Relaxed Comfort Fit',
        Care: 'Machine Wash Delicate',
      },
      material: 'Organic Cotton',
      softnessScore: 9.8,
      colors: [
        { name: 'Oatmeal Beige', hex: '#E6D7C3' },
        { name: 'Sage Green', hex: '#9CAF88' },
        { name: 'Blush Rose', hex: '#E8B4B8' },
      ],
      sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
      images: [newProdImage || '/images/products/boston-91-combo-pack.png'],
      modelType: 'romper',
    };

    await addProduct(newProduct);
    setIsSavingProduct(false);
    setIsAddProductModalOpen(false);
    setNewProdName('');
    showToast('✨ New product added to cloud catalog and published live!');
  };

  // Add Coupon Submit
  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    await addCoupon(newCouponCode, Number(newCouponDiscount), newCouponDesc);
    setNewCouponCode('');
    setNewCouponDesc('');
    cozyAudio.playCelebration();
    showToast('✓ Promo coupon activated on worldwide checkout!');
  };

  // Save Settings Submit
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ownerName: ownerNameInput.trim(),
      ownerPhone: ownerPhoneInput.trim(),
      freeGiftThreshold: Number(thresholdInput),
    });
    setIsSavedSettings(true);
    cozyAudio.playCelebration();
    showToast('✓ Settings updated and synced with live store!');
    setTimeout(() => setIsSavedSettings(false), 3000);
  };

  // Export Orders CSV
  const exportCSV = () => {
    cozyAudio.playCelebration();
    const headers = 'Order ID,Date,Customer Name,Phone,Address,Payment Mode,UTR,Items,Total (INR),Status\n';
    const rows = orders
      .map((o) => {
        const items = o.items?.map((i: any) => `${i.product?.name || i.name} (Qty:${i.quantity})`).join('; ') || '';
        return `"${o.orderId || o.id}","${new Date(o.timestamp || o.date || Date.now()).toLocaleString('en-IN')}","${o.fullName}","${o.phone}","${o.address}","${o.paymentMethod}","${o.utrNumber || ''}","${items}","${o.finalTotal || o.total}","${o.status || 'Paid & Confirmed'}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Vikas_Kumar_Atelier_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust Order Filtering
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (o.fullName || '').toLowerCase().includes(q) ||
      (o.orderId || o.id || '').toLowerCase().includes(q) ||
      (o.phone || '').includes(q) ||
      (o.utrNumber || '').includes(q) ||
      (o.address || '').toLowerCase().includes(q);

    const st = (o.status || 'Paid & Confirmed').toLowerCase();
    let matchesStatus = true;
    if (statusFilter === 'paid') {
      matchesStatus = !st.includes('cancelled') && !st.includes('delivered');
    } else if (statusFilter === 'dispatched') {
      matchesStatus = st.includes('dispatch') || st.includes('transit') || st.includes('out for delivery');
    } else if (statusFilter === 'delivered') {
      matchesStatus = st.includes('delivered');
    } else if (statusFilter === 'cancelled') {
      matchesStatus = st.includes('cancelled');
    }

    return matchesSearch && matchesStatus;
  });

  // Metrics Calculation (Exclude cancelled orders from revenue)
  const activeOrders = orders.filter((o) => !(o.status || '').toLowerCase().includes('cancelled'));
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.finalTotal || o.total || 0), 0);
  const pendingCount = orders.filter((o) => {
    const st = (o.status || '').toLowerCase();
    return !st.includes('cancelled') && !st.includes('delivered') && !st.includes('dispatch');
  }).length;
  const dispatchedCount = orders.filter((o) => {
    const st = (o.status || '').toLowerCase();
    return st.includes('dispatch') || st.includes('transit') || st.includes('out for delivery');
  }).length;
  const deliveredCount = orders.filter((o) => (o.status || '').toLowerCase().includes('delivered')).length;
  const cancelledCount = orders.filter((o) => (o.status || '').toLowerCase().includes('cancelled')).length;

  // Preset image choices for Add Product Modal
  const presetImages = [
    { label: 'Boston 91 Romper Combo', url: '/images/products/boston-91-combo-pack.png' },
    { label: 'Black High Neck Turtleneck', url: '/images/products/black-highneck-turtleneck.png' },
    { label: 'Organic Romper & Cap', url: '/images/products/boston-91-combo-pack.png' },
    { label: 'Girls Top & Pants Set', url: '/images/products/boston-91-combo-pack.png' },
  ];

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4 selection:bg-[#FF6B6B]">
        <div className="w-full max-w-md bg-[#1E293B] p-8 rounded-4xl border border-gray-700 shadow-2xl space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] flex items-center justify-center text-3xl mx-auto shadow-lg">
            👑
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{settings.ownerName || 'Vikas Kumar'} Atelier</h2>
            <p className="text-xs text-gray-400 mt-1">
              Live Global Cloud Management Portal • Restricted Staff Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left space-y-1">
              <label className="text-xs font-bold text-gray-300">Staff Passcode:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  placeholder="Enter admin passcode (cozycuddle007)"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>
              {authError && (
                <p className="text-xs font-bold text-red-400 mt-1 flex items-center gap-1 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5" /> Invalid Passcode! Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" /> Authenticate & Access Portal
            </button>
          </form>

          <button
            onClick={onReturnToStore}
            className="text-xs font-bold text-gray-400 hover:text-white transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100 flex flex-col font-sans selection:bg-[#FF6B6B]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-black flex items-center gap-2 animate-fade-in border border-emerald-400">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1E293B]/90 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center text-xl font-bold shadow-md">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white leading-none">
                {settings.ownerName || 'Vikas Kumar'} Atelier
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                <Cloud className="w-3 h-3" /> CLOUD DATABASE LIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Live Global Store Management • cozycudlle.xyz
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Cloud Sync Manual Button */}
          <button
            onClick={async () => {
              cozyAudio.playSoftTap();
              await syncWithCloud();
              showToast('✓ Cloud Database synchronized successfully!');
            }}
            disabled={isCloudSyncing}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-700"
            title="Force refresh orders & catalog from Central Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isCloudSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isCloudSyncing ? 'Syncing...' : lastCloudSyncTime ? `Synced ${lastCloudSyncTime}` : 'Sync Cloud'}
            </span>
          </button>

          {/* Return to Store */}
          <button
            onClick={onReturnToStore}
            className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-700"
          >
            <Store className="w-3.5 h-3.5 text-[#FF6B6B]" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#1E293B] border-r border-gray-800 p-4 space-y-2 flex-shrink-0">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'orders', label: `Orders & Shipping (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Catalog & Prices (${products.length})`, icon: Package },
            { id: 'coupons', label: `Promo Coupons (${coupons.length})`, icon: Tag },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  cozyAudio.playSoftTap();
                  setActiveTab(tab.id as any);
                }}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-3 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#FF6B6B] text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase">Active Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Live Realtime Sales
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#FF6B6B]" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{orders.length}</h3>
                  <p className="text-[11px] text-gray-400">
                    {pendingCount} Pending • {dispatchedCount} In Transit
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase">Avg Order Value</span>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    ₹{activeOrders.length > 0 ? Math.round(totalRevenue / activeOrders.length).toLocaleString('en-IN') : 0}
                  </h3>
                  <p className="text-[11px] text-blue-400 font-bold">Strong Basket Size</p>
                </div>

                <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase">Active Lines</span>
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{products.length}</h3>
                  <p className="text-[11px] text-purple-400 font-bold">Published & Live</p>
                </div>
              </div>

              {/* Quick Actions Stream */}
              <div className="p-6 rounded-3xl bg-[#1E293B] border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#FF6B6B] hover:underline"
                  >
                    View All Orders & Print Barcodes →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((o) => (
                    <div
                      key={o.orderId || o.id}
                      className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800 flex items-center justify-between flex-wrap gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-[#FF6B6B] flex items-center justify-center font-bold text-base">
                          📦
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {o.fullName} <span className="text-gray-400 font-normal">({o.orderId || o.id})</span>
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {o.items?.length || 1} items • ₹{(o.finalTotal || o.total || 0).toLocaleString('en-IN')} • Status: <strong className="text-emerald-400">{o.status || 'Paid & Confirmed'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrderForWaybill(o)}
                          className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-gray-700"
                        >
                          <Barcode className="w-3.5 h-3.5 text-[#FF6B6B]" /> Print Barcode Label
                        </button>
                        <a
                          href={`https://wa.me/91${o.phone}?text=Hello%20${encodeURIComponent(o.fullName)},%20regarding%20order%20${o.orderId || o.id}... track at https://cozycudlle.xyz`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-[#25D366] text-white hover:opacity-90 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between gap-3 flex-wrap bg-[#1E293B] p-4 rounded-3xl border border-gray-800 shadow-sm">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone, city, or order ID..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { label: `All (${orders.length})`, val: 'all' },
                    { label: `Paid & Active (${pendingCount})`, val: 'paid' },
                    { label: `In Transit (${dispatchedCount})`, val: 'dispatched' },
                    { label: `Delivered (${deliveredCount})`, val: 'delivered' },
                    { label: `Cancelled (${cancelledCount})`, val: 'cancelled' },
                  ].map((filterItem) => (
                    <button
                      key={filterItem.val}
                      onClick={() => {
                        cozyAudio.playSoftTap();
                        setStatusFilter(filterItem.val as any);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        statusFilter === filterItem.val
                          ? 'bg-[#FF6B6B] text-white shadow-sm'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {filterItem.label}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      cozyAudio.playSoftTap();
                      setIsScannerOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    title="Open Barcode Scanner Tool"
                  >
                    <Barcode className="w-3.5 h-3.5" /> Scan Barcode
                  </button>

                  <button
                    onClick={exportCSV}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm ml-1"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV Export
                  </button>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center bg-[#1E293B] rounded-3xl border border-gray-800 space-y-2">
                    <p className="text-gray-400 text-xs">No orders matching your search / filter criteria.</p>
                  </div>
                ) : (
                  filteredOrders.map((o) => {
                    const orderKey = o.orderId || o.id;
                    const isCancelled = (o.status || '').toLowerCase().includes('cancelled');

                    return (
                      <div
                        key={orderKey}
                        className={`p-5 rounded-3xl bg-[#1E293B] border space-y-4 transition shadow-sm ${
                          isCancelled ? 'border-red-900/60 bg-[#1E293B]/70' : 'border-gray-800'
                        }`}
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-white">
                              #{orderKey}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                isCancelled
                                  ? 'bg-red-950 text-red-400 border-red-800'
                                  : (o.status || '').toLowerCase().includes('delivered')
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                  : 'bg-rose-950 text-[#FF6B6B] border-rose-800'
                              }`}
                            >
                              {o.status || 'Paid & Confirmed'}
                            </span>
                            <span className="text-xs text-gray-400 font-semibold">
                              {new Date(o.timestamp || o.date || Date.now()).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                              ₹{(o.finalTotal || o.total || 0).toLocaleString('en-IN')} ({(o.paymentMethod || 'UPI').toUpperCase()})
                            </span>
                            <button
                              onClick={() => setSelectedOrderForWaybill(o)}
                              className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-gray-700 shadow-sm"
                              title="Generate 4x6 Courier Shipping Label with Barcode"
                            >
                              <Barcode className="w-4 h-4 text-[#FF6B6B]" /> Print Shipping Barcode
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete record for order ${orderKey}?`)) {
                                  deleteOrder(orderKey);
                                  showToast('Order record removed.');
                                }
                              }}
                              className="text-gray-500 hover:text-red-400 transition p-1 cursor-pointer"
                              title="Delete Order Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-900/60 p-3.5 rounded-2xl border border-gray-800">
                          <div className="space-y-1">
                            <p className="font-bold text-white">
                              <span className="text-gray-400 font-normal">Customer:</span> {o.fullName}
                            </p>
                            <p className="font-bold text-gray-300 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#FF6B6B]" /> +91 {o.phone}
                            </p>
                            {o.utrNumber && (
                              <p className="font-mono text-emerald-400 font-bold">
                                💳 UPI UTR: {o.utrNumber}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-300 flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{o.address}</span>
                            </p>
                          </div>
                        </div>

                        {/* Package Contents */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                            Package Contents:
                          </span>
                          {o.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-gray-300">
                              <span>
                                • <strong>{item.product?.name || item.name}</strong> ({item.selectedSize || 'Standard'}, {item.selectedColor?.name || 'Artisan'}) × {item.quantity || 1}
                              </span>
                              <span className="font-bold">
                                ₹{((item.product?.price || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Status Switcher & Actions */}
                        <div className="space-y-3 pt-3 border-t border-gray-800">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            
                            {/* WhatsApp Customer Alert */}
                            <a
                              href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(
                                `Hello ${o.fullName}, this is ${settings.ownerName || 'Vikas Kumar'} from ${settings.ownerName || 'Vikas Kumar'} Atelier. Update regarding your Order #${orderKey}: Current Status is '${o.status || 'Paid & Confirmed'}'. Track live: https://cozycudlle.xyz`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Customer Update
                            </a>

                            {/* Quick Lifecycle Status Selector */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-bold text-gray-400 mr-1">Lifecycle Stage:</span>
                              <select
                                value={o.status || 'Paid & Confirmed'}
                                onChange={async (e) => {
                                  cozyAudio.playSoftTap();
                                  await updateOrderStatus(orderKey, e.target.value);
                                  showToast(`✓ Order #${orderKey} marked '${e.target.value}'`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                              >
                                <option value="Paid & Confirmed">Paid & Confirmed (Studio Verified)</option>
                                <option value="Processing & Crafting">Artisan Crafting & Packing</option>
                                <option value="Dispatched (In Transit)">Dispatched with Courier</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled (By Admin)">Cancelled (By Admin)</option>
                                <option value="Cancelled (Customer Request)">Cancelled (Customer Request)</option>
                              </select>

                              {/* Admin Instant Cancel Button */}
                              {!isCancelled && (
                                <button
                                  onClick={async () => {
                                    const reason = window.prompt('Enter reason for cancelling this order:', 'Out of Stock / Studio Request');
                                    if (reason) {
                                      cozyAudio.playSoftTap();
                                      await updateOrderStatus(orderKey, `Cancelled (Admin: ${reason})`);
                                      showToast(`Order #${orderKey} has been cancelled.`);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                                  title="Cancel Order and notify customer"
                                >
                                  ✕ Cancel Order
                                </button>
                              )}
                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & LIVE PRICE EDITOR */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-3xl border border-gray-800 shadow-sm flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">
                      Live Product Catalog & Pricing Manager
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800">
                      WORLDWIDE AUTO-SYNC
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ⚡ Changes made here are saved to the cloud and automatically update on the website worldwide!
                  </p>
                </div>

                <button
                  onClick={() => {
                    cozyAudio.playSoftTap();
                    setIsAddProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Add New Catalogue Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-40 object-cover rounded-2xl border border-gray-800"
                      />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase text-[#FF6B6B] bg-rose-950 px-2 py-0.5 rounded-full">
                            {prod.category}
                          </span>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Remove "${prod.name}" from live catalogue?`)) {
                                await deleteProduct(prod.id);
                                showToast('Product removed from catalog.');
                              }
                            }}
                            className="text-gray-500 hover:text-red-400 p-1"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">
                          {prod.name}
                        </h4>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Live Store Price:</span>
                        <span className="text-sm font-black text-white">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {editingProductId === prod.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editPriceValue}
                            onChange={(e) => setEditPriceValue(Number(e.target.value))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSavePrice(prod.id);
                              if (e.key === 'Escape') setEditingProductId(null);
                            }}
                            className="w-20 px-2 py-1 text-xs font-bold border rounded-lg bg-gray-900 text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(prod.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProductId(null)}
                            className="px-2 py-1 bg-gray-800 text-gray-400 rounded-lg text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingProductId(prod.id);
                            setEditPriceValue(prod.price);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-gray-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit ₹
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COUPONS & DISCOUNTS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B6B]" /> Create New Store Promo Code
                </h3>
                <p className="text-xs text-gray-400">
                  ⚡ Any coupon code you activate here can be applied immediately by customers at checkout!
                </p>
                <form onSubmit={handleAddCouponSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="Code (e.g. FESTIVE30)"
                    className="px-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white uppercase"
                  />
                  <div className="flex items-center">
                    <input
                      type="number"
                      required
                      min={5}
                      max={90}
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      placeholder="Discount %"
                      className="w-full px-3.5 py-2.5 rounded-l-xl border border-r-0 border-gray-700 bg-gray-900 text-xs font-bold text-white"
                    />
                    <span className="px-3 py-2.5 rounded-r-xl bg-gray-800 text-xs font-bold text-gray-300 border border-gray-700">
                      % OFF
                    </span>
                  </div>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="Description (e.g. Festival Launch Promo)"
                    className="px-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white"
                  />
                  <button
                    type="submit"
                    className="py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Activate Coupon
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#FF6B6B] tracking-wider font-mono bg-rose-950/80 px-3 py-1 rounded-xl border border-rose-900">
                        {c.code}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full">
                          {c.discountPercent}% OFF
                        </span>
                        <button
                          onClick={async () => {
                            await deleteCoupon(c.code);
                            showToast(`Coupon ${c.code} deleted.`);
                          }}
                          className="text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{c.description}</p>
                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Used {c.usageCount || 0} times</span>
                      <span className="text-emerald-400 font-bold">● Active Worldwide</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-black text-white">
                    Store Identity & WhatsApp Dispatch Settings
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    ⚡ Updating your WhatsApp destination phone or Free Gift milestone threshold immediately changes the customer website!
                  </p>
                </div>

                <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs font-bold text-gray-300">
                  <div>
                    <label className="block mb-1">Store Owner / Brand Name:</label>
                    <input
                      type="text"
                      value={ownerNameInput}
                      onChange={(e) => setOwnerNameInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Owner WhatsApp Order Receiving Number:</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 rounded-l-xl bg-gray-800 text-xs font-bold text-gray-300 border border-r-0 border-gray-700">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={ownerPhoneInput}
                        onChange={(e) => setOwnerPhoneInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Free Gift Box Milestone Threshold (₹):</label>
                    <input
                      type="number"
                      value={thresholdInput}
                      onChange={(e) => setThresholdInput(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" /> Save & Broadcast Settings Live
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ADD PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#1E293B] rounded-3xl border border-gray-700 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-950 text-[#FF6B6B] flex items-center justify-center font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Add New Catalogue Item</h3>
                  <p className="text-[11px] text-gray-400">Instantly publishes to cozycudlle.xyz worldwide</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1 bg-gray-800 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Organic Bamboo Sleepsuit & Cuddle Cap"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e: any) => setNewProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  >
                    <option value="clothes">Clothes & Outfits</option>
                    <option value="sleepwear">Sleepwear & Rompers</option>
                    <option value="nursery">Nursery & Bedding</option>
                    <option value="essentials">Essentials & Swaddles</option>
                    <option value="gift-sets">Gift Sets & Keepsakes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-emerald-400 font-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-bold mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Product Photo</label>
                <div className="space-y-2">
                  <select
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold"
                  >
                    {presetImages.map((pi, idx) => (
                      <option key={idx} value={pi.url}>
                        {pi.label} ({pi.url})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="Custom image URL (e.g. https://...)"
                    className="w-full px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-[11px] text-gray-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingProduct ? 'Publishing...' : '✨ Publish to Store Worldwide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE SCANNER FULFILLMENT MODAL */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* SHIPPING WAYBILL MODAL */}
      {selectedOrderForWaybill && (
        <ShippingWaybillModal
          order={selectedOrderForWaybill}
          onClose={() => setSelectedOrderForWaybill(null)}
        />
      )}

    </div>
  );
};
