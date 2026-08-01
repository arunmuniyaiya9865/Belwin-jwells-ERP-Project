import React from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import { TR, TD } from '../../../components/ui/Table';
import { Settings } from 'lucide-react';

const CodeSequence = () => {
  const masterModules = [
    { module: 'Branch Master', format: 'BR + 4 digits', example: 'BR0001' },
    { module: 'Employee Master', format: 'EMP + 4 digits', example: 'EMP0001' },
    { module: 'Member Master', format: 'MEM + 4 digits', example: 'MEM0001' },
    { module: 'Borrower/Customer', format: 'BOR + 4 digits', example: 'BOR0001' },
    { module: 'Loan Scheme', format: 'LS + 4 digits', example: 'LS0001' },
    { module: 'Dealer Master', format: 'DLR + 4 digits', example: 'DLR0001' },
    { module: 'Vehicle Master', format: 'VEH + 4 digits', example: 'VEH0001' },
    { module: 'Item Group', format: 'IG + 4 digits', example: 'IG0001' },
    { module: 'Purity Master', format: 'PUR + 4 digits', example: 'PUR0001' },
    { module: 'Gold Rate', format: 'GR + 4 digits', example: 'GR0001' },
    { module: 'Locker Master', format: 'LKR + 4 digits', example: 'LKR0001' },
    { module: 'Valuer Master', format: 'VAL + 4 digits', example: 'VAL0001' },
    { module: 'Ledger Master', format: 'LED + 4 digits', example: 'LED0001' },
    { module: 'Accounts Group', format: 'AG + 4 digits', example: 'AG0001' },
    { module: 'Bank Master', format: 'BNK + 4 digits', example: 'BNK0001' },
    { module: 'Repledge Scheme', format: 'RPS + 4 digits', example: 'RPS0001' },
    { module: 'Repledge Bank', format: 'RPB + 4 digits', example: 'RPB0001' },
    { module: 'Repledge Entry', format: 'RPE + 4 digits', example: 'RPE0001' },
  ];

  const operationalModules = [
    { module: 'Loan Application', format: 'APP + 6 digits', example: 'APP000001' },
    { module: 'Loan Account', format: 'LN + 6 digits', example: 'LN000001' },
    { module: 'Loan Disbursement', format: 'DIS + 6 digits', example: 'DIS000001' },
    { module: 'EMI Receipt', format: 'EMI + 6 digits', example: 'EMI000001' },
    { module: 'Payment Voucher', format: 'PV + 6 digits', example: 'PV000001' },
    { module: 'Receive Voucher', format: 'RV + 6 digits', example: 'RV000001' },
    { module: 'Journal Voucher', format: 'JV + 6 digits', example: 'JV000001' },
    { module: 'Contra Voucher', format: 'CV + 6 digits', example: 'CV000001' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <PageHeader 
        title="Code Sequence Settings" 
        subtitle="View and manage the auto-incrementing ID formats for all modules."
        icon={Settings}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-800">Master Modules (4 Digits)</h3>
          </div>
          <DataTable
            headers={['Module', 'Format', 'Example']}
            data={masterModules}
            renderRow={(item, idx) => (
              <TR key={idx}>
                <TD className="font-semibold text-gray-700">{item.module}</TD>
                <TD>
                  <span className="px-2 py-1 bg-primary/10 text-primary font-medium text-xs rounded-md">
                    {item.format}
                  </span>
                </TD>
                <TD className="font-mono text-sm text-gray-600">{item.example}</TD>
              </TR>
            )}
          />
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-800">Operational Modules (6 Digits)</h3>
          </div>
          <DataTable
            headers={['Module', 'Format', 'Example']}
            data={operationalModules}
            renderRow={(item, idx) => (
              <TR key={idx}>
                <TD className="font-semibold text-gray-700">{item.module}</TD>
                <TD>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 font-medium text-xs rounded-md">
                    {item.format}
                  </span>
                </TD>
                <TD className="font-mono text-sm text-gray-600">{item.example}</TD>
              </TR>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default CodeSequence;
