# Products | Variants

Source: https://api.omnium.no/documentation

> Product variant information.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Products/{productId}/Variants`

**Add a new variant to Omnium**

Operation ID: `ProductsPostVariant`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID to add variant to |

**Request body:** [`OmniumProductVariant`](../../schemas/OmniumProductVariant.md) — Variant to add

**Responses:**

- 201: Variant created successfully
- 400: List<string> — Variant is invalid
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product does not exist

---

## `PUT /api/Products/{productId}/Variants`

**Put a variant to Omnium, CAUTION: overwriting existing variant**

Operation ID: `ProductsPutVariant`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID to add variant to |

**Request body:** [`OmniumProduct`](../../schemas/OmniumProduct.md) — Variant to add

**Responses:**

- 204: Variant put successfully
- 400: Variant is invalid
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product not found

---

## `PATCH /api/Products/{productId}/Variants`

**Patch many product variants - update only values in request**

Operation ID: `ProductsPatchManyVariants`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID to patch |

**Request body:** List<[`OmniumProductPatch`](../../schemas/OmniumProductPatch.md)> — Patch requests

**Responses:**

- 200: [`OmniumProductUpdateResult`](../../schemas/OmniumProductUpdateResult.md) — Product updated successfully
- 400: string — Products are invalid
- 404: string — Not Found

---

## `GET /api/Products/{productId}/Variants/{variantId}`

**Get a variant by product and variant ID**

Operation ID: `ProductsGetVariant`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes |  |
| `variantId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Variants found and returned
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product or variant not found

---

## `PATCH /api/Products/{productId}/Variants/{variantId}`

**Patch product - update only values in request**

Operation ID: `ProductsPatchVariant`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID to patch |
| `variantId` | path | string | Yes | Sku ID to patch |

**Request body:** [`OmniumProductPatch`](../../schemas/OmniumProductPatch.md) — Patch request

**Responses:**

- 200: [`OmniumProductUpdateResult`](../../schemas/OmniumProductUpdateResult.md) — Product updated successfully
- 400: string — Products are invalid
- 404: string — Not Found

---

## `DELETE /api/Products/{productId}/Variants/{variantId}`

**Deletes a variant from a product**

Operation ID: `ProductsDeleteVariant`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID |
| `variantId` | path | string | Yes | Variant ID |

**Responses:**

- 200: Variant deleted successfully
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product or variant does not exist

---

## `GET /api/Products/Variants/{variantId}`

**Get a variant by variant ID**

Operation ID: `ProductsGetVariantByVariantId`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `variantId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumProductVariantOmniumSearchResult`](../../schemas/OmniumProductVariantOmniumSearchResult.md) — Variants found and returned
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Variant not found

---

## `POST /api/Products/{productId}/VariantList`

**Add new variants to Omnium**

Operation ID: `ProductsPostManyVariants`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID to add variant to |

**Request body:** List<[`OmniumProductVariant`](../../schemas/OmniumProductVariant.md)> — Variant to add

**Responses:**

- 201: Variant created successfully
- 400: List<string> — Variant is invalid
- 404: string — Product does not exist
