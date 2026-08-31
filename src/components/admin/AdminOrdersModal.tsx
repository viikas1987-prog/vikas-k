import React, { useState, useEffect } from 'react';
import {
  X,
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
} from 'lucide-react';
import { products as initialProducts } from '../../data/products';
import { cozyAudio } from '../../utils/audioSynth';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'settings'>('overview');

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);

  // Products State
  const [productsList, setProductsList] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([
    { code: 'VIKAS30', discountPercent: 30, description: 'Vikas Kumar 30% Special Launch Deal', active: true, usageCount: 42 },
    { code: 'VIKASLOVE', discountPercent: 10, description: '10% Family & Friends Welcome Code', active: true, usageCount: 18 },
    { code: 'COZY10', discountPercent: 10, description: 'Newsletter 10% First Order Coupon', active: true, usageCount: 9 },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);

  // Settings State
  const [ownerName, setOwnerName] = useState('Vikas Kumar');
  const [ownerPhone, setOwnerPhone] = useState('8360303562');
  const [freeGiftThreshold, setFreeGiftThreshold] = useState(1499);
  const [isSavedSettings, setIsSavedSettings] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    // 1. Load Orders (Seed sample orders if empty)
    const savedOrders = JSON.parse(localStorage.getItem('vk_orders') || '[]');
    if (savedOrders.length === 0) {
      const sampleSeedOrders = [
        {
          orderId: 'VK-948201',
          fullName: 'Ananya Sharma',
          phone: '9876543210',
          address: 'Flat 402, Sunshine Heights, Bandra West, Mumbai - 400050',
          paymentMethod: 'upi',
          finalTotal: 1698,
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          status: 'Pending',
          items: [
            { product: { name: 'Tinkle Comfy Girls Tops (2-PC Combo)', price: 799 }, quantity: 1, selectedSize: '7-8 Years', selectedColor: { name: 'Blossom Pink' } },
            { product: { name: 'Boston 91 Retro Star Graphic Oversized Tee', price: 899 }, quantity: 1, selectedSize: 'L (38)', selectedColor: { name: 'Royal Cobalt Blue' } },
          ],
        },
        {
          orderId: 'VK-839120',
          fullName: 'Rohit Verma',
          phone: '9123456789',
          address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru - 560066',
          paymentMethod: 'cod',
          finalTotal: 1399,
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          status: 'Dispatched',
          items: [
            { product: { name: 'Stylus Women Performance Duo Sports Combo (2-Pack)', price: 1399 }, quantity: 1, selectedSize: 'M (36)', selectedColor: { name: 'Charcoal Duo' } },
          ],
        },
        {
          orderId: 'VK-712849',
          fullName: 'Sneha Patel',
          phone: '9898981234',
          address: 'B-104, Shivalik Residency, Satellite, Ahmedabad - 380015',
          paymentMethod: 'upi',
          finalTotal: 2098,
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: 'Delivered',
          items: [
            { product: { name: 'Princess Stylish Girls Turtleneck Sweater', price: 699 }, quantity: 1, selectedSize: '8-9 Years', selectedColor: { name: 'Midnight Jet Black' } },
            { product: { name: 'Boston 91 Streetwear Duo (Twin Pack)', price: 1599 }, quantity: 1, selectedSize: 'M', selectedColor: { name: 'Cobalt & Black' } },
          ],
        },
      ];
      setOrders(sampleSeedOrders);
      localStorage.setItem('vk_orders', JSON.stringify(sampleSeedOrders));
    } else {
      setOrders(savedOrders);
    }

    // 2. Load Products
    const savedProducts = JSON.parse(localStorage.getItem('vk_admin_products') || 'null');
    if (savedProducts) {
      setProductsList(savedProducts);
    } else {
      setProductsList(initialProducts);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    cozyAudio.playSoftTap();
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('vk_orders', JSON.stringify(updated));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Delete this order record?')) {
      const updated = orders.filter((o) => o.orderId !== orderId);
      setOrders(updated);
      localStorage.setItem('vk_orders', JSON.stringify(updated));
    }
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

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    const updated = productsList.map((p) => (p.id === productId ? { ...p, price: newPrice } : p));
    setProductsList(updated);
    localStorage.setItem('vk_admin_products', JSON.stringify(updated));
    setEditingProduct(null);
    cozyAudio.playSparkle();
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponDiscount),
      description: `${newCouponDiscount}% Storewide Promo Discount`,
      active: true,
      usageCount: 0,
    };
    setCoupons([newCoupon, ...coupons]);
    setNewCouponCode('');
    cozyAudio.playCelebration();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedSettings(true);
    cozyAudio.playCelebration();
    setTimeout(() => setIsSavedSettings(false), 3000);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-6xl h-[92vh] bg-[#FFFDF9] dark:bg-gray-950 rounded-4xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Bar */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center text-xl shadow-md">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  Vikas Kumar Atelier
                </h2>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-rose-50 dark:bg-rose-950/60 text-[#FF6B6B] px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                  Store Manager Pro
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Connected WhatsApp: <strong>+91 {ownerPhone}</strong> • Store Currency: <strong>INR (₹)</strong>
              </p>
            </div>
          </div>

          {/* Tab Navigation Switches */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-2xl">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
              { id: 'products', label: `Catalog (${productsList.length})`, icon: Package },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'settings', label: 'Settings', icon: Settings },
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-gray-900 text-[#FF6B6B] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition items-center gap-1.5 cursor-pointer shadow-sm"
              title="Export all orders to Excel"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-[#FF6B6B] hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="flex lg:hidden overflow-x-auto px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: 'Catalog', icon: Package },
            { id: 'coupons', label: 'Coupons', icon: Tag },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#FF6B6B] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +100% All-India Free Delivery
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#FF6B6B]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {orders.length}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {pendingOrders} Pending • {dispatchedOrders} In Transit
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Avg. Order Value</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}
                  </h3>
                  <p className="text-[11px] text-blue-600 font-bold">
                    High Conversion Rate
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Catalog Lines</span>
                    <Package className="w-4 h-4 text-purple-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {productsList.length}
                  </h3>
                  <p className="text-[11px] text-purple-600 font-bold">
                    Ready to Dispatch
                  </p>
                </div>
              </div>

              {/* Order Status Distribution & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Order Stream */}
                <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white">
                      Recent Incoming Orders
                    </h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#FF6B6B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All Orders <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 3).map((o) => (
                      <div
                        key={o.orderId}
                        className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#FF6B6B] flex items-center justify-center font-bold text-xs">
                            📦
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                              {o.fullName} <span className="text-gray-400 font-normal">({o.orderId})</span>
                            </p>
                            <p className="text-[11px] text-gray-500 truncate max-w-[240px]">
                              {o.items?.length} items • ₹{o.finalTotal?.toLocaleString('en-IN')} via {o.paymentMethod?.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              o.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-700'
                                : o.status === 'Dispatched'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {o.status || 'Pending'}
                          </span>
                          <a
                            href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(`Hello ${o.fullName}, this is Vikas Kumar from Vikas Kumar Atelier regarding order #${o.orderId}...`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366] text-white hover:opacity-90 cursor-pointer"
                            title="WhatsApp Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 1 Col: Quick Control Center */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">
                    Manager Quick Tools
                  </h4>

                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Edit Catalog Prices</p>
                          <p className="text-[10px] text-gray-500">Update Rupees (₹) across 8 apparel lines</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('coupons')}
                      className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-emerald-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Create Promo Coupon</p>
                          <p className="text-[10px] text-gray-500">Add 20% or 30% discount codes</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={exportCSV}
                      className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Download Courier Manifest</p>
                          <p className="text-[10px] text-gray-500">Excel / CSV for India Post / Delhivery</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fade-in">
              {/* Search & Filter Bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone, city, or order ID..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Status:
                  </span>
                  {['all', 'Pending', 'Dispatched', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        statusFilter.toLowerCase() === st.toLowerCase()
                          ? 'bg-[#FF6B6B] text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {st === 'all' ? 'All' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Grid/List */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <span className="text-4xl">🔍</span>
                    <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mt-2">No matching orders found</h4>
                    <p className="text-xs text-gray-500 mt-1">Try searching with a different name or phone number</p>
                  </div>
                ) : (
                  filteredOrders.map((o) => (
                    <div
                      key={o.orderId}
                      className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 hover:border-rose-200 transition"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#FF6B6B]">#{o.orderId}</span>
                          <span className="text-xs text-gray-400 font-semibold">
                            {new Date(o.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            ₹{o.finalTotal?.toLocaleString('en-IN')} ({o.paymentMethod?.toUpperCase()})
                          </span>
                          <button
                            onClick={() => setSelectedOrderForInvoice(o)}
                            className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Print Invoice / Shipping Label"
                          >
                            <Printer className="w-3.5 h-3.5" /> Invoice
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(o.orderId)}
                            className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customer Info & Address */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-2xl">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-900 dark:text-white">
                            <span className="text-gray-400 font-normal">Customer:</span> {o.fullName}
                          </p>
                          <p className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#FF6B6B]" /> +91 {o.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{o.address}</span>
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                          Ordered Items:
                        </span>
                        {o.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-gray-800 dark:text-gray-200">
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
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap gap-2">
                        <a
                          href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(`Hello ${o.fullName}, this is Vikas Kumar from Vikas Kumar Atelier. We have processed your order #${o.orderId} of ₹${o.finalTotal.toLocaleString('en-IN')} and it is currently marked as: ${o.status || 'Pending'}. Thank you for shopping with us!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Customer Status
                        </a>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-gray-400 mr-1">Update Status:</span>
                          {['Pending', 'Dispatched', 'Delivered'].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(o.orderId, st)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                (o.status || 'Pending') === st
                                  ? 'bg-[#FF6B6B] text-white shadow-sm'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
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

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">
                    Apparel Catalog & Pricing Manager
                  </h3>
                  <p className="text-xs text-gray-500">
                    Control live selling prices in Indian Rupees (`₹`) across all 8 product lines.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-40 object-cover rounded-2xl border border-gray-100 dark:border-gray-800"
                      />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#FF6B6B] bg-rose-50 px-2 py-0.5 rounded-full">
                          {prod.category}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1 line-clamp-2">
                          {prod.name}
                        </h4>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Selling Price:</span>
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {editingProduct?.id === prod.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            defaultValue={prod.price}
                            id={`price-${prod.id}`}
                            className="w-20 px-2 py-1 text-xs font-bold border rounded-lg"
                          />
                          <button
                            onClick={() => {
                              const val = (document.getElementById(`price-${prod.id}`) as HTMLInputElement)?.value;
                              if (val) handleUpdateProductPrice(prod.id, Number(val));
                            }}
                            className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
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
              {/* Add Coupon Form */}
              <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B6B]" /> Create New Store Promo Code
                </h3>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="Coupon Code (e.g. FESTIVE25)"
                    className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold uppercase"
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
                      className="w-full px-3.5 py-2.5 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold"
                    />
                    <span className="px-3 py-2.5 rounded-r-xl bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
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

              {/* Coupons List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#FF6B6B] tracking-wider font-mono bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-xl border border-rose-200 dark:border-rose-900">
                        {c.code}
                      </span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {c.discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{c.description}</p>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Used {c.usageCount} times</span>
                      <span className="text-emerald-500 font-bold">● Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: STORE SETTINGS & CONTACT */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    Store Identity & WhatsApp Dispatch Settings
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage the destination phone number for all customer orders and free delivery thresholds.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <div>
                    <label className="block mb-1">Store Owner / Brand Name:</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Owner WhatsApp Order Receiving Number:</label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 rounded-l-xl bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 border border-r-0 border-gray-200 dark:border-gray-700">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Free Gift Milestone Threshold (₹):</label>
                    <input
                      type="number"
                      value={freeGiftThreshold}
                      onChange={(e) => setFreeGiftThreshold(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    Save All Settings
                  </button>

                  {isSavedSettings && (
                    <span className="text-center block text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Settings updated successfully!
                    </span>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>

        {/* INVOICE & SHIPPING LABEL MODAL */}
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white text-gray-900 max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h4 className="text-base font-black text-[#FF6B6B]">VIKAS KUMAR ATELIER</h4>
                  <span className="text-[10px] text-gray-500 font-bold">OFFICIAL TAX INVOICE & SHIPPING MANIFEST</span>
                </div>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 bg-gray-50 p-3 rounded-2xl">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Invoice / Order Ref:</span>
                  <span className="font-black text-[#FF6B6B]">#{selectedOrderForInvoice.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Customer Name:</span>
                  <span className="font-bold">{selectedOrderForInvoice.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Contact:</span>
                  <span>+91 {selectedOrderForInvoice.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-500">Delivery Address:</span>
                  <span className="text-right max-w-[200px]">{selectedOrderForInvoice.address}</span>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-b py-2 space-y-1">
                <span className="font-bold text-gray-500 text-[10px] uppercase block mb-1">Manifest Items:</span>
                {selectedOrderForInvoice.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.product.name} ({item.selectedSize}) × {item.quantity}</span>
                    <span className="font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm font-black pt-1">
                <span>Total Amount Paid / COD:</span>
                <span className="text-emerald-600">₹{selectedOrderForInvoice.finalTotal?.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-3 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Shipping Label & Invoice
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
