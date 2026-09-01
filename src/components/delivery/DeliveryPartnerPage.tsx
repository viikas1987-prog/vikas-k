import React, { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Barcode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  MapPin,
  Phone,
  ShieldCheck,
  RotateCcw,
  Check,
  Store,
  Clock,
  ArrowRight,
  UserCheck,
  Camera,
  CameraOff,
  Zap,
  Printer,
  Sparkles,
  FileText,
  ListOrdered,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cozyAudio } from '../../utils/audioSynth';

interface DeliveryPartnerPageProps {
  onReturnToStore: () => void;
}

export const DeliveryPartnerPage: React.FC<DeliveryPartnerPageProps> = ({ onReturnToStore }) => {
  const { orders, updateOrderStatus, addNotification } = useStore();

  // Courier Staff Identification
  const [courierPartner, setCourierPartner] = useState<'BlueDart' | 'Delhivery' | 'DTDC' | 'Shadowfax' | 'Ekart' | 'Other'>('BlueDart');
  const [agentName, setAgentName] = useState(() => localStorage.getItem('vk_courier_agent') || 'BlueDart Pickup Team');
  const [agentPhone, setAgentPhone] = useState(() => localStorage.getItem('vk_courier_phone') || '');
  const [isIdentified, setIsIdentified] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'scan' | 'manifest' | 'pending'>('scan');

  // Scanner State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState<any | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<{ orderId: string; time: string; action: string; courier: string }>>(() => {
    try {
      const saved = localStorage.getItem('vk_courier_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Rapid Batch Pickup Mode (Auto-dispatch on scan)
  const [rapidMode, setRapidMode] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vk_courier_history', JSON.stringify(scanHistory));
    } catch (e) {}
  }, [scanHistory]);

  // Camera handling (Webcam / Back Camera on Mobile)
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: { facingMode: 'environment' },
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setStatusMessage('Camera access not available or blocked in browser. Use keyboard/laser entry.');
          setIsCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCameraActive]);

  // Handle Scan Submit
  const handleScanSubmit = async (customCode?: string) => {
    const raw = customCode || barcodeInput;
    const clean = raw.trim().toLowerCase();
    if (!clean) return;

    cozyAudio.playSoftTap();
    setIsProcessing(true);

    const found = orders.find((o) => {
      const ordId = (o.orderId || o.id || '').toLowerCase();
      const phone = (o.phone || '').toLowerCase();
      const utr = (o.utrNumber || '').toLowerCase();
      const rawClean = clean.replace(/^(awb-|vk-)/, '');

      return (
        ordId.includes(clean) ||
        ordId.includes(rawClean) ||
        phone.includes(clean) ||
        utr.includes(clean)
      );
    });

    if (found) {
      setScannedOrder(found);
      setStatusMessage(`✓ Parcel Found: #${found.orderId || found.id}`);
      cozyAudio.playSparkle();

      // If Rapid Mode is enabled, automatically mark as Dispatched & Handed Over!
      if (rapidMode) {
        await executeStatusUpdate(found, `Dispatched with ${courierPartner} (Picked Up)`, 'Rapid Studio Pickup');
      }
    } else {
      setScannedOrder(null);
      setStatusMessage(`✕ No parcel matching barcode "${raw}". Please check the AWB shipping label.`);
      cozyAudio.playSoftTap();
    }

    setIsProcessing(false);
  };

  // Status Update Execution
  const executeStatusUpdate = async (targetOrder: any, newStatus: string, actionLabel: string) => {
    if (!targetOrder) return;
    const orderKey = targetOrder.orderId || targetOrder.id;

    cozyAudio.playCelebration();

    // 1. Update Cloud Database
    await updateOrderStatus(orderKey, newStatus, {
      courierPartner,
      scannedByAgent: agentName,
      agentPhone,
      lastScanTimestamp: new Date().toISOString(),
    });

    // 2. Broadcast Live Notification to Admin Panel
    addNotification({
      type: 'HANDOVER_SCAN',
      title: `🚚 ${courierPartner} Delivery Scan: ${actionLabel}`,
      message: `Order #${orderKey} updated to '${newStatus}' by ${agentName} (${courierPartner})`,
      orderId: orderKey,
      courierName: courierPartner,
    });

    // 3. Add to Session Scan History
    const historyItem = {
      orderId: orderKey,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action: actionLabel,
      courier: courierPartner,
    };
    setScanHistory((prev) => [historyItem, ...prev]);

    setScannedOrder((prev: any) => (prev && (prev.orderId === orderKey || prev.id === orderKey) ? { ...prev, status: newStatus } : null));
    setStatusMessage(`🎉 Order #${orderKey} marked '${newStatus}'!`);
    setBarcodeInput('');
  };

  // Filter orders for Pending Pickup Manifest
  const pendingOrders = orders.filter((o) => {
    const st = (o.status || '').toLowerCase();
    return !st.includes('cancelled') && !st.includes('delivered') && !st.includes('dispatch');
  });

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 flex flex-col font-sans selection:bg-[#FF6B6B]">
      
      {/* Top Header */}
      <header className="bg-[#1E293B]/90 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center font-bold text-xl shadow-md">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-white leading-none">
                Delivery Partner & Logistics Terminal
              </h1>
              <span className="text-[9px] font-black uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                PORTAL LIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Vikas Kumar Atelier Dedicated Dispatch Portal • No Admin Access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToStore}
            className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-700"
          >
            <Store className="w-3.5 h-3.5 text-[#FF6B6B]" />
            <span className="hidden sm:inline">Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Courier Organization & Agent Switcher */}
        <div className="p-4 rounded-3xl bg-[#1E293B] border border-gray-800 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 font-bold">Courier:</span>
              <select
                value={courierPartner}
                onChange={(e: any) => setCourierPartner(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold text-xs"
              >
                <option value="BlueDart">BlueDart Priority Air</option>
                <option value="Delhivery">Delhivery Express</option>
                <option value="DTDC">DTDC Air Cargo</option>
                <option value="Shadowfax">Shadowfax Logistics</option>
                <option value="Ekart">Ekart Logistics</option>
                <option value="Other">Local Express Courier</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 font-bold">Agent:</span>
              <input
                type="text"
                value={agentName}
                onChange={(e) => {
                  setAgentName(e.target.value);
                  localStorage.setItem('vk_courier_agent', e.target.value);
                }}
                className="px-2.5 py-1 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold text-xs w-32 sm:w-44"
              />
            </div>
          </div>

          {/* Rapid Bulk Mode Toggle */}
          <button
            onClick={() => {
              cozyAudio.playSoftTap();
              setRapidMode(!rapidMode);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border ${
              rapidMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm animate-pulse'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
            title="Auto-dispatches on scan for fast multi-box pickups"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Rapid Pickup: {rapidMode ? 'ON (Auto-Mark)' : 'OFF'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          {[
            { id: 'scan', label: '📷 Barcode Scanner', icon: Barcode },
            { id: 'pending', label: `📦 Ready for Pickup (${pendingOrders.length})`, icon: ListOrdered },
            { id: 'manifest', label: `📋 Handover Manifest (${scanHistory.length})`, icon: FileText },
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
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6B6B] text-white shadow-lg'
                    : 'bg-gray-800/80 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BARCODE SCANNER */}
        {activeTab === 'scan' && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Live Camera Scanner Viewfinder */}
            {isCameraActive && (
              <div className="p-4 rounded-3xl bg-gray-900 border border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Camera className="w-4 h-4" /> Live Camera Stream Active
                  </span>
                  <button
                    onClick={() => setIsCameraActive(false)}
                    className="p-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative w-full h-56 sm:h-72 bg-black rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Laser Red Barcode Alignment Line */}
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_#ff0000] animate-pulse" />
                  <div className="absolute top-3 inset-x-4 text-center">
                    <span className="text-[10px] font-bold text-white/80 bg-black/60 px-3 py-1 rounded-full">
                      Point camera at 4×6 AWB shipping barcode on box
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Barcode Scanner Input Form */}
            <div className="p-6 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-[#FF6B6B]" /> Scan or Enter Parcel Barcode
                </h3>
                <button
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border ${
                    isCameraActive
                      ? 'bg-rose-950 text-[#FF6B6B] border-rose-800'
                      : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5 text-[#FF6B6B]" />}
                  <span>{isCameraActive ? 'Close Camera' : '📷 Open Camera Scanner'}</span>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScanSubmit();
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <Barcode className="w-5 h-5 absolute left-4 top-3.5 text-[#FF6B6B]" />
                  <input
                    type="text"
                    autoFocus
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan 4×6 AWB label or type Order ID (e.g. VK-839201)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-900 border border-gray-700 font-mono font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Search className="w-4 h-4" /> {isProcessing ? 'Verifying...' : 'Verify Parcel & Load Courier Actions'}
                </button>
              </form>

              {/* Instant Test Barcode Quick Chips */}
              {pendingOrders.length > 0 && (
                <div className="pt-2 border-t border-gray-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    ⚡ Instant 1-Tap Barcode Test Chips (Ready at Studio):
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pendingOrders.slice(0, 4).map((po) => (
                      <button
                        key={po.orderId || po.id}
                        onClick={() => {
                          setBarcodeInput(po.orderId || po.id);
                          handleScanSubmit(po.orderId || po.id);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-mono text-[11px] font-bold border border-gray-700 cursor-pointer flex items-center gap-1"
                      >
                        <span>#{po.orderId || po.id}</span>
                        <span className="text-[9px] text-emerald-400">({po.fullName})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {statusMessage && (
                <p className={`text-xs font-bold pt-1 flex items-center gap-1.5 ${
                  statusMessage.includes('✓') || statusMessage.includes('🎉') ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {statusMessage.includes('✓') || statusMessage.includes('🎉') ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>{statusMessage}</span>
                </p>
              )}
            </div>

            {/* Scanned Parcel Card with 1-Click Status Controls */}
            {scannedOrder && (
              <div className="p-6 rounded-3xl bg-gray-900 border border-gray-700 shadow-xl space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="font-mono font-black text-white text-base">
                      #{scannedOrder.orderId || scannedOrder.id}
                    </span>
                    <p className="text-xs text-gray-400">
                      Consignee: <strong className="text-white">{scannedOrder.fullName}</strong>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-950 text-[#FF6B6B] border border-rose-800">
                    {scannedOrder.status || 'Paid & Confirmed'}
                  </span>
                </div>

                {/* Delivery Location */}
                <div className="p-3.5 rounded-2xl bg-gray-800/60 border border-gray-700 space-y-1 text-xs">
                  <p className="text-gray-300 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Destination:</strong> {scannedOrder.address}</span>
                  </p>
                  <p className="text-gray-400 text-[11px] pl-5.5">
                    📞 Customer Contact: +91 {scannedOrder.phone}
                  </p>
                </div>

                {/* Package Items */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    Verified Package Items:
                  </span>
                  {scannedOrder.items?.map((item: any, i: number) => (
                    <p key={i} className="text-gray-300 text-xs">
                      • {item.product?.name || item.name} ({item.selectedSize || 'Standard'}) × {item.quantity || 1}
                    </p>
                  ))}
                </div>

                {/* Courier Action Buttons */}
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                    Choose Delivery Stage:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => executeStatusUpdate(scannedOrder, `Dispatched with ${courierPartner} (Picked Up)`, 'Studio Handover Pickup')}
                      className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Package className="w-4 h-4" />
                      <span>📦 1. Picked Up & In Transit</span>
                    </button>

                    <button
                      onClick={() => executeStatusUpdate(scannedOrder, 'Out for Delivery', 'Out for Delivery (On Van)')}
                      className="p-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Truck className="w-4 h-4" />
                      <span>🚚 2. Out for Delivery</span>
                    </button>

                    <button
                      onClick={() => executeStatusUpdate(scannedOrder, 'Delivered', 'Delivered to Customer')}
                      className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✨ 3. Marked Delivered</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: READY FOR PICKUP AT STUDIO */}
        {activeTab === 'pending' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 rounded-3xl bg-[#1E293B] border border-gray-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <h3 className="text-sm font-black text-white">Parcels Awaiting Courier Pickup</h3>
                <p className="text-gray-400 text-[11px]">Tap any parcel to instantly mark as picked up by {courierPartner}</p>
              </div>
              <button
                onClick={async () => {
                  if (window.confirm(`Mark all ${pendingOrders.length} parcels as picked up by ${courierPartner}?`)) {
                    for (const po of pendingOrders) {
                      await executeStatusUpdate(po, `Dispatched with ${courierPartner} (Batch Pickup)`, 'Batch Handover');
                    }
                  }
                }}
                disabled={pendingOrders.length === 0}
                className="px-4 py-2 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-bold text-xs cursor-pointer shadow-md disabled:opacity-50"
              >
                ⚡ Batch Pick Up All ({pendingOrders.length})
              </button>
            </div>

            <div className="space-y-3">
              {pendingOrders.length === 0 ? (
                <div className="p-12 text-center bg-[#1E293B] rounded-3xl border border-gray-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-white font-bold text-xs">All parcels have been picked up!</p>
                  <p className="text-gray-400 text-[11px]">No pending studio packages waiting for pickup.</p>
                </div>
              ) : (
                pendingOrders.map((o) => (
                  <div
                    key={o.orderId || o.id}
                    className="p-4 rounded-2xl bg-[#1E293B] border border-gray-800 flex items-center justify-between flex-wrap gap-3"
                  >
                    <div className="space-y-1">
                      <span className="font-mono font-black text-sm text-white">#{o.orderId || o.id}</span>
                      <p className="text-xs text-gray-300 font-bold">{o.fullName} ({o.address})</p>
                      <p className="text-[11px] text-gray-400">{o.items?.length || 1} items • Phone: +91 {o.phone}</p>
                    </div>

                    <button
                      onClick={() => executeStatusUpdate(o, `Dispatched with ${courierPartner} (Picked Up)`, 'Studio Handover Pickup')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Package className="w-3.5 h-3.5" /> 1-Tap Pick Up
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COURIER PICKUP MANIFEST */}
        {activeTab === 'manifest' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="p-4 rounded-3xl bg-[#1E293B] border border-gray-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <h3 className="text-sm font-black text-white">Session Handover Manifest</h3>
                <p className="text-gray-400 text-[11px]">Official proof of pickup for {agentName} ({courierPartner})</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs border border-gray-700 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#FF6B6B]" /> Print Manifest Slip
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white text-gray-900 border border-gray-300 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b-2 border-gray-900 pb-2">
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight">VIKAS KUMAR ATELIER</h2>
                  <p className="text-[10px] text-gray-600 font-bold">COURIER DISPATCH MANIFEST & HANDOVER LOG</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs">{courierPartner}</p>
                  <p className="text-[10px] text-gray-500">{new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-2">
                {scanHistory.length === 0 ? (
                  <p className="text-gray-500 py-6 text-center text-xs">No parcels scanned yet in this session.</p>
                ) : (
                  scanHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-gray-200 text-xs font-mono font-bold"
                    >
                      <span>{idx + 1}. ORD #{item.orderId}</span>
                      <span className="text-emerald-700">{item.action}</span>
                      <span className="text-gray-500 text-[11px]">{item.time}</span>
                    </div>
                  ))
                )}
              </div>

              {scanHistory.length > 0 && (
                <div className="pt-4 border-t-2 border-gray-900 flex justify-between items-end text-xs">
                  <div>
                    <p className="font-bold">Total Parcels Handed Over: {scanHistory.length}</p>
                    <p className="text-[10px] text-gray-500">Agent: {agentName}</p>
                  </div>
                  <div className="text-right border-t border-dashed border-gray-400 pt-3 px-4">
                    <span className="text-[9px] text-gray-400 uppercase block">Courier Pickup Signature</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
