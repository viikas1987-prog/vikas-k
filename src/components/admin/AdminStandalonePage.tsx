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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cozyAudio } from '../../utils/audioSynth';
import { ShippingWaybillModal } from './ShippingWaybillModal';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderForWaybill, setSelectedOrderForWaybill] = useState<any | null>(null);

  // Local Product Edit State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'clothes' | 'sleepwear' | 'nursery' | 'essentials' | 'gift-sets'>('clothes');
  const [newProdPrice, setNewProdPrice] = useState(1499);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(2199);
  const [newProdDescription, setNewProdDescription] = useState('Handcrafted with certified 100% organic cotton for infant comfort.');
  const [newProdImage, setNewProdImage] = useState('/images/products/boston-91-combo-pack.png');
  const [newProdStock, setNewProdStock] = useState(25);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // New Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);

  // Local Settings Form State
  const [ownerNameInput, setOwnerNameInput] = useState(settings.ownerName);
  const [ownerPhoneInput, setOwnerPhoneInput] = useState(settings.ownerPhone);
  const [thresholdInput, setThresholdInput] = useState(settings.freeGiftThreshold);
  const [isSavedSettings, setIsSavedSettings] = useState(false);

  useEffect(() => {
    setOwnerNameInput(settings.ownerName);
    setOwnerPhoneInput(settings.ownerPhone);
    setThresholdInput(settings.freeGiftThreshold);
  }, [settings]);

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    setIsSavingProduct(true);
    cozyAudio.playCelebration();

    const newProduct: any = {
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
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (clean === 'cozycuddle007') {
      setIsAuthenticated(true);
      localStorage.setItem('vk_admin_auth', 'true');
      setAuthError(false);
      cozyAudio.playCelebration();
    } else {
      setAuthError(true);
      cozyAudio.playSoftTap();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vk_admin_auth');
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    updateProductPrice(productId, newPrice);
    setEditingProductId(null);
    cozyAudio.playSparkle();
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon(newCouponCode, Number(newCouponDiscount));
    setNewCouponCode('');
    cozyAudio.playCelebration();
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ownerName: ownerNameInput.trim(),
      ownerPhone: ownerPhoneInput.trim(),
      freeGiftThreshold: Number(thresholdInput),
    });
    setIsSavedSettings(true);
    cozyAudio.playCelebration();
    setTimeout(() => setIsSavedSettings(false), 3000);
  };

  const exportCSV = () => {
    cozyAudio.playCelebration();
    const headers = 'Order ID,Date,Customer Name,Phone,Address,Payment Mode,Items,Total (INR),Status\n';
    const rows = orders
      .map((o) => {
        const items = o.items?.map((i: any) => `${i.product.name} (Qty:${i.quantity})`).join('; ') || '';
        return `"${o.orderId}","${new Date(o.timestamp).toLocaleString()}","${o.fullName}","${o.phone}","${o.address}","${o.paymentMethod}","${items}","${o.finalTotal}","${o.status || 'Pending'}"`;
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

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone?.includes(searchQuery) ||
      o.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (o.status || 'Pending').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const pendingOrders = orders.filter((o) => (o.status || 'Pending') === 'Pending').length;
  const dispatchedOrders = orders.filter((o) => o.status === 'Dispatched').length;

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center p-4 selection:bg-[#FF6B6B]">
        <div className="w-full max-w-md bg-[#1F2937] p-8 rounded-4xl border border-gray-700 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] flex items-center justify-center text-3xl mx-auto shadow-lg">
            👑
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{settings.ownerName || 'Vikas Kumar'} Atelier</h2>
            <p className="text-xs text-gray-400 mt-1">
              Live Interconnected Management Portal • Restricted Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Admin Master Passcode:
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter secret passcode..."
                className="w-full px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
              {authError && (
                <span className="text-[11px] font-bold text-red-400 mt-1.5 block">
                  Access Denied: Incorrect passcode.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              Sign In to Management Portal
            </button>
          </form>

          <div className="pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
            <button onClick={onReturnToStore} className="hover:text-white transition cursor-pointer font-bold">
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100 font-sans flex flex-col selection:bg-[#FF6B6B] selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 bg-[#1E293B] border-b border-gray-700/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center text-xl shadow-md">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">
                {settings.ownerName || 'Vikas Kumar'} Atelier
              </h1>
              <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-700">
                GLOBAL CLOUD DATABASE LIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Connected Store WhatsApp: <strong>+91 {settings.ownerPhone}</strong> • Free Gift Threshold: <strong>₹{settings.freeGiftThreshold.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              cozyAudio.playSoftTap();
              syncWithCloud();
            }}
            disabled={isCloudSyncing}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-600 shadow-sm"
            title="Fetch latest customer orders from global cloud database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin text-[#FF6B6B]' : 'text-emerald-400'}`} />
            <span className="hidden sm:inline">{isCloudSyncing ? 'Syncing...' : 'Cloud Sync'}</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-600"
          >
            <Download className="w-3.5 h-3.5" /> Export Manifest
          </button>
          <button
            onClick={onReturnToStore}
            className="px-3.5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Store className="w-3.5 h-3.5" /> View Storefront
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-gray-800 hover:bg-red-950 text-gray-300 hover:text-red-400 border border-gray-700 transition cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main App Layout: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#1E293B]/90 border-r border-gray-800 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
            { id: 'orders', label: `Orders & Barcodes (${orders.length})`, icon: ShoppingBag },
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
                    <span className="text-xs font-bold uppercase">Total Revenue</span>
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
                    {pendingOrders} Pending • {dispatchedOrders} In Transit
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase">Avg Order Value</span>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}
                  </h3>
                  <p className="text-[11px] text-blue-400 font-bold">Strong Basket Size</p>
                </div>

                <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase">Active Lines</span>
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{products.length}</h3>
                  <p className="text-[11px] text-purple-400 font-bold">In Stock & Live</p>
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
                  {orders.slice(0, 3).map((o) => (
                    <div
                      key={o.orderId}
                      className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800 flex items-center justify-between flex-wrap gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-[#FF6B6B] flex items-center justify-center font-bold text-base">
                          📦
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {o.fullName} <span className="text-gray-400 font-normal">({o.orderId})</span>
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {o.items?.length} items • ₹{o.finalTotal?.toLocaleString('en-IN')} via {o.paymentMethod?.toUpperCase()}
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
                          href={`https://wa.me/91${o.phone}?text=Hello%20${encodeURIComponent(o.fullName)},%20regarding%20order%20${o.orderId}...`}
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

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Status:
                  </span>
                  {['all', 'Pending', 'Dispatched', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        statusFilter.toLowerCase() === st.toLowerCase()
                          ? 'bg-[#FF6B6B] text-white shadow-sm'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {st === 'all' ? 'All' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cards */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-[#1E293B] rounded-3xl border border-gray-800">
                    <span className="text-4xl">🔍</span>
                    <h4 className="text-base font-bold text-white mt-2">No matching orders found</h4>
                  </div>
                ) : (
                  filteredOrders.map((o) => (
                    <div
                      key={o.orderId}
                      className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 space-y-4 hover:border-gray-700 transition"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#FF6B6B]">#{o.orderId}</span>
                          <span className="text-xs text-gray-400 font-semibold">
                            {new Date(o.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                            ₹{o.finalTotal?.toLocaleString('en-IN')} ({o.paymentMethod?.toUpperCase()})
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
                              if (window.confirm('Delete this order?')) {
                                deleteOrder(o.orderId);
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
                              • <strong>{item.product.name}</strong> ({item.selectedSize}, {item.selectedColor?.name}) × {item.quantity}
                            </span>
                            <span className="font-bold">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Dispatch Switcher & Customer WhatsApp Action */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-800 flex-wrap gap-2">
                        <a
                          href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(`Hello ${o.fullName}, this is ${settings.ownerName || 'Vikas Kumar'} from ${settings.ownerName || 'Vikas Kumar'} Atelier. Your order #${o.orderId} of ₹${o.finalTotal.toLocaleString('en-IN')} is marked as: ${o.status || 'Pending'}. Thank you for shopping with us!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Customer Status
                        </a>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-gray-400 mr-1">Status:</span>
                          {['Pending', 'Dispatched', 'Delivered'].map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                cozyAudio.playSoftTap();
                                updateOrderStatus(o.orderId, st);
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                (o.status || 'Pending') === st
                                  ? 'bg-[#FF6B6B] text-white shadow-sm'
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))
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
                        <span className="text-[10px] font-extrabold uppercase text-[#FF6B6B] bg-rose-950 px-2 py-0.5 rounded-full">
                          {prod.category}
                        </span>
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
                            defaultValue={prod.price}
                            id={`price-${prod.id}`}
                            className="w-20 px-2 py-1 text-xs font-bold border rounded-lg bg-gray-900 text-white"
                          />
                          <button
                            onClick={() => {
                              const val = (document.getElementById(`price-${prod.id}`) as HTMLInputElement)?.value;
                              if (val) handleUpdatePrice(prod.id, Number(val));
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingProductId(prod.id)}
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
                <form onSubmit={handleAddCouponSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="Coupon Code (e.g. SPECIAL40)"
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
                          onClick={() => deleteCoupon(c.code)}
                          className="text-gray-500 hover:text-red-400 p-1"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{c.description}</p>
                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Used {c.usageCount} times</span>
                      <span className="text-emerald-400 font-bold">● Active on Store</span>
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white"
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
                        className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Free Gift Milestone Threshold (₹):</label>
                    <input
                      type="number"
                      value={thresholdInput}
                      onChange={(e) => setThresholdInput(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-xs font-bold text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    Save All Settings & Sync Store
                  </button>

                  {isSavedSettings && (
                    <span className="text-center block text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Storefront settings synced successfully!
                    </span>
                  )}
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4x6 Shipping Waybill with Barcode Modal */}
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
                <label className="block text-gray-300 font-bold mb-1">Product Image URL or Path</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="/images/products/boston-91-combo-pack.png or https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white font-mono text-[11px]"
                />
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

      {selectedOrderForWaybill && (
        <ShippingWaybillModal
          order={selectedOrderForWaybill}
          onClose={() => setSelectedOrderForWaybill(null)}
        />
      )}
    </div>
  );
};
