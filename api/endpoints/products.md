# Products

Source: https://api.omnium.no/documentation

> Product information and enrichment.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/ImagesDelivery/GetImageUrl`

**Based on a image url that exists in Omnium, generate a new size.If both width and height is specified, width is used**

Operation ID: `ImagesDeliveryGetImageUrl`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `url` | query | string | No | Complete url to the image |
| `maxHeight` | query | integer (int32) | No | Max height for the generated image |
| `maxWidth` | query | integer (int32) | No | Max width for the generated image |

**Responses:**

- 200: Success
- 400: Bad Request
- 404: Not Found

---

## `GET /api/Products/GetNextProductNumber`

**Get next generated product number.**

Operation ID: `ProductsGetNextProductNumber`

Requires that ProductNumberOptions is configured, with auto create enabled.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | query | string | No | Optional: Provide if multiple ProductNumberOptions configured |

**Responses:**

- 200: ProductNumber
- 400: string — ProductNumber not available
- 404: string — NumberOptions not configured

---

## `POST /api/Products/Orders/ProductStatistics`

**Create product statistics**

Operation ID: `ProductsCreateProductStatistics`

**Request body:** [`OmniumProductStatisticsSearchRequest`](../schemas/OmniumProductStatisticsSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumProductSales`](../schemas/OmniumProductSales.md) — Product statistics returned
- 204: Success
- 400: string — Search request is not valid
- 404: [`ProblemDetails`](../schemas/ProblemDetails.md) — Not Found

---

## `GET /api/Products/{productId}/Options`

**Get product options for product**

Operation ID: `ProductsGetProductOptions`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID for the product which has product options |

**Responses:**

- 200: [`OmniumProductOptionsViewModel`](../schemas/OmniumProductOptionsViewModel.md) — Product options returned
- 400: string — Bad Request
- 404: string — Product not found
