# Carts | Line Items

Source: https://api.omnium.no/documentation

> Contains endpoints for updating cart orderLines. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Cart/{cartId}/OrderLines/SetQuantity/Sku/{skuId}/{quantity}`

**Update quantity on cart order line by skuId / code**

Operation ID: `CartUpdateCartQuantityBySku`

This endpoint automatically detects bundle products and updates both the bundle and its components when appropriate.
For bundle products, the quantity of all component items will be recalculated based on their defined ratios.
For non-bundle products, only the individual line item quantity is updated.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |
| `skuId` | path | string | Yes | Product SKU id. (Required) |
| `quantity` | path | number (decimal) | Yes | Quantity to set. Defaults to 0 if less than 0. (Required) |
| `stopOnValidationError` | query | boolean | No | If true, the validators configured for the cart's order type and market run against the cart with the new quantity before it is saved, and nothing is saved when a validator reports an error. These include validators that check that a cart is ready for checkout, such as payments. The response is then 422 with the validation errors and the cart as it is stored. Validation warnings do not stop the change. |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Quantity updated and cart is returned
- 400: string — Bad Request
- 404: string — Not Found
- 422: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — stopOnValidationError is true and a validator reported an error. Nothing is saved

---

## `POST /api/Cart/{cartId}/OrderLines/SetQuantity/OrderLineId/{orderLineId}/{quantity}`

**Update quantity on cart order line by order line ID**

Operation ID: `CartUpdateCartQuantityByOrderLineId`

This endpoint automatically detects bundle products and updates both the bundle and its components when appropriate.
For bundle products, the quantity of all component items will be recalculated based on their defined ratios.
For non-bundle products, only the individual line item quantity is updated.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |
| `orderLineId` | path | string | Yes | Order line ID. (Required) |
| `quantity` | path | number (decimal) | Yes | Quantity to set. Defaults to 0 if less than 0. (Required) |
| `keepPrice` | query | boolean | No | If false, the price will be updated to the current product price. If true, the current price will be kept, and is only recalculated with new quantity. Note: For bundle products, this parameter is ignored as bundle pricing follows specific business rules. |
| `stopOnValidationError` | query | boolean | No | If true, the validators configured for the cart's order type and market run against the cart with the new quantity before it is saved, and nothing is saved when a validator reports an error. These include validators that check that a cart is ready for checkout, such as payments. The response is then 422 with the validation errors and the cart as it is stored. Validation warnings do not stop the change. |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Quantity updated and cart is returned
- 400: string — Bad Request
- 404: string — Cart or order line was not found
- 422: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — stopOnValidationError is true and a validator reported an error. Nothing is saved

---

## `POST /api/Cart/{cartId}/OrderLines/SetSelectedUnitQuantity/Sku/{skuId}/{selectedUnit}/{selectedUnitQuantity}`

**Update selected unit quantity on cart order line by skuId / code**

Operation ID: `CartUpdateCartSelectedUnitQuantityBySku`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |
| `skuId` | path | string | Yes | Product SKU id. (Required) |
| `selectedUnit` | path | string | Yes | Selected unit of measure (Required) |
| `selectedUnitQuantity` | path | number (decimal) | Yes | Quantity to set. Defaults to 0 if less than 0. (Required) |
| `selectedUnitConversionFactor` | query | number (decimal) | No | Conversion factor between selected unit of measure and default UOM (Default is 1:1) |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Unit quantity updated and cart is returned
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Cart/{cartId}/OrderLines/SetSelectedUnitQuantity/OrderLineId/{orderLineId}/{selectedUnit}/{selectedUnitQuantity}`

**Update selected unit quantity on cart order line by order line ID**

Operation ID: `CartUpdateCartSelectedUnitQuantityByOrderLineId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |
| `orderLineId` | path | string | Yes | Order line ID. (Required) |
| `selectedUnit` | path | string | Yes | Selected unit of measure (Required) |
| `selectedUnitQuantity` | path | number (decimal) | Yes | Quantity to set. Defaults to 0 if less than 0. (Required) |
| `selectedUnitConversionFactor` | query | number (decimal) | No | Conversion factor between selected unit of measure and default UOM (Default is 1:1) |
| `keepPrice` | query | boolean | No | If false, the price will be updated to the current product price. If true, the current price will be kept, and is only recalculated with new quantity. |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Unit quantity updated and cart is returned
- 400: string — Bad Request
- 404: string — Cart or order line was not found

---

## `DELETE /api/Cart/{cartId}/OrderLines/{lineItemId}`

**Delete item from cart**

Operation ID: `CartDeleteLineItem`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `lineItemId` | path | string | Yes |  |
| `cartId` | path | string | Yes |  |
| `deleteComponents` | query | boolean | No | If the order line you're deleting is a package or bundle, set deleteComponents to true if you want to remove its components from the cart as well |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Item is deleted and updated cart is returned
- 400: string — Cart ID or order line is invalid
- 404: string — Cart does not exist
