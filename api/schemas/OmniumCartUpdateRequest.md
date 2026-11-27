# OmniumCartUpdateRequest

**Fields:**

- `cartId`: string, nullable — ID of cart to edit
- `marketId`: string, nullable — Market ID for new cart - default market if null
- `storeId`: string, nullable — Store ID for new cart - defaults to null
- `customerId`: string, nullable — CustomerId for the new cart - defaults to null
- `lineItemRequests`: List<[`OmniumLineItemUpdateRequest`](OmniumLineItemUpdateRequest.md)>, nullable — List of Product SKU ids and quantity (defaults to 1 if not provided). (Required)
- `priceStoreId`: string, nullable — If set here, it applies to all items in LineItemRequests unless a specific {PriceStoreId} is provided at the line item level.
- `allowNoPriceItems`: boolean — Allow adding items without a price (they will get price = 0). If set here, it applies to all items in LineItemRequests unless a specific {AllowNoPriceItems} is provided at the line item level. A line value (true or false) overrides this value for that line only.
- `stopOnValidationError`: boolean — If true, the validators configured for the cart's order type and market run against the cart with all the new lines before it is saved, and nothing is saved when a validator reports an error. These include validators that check that a cart is ready for checkout, such as payments. The response is then 422 with the validation errors. Validation warnings do not stop the change.

**Used directly by endpoints in:**

- [Carts | Add](../endpoints/carts/add.md)
