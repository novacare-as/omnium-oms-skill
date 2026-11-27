# OmniumLineItemRequestModel

Model for adding many line items to cart

**Fields:**

- `skuId`: string, nullable — Sku id of product to add to cart
- `quantity`: number (decimal), nullable — Quantity of product to add to cart. If null and selectedUnitQty is given, this will be updated to selectedUnitQty * conversionFactor. (defaults to 1)
- `unit`: string, nullable — Quantity unit - e.g. Meter,Pcs,Litre, etc
- `selectedUnit`: string, nullable — The selected unit of measurement on order line if product is sold in multiple units (Null if sold unit is default unit)
- `selectedUnitConversionFactor`: number (decimal), nullable — Conversion factor from default unit to selected unit
- `selectedUnitQuantity`: number (decimal), nullable — The quantity ordered in the selected unit of measurement.
- `priceStoreId`: string, nullable — Only use when buying from a store with a higher unit price than the default price

**Used directly by endpoints in:**

- [Carts | Add](../endpoints/carts/add.md)
