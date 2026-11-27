# Products | Get

Source: https://api.omnium.no/documentation

> Get products by parameters.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Products/{productId}`

**Get product by Product ID or SKU ID. Product will be returned with all valid prices(for all markets/stores) sorted by defaultMarket, excluding customer specific prices. For the complete product, with all prices and no sorting, use GET "products/{id}/raw")**

Operation ID: `ProductsGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID or SKU ID |

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Product found and returned
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product or SKU does not exist

---

## `GET /api/Products/{id}/raw`

**Get product by product ID. Returned as is, with no exclusion or sorting of prices.**

Operation ID: `ProductsGetRawProduct`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Product document ID (including language post-fix when using product languages) |

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Product found and returned
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product does not exist

---

## `GET /api/Products/{productId}/ByMarket/{marketId}`

**Get product by Product ID or SKU ID. Product will be returned with prices ONLY for selected market. If you need the complete object, use get without market**

Operation ID: `ProductsGetProductByMarket`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID or SKU ID |
| `marketId` | path | string | Yes | Market ID for product and prices |

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Product found and returned
- 400: string — Invalid marketId
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product or SKU does not exist

---

## `GET /api/Products/{productId}/ByStore/{storeId}`

**Get product by Product ID or SKU ID. Product will be returned with prices ONLY for selected store, or valid market for store. If you need the complete object, use get without store or market**

Operation ID: `ProductsGetProductByStore`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID or SKU ID |
| `storeId` | path | string | Yes | Store ID for product and prices |
| `isAssortmentIgnored` | query | boolean | No | True if assortment should be ignored |

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Product found and returned
- 400: string — Product ID is invalid
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product or SKU does not exist

---

## `GET /api/Products/{productId}/ByCustomer`

**Get product by Product ID or SKU ID. Product will be returned with relevant prices for the selected customer or customer group. If both the product and customer has assortment codes set, the product will not be returned if there is a mismatch and status 404 will be returned instead.**

Operation ID: `ProductsGetProductByCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID or SKU ID |
| `customerId` | query | string | No |  |
| `customerGroup` | query | string | No |  |

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Product found and returned
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product or SKU does not exist

---

## `GET /api/Products/{productId}/Variants`

**Get list of variants by product ID**

Operation ID: `ProductsGetVariants`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productId` | path | string | Yes | Product ID or SKU id |

**Responses:**

- 200: [`OmniumProductOmniumSearchResult`](../../schemas/OmniumProductOmniumSearchResult.md) — Product and variants found, returning list of variants
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Product does not exist, or does not contain variants

---

## `GET /api/Products/ProductCategories/{productCategoryId}`

**Get list of products by product category id**

Operation ID: `ProductsGetByCategory`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productCategoryId` | path | string | Yes | Product Category ID |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |

**Responses:**

- 200: [`OmniumProductListItemViewModelOmniumSearchResult`](../../schemas/OmniumProductListItemViewModelOmniumSearchResult.md) — Product found, returning search result
- 400: string — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Products not found

---

## `GET /api/Products/ProductSearch/{productSearchId}`

**Get list of products by product search id**

Operation ID: `ProductsGetByProductSearch`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `productSearchId` | path | string | Yes | Product Search ID |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |

**Responses:**

- 200: [`OmniumProductListItemViewModelOmniumSearchResult`](../../schemas/OmniumProductListItemViewModelOmniumSearchResult.md) — Product found, returning search result
- 400: string — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Products not found

---

## `GET /api/Products/SearchGroup/{searchGroupId}`

**Get list of products by search group id**

Operation ID: `ProductsGetBySearchGroup`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `searchGroupId` | path | string | Yes | Search group ID |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |

**Responses:**

- 200: [`OmniumProductListItemViewModelOmniumSearchResult`](../../schemas/OmniumProductListItemViewModelOmniumSearchResult.md) — Search result, including empty when the group matches no products
- 400: string — Pagination exceeds 20000
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Search group not found
