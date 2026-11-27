# OmniumPaymentOption

Class for diffenret payment options

**Fields:**

- `name`: string, nullable — Name of the payment option/provider
- `paymentMethodName`: string, nullable — Unique name to identify this payment option.
- `providerName`: string, nullable — Unique name to identify this payment option if PaymentMethodName needs to be something special. If Payment provider(klarna) has two different payment types, ProviderName should be same on both, and PaymentMethodName can differ
- `displayName`: string, nullable — Friendly name for payment option
- `merchantId`: string, nullable — Provider id
- `apiToken`: string, nullable — Provider token
- `clientId`: string, nullable — Provider ClientId/key
- `baseUrl`: string, nullable — Url to payment provider
- `authorizationBaseUrl`: string, nullable — Url to authorization(if differ from BaseUrl) payment provider
- `logoUrl`: string, nullable — Provider logo url
- `isEmptyPayment`: boolean — Used if this is dummy provider(not going to 3 party)
- `displayInCart`: boolean — Visible in a cart/checkout
- `editable`: boolean — Possible to change props
- `termsUrl`: string, nullable — Url to website payment terms
- `authorizationTimeInDays`: integer (int32) — Default expiration time in days for authorization amount

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
- [Orders | Payments](../endpoints/orders/payments.md)
