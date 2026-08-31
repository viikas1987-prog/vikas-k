import React from 'react';
import { X, Printer, Truck, ShieldCheck, QrCode } from 'lucide-react';
import { BarcodeGenerator } from './BarcodeGenerator';

interface ShippingWaybillModalProps {
  order: any | null;
  onClose: () => void;
}

export const ShippingWaybillModal: React.FC<ShippingWaybillModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const awbNumber = `AWB-${order.orderId.replace('VK-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-lg bg-white text-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-300 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close & Print Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="text-base font-black text-gray-900">
              Courier Shipping Label & AWB Manifest
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print 4×6 Label
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF6B6B] hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4x6 INCH COURIER SHIPPING LABEL (PRINTABLE) */}
        <div className="mt-4 p-5 border-2 border-dashed border-gray-800 rounded-2xl bg-white space-y-4 font-sans text-xs">
          
          {/* Header Row: Courier / Brand */}
          <div className="flex items-center justify-between border-b-2 border-gray-900 pb-2">
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none text-black">
                VIKAS KUMAR ATELIER
              </h2>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-600">
                PREMIUM APPAREL DISPATCH • PRIORITY AIR
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black px-2 py-1 bg-black text-white rounded">
                {order.paymentMethod === 'cod' ? '💵 COD' : '⚡ PREPAID'}
              </span>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="text-center py-2 border-b border-gray-300">
            <BarcodeGenerator value={awbNumber} width={2.2} height={60} className="w-full justify-center" />
            <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
              AWB ROUTING CODE: {awbNumber}
            </p>
          </div>

          {/* Ship To (Consignee) Details */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-300 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>DELIVER TO (CONSIGNEE):</span>
              <span>ORD #{order.orderId}</span>
            </div>
            <h4 className="text-sm font-black text-black">
              {order.fullName}
            </h4>
            <p className="font-bold text-gray-800 leading-snug">
              {order.address}
            </p>
            <p className="font-black text-black pt-1">
              📞 Phone: +91 {order.phone}
            </p>
          </div>

          {/* Shipper (Return Address) & Package Info */}
          <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-[9px] font-black text-gray-400 uppercase block">RETURN / SHIPPER:</span>
              <p className="font-bold text-black mt-0.5">Vikas Kumar Atelier</p>
              <p className="text-gray-600 text-[10px]">Ludhiana / Mumbai Logistics Hub</p>
              <p className="text-gray-600 text-[10px]">Contact: +91 8360303562</p>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 space-y-0.5">
              <span className="text-[9px] font-black text-gray-400 uppercase block">SHIPMENT STATS:</span>
              <p className="text-[10px] font-bold">Weight: <strong>0.45 KG</strong></p>
              <p className="text-[10px] font-bold">Category: <strong>Fashion & Apparel</strong></p>
              <p className="text-[10px] font-bold">Value: <strong className="text-emerald-700">₹{order.finalTotal?.toLocaleString('en-IN')}</strong></p>
            </div>
          </div>

          {/* Package Manifest Items Summary */}
          <div className="pt-2 border-t border-gray-300 text-[10px] space-y-1">
            <span className="font-bold text-gray-500 uppercase block">Package Contents:</span>
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-gray-700">
                <span>• {item.product.name} ({item.selectedSize}) × {item.quantity}</span>
                <span className="font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* Routing Barcode Footer */}
          <div className="pt-2 border-t border-gray-300 flex items-center justify-between text-[9px] text-gray-400 font-bold">
            <span>STANDARD ALL-INDIA SURFACE/AIR DELIVERY</span>
            <span>INSPECTION CERTIFIED 100%</span>
          </div>

        </div>

        {/* Print Action Bottom */}
        <button
          onClick={handlePrint}
          className="w-full mt-4 py-3.5 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md print:hidden"
        >
          <Printer className="w-4 h-4" /> Print Shipping Label (Waybill)
        </button>
      </div>
    </div>
  );
};
