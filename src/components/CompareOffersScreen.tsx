import React, { useState, useMemo } from 'react';
import { CanonicalMedicine, DosageStrength, DosageForm, PackSize, PharmacyOffer } from '../types';
import { useOffers } from '../hooks/useMedicines';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  SlidersHorizontal, 
  Star, 
  Truck,
  Sparkles,
  Zap,
  Building2,
  Tag
} from 'lucide-react';

interface CompareOffersScreenProps {
  medicine: CanonicalMedicine;
  strength: DosageStrength;
  form: DosageForm;
  pack: PackSize;
  onSelectOffer: (offer: PharmacyOffer) => void;
  onBack: () => void;
}

type SortOption = 'price_low' | 'delivery_fast' | 'rating_high' | 'distance_near';
type FilterOption = 'all' | 'govt' | 'express' | 'free_delivery';

export const CompareOffersScreen: React.FC<CompareOffersScreenProps> = ({
  medicine,
  strength,
  form,
  pack,
  onSelectOffer,
  onBack,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>('price_low');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const { offers, loading, error, refetch } = useOffers(medicine.id);

  // Scaled prices for the selected variant pack & strength
  const calculatedOffers = useMemo(() => {
    return offers.map((baseOffer) => {
      // Scale price according to pack size and strength multiplier
      const scaledPrice = Math.round(
        (baseOffer.price * (pack.count / 15) * strength.multiplier) * 100
      ) / 100;
      const brandedPrice = Math.round(
        (strength.brandedPricePerStrip * (pack.count / 15)) * 100
      ) / 100;
      const unitRate = Math.round((scaledPrice / pack.count) * 100) / 100;
      const discountPct = Math.round(((brandedPrice - scaledPrice) / brandedPrice) * 100);

      return {
        ...baseOffer,
        price: scaledPrice,
        brandedPrice,
        pricePerUnit: unitRate,
        discountPercent: discountPct,
      };
    });
  }, [offers, pack, strength]);

  const filteredAndSortedOffers = useMemo(() => {
    let list = [...calculatedOffers];

    // Filter
    if (filterOption === 'govt') {
      list = list.filter((o) => o.pharmacyType === 'govt');
    } else if (filterOption === 'express') {
      list = list.filter((o) => o.deliveryTime.toLowerCase().includes('min') || o.deliveryTime.toLowerCase().includes('hour'));
    } else if (filterOption === 'free_delivery') {
      list = list.filter((o) => o.isFreeDelivery);
    }

    // Sort
    list.sort((a, b) => {
      if (sortOption === 'price_low') return a.price - b.price;
      if (sortOption === 'delivery_fast') return a.distanceKm - b.distanceKm;
      if (sortOption === 'rating_high') return b.rating - a.rating;
      if (sortOption === 'distance_near') return a.distanceKm - b.distanceKm;
      return 0;
    });

    return list;
  }, [calculatedOffers, filterOption, sortOption]);

  const lowestPrice = calculatedOffers.length ? Math.min(...calculatedOffers.map((o) => o.price)) : 0;
  const maxSavings = calculatedOffers.length ? Math.max(...calculatedOffers.map((o) => o.discountPercent)) : 0;

  const handleSelect = (offer: PharmacyOffer) => {
    setSelectedOfferId(offer.id);
    setTimeout(() => {
      onSelectOffer(offer);
    }, 200);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#faf8ff] p-6 text-center text-sm text-slate-600">Loading pharmacy offers…</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#faf8ff] p-6 text-center"><p className="text-sm text-red-700">{error}</p><button type="button" onClick={refetch} className="mt-3 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white">Try again</button></div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf8ff] text-[#131b2e] pb-20">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#e2e8f0]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="back-to-drug-detail"
              aria-label="Go back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-base text-[#131b2e] truncate">
                Compare Pharmacy Offers
              </h1>
              <p className="text-[11px] text-[#00685f] font-semibold truncate">
                {medicine.name} • {strength.label} • {pack.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Up to {maxSavings}% Off
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-3 space-y-3.5 max-w-2xl mx-auto w-full">
        {/* Canonical Variant Card Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                100% Bioequivalent Salt
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {calculatedOffers.length} Verified Stores Competing
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-900 mt-1">
              {medicine.name} ({strength.label})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Format: {form.label} • Selected Pack: {pack.label}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                Lowest Available Offer
              </span>
              <div className="font-bold text-xl text-emerald-800">
                ₹{lowestPrice.toFixed(2)}
                <span className="text-xs font-normal text-slate-500 line-through ml-1.5">
                  ₹{(strength.brandedPricePerStrip * (pack.count / 15)).toFixed(2)}
                </span>
              </div>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md mt-1">
              Save up to ₹{((strength.brandedPricePerStrip * (pack.count / 15)) - lowestPrice).toFixed(0)}
            </span>
          </div>
        </div>

        {/* Filter Chips & Sort Controls */}
        <div className="space-y-2.5">
          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              id="filter-all"
              onClick={() => setFilterOption('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterOption === 'all'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Stores ({calculatedOffers.length})
            </button>
            <button
              id="filter-govt"
              onClick={() => setFilterOption('govt')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                filterOption === 'govt'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Govt. Jan Aushadhi
            </button>
            <button
              id="filter-express"
              onClick={() => setFilterOption('express')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                filterOption === 'express'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Fast Delivery (&lt; 2h)
            </button>
            <button
              id="filter-free"
              onClick={() => setFilterOption('free_delivery')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                filterOption === 'free_delivery'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Free Delivery
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-700" />
              <span>Sort Offers:</span>
            </div>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-transparent font-bold text-teal-800 focus:outline-none cursor-pointer"
            >
              <option value="price_low">Lowest Price First</option>
              <option value="delivery_fast">Fastest Delivery SLA</option>
              <option value="rating_high">Highest Customer Rating</option>
              <option value="distance_near">Nearest Pharmacy Location</option>
            </select>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-3">
          {filteredAndSortedOffers.map((offer) => {
            const isLowest = offer.price === lowestPrice;
            const isSelected = selectedOfferId === offer.id;

            return (
              <div
                key={offer.id}
                id={`offer-card-${offer.id}`}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-teal-600 ring-2 ring-teal-600/30'
                    : isLowest
                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Store Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {offer.pharmacyName}
                      </h3>
                      {offer.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                          {offer.badge}
                        </span>
                      )}
                      {isLowest && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-800 text-white uppercase tracking-wider flex items-center gap-1">
                          <Tag className="w-3 h-3" /> Best Price
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {offer.rating}
                        <span className="text-[10px] font-normal text-slate-400">
                          ({offer.reviewCount.toLocaleString()})
                        </span>
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {offer.distanceKm} km away
                      </span>

                      <span className="flex items-center gap-1 text-slate-500">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        Lic: {offer.drugLicenseNumber}
                      </span>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="text-right shrink-0">
                    <div className="font-bold text-xl text-slate-900 leading-tight">
                      ₹{offer.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 line-through">
                      MRP ₹{offer.brandedPrice.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                      ₹{offer.pricePerUnit.toFixed(2)} / tablet
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-slate-100"></div>

                {/* Delivery & Stock Info */}
                <div className="flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {offer.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      {offer.isFreeDelivery ? (
                        <span className="text-emerald-700 font-bold">FREE Delivery</span>
                      ) : (
                        <span>₹{offer.deliveryFee} shipping</span>
                      )}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Stock sync: {offer.stockLastUpdated}
                  </span>
                </div>

                {/* Action CTA */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Save {offer.discountPercent}% (₹{(offer.brandedPrice - offer.price).toFixed(0)} saved)</span>
                  </div>

                  <button
                    id={`select-offer-${offer.id}`}
                    onClick={() => handleSelect(offer)}
                    className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Select & Add to Cart</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
