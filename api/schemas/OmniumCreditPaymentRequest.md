# OmniumCreditPaymentRequest

Request for crediting (refunding) a payment on an order through the payment provider.

**Fields:**

- `paymentMethodName`: string, nullable — Identifies the payment provider. Must match a configured provider name in Omnium. Examples: "Klarna", "Vipps", "Stripe", "Adyen", "GiftCard", "Dintero" (Required)
- `transactionId`: string, nullable — Transaction identifier from the payment provider for the payment to credit. (Required)
- `invoiceNumber`: string, nullable — Invoice number, used by invoice-based payment providers to identify the invoice to credit.
- `amount`: number (decimal) — The amount to credit, in the order's billing currency.
- `comment`: string, nullable — Free-text comment stored on the credit payment.
- `reason`: string, nullable — Reason for the credit, e.g. "Return of damaged item".
- `storeId`: string, nullable — The store or warehouse ID the credit should be attributed to.
- `lineItemIds`: List<string>, nullable — Line item IDs on the order the credit applies to. Used by providers that support line-level refunds, and to distribute the credited amount on the order lines. Leave empty when crediting an amount not tied to specific lines. Cannot be combined with Omnium.Public.Payments.Models.OmniumCreditPaymentRequest.ShipmentId.
- `shipmentId`: string, nullable — ID of a shipment on the order, set when crediting shipping cost for a specific shipment. Cannot be combined with Omnium.Public.Payments.Models.OmniumCreditPaymentRequest.LineItemIds.

**Used directly by endpoints in:**

- [Orders | Payments](../endpoints/orders/payments.md)
