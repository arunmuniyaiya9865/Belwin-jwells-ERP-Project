import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout components
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ComingSoon from './components/ComingSoon';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeList from './pages/admin/employees/EmployeeList';
import EmployeeForm from './pages/admin/employees/EmployeeForm';
import EmployeeView from './pages/admin/employees/EmployeeView';
import ResetPassword from './pages/admin/employees/ResetPassword';
import Attendance from './pages/admin/employees/Attendance';
import SalaryManagement from './pages/admin/employees/SalaryManagement';
import PromotionDemotion from './pages/admin/employees/PromotionDemotion';
import LiveTracking from './pages/admin/employees/LiveTracking';
import RolesPermissions from './pages/admin/RolesPermissions';
import AdminCustomerApprovalPending from './pages/admin/CustomerApprovalPending';
import LoanCalculator from './pages/admin/loan-config/LoanCalculator';
import LoanScheme from './pages/admin/loan-config/LoanScheme';
import VehicleMaster from './pages/admin/loan-config/VehicleMaster';
import DealerMaster from './pages/admin/loan-config/DealerMaster';
import ItemGroupMaster from './pages/admin/loan-config/ItemGroupMaster';
import PurityMaster from './pages/admin/loan-config/PurityMaster';
import GoldRateMaster from './pages/admin/loan-config/GoldRateMaster';
import LockerMaster from './pages/admin/loan-config/LockerMaster';
import ValuerMaster from './pages/admin/loan-config/ValuerMaster';

import ChittySchemeList from './pages/admin/chitty-scheme/ChittySchemeList';
import ChittySchemeForm from './pages/admin/chitty-scheme/ChittySchemeForm';
// Master Module
import MasterConfig from './pages/admin/master/MasterConfig';
import BranchMaster from './pages/admin/master/BranchMaster';
import EmployeeMaster from './pages/admin/master/EmployeeMaster';
import RoleMaster from './pages/admin/master/RoleMaster';
import RankingMaster from './pages/admin/master/RankingMaster';
import CodeSequence from './pages/admin/master/CodeSequence';
import NewBorrower from './pages/admin/borrower/NewBorrower';
import BorrowerList from './pages/admin/borrower/BorrowerList';
import CustomerEdit from './pages/admin/borrower/CustomerEdit';
import KYCUpload from './pages/admin/borrower/KYCUpload';
import KYCApproval from './pages/admin/borrower/KYCApproval';
import CIBILCheck from './pages/admin/borrower/CIBILCheck';
import BorrowerSynopsis from './pages/admin/borrower/BorrowerSynopsis';
import RepledgeEntry from './pages/admin/repledge/RepledgeEntry';
import RepledgeBankMaster from './pages/admin/repledge/RepledgeBankMaster';
import RepledgeSchemeMaster from './pages/admin/repledge/RepledgeSchemeMaster';
import RepledgeRepaymentMaster from './pages/admin/repledge/RepledgeRepaymentMaster';
import RepledgeSearch from './pages/admin/repledge/RepledgeSearch';
import BorrowerDetailsReport from './pages/admin/borrower/BorrowerDetailsReport';
import BorrowerBlock from './pages/admin/borrower/BorrowerBlock';
import CustomerLedger from './pages/admin/borrower/CustomerLedger';

// Accounts Module
import LedgerMaster from './pages/admin/accounts/LedgerMaster';
import AccountsGroupMaster from './pages/admin/accounts/AccountsGroupMaster';
import LedgerDetails from './pages/admin/accounts/LedgerDetails';
import PaymentVoucher from './pages/admin/accounts/PaymentVoucher';
import ReceiveVoucher from './pages/admin/accounts/ReceiveVoucher';
import JournalVoucher from './pages/admin/accounts/JournalVoucher';
import ContraVoucher from './pages/admin/accounts/ContraVoucher';
import BankDeposit from './pages/admin/accounts/BankDeposit';
import BankWithdrawal from './pages/admin/accounts/BankWithdrawal';
import JournalReport from './pages/admin/accounts/JournalReport';
import LedgerReport from './pages/admin/accounts/LedgerReport';
import ProfitLoss from './pages/admin/accounts/ProfitLoss';
import TrialBalance from './pages/admin/accounts/TrialBalance';
import BalanceSheet from './pages/admin/accounts/BalanceSheet';
// Reports Module
import LoanAccountLedger from './pages/admin/reports/LoanAccountLedger';
import LoanAccountLedgerNonEMI from './pages/admin/reports/LoanAccountLedgerNonEMI';
import LedgerStatementReport from './pages/admin/reports/LedgerReport';
import CashBookReport from './pages/admin/reports/CashBookReport';
import LoanRequisitionReport from './pages/admin/reports/LoanRequisitionReport';
import LoanApproveReport from './pages/admin/reports/LoanApproveReport';
import LoanDisbursementReport from './pages/admin/reports/LoanDisbursementReport';
import LoanDueReport from './pages/admin/reports/LoanDueReport';
import LoanOverDueReport from './pages/admin/reports/LoanOverDueReport';
import LoanOutstandingReport from './pages/admin/reports/LoanOutstandingReport';
import LoanEmiCollectionReport from './pages/admin/reports/LoanEmiCollectionReport';
// Employee Pages
import LoginForm from './components/LoginForm';

// Provide Loan Module
import ProvideLoan from './pages/Provide Loan/ProvideLoan';
import EditLoan from './pages/Provide Loan/EditLoan';
import TopUpLoan from './pages/Provide Loan/TopUpLoan';
import LoanClosure from './pages/Provide Loan/LoanClosure';
import TopUpApproval from './pages/admin/TopUpApproval';

function App() {
  return (
    <Router>
      <Routes>
        {/* Base redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        
        {/* Unified Login (no layout) */}
        <Route path="/login" element={<LoginForm title="Access Your Account" />} />

        {/* Admin Layout Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<EmployeeList />} />
          <Route path="/admin/employees/create" element={<EmployeeForm />} />
          <Route path="/admin/employees/edit/:id" element={<EmployeeForm />} />
          <Route path="/admin/employees/view/:id" element={<EmployeeView />} />
          <Route path="/admin/employees/reset-password/:id" element={<ResetPassword />} />
          <Route path="/admin/attendance" element={<Attendance />} />
          <Route path="/admin/salary" element={<SalaryManagement />} />
          <Route path="/admin/roles" element={<RolesPermissions />} />

          {/* Master Module */}
          <Route path="/admin/master/config" element={<MasterConfig />} />
          <Route path="/admin/master/branch" element={<BranchMaster />} />
          <Route path="/admin/master/employee" element={<EmployeeMaster />} />
          <Route path="/admin/master/user-role" element={<RoleMaster />} />
          <Route path="/admin/master/ranking" element={<RankingMaster />} />
          <Route path="/admin/master/code-sequence" element={<CodeSequence />} />
          <Route path="/admin/master/*" element={<ComingSoon />} />
          
          {/* Provide Loan Routes */}
          <Route path="/admin/provide-loan" element={<ProvideLoan />} />
          <Route path="/admin/provide-loan/edit" element={<EditLoan />} />
          <Route path="/admin/provide-loan/top-up" element={<TopUpLoan />} />
          <Route path="/admin/provide-loan/top-up/approval" element={<TopUpApproval />} />
          <Route path="/admin/provide-loan/closure" element={<LoanClosure />} />

          {/* Borrower Management Routes */}
          <Route path="/admin/borrower/new" element={<NewBorrower />} />
          
          <Route path="/admin/loan-config/calculator" element={<LoanCalculator />} />
          <Route path="/admin/loan-config/scheme" element={<LoanScheme />} />
          <Route path="/admin/loan-config/vehicle" element={<VehicleMaster />} />
          <Route path="/admin/loan-config/dealer" element={<DealerMaster />} />
          <Route path="/admin/loan-config/item-group" element={<ItemGroupMaster />} />
          <Route path="/admin/loan-config/purity" element={<PurityMaster />} />
          <Route path="/admin/loan-config/gold-rate" element={<GoldRateMaster />} />
          <Route path="/admin/loan-config/locker" element={<LockerMaster />} />
          <Route path="/admin/loan-config/valuer" element={<ValuerMaster />} />

          <Route path="/admin/borrower/new" element={<NewBorrower />} />
          <Route path="/admin/borrower/list" element={<BorrowerList />} />
          <Route path="/admin/borrower/edit" element={<CustomerEdit />} />
          <Route path="/admin/borrower/kyc-upload" element={<KYCUpload />} />
          <Route path="/admin/borrower/kyc-approval" element={<KYCApproval />} />
          <Route path="/admin/borrower/cibil-check" element={<CIBILCheck />} />
          <Route path="/admin/borrower/synopsis" element={<BorrowerSynopsis />} />
          
          {/* Repledge */}
          <Route path="/admin/repledge/entry" element={<RepledgeEntry />} />
          <Route path="/admin/repledge/bank-master" element={<RepledgeBankMaster />} />
          <Route path="/admin/repledge/scheme-master" element={<RepledgeSchemeMaster />} />
          <Route path="/admin/repledge/repayment-master" element={<RepledgeRepaymentMaster />} />
          <Route path="/admin/repledge/search" element={<RepledgeSearch />} />
          <Route path="/admin/borrower/details-report" element={<BorrowerDetailsReport />} />
          <Route path="/admin/borrower/block" element={<BorrowerBlock />} />
          <Route path="/admin/borrower/ledger" element={<CustomerLedger />} />
          <Route path="/admin/borrower/customer-approval" element={<AdminCustomerApprovalPending />} />
          
          {/* Accounts Module */}
          <Route path="/admin/accounts/ledger-master" element={<LedgerMaster />} />
          <Route path="/admin/accounts/ledger-master/:id" element={<LedgerDetails />} />
          <Route path="/admin/accounts/group-master" element={<AccountsGroupMaster />} />
          <Route path="/admin/accounts/payment-voucher" element={<PaymentVoucher />} />
          <Route path="/admin/accounts/receive-voucher" element={<ReceiveVoucher />} />
          <Route path="/admin/accounts/journal-voucher" element={<JournalVoucher />} />
          <Route path="/admin/accounts/contra-voucher" element={<ContraVoucher />} />
          <Route path="/admin/accounts/bank-deposit" element={<BankDeposit />} />
          <Route path="/admin/accounts/bank-withdrawl" element={<BankWithdrawal />} />
          <Route path="/admin/accounts/journal-report" element={<JournalReport />} />
          <Route path="/admin/accounts/ledger-report" element={<LedgerReport />} />
          <Route path="/admin/accounts/profit-loss" element={<ProfitLoss />} />
          <Route path="/admin/accounts/trial-balance" element={<TrialBalance />} />
          <Route path="/admin/accounts/balance-sheet" element={<BalanceSheet />} />
          
          {/* Reports Module */}
          <Route path="/admin/reports/loan-account-ledger" element={<LoanAccountLedger />} />
          <Route path="/admin/reports/loan-account-ledger-non-emi" element={<LoanAccountLedgerNonEMI />} />
          <Route path="/admin/reports/ledger-statement" element={<LedgerStatementReport />} />
          <Route path="/admin/reports/cash-book-statement" element={<CashBookReport />} />
          <Route path="/admin/reports/loan-requisition-report" element={<LoanRequisitionReport />} />
          <Route path="/admin/reports/loan-approve-report" element={<LoanApproveReport />} />
          <Route path="/admin/reports/loan-disbursement-report" element={<LoanDisbursementReport />} />
          <Route path="/admin/reports/loan-due-report" element={<LoanDueReport />} />
          <Route path="/admin/reports/loan-over-due-report" element={<LoanOverDueReport />} />
          <Route path="/admin/reports/loan-outstanding-report" element={<LoanOutstandingReport />} />
          <Route path="/admin/reports/loan-emi-collection-report" element={<LoanEmiCollectionReport />} />
          <Route path="/admin/approval/pending" element={<AdminCustomerApprovalPending />} />
          <Route path="/admin/repledge/*" element={<ComingSoon />} />
          
          <Route path="/admin/employees/downline" element={<ComingSoon />} />
          <Route path="/admin/employees/block" element={<ComingSoon />} />
          <Route path="/admin/employees/icard" element={<ComingSoon />} />
          <Route path="/admin/employees/promotion" element={<PromotionDemotion />} />
          <Route path="/admin/employees/live-tracking" element={<LiveTracking />} />

          {/* Profile & Settings (Placeholders for dropdown links) */}
          <Route path="/admin/profile" element={<ComingSoon />} />
          <Route path="/change-password" element={<ComingSoon />} />

          {/* Chitty Routes */}
          <Route path="/admin/chitty/scheme" element={<ChittySchemeList />} />
          <Route path="/admin/chitty/scheme/create" element={<ChittySchemeForm />} />
          <Route path="/admin/chitty/scheme/edit/:id" element={<ChittySchemeForm />} />
        </Route>

      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;

