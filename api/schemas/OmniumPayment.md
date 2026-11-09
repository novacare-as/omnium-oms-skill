# OmniumPayment

Represents a payment transaction on an order or cart.
Each payment record represents a single transaction with a payment provider.
An order can have multiple payments (e.g., partial payment with gift card + credit card).

Payment flow:
1. Customer completes checkout in your storefront
2. Frontend initiates payment with the provider (Klarna, Vipps, etc.)
3. Provider returns transaction details (TransactionId, Amount, Status)
4. Frontend calls Omnium API to register the payment on the cart
5. Cart is placed as an order
6. Omnium can later capture, refund, or void the payment through the provider

Multiple payments: When an order has multiple payments (e.g., gift card + Klarna),
they are processed in the order they appear in the payments list.

**Fields:**

- `amount`: number (decimal) — The monetary amount for this payment transaction. For Authorization: The reserved/authorized amount For Capture: The captured amount (can be less than or equal to authorization) For Credit/Refund: The refunded amount
- `authorizationCode`: string, nullable — Authorization code returned by the payment provider. Used for reference and reconciliation with the payment provider.
- `customerName`: string, nullable — Name of the customer associated with this payment.
- `implementationClass`: string, nullable — Not in use - reserved for internal purposes.
- `id`: string, nullable — Unique identifier for this specific payment record in Omnium. Different from TransactionId which is the provider's reference. When updating payments, matching is done on this Id.
- `paymentId`: integer (int32), **deprecated** — Deprecated. Use TransactionId instead.
- `paymentMethodId`: string (uuid), **deprecated** — Deprecated. Use PaymentMethodName instead.
- `paymentMethodName`: string, nullable — Identifies the payment provider. Must match a configured provider name in Omnium. Examples: "Klarna", "Vipps", "Stripe", "Adyen", "GiftCard", "Dintero" This determines which integration Omnium uses for capture/refund operations.
- `paymentType`: string, nullable — Sub-type or method within the payment provider. Examples: "Invoice", "Card", "Swish", "DirectDebit" Used to identify the specific payment method when a provider offers multiple options.
- `status`: string, nullable — Current status of this payment transaction. Values: - "Processed": Transaction completed successfully - "Failed": Transaction failed - "Pending": Awaiting processing or confirmation - "Paid": Payment has been paid - "Approved": Payment has been approved
- `transactionId`: string, nullable — Unique transaction identifier from the payment provider. This is the provider's reference for the transaction and is required for subsequent operations (capture, refund). Example: Klarna order ID, Vipps order ID, Stripe payment intent ID
- `transactionType`: string, nullable — The type of payment transaction. Common values for API consumers: - "Authorization": Payment is reserved but not yet captured. Standard for e-commerce orders - "Capture": Payment has been captured/charged from the customer - "Sale": Payment is immediately captured (no separate authorization). Use for POS/in-store orders - "Credit": Refund/credit back to the customer - "Invoiced": Invoice-based payment (e.g., Klarna invoice) - "Void": Authorization has been cancelled/voided Internal/system values (typically set by Omnium, not API consumers): - "AwaitingAuthorization": Used internally for paylinks and in-store payments awaiting customer action - "ReleaseRemainingAuthorization": Release unused authorization amount after partial capture - "Settlement", "SettlementFee", "SettlementRefund": Provider settlement transactions - "Bookkeeping", "CreditBookkeeping": Internal accounting transactions - "Other": Other transaction types For POS/in-store sales, use "Sale" since payment is captured immediately at point of sale. For e-commerce orders, use "Authorization" - Omnium workflows handle Capture, Credit, and Void automatically.
- `validationCode`: string, nullable, **deprecated** — Deprecated. Not in use.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties for provider-specific data or additional metadata. Can store any key-value pairs needed for the payment integration.
- `paidDate`: string (date-time), nullable — The original date when the payment was made. May differ from Created if the payment was pre-paid or processed externally before registration.
- `created`: string (date-time), nullable — Timestamp when this payment record was created/registered in Omnium.
- `isManuallyAdded`: boolean — Indicates if this payment was manually added through the Omnium UI rather than from a payment provider integration. Manual payments are typically used for cash, bank transfer, or other offline payment methods.
- `isVirtual`: boolean, nullable — Indicates that this entry moves value between orders rather than money that went through a payment provider or a cash register. Set on both sides of a transfer: "Credit" on the order the value left (see Omnium.Public.Payments.Models.OmniumPayment.TransferredToOrderId) and "Sale"/"Authorization"/"Capture" on the order it arrived at (see Omnium.Public.Payments.Models.OmniumPayment.TransferredFromOrderId). This happens on in-store returns and exchanges: the returned goods pay for the new goods instead of being refunded and re-charged, and Omnium records the return as its own order, so the original payment must appear on both for the totals to add up. A refund the provider really executed is never virtual, even on a return order. Virtual entries still count towards the order's payment totals, but nothing exists at the provider or terminal — skip them when reconciling against a settlement.
- `transferredFromOrderId`: string, nullable — Order the value came from. Set on the receiving side of a transfer, with Omnium.Public.Payments.Models.OmniumPayment.IsVirtual.
- `transferredToOrderId`: string, nullable — Order the value went to. Set on the originating side of a transfer, with Omnium.Public.Payments.Models.OmniumPayment.IsVirtual.
- `comment`: string, nullable — Free-text comment or note about the payment. Useful for manual payments or special circumstances.
- `internalReference`: string, nullable — Internal reference for linking this payment to other business documents. Can be used for RMA numbers, related order numbers, or other cross-references.
- `reason`: string, nullable — Description or reason for the payment, especially useful for refunds/credits. Example: "Return of damaged item", "Partial refund for shipping delay"
- `authorizationExpires`: string (date-time), nullable — Expiration date/time for the authorization from the payment provider. After this date, the authorization may no longer be valid for capture. Important for managing capture timing and avoiding authorization expiry.
- `storeId`: string, nullable — The store or warehouse ID associated with this payment. Used for multi-store scenarios where payments need to be attributed to specific locations.
- `shipmentId`: string, nullable — The shipment ID this payment is associated with. Used when payments are split across multiple shipments or for shipment-specific captures.
- `fiscalSaleId`: string, nullable — The POS fiscal sale this payment belongs to: the payment event at the till that paid for a selection of the order's shipments and produced one receipt. Shared by every payment in a split tender.
- `invoiceId`: string, nullable — Reference to an invoice if this payment is linked to an invoice document. Used for invoice-based payment methods or accounting integrations.
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external system identifiers for this payment. Useful for linking the payment to records in ERP, accounting, or other external systems.
- `orderLineReferences`: List<[`OmniumPaymentOrderLineReference`](OmniumPaymentOrderLineReference.md)>, nullable — References to order line items associated with this payment. Used to correlate credit/refund payments with specific line items, e.g., on return orders.
- `reservationId`: string, nullable — Reference from some payment providers where transaction id diff from a reservation/auth

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
- [Orders | Payments](../endpoints/orders/payments.md)
