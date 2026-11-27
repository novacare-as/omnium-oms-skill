# Products | Search

Source: https://api.omnium.no/documentation

> Search for products.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Products/SearchProducts`

**Search for products, return product list items. Does not return entire product models.**

Operation ID: `ProductsSearchProducts`

**Request body:** [`OmniumProductSearchRequest`](../../schemas/OmniumProductSearchRequest.md)

**Responses:**

- 200: [`OmniumProductListItemViewModelOmniumSearchResult`](../../schemas/OmniumProductListItemViewModelOmniumSearchResult.md) — Search successful, returning product list items (view model)
- 400: string — Search request invalid

---

## `GET /api/Products/Scroll/{id}`

**Scroll products is used to get a large amount of products.**

Operation ID: `ProductsScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumProductOmniumResult`](../../schemas/OmniumProductOmniumResult.md) — Success

---

## `POST /api/Products/Scroll`

**Scroll through products based on search criteria.**

Operation ID: `ProductsScrollSearch`

Scrolling is intended for processing large datasets and is not suitable for real-time user interactions.
Use scroll endpoints when you need to retrieve all items resulting from the search, as pagination (i.e., 'take' and 'page' parameters) is disabled for scroll searches.

If the `scrollId` property is return from the search, continue fetching the remaining products using the `/api/products/scroll/{id}` endpoint until there are no more products to scroll. If it is not returned, it means that all products were returned in the initial result

**Request body:** [`OmniumProductSearchRequest`](../../schemas/OmniumProductSearchRequest.md) — The request object containing search parameters for products.

**Responses:**

- 200: [`OmniumProductOmniumResult`](../../schemas/OmniumProductOmniumResult.md) — Search was successful. Products are returned and possibly a scroll ID
- 400: The search request is invalid, likely due to incorrect parameters.
