# OmniumDiscountRefund

Represents a discount applied to return/refund transactions.

**Fields:**

- `voucherCode`: string, nullable — Voucher or discount code used for this refund.
- `amount`: number (decimal) — Total discount amount (including VAT).
- `amountNet`: number (decimal) — Net discount amount (excluding VAT).
- `amountVat`: number (decimal) — VAT amount on the discount.
