# OmniumSubPayment

Represents a sub-category of a payment method with detailed breakdown.

**Fields:**

- `name`: string, nullable — Name of the sub-payment type.
- `moneySubTotal`: number (decimal) — Subtotal for this payment sub-type.
- `moneyCaptured`: number (decimal) — Amount that has been captured/settled.
- `moneyInAdvance`: number (decimal) — Amount paid in advance (deposits, prepayments).
- `moneyReserved`: number (decimal) — Amount reserved but not yet captured (authorizations).
