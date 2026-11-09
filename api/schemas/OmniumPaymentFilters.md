# OmniumPaymentFilters

Payment transaction filters - Specified filters for selecting one or more payments

**Fields:**

- `ids`: List<string>, nullable — Id
- `transactionIds`: List<string>, nullable — Payment ID from provider
- `transactionTypes`: List<string>, nullable — Transaction type, e.g. "Authorization", "Capture", "Credit", etc...
- `paymentMethodNames`: List<string>, nullable — Payment method name
- `statuses`: List<string>, nullable — Payment status, e.g. "Processed", "Failed"

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
