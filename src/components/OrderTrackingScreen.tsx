import React, { useState } from 'react';
import { Order } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Package, 
  Phone, 
  ArrowLeft, 
  Receipt, 
  Star, 
  FileText,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface OrderTrackingScreenProps {
  order: Order;
  onBackToCatalog: () => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
  order,
  onBackToCatalog,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(2); // 1: placed, 2: accepted, 3: packed, 4: out_for_delivery, 5: delivered
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const steps = [
    { id: 1, title: 'Order Placed', time: 'Just now', desc: `Idempotency verified (${order.id})` },
    { id: 2, title: 'Pharmacy Confirmed', time: '1 min ago', desc: `${order.pharmacy.pharmacyName} verified stock` },
    { id: 3, title: 'NABL Batch Sealed', time: 'Est. 5 mins', desc: `Batch ${order.batchNumber} tamper-evident seal` },
    { id: 4, title: 'Rider Out for Delivery', time: 'Est. 20 mins', desc: 'Express temperature-controlled bag' },
    { id: 5, title: 'Delivered', time: order.estimatedDelivery, desc: 'Secure OTP handover' },
  ];

  const handleNextStatus = () => {
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf8ff] text-[#131b2e] pb-24">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#e2e8f0]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="back-to-home"
              aria-label="Go home"
              onClick={onBackToCatalog}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-base text-[#131b2e] truncate">
                Order #{order.id}
              </h1>
              <p className="text-[11px] text-[#00685f] font-semibold truncate">
                Status: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>

          <button
            id="view-invoice-btn"
            onClick={() => setShowInvoiceModal(true)}
            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-teal-200"
          >
            <Receipt className="w-3.5 h-3.5" />
            Invoice
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/40 text-emerald-100 px-2.5 py-0.5 rounded-full">
              Order Confirmed &amp; Dispatched
            </span>
            <span className="text-xs text-emerald-100">{order.createdAt}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            Delivering in {order.estimatedDelivery}
          </h2>
          <p className="text-xs text-teal-100">
            Fulfilling by <strong>{order.pharmacy.pharmacyName}</strong> (License: {order.pharmacy.drugLicenseNumber})
          </p>
        </div>

        {/* Live Step Progression Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Live Fulfillment Timeline</h3>
            {currentStep < 5 && (
              <button
                id="advance-simulation-btn"
                onClick={handleNextStatus}
                className="text-[11px] text-teal-700 hover:text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 cursor-pointer"
              >
                Fast-Forward Step ➔
              </button>
            )}
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
            {steps.map((s) => {
              const isDone = s.id < currentStep;
              const isCurrent = s.id === currentStep;

              return (
                <div key={s.id} className="relative group">
                  {/* Step Dot Icon */}
                  <div
                    className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-teal-700 text-white ring-4 ring-teal-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{s.id}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-teal-800'
                            : isDone
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{s.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items & Pharmacy Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-sm text-slate-900">Purchased Medications</h3>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Saved ₹{order.savingsTotal.toFixed(0)}
            </span>
          </div>

          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{item.medicine.name}</p>
                <p className="text-teal-700">{item.medicine.saltName}</p>
                <p className="text-slate-500">
                  {item.strength.label} • {item.form.label} • {item.packSize.label} (Qty: {item.quantity})
                </p>
                <p className="text-[10px] text-slate-400">
                  NABL Inspection Batch: <strong>{item.medicine.batchInspection.batchNumber}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">₹{(item.offer.price * item.quantity).toFixed(2)}</span>
                <p className="text-[10px] text-slate-400 line-through">
                  MRP ₹{(item.offer.brandedPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Payment Paid via {order.paymentMethod}</span>
            <span className="font-bold text-sm text-teal-900">Total: ₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Address & Pharmacy Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-sm text-slate-900">Destination Address</h3>
            </div>
            <span className="text-xs text-slate-500">{order.deliveryAddress.fullName}</span>
          </div>
          <p className="text-xs text-slate-600">
            {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Contact: {order.deliveryAddress.phone}</span>
            <button className="text-teal-700 font-bold flex items-center gap-1 hover:underline">
              <Phone className="w-3 h-3" /> Call Pharmacy Helpdesk
            </button>
          </div>
        </div>

        {/* Verified Review Section (PRD FR-REV-01..04) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Verified Purchase Feedback</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Verified Order
            </span>
          </div>

          {reviewSubmitted ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your feedback has been recorded for batch quality analysis.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-600 font-medium mr-2">Rate Experience:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    id={`rate-star-${star}`}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was the medicine delivery & price transparency? (No medical efficacy claims allowed)"
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />

              <button
                id="submit-review-btn"
                onClick={() => setReviewSubmitted(true)}
                className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors cursor-pointer"
              >
                Submit Verified Feedback
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">GenericMed Help Tax Invoice</h3>
                <p className="text-[10px] text-slate-500">GSTIN: 29AABCU9603R1ZX</p>
              </div>
              <button
                id="close-invoice-modal"
                onClick={() => setShowInvoiceModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Invoice No:</span>
                <span className="font-mono font-bold text-slate-900">INV-2026-9812</span>
              </div>
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <span className="font-mono">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Partner Pharmacy:</span>
                <span>{order.pharmacy.pharmacyName}</span>
              </div>
              <div className="flex justify-between">
                <span>Drug License:</span>
                <span>{order.pharmacy.drugLicenseNumber}</span>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50 space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Description</span>
                <span>Amount</span>
              </div>
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>{i.medicine.name} ({i.strength.label} x {i.quantity})</span>
                  <span>₹{(i.offer.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-slate-600">
                <span>Delivery SLA</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-slate-900">
                <span>Total Paid</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">CDSCO Form 20/21 Verified</span>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 bg-teal-700 text-white rounded-lg font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
