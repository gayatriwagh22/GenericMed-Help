import React, { useState, useMemo } from 'react';
import { CanonicalMedicine, PharmacyOffer, UserProfile } from '../types';
import { MEDICINES, PHARMACY_OFFERS } from '../data/mockData';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Pill, 
  Activity, 
  HeartPulse, 
  Thermometer, 
  Stethoscope,
  Building2,
  CheckCircle2,
  Tag,
  Store,
  Clock,
  MapPin,
  Star,
  Check,
  Zap,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  User,
  LogIn
} from 'lucide-react';

interface CatalogSearchScreenProps {
  onSelectMedicine: (med: CanonicalMedicine) => void;
  onSelectOffer?: (offer: PharmacyOffer, med: CanonicalMedicine) => void;
  onCompareOffers?: (med: CanonicalMedicine) => void;
  onOpenArchitecture?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const CatalogSearchScreen: React.FC<CatalogSearchScreenProps> = ({
  onSelectMedicine,
  onSelectOffer,
  onCompareOffers,
  currentUser,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [homeView, setHomeView] = useState<'all' | 'offers' | 'medicines'>('all');
  const [selectedOfferMedId, setSelectedOfferMedId] = useState<string>('paracetamol-ip');
  const [offerFilter, setOfferFilter] = useState<'all' | 'govt' | 'fastest' | 'free_delivery'>('all');

  const categories = [
    { name: 'All', icon: Pill },
    { name: 'Analgesic & Antipyretic', label: 'Fever & Pain', icon: Thermometer },
    { name: 'Antacid & Anti-Ulcerant', label: 'Acidity & Digestion', icon: Activity },
    { name: 'Lipid Lowering & Cardiovascular', label: 'Cholesterol & Heart', icon: HeartPulse },
    { name: 'Endocrine & Anti-Diabetic', label: 'Diabetes Care', icon: Stethoscope },
    { name: 'Anti-Allergic & Respiratory', label: 'Allergy & Cold', icon: Pill },
  ];

  // Currently focused medicine for live offers calculation
  const currentOfferMedicine = useMemo(() => {
    return MEDICINES.find((m) => m.id === selectedOfferMedId) || MEDICINES[0];
  }, [selectedOfferMedId]);

  // Dynamic price adjustment based on selected medicine multiplier
  const dynamicOffers = useMemo(() => {
    const defaultStrength = currentOfferMedicine.strengths[0];
    const baseMultiplier = defaultStrength.multiplier || 1;
    const baseMrp = defaultStrength.brandedPricePerStrip || 34;

    return PHARMACY_OFFERS.map((off) => {
      const adjustedPrice = +(off.price * baseMultiplier).toFixed(2);
      const adjustedMrp = +(baseMrp).toFixed(2);
      const discount = Math.round(((adjustedMrp - adjustedPrice) / adjustedMrp) * 100);
      const unitPrice = +(adjustedPrice / 15).toFixed(2);

      return {
        ...off,
        price: adjustedPrice,
        brandedPrice: adjustedMrp,
        discountPercent: Math.max(15, discount),
        pricePerUnit: unitPrice,
      };
    });
  }, [currentOfferMedicine]);

  // Filtered offers by user selection
  const filteredOffers = useMemo(() => {
    return dynamicOffers.filter((off) => {
      if (offerFilter === 'govt') return off.pharmacyType === 'government';
      if (offerFilter === 'fastest') return off.deliveryTime.includes('45 mins') || off.deliveryTime.includes('2 hours');
      if (offerFilter === 'free_delivery') return off.isFreeDelivery;
      return true;
    });
  }, [dynamicOffers, offerFilter]);

  const filteredMedicines = useMemo(() => {
    return MEDICINES.filter((med) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        med.saltName.toLowerCase().includes(q) ||
        med.therapeuticClass.toLowerCase().includes(q) ||
        med.brandEquivalents.some((b) => b.brandName.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'All' || med.therapeuticClass === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf8ff] text-[#131b2e] pb-24">
      {/* Home Sticky Header with GenericMed Help Symbol & Name */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#e2e8f0]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* GenericMed Help Official Symbol Icon */}
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img
                alt="GenericMed Help Symbol"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base text-[#131b2e] tracking-tight truncate">
                  GenericMed Help
                </h1>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-1.5 py-0.2 rounded-md shrink-0">
                  Home
                </span>
              </div>
              <p className="text-[11px] text-[#00685f] font-semibold truncate">
                Compare • Choose • Buy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>CDSCO Verified</span>
            </div>

            {currentUser ? (
              <button
                id="home-user-profile-btn"
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all cursor-pointer group"
                title={`${currentUser.fullName} (${currentUser.role}) - Click to view account`}
              >
                <img
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-teal-600/40"
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                />
                <span className="hidden md:inline text-xs font-bold text-slate-800 group-hover:text-teal-900 pr-1.5">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                id="home-login-register-btn"
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner with Prominent GenericMed Help Symbol & Identity */}
      <div className="bg-gradient-to-b from-teal-800 via-teal-900 to-teal-950 text-white px-4 pt-5 pb-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Brand Identity Card */}
          <div className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-teal-300/30">
              <img
                alt="GenericMed Help Official Symbol"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white drop-shadow-sm">
                  GenericMed Help
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 border border-teal-300/30 px-2 py-0.5 rounded-full">
                  Verified Portal
                </span>
              </div>
              <p className="text-xs font-semibold text-teal-200 mt-0.5">
                Compare • Choose • Buy — Save up to 85% on Generics
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase bg-teal-700/80 px-2 py-0.5 rounded-full border border-teal-500/40 text-teal-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% Bioequivalent Repository
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Compare Real-Time Pharmacy Offers
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 leading-relaxed mt-1">
              Find the lowest price from Jan Aushadhi, Apollo, MedPlus, Tata 1mg, and local pharmacies with verified batch QC reports.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative mt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="medicine-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 'Dolo 650', 'Paracetamol', 'Pan 40'..."
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Popular brand pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-teal-200">
            <span className="font-semibold text-white">Popular:</span>
            {['Dolo 650', 'Pan 40', 'Atorva 10', 'Glycomet 500', 'Cetzine'].map((pill) => (
              <button
                key={pill}
                onClick={() => setSearchQuery(pill)}
                className="bg-teal-700/60 hover:bg-teal-700 text-teal-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Home Sections Switcher: Live Offers vs Medicines */}
      <div className="max-w-2xl mx-auto w-full px-4 -mt-3">
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex items-center gap-1">
          <button
            id="home-view-all"
            onClick={() => setHomeView('all')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              homeView === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>All &amp; Live Offers</span>
          </button>

          <button
            id="home-view-offers"
            onClick={() => setHomeView('offers')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              homeView === 'offers'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Pharmacy Offers ({filteredOffers.length})</span>
          </button>

          <button
            id="home-view-medicines"
            onClick={() => setHomeView('medicines')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              homeView === 'medicines'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Catalog ({filteredMedicines.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: LIVE COMPETING PHARMACY OFFERS (Requested by User) */}
      {/* ========================================================================= */}
      {(homeView === 'all' || homeView === 'offers') && !searchQuery && (
        <section className="max-w-2xl mx-auto w-full px-4 pt-5 space-y-3.5">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Live Pharmacy Offers
                </h2>
                <p className="text-[11px] text-[#00685f] font-semibold">
                  Real-time prices from 6 licensed dispensing partners
                </p>
              </div>
            </div>

            {onCompareOffers && (
              <button
                id="home-compare-all-btn"
                onClick={() => onCompareOffers(currentOfferMedicine)}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-teal-50 border border-teal-200 px-2.5 py-1.5 rounded-xl cursor-pointer"
              >
                Compare Matrix <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Medicine Selector for Live Offers */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">Select Medicine to View Live Offers:</span>
              <span className="text-teal-700 font-bold">{currentOfferMedicine.name}</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {MEDICINES.map((med) => {
                const isSelected = med.id === selectedOfferMedId;
                return (
                  <button
                    key={med.id}
                    id={`offer-med-select-${med.id}`}
                    onClick={() => setSelectedOfferMedId(med.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {med.name.split(' ')[0]} {med.strengths[0]?.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filter Pills for Offers */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setOfferFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                offerFilter === 'all'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All 6 Offers
            </button>

            <button
              onClick={() => setOfferFilter('govt')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                offerFilter === 'govt'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              🏛️ Jan Aushadhi (Govt)
            </button>

            <button
              onClick={() => setOfferFilter('fastest')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                offerFilter === 'fastest'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ⚡ Express (&lt;2 hrs)
            </button>

            <button
              onClick={() => setOfferFilter('free_delivery')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                offerFilter === 'free_delivery'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              🚚 Free Delivery
            </button>
          </div>

          {/* Competing Pharmacy Offer Cards List */}
          <div className="space-y-3">
            {filteredOffers.map((offer) => {
              const savingsAmount = offer.brandedPrice - offer.price;
              const isBestPrice = offer.pharmacyType === 'government' || offer.price <= 13.0;

              return (
                <div
                  key={offer.id}
                  id={`home-offer-card-${offer.id}`}
                  className={`bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
                    isBestPrice
                      ? 'border-emerald-300 ring-1 ring-emerald-200 bg-gradient-to-r from-white to-emerald-50/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Store Type Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            offer.pharmacyType === 'government'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : offer.pharmacyType === '24x7'
                              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {offer.badge}
                        </span>

                        {offer.isFreeDelivery && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                            Free Delivery
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                        {offer.pharmacyName}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {offer.rating}
                        </span>
                        <span className="text-slate-400">({offer.reviewCount.toLocaleString()})</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {offer.distanceKm} km away
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-teal-700 font-semibold">
                          <Clock className="w-3 h-3 text-teal-600" />
                          {offer.deliveryTime}
                        </span>
                      </div>
                    </div>

                    {/* Price & Savings */}
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 line-through block">
                        MRP ₹{offer.brandedPrice.toFixed(2)}
                      </span>
                      <div className="text-lg font-black text-slate-900">
                        ₹{offer.price.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        ₹{offer.pricePerUnit.toFixed(2)} / tab
                      </span>
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Save {offer.discountPercent}% (₹{savingsAmount.toFixed(0)})
                      </span>
                    </div>
                  </div>

                  {/* Stock Freshness & Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>In Stock</span>
                      <span>•</span>
                      <span className="text-slate-400">Updated {offer.stockLastUpdated}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`offer-card-details-${offer.id}`}
                        onClick={() => onSelectMedicine(currentOfferMedicine)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        id={`offer-card-buy-${offer.id}`}
                        onClick={() => {
                          if (onSelectOffer) {
                            onSelectOffer(offer, currentOfferMedicine);
                          } else {
                            onSelectMedicine(currentOfferMedicine);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Select Offer</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION: CANONICAL MEDICINES CATALOG & EQUIVALENCE */}
      {/* ========================================================================= */}
      {(homeView === 'all' || homeView === 'medicines' || searchQuery) && (
        <>
          {/* Category Filter Pills */}
          <div className="max-w-2xl mx-auto w-full px-4 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2 px-1">
              <span>Filter by Therapeutic Area:</span>
              <span>{filteredMedicines.length} Medicines</span>
            </div>

            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    id={`cat-filter-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label || cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Section */}
          <main className="px-4 pt-4 space-y-3 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Canonical Bioequivalent Medicines</span>
              <span className="text-teal-700 font-bold">NABL Lab Certified</span>
            </div>

            <div className="space-y-3">
              {filteredMedicines.map((med) => {
                const defaultStrength = med.strengths[0];
                const defaultPack = med.packSizes.find((p) => p.isBestValue) || med.packSizes[0];
                const price = (defaultPack.price * defaultStrength.multiplier).toFixed(2);
                const brandedMrp = (defaultStrength.brandedPricePerStrip * (defaultPack.count / 15)).toFixed(2);
                const savings = (parseFloat(brandedMrp) - parseFloat(price)).toFixed(0);

                return (
                  <div
                    key={med.id}
                    id={`medicine-card-${med.id}`}
                    onClick={() => onSelectMedicine(med)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 hover:border-teal-600 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            {med.therapeuticClass}
                          </span>
                          {med.prescriptionRequired ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Rx Required
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Over the Counter (OTC)
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-800 transition-colors">
                          {med.name}
                        </h3>
                        <p className="text-xs text-teal-700 font-medium">
                          Salt: {med.saltName}
                        </p>

                        {/* Brand Equivalents */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1 flex-wrap">
                          <span className="font-semibold text-slate-700">Generic for:</span>
                          {med.brandEquivalents.map((b) => (
                            <span
                              key={b.brandName}
                              className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium"
                            >
                              {b.brandName}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & Savings Pill */}
                      <div className="text-right shrink-0 space-y-1">
                        <div>
                          <span className="text-[11px] text-slate-400 line-through block">
                            MRP ₹{brandedMrp}
                          </span>
                          <span className="text-base font-extrabold text-slate-900 block">
                            ₹{price}
                          </span>
                        </div>

                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Save ₹{savings}
                        </span>
                      </div>
                    </div>

                    {/* Footer specs */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>{med.strengths.length} Strengths</span>
                        <span>•</span>
                        <span>{med.packSizes.length} Pack Options</span>
                      </div>

                      <span className="text-teal-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Compare 6 Pharmacy Offers <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </>
      )}
    </div>
  );
};
