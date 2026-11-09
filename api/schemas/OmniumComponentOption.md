# OmniumComponentOption

Represents a selectable option for a package component.

**Fields:**

- `skuId`: string, nullable — The SKU ID of the selectable option.
- `productId`: string, nullable — The product ID associated with this option. Only required if SkuId is not specified. This allows all variants of a product to be valid options.
- `priceOffsets`: List<[`OmniumPrice`](OmniumPrice.md)>, nullable — Relevant only for packages (not bundles). Price offsets applied to the package price when this option is selected. Offsets can be positive or negative, indicating that the price is added to or deducted from the package price. If no offsets are defined, the option does not affect the package price.
