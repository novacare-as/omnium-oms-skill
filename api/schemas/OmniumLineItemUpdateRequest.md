# OmniumLineItemUpdateRequest

Model for adding many line items to cart

**Fields:**

- `skuId`: string, required — Sku id of product to add to cart. (Required)
- `quantity`: number (decimal), nullable — Quantity to add. Defaults to 1 if not provided. If unitId is specified then this refers to the units quantity.
- `unitId`: string, nullable — EAN for product unit - If set then the quantity will refer to the unit's quantity. If no matching unit price is found we will fallback to default unit and price
- `priceStoreId`: string, nullable — Only use when buying from a store with a higher unit price than the default price
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — List of properties that will be added to the order line
- `forceNewOrderLine`: boolean — If set to true, a new order line will be created even if there is an existing order line with the same sku
- `allowNoPriceItems`: boolean, nullable — Allow adding this item without a price (it will get price = 0). If not set, the value of AllowNoPriceItems on the request applies. If set (true or false), it overrides the request value for this line only.
