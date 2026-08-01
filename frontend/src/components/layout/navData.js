import {
  LayoutDashboard, Users, UserPlus,
  Settings, Database, Sliders, User, Building2, Lock, IdCard, Award,
  Calculator, FileText, Car, Store, Boxes, Diamond, TrendingUp, TrendingDown, Key, UserCheck,
  Upload, CheckCircle, ShieldCheck, FileSearch, ShieldBan, Plus,
  Briefcase, BookOpen, CreditCard, Download, FileEdit, ArrowRightLeft, Landmark, Banknote, ClipboardList,
  Wallet, LayoutGrid, Coins, Box, PhoneCall, PhoneForwarded, Send, History, X,
  CalendarDays, UserCog, ClipboardCheck, MapPin, Shield
} from 'lucide-react';

export const ADMIN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
  {
    id: 'master', label: 'Master', icon: Database,
    children: [
      { label: 'Company Master', icon: Settings, path: '/admin/master/config' },
      { label: 'Branch Master', icon: Building2, path: '/admin/master/branch' },
      // { label: 'Employee Master', icon: Users, path: '/admin/master/employee' },
      { label: 'User Role Master', icon: UserCog, path: '/admin/master/user-role' },
      { label: 'Access Type Master', icon: Users, path: '/admin/roles' },
      { label: 'Ranking Master', icon: Award, path: '/admin/master/ranking' },
      { label: 'Code Sequence', icon: Database, path: '/admin/master/code-sequence' },
    ]
  },
  {
    id: 'loan_config', label: 'Loan Configuration', icon: Sliders,
    children: [
      { label: 'Loan Calculator', icon: Calculator, path: '/admin/loan-config/calculator' },
      { label: 'Loan Scheme', icon: FileText, path: '/admin/loan-config/scheme' },
      { label: 'Vehicle Master', icon: Car, path: '/admin/loan-config/vehicle' },
      { label: 'Dealer Master', icon: Store, path: '/admin/loan-config/dealer' },
      { label: 'Item Group Master', icon: Boxes, path: '/admin/loan-config/item-group' },
      { label: 'Purity Master', icon: Diamond, path: '/admin/loan-config/purity' },
      { label: 'Gold Rate Master', icon: TrendingUp, path: '/admin/loan-config/gold-rate' },
      { label: 'Locker Master', icon: Key, path: '/admin/loan-config/locker' },
      { label: 'Valuer Master', icon: UserCheck, path: '/admin/loan-config/valuer' },
    ]
  },
  {
    id: 'borrower', label: 'Customer', icon: User,
    children: [
      { label: 'New Customer', icon: UserPlus, path: '/admin/borrower/new' },
      { label: 'Customer List', icon: User, path: '/admin/borrower/list' },
      { label: 'CIBIL Check', icon: ShieldCheck, path: '/admin/borrower/cibil-check' },
      { label: 'Customer Block/Unblock', icon: ShieldBan, path: '/admin/borrower/block' },
      { label: 'Customer Ledger', icon: BookOpen, path: '/admin/borrower/ledger' },
    ]
  },
  {
    id: 'provide_loan', label: 'Loan', icon: Coins,
    children: [
      { label: 'Provide Loan', icon: Plus, path: '/admin/provide-loan' },
      { label: 'Edit Loan', icon: FileEdit, path: '/admin/provide-loan/edit' },
      { label: 'Top-Up Loan', icon: TrendingUp, path: '/admin/provide-loan/top-up' },
      { label: 'Loan Closure NOC', icon: CheckCircle, path: '/admin/provide-loan/closure' },
    ]
  },
  {
    id: 'accounts', label: 'Accounts', icon: Briefcase,
    children: [
      { label: 'Ledger Master', icon: BookOpen, path: '/admin/accounts/ledger-master' },
      { label: 'Accounts Group Master', icon: Users, path: '/admin/accounts/group-master' },
      { label: 'Payment Voucher Entry', icon: CreditCard, path: '/admin/accounts/payment-voucher' },
      { label: 'Receive Voucher Entry', icon: Download, path: '/admin/accounts/receive-voucher' },
      { label: 'Journal Voucher Entry', icon: FileEdit, path: '/admin/accounts/journal-voucher' },
      { label: 'Contra Voucher Entry', icon: ArrowRightLeft, path: '/admin/accounts/contra-voucher' },
      { label: 'Bank Deposit Entry', icon: Landmark, path: '/admin/accounts/bank-deposit' },
      { label: 'Bank Withdrawl Entry', icon: Banknote, path: '/admin/accounts/bank-withdrawl' },
      { label: 'Journal Report', icon: FileText, path: '/admin/accounts/journal-report' },
      { label: 'Ledger Report', icon: FileText, path: '/admin/accounts/ledger-report' },
      { label: 'Profit & Loss', icon: TrendingUp, path: '/admin/accounts/profit-loss' },
      { label: 'Trial Balance', icon: FileText, path: '/admin/accounts/trial-balance' },
      { label: 'Balance Sheet', icon: Landmark, path: '/admin/accounts/balance-sheet' },
    ]
  },
  {
    id: 'employee', label: 'Employee', icon: Users,
    children: [
      { label: 'Employees List', icon: Users, path: '/admin/employees' },
      { label: 'New Employee', icon: UserPlus, path: '/admin/employees/create' },
      { label: 'Promotion / Demotion', icon: TrendingUp, path: '/admin/employees/promotion' },
      { label: 'Attendance Management', icon: UserCheck, path: '/admin/attendance' },
      { label: 'Salary Management', icon: Calculator, path: '/admin/salary' },
      { label: 'Live Tracking', icon: MapPin, path: '/admin/employees/live-tracking' },
    ]
  },
  {
    id: 'chitty', label: 'Chitty', icon: Users,
    children: [
      { label: 'Chitty Scheme', icon: Users, path: '/admin/chitty/scheme' },
      { label: 'Scheme Allocation', icon: UserPlus, },
      { label: 'Chitty Group Master', icon: TrendingUp, },
    ]
  },
  {
    id: 'reports', label: 'Reports', icon: ClipboardList,
    children: [
      { label: 'Loan Account Ledger', icon: FileText, path: '/admin/reports/loan-account-ledger' },
      { label: 'Loan Account Ledger Non EMI', icon: FileText, path: '/admin/reports/loan-account-ledger-non-emi' },
      { label: 'Loan Approve Report', icon: FileText, path: '/admin/reports/loan-approve-report' },
      { label: 'Loan Disbursement Report', icon: FileText, path: '/admin/reports/loan-disbursement-report' },
      { label: 'Loan Due Report', icon: FileText, path: '/admin/reports/loan-due-report' },
      { label: 'Loan Over Due Report', icon: FileText, path: '/admin/reports/loan-over-due-report' },
      { label: 'Loan Outstanding Report', icon: FileText, path: '/admin/reports/loan-outstanding-report' },
      { label: 'Loan Emi Collection Report', icon: FileText, path: '/admin/reports/loan-emi-collection-report' },
      { label: 'Ledger Statement', icon: FileText, path: '/admin/reports/ledger-statement' },
      { label: 'Cash Book Statement', icon: FileText, path: '/admin/reports/cash-book-statement' },
    ]
  },
  {
    id: 'approval', label: 'Approval', icon: Wallet,
    children: [
      { label: 'Pending Approvals', icon: FileText, path: '/admin/approval/pending' },
      { label: 'Loan Requisition Report', icon: FileText, path: '/admin/reports/loan-requisition-report' },
    ]
  },
  {
    id: 'repledge', label: 'Repledge Section', icon: LayoutGrid,
    children: [
      { label: 'Repledge Entry', icon: FileText, path: '/admin/repledge/entry' },
      { label: 'Repledge Bank Master', icon: Landmark, path: '/admin/repledge/bank-master' },
      { label: 'Repledge Scheme Master', icon: FileText, path: '/admin/repledge/scheme-master' },
      { label: 'Repledge Repayment Master', icon: CreditCard, path: '/admin/repledge/repayment-master' },
      { label: 'Repledge Search', icon: FileSearch, path: '/admin/repledge/search' },
    ]
  },
  // { id: 'access_control', label: 'Access and Control', icon: Shield, path: '/admin/roles' },
];

