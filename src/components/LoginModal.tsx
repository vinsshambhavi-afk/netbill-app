import React, { useState } from 'react';
import { X, Phone, Lock, Check, ShieldCheck, UserCheck, ArrowRight, Wifi } from 'lucide-react';
import { useISP } from '../context/ISPContext';
import { DEMO_OPERATORS } from '../data/initialData';
import { OperatorRole } from '../types/isp';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithPhone, currentUser } = useISP();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [role, setRole] = useState<OperatorRole>('cashier');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError(null);
    setStep('otp');
    setOtpCode('4821'); // Auto-fill sample OTP for seamless user testing
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }
    loginWithPhone(phoneNumber, operatorName.trim() || undefined, role);
    setStep('phone');
    setError(null);
  };

  const handleQuickDemoLogin = (op: typeof DEMO_OPERATORS[0]) => {
    loginWithPhone(op.phone, op.name, op.role);
    setStep('phone');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden my-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Wifi className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Operator Login</h2>
              <p className="text-xs text-slate-500">Sign in with phone number & OTP</p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={closeLoginModal}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                    className="w-full pl-12 pr-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operator Name (Optional)
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
                  Access Role & Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors ${
                      role === 'admin'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-1 ring-indigo-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Admin</span>
                      <span className="text-[10px] text-indigo-700 font-normal">Full Access</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Edit/delete subscribers</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('cashier')}
                    className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors ${
                      role === 'cashier' || role === 'field_agent' || role === 'collector'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Cashier / Collector</span>
                      <span className="text-[10px] text-emerald-700 font-normal">Read-Only</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">View & print receipts</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors"
              >
                <span>Get OTP Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
                <span>OTP verification code sent to </span>
                <strong className="font-mono">{phoneNumber}</strong>
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
                  className="w-full text-center tracking-widest text-lg font-bold font-mono py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block text-center">
                  Sample test code prefilled: <strong className="font-mono text-emerald-700">4821</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          )}

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Quick Sign In as Pre-configured Operator:
            </span>
            <div className="space-y-1.5">
              {DEMO_OPERATORS.map(op => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(op)}
                  className="w-full flex items-center justify-between p-2 text-xs bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-lg text-left transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{op.name}</span>
                    <span className="text-slate-400 font-mono text-[11px] ml-1.5">({op.phone})</span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded capitalize">
                    {op.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
