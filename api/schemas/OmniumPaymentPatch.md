# OmniumPaymentPatch

Payment transaction

**Fields:**

- `amount`: number (decimal), nullable — Total payment amount
- `authorizationCode`: string, nullable — Payment provider authorization code / transaction id
- `customerName`: string, nullable — Name of customer
- `id`: string, nullable — Unique for each transaction
- `paymentMethodId`: string (uuid), nullable — Payment GUID
- `paymentMethodName`: string, nullable — Provider ID
- `paymentType`: string, nullable — Payment type e.g. "Invoice", ""
- `status`: string, nullable — Payment status
- `transactionId`: string, nullable — Payment ID for provider
- `transactionType`: string, nullable — Transaction type, e.g. "Authorization", "Capture", "Credit", etc...
- `validationCode`: string, nullable — Not in use
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `paidDate`: string (date-time), nullable — Original date of payment. Could differ from "Created" if it has been pre-paid for instance
- `created`: string (date-time), nullable — When the payment was created/registered
- `isManuallyAdded`: boolean, nullable — If user added payment transaction in gui, not from provider
- `comment`: string, nullable — Comment
- `internalReference`: string, nullable — Internal reference (RMA number, order number, etc)
- `reason`: string, nullable — Description / reason for the payment
- `authorizationExpires`: string (date-time), nullable — Date from external payment provider when payment will expire (for capture)
- `storeId`: string, nullable — StoreId/WarehouseId for this transaction
- `shipmentId`: string, nullable — ShipmentId for this transaction
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable — External IDs
