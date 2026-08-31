import React, { useState } from 'react';
import {
  Truck,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  X,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cozyAudio } from '../../utils/audioSynth';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
}) => {
  const { orders, updateOrderStatus, isCloudSyncing, syncWithCloud, settings } = useStore();
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(() => {
    if (initialOrderId) {
      return orders.find(
        (o) => (o.orderId || o.id)?.toLowerCase() === initialOrderId.toLowerCase()
      ) || null;
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));

  // Cancellation State
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');
  const [isCancelling, setIsCancelling] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().toLowerCase();
    if (!clean) return;

    cozyAudio.playSoftTap();
    setHasSearched(true);

    // Refresh cloud orders to ensure most recent state
    await syncWithCloud().catch(() => {});

    const found = orders.find(
      (o) =>
        (o.orderId || o.id)?.toLowerCase().includes(clean) ||
        o.phone?.includes(clean) ||
        o.utrNumber?.includes(clean) ||
        o.fullName?.toLowerCase().includes(clean)
    );

    setSearchedOrder(found || null);
  };

  const handleCustomerCancelOrder = async () => {
    if (!searchedOrder) return;
    setIsCancelling(true);
    cozyAudio.playSoftTap();

    const orderKey = searchedOrder.orderId || searchedOrder.id;
    const newStatus = `Cancelled (Customer: ${cancelReason})`;

    await updateOrderStatus(orderKey, newStatus);
    setSearchedOrder((prev: any) => (prev ? { ...prev, status: newStatus } : null));

    setIsCancelling(false);
    setIsCancelConfirmOpen(false);
  };

  // Determine Stepper Stage
  const getStepProgress = (status: string = '') => {
    const s = status.toLowerCase();
    if (s.includes('cancelled')) return -1;
    if (s.includes('delivered')) return 4;
    if (s.includes('out for delivery')) return 3;
    if (s.includes('dispatch') || s.includes('transit')) return 2;
    if (s.includes('process') || s.includes('craft')) return 1;
    return 0; // Placed / Paid
  };

  const currentStep = searchedOrder ? getStepProgress(searchedOrder.status) : 0;
  const isCancelled = searchedOrder?.status?.toLowerCase().includes('cancelled');
  const canCancel = searchedOrder && !isCancelled && currentStep <= 1;

  const steps = [
    { title: 'Order Confirmed & Paid', desc: 'UTR & payment verified with studio', icon: CheckCircle2 },
    { title: 'Artisan Crafting & Packing', desc: 'Quality checked at Vikas Kumar Atelier', icon: Package },
    { title: 'Dispatched & In Transit', desc: 'Handed to premium express courier', icon: Truck },
    { title: 'Out for Delivery', desc: 'Courier agent reaching your doorstep', icon: MapPin },
    { title: 'Delivered', desc: 'Enjoy your cozy cuddle moments!', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 selection:bg-[#FF6B6B]">
      <div className="w-full max-w-2xl bg-[#FFF9F6] dark:bg-[#1E293B] rounded-4xl border border-cozy-blush/60 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#FFE8E1] to-[#FFF3EB] dark:from-[#2A3447] dark:to-[#1E293B] border-b border-cozy-blush/40 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B6B] text-white flex items-center justify-center text-2xl shadow-md">
              🚚
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#3E2723] dark:text-white leading-tight">
                Live Order Tracking & Shipment Status
              </h2>
              <p className="text-xs text-cozy-warmBrown/80 dark:text-gray-400">
                Track your Vikas Kumar Atelier packages across India in real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#FF6B6B] hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. VK-102938) or WhatsApp Phone Number..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-cozy-blush/60 dark:border-gray-700 text-xs font-bold text-[#3E2723] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isCloudSyncing}
              className="px-6 py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              {isCloudSyncing ? 'Searching...' : 'Track Package'}
            </button>
          </form>

          {/* Results Area */}
          {hasSearched && !searchedOrder && (
            <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-cozy-blush/40 dark:border-gray-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl mx-auto">
                🔎
              </div>
              <h3 className="text-sm font-bold text-[#3E2723] dark:text-white">No Order Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                We couldn't find an active shipment matching <strong>"{searchInput}"</strong>. Please double-check your Order ID from your confirmation receipt.
              </p>
              <a
                href={`https://wa.me/91${settings.ownerPhone}?text=Hello%20Vikas%20Kumar,%20I%20need%20help%20tracking%20my%20order:`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Need Assistance? Chat with Vikas Kumar on WhatsApp
              </a>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Order Quick Bar */}
              <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-cozy-blush/60 dark:border-gray-800 shadow-sm flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#3E2723] dark:text-white">
                      #{searchedOrder.orderId || searchedOrder.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isCancelled
                          ? 'bg-red-950 text-red-400 border-red-800'
                          : currentStep >= 4
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-rose-950 text-[#FF6B6B] border-rose-800'
                      }`}
                    >
                      {searchedOrder.status || 'Paid & Confirmed'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Customer: <strong>{searchedOrder.fullName}</strong> • Placed:{' '}
                    {new Date(searchedOrder.timestamp || searchedOrder.date || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Total Amount:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹{(searchedOrder.finalTotal || searchedOrder.total || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* CANCELLED NOTIFICATION */}
              {isCancelled ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-red-500 text-xs">This Order Has Been Cancelled</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                      Status: <strong>{searchedOrder.status}</strong>. If a payment was deducted via UPI, your refund will be processed back to your original source account within 2-4 business days.
                    </p>
                    <a
                      href={`https://wa.me/91${settings.ownerPhone}?text=Hello%20Vikas%20Kumar,%20inquiring%20about%20refund%20for%20cancelled%20order%20${searchedOrder.orderId || searchedOrder.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Contact Vikas Kumar on WhatsApp regarding refund
                    </a>
                  </div>
                </div>
              ) : (
                /* LIVE TIMELINE STEPPER */
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-cozy-blush/60 dark:border-gray-800 space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-cozy-rose dark:text-[#FF6B6B]">
                    Shipment Journey
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = currentStep >= idx;
                      const isCurrent = currentStep === idx;

                      return (
                        <div key={idx} className="relative flex items-start gap-3 group">
                          <div
                            className={`w-6 h-6 rounded-full -ml-[31px] flex items-center justify-center text-xs transition-all shadow-sm ${
                              isCompleted
                                ? 'bg-[#FF6B6B] text-white ring-4 ring-[#FF6B6B]/20'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-[#FF6B6B] dark:text-[#FF6B6B]'
                                    : isCompleted
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step.title}
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-[#FF6B6B] text-[9px] font-black uppercase animate-pulse">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shipment & Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-cozy-blush/40 dark:border-gray-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Delivery Address:</span>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{searchedOrder.fullName}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{searchedOrder.address}</p>
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">📱 +91 {searchedOrder.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-cozy-blush/40 dark:border-gray-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Payment & Carrier:</span>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Payment Mode: {searchedOrder.paymentMethod || 'UPI'}
                  </p>
                  {searchedOrder.utrNumber && (
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      UTR Ref: {searchedOrder.utrNumber}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Express Logistics: <strong>BlueDart / Delhivery Surface Express</strong>
                  </p>
                </div>
              </div>

              {/* Items in Order */}
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-cozy-blush/40 dark:border-gray-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Ordered Items:</span>
                <div className="space-y-1.5">
                  {searchedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span>
                        • <strong>{item.product?.name || item.name}</strong> ({item.selectedSize || 'Standard'}, {item.selectedColor?.name || 'Artisan'}) × {item.quantity || 1}
                      </span>
                      <span className="font-bold">
                        ₹{((item.product?.price || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Cancellation Option */}
              {canCancel && !isCancelConfirmOpen && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h5 className="font-bold text-amber-700 dark:text-amber-400 text-xs">Need to cancel or change your order?</h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      You can cancel anytime before your order is handed over to the courier.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      cozyAudio.playSoftTap();
                      setIsCancelConfirmOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                  >
                    Request Order Cancellation
                  </button>
                </div>
              )}

              {/* Cancellation Confirmation Dialog */}
              {isCancelConfirmOpen && (
                <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Confirm Order Cancellation</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Reason for cancellation:
                    </label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-xs font-bold"
                    >
                      <option value="Ordered incorrect size or color">Ordered incorrect size or color</option>
                      <option value="Need to change delivery address">Need to change delivery address</option>
                      <option value="Ordered by mistake">Ordered by mistake</option>
                      <option value="Delivery time too long">Delivery time too long</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setIsCancelConfirmOpen(false)}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs cursor-pointer"
                    >
                      Keep My Order
                    </button>
                    <button
                      onClick={handleCustomerCancelOrder}
                      disabled={isCancelling}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer shadow-sm"
                    >
                      {isCancelling ? 'Cancelling...' : 'Yes, Cancel My Order'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFE8E1]/50 dark:bg-[#1E293B] border-t border-cozy-blush/30 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>Need live support? Contact Studio</span>
          <a
            href={`https://wa.me/91${settings.ownerPhone}?text=Hello%20Vikas%20Kumar,%20I%20have%20a%20question%20regarding%20my%20order!`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>📱 +91 {settings.ownerPhone}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
