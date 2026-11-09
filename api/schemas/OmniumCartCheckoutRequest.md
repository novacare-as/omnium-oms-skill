# OmniumCartCheckoutRequest

Request model for checking out a cart (converting it to an order).
Optionally applies a cart patch (which can also add/replace payments or shipments) in the same operation.

**Fields:**

- `validators`: List<string>, nullable — Optional list of validator names to run during checkout. If null (or omitted), all configured validators will be executed. If an empty array, no validators will be run (the consumer has opted out of validation). If non-empty, only the named validators will be run. Use GET /api/carts/Validators to discover available validator names.
- `orderId`: string, nullable — Optional. Consumer-specified ID for the resulting order. When set, this value is used as the order ID directly (and as the order number), bypassing any fallback to cart.OrderNumber, tenant settings or auto-generation. When not set (null or empty), Omnium generates the order ID automatically using the tenant's configured order number service.
- `cartPatch`: [`OmniumOrderPatch`](OmniumOrderPatch.md)

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
