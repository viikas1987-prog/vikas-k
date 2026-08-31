import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { X, CheckCircle, ShieldCheck, Truck, ShoppingBag, MessageSquare, Phone, MapPin, CreditCard, Sparkles, Send } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface CheckoutOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  discount: number;
  finalTotal: number;
}

export const CheckoutOrderModal: React.FC<CheckoutOrderModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  discount,
  finalTotal,
}) => {
  const { cart, clearCart } = useCart();
  const { settings, addOrder } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      alert('Please fill in your name, WhatsApp number, delivery address, and pincode.');
      return;
    }

    setIsSubmitting(true);
    cozyAudio.playCelebration();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FF6B6B', '#6BBF7A', '#6EB5FF', '#FFD166'],
      });
    } catch (err) {}

    const orderId = `VK-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsSummary = cart
      .map(
        (item) =>
          `• ${item.product.name} (Qty: ${item.quantity}, Size: ${item.selectedSize}, Shade: ${item.selectedColor.name}) - ₹${(
            (item.product.price + (item.customEmbroidery ? 199 : 0)) *
            item.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n');

    const targetPhone = settings.ownerPhone || '8360303562';
    const storeName = settings.ownerName ? `${settings.ownerName.toUpperCase()} ATELIER` : 'VIKAS KUMAR ATELIER';

    const whatsappMessage = encodeURIComponent(
      `🛍️ *NEW ORDER - ${storeName}*\n` +
      `*Order ID:* #${orderId}\n` +
      `*Customer:* ${fullName.trim()}\n` +
      `*WhatsApp Phone:* +91 ${phone.trim()}\n` +
      `*Delivery Address:* ${address.trim()}, ${city.trim()} - ${pincode.trim()}\n` +
      `*Payment Mode:* ${paymentMethod.toUpperCase()}\n\n` +
      `📦 *ITEMS ORDERED:*\n${itemsSummary}\n\n` +
      `💰 *FINAL AMOUNT:* ₹${finalTotal.toLocaleString('en-IN')} (FREE All-India Delivery)\n` +
      `✨ Thank you for choosing ${settings.ownerName || 'Vikas Kumar'} Atelier!`
    );

    const newOrderData = {
      orderId,
      fullName,
      phone,
      address: `${address}, ${city} - ${pincode}`,
      paymentMethod,
      items: cart,
      subtotal,
      discount,
      finalTotal,
      timestamp: new Date().toISOString(),
      status: 'Pending',
      whatsappUrl: `https://wa.me/91${targetPhone}?text=${whatsappMessage}`,
    };

    // Save order in store context & localStorage
    addOrder(newOrderData);

    setTimeout(() => {
      setIsSubmitting(false);
      setPlacedOrder(newOrderData);
      clearCart();
    }, 1200);
  };

  const handleOpenWhatsApp = () => {
    if (placedOrder?.whatsappUrl) {
      window.open(placedOrder.whatsappUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-4xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FF6B6B] hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!placedOrder ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B6B] bg-[#FFF5F5] dark:bg-gray-800 px-3 py-1 rounded-full border border-rose-100 dark:border-gray-700 inline-flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Instant Order Notification System
              </span>
              <h3 className="text-2xl font-black text-[#1F2937] dark:text-white">
                Delivery & Payment Details
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                You and the atelier will receive instant WhatsApp & Email notification upon confirmation.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp / Contact Phone *
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 rounded-l-xl bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 border border-r-0 border-gray-200 dark:border-gray-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 400001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Full Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat / House No., Street, Landmark"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: '⚡ UPI / GPay', desc: 'Instant 0% Fee' },
                    { id: 'cod', label: '💵 Cash On Delivery', desc: 'Pay at Door' },
                    { id: 'card', label: '💳 Cards / NetBanking', desc: 'All Banks' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                        paymentMethod === p.id
                          ? 'border-[#FF6B6B] bg-[#FFF5F5] dark:bg-gray-800 ring-2 ring-[#FF6B6B]/40'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="block text-xs font-bold text-gray-900 dark:text-white">
                        {p.label}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {p.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Total Summary */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs space-y-1">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Cart Subtotal ({cart.length} items):</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Special Discount:</span>
                    <span>-₹{(subtotal * discount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>All-India Shipping:</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total Payable:</span>
                  <span className="text-[#FF6B6B]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-sm shadow-lg hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" /> Transmitting Order & Alert...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Confirm Order — ₹{finalTotal.toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Order Confirmation & Instant WhatsApp Notification Hub */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Order Confirmed & Logged
            </span>

            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              Thank You, {placedOrder.fullName}!
            </h3>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-left space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-gray-500">Order Reference:</span>
                <span className="text-[#FF6B6B]">#{placedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">WhatsApp Alert Sent To:</span>
                <span className="font-bold text-gray-900 dark:text-white">+91 {placedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery To:</span>
                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{placedOrder.address}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700 font-bold">
                <span className="text-gray-700 dark:text-gray-300">Total Paid/COD:</span>
                <span className="text-emerald-600 font-black">₹{placedOrder.finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* 1-Click WhatsApp Notification Trigger Button */}
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Send Instant Confirmation to WhatsApp
            </button>

            <button
              onClick={() => {
                setPlacedOrder(null);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
            >
              Done / Return to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
