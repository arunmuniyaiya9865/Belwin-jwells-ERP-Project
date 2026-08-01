# Project Rules & Customizations

## ID Generation Rules

Whenever creating a new model, table, or UI form that generates an auto-incrementing ID, you MUST strictly follow the exact ID format configurations mapped below. 

No hyphens are allowed in these IDs. The numeric portion must be zero-padded to the exact length specified.

### Master Modules (Prefix + 4 Digits padding e.g., 'XXXX')
| Master | Format | Example |
| --- | --- | --- |
| Branch Master | `BR` + 4 digits | `BR0001` |
| Employee Master | `EMP` + 4 digits | `EMP0001` |
| Member Master | `MEM` + 4 digits | `MEM0001` |
| Borrower/Customer | `BOR` + 4 digits | `BOR0001` |
| Loan Scheme | `LS` + 4 digits | `LS0001` |
| Dealer Master | `DLR` + 4 digits | `DLR0001` |
| Vehicle Master | `VEH` + 4 digits | `VEH0001` |
| Item Group | `IG` + 4 digits | `IG0001` |
| Purity Master | `PUR` + 4 digits | `PUR0001` |
| Gold Rate | `GR` + 4 digits | `GR0001` |
| Locker Master | `LKR` + 4 digits | `LKR0001` |
| Valuer Master | `VAL` + 4 digits | `VAL0001` |
| Ledger Master | `LED` + 4 digits | `LED0001` |
| Accounts Group | `AG` + 4 digits | `AG0001` |
| Bank Master | `BNK` + 4 digits | `BNK0001` |
| Repledge Scheme | `RPS` + 4 digits | `RPS0001` |
| Repledge Bank | `RPB` + 4 digits | `RPB0001` |
| Repledge Entry | `RPE` + 4 digits | `RPE0001` |

### Operational Modules (Prefix + 6 Digits padding e.g., 'XXXXXX')
| Module | Format | Example |
| --- | --- | --- |
| Loan Application | `APP` + 6 digits | `APP000001` |
| Loan Account | `LN` + 6 digits | `LN000001` |
| Loan Disbursement | `DIS` + 6 digits | `DIS000001` |
| EMI Receipt | `EMI` + 6 digits | `EMI000001` |
| Payment Voucher | `PV` + 6 digits | `PV000001` |
| Receive Voucher | `RV` + 6 digits | `RV000001` |
| Journal Voucher | `JV` + 6 digits | `JV000001` |
| Contra Voucher | `CV` + 6 digits | `CV000001` |
