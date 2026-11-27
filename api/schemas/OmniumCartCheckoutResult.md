# OmniumCartCheckoutResult

Result of a cart checkout operation. Contains validation information
and, on success, the created order.

**Fields:**

- `patchResult`: [`OmniumOrderPatchUpdateResult`](OmniumOrderPatchUpdateResult.md)
- `value`: [`OmniumOrder`](OmniumOrder.md)
- `isValidatedSuccessful`: boolean
- `validationErrors`: List<[`OmniumValidationError`](OmniumValidationError.md)>, nullable, max length 250
- `validationWarnings`: List<[`OmniumValidationError`](OmniumValidationError.md)>, nullable, max length 250
- `validationMessage`: string, nullable

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
