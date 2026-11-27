# OmniumCartOmniumValidationResult

**Fields:**

- `value`: [`OmniumCart`](OmniumCart.md)
- `isValidatedSuccessful`: boolean
- `validationErrors`: List<[`OmniumValidationError`](OmniumValidationError.md)>, nullable, max length 250
- `validationWarnings`: List<[`OmniumValidationError`](OmniumValidationError.md)>, nullable, max length 250
- `validationMessage`: string, nullable

**Used directly by endpoints in:**

- [Carts | Add](../endpoints/carts/add.md)
- [Carts | Checkout](../endpoints/carts/checkout.md)
- [Carts | Line Items](../endpoints/carts/line-items.md)
