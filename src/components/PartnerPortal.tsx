import React, { useState } from 'react';
import { 
  Building2, 
  Package, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle,
  Sliders,
  DollarSign
} from 'lucide-react';

interface PartnerOfferItem {
  id: string;
  medicineName: string;
  strength: string;
  packSize: string;
  currentPrice: number;
  mrp: number;
  stockCount: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export const PartnerPortal: React.FC = () => {
  const [partnerStore, setPartnerStore] = useState('Apollo Pharmacy Central');
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'payouts'>('inventory');
  
  const [offers, setOffers] = useState<PartnerOfferItem[]>([
    {
      id: 'p-off-1',
      medicineName: 'Paracetamol Tablets IP',
      strength: '650 mg',
      packSize: 'Strip of 15 Tablets',
      currentPrice: 17.10,
      mrp: 34.00,
      stockCount: 420,
      stockStatus: 'in_stock',
      lastUpdated: '2 mins ago',
    },
    {
      id: 'p-off-2',
      medicineName: 'Pantoprazole Gastro-Resistant Tablets IP',
      strength: '40 mg',
      packSize: 'Strip of 10 Tablets',
      currentPrice: 28.00,
      mrp: 98.00,
      stockCount: 180,
      stockStatus: 'in_stock',
      lastUpdated: '15 mins ago',
    },
    {
      id: 'p-off-3',
      medicineName: 'Atorvastatin Tablets IP',
      strength: '10 mg',
      packSize: 'Strip of 15 Tablets',
      currentPrice: 45.00,
      mrp: 110.00,
      stockCount: 14,
      stockStatus: 'low_stock',
      lastUpdated: '1 hour ago',
    },
    {
      id: 'p-off-4',
      medicineName: 'Metformin HCl Tablets IP',
      strength: '500 mg',
      packSize: 'Strip of 20 Tablets',
      currentPrice: 21.00,
      mrp: 35.00,
      stockCount: 310,
      stockStatus: 'in_stock',
      lastUpdated: '25 mins ago',
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-9841',
      customer: 'Dr. Priya Sharma',
      items: 'Paracetamol 650mg (Strip of 15) x 1',
      amount: 17.10,
      status: 'Ready for Dispatch',
      time: '4 mins ago',
      otp: '7821',
    },
    {
      id: 'ORD-9839',
      customer: 'Amit Patel',
      items: 'Pantoprazole 40mg (Strip of 10) x 2',
      amount: 56.00,
      status: 'Pharmacy Accepted',
      time: '12 mins ago',
      otp: '4491',
    },
    {
      id: 'ORD-9830',
      customer: 'Sunita Nair',
      items: 'Atorvastatin 10mg (Strip of 15) x 1',
      amount: 45.00,
      status: 'Dispatched',
      time: '35 mins ago',
      otp: '1902',
    },
  ]);

  const handlePriceChange = (id: string, newPrice: number) => {
    setOffers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentPrice: newPrice, lastUpdated: 'Just now' } : item
      )
    );
  };

  const handleStockToggle = (id: string) => {
    setOffers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.stockStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';
          return { ...item, stockStatus: nextStatus, lastUpdated: 'Just now' };
        }
        return item;
      })
    );
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          if (o.status === 'Pharmacy Accepted') return { ...o, status: 'Ready for Dispatch' };
          if (o.status === 'Ready for Dispatch') return { ...o, status: 'Dispatched' };
        }
        return o;
      })
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf8ff] text-[#131b2e] pb-24">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#e2e8f0]/60 shadow-xs">
        <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base text-slate-900">
                  {partnerStore}
                </h1>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> License Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tenant Portal: DL-20B/21B-KA-1182 • Zone: Indiranagar Hub
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Live Status</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Accepting Orders
            </span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3">
        <div className="bg-white rounded-xl p-1 shadow-xs border border-slate-200 flex items-center gap-1">
          <button
            id="tab-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Inventory &amp; Offers ({offers.length})
          </button>
          <button
            id="tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Live Order Queue ({orders.length})
          </button>
          <button
            id="tab-payouts"
            onClick={() => setActiveTab('payouts')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'payouts'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Commission &amp; Payouts
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 space-y-4">
        {activeTab === 'inventory' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Canonical Catalogue Mapping (PRD FR-VEN-03)</span>
              <span className="text-teal-700 font-bold flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Auto-sync enabled
              </span>
            </div>

            <div className="space-y-3">
              {offers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{item.medicineName}</h3>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                          {item.strength}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.packSize}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockToggle(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          item.stockStatus === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs items-center">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Branded MRP</span>
                      <span className="font-semibold text-slate-700">₹{item.mrp.toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Your Published Price</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900">₹</span>
                        <input
                          type="number"
                          step="0.5"
                          value={item.currentPrice}
                          onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value) || 0)}
                          className="w-20 p-1 font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px]">Sync Freshness</span>
                      <span className="text-slate-600 font-medium">{item.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Active Prescription Orders (PRD FR-VEN-05)</span>
              <span>3 Pending Delivery</span>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">{ord.id}</span>
                        <span className="text-xs text-slate-600">• {ord.customer}</span>
                      </div>
                      <p className="text-xs text-teal-800 font-medium mt-1">{ord.items}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Received {ord.time}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm">₹{ord.amount.toFixed(2)}</span>
                      <div className="text-[10px] text-slate-500 mt-0.5">Handover OTP: <strong>{ord.otp}</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                      {ord.status}
                    </span>

                    {ord.status !== 'Dispatched' && (
                      <button
                        onClick={() => advanceOrderStatus(ord.id)}
                        className="px-3 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-bold hover:bg-teal-800 transition-colors"
                      >
                        {ord.status === 'Pharmacy Accepted' ? 'Mark Ready for Dispatch ➔' : 'Handover to Courier ➔'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-4">
            {/* Payout Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 text-xs font-medium">Gross Transaction Value</span>
                <p className="text-xl font-bold text-slate-900">₹48,920.00</p>
                <span className="text-[10px] text-emerald-700 font-bold">+18.4% this week</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 text-xs font-medium">Platform Commission (5%)</span>
                <p className="text-xl font-bold text-teal-800">₹2,446.00</p>
                <span className="text-[10px] text-slate-500">Transparent flat tier</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 text-xs font-medium">Net Disbursed Payout</span>
                <p className="text-xl font-bold text-emerald-700">₹46,474.00</p>
                <span className="text-[10px] text-emerald-700 font-bold">Settled via NEFT / RTGS</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Settlement Summary &amp; Compliance</h4>
              <p className="text-slate-600 leading-relaxed">
                Platform reconciles all completed transactions matching NABL lab batch certificates daily at 23:59 IST. Commissions are calculated according to PRD section 9.12 and deposited directly into the registered partner bank account.
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Audited GST-compliant invoice auto-generated for every order.</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
