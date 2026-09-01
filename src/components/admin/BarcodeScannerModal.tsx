import React, { useState } from 'react';
import { Barcode, Search, CheckCircle2, X, AlertTriangle, Package, Truck, MessageSquare, Send, Check, ShieldCheck, UserCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cozyAudio } from '../../utils/audioSynth';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus, addNotification, settings } = useStore();
  const [scannedInput, setScannedInput] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<any | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [courierPartner, setCourierPartner] = useState('BlueDart Priority Air');
  const [driverName, setDriverName] = useState('Courier Pickup Agent');
  const [handoverSuccess, setHandoverSuccess] = useState(false);

  if (!isOpen) return null;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = scannedInput.trim().toLowerCase();
    if (!clean) return;

    cozyAudio.playSparkle();
    setHasScanned(true);
    setHandoverSuccess(false);

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

    setMatchedOrder(found || null);
    if (found) {
      cozyAudio.playCelebration();
      setStatusMessage(`✓ Verified Order #${found.orderId || found.id} for Delivery Handover!`);
    } else {
      cozyAudio.playSoftTap();
      setStatusMessage(`✕ No active order matching barcode "${scannedInput}"`);
    }
  };

  // Handover Execution to Delivery Partner
  const handleConfirmHandover = async () => {
    if (!matchedOrder) return;
    const orderKey = matchedOrder.orderId || matchedOrder.id;
    const handoverStatus = `Dispatched with ${courierPartner} (Handover Confirmed)`;

    cozyAudio.playCelebration();

    // 1. Update Order Status in Cloud
    await updateOrderStatus(orderKey, handoverStatus, {
      courierPartner,
      driverName,
      handoverTimestamp: new Date().toISOString(),
    });

    // 2. Push Notification to Admin Panel
    addNotification({
      type: 'HANDOVER_SCAN',
      title: '📦 Delivery Partner Handover Confirmed',
      message: `Order #${orderKey} scanned & handed over to ${courierPartner} (${driverName}).`,
      orderId: orderKey,
      courierName: courierPartner,
    });

    setMatchedOrder((prev: any) => (prev ? { ...prev, status: handoverStatus } : null));
    setHandoverSuccess(true);
    setStatusMessage(`🎉 Handover Complete! Order #${orderKey} marked as dispatched with ${courierPartner}.`);
  };

  const handleAdminCancel = async () => {
    if (!matchedOrder) return;
    const orderKey = matchedOrder.orderId || matchedOrder.id;
    const reason = window.prompt('Enter reason for cancelling this order:', 'Item Out of Stock / Damaged');
    if (!reason) return;

    const cancelStatus = `Cancelled (By Admin: ${reason})`;
    await updateOrderStatus(orderKey, cancelStatus);

    // Push notification to Admin Panel
    addNotification({
      type: 'ADMIN_CANCELLED',
      title: '⚠️ Order Cancelled by Admin',
      message: `Order #${orderKey} cancelled due to: "${reason}". Customer notification triggered.`,
      orderId: orderKey,
    });

    setMatchedOrder((prev: any) => (prev ? { ...prev, status: cancelStatus } : null));
    setStatusMessage(`Order #${orderKey} has been cancelled.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 selection:bg-[#FF6B6B]">
      <div className="w-full max-w-xl bg-[#1E293B] rounded-3xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in text-left">
        
        {/* Header */}
        <div className="p-5 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#FFA8A8] text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Delivery Partner Handover Terminal</h3>
                <span className="text-[9px] font-black uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                  SCANNER ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Scan package barcode upon handover to courier partner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:bg-[#FF6B6B] hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Scanner Input */}
          <form onSubmit={handleScanSubmit} className="space-y-2">
            <label className="block text-gray-300 font-bold">
              Scan Package 4×6 AWB Barcode or Type Order ID:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="w-4 h-4 absolute left-3.5 top-3.5 text-[#FF6B6B]" />
                <input
                  type="text"
                  autoFocus
                  value={scannedInput}
                  onChange={(e) => setScannedInput(e.target.value)}
                  placeholder="e.g. AWB-102938 or VK-839201..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 font-mono font-bold text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs cursor-pointer shadow-md"
              >
                Scan & Verify
              </button>
            </div>
            {statusMessage && (
              <p className={`text-[11px] font-bold pt-1 ${statusMessage.includes('✓') || statusMessage.includes('🎉') ? 'text-emerald-400' : 'text-red-400'}`}>
                {statusMessage}
              </p>
            )}
          </form>

          {/* Result & Handover Box */}
          {matchedOrder ? (
            <div className="p-5 rounded-3xl bg-gray-900 border border-gray-700 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <span className="font-mono font-black text-white text-sm">
                    #{matchedOrder.orderId || matchedOrder.id}
                  </span>
                  <p className="text-[11px] text-gray-400">
                    Customer: <strong className="text-white">{matchedOrder.fullName}</strong> (+91 {matchedOrder.phone})
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {matchedOrder.status || 'Paid & Confirmed'}
                </span>
              </div>

              {/* Items in this parcel */}
              <div className="space-y-1.5 bg-gray-800/60 p-3.5 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                  Package Contents:
                </span>
                {matchedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-300">
                    <span>• {item.product?.name || item.name} ({item.selectedSize || 'Standard'}, {item.selectedColor?.name || 'Artisan'}) × {item.quantity || 1}</span>
                    <span className="font-bold">₹{((item.product?.price || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Handover Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Courier Partner:</label>
                  <select
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-bold text-xs"
                  >
                    <option value="BlueDart Priority Air">BlueDart Priority Air</option>
                    <option value="Delhivery Express">Delhivery Express</option>
                    <option value="DTDC Air Cargo">DTDC Air Cargo</option>
                    <option value="Shadowfax Courier">Shadowfax Courier</option>
                    <option value="Ekart Logistics">Ekart Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Driver / Agent Name:</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Ramesh / BlueDart Van 04"
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white font-bold text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <button
                  onClick={handleConfirmHandover}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> 🤝 Confirm Handover & Notify Admin & Customer
                </button>

                {/* WhatsApp Direct Notification Link to Customer */}
                <a
                  href={`https://wa.me/91${matchedOrder.phone}?text=${encodeURIComponent(
                    `Hello ${matchedOrder.fullName}, your Vikas Kumar Atelier Order #${matchedOrder.orderId || matchedOrder.id} has just been scanned and handed over to ${courierPartner}! Tracking is live at: https://cozycudlle.xyz/#track`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> Send Customer Handover Update on WhatsApp
                </a>

                {/* Cancel Action */}
                <button
                  onClick={handleAdminCancel}
                  className="w-full py-2 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs cursor-pointer"
                >
                  ✕ Cancel Order & Initiate Customer Refund
                </button>
              </div>
            </div>
          ) : hasScanned && (
            <div className="p-6 text-center bg-gray-900/60 rounded-3xl border border-gray-800 space-y-2">
              <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-gray-300 font-bold">No order found matching barcode</p>
              <p className="text-[11px] text-gray-500">Please verify the Order ID or barcode string and scan again.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
