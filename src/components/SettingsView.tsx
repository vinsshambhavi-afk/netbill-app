import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  MessageSquare, 
  Building, 
  CreditCard, 
  Check, 
  Download, 
  Sparkles,
  Phone,
  FileText
} from 'lucide-react';
import { useISP } from '../context/ISPContext';
import { DEFAULT_TEMPLATES } from '../utils/whatsapp';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDemoData, customers, payments } = useISP();

  const [formData, setFormData] = useState(settings);
  const [activeTemplateTab, setActiveTemplateTab] = useState<
    'cashReceipt' | 'dueTodayReminder' | 'upcomingReminder' | 'overdueReminder' | 'suspensionReminder'
  >('cashReceipt');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const insertVariable = (tag: string) => {
    const currentTemplate = formData.templates[activeTemplateTab];
    const newTemplate = currentTemplate + ` {{${tag}}}`;
    setFormData({
      ...formData,
      templates: {
        ...formData.templates,
        [activeTemplateTab]: newTemplate
      }
    });
  };

  const handleResetTemplate = () => {
    setFormData({
      ...formData,
      templates: {
        ...formData.templates,
        [activeTemplateTab]: DEFAULT_TEMPLATES[activeTemplateTab]
      }
    });
  };

  const handleExportAllJSON = () => {
    const backup = {
      settings: formData,
      customers,
      payments,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `netbill_isp_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const availableTags = [
    'customer_name',
    'subscriber_id',
    'activation_number',
    'amount',
    'currency',
    'receipt_no',
    'payment_method',
    'payment_date',
    'valid_to',
    'due_date',
    'plan_name',
    'speed',
    'balance',
    'collected_by',
    'isp_name',
    'support_phone',
    'upi_id'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-emerald-600" />
            System Settings & WhatsApp Templates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your ISP business information, UPI QR payment receiver, and customize WhatsApp message formats
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedFeedback && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Changes Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Business Profile & Billing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-emerald-600" />
              ISP Business Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ISP / Cable Network Name *
                </label>
                <input
                  type="text"
                  value={formData.ispName}
                  onChange={e => setFormData({ ...formData, ispName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Support Helpline *
                  </label>
                  <input
                    type="text"
                    value={formData.supportPhone}
                    onChange={e => setFormData({ ...formData, supportPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={formData.currencySymbol}
                    onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Active Cashier / Collector Desk Name
                </label>
                <input
                  type="text"
                  value={formData.activeCashier}
                  onChange={e => setFormData({ ...formData, activeCashier: e.target.value })}
                  placeholder="e.g. Suresh (Counter 1)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  UPI ID (VPA) for Reminders
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="name@okhdfcbank"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Inserted into WhatsApp reminders so customers can pay digitally
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GST / Tax Registration Number
                </label>
                <input
                  type="text"
                  value={formData.gstOrTaxNo}
                  onChange={e => setFormData({ ...formData, gstOrTaxNo: e.target.value })}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business Address (Printed on Receipts)
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Backup & Demo Data Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Data Management
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <button
                type="button"
                onClick={handleExportAllJSON}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Backup Entire Database (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all subscribers and receipts to demo sample data?')) {
                    resetToDemoData();
                  }
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100/50 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                <span>Reset to Sample ISP Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: WhatsApp Templates Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  WhatsApp Message Templates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Format the exact text dispatched for cash receipts and reminders
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetTemplate}
                className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
              >
                Reset This Template
              </button>
            </div>

            {/* Template Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTemplateTab('cashReceipt')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTemplateTab === 'cashReceipt'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🧾 Cash Received Receipt
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab('dueTodayReminder')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTemplateTab === 'dueTodayReminder'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ⚡ Due Today
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab('upcomingReminder')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTemplateTab === 'upcomingReminder'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📅 Upcoming (3 Days)
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab('overdueReminder')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTemplateTab === 'overdueReminder'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ⚠️ Overdue Warning
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab('suspensionReminder')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTemplateTab === 'suspensionReminder'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🛑 Suspension Notice
              </button>
            </div>

            {/* Variable Tag Helper Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Click to insert dynamic variable tag into message:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertVariable(tag)}
                    className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded border border-slate-200 transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Editor Box */}
            <div>
              <textarea
                rows={14}
                value={formData.templates[activeTemplateTab]}
                onChange={e =>
                  setFormData({
                    ...formData,
                    templates: {
                      ...formData.templates,
                      [activeTemplateTab]: e.target.value
                    }
                  })
                }
                className="w-full font-mono text-xs leading-relaxed p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Supports WhatsApp markdown: *bold*, _italics_, ~strikethrough~</span>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
              >
                Save Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
