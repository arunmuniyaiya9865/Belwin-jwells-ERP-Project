const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const AccountsGroup = require('./models/accounts/AccountsGroup');
const Ledger = require('./models/accounts/Ledger');
const LedgerTransaction = require('./models/accounts/LedgerTransaction');
const PaymentVoucher = require('./models/accounts/PaymentVoucher');
const ReceiveVoucher = require('./models/accounts/ReceiveVoucher');
const JournalVoucher = require('./models/accounts/JournalVoucher');
const ContraVoucher = require('./models/accounts/ContraVoucher');
const ledgerService = require('./services/ledgerService');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

async function runTests() {
    console.log("Starting Accounts Module E2E Test Suite...");
    let passed = 0;
    let failed = 0;
    let warnings = [];
    let bugs = [];
    
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        // --------------------------------------------------
        // STEP 1: Verify Accounts Group
        // --------------------------------------------------
        console.log("Verifying Accounts Group...");
        const testGroup = new AccountsGroup({
            groupCode: 'TG0001',
            groupName: 'Test Income Group',
            underGroup: 'Primary',
            nature: 'Income',
            description: 'For testing',
            status: 'Active',
            createdBy: new mongoose.Types.ObjectId()
        });
        await testGroup.save();
        passed++;

        const duplicateGroup = new AccountsGroup({ groupCode: 'TG0001', groupName: 'Test Income Group 2', nature: 'Income', createdBy: new mongoose.Types.ObjectId() });
        try {
            await duplicateGroup.save();
            bugs.push("AccountsGroup: Missing unique validation on groupCode/groupName");
            failed++;
        } catch(e) { passed++; }

        testGroup.groupName = 'Updated Test Income Group';
        await testGroup.save();
        passed++;

        // --------------------------------------------------
        // STEP 2: Verify Ledger Master
        // --------------------------------------------------
        console.log("Verifying Ledger Master...");
        const cashGroup = await AccountsGroup.findOne({ groupName: 'Cash-in-hand' }) || testGroup;
        const testLedger = new Ledger({
            ledgerCode: 'LED9999',
            ledgerName: 'Test Automation Ledger',
            accountGroup: testGroup.groupName,
            openingBalance: 1000,
            balanceType: 'Credit',
            status: 'Active',
            createdBy: new mongoose.Types.ObjectId()
        });
        await testLedger.save();
        passed++;

        if (testLedger.currentBalance !== 1000) {
            bugs.push(`Ledger Master: currentBalance not matching openingBalance on creation. Expected 1000, got ${testLedger.currentBalance}`);
            failed++;
        } else {
            passed++;
        }

        // --------------------------------------------------
        // STEP 3 & 4: Verify Operational Automation & LedgerTransaction
        // --------------------------------------------------
        console.log("Verifying Operational Automation & LedgerTransaction...");
        
        const mockUserId = new mongoose.Types.ObjectId();
        
        // Ensure Cash Ledger exists
        let cashLedger = await Ledger.findOne({ ledgerName: 'Cash' });
        if (!cashLedger) {
            cashLedger = new Ledger({ ledgerCode: 'CASH', ledgerName: 'Cash', accountGroup: cashGroup.groupName, openingBalance: 50000, balanceType: 'Debit', createdBy: mockUserId });
            await cashLedger.save();
        }

        // Test Expense Automation
        const expenseAmount = 500;
        await ledgerService.recordTransaction({
            ledgerId: testLedger._id,
            voucherNumber: 'EXP-TEST-01',
            voucherType: 'Payment',
            referenceModule: 'Expense',
            referenceId: new mongoose.Types.ObjectId(),
            debit: expenseAmount,
            credit: 0,
            createdBy: mockUserId,
            transactionDate: new Date(),
            narration: 'Test Expense'
        });

        await ledgerService.recordTransaction({
            ledgerId: cashLedger._id,
            voucherNumber: 'EXP-TEST-01',
            voucherType: 'Payment',
            referenceModule: 'Expense',
            referenceId: new mongoose.Types.ObjectId(),
            debit: 0,
            credit: expenseAmount,
            createdBy: mockUserId,
            transactionDate: new Date(),
            narration: 'Test Expense'
        });

        // Verify LedgerTransactions
        const expenseTx = await LedgerTransaction.findOne({ voucherNumber: 'EXP-TEST-01', ledgerId: testLedger._id });
        if (!expenseTx || expenseTx.debit !== expenseAmount) {
            bugs.push("Automation: Expense transaction not recorded correctly on Expense Ledger.");
            failed++;
        } else { passed++; }

        const cashTx = await LedgerTransaction.findOne({ voucherNumber: 'EXP-TEST-01', ledgerId: cashLedger._id });
        if (!cashTx || cashTx.credit !== expenseAmount) {
            bugs.push("Automation: Expense transaction not recorded correctly on Cash Ledger.");
            failed++;
        } else { passed++; }

        // --------------------------------------------------
        // STEP 7: Database Verification
        // --------------------------------------------------
        console.log("Verifying Database Integrity...");
        
        const updatedCashLedger = await Ledger.findById(cashLedger._id);
        const lastCashTx = await LedgerTransaction.findOne({ ledgerId: cashLedger._id }).sort({ createdAt: -1 });
        
        if (updatedCashLedger.currentBalance !== lastCashTx.balanceAfter) {
            bugs.push(`Database Integrity: Ledger currentBalance (${updatedCashLedger.currentBalance}) does not match last transaction balanceAfter (${lastCashTx.balanceAfter})`);
            failed++;
        } else { passed++; }

        // --------------------------------------------------
        // STEP 5: Verify Reports
        // --------------------------------------------------
        console.log("Verifying Reports (Trial Balance & Balance Sheet)...");
        // We will call the controller functions directly by mocking req, res
        const { getTrialBalanceReport, getBalanceSheetReport } = require('./controllers/accounts/ledgerReportController');

        const req = { query: {} };
        const resTB = { json: (data) => { return data; } };
        const resBS = { json: (data) => { return data; } };
        const next = (err) => { throw err; };

        let tbData, bsData;
        
        // Mock express res for direct capture
        resTB.json = (data) => { tbData = data; };
        resBS.json = (data) => { bsData = data; };

        await getTrialBalanceReport(req, resTB, next);
        await getBalanceSheetReport(req, resBS, next);

        if (tbData && tbData.success) {
            if (tbData.summary.difference !== 0 || tbData.summary.status !== 'Books Balanced') {
                bugs.push(`Reports: Trial Balance is out of balance. Difference: ${tbData.summary.difference}`);
                failed++;
            } else { passed++; }
        } else { bugs.push("Reports: Failed to generate Trial Balance."); failed++; }

        if (bsData && bsData.success) {
            if (bsData.summary.difference !== 0 || bsData.summary.status !== 'Books Balanced') {
                bugs.push(`Reports: Balance Sheet is out of balance. Difference: ${bsData.summary.difference}`);
                failed++;
            } else { passed++; }
        } else { bugs.push("Reports: Failed to generate Balance Sheet."); failed++; }


        // Clean up test data
        await LedgerTransaction.deleteMany({ voucherNumber: 'EXP-TEST-01' });
        await Ledger.findByIdAndDelete(testLedger._id);
        await AccountsGroup.findByIdAndDelete(testGroup._id);
        
        console.log(JSON.stringify({
            passed, failed, warnings, bugs
        }));

    } catch (error) {
        console.error("Test Suite crashed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

runTests();
