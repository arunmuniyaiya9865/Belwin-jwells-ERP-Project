const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/ADMIN/Desktop/Bellwin ERP Full Project';

const replacements = [
  // BACKEND REPLACEMENTS
  {
    file: 'backend/models/Loan.js',
    replaces: [
      { search: /return `LOAN\$\{String\(counter\.seq\)\.padStart\(\d+,\s*'0'\)\}`;/g, replace: "return `LN${String(counter.seq).padStart(6, '0')}`;" }
    ]
  },
  {
    file: 'backend/models/Customer.js',
    replaces: [
      { search: /return `CUST\$\{String\(counter\.seq\)\.padStart\(\d+,\s*'0'\)\}`;/g, replace: "return `BOR${String(counter.seq).padStart(4, '0')}`;" }
    ]
  },
  {
    file: 'backend/models/Payment.js',
    replaces: [
      { search: /return `PAY\$\{String\(counter\.seq\)\.padStart\(\d+,\s*'0'\)\}`;/g, replace: "return `EMI${String(counter.seq).padStart(6, '0')}`;" }
    ]
  },
  {
    file: 'backend/models/RepledgeBank.js',
    replaces: [
      { search: /return `RB-\$\{String\(counter\.seq\)\.padStart\(\d+,\s*'0'\)\}`;/g, replace: "return `RPB${String(counter.seq).padStart(4, '0')}`;" }
    ]
  },
  {
    file: 'backend/models/Repledge.js',
    replaces: [
      { search: /return `REP\$\{String\(counter\.seq\)\.padStart\(\d+,\s*'0'\)\}`;/g, replace: "return `RPE${String(counter.seq).padStart(4, '0')}`;" }
    ]
  },
  {
    file: 'backend/models/GoldScheme.js',
    replaces: [
      { search: /return `GLD-\$\{String\(counter\.seq\)\.padStart\(\d+,\s*'0'\)\}`;/g, replace: "return `LS${String(counter.seq).padStart(4, '0')}`;" }
    ]
  },
  {
    file: 'backend/models/LoanSchemeConfig.js',
    replaces: [
      { search: /return `SCH-\$\{String\(counter\.seq\)\.padStart\(\d+,\s*'0'\)\}`;/g, replace: "return `LS${String(counter.seq).padStart(4, '0')}`;" }
    ]
  },

  // FRONTEND REPLACEMENTS
  {
    file: 'frontend/src/pages/admin/master/BranchMaster.jsx',
    replaces: [
      { search: /`BR-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`BR${String(branches.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/master/EmployeeMaster.jsx',
    replaces: [
      { search: /`EMP-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`EMP${String(employees.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/loan-config/DealerMaster.jsx',
    replaces: [
      { search: /`DLR-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`DLR${String(dealers.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/loan-config/VehicleMaster.jsx',
    replaces: [
      { search: /`VH-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`VEH${String(vehicles.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/loan-config/ItemGroupMaster.jsx',
    replaces: [
      { search: /`IG-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`IG${String(groups.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/loan-config/PurityMaster.jsx',
    replaces: [
      { search: /`PUR-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`PUR${String(purities.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/loan-config/ValuerMaster.jsx',
    replaces: [
      { search: /`VAL-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`VAL${String(valuers.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/accounts/LedgerMaster.jsx',
    replaces: [
      { search: /`LED-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`LED${String(ledgers.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/accounts/AccountsGroupMaster.jsx',
    replaces: [
      { search: /`AG-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`AG${String(groups.length + 1).padStart(4, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/accounts/PaymentVoucher.jsx',
    replaces: [
      { search: /`PV-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`PV${String(vouchers.length + 1).padStart(6, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/accounts/ReceiveVoucher.jsx',
    replaces: [
      { search: /`RV-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`RV${String(vouchers.length + 1).padStart(6, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/accounts/JournalVoucher.jsx',
    replaces: [
      { search: /`JV-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`JV${String(vouchers.length + 1).padStart(6, '0')}`" }
    ]
  },
  {
    file: 'frontend/src/pages/admin/accounts/ContraVoucher.jsx',
    replaces: [
      { search: /`CV-\$\{String\(.*?\.length \+ 1\)\.padStart\(3, '0'\)\}`/g, replace: "`CV${String(vouchers.length + 1).padStart(6, '0')}`" }
    ]
  }
];

let changedCount = 0;

for (const { file, replaces } of replacements) {
  const fullPath = path.join(rootDir, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  for (const { search, replace } of replaces) {
    content = content.replace(search, replace);
  }

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${file}`);
    changedCount++;
  } else {
    console.log(`No changes made to: ${file}`);
  }
}

console.log(`Total files updated: ${changedCount}`);
