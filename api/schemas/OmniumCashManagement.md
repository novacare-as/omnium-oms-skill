# OmniumCashManagement

Represents cash management details for a cash register, tracking expected vs. actual cash amounts.

**Fields:**

- `cashIn`: number (decimal) — Opening cash amount when the register was opened.
- `cashSalesRefunds`: number (decimal) — Net cash from sales and refunds during the register period.
- `cashPetty`: number (decimal) — Petty cash withdrawals (small expenses paid from register).
- `cashBank`: number (decimal) — Cash deposited to bank during the register period.
- `cashExpected`: number (decimal) — Calculated expected cash amount in the register (opening + sales - refunds - petty - bank).
- `cashCounted`: number (decimal) — Actual cash amount counted when closing the register.
- `cashDiff`: number (decimal) — Difference between expected and counted cash (CashCounted - CashExpected). Positive indicates overage, negative indicates shortage.
- `cashBankFinal`: number (decimal) — Final amount deposited to bank after closing.
- `cashOut`: number (decimal) — Cash removed from register when closing (e.g., for deposit or safe).
