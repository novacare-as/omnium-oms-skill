# OmniumCartValidationRequest

Request model for validating a cart with optional validator selection

**Fields:**

- `validators`: List<string>, nullable — Optional list of validator names to execute. If null or empty, all configured validators will be executed. Use GET /api/carts/Validators to discover available validator names.

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
