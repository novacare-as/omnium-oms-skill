# OmniumZReportPayment

Represents a payment method used for sales transactions.

**Fields:**

- `name`: string, nullable — Name of the payment method (e.g., "Cash", "Credit Card", "Mobile Payment").
- `amount`: number (decimal) — Total amount received through this payment method.
- `count`: integer (int32) — Number of transactions using this payment method.
- `subPayments`: List<[`OmniumSubPayment`](OmniumSubPayment.md)>, nullable — Breakdown of this payment method into sub-categories (optional).
