import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  UserCheck, 
  Store, 
  ShieldCheck, 
  Code, 
  Globe, 
  Cloud, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Database, 
  Server, 
  Radio, 
  CreditCard, 
  Mail, 
  Building2, 
  Fingerprint, 
  BarChart3, 
  MapPin, 
  CheckCircle2, 
  Info,
  Lock,
  Cpu,
  Sparkles
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>('compare_module');

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 text-slate-800 p-3 sm:p-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            alt="GenericMed Help Brand Icon"
            className="h-9 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WRfdAY_qWDx8kEsvNaeD-0KqNET0ZuP1YAMZe0EvnkTicwXJxygBN3eeQnST_yqettCtPO5Y2VPpCc3eQa3oxQPPPVdIhiXKGhQXctoQLbFpTNX-gqLy4f3e-b8JAQCnfd_gGnEpxA0lbkARLfJc0LoAZYT-IE-ZPTpcUj3bBlEyMadjukDGjQLVFNL32qMCBnaBQXKF48foYI_RW3P_3dgjaYk0iyXOtNe-sNyNgWHNJiqSnwZBBTq8o"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-slate-900">
                GenericMed Help
              </h1>
              <span className="text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Compare • Choose • Buy
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              System Architecture — Multi-Tenant SaaS Platform (Secure • Scalable • Maintainable • Observable)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            99.9% Uptime SLA
          </span>
          <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            Row-Level Tenant Isolation
          </span>
        </div>
      </div>

      {/* Main Architecture Diagram Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-6">
        {/* Layer 1: Client Layer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Client Layer
              </h2>
              <span className="text-xs text-slate-400">Multiple client applications access the platform</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-sky-100/60 transition-colors">
              <Laptop className="w-5 h-5 text-sky-700" />
              <span className="font-bold text-slate-900">Web App</span>
              <span className="text-[10px] text-slate-500">(Customer)</span>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-sky-100/60 transition-colors">
              <Smartphone className="w-5 h-5 text-sky-700" />
              <span className="font-bold text-slate-900">Mobile App</span>
              <span className="text-[10px] text-slate-500">(iOS / Android)</span>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-sky-100/60 transition-colors">
              <UserCheck className="w-5 h-5 text-sky-700" />
              <span className="font-bold text-slate-900">Admin Portal</span>
              <span className="text-[10px] text-slate-500">(Internal Admins)</span>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-sky-100/60 transition-colors">
              <Store className="w-5 h-5 text-sky-700" />
              <span className="font-bold text-slate-900">Vendor Portal</span>
              <span className="text-[10px] text-slate-500">(Pharmacies)</span>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-sky-100/60 transition-colors">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              <span className="font-bold text-slate-900">Super Admin</span>
              <span className="text-[10px] text-slate-500">(Platform Gov)</span>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex flex-col items-center text-center gap-1 hover:bg-sky-100/60 transition-colors">
              <Code className="w-5 h-5 text-sky-700" />
              <span className="font-bold text-slate-900">Public APIs</span>
              <span className="text-[10px] text-slate-500">(Integrations)</span>
            </div>
          </div>
        </div>

        {/* Downward Arrow */}
        <div className="flex justify-center text-slate-300">
          <span className="material-symbols-outlined text-[24px]">south</span>
        </div>

        {/* Layer 2: Edge Layer */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Edge Layer
            </h2>
            <span className="text-xs text-slate-400">Secure entry point for all incoming network traffic</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col items-center text-center gap-1">
              <Globe className="w-4 h-4 text-indigo-700" />
              <span className="font-bold text-slate-900">DNS</span>
              <span className="text-[10px] text-slate-500">Global Geo-Latency</span>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col items-center text-center gap-1">
              <Cloud className="w-4 h-4 text-indigo-700" />
              <span className="font-bold text-slate-900">CDN</span>
              <span className="text-[10px] text-slate-500">(Static Assets)</span>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col items-center text-center gap-1">
              <ShieldAlert className="w-4 h-4 text-indigo-700" />
              <span className="font-bold text-slate-900">WAF</span>
              <span className="text-[10px] text-slate-500">DDoS &amp; OWASP Top 10</span>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col items-center text-center gap-1">
              <Activity className="w-4 h-4 text-indigo-700" />
              <span className="font-bold text-slate-900">Load Balancer</span>
              <span className="text-[10px] text-slate-500">(Health Checks)</span>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col items-center text-center gap-1">
              <Cpu className="w-4 h-4 text-indigo-700" />
              <span className="font-bold text-slate-900">API Gateway</span>
              <span className="text-[10px] text-slate-500">Rate Limiting + TLS</span>
            </div>
          </div>
        </div>

        {/* Downward Arrow */}
        <div className="flex justify-center text-slate-300">
          <span className="material-symbols-outlined text-[24px]">south</span>
        </div>

        {/* Middle Section: Sidebar + App Layer + Integrations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Multi-Tenant SaaS Isolation */}
          <div className="lg:col-span-3 bg-teal-50/70 border border-teal-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-800" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-teal-900">
                Multi-Tenant SaaS
              </h3>
            </div>

            <div className="text-xs space-y-1.5 text-slate-600">
              <p className="font-semibold text-slate-900">Tenant / Organization Isolation:</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Separate data per tenant</li>
                <li>Tenant configuration &amp; SLAs</li>
                <li>Subscription &amp; plan tiers</li>
                <li>Tenant isolation (DB level + App level)</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-teal-200/80">
              {['Tenant A (Apollo)', 'Tenant B (MedPlus)', 'Tenant C (Jan Aushadhi)'].map((t) => (
                <div
                  key={t}
                  className="bg-white p-2 rounded-xl border border-teal-200 text-xs flex items-center gap-2 font-medium text-slate-800"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="truncate">{t}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[10px] text-teal-800 font-semibold bg-teal-100/60 p-2 rounded-lg">
              User ➔ Tenant ➔ Role ➔ Permissions
            </div>
          </div>

          {/* Center Column: Modular Monolith Application Layer */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Application Layer (Modular Monolith)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Domain-driven architecture with clean module boundaries
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div 
                onClick={() => setActiveNode('user_mgmt')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                  User Management
                </div>
                <p className="text-[10px] text-slate-500">Registration / Login • Profiles • Invitations</p>
              </div>

              <div 
                onClick={() => setActiveNode('tenant_mgmt')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-700" />
                  Tenant Management
                </div>
                <p className="text-[10px] text-slate-500">Org setup • Tenant settings • Plan tiers</p>
              </div>

              <div 
                onClick={() => setActiveNode('auth')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-teal-700" />
                  Auth &amp; Authorization
                </div>
                <p className="text-[10px] text-slate-500">JWT / Sessions • RBAC • MFA / SSO</p>
              </div>

              <div 
                onClick={() => setActiveNode('compare_module')}
                className="bg-teal-50 p-3 rounded-xl border border-teal-400 hover:border-teal-600 transition-colors cursor-pointer space-y-1 ring-1 ring-teal-300"
              >
                <div className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  Product &amp; Price Comparison
                </div>
                <p className="text-[10px] text-teal-700">Search &amp; Filter • Price comparison • Lab tests</p>
              </div>

              <div 
                onClick={() => setActiveNode('order_pay')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-teal-700" />
                  Order &amp; Payment
                </div>
                <p className="text-[10px] text-slate-500">Cart &amp; Checkout • Payment processing • Tracking</p>
              </div>

              <div 
                onClick={() => setActiveNode('inventory')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-teal-700" />
                  Inventory &amp; Vendor Mgmt
                </div>
                <p className="text-[10px] text-slate-500">Pharmacy mgmt • Stock &amp; Availability • SLA</p>
              </div>

              <div 
                onClick={() => setActiveNode('notifications')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-700" />
                  Notification Service
                </div>
                <p className="text-[10px] text-slate-500">Email / SMS / Push • Order updates • Alerts</p>
              </div>

              <div 
                onClick={() => setActiveNode('reporting')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-teal-600 transition-colors cursor-pointer space-y-1"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-teal-700" />
                  Reporting &amp; Analytics
                </div>
                <p className="text-[10px] text-slate-500">Business reports • Usage analytics • Revenue</p>
              </div>
            </div>
          </div>

          {/* Right Column: External Integrations */}
          <div className="lg:col-span-3 bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4 space-y-2 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-900">
              External Integrations
            </h3>

            <div className="space-y-1.5">
              <div className="bg-white p-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">Payment Gateway</span>
                  <span className="text-[9px] text-slate-400">(UPI, Cards, NetBanking)</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">SMS / Email Service</span>
                  <span className="text-[9px] text-slate-400">(Notifications, OTPs)</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">Pharmacy Vendor APIs</span>
                  <span className="text-[9px] text-slate-400">(Product &amp; Inventory Sync)</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">Identity Provider</span>
                  <span className="text-[9px] text-slate-400">(SSO / OAuth / ABAC)</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl border border-indigo-100 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">Maps &amp; Geocoding</span>
                  <span className="text-[9px] text-slate-400">(Radius delivery routing)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Downward Arrow */}
        <div className="flex justify-center text-slate-300">
          <span className="material-symbols-outlined text-[24px]">south</span>
        </div>

        {/* Layer 4: Data Layer */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-800" />
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                  Data Layer (Separated Platform &amp; Tenant Data with Isolation)
                </h3>
                <p className="text-[11px] text-slate-500">
                  PostgreSQL with schema separation, Redis cache, Elasticsearch fuzzy matching
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center space-y-0.5">
              <span className="font-bold text-slate-900 block">Primary DB</span>
              <span className="text-[10px] text-emerald-700 font-semibold">PostgreSQL</span>
              <p className="text-[9px] text-slate-400">Multi-schema partition</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center space-y-0.5">
              <span className="font-bold text-slate-900 block">Cache Store</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Redis Cluster</span>
              <p className="text-[9px] text-slate-400">Offer TTL caching</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center space-y-0.5">
              <span className="font-bold text-slate-900 block">Search Index</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Elasticsearch</span>
              <p className="text-[9px] text-slate-400">Fuzzy salt match</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center space-y-0.5">
              <span className="font-bold text-slate-900 block">Object Storage</span>
              <span className="text-[10px] text-emerald-700 font-semibold">S3 / Cloud Storage</span>
              <p className="text-[9px] text-slate-400">NABL Lab PDFs</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center space-y-0.5">
              <span className="font-bold text-slate-900 block">Analytics DB</span>
              <span className="text-[10px] text-emerald-700 font-semibold">ClickHouse</span>
              <p className="text-[9px] text-slate-400">AARRR event stream</p>
            </div>
          </div>
        </div>

        {/* Downward Arrow */}
        <div className="flex justify-center text-slate-300">
          <span className="material-symbols-outlined text-[24px]">south</span>
        </div>

        {/* Layer 5: Asynchronous Operations & Event Driven */}
        <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-800" />
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-purple-900">
                Asynchronous Operations &amp; Event Driven
              </h3>
              <p className="text-[11px] text-slate-500">
                Used for notifications, reporting, data sync, and background jobs
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto text-xs pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-purple-200 text-center shrink-0 min-w-[120px]">
              <span className="font-bold text-purple-900 block">Event Bus</span>
              <span className="text-[10px] text-slate-500">(Kafka / Cloud PubSub)</span>
            </div>
            <span className="text-purple-300 font-bold">➔</span>
            <div className="bg-white p-2.5 rounded-xl border border-purple-200 text-center shrink-0 min-w-[120px]">
              <span className="font-bold text-purple-900 block">Workers</span>
              <span className="text-[10px] text-slate-500">(Background Jobs)</span>
            </div>
            <span className="text-purple-300 font-bold">➔</span>
            <div className="bg-white p-2.5 rounded-xl border border-purple-200 text-center shrink-0 min-w-[120px]">
              <span className="font-bold text-purple-900 block">Notifications</span>
              <span className="text-[10px] text-slate-500">(Email/SMS/Push)</span>
            </div>
            <span className="text-purple-300 font-bold">➔</span>
            <div className="bg-white p-2.5 rounded-xl border border-purple-200 text-center shrink-0 min-w-[120px]">
              <span className="font-bold text-purple-900 block">Reporting Service</span>
              <span className="text-[10px] text-slate-500">(ETL Pipeline)</span>
            </div>
            <span className="text-purple-300 font-bold">➔</span>
            <div className="bg-white p-2.5 rounded-xl border border-purple-200 text-center shrink-0 min-w-[120px]">
              <span className="font-bold text-purple-900 block">Webhooks</span>
              <span className="text-[10px] text-slate-500">(Pharmacy Sync)</span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee tags */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Security (TLS + WAF)
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Activity className="w-3.5 h-3.5 text-teal-600" /> Scalability (Stateless)
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-teal-600" /> Data Privacy &amp; CDSCO Compliance
            </span>
          </div>

          <span className="text-slate-400 font-mono">
            GenericMed Help • Architecture v1.0
          </span>
        </div>
      </div>
    </div>
  );
};
