import React, { useState } from 'react';
import { Barcode, Search, CheckCircle2, X, AlertTriangle, Package, Truck, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cozyAudio } from '../../utils/audioSynth';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus } = useStore();
  const [scannedInput, setScannedInput] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<any | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = scannedInput.trim().toLowerCase();
    if (!clean) return;

    cozyAudio.playSparkle();
    setHasScanned(true);

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
      setStatusMessage(`Found Order #${found.orderId || found.id}`);
    } else {
      cozyAudio.playSoftTap();
      setStatusMessage(`No order matching barcode "${scannedInput}"`);
    }
  };

  const handleQuickStatus = async (newStatus: string) => {
    if (!matchedOrder) return;
    const orderKey = matchedOrder.orderId || matchedOrder.id;
    cozyAudio.playSoftTap();
    await updateOrderStatus(orderKey, newStatus);
    setMatchedOrder((prev: any) => (prev ? { ...prev, status: newStatus } : null));
    setStatusMessage(`Order #${orderKey} updated to '${newStatus}'!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 selection:bg-[#FF6B6B]">
      <div className="w-full max-w-xl bg-[#1E293B] rounded-3xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in text-left">
        
        {/* Header */}
        <div className="p-5 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B6B] text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Live Barcode Fulfillment Scanner</h3>
              <p className="text-[11px] text-gray-400">Scan 4×6 AWB labels or enter Order ID for instant dispatch</p>
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
              Scan Barcode with USB Scanner or Type AWB / Order ID:
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
                Scan / Match
              </button>
            </div>
            {statusMessage && (
              <p className="text-[11px] font-bold text-emerald-400 pt-1">
                {statusMessage}
              </p>
            )}
          </form>

          {/* Result Card */}
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

              {/* Items to Pack */}
              <div className="space-y-1.5 bg-gray-800/60 p-3.5 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                  Items to Pack & Ship:
                </span>
                {matchedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-gray-300">
                    <span>• {item.product?.name || item.name} ({item.selectedSize || 'Standard'}, {item.selectedColor?.name || 'Artisan'}) × {item.quantity || 1}</span>
                    <span className="font-bold">₹{((item.product?.price || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* 1-Click Status Dispatch & Cancellation Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                  Quick Barcode Fulfillment Actions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickStatus('Processing & Crafting')}
                    className="p-2.5 rounded-xl bg-blue-950 text-blue-300 hover:bg-blue-900 font-bold text-xs cursor-pointer border border-blue-800"
                  >
                    📦 Mark Packed
                  </button>
                  <button
                    onClick={() => handleQuickStatus('Dispatched (In Transit)')}
                    className="p-2.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 font-bold text-xs cursor-pointer border border-emerald-800"
                  >
                    🚚 Mark Dispatched
                  </button>
                  <button
                    onClick={() => handleQuickStatus('Delivered')}
                    className="p-2.5 rounded-xl bg-purple-950 text-purple-300 hover:bg-purple-900 font-bold text-xs cursor-pointer border border-purple-800"
                  >
                    ✨ Mark Delivered
                  </button>
                  <button
                    onClick={() => handleQuickStatus('Cancelled (By Admin: Stock Issue)')}
                    className="p-2.5 rounded-xl bg-red-950 text-red-300 hover:bg-red-900 font-bold text-xs cursor-pointer border border-red-800 col-span-2 sm:col-span-3"
                  >
                    ✕ Cancel Order & Initiate Refund
                  </button>
                </div>
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
