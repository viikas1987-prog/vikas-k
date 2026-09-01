import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  ShieldCheck,
  X,
  AlertCircle,
  RotateCcw,
  MessageSquare,
  HelpCircle,
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
  const { orders, updateOrderStatus, addNotification, settings } = useStore();

  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Ordered by mistake');
  const [cancellationDone, setCancellationDone] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toLowerCase();
    if (!clean) return;

    cozyAudio.playSoftTap();
    setHasSearched(true);
    setCancellationDone(false);
    setIsCancelConfirmOpen(false);

    const found = orders.find((o) => {
      const ordId = (o.orderId || o.id || '').toLowerCase();
      const phone = (o.phone || '').toLowerCase();
      const utr = (o.utrNumber || '').toLowerCase();
      return (
        ordId.includes(clean) ||
        ordId.replace('vk-', '').includes(clean) ||
        phone.includes(clean) ||
        utr.includes(clean)
      );
    });

    setTrackedOrder(found || null);
    if (found) {
      cozyAudio.playCelebration();
    }
  };

  const handleConfirmCustomerCancellation = async () => {
    if (!trackedOrder) return;
    const orderKey = trackedOrder.orderId || trackedOrder.id;

    cozyAudio.playCelebration();

    // 1. Update Order in Cloud
    const cancelStatus = `Cancelled (Customer Request: ${cancellationReason})`;
    await updateOrderStatus(orderKey, cancelStatus);

    // 2. Send Urgent Notification to Admin Panel
    addNotification({
      type: 'CUSTOMER_CANCELLED',
      title: '🚨 Customer Order Cancellation Alert',
      message: `Order #${orderKey} was cancelled by customer ${trackedOrder.fullName} (Reason: ${cancellationReason})`,
      orderId: orderKey,
    });

    setTrackedOrder((prev: any) => (prev ? { ...prev, status: cancelStatus } : null));
    setIsCancelConfirmOpen(false);
    setCancellationDone(true);
  };

  // Determine Stepper Active Step
  const getStageNumber = (status: string) => {
    const st = (status || '').toLowerCase();
    if (st.includes('cancelled')) return -1;
    if (st.includes('delivered')) return 5;
    if (st.includes('out for delivery')) return 4;
    if (st.includes('dispatch') || st.includes('transit')) return 3;
    if (st.includes('processing') || st.includes('crafting') || st.includes('packing')) return 2;
    return 1; // Paid & Confirmed
  };

  const currentStage = trackedOrder ? getStageNumber(trackedOrder.status) : 1;
  const isCancelled = trackedOrder && (trackedOrder.status || '').toLowerCase().includes('cancelled');
  const canCancel = currentStage <= 2 && !isCancelled;

  const stages = [
    { num: 1, title: 'Paid & Confirmed', desc: 'Studio verified' },
    { num: 2, title: 'Crafting & Packing', desc: 'Handcrafted artisan pack' },
    { num: 3, title: 'Dispatched in Transit', desc: 'Priority Air Express' },
    { num: 4, title: 'Out for Delivery', desc: 'Arriving today' },
    { num: 5, title: 'Delivered', desc: 'Package received' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 selection:bg-[#FF6B6B]">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-rose-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[92vh] animate-fade-in text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 border-b border-rose-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B6B] text-white flex items-center justify-center font-bold text-xl shadow-md">
              🚚
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">
                Live Order Journey & Tracking
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Track BlueDart / Delhivery shipments & manage cancellations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-gray-500 hover:bg-[#FF6B6B] hover:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              Enter Order ID or WhatsApp Mobile Number:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. VK-839201 or 8360303562..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-xs cursor-pointer shadow-md transition"
              >
                Track Package
              </button>
            </div>
          </form>

          {/* Cancellation Done Alert */}
          {cancellationDone && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-300 space-y-1 animate-fade-in">
              <p className="font-black text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Cancellation Confirmed!
              </p>
              <p className="text-[11px]">
                Your cancellation request has been recorded. Vikas Kumar Atelier admin has been notified and refund will be processed within 24-48 hours.
              </p>
            </div>
          )}

          {/* Tracked Order Details */}
          {trackedOrder ? (
            <div className="space-y-4 animate-fade-in">
              
              {/* Status Header */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-mono font-black text-sm text-gray-900 dark:text-white">
                    #{trackedOrder.orderId || trackedOrder.id}
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Placed on {new Date(trackedOrder.timestamp || trackedOrder.date || Date.now()).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    isCancelled
                      ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300'
                      : currentStage === 5
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-[#FF6B6B] border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {trackedOrder.status || 'Paid & Confirmed'}
                </span>
              </div>

              {/* Visual 5-Stage Stepper */}
              {!isCancelled ? (
                <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-gray-900/60 border border-rose-100 dark:border-gray-800 space-y-4">
                  <h4 className="text-xs font-black uppercase text-gray-700 dark:text-gray-300 tracking-wider">
                    Shipment Timeline Journey
                  </h4>
                  <div className="space-y-3">
                    {stages.map((st) => {
                      const isDone = currentStage >= st.num;
                      const isCurrent = currentStage === st.num;

                      return (
                        <div key={st.num} className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition shadow-sm mt-0.5 ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                            } ${isCurrent ? 'ring-4 ring-rose-200 dark:ring-rose-900 scale-110' : ''}`}
                          >
                            {isDone ? '✓' : st.num}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-xs font-black ${
                                isDone ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                              }`}
                            >
                              {st.title} {isCurrent && <span className="text-[#FF6B6B] text-[10px] font-bold">● Active</span>}
                            </p>
                            <p className="text-[10px] text-gray-500">{st.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-800 dark:text-red-300 space-y-2">
                  <p className="font-bold text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> This Order has Been Cancelled
                  </p>
                  <p className="text-[11px]">
                    Status: <strong>{trackedOrder.status}</strong>. If payment was completed, refunds are returned to the source UPI account.
                  </p>
                </div>
              )}

              {/* Package Summary */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
                <span className="font-black text-gray-700 dark:text-gray-300 block uppercase text-[10px]">
                  Delivery Address & Items:
                </span>
                <p className="text-gray-700 dark:text-gray-300 font-bold">{trackedOrder.fullName} (+91 {trackedOrder.phone})</p>
                <p className="text-gray-500 text-[11px]">{trackedOrder.address}</p>
              </div>

              {/* Customer Cancellation Option */}
              {canCancel && !isCancelConfirmOpen && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setIsCancelConfirmOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Request Order Cancellation
                  </button>
                </div>
              )}

              {/* Cancellation Confirmation Step */}
              {isCancelConfirmOpen && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/70 border border-red-300 space-y-3 animate-fade-in">
                  <p className="text-xs font-black text-red-900 dark:text-red-200">
                    Are you sure you want to cancel Order #{trackedOrder.orderId || trackedOrder.id}?
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Select Cancellation Reason:
                    </label>
                    <select
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white"
                    >
                      <option value="Ordered by mistake">Ordered by mistake</option>
                      <option value="Need different size or color">Need different size or color</option>
                      <option value="Need to change delivery address">Need to change delivery address</option>
                      <option value="Found alternative product">Found alternative product</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setIsCancelConfirmOpen(false)}
                      className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs"
                    >
                      Keep Order
                    </button>
                    <button
                      onClick={handleConfirmCustomerCancellation}
                      className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* WhatsApp Support Direct Contact */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${settings.ownerPhone || '8360303562'}?text=${encodeURIComponent(
                    `Hello Vikas Kumar Atelier, I am tracking my Order #${trackedOrder.orderId || trackedOrder.id} and have a question regarding shipment/cancellation.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp Support Hotline (+91 {settings.ownerPhone || '8360303562'})
                </a>
              </div>

            </div>
          ) : (
            hasSearched && (
              <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2">
                <p className="text-gray-400 text-xs font-bold">No order found with matching ID or Phone number.</p>
                <p className="text-[11px] text-gray-500">Please double check your Order ID from your confirmation screen.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
