# Carts | Update

Source: https://api.omnium.no/documentation

> Contains endpoints for creating and modifying carts. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `DELETE /api/Cart/{cartId}`

**Delete cart**

Operation ID: `CartDeleteCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes |  |

**Responses:**

- 204: Cart is deleted
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Cart does not exist
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bonus points redeemed on the cart could not be given back to the member

---

## `POST /api/Cart/CreateCart`

**Create new empty cart**

Operation ID: `CartCreateCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | query | string | No |  |

**Responses:**

- 201: [`OmniumCart`](../../schemas/OmniumCart.md) — New cart is returned
- 400: string — Parameters are invalid

---

## `POST /api/Cart/{cartId}/UpdateComponentsInCart/orderLineId/{orderLineId}`

**Update bundle components in cart**

Operation ID: `CartUpdateComponentsInCart`

If bundle contains components/products with variants, and they are not added when bundle is added to cart, use this endpoint to update.
Only components that are not added already, will be added. If component is added as order line already, update order line insted.

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
| `cartId` | path | string | Yes | Cart to update |
| `orderLineId` | path | string | Yes | Bundle order line id |

**Request body:** List<[`OmniumProductComponent`](../../schemas/OmniumProductComponent.md)> — Components to update/add as order line

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Cart`

**Save cart to Omnium.**

Operation ID: `CartSaveCart`

**Request body:** [`OmniumCart`](../../schemas/OmniumCart.md) — Cart to put

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart added and returned
- 400: string — Cart is invalid

---

## `PUT /api/Cart/{cartId}/RemoveCustomerFromCart`

**Removes a customer from cart. This will remove all customer related info like id, phone, e-mail and address. Prices will also be recalculated**

Operation ID: `CartRemoveCustomerFromCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart (Required) |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Customer is removed from cart, and updated cart is returned
- 400: string — Bad Request
- 404: string — Cart does not exist

---

## `PATCH /api/Cart/{cartId}/PatchCart`

**Patch cart - update only values in request**

Operation ID: `CartPatchCart`

Only the properties supplied in the body are updated; everything else on the cart is left untouched.
The cart is recalculated after the patch is applied.

Example - update the customer email and add a custom property:

    PATCH /api/carts/{cartId}/PatchCart
    {
        "customerEmail": "ola.nordmann@example.com",
        "properties": [
            { "key": "giftWrap", "value": "true" }
        ]
    }

List properties such as {orderForm.payments}, {orderForm.shipments}, {orderForm.discounts} and
{orderForm.couponCodes} can be merged with add/update/replace semantics - see the corresponding
{*MergeMode} fields for details.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |
| `returnUpdatedItem` | query | boolean | No | Set to true to include the updated cart in the response as {updatedItem}, avoiding a follow-up GET |

**Request body:** [`OmniumOrderPatch`](../../schemas/OmniumOrderPatch.md) — Cart patches. Properties with value will be updated

**Responses:**

- 200: [`OmniumCartPatchUpdateResult`](../../schemas/OmniumCartPatchUpdateResult.md) — Cart updated successfully
- 400: string — Cart patch is invalid

---

## `POST /api/Cart/{cartId}/DeactivateCart`

**Deactivate cart**

Operation ID: `CartDeactivateCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart deactivated and updated cart is returned
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Cart/ExportCarts`

**Export carts to a connector**

Operation ID: `CartExportCarts`

Sample request for exporting carts to a connector:

    POST /api/Cart/ExportCarts
    {
       "connectorId": "19527b9b-6ebf-4d34-8e32-28ff618ff168",
       "cartIds": ["CART-001", "CART-002"]
    }

    POST /api/Cart/ExportCarts
    {
       "connectorName": "sitoo",
       "cartIds": ["CART-001"]
    }

If both connectorId and connectorName are provided, connectorId takes priority as it is more specific.

**Request body:** [`OmniumCartExportRequest`](../../schemas/OmniumCartExportRequest.md) — The export request containing connector ID or name and list of cart IDs to export

**Responses:**

- 200: List<[`OmniumExportResult`](../../schemas/OmniumExportResult.md)> — Carts exported successfully
- 400: string — Invalid request
