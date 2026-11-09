# OmniumProductOptionValueViewModel

The product option value is a pointer to a product in Omnium with the IsProductOption property set to 'true'.
The view model also contains a price, which is populated by the reference sku.

**Fields:**

- `title`: string, nullable — Title of the product option value
- `value`: string, nullable — Value
- `price`: [`OmniumPrice`](OmniumPrice.md)
- `sku`: string, nullable — Sku reference
- `maxSize`: number (decimal), nullable — Max input size for the text input type of option
