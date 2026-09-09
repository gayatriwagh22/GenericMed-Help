import React, { useState } from 'react';
import { CanonicalMedicine, DosageStrength, DosageForm, PackSize } from '../types';
import { LabCertificateModal } from './LabCertificateModal';

interface DrugDetailScreenProps {
  medicine: CanonicalMedicine;
  onCompareOffers: (medicine: CanonicalMedicine, strength: DosageStrength, form: DosageForm, pack: PackSize) => void;
  onBack: () => void;
  onOpenProfile?: () => void;
  onOpenDosageSafety?: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const DrugDetailScreen: React.FC<DrugDetailScreenProps> = ({
  medicine,
  onCompareOffers,
  onBack,
  onOpenDosageSafety,
  isBookmarked,
  onToggleBookmark,
}) => {
  // Variant states
  const [selectedStrength, setSelectedStrength] = useState<DosageStrength>(
    medicine.strengths.find((s) => s.label === '650 mg') || medicine.strengths[0]
  );
  const [selectedForm, setSelectedForm] = useState<DosageForm>(medicine.forms[0]);
  const [selectedPack, setSelectedPack] = useState<PackSize>(
    medicine.packSizes.find((p) => p.isBestValue) || medicine.packSizes[0]
  );
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isComparingLoading, setIsComparingLoading] = useState(false);

  // Dynamic price calculations based on selected variant
  const currentPrice = (selectedPack.price * selectedStrength.multiplier).toFixed(2);
  const brandedPrice = (selectedStrength.brandedPricePerStrip * (selectedPack.count / 15)).toFixed(2);
  const unitPrice = (parseFloat(currentPrice) / selectedPack.count).toFixed(2);
  const savingsPct = Math.round(
    ((parseFloat(brandedPrice) - parseFloat(currentPrice)) / parseFloat(brandedPrice)) * 100
  );
  const netSavings = (parseFloat(brandedPrice) - parseFloat(currentPrice)).toFixed(0);

  const handleCompareClick = () => {
    setIsComparingLoading(true);
    setTimeout(() => {
      setIsComparingLoading(false);
      onCompareOffers(medicine, selectedStrength, selectedForm, selectedPack);
    }, 350);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf8ff] text-[#131b2e] pb-28">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#e2e8f0]/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="back-button"
              aria-label="Go back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img
              alt="GenericMed Help Brand Icon"
              className="h-7 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
            />
            <h1 className="font-semibold text-lg text-[#131b2e] truncate">Drug Detail</h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-600/30"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe_sjTrNbXHpWqVRlzj63HZ-IDh-V08K0fjT8zBRbf_0wC-x_XuL4ch-faTAkN9q-m0PYykyVg7rjzrjTDZsrBzTCdCCh0kEetcZaw7KFaCLmMQkmIyZ_tFoxI9O9EgcrWpPjnTr0Jvk882Fe1-NDl08dC3H3Kw_ZDZ24aVhJDYw4gYOD0qPw6CUejZHf4xMfT6rNS8qYy2SrLotrY-qPqwMeTVkrwGTTRTiq5KYXlGYOIPzdFlad_"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-3 space-y-4 max-w-lg mx-auto w-full">
        {/* Card 1: Core Drug Identification */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]/80 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#059669] text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              {medicine.complianceBadge}
            </span>

            <button
              id="bookmark-button"
              aria-label="Save drug"
              onClick={onToggleBookmark}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                isBookmarked
                  ? 'bg-teal-50 text-[#00685f]'
                  : 'bg-[#f2f3ff] text-[#3d4947] hover:bg-[#eaedff]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>

          <div className="pt-0.5">
            <h2 className="font-bold text-xl text-[#131b2e] leading-snug tracking-tight">
              {medicine.name}
            </h2>
            <p className="text-xs text-[#00685f] font-semibold mt-1">
              {medicine.saltName}
            </p>

            <div className="flex items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1 text-[#3d4947] text-xs font-medium bg-[#eaedff] px-2.5 py-1 rounded-md">
                <span className="material-symbols-outlined text-[14px]">category</span>
                Therapeutic Class: {medicine.therapeuticClass}
              </span>
            </div>
          </div>

          {/* Selected Variant Estimate Banner */}
          <div className="pt-2 flex items-center justify-between bg-[#f2f3ff] rounded-xl p-3 mt-2 border border-[#dae2fd]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#00685f]/10 flex items-center justify-center text-[#00685f] shrink-0">
                <span className="material-symbols-outlined text-[22px]">medication</span>
              </div>
              <div>
                <div className="text-xs text-[#3d4947] font-medium">Selected Variant Estimate</div>
                <div className="font-bold text-xl text-[#131b2e] flex items-baseline gap-1.5">
                  ₹{currentPrice}
                  <span className="text-xs text-[#64748b] line-through font-normal">
                    ₹{brandedPrice}
                  </span>
                  <span className="text-xs text-[#059669] font-bold">
                    (₹{unitPrice} / tab)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#059669] text-white text-xs font-bold shadow-sm">
                Save {savingsPct > 0 ? savingsPct : 47}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Canonical Variant Matrix */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]/80 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0]/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-[20px]">tune</span>
              <h3 className="font-semibold text-base text-[#131b2e]">Canonical Variant Matrix</h3>
            </div>
            <span className="text-xs text-[#64748b] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
              Safe Match Lock
            </span>
          </div>

          {/* Dosage Strength */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#131b2e]">Dosage Strength</label>
              <span className="text-xs text-[#00685f] font-bold">{selectedStrength.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2" id="strength-selector">
              {medicine.strengths.map((str) => {
                const isActive = str.id === selectedStrength.id;
                return (
                  <button
                    key={str.id}
                    id={`strength-btn-${str.id}`}
                    onClick={() => setSelectedStrength(str)}
                    className={`py-2.5 px-2 rounded-xl text-center text-xs font-semibold transition-all active:scale-95 ${
                      isActive
                        ? 'bg-[#00685f] text-white shadow-sm'
                        : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                    }`}
                  >
                    {str.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dosage Form */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#131b2e]">Dosage Form</label>
              <span className="text-xs text-[#00685f] font-bold">{selectedForm.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2" id="form-selector">
              {medicine.forms.map((form) => {
                const isActive = form.id === selectedForm.id;
                return (
                  <button
                    key={form.id}
                    id={`form-btn-${form.id}`}
                    onClick={() => setSelectedForm(form)}
                    className={`py-2.5 px-1 rounded-xl text-center text-xs font-semibold transition-all active:scale-95 flex flex-col items-center gap-1 ${
                      isActive
                        ? 'bg-[#00685f] text-white shadow-sm'
                        : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">{form.icon}</span>
                    <span className="truncate w-full px-1">{form.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pack Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#131b2e]">Pack Size</label>
              <span className="text-xs text-[#00685f] font-bold">{selectedPack.label}</span>
            </div>
            <div className="space-y-2" id="pack-selector">
              {medicine.packSizes.map((pack) => {
                const isActive = pack.id === selectedPack.id;
                const packPrice = (pack.price * selectedStrength.multiplier).toFixed(2);
                return (
                  <div
                    key={pack.id}
                    id={`pack-chip-${pack.id}`}
                    onClick={() => setSelectedPack(pack)}
                    className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-[#00685f]/10 border-[#00685f] shadow-xs'
                        : 'bg-[#f2f3ff] border-transparent hover:border-[#cbd5e1]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? 'bg-[#00685f]' : 'bg-[#dae2fd]'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          isActive ? 'text-[#00685f] font-bold' : 'text-[#131b2e]'
                        }`}
                      >
                        {pack.label}
                      </span>
                      {pack.isBestValue && (
                        <span className="bg-[#059669] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Best Value
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-[#00685f]' : 'text-[#64748b]'
                      }`}
                    >
                      ₹{packPrice}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 3: Generic vs Branded Equivalence Table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[#059669] text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                balance
              </span>
              <h3 className="font-semibold text-base text-[#131b2e]">Generic vs Branded Equivalence</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#f0f9ff] text-[#0284c7] text-xs font-bold">
              100% Bioequivalent
            </span>
          </div>

          <p className="text-xs text-[#64748b] leading-relaxed">
            Rigorous batch analysis proves identical clinical bioavailability and therapeutic outcome at a fraction of branded pricing.
          </p>

          <div className="bg-[#f2f3ff] rounded-xl p-2.5 space-y-2 border border-[#dae2fd]/60">
            <div className="grid grid-cols-3 text-center pb-1 text-xs">
              <span className="text-[#64748b] text-left font-semibold">Metric</span>
              <span className="text-[#00685f] font-bold">Generic (Canonical)</span>
              <span className="text-[#3d4947] font-semibold">Leading Brand</span>
            </div>

            {/* Metric 1 */}
            <div className="grid grid-cols-3 items-center text-center py-2 bg-white rounded-lg px-2.5 shadow-xs text-xs">
              <div className="text-left">
                <span className="text-[#131b2e] font-semibold block">Active Salt</span>
                <span className="text-[10px] text-[#64748b]">Molecule Purity</span>
              </div>
              <span className="text-[#059669] font-bold">{selectedStrength.label}</span>
              <span className="text-[#3d4947]">{selectedStrength.label}</span>
            </div>

            {/* Metric 2 */}
            <div className="grid grid-cols-3 items-center text-center py-2 bg-white rounded-lg px-2.5 shadow-xs text-xs">
              <div className="text-left">
                <span className="text-[#131b2e] font-semibold block">Dissolution</span>
                <span className="text-[10px] text-[#64748b]">Rate at 15 mins</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[#00685f] font-bold">
                <span>{selectedStrength.dissolutionRate}</span>
                <span className="material-symbols-outlined text-[#059669] text-[14px]">
                  check_circle
                </span>
              </div>
              <span className="text-[#3d4947]">{medicine.dissolutionBranded}</span>
            </div>

            {/* Metric 3 */}
            <div className="grid grid-cols-3 items-center text-center py-2 bg-white rounded-lg px-2.5 shadow-xs text-xs">
              <div className="text-left">
                <span className="text-[#131b2e] font-semibold block">Bioavailability</span>
                <span className="text-[10px] text-[#64748b]">In-vivo Uptake</span>
              </div>
              <span className="text-[#059669] font-bold">{selectedStrength.bioavailability}</span>
              <span className="text-[#3d4947]">{medicine.bioavailabilityBranded}</span>
            </div>

            {/* Strip Price Comparison */}
            <div className="grid grid-cols-3 items-center text-center py-2.5 bg-[#ecfdf5] rounded-lg px-2.5 border border-[#059669]/20">
              <div className="text-left">
                <span className="text-[#059669] font-bold text-xs block">Strip Price</span>
                <span className="text-[10px] text-[#059669] font-semibold">
                  Net Savings: ₹{netSavings}
                </span>
              </div>
              <span className="font-bold text-base text-[#059669]">₹{currentPrice}</span>
              <span className="text-xs text-[#64748b] line-through">₹{brandedPrice}</span>
            </div>
          </div>

          {/* Branded equivalents list */}
          <div className="pt-1">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
              Identical Chemical Salts To
            </span>
            <div className="flex flex-wrap gap-1.5">
              {medicine.brandEquivalents.map((b) => (
                <span
                  key={b.brandName}
                  className="text-xs bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded-md text-[#3d4947] font-medium"
                >
                  {b.brandName}{' '}
                  <span className="text-[#64748b] text-[10px]">({b.manufacturer})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Transparent Clinical Guidance */}
        <div className="bg-[#fffbeb] rounded-2xl p-3.5 flex items-start gap-3 border border-[#fde68a]">
          <span className="material-symbols-outlined text-[#d97706] text-[22px] shrink-0 mt-0.5">
            warning
          </span>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-[#d97706] uppercase tracking-wide">
              Transparent Clinical Guidance
            </h4>
            <p className="text-xs text-[#3d4947] leading-relaxed">
              {medicine.guidanceWarning}
            </p>
            <button type="button" onClick={onOpenDosageSafety} className="mt-2 text-xs font-bold text-[#00685f] hover:underline">Review medicine safety questions</button>
          </div>
        </div>

        {/* Card 5: Lab Batch Inspection Certificate */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]/80 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-[#131b2e]">
              Lab Batch Inspection Certificate
            </h4>
            <button
              id="view-certificate-link"
              onClick={() => setShowCertificateModal(true)}
              className="text-xs text-[#00685f] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>View Certificate</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[#3d4947] text-xs pt-0.5">
            <span className="font-mono">Batch: {medicine.batchInspection.batchNumber}</span>
            <span className="text-[#059669] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              Passed {medicine.batchInspection.qcTestsPassed} QC Tests
            </span>
          </div>

          <div className="w-full bg-[#f2f3ff] h-2 rounded-full overflow-hidden mt-1">
            <div className="bg-[#059669] h-full w-full rounded-full transition-all duration-500"></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#64748b] pt-1">
            <span>Assay Test: {medicine.batchInspection.assayTest}</span>
            <span>Disintegration: {medicine.batchInspection.disintegration}</span>
            <span>Impurity Index: {medicine.batchInspection.impurityIndex}</span>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#faf8ff]/95 backdrop-blur-xl px-4 py-3 border-t border-[#e2e8f0] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-40">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span className="text-xs text-[#059669] font-bold">In Stock & Verified</span>
            </div>
            <div className="font-bold text-xl text-[#131b2e] truncate">
              ₹{unitPrice}
              <span className="text-xs text-[#64748b] font-normal"> / tablet</span>
            </div>
          </div>

          <button
            id="compare-offers-cta"
            onClick={handleCompareClick}
            disabled={isComparingLoading}
            className="flex-1 max-w-[240px] h-12 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-teal-900/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isComparingLoading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Locating Pharmacy Deals...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span className="truncate">Compare 6 Offers</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showCertificateModal && (
        <LabCertificateModal
          medicine={medicine}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
};
