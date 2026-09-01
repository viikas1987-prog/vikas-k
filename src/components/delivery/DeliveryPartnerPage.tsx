import React, { useState } from 'react';
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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cozyAudio } from '../../utils/audioSynth';

interface DeliveryPartnerPageProps {
  onReturnToStore: () => void;
}

export const DeliveryPartnerPage: React.FC<DeliveryPartnerPageProps> = ({ onReturnToStore }) => {
  const { orders, updateOrderStatus, addNotification } = useStore();

  // Courier Staff Auth / Identification
  const [courierPartner, setCourierPartner] = useState<'BlueDart' | 'Delhivery' | 'DTDC' | 'Shadowfax' | 'Ekart' | 'Other'>('BlueDart');
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [isIdentified, setIsIdentified] = useState(false);

  // Scanner State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState<any | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<{ orderId: string; time: string; action: string }>>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handover Authentication Step
  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim()) return;
    setIsIdentified(true);
    cozyAudio.playCelebration();
  };

  // Barcode Matching
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = barcodeInput.trim().toLowerCase();
    if (!clean) return;

    cozyAudio.playSoftTap();
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
    } else {
      setScannedOrder(null);
      setStatusMessage(`✕ No parcel matching barcode "${barcodeInput}". Please check the AWB label.`);
      cozyAudio.playSoftTap();
    }
  };

  // One-Click Status Update Actions
  const handleUpdateStatus = async (newStatus: string, actionLabel: string) => {
    if (!scannedOrder) return;
    setIsProcessing(true);
    const orderKey = scannedOrder.orderId || scannedOrder.id;

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
    setScanHistory((prev) => [
      {
        orderId: orderKey,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        action: actionLabel,
      },
      ...prev,
    ]);

    setScannedOrder((prev: any) => (prev ? { ...prev, status: newStatus } : null));
    setStatusMessage(`✓ Order #${orderKey} successfully marked: '${newStatus}'!`);
    setBarcodeInput('');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-100 flex flex-col font-sans selection:bg-[#FF6B6B]">
      
      {/* Header */}
      <header className="bg-[#1E293B] border-b border-gray-800 px-4 sm:px-8 py-3.5 flex items-center justify-between flex-wrap gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center font-bold text-xl shadow-md">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white leading-none">
                Logistics & Delivery Partner Terminal
              </h1>
              <span className="text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                COURIER HANDOVER
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Vikas Kumar Atelier Dispatch & Delivery Network
            </p>
          </div>
        </div>

        <button
          onClick={onReturnToStore}
          className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-700"
        >
          <Store className="w-3.5 h-3.5 text-[#FF6B6B]" />
          <span>Customer Storefront</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* STEP 1: DRIVER / COURIER IDENTIFICATION */}
        {!isIdentified ? (
          <div className="max-w-md mx-auto bg-[#1E293B] p-6 sm:p-8 rounded-4xl border border-gray-800 shadow-2xl space-y-6 animate-fade-in text-left">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-3xl bg-gray-900 border border-gray-700 flex items-center justify-center text-2xl mx-auto shadow-inner">
                📦
              </div>
              <h2 className="text-lg font-black text-white">Delivery Partner Check-In</h2>
              <p className="text-xs text-gray-400">
                Select your courier company and enter pickup agent details to begin scanning parcels.
              </p>
            </div>

            <form onSubmit={handleStartSession} className="space-y-4 text-xs font-bold text-gray-300">
              <div>
                <label className="block mb-1.5">Courier Organization:</label>
                <select
                  value={courierPartner}
                  onChange={(e: any) => setCourierPartner(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                >
                  <option value="BlueDart">BlueDart Express / Priority Air</option>
                  <option value="Delhivery">Delhivery Express</option>
                  <option value="DTDC">DTDC Air Cargo</option>
                  <option value="Shadowfax">Shadowfax Logistics</option>
                  <option value="Ekart">Ekart Logistics</option>
                  <option value="Other">Direct Courier / Local Delivery Agent</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5">Pickup Agent / Driver Name *</label>
                <input
                  type="text"
                  required
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar / Van 04"
                  className="w-full px-3.5 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>

              <div>
                <label className="block mb-1.5">Agent Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <UserCheck className="w-4 h-4" /> Start Barcode Scanning Session
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: ACTIVE SCANNING TERMINAL */
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Active Agent Info Banner */}
            <div className="p-4 rounded-3xl bg-[#1E293B] border border-gray-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-gray-300">
                  Active Session: <strong className="text-white">{agentName}</strong> ({courierPartner})
                </p>
              </div>
              <button
                onClick={() => setIsIdentified(false)}
                className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Switch Courier / Agent
              </button>
            </div>

            {/* Barcode Scanner Input Form */}
            <div className="p-6 rounded-3xl bg-[#1E293B] border border-gray-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-[#FF6B6B]" /> Scan Parcel AWB Barcode
                </h3>
                <span className="text-[11px] font-bold text-gray-400">
                  Scanned Today: <strong className="text-emerald-400">{scanHistory.length}</strong>
                </span>
              </div>

              <form onSubmit={handleScanSubmit} className="space-y-3">
                <div className="relative">
                  <Barcode className="w-5 h-5 absolute left-4 top-3.5 text-[#FF6B6B]" />
                  <input
                    type="text"
                    autoFocus
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan 4×6 shipping barcode or type Order ID (e.g. VK-839201 / AWB-)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-900 border border-gray-700 font-mono font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" /> Verify Parcel & Load Actions
                </button>
              </form>

              {statusMessage && (
                <p className={`text-xs font-bold pt-1 flex items-center gap-1.5 ${
                  statusMessage.includes('✓') ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {statusMessage.includes('✓') ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{statusMessage}</span>
                </p>
              )}
            </div>

            {/* Scanned Parcel Card with One-Click Actions */}
            {scannedOrder && (
              <div className="p-6 rounded-3xl bg-gray-900 border border-gray-700 shadow-xl space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="font-mono font-black text-white text-base">
                      #{scannedOrder.orderId || scannedOrder.id}
                    </span>
                    <p className="text-xs text-gray-400">
                      Customer: <strong className="text-white">{scannedOrder.fullName}</strong>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-950 text-[#FF6B6B] border border-rose-800">
                    Current: {scannedOrder.status || 'Paid & Confirmed'}
                  </span>
                </div>

                {/* Delivery Location */}
                <div className="p-3.5 rounded-2xl bg-gray-800/60 border border-gray-700 space-y-1 text-xs">
                  <p className="text-gray-300 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Destination Address:</strong> {scannedOrder.address}</span>
                  </p>
                  <p className="text-gray-400 text-[11px] pl-5.5">
                    📞 Customer Phone: +91 {scannedOrder.phone}
                  </p>
                </div>

                {/* Items in parcel */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    Package Items:
                  </span>
                  {scannedOrder.items?.map((item: any, i: number) => (
                    <p key={i} className="text-gray-300 text-xs">
                      • {item.product?.name || item.name} ({item.selectedSize || 'Standard'}) × {item.quantity || 1}
                    </p>
                  ))}
                </div>

                {/* Courier Actions */}
                <div className="pt-3 border-t border-gray-800 space-y-2">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                    Choose Delivery Action to Update Admin & Customer:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Action 1: Picked Up */}
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus(`Dispatched with ${courierPartner} (Picked Up)`, 'Picked Up & In Transit')}
                      className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Package className="w-4 h-4" />
                      <span>📦 1. Picked Up & In Transit</span>
                    </button>

                    {/* Action 2: Out for Delivery */}
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus('Out for Delivery', 'Out for Delivery')}
                      className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Truck className="w-4 h-4" />
                      <span>🚚 2. Out for Delivery</span>
                    </button>

                    {/* Action 3: Delivered */}
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUpdateStatus('Delivered', 'Delivered to Consignee')}
                      className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✨ 3. Marked Delivered</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Scan History in Current Session */}
            {scanHistory.length > 0 && (
              <div className="p-5 rounded-3xl bg-[#1E293B] border border-gray-800 space-y-3 text-xs">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Session Scan History ({scanHistory.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {scanHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono font-bold text-white">#{item.orderId}</span>
                      <span className="text-emerald-400 font-bold">{item.action}</span>
                      <span className="text-gray-500 text-[11px]">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};
