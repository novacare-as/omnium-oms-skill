# OmniumCreditPaymentResult

Result of crediting (refunding) a payment through the payment provider.

**Fields:**

- `success`: boolean — True when the payment provider accepted the credit.
- `transactionId`: string, nullable — Transaction identifier for the credit transaction from the payment provider.
- `paymentMethodName`: string, nullable — The payment provider that handled the credit.
- `amount`: number (decimal), nullable — The credited amount, in the order's billing currency.
- `invoiceNumber`: string, nullable — Invoice number for the credit, set by invoice-based payment providers.
- `errorMessage`: string, nullable — Error message from the payment provider when Omnium.Public.Payments.Models.OmniumCreditPaymentResult.Success is false.
- `comment`: string, nullable — Comment set by the payment provider about how the credit was handled, e.g. that it was refunded onto a newly issued gift card.
- `order`: [`OmniumOrder`](OmniumOrder.md)

**Used directly by endpoints in:**

- [Orders | Payments](../endpoints/orders/payments.md)
