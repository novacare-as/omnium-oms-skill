# OmniumProductOptionViewModel

Single product options view model

**Fields:**

- `optionTitle`: string, nullable — Title of the option
- `sku`: string, nullable — Sku reference
- `type`: string, nullable — Type of option
- `values`: List<[`OmniumProductOptionValueViewModel`](OmniumProductOptionValueViewModel.md)>, nullable, max length 250 — Available values for the product option, populated with prices
- `price`: [`OmniumPrice`](OmniumPrice.md)
- `isRequired`: boolean, nullable — If the product option should be mandatory for the product selected
