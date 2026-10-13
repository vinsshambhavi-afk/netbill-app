import React, { useState } from 'react';
import { 
  Wifi, 
  Plus, 
  ReceiptText, 
  BellRing, 
  Users, 
  HandCoins, 
  Settings as SettingsIcon, 
  BarChart3, 
  ChevronDown, 
  RefreshCw, 
  LogOut,
  ShieldCheck,
  Check,
  Receipt
} from 'lucide-react';
import { useISP } from '../context/ISPContext';

export type NavTab = 'dashboard' | 'collections' | 'reminders' | 'subscribers' | 'receipts' | 'settings';

interface HeaderProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { 
    openReceiveCash, 
    customers, 
    currentUser, 
    openLoginModal, 
    logout,
    isAdmin,
    switchRole
  } = useISP();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Calculate urgent reminders count for indicator
  const todayDueCount = customers.filter(c => c.status === 'due_today' || c.status === 'overdue').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div 
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Wifi className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              NetBill <span className="text-emerald-600 font-semibold">ISP</span>
            </span>
          </div>

          {/* Zone 2: 4-5 Clean single-line nav tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('collections')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'collections'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HandCoins className="w-4 h-4 text-slate-500" />
              <span>Cash Register</span>
            </button>

            <button
              onClick={() => setCurrentTab('reminders')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors relative ${
                currentTab === 'reminders'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BellRing className="w-4 h-4 text-slate-500" />
              <span>Reminders</span>
              {todayDueCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] font-semibold bg-amber-500 text-white rounded-full tabular-nums">
                  {todayDueCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('subscribers')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'subscribers'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Subscribers</span>
            </button>

            <button
              onClick={() => setCurrentTab('receipts')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'receipts'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ReceiptText className="w-4 h-4 text-slate-500" />
              <span>Receipt History</span>
            </button>

            <button
              onClick={() => setCurrentTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'settings'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Zone 3: Role Switcher Control + Profile Dropdown + Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct Role Switching Segmented Control */}
            <div 
              className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shadow-2xs"
              title="Switch role between Admin and Cashier/Collector"
            >
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  isAdmin
                    ? 'bg-white text-indigo-950 font-bold shadow-xs border border-slate-200/70'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">Adm</span>
              </button>

              <button
                type="button"
                onClick={() => switchRole('cashier')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  !isAdmin
                    ? 'bg-white text-emerald-950 font-bold shadow-xs border border-slate-200/70'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <Receipt className={`w-3.5 h-3.5 ${!isAdmin ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Cashier / Collector</span>
                <span className="sm:hidden">Cashier</span>
              </button>
            </div>

            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  title="Operator profile & role settings"
                >
                  <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[11px] ${
                    isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="font-semibold text-slate-900 max-w-[105px] truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {isAdmin ? 'Admin' : 'Cashier'}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 divide-y divide-slate-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="p-3 bg-slate-50/70">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                          <div className="font-mono text-[11px] text-slate-500 mt-0.5">+91 {currentUser.phone}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isAdmin ? 'Admin' : 'Cashier'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{currentUser.agency || 'ISP Desk'}</div>
                    </div>

                    {/* Dedicated Role Switcher in Dropdown */}
                    <div className="p-2.5 bg-slate-50/50" onClick={e => e.stopPropagation()}>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Switch Active Role
                      </div>
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            switchRole('admin');
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-lg border text-left transition-all ${
                            isAdmin 
                              ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-300' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            isAdmin ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isAdmin && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>Admin</span>
                              <span className="text-[10px] font-normal text-indigo-700 bg-indigo-100/60 px-1 rounded">Full Access</span>
                            </div>
                            <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                              Add, edit, & delete subscribers, configure ISP settings
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            switchRole('cashier');
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-lg border text-left transition-all ${
                            !isAdmin 
                              ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            !isAdmin ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}>
                            {!isAdmin && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>Cashier / Collector</span>
                              <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/60 px-1 rounded">Read-Only</span>
                            </div>
                            <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                              View directory, collect cash, & print 80mm thermal receipts only
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={openLoginModal}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg text-left transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Switch Operator Account</span>
                      </button>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 rounded-lg text-left font-medium transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Log Out of NetBill</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => openReceiveCash()}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Receive Cash</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Subnav with compact role indicator */}
        <div className="lg:hidden flex items-center justify-between gap-2 py-2 border-t border-slate-100 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentTab === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('collections')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentTab === 'collections' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => setCurrentTab('reminders')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium flex items-center gap-1 ${
                currentTab === 'reminders' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Reminders
              {todayDueCount > 0 && <span className="text-[10px] bg-amber-500 text-white px-1.5 rounded-full">{todayDueCount}</span>}
            </button>
            <button
              onClick={() => setCurrentTab('subscribers')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentTab === 'subscribers' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Subscribers
            </button>
            <button
              onClick={() => setCurrentTab('receipts')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentTab === 'receipts' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Receipts
            </button>
            <button
              onClick={() => setCurrentTab('settings')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="shrink-0 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={() => switchRole(isAdmin ? 'cashier' : 'admin')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border ${
                isAdmin 
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
              title="Click to switch role"
            >
              <span>{isAdmin ? '👑 Admin' : '🧾 Cashier'}</span>
              <span className="text-[10px] text-slate-400 font-normal">↺</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
