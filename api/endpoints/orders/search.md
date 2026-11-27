# Orders | Search

Source: https://api.omnium.no/documentation

> Search for orders.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Orders/Search`

**Search and filtering of orders.**

Operation ID: `OrdersSearchOrders`

**Request body:** [`OmniumOrderSearchRequest`](../../schemas/OmniumOrderSearchRequest.md)

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Orders/Scroll`

**Scroll orders by search**

Operation ID: `OrdersScrollSearch`

Scrolling is not intended for real time user requests, but rather for processing large amounts of data. Only use scroll endpoints if you intend to fetch all items returned by the search request.
            Paging (take, page) is disabled for scroll searches.
            Sample request for a delta query using modified date and filtering on an order type:

            POST /api/orders/scroll
            {
               "ModifiedFrom": "2022-12-24T17:32:28Z",
               "OrderType": "ClickAndCollect"
            }

**Request body:** [`OmniumOrderSearchRequest`](../../schemas/OmniumOrderSearchRequest.md)

**Responses:**

- 200: [`OmniumOrderOmniumResult`](../../schemas/OmniumOrderOmniumResult.md) — Search successful, returning orders
- 400: string — Search request invalid

---

## `GET /api/Orders/Scroll/{id}`

**Scroll orders is used to get a large amount of orders.**

Operation ID: `OrdersScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumOrderOmniumResult`](../../schemas/OmniumOrderOmniumResult.md) — Success

---

## `POST /api/Orders/SearchByCustomProperties`

**Search orders by custom properties.**

Operation ID: `OrdersGetOrdersByCustomProperties`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `key` | query | string | No |  |
| `value` | query | string | No |  |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request
- 404: string — Orders were not found

---

## `POST /api/Orders/Customers/{customerId}/Orders/Search`

**Returns a list of orders for a given customer, matching search text. Supports paging.**

Operation ID: `OrdersSearchOrdersForCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | path | string | Yes | ID of the customer |

**Request body:** [`OmniumSearchRequest`](../../schemas/OmniumSearchRequest.md) — Search request containing search query

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: string — Bad Request
- 404: string — Orders were not found
