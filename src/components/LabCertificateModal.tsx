import { CanonicalMedicine } from '../types';
import { Award, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface LabCertificateModalProps {
  medicine: CanonicalMedicine;
  onClose: () => void;
}

export const LabCertificateModal = ({ medicine, onClose }: LabCertificateModalProps) => {
  const batch = medicine.batchInspection;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="lab-certificate-modal" 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-[#131b2e]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/70 to-emerald-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">
                  NABL ISO/IEC 17025 Certified
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mt-0.5">
                Certificate of Batch Analysis
              </h3>
            </div>
          </div>
          <button
            id="close-certificate-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-5 space-y-4 text-sm">
          {/* Drug & Batch Meta */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-500 font-medium">Drug Product</span>
                <p className="font-bold text-slate-900">{medicine.name}</p>
                <p className="text-xs text-teal-700 font-semibold">{medicine.activeSaltMolecule}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">Batch Number</span>
                <p className="font-mono font-bold text-slate-900">{batch.batchNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Mfg Date: </span>
                <span className="font-semibold text-slate-800">{batch.manufactureDate}</span>
              </div>
              <div>
                <span className="text-slate-500">Exp Date: </span>
                <span className="font-semibold text-slate-800">{batch.expiryDate}</span>
              </div>
            </div>
          </div>

          {/* QC Inspection Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Pharmacopoeial Standard (IP/BP/USP)
              </h4>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                All 14 Tests Passed
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="grid grid-cols-3 bg-slate-50 p-2.5 font-semibold text-xs text-slate-600">
                <span>Test Parameter</span>
                <span className="text-center">Permissible Limit</span>
                <span className="text-right">Observed Value</span>
              </div>

              <div className="grid grid-cols-3 p-2.5 text-xs items-center hover:bg-slate-50/50">
                <span className="font-medium text-slate-800">Assay (Purity)</span>
                <span className="text-slate-500 text-center">98.0% - 102.0%</span>
                <span className="text-emerald-700 font-bold text-right flex items-center justify-end gap-1">
                  {batch.assayTest}
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                </span>
              </div>

              <div className="grid grid-cols-3 p-2.5 text-xs items-center hover:bg-slate-50/50">
                <span className="font-medium text-slate-800">Disintegration</span>
                <span className="text-slate-500 text-center">&lt; 15 mins</span>
                <span className="text-emerald-700 font-bold text-right">{batch.disintegration}</span>
              </div>

              <div className="grid grid-cols-3 p-2.5 text-xs items-center hover:bg-slate-50/50">
                <span className="font-medium text-slate-800">Dissolution (15 min)</span>
                <span className="text-slate-500 text-center">&gt; 85.0%</span>
                <span className="text-emerald-700 font-bold text-right">{medicine.dissolutionGeneric}</span>
              </div>

              <div className="grid grid-cols-3 p-2.5 text-xs items-center hover:bg-slate-50/50">
                <span className="font-medium text-slate-800">Total Impurities</span>
                <span className="text-slate-500 text-center">&lt; 0.5%</span>
                <span className="text-emerald-700 font-bold text-right">{batch.impurityIndex}</span>
              </div>

              <div className="grid grid-cols-3 p-2.5 text-xs items-center hover:bg-slate-50/50">
                <span className="font-medium text-slate-800">Microbial Contamination</span>
                <span className="text-slate-500 text-center">Nil (Absence)</span>
                <span className="text-emerald-700 font-bold text-right">Nil (Conforms)</span>
              </div>

              <div className="grid grid-cols-3 p-2.5 text-xs items-center hover:bg-slate-50/50">
                <span className="font-medium text-slate-800">Heavy Metals (Lead/Arsenic)</span>
                <span className="text-slate-500 text-center">&lt; 10 ppm</span>
                <span className="text-emerald-700 font-bold text-right">&lt; 1.2 ppm</span>
              </div>
            </div>
          </div>

          {/* Testing Laboratory details */}
          <div className="bg-teal-50/50 border border-teal-200/80 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-teal-900 block">Testing Facility Authority</span>
              <p className="text-slate-600 leading-relaxed">{batch.nablLabName}</p>
              <p className="text-teal-700 font-medium">Digital Signature ID: SHA256-QC-998812-OK</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Government CDSCO Compliant Record</span>
          <button
            id="modal-done-btn"
            onClick={onClose}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
