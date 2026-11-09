# OmniumPaymentTransaction

Payment transaction

**Fields:**

- `orderNumber`: string, nullable — Order number
- `amount`: number (decimal) — Transaction amount
- `amountExclTax`: number (decimal) — Transaction amount excluding tax
- `currencyCode`: string, nullable — Currency
- `customerName`: string, nullable — Customer name
- `transactionId`: string, nullable — Payment provider transaction ID
- `created`: string (date-time), nullable — Payment transaction date
- `transactionType`: string, nullable — Transaction type (Capture / Credit)
- `reservationId`: string, nullable — Payment reservation ID
- `authorizationCode`: string, nullable — Payment authorization code
- `paymentMethodName`: string, nullable — Payment provider ID
- `comment`: string, nullable — Payment comment
- `internalReference`: string, nullable — Internal reference
- `paidDate`: string (date-time), nullable — Payment Date
- `transactionDate`: string (date-time), nullable — Date of transaction (In use for settlements only).
- `paymentStoreId`: string, nullable — Store ID for payment transaction
- `paymentStoreName`: string, nullable — Store name for payment transaction
- `paymentMarketId`: string, nullable — Market ID for payment transaction
- `shipmentId`: string, nullable — Shipment ID triggering transaction
- `externalIds`: string, nullable — Store External IDs
- `shippingLabel`: string, nullable — Shipping label
- `orderCreated`: string (date-time) — Order date
- `orderTotal`: number (decimal) — Order total (all payments)
- `shippingTotal`: number (decimal) — Shipping total (shipping cost)
- `remainingPayment`: number (decimal), nullable — Remaining order payment
- `billingCurrency`: string, nullable — Billing Currency
- `lineItems`: integer (int32) — Number of line items on order / shipment
- `status`: string, nullable — Order / shipment status
- `id`: string, nullable — Unique id for transaction
- `paymentProviderFee`: number (decimal) — Payment provider fee
- `paymentNumber`: string, nullable — Payment number
- `orderStoreId`: string, nullable — Store ID for the order
- `orderStoreName`: string, nullable — Store name for the order
- `settlementReference`: string, nullable — Settlement reference
- `salesChannel`: string, nullable — Sales channel
- `returnStoreId`: string, nullable — Store ID for the return.
