# OmniumProjectTransaction

Project revenue or cost transaction

**Fields:**

- `id`: string, nullable — Unique transaction identifier
- `description`: string, nullable — Transaction description
- `revenue`: number (decimal) — Transaction revenue (actual)
- `cost`: number (decimal) — Transaction cost (actual)
- `value`: number (decimal) — Transaction value (Calcualted)
- `budgetRevenue`: number (decimal) — Budget revenue
- `budgetCost`: number (decimal) — Budget cost
- `budgetValue`: number (decimal) — Budget value (Calculated)
- `budgetDeviation`: number (decimal) — Budget deviation (Calculated)
- `budgetDeviationPercent`: number (decimal) — Budget deviation in percent (Calculated)

**Used directly by endpoints in:**

- [Projects | Transactions](../endpoints/projects/transactions.md)
