/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AppScreen, 
  CanonicalMedicine, 
  DosageStrength, 
  DosageForm, 
  PackSize, 
  PharmacyOffer, 
  CartItem, 
  Order,
  UserProfile
} from './types';
import { MEDICINES, PHARMACY_OFFERS } from './data/mockData';
import { DrugDetailScreen } from './components/DrugDetailScreen';
import { CompareOffersScreen } from './components/CompareOffersScreen';
import { CatalogSearchScreen } from './components/CatalogSearchScreen';
import { CartCheckoutScreen } from './components/CartCheckoutScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { PartnerPortal } from './components/PartnerPortal';
import { ArchitectureView } from './components/ArchitectureView';
import { AuthScreen } from './components/AuthScreen';
import { InteractionChecker } from './components/InteractionChecker';
import { DosageSafetyScreen } from './components/DosageSafetyScreen';
import { addToCart } from './api/cart';
import { ApiClientError } from './api/client';
import { 
  Pill, 
  ShoppingCart, 
  Search, 
  Layers, 
  Smartphone, 
  Monitor, 
  Check, 
  Store, 
  Sparkles,
  Bookmark,
  Home,
  User,
  LogIn
} from 'lucide-react';

export default function App() {
  // Navigation & Screen state - default to 'home' with GenericMed Help and symbol
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Selected drug state (default to Paracetamol IP, exactly as in user mockup)
  const [currentMedicine, setCurrentMedicine] = useState<CanonicalMedicine>(MEDICINES[0]);
  const [selectedStrength, setSelectedStrength] = useState<DosageStrength>(
    MEDICINES[0].strengths.find((s) => s.label === '650 mg') || MEDICINES[0].strengths[0]
  );
  const [selectedForm, setSelectedForm] = useState<DosageForm>(MEDICINES[0].forms[0]);
  const [selectedPack, setSelectedPack] = useState<PackSize>(
    MEDICINES[0].packSizes.find((p) => p.isBestValue) || MEDICINES[0].packSizes[0]
  );

  // Cart & Order state
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(['paracetamol-ip']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleBookmark = (medicineId: string) => {
    if (bookmarks.includes(medicineId)) {
      setBookmarks((prev) => prev.filter((id) => id !== medicineId));
      showToast('Removed from saved medicines');
    } else {
      setBookmarks((prev) => [...prev, medicineId]);
      showToast('Saved to your medicine bookmark list');
    }
  };

  const handleOpenCompareOffers = (
    medicine: CanonicalMedicine,
    strength: DosageStrength,
    form: DosageForm,
    pack: PackSize
  ) => {
    setCurrentMedicine(medicine);
    setSelectedStrength(strength);
    setSelectedForm(form);
    setSelectedPack(pack);
    setCurrentScreen('compare_offers');
  };

  const handleSelectOffer = async (offer: PharmacyOffer) => {
    if (!accessToken) {
      setAuthInitialMode('login');
      setCurrentScreen('auth');
      showToast('Sign in to add an item to your cart.');
      return;
    }
    const newItem: CartItem = {
      medicine: currentMedicine,
      strength: selectedStrength,
      form: selectedForm,
      packSize: selectedPack,
      offer,
      quantity: 1,
    };
    try {
      await addToCart(accessToken, {
        medicineId: currentMedicine.id,
        strengthId: selectedStrength.id,
        formId: selectedForm.id,
        packSizeId: selectedPack.id,
        offerId: offer.id,
      });
      setCartItem(newItem);
      showToast(`Added ${offer.pharmacyName} offer to cart!`);
      setCurrentScreen('cart_checkout');
    } catch (error) {
      showToast(error instanceof ApiClientError ? error.message : 'Unable to add this offer to your cart.');
    }
  };

  const handleUpdateQuantity = (qty: number) => {
    if (!cartItem) return;
    setCartItem({ ...cartItem, quantity: qty });
  };

  const handleClearCart = () => {
    setCartItem(null);
    showToast('Cart cleared');
  };

  const handleCompleteOrder = (order: Order) => {
    setLastOrder(order);
    setCartItem(null);
    setCurrentScreen('order_tracking');
    showToast('Order confirmed successfully!');
  };

  const handleSelectMedicineFromCatalog = (med: CanonicalMedicine) => {
    setCurrentMedicine(med);
    setSelectedStrength(med.strengths[0]);
    setSelectedForm(med.forms[0]);
    setSelectedPack(med.packSizes.find((p) => p.isBestValue) || med.packSizes[0]);
    setCurrentScreen('drug_detail');
  };

  const handleSelectOfferFromHome = async (offer: PharmacyOffer, med: CanonicalMedicine) => {
    if (!accessToken) {
      setAuthInitialMode('login');
      setCurrentScreen('auth');
      showToast('Sign in to add an item to your cart.');
      return;
    }
    setCurrentMedicine(med);
    const targetStrength = med.strengths[0];
    const targetForm = med.forms[0];
    const targetPack = med.packSizes.find((p) => p.isBestValue) || med.packSizes[0];
    setSelectedStrength(targetStrength);
    setSelectedForm(targetForm);
    setSelectedPack(targetPack);

    const newItem: CartItem = {
      medicine: med,
      strength: targetStrength,
      form: targetForm,
      packSize: targetPack,
      offer,
      quantity: 1,
    };
    try {
      await addToCart(accessToken, {
        medicineId: med.id,
        strengthId: targetStrength.id,
        formId: targetForm.id,
        packSizeId: targetPack.id,
        offerId: offer.id,
      });
      setCartItem(newItem);
      showToast(`Added ${offer.pharmacyName} offer to cart!`);
      setCurrentScreen('cart_checkout');
    } catch (error) {
      showToast(error instanceof ApiClientError ? error.message : 'Unable to add this offer to your cart.');
    }
  };

  const handleCompareOffersFromHome = (med: CanonicalMedicine) => {
    setCurrentMedicine(med);
    setSelectedStrength(med.strengths[0]);
    setSelectedForm(med.forms[0]);
    setSelectedPack(med.packSizes.find((p) => p.isBestValue) || med.packSizes[0]);
    setCurrentScreen('compare_offers');
  };

  const isHomeScreen = currentScreen === 'home' || currentScreen === 'search_catalog';

  return (
    <div className="min-h-screen bg-slate-900 text-[#131b2e] flex flex-col items-center">
      {/* Platform Navigation Bar */}
      <header className="w-full bg-slate-950 text-white border-b border-slate-800 z-50 sticky top-0 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
          {/* Logo & Platform Name with GenericMed Help Symbol */}
          <button 
            id="header-brand-home-btn"
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2.5 shrink-0 text-left hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-900/60 border border-teal-500/40 p-1 flex items-center justify-center shadow-xs">
              <img
                alt="GenericMed Help Brand Symbol"
                className="h-full w-full object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight">GenericMed Help</span>
                <span className="text-[9px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.2 rounded border border-teal-400/30 uppercase">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Compare • Choose • Buy</p>
            </div>
          </button>

          {/* Screen Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {/* Home with GenericMed Help Symbol */}
            <button
              id="nav-screen-home"
              onClick={() => setCurrentScreen('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isHomeScreen
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <img
                alt="GenericMed Help Symbol"
                className="w-3.5 h-3.5 object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
              />
              <span>Home</span>
            </button>

            <button
              id="nav-screen-drug-detail"
              onClick={() => setCurrentScreen('drug_detail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                currentScreen === 'drug_detail'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Drug Detail</span>
            </button>

            <button
              id="nav-screen-compare-offers"
              onClick={() => setCurrentScreen('compare_offers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                currentScreen === 'compare_offers'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Compare Offers</span>
            </button>

            <button
              id="nav-screen-partner"
              onClick={() => setCurrentScreen('partner_portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                currentScreen === 'partner_portal'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pharmacy</span> Portal
            </button>

            <button
              id="nav-screen-architecture"
              onClick={() => setCurrentScreen('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                currentScreen === 'architecture'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">System</span> Architecture
            </button>

            <button
              id="nav-screen-auth"
              onClick={() => {
                setAuthInitialMode('login');
                setCurrentScreen('auth');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                currentScreen === 'auth'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {currentUser ? (
                <>
                  <User className="w-3.5 h-3.5 text-teal-300" />
                  <span>Account ({currentUser.fullName.split(' ')[0]})</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </>
              )}
            </button>
          </nav>

          {/* Right Action Tools: Device Frame Toggle & Cart */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Viewport frame switcher */}
            {currentScreen !== 'architecture' && (
              <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  id="view-mode-mobile"
                  onClick={() => setIsMobileFrame(true)}
                  title="Mobile App View (As in screenshot)"
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    isMobileFrame ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  id="view-mode-desktop"
                  onClick={() => setIsMobileFrame(false)}
                  title="Expanded Wide View"
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    !isMobileFrame ? 'bg-teal-700 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => {
                if (cartItem) {
                  setCurrentScreen('cart_checkout');
                } else if (lastOrder) {
                  setCurrentScreen('order_tracking');
                } else {
                  showToast('Cart is empty. Select an offer to checkout.');
                }
              }}
              className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItem && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-bounce">
                  {cartItem.quantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Screen Presentation Wrapper */}
      <div className="w-full flex-1 flex flex-col items-center justify-start p-0 sm:py-6 overflow-x-hidden">
        {currentScreen === 'architecture' ? (
          /* System Architecture View fills standard wide layout */
          <div className="w-full max-w-7xl mx-auto">
            <ArchitectureView />
          </div>
        ) : isMobileFrame ? (
          /* Realistic Smartphone Container (Matches Image 5 & HTML mockup exactly!) */
          <div className="w-full sm:max-w-[420px] bg-[#faf8ff] sm:rounded-[36px] sm:shadow-[0_25px_60px_rgba(0,0,0,0.45)] sm:border-[8px] sm:border-slate-800 relative overflow-hidden flex flex-col min-h-screen sm:min-h-[844px]">
            {/* Simulated Mobile Status Bar (Visible on desktop screen) */}
            <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-slate-900 bg-[#faf8ff] select-none">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto -mt-1"></div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
                <span className="material-symbols-outlined text-[14px]">wifi</span>
                <span className="material-symbols-outlined text-[14px]">battery_full</span>
              </div>
            </div>

            {/* Screen Content Render */}
            <div className="flex-1 overflow-y-auto pb-16">
              {isHomeScreen && (
                <CatalogSearchScreen
                  onSelectMedicine={handleSelectMedicineFromCatalog}
                  onSelectOffer={handleSelectOfferFromHome}
                  onCompareOffers={handleCompareOffersFromHome}
                  onOpenInteractionChecker={() => setCurrentScreen('interaction_checker')}
                  currentUser={currentUser}
                  onOpenAuth={(mode) => {
                    setAuthInitialMode(mode || 'login');
                    setCurrentScreen('auth');
                  }}
                />
              )}

              {currentScreen === 'auth' && (
                <AuthScreen
                  initialMode={authInitialMode}
                  currentUser={currentUser}
                  onLoginSuccess={(user) => {
                    setCurrentUser(user);
                    showToast(`Welcome back, ${user.fullName.split(' ')[0]}!`);
                    setCurrentScreen('home');
                  }}
                  onAuthTokens={(token) => setAccessToken(token)}
                  onLogout={() => {
                    setCurrentUser(null);
                    setAccessToken(null);
                    showToast('Signed out successfully');
                    setCurrentScreen('home');
                  }}
                  onBack={() => setCurrentScreen('home')}
                />
              )}

              {currentScreen === 'interaction_checker' && <InteractionChecker onBack={() => setCurrentScreen('home')} />}
              {currentScreen === 'dosage_safety' && <DosageSafetyScreen medicine={currentMedicine.name} onBack={() => setCurrentScreen('drug_detail')} />}

              {currentScreen === 'drug_detail' && (
                <DrugDetailScreen
                  medicine={currentMedicine}
                  onCompareOffers={handleOpenCompareOffers}
                  onBack={() => setCurrentScreen('home')}
                  onOpenDosageSafety={() => setCurrentScreen('dosage_safety')}
                  isBookmarked={bookmarks.includes(currentMedicine.id)}
                  onToggleBookmark={() => handleToggleBookmark(currentMedicine.id)}
                />
              )}

              {currentScreen === 'compare_offers' && (
                <CompareOffersScreen
                  medicine={currentMedicine}
                  strength={selectedStrength}
                  form={selectedForm}
                  pack={selectedPack}
                  onSelectOffer={handleSelectOffer}
                  onBack={() => setCurrentScreen('drug_detail')}
                />
              )}

              {currentScreen === 'cart_checkout' && (
                <CartCheckoutScreen
                  cartItem={cartItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onClearCart={handleClearCart}
                  onCompleteOrder={handleCompleteOrder}
                  onBack={() => setCurrentScreen('compare_offers')}
                  accessToken={accessToken}
                />
              )}

              {currentScreen === 'order_tracking' && (
                <OrderTrackingScreen
                  order={
                    lastOrder || {
                      id: 'GMH-901842',
                      createdAt: 'Today, 10:45 AM',
                      items: [
                        {
                          medicine: MEDICINES[0],
                          strength: MEDICINES[0].strengths[1],
                          form: MEDICINES[0].forms[0],
                          packSize: MEDICINES[0].packSizes[1],
                          offer: PHARMACY_OFFERS[1],
                          quantity: 1,
                        },
                      ],
                      subtotal: 17.10,
                      savingsTotal: 16.90,
                      deliveryFee: 0,
                      packagingFee: 0,
                      totalAmount: 17.10,
                      status: 'pharmacy_accepted',
                      pharmacy: PHARMACY_OFFERS[1],
                      deliveryAddress: {
                        fullName: 'Dr. Priya Sharma',
                        street: 'Flat 402, Green Glen Layout, Bellandur',
                        city: 'Bengaluru',
                        state: 'Karnataka',
                        pincode: '560103',
                        phone: '+91 98765 43210',
                      },
                      paymentMethod: 'UPI',
                      idempotencyKey: 'IDEMP-SAMPLE-KEY',
                      estimatedDelivery: '45 mins Express',
                      batchNumber: '#IN-2024-884A',
                    }
                  }
                  onBackToCatalog={() => setCurrentScreen('home')}
                  accessToken={accessToken}
                />
              )}

              {currentScreen === 'partner_portal' && <PartnerPortal />}
            </div>

            {/* Mobile Native Bottom Navigation Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-1.5 flex items-center justify-around z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <button
                id="mobile-bottom-nav-home"
                onClick={() => setCurrentScreen('home')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  isHomeScreen ? 'text-teal-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg p-0.5 flex items-center justify-center ${isHomeScreen ? 'bg-teal-50 ring-1 ring-teal-600/30' : ''}`}>
                  <img
                    alt="GenericMed Help Symbol"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
                  />
                </div>
                <span className="text-[10px]">Home</span>
              </button>

              <button
                id="mobile-bottom-nav-drug"
                onClick={() => setCurrentScreen('drug_detail')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'drug_detail' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Pill className="w-5 h-5" />
                <span className="text-[10px]">Medicine</span>
              </button>

              <button
                id="mobile-bottom-nav-compare"
                onClick={() => setCurrentScreen('compare_offers')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'compare_offers' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-[10px]">Compare</span>
              </button>

              <button
                id="mobile-bottom-nav-cart"
                onClick={() => {
                  if (cartItem) {
                    setCurrentScreen('cart_checkout');
                  } else if (lastOrder) {
                    setCurrentScreen('order_tracking');
                  } else {
                    showToast('Cart is empty. Select an offer first.');
                  }
                }}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
                  currentScreen === 'cart_checkout' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItem && (
                  <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-teal-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                    {cartItem.quantity}
                  </span>
                )}
                <span className="text-[10px]">Cart</span>
              </button>

              <button
                id="mobile-bottom-nav-account"
                onClick={() => {
                  setAuthInitialMode('login');
                  setCurrentScreen('auth');
                }}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'auth' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px]">{currentUser ? 'Account' : 'Sign In'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Wide Responsive Layout */
          <div className="w-full max-w-5xl mx-auto bg-[#faf8ff] rounded-2xl shadow-xl overflow-hidden min-h-[85vh]">
            {isHomeScreen && (
              <CatalogSearchScreen
                onSelectMedicine={handleSelectMedicineFromCatalog}
                onSelectOffer={handleSelectOfferFromHome}
                onCompareOffers={handleCompareOffersFromHome}
                onOpenInteractionChecker={() => setCurrentScreen('interaction_checker')}
                currentUser={currentUser}
                onOpenAuth={(mode) => {
                  setAuthInitialMode(mode || 'login');
                  setCurrentScreen('auth');
                }}
              />
            )}

            {currentScreen === 'auth' && (
              <AuthScreen
                initialMode={authInitialMode}
                currentUser={currentUser}
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  showToast(`Welcome back, ${user.fullName.split(' ')[0]}!`);
                  setCurrentScreen('home');
                }}
                onAuthTokens={(token) => setAccessToken(token)}
                onLogout={() => {
                  setCurrentUser(null);
                  setAccessToken(null);
                  showToast('Signed out successfully');
                  setCurrentScreen('home');
                }}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'interaction_checker' && <InteractionChecker onBack={() => setCurrentScreen('home')} />}
            {currentScreen === 'dosage_safety' && <DosageSafetyScreen medicine={currentMedicine.name} onBack={() => setCurrentScreen('drug_detail')} />}

            {currentScreen === 'drug_detail' && (
              <DrugDetailScreen
                medicine={currentMedicine}
                onCompareOffers={handleOpenCompareOffers}
                onBack={() => setCurrentScreen('home')}
                onOpenDosageSafety={() => setCurrentScreen('dosage_safety')}
                isBookmarked={bookmarks.includes(currentMedicine.id)}
                onToggleBookmark={() => handleToggleBookmark(currentMedicine.id)}
              />
            )}

            {currentScreen === 'compare_offers' && (
              <CompareOffersScreen
                medicine={currentMedicine}
                strength={selectedStrength}
                form={selectedForm}
                pack={selectedPack}
                onSelectOffer={handleSelectOffer}
                onBack={() => setCurrentScreen('drug_detail')}
              />
            )}

            {currentScreen === 'cart_checkout' && (
              <CartCheckoutScreen
                cartItem={cartItem}
                onUpdateQuantity={handleUpdateQuantity}
                onClearCart={handleClearCart}
                onCompleteOrder={handleCompleteOrder}
                onBack={() => setCurrentScreen('compare_offers')}
                accessToken={accessToken}
              />
            )}

            {currentScreen === 'order_tracking' && (
              <OrderTrackingScreen
                order={
                  lastOrder || {
                    id: 'GMH-901842',
                    createdAt: 'Today, 10:45 AM',
                    items: [
                      {
                        medicine: MEDICINES[0],
                        strength: MEDICINES[0].strengths[1],
                        form: MEDICINES[0].forms[0],
                        packSize: MEDICINES[0].packSizes[1],
                        offer: PHARMACY_OFFERS[1],
                        quantity: 1,
                      },
                    ],
                    subtotal: 17.10,
                    savingsTotal: 16.90,
                    deliveryFee: 0,
                    packagingFee: 0,
                    totalAmount: 17.10,
                    status: 'pharmacy_accepted',
                    pharmacy: PHARMACY_OFFERS[1],
                    deliveryAddress: {
                      fullName: 'Dr. Priya Sharma',
                      street: 'Flat 402, Green Glen Layout, Bellandur',
                      city: 'Bengaluru',
                      state: 'Karnataka',
                      pincode: '560103',
                      phone: '+91 98765 43210',
                    },
                    paymentMethod: 'UPI',
                    idempotencyKey: 'IDEMP-SAMPLE-KEY',
                    estimatedDelivery: '45 mins Express',
                    batchNumber: '#IN-2024-884A',
                  }
                }
                onBackToCatalog={() => setCurrentScreen('home')}
                accessToken={accessToken}
              />
            )}

            {currentScreen === 'partner_portal' && <PartnerPortal />}
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
