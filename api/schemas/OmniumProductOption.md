# OmniumProductOption

Additional options for a product

**Fields:**

- `optionTitle`: string, nullable — Title of the option
- `type`: string, nullable — Type of option
- `values`: List<[`OmniumProductOptionValue`](OmniumProductOptionValue.md)>, nullable, max length 250 — Available values for the product option
- `isRequired`: boolean, nullable — Mark the product option as required
- `sku`: string, nullable — Sku reference for the product options
- `prices`: List<[`OmniumPrice`](OmniumPrice.md)>, nullable, max length 250 — Product option specific prices (the prices will fall back to prices set on the original product if not set here)
