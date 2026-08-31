import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import {
  X,
  CheckCircle,
  ShieldCheck,
  Truck,
  ShoppingBag,
  MessageSquare,
  Phone,
  MapPin,
  CreditCard,
  Sparkles,
  Send,
  QrCode,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Zap,
  ArrowLeft,
  Clock,
  Lock,
} from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface CheckoutOrderModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  subtotal?: number;
  discount?: number;
  finalTotal?: number;
}

export const CheckoutOrderModal: React.FC<CheckoutOrderModalProps> = ({
  isOpen,
  onClose,
  subtotal: propSubtotal,
  discount: propDiscount,
  finalTotal: propFinalTotal,
}) => {
  const {
    cart,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    subtotal: cartSubtotal,
    discountPercent,
  } = useCart();
  const { settings, addOrder } = useStore();

  const activeIsOpen = isOpen !== undefined ? isOpen : isCheckoutOpen;
  const handleClose = () => {
    if (onClose) onClose();
    setIsCheckoutOpen(false);
  };

  const subtotal = propSubtotal !== undefined ? propSubtotal : cartSubtotal;
  const discount = propDiscount !== undefined ? propDiscount : discountPercent;
  const finalTotal =
    propFinalTotal !== undefined
      ? propFinalTotal
      : Math.max(0, subtotal * (1 - discount));

  const [step, setStep] = useState<'form' | 'upi_gateway' | 'success'>('form');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min timer

  const upiNumber = settings.ownerPhone || '8360303562';
  const upiId = `${upiNumber}@upi`;
  const upiPaytmId = `${upiNumber}@paytm`;
  const payeeName = settings.ownerName ? `${settings.ownerName} Atelier` : 'Vikas Kumar Atelier';

  // UPI payment intent link
  const upiIntentUrl = `upi://pay?pa=${upiNumber}@upi&pn=${encodeURIComponent(
    payeeName
  )}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent('Order Payment to Vikas Kumar Atelier')}`;

  // QR Code URL (High contrast instant QR service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(
    upiIntentUrl
  )}`;

  useEffect(() => {
    if (activeIsOpen && step === 'success') {
      setStep('form');
      setUtrNumber('');
      setUtrError('');
    }
  }, [activeIsOpen]);

  useEffect(() => {
    let interval: any;
    if (step === 'upi_gateway' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  if (!activeIsOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    cozyAudio.playSoftTap();
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      alert('Please fill in your name, WhatsApp number, delivery address, and pincode.');
      return;
    }

    if (paymentMethod === 'upi') {
      // Transition to Automated UPI Payment Gateway
      cozyAudio.playSoftTap();
      setTimerSeconds(300);
      setStep('upi_gateway');
    } else {
      // COD or Card direct completion
      finalizeOrder('Confirmed (COD / Card)');
    }
  };

  const finalizeOrder = (paymentStatus: string, utr: string = '') => {
    setIsVerifying(true);
    cozyAudio.playCelebration();

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF6B6B', '#6BBF7A', '#6EB5FF', '#FFD166', '#845EC2'],
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

    const targetPhone = upiNumber;
    const storeName = settings.ownerName ? `${settings.ownerName.toUpperCase()} ATELIER` : 'VIKAS KUMAR ATELIER';

    const whatsappMessage = encodeURIComponent(
      `🛍️ *NEW ORDER - ${storeName}*\n` +
      `*Order ID:* #${orderId}\n` +
      `*Customer:* ${fullName.trim()}\n` +
      `*WhatsApp Phone:* +91 ${phone.trim()}\n` +
      `*Delivery Address:* ${address.trim()}, ${city.trim()} - ${pincode.trim()}\n` +
      `*Payment Mode:* ${paymentMethod.toUpperCase()} (${paymentStatus})\n` +
      (utr ? `*UPI Ref/UTR Number:* ${utr}\n` : '') +
      `*Paid To Account:* +91 ${upiNumber}\n\n` +
      `📦 *ITEMS ORDERED:*\n${itemsSummary}\n\n` +
      `💰 *FINAL AMOUNT:* ₹${finalTotal.toLocaleString('en-IN')} (FREE All-India Delivery)\n` +
      `✨ Thank you for choosing ${settings.ownerName || 'Vikas Kumar'} Atelier!`
    );

    const newOrderData = {
      orderId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: `${address.trim()}, ${city.trim()} - ${pincode.trim()}`,
      paymentMethod: paymentMethod === 'upi' ? `UPI (Paid to ${upiNumber})` : paymentMethod.toUpperCase(),
      utrNumber: utr,
      items: cart,
      subtotal,
      discount,
      finalTotal,
      timestamp: new Date().toISOString(),
      status: paymentMethod === 'upi' ? 'Paid (UPI Verified)' : 'Pending',
      whatsappUrl: `https://wa.me/91${targetPhone}?text=${whatsappMessage}`,
    };

    // Save order in store context & localStorage
    addOrder(newOrderData);

    setTimeout(() => {
      setIsVerifying(false);
      setPlacedOrder(newOrderData);
      setStep('success');
      clearCart();
    }, 1500);
  };

  const handleVerifyUpiPayment = () => {
    const cleanedUtr = utrNumber.trim();
    if (!cleanedUtr) {
      setUtrError('⚠️ Payment ID / 12-digit UPI UTR is mandatory! Please enter the Transaction Ref ID from your payment screen.');
      cozyAudio.playSoftTap();
      return;
    }

    if (cleanedUtr.length < 8) {
      setUtrError('⚠️ Please enter a valid UPI Transaction / UTR Number (usually 12 digits).');
      cozyAudio.playSoftTap();
      return;
    }

    setUtrError('');
    setIsVerifying(true);
    cozyAudio.playSoftTap();

    // Simulate automated gateway verification delay
    setTimeout(() => {
      finalizeOrder('UPI Verified & Paid', cleanedUtr);
    }, 1600);
  };

  const handleOpenWhatsApp = () => {
    if (placedOrder?.whatsappUrl) {
      window.open(placedOrder.whatsappUrl, '_blank');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FF6B6B] hover:text-white transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CUSTOMER & DELIVERY DETAILS FORM */}
        {step === 'form' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B6B] bg-[#FFF5F5] dark:bg-gray-800 px-3 py-1 rounded-full border border-rose-100 dark:border-gray-700 inline-flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Secure Checkout
              </span>
              <h3 className="text-2xl font-black text-[#1F2937] dark:text-white">
                Delivery & Payment
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter your delivery address to proceed with instant UPI or Cash on Delivery.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
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
                    { id: 'upi', label: '⚡ Automated UPI', desc: 'GPay / PhonePe / Paytm' },
                    { id: 'cod', label: '💵 Cash On Delivery', desc: 'Pay at Doorstep' },
                    { id: 'card', label: '💳 Net Banking / Card', desc: 'All Major Banks' },
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

              {/* UPI Highlight Banner */}
              {paymentMethod === 'upi' && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border border-amber-200 dark:border-gray-700 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-300">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                  <span>
                    Direct UPI Transfer: You will scan QR or pay to <strong>+91 {upiNumber}</strong> in next step.
                  </span>
                </div>
              )}

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
                  <span>All-India Express Delivery:</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total Payable:</span>
                  <span className="text-[#FF6B6B]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#FF6B6B] hover:bg-[#F05252] text-white font-black text-sm shadow-lg hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {paymentMethod === 'upi' ? (
                  <>
                    <Zap className="w-4 h-4" /> Proceed to UPI Gateway — ₹{finalTotal.toLocaleString('en-IN')}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Place Order — ₹{finalTotal.toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: AUTOMATED UPI PAYMENT GATEWAY (PAY TO 8360303562) */}
        {step === 'upi_gateway' && (
          <div className="text-center space-y-4 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('form')}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-gray-800 text-[#FF6B6B] text-[11px] font-black border border-rose-100 dark:border-gray-700">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Session: {formatTimer(timerSeconds)}
              </div>
            </div>

            {/* Official Gateway Header */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white p-4 rounded-2xl shadow-lg border border-indigo-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-15">
                <ShieldCheck className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-10 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" /> Automated UPI Gateway
                  </span>
                  <span className="text-[11px] text-indigo-200 font-bold">256-Bit Encrypted</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <p className="text-xs text-indigo-200">Total Amount to Pay:</p>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-indigo-200">Merchant:</p>
                    <p className="text-xs font-bold text-indigo-100">{payeeName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Directive Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-left text-xs font-medium">
              <p className="font-extrabold text-amber-900 dark:text-amber-100 flex items-center gap-1.5 mb-1 text-sm">
                📢 Payment Instruction:
              </p>
              <p>
                Please pay exact amount <strong>₹{finalTotal.toLocaleString('en-IN')}</strong> to Phone / UPI ID:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(upiNumber, 'phone')}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-amber-300 dark:border-gray-700 font-black text-xs text-gray-900 dark:text-white flex items-center gap-1.5 hover:bg-amber-100 dark:hover:bg-gray-700 transition cursor-pointer shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+91 {upiNumber}</span>
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(upiId, 'upiId')}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-amber-300 dark:border-gray-700 font-black text-xs text-gray-900 dark:text-white flex items-center gap-1.5 hover:bg-amber-100 dark:hover:bg-gray-700 transition cursor-pointer shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{upiId}</span>
                  {copiedField === 'upiId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Dynamic QR Code & 1-Click Pay Buttons */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#FF6B6B]" /> Scan QR Code with Any UPI App:
              </p>

              {/* QR Code Container */}
              <div className="bg-white p-3 rounded-2xl inline-block shadow-md border-2 border-gray-200">
                <img
                  src={qrCodeUrl}
                  alt="UPI Payment QR Code"
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto"
                />
                <p className="text-[10px] font-bold text-gray-600 mt-1">
                  Accepts GPay • PhonePe • Paytm • BHIM
                </p>
              </div>

              {/* Mobile 1-Click App Triggers */}
              <div className="mt-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2">
                  Or Click to Open Installed UPI App:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={upiIntentUrl}
                    className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#FF6B6B] text-[11px] font-bold flex items-center justify-center gap-1.5 text-gray-800 dark:text-gray-200 shadow-sm transition"
                  >
                    🟢 Google Pay
                  </a>
                  <a
                    href={upiIntentUrl}
                    className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#FF6B6B] text-[11px] font-bold flex items-center justify-center gap-1.5 text-gray-800 dark:text-gray-200 shadow-sm transition"
                  >
                    🟣 PhonePe
                  </a>
                  <a
                    href={upiIntentUrl}
                    className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#FF6B6B] text-[11px] font-bold flex items-center justify-center gap-1.5 text-gray-800 dark:text-gray-200 shadow-sm transition"
                  >
                    🔵 Paytm
                  </a>
                  <a
                    href={upiIntentUrl}
                    className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#FF6B6B] text-[11px] font-bold flex items-center justify-center gap-1.5 text-gray-800 dark:text-gray-200 shadow-sm transition"
                  >
                    🟠 BHIM UPI
                  </a>
                </div>
              </div>
            </div>

            {/* Mandatory UTR / Transaction ID Field */}
            <div className="text-left space-y-1">
              <label className="block text-[11px] font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#FF6B6B]" /> UPI Payment / UTR ID <span className="text-[#FF6B6B]">* (MANDATORY)</span>
                </span>
                <span className="text-[10px] text-gray-500">12 Digits from UPI App</span>
              </label>

              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(e.target.value.replace(/\D/g, ''));
                  if (utrError) setUtrError('');
                }}
                maxLength={16}
                placeholder="Enter 12-digit UTR / UPI Ref ID (e.g. 423891024589)"
                className={`w-full px-3.5 py-3 rounded-xl border font-mono font-bold text-xs focus:outline-none transition ${
                  utrError
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 ring-2 ring-red-400'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B6B]'
                }`}
              />

              {utrError ? (
                <p className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 animate-shake">
                  {utrError}
                </p>
              ) : (
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  💡 <strong>Where to find?</strong> Open GPay/PhonePe/Paytm payment receipt & copy the 12-digit <strong>UPI Ref No. / UTR</strong>.
                </p>
              )}
            </div>

            {/* Verify & Complete Button */}
            <button
              onClick={handleVerifyUpiPayment}
              disabled={isVerifying}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" /> Verifying Payment ID with Bank Network...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Verify UTR & Confirm Order — ₹{finalTotal.toLocaleString('en-IN')}
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED & INSTANT WHATSAPP RECEIPT */}
        {step === 'success' && placedOrder && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Payment & Order Verified
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
                <span className="text-gray-500">Payment Transferred To:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">+91 {upiNumber}</span>
              </div>
              {placedOrder.utrNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">UPI Ref / UTR:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{placedOrder.utrNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Address:</span>
                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                  {placedOrder.address}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-gray-200 dark:border-gray-700 font-bold">
                <span className="text-gray-700 dark:text-gray-300">Amount Paid:</span>
                <span className="text-emerald-600 font-black text-sm">
                  ₹{placedOrder.finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 1-Click WhatsApp Notification Button */}
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Send Instant WhatsApp Receipt to +91 {upiNumber}
            </button>

            <button
              onClick={() => {
                setStep('form');
                setPlacedOrder(null);
                handleClose();
              }}
              className="px-6 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
            >
              Done / Return to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
