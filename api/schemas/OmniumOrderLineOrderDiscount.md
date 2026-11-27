# OmniumOrderLineOrderDiscount

An order line's share of one specific order level discount. Calculated and read-only: Omnium splits the line's
OrderDiscountAmount over the order level discounts on every calculation, so anything sent in is ignored.
The shares on a line sum to the line's OrderDiscountAmount; summing one discount's shares across all lines may
differ from that discount's DiscountAmount by cents, because rounding is reconciled per line.

**Fields:**

- `discountId`: string, nullable — DiscountId of the order level discount this share belongs to.
- `discountCode`: string, nullable — DiscountCode of the order level discount this share belongs to.
- `discountName`: string, nullable — DiscountName of the order level discount this share belongs to.
- `discountAmount`: number (decimal) — This line's share of the discount, incl. tax.
- `discountAmountExclTax`: number (decimal) — This line's share of the discount, excl. tax.
