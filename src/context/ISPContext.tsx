import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, ISPSettings, NavTab, OperatorRole, OperatorUser, PaymentRecord, ReminderLog } from '../types/isp';
import { DEMO_OPERATORS, INITIAL_CUSTOMERS, INITIAL_PAYMENTS, INITIAL_SETTINGS } from '../data/initialData';

interface ISPContextType {
  customers: Customer[];
  payments: PaymentRecord[];
  settings: ISPSettings;
  remindersLog: ReminderLog[];
  currentUser: OperatorUser | null;
  
  // Navigation & Tabs
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  selectedReceiptSubscriberId: string | null;
  setSelectedReceiptSubscriberId: (id: string | null) => void;
  viewSubscriberReceipts: (customerId: string) => void;

  // Modals & Thermal 80mm Printing
  isReceiveCashOpen: boolean;
  preselectedCustomerId: string | null;
  activeReceiptModal: { payment: PaymentRecord; customer: Customer } | null;
  printReceiptTarget: { payment: PaymentRecord; customer: Customer } | null;
  activeThermalReceipt: { payment: PaymentRecord; customer: Customer } | null;
  isImportModalOpen: boolean;
  isLoginModalOpen: boolean;
  
  openReceiveCash: (customerId?: string) => void;
  closeReceiveCash: () => void;
  openReceiptModal: (payment: PaymentRecord, customer: Customer) => void;
  closeReceiptModal: () => void;
  openThermalReceipt: (payment: PaymentRecord, customer: Customer) => void;
  closeThermalReceipt: () => void;
  triggerPrintReceipt: (payment: PaymentRecord, customer: Customer) => void;
  openImportModal: () => void;
  closeImportModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  // Authentication & Roles
  isAdmin: boolean;
  isCashier: boolean;
  switchRole: (role: OperatorRole) => void;
  roleRestrictionToast: string | null;
  showRoleRestrictionNotice: (actionName: string) => void;
  clearRoleRestrictionNotice: () => void;
  loginWithPhone: (phone: string, name?: string, role?: OperatorUser['role']) => void;
  logout: () => void;
  switchOperator: (operator: OperatorUser) => void;

  // Actions
  recordPayment: (params: {
    customerId: string;
    amount: number;
    method: PaymentRecord['method'];
    validFrom: string;
    validTo: string;
    notes?: string;
    collectedBy?: string;
  }) => { payment: PaymentRecord; customer: Customer };

  markPaymentWhatsAppSent: (paymentId: string) => void;
  
  logReminderSent: (customerId: string, type: ReminderLog['type'], messageText: string) => void;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  importSubscribers: (importedList: Omit<Customer, 'id' | 'createdAt'>[]) => number;
  
  updateSettings: (newSettings: Partial<ISPSettings>) => void;
  resetToDemoData: () => void;
}

const STORAGE_KEYS = {
  CUSTOMERS: 'netbill_customers_v1',
  PAYMENTS: 'netbill_payments_v1',
  SETTINGS: 'netbill_settings_v1',
  REMINDERS: 'netbill_reminders_v1',
  CURRENT_USER: 'netbill_current_user_v1',
};

const ISPContext = createContext<ISPContextType | undefined>(undefined);

export const ISPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<OperatorUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default to the first demo operator
    return DEMO_OPERATORS[0];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMERS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAYMENTS;
  });

  const [settings, setSettings] = useState<ISPSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SETTINGS;
  });

  const [remindersLog, setRemindersLog] = useState<ReminderLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Navigation and Subscriber Selection for Receipts
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedReceiptSubscriberId, setSelectedReceiptSubscriberId] = useState<string | null>(null);

  // Modal states
  const [isReceiveCashOpen, setIsReceiveCashOpen] = useState(false);
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<{ payment: PaymentRecord; customer: Customer } | null>(null);
  const [printReceiptTarget, setPrintReceiptTarget] = useState<{ payment: PaymentRecord; customer: Customer } | null>(null);
  const [activeThermalReceipt, setActiveThermalReceipt] = useState<{ payment: PaymentRecord; customer: Customer } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(remindersLog));
  }, [remindersLog]);

  // Auth functions
  const loginWithPhone = (phone: string, name?: string, role: OperatorUser['role'] = 'cashier') => {
    // Check if matching demo operator
    const cleanDigits = phone.replace(/\D/g, '');
    const matched = DEMO_OPERATORS.find(op => op.phone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10)));

    const user: OperatorUser = matched || {
      id: `op-${Date.now()}`,
      name: name || `Operator (${cleanDigits.slice(-4)})`,
      phone: cleanDigits,
      role: role,
      agency: 'ISP Field Desk'
    };

    setCurrentUser(user);
    setSettings(prev => ({
      ...prev,
      activeCashier: `${user.name} (${user.role === 'admin' ? 'Admin' : 'Field Desk'})`
    }));
    setIsLoginModalOpen(false);
  };

  // Role helpers & switching
  const [roleRestrictionToast, setRoleRestrictionToast] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';
  const isCashier = currentUser?.role !== 'admin';

  const showRoleRestrictionNotice = (actionName: string) => {
    setRoleRestrictionToast(`Access Restricted: "${actionName}" requires Administrator privileges. Cashier / Collector role can view directory and print receipts.`);
  };

  const clearRoleRestrictionNotice = () => {
    setRoleRestrictionToast(null);
  };

  const switchRole = (newRole: OperatorUser['role']) => {
    if (!currentUser) return;
    const updatedUser: OperatorUser = {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    setSettings(prev => ({
      ...prev,
      activeCashier: `${updatedUser.name} (${newRole === 'admin' ? 'Admin' : 'Cashier/Collector Desk'})`
    }));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const switchOperator = (operator: OperatorUser) => {
    setCurrentUser(operator);
    setSettings(prev => ({
      ...prev,
      activeCashier: `${operator.name} (${operator.role === 'admin' ? 'Admin' : 'Field Desk'})`
    }));
  };

  const openReceiveCash = (customerId?: string) => {
    setPreselectedCustomerId(customerId || null);
    setIsReceiveCashOpen(true);
  };

  const closeReceiveCash = () => {
    setIsReceiveCashOpen(false);
    setPreselectedCustomerId(null);
  };

  const openReceiptModal = (payment: PaymentRecord, customer: Customer) => {
    setActiveReceiptModal({ payment, customer });
  };

  const closeReceiptModal = () => {
    setActiveReceiptModal(null);
  };

  const viewSubscriberReceipts = (customerId: string) => {
    setSelectedReceiptSubscriberId(customerId);
    setCurrentTab('receipts');
  };

  const openThermalReceipt = (payment: PaymentRecord, customer: Customer) => {
    setPrintReceiptTarget({ payment, customer });
    setActiveThermalReceipt({ payment, customer });
  };

  const closeThermalReceipt = () => {
    setActiveThermalReceipt(null);
  };

  const triggerPrintReceipt = (payment: PaymentRecord, customer: Customer) => {
    setPrintReceiptTarget({ payment, customer });
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const openImportModal = () => setIsImportModalOpen(true);
  const closeImportModal = () => setIsImportModalOpen(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const recordPayment = ({
    customerId,
    amount,
    method,
    validFrom,
    validTo,
    notes,
    collectedBy
  }: {
    customerId: string;
    amount: number;
    method: PaymentRecord['method'];
    validFrom: string;
    validTo: string;
    notes?: string;
    collectedBy?: string;
  }) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) throw new Error('Customer not found');

    const nextNumber = payments.length + 1001;
    const receiptNo = `REC-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;
    const nowIso = new Date().toISOString();

    const collector = collectedBy || (currentUser ? `${currentUser.name} (${currentUser.role})` : settings.activeCashier);

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNo,
      customerId,
      subscriberId: customer.subscriberId,
      customerName: customer.name,
      customerPhone: customer.phone,
      amount,
      method,
      date: nowIso,
      validFrom,
      validTo,
      collectedBy: collector,
      notes,
      whatsappSent: false
    };

    // Update customer record
    const updatedCustomer: Customer = {
      ...customer,
      expiryDate: validTo,
      status: 'active',
      balance: Math.max(0, customer.balance + (amount - customer.monthlyFee)),
      lastPaymentDate: validFrom,
      lastPaymentAmount: amount,
      lastReceiptNo: receiptNo
    };

    setPayments(prev => [newPayment, ...prev]);
    setCustomers(prev => prev.map(c => (c.id === customerId ? updatedCustomer : c)));

    // Immediately open WhatsApp Receipt modal
    setIsReceiveCashOpen(false);
    setActiveReceiptModal({ payment: newPayment, customer: updatedCustomer });

    return { payment: newPayment, customer: updatedCustomer };
  };

  const markPaymentWhatsAppSent = (paymentId: string) => {
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? { ...p, whatsappSent: true, whatsappSentAt: new Date().toISOString() }
          : p
      )
    );
  };

  const logReminderSent = (customerId: string, type: ReminderLog['type'], messageText: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const logEntry: ReminderLog = {
      id: `rem-${Date.now()}`,
      customerId,
      subscriberId: customer.subscriberId,
      customerName: customer.name,
      phone: customer.phone,
      type,
      sentAt: new Date().toISOString(),
      messageText
    };

    setRemindersLog(prev => [logEntry, ...prev]);
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, lastReminderSentAt: new Date().toISOString() }
          : c
      )
    );
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (!isAdmin) {
      showRoleRestrictionNotice('Create New Subscriber');
      return {} as Customer;
    }
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const importSubscribers = (importedList: Omit<Customer, 'id' | 'createdAt'>[]): number => {
    if (!isAdmin) {
      showRoleRestrictionNotice('Import Subscribers');
      return 0;
    }
    const nowIso = new Date().toISOString();
    const created: Customer[] = importedList.map((c, idx) => ({
      ...c,
      id: `cust-imp-${Date.now()}-${idx}`,
      createdAt: nowIso
    }));

    setCustomers(prev => [...created, ...prev]);
    return created.length;
  };

  const updateCustomer = (id: string, partial: Partial<Customer>) => {
    if (!isAdmin) {
      showRoleRestrictionNotice('Edit Subscriber Details');
      return;
    }
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...partial } : c)));
  };

  const deleteCustomer = (id: string) => {
    if (!isAdmin) {
      showRoleRestrictionNotice('Delete Subscriber');
      return;
    }
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const updateSettings = (newSettings: Partial<ISPSettings>) => {
    if (!isAdmin) {
      showRoleRestrictionNotice('Update ISP Settings');
      return;
    }
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCustomers(INITIAL_CUSTOMERS);
    setPayments(INITIAL_PAYMENTS);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(DEMO_OPERATORS[0]);
    setRemindersLog([]);
  };

  return (
    <ISPContext.Provider
      value={{
        customers,
        payments,
        settings,
        remindersLog,
        currentUser,
        isAdmin,
        isCashier,
        switchRole,
        roleRestrictionToast,
        showRoleRestrictionNotice,
        clearRoleRestrictionNotice,
        currentTab,
        setCurrentTab,
        selectedReceiptSubscriberId,
        setSelectedReceiptSubscriberId,
        viewSubscriberReceipts,
        isReceiveCashOpen,
        preselectedCustomerId,
        activeReceiptModal,
        printReceiptTarget,
        activeThermalReceipt,
        isImportModalOpen,
        isLoginModalOpen,
        openReceiveCash,
        closeReceiveCash,
        openReceiptModal,
        closeReceiptModal,
        openThermalReceipt,
        closeThermalReceipt,
        triggerPrintReceipt,
        openImportModal,
        closeImportModal,
        openLoginModal,
        closeLoginModal,
        loginWithPhone,
        logout,
        switchOperator,
        recordPayment,
        markPaymentWhatsAppSent,
        logReminderSent,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        importSubscribers,
        updateSettings,
        resetToDemoData,
      }}
    >
      {children}
    </ISPContext.Provider>
  );
};

export const useISP = () => {
  const context = useContext(ISPContext);
  if (!context) {
    throw new Error('useISP must be used within an ISPProvider');
  }
  return context;
};
