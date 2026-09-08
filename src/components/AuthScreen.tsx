import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Mail, 
  Lock, 
  Phone, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Smartphone, 
  KeyRound, 
  Stethoscope, 
  Store, 
  HeartPulse, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  AlertCircle,
  Building2,
  Fingerprint
} from 'lucide-react';

interface AuthScreenProps {
  initialMode?: 'login' | 'register';
  currentUser?: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout?: () => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  currentUser,
  onLoginSuccess,
  onLogout,
  onBack,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('password');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('priya.sharma@example.com');
  const [loginPassword, setLoginPassword] = useState('GenericMed@2025');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'patient' | 'doctor' | 'pharmacist'>('patient');
  const [regAbhaId, setRegAbhaId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Send OTP
  const handleSendOtp = () => {
    if (!loginIdentifier || loginIdentifier.trim().length < 6) {
      setErrorMessage('Please enter a valid mobile number or email');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      setOtpCode('7492'); // Pre-fill mock OTP for smooth testing
      setOtpCountdown(30);
    }, 600);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (loginMethod === 'otp') {
      if (!otpCode || otpCode.trim().length !== 4) {
        setErrorMessage('Please enter the 4-digit verification code');
        return;
      }
    } else {
      if (!loginIdentifier.trim()) {
        setErrorMessage('Please enter your email or mobile number');
        return;
      }
      if (!loginPassword || loginPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser: UserProfile = {
        id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
        fullName: loginIdentifier.includes('@') ? 'Dr. Priya Sharma' : 'Patient User',
        email: loginIdentifier.includes('@') ? loginIdentifier : 'user@genericmed.in',
        phone: loginIdentifier.includes('@') ? '+91 98765 43210' : loginIdentifier,
        role: 'patient',
        abhaId: '91-4820-1940-5821',
        pincode: '560103',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        isVerified: true,
      };
      onLoginSuccess(authenticatedUser);
    }, 650);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!regTermsAccepted) {
      setErrorMessage('You must accept the terms of service and CDSCO compliance');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
        fullName: regFullName,
        email: regEmail,
        phone: regPhone.startsWith('+91') ? regPhone : `+91 ${regPhone}`,
        role: regRole,
        abhaId: regAbhaId.trim() || undefined,
        pincode: '560001',
        avatarUrl: regRole === 'doctor'
          ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250'
          : regRole === 'pharmacist'
          ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=250'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        isVerified: true,
      };
      onLoginSuccess(newUser);
    }, 700);
  };

  // Preset demo logins for fast exploration
  const handleQuickDemoLogin = (role: 'patient' | 'doctor' | 'pharmacist') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'doctor') {
        onLoginSuccess({
          id: 'DOC-8821',
          fullName: 'Dr. Ananya Roy, MD',
          email: 'ananya.roy@aims.edu',
          phone: '+91 98450 11223',
          role: 'doctor',
          abhaId: '14-8930-4491-0192',
          pincode: '560029',
          avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
          isVerified: true,
        });
      } else if (role === 'pharmacist') {
        onLoginSuccess({
          id: 'PHARM-1084',
          fullName: 'Ramesh Patel (Jan Aushadhi Lead)',
          email: 'ramesh.patel@janaushadhi.gov.in',
          phone: '+91 94481 66789',
          role: 'pharmacist',
          pincode: '560103',
          avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=250',
          isVerified: true,
        });
      } else {
        onLoginSuccess({
          id: 'PAT-9018',
          fullName: 'Dr. Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 98765 43210',
          role: 'patient',
          abhaId: '91-4820-1940-5821',
          pincode: '560103',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          isVerified: true,
        });
      }
    }, 400);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf8ff] text-[#131b2e] pb-20">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#faf8ff]/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            id="auth-back-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 p-1 flex items-center justify-center">
              <img
                alt="GenericMed Help Symbol"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
              />
            </div>
            <span className="font-extrabold text-sm text-slate-900">GenericMed Help</span>
          </div>

          <div className="w-16 flex justify-end">
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              Secure
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-6 space-y-6">
        {/* If user is already logged in, show active account card with logout / switch option */}
        {currentUser && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-teal-200 bg-gradient-to-br from-teal-50/50 via-white to-teal-50/20">
            <div className="flex items-center justify-between pb-3 border-b border-teal-100">
              <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Active Session
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
                {currentUser.role}
              </span>
            </div>

            <div className="flex items-center gap-3.5 py-4">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={currentUser.fullName}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-teal-600/30 shadow-xs"
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-base truncate">
                  {currentUser.fullName}
                </h3>
                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-teal-700 font-semibold">
                  <span>{currentUser.phone}</span>
                  {currentUser.abhaId && <span>• ABHA: {currentUser.abhaId}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onBack}
                className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Continue to App
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}

        {/* Brand Hero & Symbol */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white border border-teal-200 shadow-md mx-auto p-2.5 flex items-center justify-center ring-4 ring-teal-50">
            <img
              alt="GenericMed Help Official Symbol"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              {mode === 'login' ? 'Welcome Back to GenericMed Help' : 'Create GenericMed Help Account'}
            </h1>
            <p className="text-xs text-[#00685f] font-semibold mt-0.5">
              Compare • Choose • Buy — India&apos;s Verified Bioequivalent Gateway
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle Pill (Sign In vs Register) */}
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
          <button
            id="auth-toggle-signin"
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-toggle-register"
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LOGIN FORM */}
        {/* ========================================================================= */}
        {mode === 'login' ? (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
            {/* Login Method Tabs (Mobile OTP vs Password) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700">Sign in with:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setIsOtpSent(false);
                    setErrorMessage(null);
                  }}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setErrorMessage(null);
                  }}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Identifier Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {loginMethod === 'otp' ? 'Mobile Number' : 'Email or Mobile Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {loginMethod === 'otp' ? (
                      <Smartphone className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    id="login-identifier-input"
                    type={loginMethod === 'otp' ? 'tel' : 'text'}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      loginMethod === 'otp' ? 'e.g. 9876543210' : 'name@example.com or 9876543210'
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password or OTP Fields */}
              {loginMethod === 'password' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setErrorMessage('Demo mode: use GenericMed@2025 or quick login presets below')}
                      className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* Mobile OTP Flow */
                <div className="space-y-2">
                  {!isOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Send 4-Digit OTP Code</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Enter OTP sent via SMS:</span>
                        <span className="text-[11px] text-teal-700 font-semibold">
                          Code: <strong>7492</strong> (Pre-filled)
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          id="login-otp-input"
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="4-digit OTP"
                          className="w-full pl-9 pr-3 py-2.5 text-center tracking-widest text-base font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Didn&apos;t receive code?</span>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-teal-700 font-bold hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm rounded-xl shadow-md shadow-teal-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign In to GenericMed</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block mb-2 text-center uppercase tracking-wider">
                ⚡ Instant One-Click Demo Sign-In
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  id="quick-login-patient"
                  onClick={() => handleQuickDemoLogin('patient')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-teal-900 text-[11px] flex items-center gap-1">
                    <User className="w-3 h-3 text-teal-600" /> Patient
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">Dr. Priya S.</div>
                </button>

                <button
                  type="button"
                  id="quick-login-doctor"
                  onClick={() => handleQuickDemoLogin('doctor')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-teal-900 text-[11px] flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-teal-600" /> Doctor
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">Dr. A. Roy</div>
                </button>

                <button
                  type="button"
                  id="quick-login-pharmacist"
                  onClick={() => handleQuickDemoLogin('pharmacist')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-teal-900 text-[11px] flex items-center gap-1">
                    <Store className="w-3 h-3 text-teal-600" /> Pharmacy
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">Jan Aushadhi</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* REGISTRATION FORM */
          /* ========================================================================= */
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-700">Choose your Account Type:</span>
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setRegRole('patient')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    regRole === 'patient'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-extrabold ring-1 ring-teal-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium'
                  }`}
                >
                  <User className="w-4 h-4 mx-auto mb-1 text-teal-700" />
                  <span className="text-[11px] block">Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('doctor')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    regRole === 'doctor'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-extrabold ring-1 ring-teal-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 mx-auto mb-1 text-teal-700" />
                  <span className="text-[11px] block">Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('pharmacist')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    regRole === 'pharmacist'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-900 font-extrabold ring-1 ring-teal-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium'
                  }`}
                >
                  <Store className="w-4 h-4 mx-auto mb-1 text-teal-700" />
                  <span className="text-[11px] block">Pharmacist</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name {regRole === 'doctor' && '(with credentials, e.g. Dr. Name)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="register-name-input"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="register-email-input"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (India +91)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="register-phone-input"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="10-digit number (e.g. 9876543210)"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Optional ABHA ID for Ayushman Bharat Digital Health Integration */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">ABHA Health ID (Optional)</label>
                  <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    ABDM Linked
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Fingerprint className="w-4 h-4 text-teal-600" />
                  </div>
                  <input
                    id="register-abha-input"
                    type="text"
                    value={regAbhaId}
                    onChange={(e) => setRegAbhaId(e.target.value)}
                    placeholder="14-digit ABHA Number (e.g. 14-9920-1102-4412)"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-confirm-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={regTermsAccepted}
                    onChange={(e) => setRegTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span>
                    I accept the <strong className="text-slate-800">GenericMed Help Terms of Service</strong> and agree to CDSCO medicine dispensing and verification regulations.
                  </span>
                </label>
              </div>

              {/* Submit Registration */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm rounded-xl shadow-md shadow-teal-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Regulatory & Safety Footer Guarantee */}
        <div className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
          <div className="min-w-0 text-[11px] leading-tight">
            <span className="font-bold text-slate-800 block">CDSCO &amp; Drugs and Cosmetics Act Compliant</span>
            Your health records, prescription uploads, and orders are secured with end-to-end encryption.
          </div>
        </div>
      </main>
    </div>
  );
};
