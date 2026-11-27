# Carts | Search

Source: https://api.omnium.no/documentation

> Contains endpoints for searching for carts with different parameters. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Cart/Search`

**Search carts**

Operation ID: `CartSearch`

**Request body:** [`OmniumCartSearchRequest`](../../schemas/OmniumCartSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumCartOmniumSearchResult`](../../schemas/OmniumCartOmniumSearchResult.md) — Returning items found
- 400: string — Search request is invalid

---

## `POST /api/Cart/ScrollSearch`

**Scroll carts by search**

Operation ID: `CartScrollSearch`

Scrolling is not intended for real time user requests, but rather for processing large amounts of data. Only use scroll endpoints if you intend to fetch all items returned by the search request.
           Paging (take, page) is disabled for scroll searches.

**Request body:** [`OmniumCartSearchRequest`](../../schemas/OmniumCartSearchRequest.md)

**Responses:**

- 200: [`OmniumCartOmniumSearchResult`](../../schemas/OmniumCartOmniumSearchResult.md) — Search successful, returning products
- 400: string — Search request invalid

---

## `GET /api/Cart/Scroll/{id}`

**Scroll carts is used to get a large amount of carts.**

Operation ID: `CartScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumCartOmniumResult`](../../schemas/OmniumCartOmniumResult.md) — Success
