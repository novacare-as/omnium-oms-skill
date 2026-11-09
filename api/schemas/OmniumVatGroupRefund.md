# OmniumVatGroupRefund

Represents refunds/returns grouped by VAT rate.

**Fields:**

- `name`: string, nullable — Name or description of this VAT group.
- `amount`: number (decimal) — Total refund amount for this VAT group.
- `count`: integer (int32) — Number of refund transactions in this VAT group.
- `vatValue`: number (decimal) — VAT rate percentage (e.g., 25.00 for 25%).
