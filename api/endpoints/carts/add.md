# Carts | Add

Source: https://api.omnium.no/documentation

> Contains endpoints for adding items to carts. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PUT /api/Cart/OrderLines/CreateCart`

**Add item to new cart**

Operation ID: `CartCreateCartFromOrderLine`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | query | string | No | Market ID for new cart (using default if null) |

**Request body:** [`OmniumOrderLine`](../../schemas/OmniumOrderLine.md) — Order line to add to new cart

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Item is added and updated cart is returned
- 400: string — Parameters are invalid

---

## `POST /api/Cart/AddProductOptionsItemToCart`

**Add product options to cart with an existing order line.**

Operation ID: `CartAddProductOptionsItemToCart`

This endpoint allows adding additional product options like engraving, customizations or additional services to an existing product in the cart.

Below you'll find a sample request for adding two product options (engraving and font type) to a cart with id C1234, to order line with LineItemId "a43707ab-1ebf-4114-8c48-eb0374932a4c", which in this case is a diamond ring.

The product options "P3" and "P5" should be valid SKUs for products in Omnium, with product type set to `ProductOption`.

The price for the product option will set from A: a specific price set in the parameter price, as displayed below. B: The price specified for the product option. C: The price specified for the product matching the sku.

    POST /api/carts/AddProductOptionsItemToCart
    {
        {
            "cartId": "C1234", // The unique identifier of the cart
            "parentLineItemId": "a43707ab-1ebf-4114-8c48-eb0374932a4c", // The ID of the existing order line to which product options are added
            "productOptions": [
                {
                    "skuId": "P3", // SKU ID of the product option
                    "title": "Font type", // Name of the product option
                    "value": "Big and bold" // The selected option value
                    "price": 199 // Optional: If you do not et the price in the request, the price will be fetched from the product in Omnium
                },
                {
                    "skuId": "P5",
                    "title": "Engraving",
                    "value": "omnium4ever"
                },
                {
                    "skuId": "P8" // It would often be sufficient to only use the skuId. The price and values would then fall back to the product option or the store product
                }
            ]
        }
    }

This would add three additional order lines to the cart, which would result in a diamond ring engraved with "omnium4ever" with font type "Big and bold", and also the option "P8" which in this case is an ultra nice gift box 💍

**Request body:** [`OmniumAddProductOptionsRequest`](../../schemas/OmniumAddProductOptionsRequest.md)

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Item is added and updated cart is returned
- 400: string — Parameters are invalid
- 404: string — Not Found

---

## `POST /api/Cart/AddItemToCart`

**Add item to new or existing cart**

Operation ID: `CartAddItemToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | query | string | No | ID of existing cart. If null, new cart will be created |
| `skuId` | query | string | Yes | Product SKU id. (Required) |
| `quantity` | query | number (decimal) | No | Quantity to add. Defaults to 1 if not provided. If unitId is specified then this refers to the units quantity. |
| `marketId` | query | string | No | Market ID for new cart - default market if null |
| `storeId` | query | string | No | Store ID for new cart - defaults to null |
| `customerId` | query | string | No | CustomerId for the new cart - defaults to null |
| `warehouseCode` | query | string | No | Optional - WarehouseCode for orderline fulfillment warehouse. If set the order line will be added to a shipment with the specified warehouseCode. |
| `unitId` | query | string | No | EAN for product unit - If set then the quantity will refer to the unit's quantity. If no matching unit price is found we will fallback to default unit and price |
| `forceNewOrderLine` | query | boolean | No | If set to true, a new order line will be created even if there is an existing order line with the same sku |
| `priceStoreId` | query | string | No | Only use when buying from a store with a higher unit price than the default price |
| `preventAutomaticOrderLineShipmentAssignment` | query | boolean | No | Omnium will automatically assign new line items to existing shipments. If the cart shipment contains a shipment but the orderline should be kept outside the shipment set this propery to true. |
| `allowNoPriceItems` | query | boolean | No | Allow adding items without a price (they will get price = 0) |
| `stopOnValidationError` | query | boolean | No | If true, the validators configured for the cart's order type and market run against the cart with the new item before it is saved, and nothing is saved when a validator reports an error. These include validators that check that a cart is ready for checkout, such as payments. The response is then 422 with the validation errors and the cart as it is stored, or no cart when the request would have created it. Validation warnings do not stop the change. |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Item is added to existing cart and updated cart is returned
- 201: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart is created and item added. Updated cart is returned
- 400: string — Parameters are invalid
- 404: string — Not Found
- 422: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — stopOnValidationError is true and a validator reported an error. Nothing is saved

---

## `POST /api/Cart/AddItemsToCart`

**Add items to new or existing cart**

Operation ID: `CartAddItemsToCart`

**Required**
- `lineItemRequests`: at least one line, otherwise the request is rejected with 400.
- `lineItemRequests[].skuId`: SKU of the product to add on every line, otherwise the request is rejected with 400.

**Optional**
- `cartId`: existing cart. If empty, a new cart is created (201). If set, the cart must exist (404 otherwise).
- `marketId`, `storeId`, `customerId`: used for a new cart. On an existing cart they are applied only when set, and `customerId` only when the cart has no customer.
- `priceStoreId`: applies to all lines unless a line sets its own.
- `allowNoPriceItems`: defaults to false. Allows items without a price (they get price = 0). Applies to all lines unless a line sets its own `allowNoPriceItems`. A value on a line (true or false) overrides the request value for that line only. A line that leaves it out uses the request value.
- `lineItemRequests[].quantity`: defaults to 1. If `unitId` is set, the quantity refers to the unit.
- `lineItemRequests[].unitId`, `priceStoreId`, `forceNewOrderLine`, `allowNoPriceItems`, `properties`.
- `stopOnValidationError`: defaults to false. If true, the validators configured for the cart's order type and market run against the cart with all the new lines before it is saved, and nothing is saved when a validator reports an error. These include validators that check that a cart is ready for checkout, such as payments. The response is then 422 with the validation errors and the cart as it is stored, or no cart when the request would have created it. Validation warnings do not stop the change.

**Request body:** [`OmniumCartUpdateRequest`](../../schemas/OmniumCartUpdateRequest.md) — CartId (existing cart - a new cart is created if empty), MarketId, StoreId and CustomerId (used for a new cart), PriceStoreId and AllowNoPriceItems (apply to all lines unless set on the line), LineItemRequests (SkuId, Quantity, UnitId, PriceStoreId, ForceNewOrderLine, AllowNoPriceItems, Properties) and StopOnValidationError. LineItemRequests is required.

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Items are added to existing cart and updated cart is returned
- 201: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart is created and items are added. The updated cart is returned
- 400: string — Parameters are invalid
- 404: string — Not Found
- 422: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — StopOnValidationError is true and a validator reported an error. Nothing is saved

---

## `POST /api/Cart/AddManyItemsToCart`

**Add many items to new or existing cart**

Operation ID: `CartAddManyItemsToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | query | string | No | ID of existing cart. If null, new cart will be created |
| `marketId` | query | string | No | Market ID for new cart - default market if null |
| `storeId` | query | string | No | Store ID for new cart - defaults to null |
| `customerId` | query | string | No | CustomerId for the new cart - defaults to null |
| `forceNewOrderLine` | query | boolean | No | If set to true, a new order line will be created even if there is an existing order line with the same sku |
| `stopOnValidationError` | query | boolean | No | If true, the validators configured for the cart's order type and market run against the cart with all the new items before it is saved, and nothing is saved when a validator reports an error. These include validators that check that a cart is ready for checkout, such as payments. The response is then 422 with the validation errors and the cart as it is stored, or no cart when the request would have created it. Validation warnings do not stop the change. |

**Request body:** List<[`OmniumLineItemRequestModel`](../../schemas/OmniumLineItemRequestModel.md)> — List of Product SKU ids and quantity (defaults to 1 if not provided). (Required)

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Items is added to existing cart and updated cart is returned
- 201: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart is created and items added. Updated cart is returned
- 400: string — Parameters are invalid
- 404: string — Not Found
- 422: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — stopOnValidationError is true and a validator reported an error. Nothing is saved

---

## `POST /api/Cart/AddPackageItemToCart`

**Add item to new or existing cart**

Operation ID: `CartAddPackageItemToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | query | string | No | ID of existing cart. If null, new cart will be created |
| `skuId` | query | string | Yes | Product SKU id. (Required) |
| `quantity` | query | number (decimal) | No | Quantity to add. Defaults to 1 if not provided. |
| `marketId` | query | string | No | Market ID for new cart - default market if null |
| `storeId` | query | string | No | Store ID for new cart - defaults to null |
| `customerId` | query | string | No | CustomerId for the new cart - defaults to null |
| `forceNewOrderLine` | query | boolean | No | If set to true, a new order line will be created even if there is an existing order line with the same sku |
| `priceStoreId` | query | string | No | Only use when buying from a store with a higher unit price than the default price |

**Request body:** List<[`OmniumProductComponent`](../../schemas/OmniumProductComponent.md)>

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Item is added to existing cart and updated cart is returned
- 201: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart is created and item added. Updated cart is returned
- 400: string — Parameters are invalid
- 404: string — Not Found

---

## `POST /api/Cart/AddBundleToCart`

**Add bundle to new or existing cart**

Operation ID: `CartAddBundleToCart`

If omniumProductComponents is not defined in the request, all components that are single skus, will be added as order lines.
If bundle contains products with variants, specify selected variants in components list. If you don't specify correct variant, use endpoint "UpdateComponentsInCart"
to update the cart.

Example where one of the products in the bundle has variants. Selected variant from component will be added as order line

     POST /api/Cart/AddBundleToCart?skuId=BundleSkuId
     [
        {
            "componentId": "821cdfd1-4bf1-48fe-8944-4cc51d62bc66",
            "productId": "castelli-33221",
            "skuId": "castelli-33221-M",
            "quantity": 1
        }
    ]

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | query | string | No | ID of existing cart. If null, new cart will be created |
| `skuId` | query | string | Yes | Bundle skuId (Required) |
| `quantity` | query | number (decimal) | No | Quantity to add. Defaults to 1 if not provided. |
| `marketId` | query | string | No | Market ID for new cart - default market if null |
| `storeId` | query | string | No | Store ID for new cart - defaults to null |
| `customerId` | query | string | No | CustomerId for the new cart - defaults to null |
| `forceNewOrderLine` | query | boolean | No | If set to true, a new order line will be created even if there is an existing order line with the same sku |
| `priceStoreId` | query | string | No | Only use when buying from a store with a higher unit price than the default price |

**Request body:** List<[`OmniumProductComponent`](../../schemas/OmniumProductComponent.md)> — Product components

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Bundle is added to existing cart and updated cart is returned
- 201: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart is created and bundle added. Updated cart is returned
- 400: string — Parameters are invalid
- 404: string — Not Found

---

## `PUT /api/Cart/{cartId}/OrderLines`

**Add order line to cart**

Operation ID: `CartAddOrderLineToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes |  |
| `forceNewOrderLine` | query | boolean | No |  |

**Request body:** [`OmniumOrderLine`](../../schemas/OmniumOrderLine.md)

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Returns recalculated cart with new line item
- 400: string — Cart ID or order line is invalid
- 404: string — Cart does not exist

---

## `POST /api/Cart/{cartId}/OrderLines/Add`

**Add item to existing cart**

Operation ID: `CartAddItemToExistingCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. If null, new cart will be created |
| `skuId` | query | string | Yes | Product SKU id. (Required) |
| `quantity` | query | number (decimal) | No | Quantity to add. Defaults to 1 if not provided. |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Item is added and updated cart is returned
- 400: string — Cart ID or sku ID is invalid
- 404: string — Cart does not exist
- 422: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — Item added, but validation completed with errors or warnings

---

## `PUT /api/Cart/{cartId}/AddCustomer/{customerId}`

**Add customer ID to existing cart**

Operation ID: `CartAddCustomerIdToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |
| `customerId` | path | string | Yes | Customer ID to add to cart. (Required) |
| `enrichCart` | query | boolean | No | If true, the customer name and contact info is added to cart |
| `isPriceRecalculated` | query | boolean | No | If true, prices will be recalculated based on customer ID. If false, prices will remain the same. |
| `customerSpecificPrices` | query | boolean | No | If true, customer specific prices customer specific prices will replaces the current prices. If there is no customer specific prices, the default price will be used instead. |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Customer is added to cart, and updated cart is returned
- 400: string — Cart ID or customer ID is invalid
- 404: string — Cart does not exist
