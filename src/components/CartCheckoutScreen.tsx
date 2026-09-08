import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Building, 
  Banknote, 
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Lock,
  Zap
} from 'lucide-react';

interface CartCheckoutScreenProps {
  cartItem: CartItem | null;
  onUpdateQuantity: (qty: number) => void;
  onClearCart: () => void;
  onCompleteOrder: (order: Order) => void;
  onBack: () => void;
}

export const CartCheckoutScreen: React.FC<CartCheckoutScreenProps> = ({
  cartItem,
  onUpdateQuantity,
  onClearCart,
  onCompleteOrder,
  onBack,
}) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(true);

  const addresses = [
    {
      fullName: 'Dr. Priya Sharma',
      tag: 'Home',
      street: 'Flat 402, Green Glen Towers, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      phone: '+91 98765 43210',
    },
    {
      fullName: 'Dr. Priya Sharma (Clinic)',
      tag: 'Clinic',
      street: 'Room 12, OPD Block, City Hospital, Old Airport Rd',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560008',
      phone: '+91 98765 43210',
    },
  ];

  if (!cartItem) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-bold text-lg text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6 max-w-xs">
          Select a generic medicine and choose a pharmacy offer to proceed.
        </p>
        <button
          id="browse-medicines-empty-btn"
          onClick={onBack}
          className="px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          Browse Medicines
        </button>
      </div>
    );
  }

  const { medicine, strength, form, packSize, offer, quantity } = cartItem;
  const subtotal = offer.price * quantity;
  const brandedTotal = offer.brandedPrice * quantity;
  const netSavings = brandedTotal - subtotal;
  const deliveryFee = offer.isFreeDelivery ? 0 : offer.deliveryFee;
  const totalPayable = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate payment idempotency and order snapshot creation
    setTimeout(() => {
      const newOrder: Order = {
        id: `GMH-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [cartItem],
        subtotal,
        savingsTotal: netSavings,
        deliveryFee,
        packagingFee: 0,
        totalAmount: totalPayable,
        status: 'pharmacy_accepted',
        pharmacy: offer,
        deliveryAddress: addresses[selectedAddressIndex],
        paymentMethod: selectedPayment.toUpperCase(),
        idempotencyKey: `IDEMP-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        estimatedDelivery: offer.deliveryTime,
        batchNumber: medicine.batchInspection.batchNumber,
      };

      setIsProcessing(false);
      onCompleteOrder(newOrder);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf8ff] text-[#131b2e] pb-24">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#e2e8f0]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="back-to-offers"
              aria-label="Go back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-base text-[#131b2e] truncate">
                Review &amp; Checkout
              </h1>
              <p className="text-[11px] text-[#00685f] font-semibold truncate">
                Fulfilling Store: {offer.pharmacyName}
              </p>
            </div>
          </div>

          <button
            id="clear-cart-btn"
            onClick={onClearCart}
            className="text-xs text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-3 space-y-4 max-w-2xl mx-auto w-full">
        {/* Pre-checkout Revalidation Banner (PRD FR-CART-02) */}
        {validationSuccess && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Offer &amp; Stock Revalidated:</strong> Price guaranteed by {offer.pharmacyName}.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
              Live Lock
            </span>
          </div>
        )}

        {/* Selected Item Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                100% Salt Equivalence Verified
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-1">
                {medicine.name}
              </h3>
              <p className="text-xs text-teal-700 font-medium">
                {medicine.saltName}
              </p>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>Strength: <strong>{strength.label}</strong></span>
                <span>•</span>
                <span>Form: <strong>{form.label}</strong></span>
                <span>•</span>
                <span>Pack: <strong>{packSize.label}</strong></span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-bold text-lg text-slate-900">
                ₹{subtotal.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 line-through">
                MRP ₹{brandedTotal.toFixed(2)}
              </div>
              <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                Save ₹{netSavings.toFixed(0)} ({offer.discountPercent}%)
              </div>
            </div>
          </div>

          {/* Pharmacy & Quantity controller */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Dispensing Partner: <strong>{offer.pharmacyName}</strong></span>
            </div>

            {/* Quantity +/- */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button
                id="decrease-qty-btn"
                onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold px-2 text-slate-800">{quantity}</span>
              <button
                id="increase-qty-btn"
                onClick={() => onUpdateQuantity(Math.min(10, quantity + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Address Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-sm text-slate-900">Delivery Address</h3>
            </div>
            <span className="text-xs text-teal-700 font-bold">Standard 45-Min SLA</span>
          </div>

          <div className="space-y-2">
            {addresses.map((addr, idx) => {
              const isSelected = selectedAddressIndex === idx;
              return (
                <div
                  key={addr.tag}
                  id={`address-option-${idx}`}
                  onClick={() => setSelectedAddressIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-600 ring-1 ring-teal-600/30'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{addr.fullName}</span>
                        <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          {addr.tag}
                        </span>
                      </div>
                      <p className="text-slate-600">{addr.street}</p>
                      <p className="text-slate-500">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="text-slate-500 font-medium">Contact: {addr.phone}</p>
                    </div>

                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-1 ${isSelected ? 'bg-teal-700' : 'bg-slate-200'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-sm text-slate-900">Payment Method</h3>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit Encrypted
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              id="pay-upi-btn"
              onClick={() => setSelectedPayment('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedPayment === 'upi'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant UPI (GPay/PhonePe)</span>
            </button>

            <button
              id="pay-card-btn"
              onClick={() => setSelectedPayment('card')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedPayment === 'card'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>Credit / Debit Card</span>
            </button>

            <button
              id="pay-netbank-btn"
              onClick={() => setSelectedPayment('netbanking')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedPayment === 'netbanking'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Net Banking</span>
            </button>

            <button
              id="pay-cod-btn"
              onClick={() => setSelectedPayment('cod')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                selectedPayment === 'cod'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Cash on Delivery</span>
            </button>
          </div>
        </div>

        {/* Transparent Bill Itemization */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-900 text-sm">Transparent Cost Breakdown</h4>

          <div className="flex justify-between text-slate-600">
            <span>Generic Medicine Subtotal ({quantity} pack)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee ({offer.pharmacyName})</span>
            {deliveryFee === 0 ? (
              <span className="text-emerald-700 font-bold">FREE</span>
            ) : (
              <span>₹{deliveryFee.toFixed(2)}</span>
            )}
          </div>

          <div className="flex justify-between text-slate-600">
            <span>NABL Quality Seal &amp; Packaging</span>
            <span className="text-emerald-700 font-bold">FREE (₹0.00)</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Platform Commission Markup</span>
            <span className="text-emerald-700 font-bold">₹0.00 (Zero Surcharge)</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total Payable</span>
            <span className="text-base text-teal-800">₹{totalPayable.toFixed(2)}</span>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-bold text-center border border-emerald-200/80">
            You are saving ₹{netSavings.toFixed(2)} compared to branded retail pricing!
          </div>
        </div>
      </main>

      {/* Sticky Bottom Payment Button */}
      <div className="fixed bottom-0 inset-x-0 bg-[#faf8ff]/95 backdrop-blur-xl px-4 py-3 border-t border-[#e2e8f0] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-40">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Due</span>
            <div className="font-bold text-xl text-slate-900">
              ₹{totalPayable.toFixed(2)}
            </div>
          </div>

          <button
            id="pay-and-order-btn"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1 max-w-[260px] h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-teal-900/15 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Authorizing &amp; Routing...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Order &amp; Pay</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
