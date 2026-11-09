# OmniumVatGroup

Represents sales grouped by VAT rate or tax code.

**Fields:**

- `name`: string, nullable — Name or description of this VAT group.
- `amount`: number (decimal) — Total amount for transactions in this VAT group.
- `count`: integer (int32) — Number of transactions in this VAT group.
- `vatValue`: number (decimal), nullable — VAT rate percentage (e.g., 25.00 for 25%).
