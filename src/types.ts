export interface DosageStrength {
  id: string;
  label: string; // e.g., '500 mg', '650 mg', '1000 mg ER'
  multiplier: number;
  genericPricePerStrip: number;
  brandedPricePerStrip: number;
  dissolutionRate: string;
  bioavailability: string;
}

export interface DosageForm {
  id: string;
  label: string; // 'Oral Tablet', 'Syrup', 'Suppository'
  icon: string;
  displaySub?: string;
}

export interface PackSize {
  id: string;
  label: string; // 'Strip of 10 Tablets', 'Strip of 15 Tablets', 'Box of 100 Tablets'
  count: number;
  price: number;
  isBestValue?: boolean;
}

export interface CanonicalMedicine {
  id: string;
  name: string;
  saltName: string;
  therapeuticClass: string;
  complianceBadge: string;
  prescriptionRequired: boolean;
  activeSaltMolecule: string;
  dissolutionGeneric: string;
  dissolutionBranded: string;
  bioavailabilityGeneric: string;
  bioavailabilityBranded: string;
  guidanceWarning: string;
  batchInspection: {
    batchNumber: string;
    qcTestsPassed: number;
    totalQcTests: number;
    assayTest: string;
    disintegration: string;
    impurityIndex: string;
    manufactureDate: string;
    expiryDate: string;
    nablLabName: string;
  };
  strengths: DosageStrength[];
  forms: DosageForm[];
  packSizes: PackSize[];
  brandEquivalents: {
    brandName: string;
    manufacturer: string;
    mrp: number;
  }[];
}

export interface PharmacyOffer {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyType: 'retail' | 'govt' | 'chain' | 'online';
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  price: number;
  brandedPrice: number;
  discountPercent: number;
  pricePerUnit: number;
  deliveryTime: string;
  deliveryFee: number;
  isFreeDelivery: boolean;
  distanceKm: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockLastUpdated: string;
  verifiedPartner: boolean;
  nablCertified: boolean;
  badge?: string;
  drugLicenseNumber: string;
}

export interface CartItem {
  medicine: CanonicalMedicine;
  strength: DosageStrength;
  form: DosageForm;
  packSize: PackSize;
  offer: PharmacyOffer;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  savingsTotal: number;
  deliveryFee: number;
  packagingFee: number;
  totalAmount: number;
  status: 'placed' | 'pharmacy_accepted' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  pharmacy: PharmacyOffer;
  deliveryAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
  idempotencyKey: string;
  estimatedDelivery: string;
  batchNumber: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  abhaId?: string;
  pincode?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export type AppScreen =
  | 'home'
  | 'drug_detail'
  | 'compare_offers'
  | 'search_catalog'
  | 'cart_checkout'
  | 'order_tracking'
  | 'partner_portal'
  | 'architecture'
  | 'auth';
