import React, { useState } from 'react';
import { 
  Wifi, 
  Phone, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Receipt, 
  BellRing, 
  Banknote,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useISP } from '../context/ISPContext';
import { DEMO_OPERATORS } from '../data/initialData';
import { OperatorRole } from '../types/isp';

export const LoginPage: React.FC = () => {
  const { loginWithPhone, settings, customers } = useISP();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [role, setRole] = useState<OperatorRole>('cashier');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit mobile phone number');
      return;
    }
    setError(null);
    setStep('otp');
    setOtpCode('4821'); // Pre-fill test OTP for instantaneous user testing
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }
    loginWithPhone(phoneNumber, operatorName.trim() || undefined, role);
    setError(null);
  };

  const handleQuickDemoLogin = (op: typeof DEMO_OPERATORS[0]) => {
    loginWithPhone(op.phone, op.name, op.role);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background subtle mesh decoration */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px), radial-gradient(#0284C7 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Broadband Billing & Collections Portal
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
              <Wifi className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              NetBill <span className="text-emerald-500">ISP</span>
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            {settings.ispName} · Operator & Cashier Field Desk
          </p>
        </div>

        {/* Card Box Split View */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Feature Column (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Field Operations
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Broadband Cash & Renewal Terminal
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Log in to record cash collections, generate instant WhatsApp receipts, and dispatch monthly reminders.
                </p>
              </div>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block">Instant WhatsApp Receipts</strong>
                    <span className="text-slate-400 text-[11px]">Automatic receipt generation with validity extension</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block">Monthly Reminder Queues</strong>
                    <span className="text-slate-400 text-[11px]">1-click dispatch for due today and overdue accounts</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block">Cash Drawer Balancing</strong>
                    <span className="text-slate-400 text-[11px]">Note-by-note reconciliation for daily handover</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Subscribers: <strong className="text-slate-300 font-mono">{customers.length}</strong></span>
              <span>24x7 Network Desk</span>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {step === 'phone' ? 'Operator Sign In' : 'Verify Mobile OTP'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {step === 'phone' 
                      ? 'Enter your mobile number to access your cash desk' 
                      : `Enter the 4-digit code sent to +91 ${phoneNumber}`}
                  </p>
                </div>
                {step === 'otp' && (
                  <button
                    onClick={() => setStep('phone')}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400 font-mono">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98765 12340"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full pl-12 pr-3 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Staff Member Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={operatorName}
                      onChange={e => setOperatorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assigned Role & Permissions
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          role === 'admin'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-1 ring-indigo-400 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>Admin</span>
                          <span className="text-[10px] text-indigo-700 font-normal">Full Access</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Edit & delete subscribers</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('cashier')}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          role === 'cashier' || role === 'field_agent' || role === 'collector'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-400 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>Cashier / Collector</span>
                          <span className="text-[10px] text-emerald-700 font-normal">Read-Only</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">View & print receipts only</div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors mt-2"
                  >
                    <span>Get OTP Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
                    <span>Verification code dispatched to </span>
                    <strong className="font-mono text-emerald-950">+91 {phoneNumber}</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 4-Digit OTP Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      className="w-full text-center tracking-widest text-2xl font-bold font-mono py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                      <span>Test verification code: <strong className="font-mono text-emerald-700">4821</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtpCode('4821')}
                        className="text-emerald-700 hover:underline font-semibold"
                      >
                        Auto-fill
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="w-1/3 py-2.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                    >
                      Verify & Access Dashboard
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                Fast Sign In as Pre-configured Staff Member:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_OPERATORS.map(op => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(op)}
                    className="p-2.5 text-xs bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-lg text-left transition-colors space-y-1"
                  >
                    <div className="font-semibold text-slate-900 truncate">{op.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{op.phone}</div>
                    <div className="text-[10px] font-medium text-emerald-700 capitalize">
                      {op.role.replace('_', ' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
