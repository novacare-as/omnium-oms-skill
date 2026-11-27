# OmniumPaymentRefund

Represents a payment method used for refund transactions.

**Fields:**

- `name`: string, nullable — Name of the payment method used for refund.
- `amount`: number (decimal) — Total amount refunded through this payment method.
- `count`: integer (int32) — Number of refund transactions using this payment method.
- `subPayments`: List<[`OmniumSubPayment`](OmniumSubPayment.md)>, nullable — Breakdown of refund payment method into sub-categories (optional).
