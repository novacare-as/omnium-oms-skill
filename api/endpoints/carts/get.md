# Carts | Get

Source: https://api.omnium.no/documentation

> Contains endpoints for getting items to carts.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Cart/{cartId}`

**Get cart by ID**

Operation ID: `CartGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart found and is returned
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Cart does not exist

---

## `GET /api/Cart/GetCartsByCustomer`

**Get carts by customer ID**

Operation ID: `CartGetCartsByCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | Yes |  |

**Responses:**

- 200: [`OmniumCartOmniumSearchResult`](../../schemas/OmniumCartOmniumSearchResult.md) — Carts for customer is returned
- 400: string — Bad Request

---

## `GET /api/Cart/GetCarts`

**Returns a list of carts, support paging**

Operation ID: `CartGetCarts`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeIds` | query | List<string> | No | List of store IDs |
| `changedSince` | query | string (date-time) | No | Filter on changed date(UTC) |
| `pageSize` | query | integer (int32) | No | Max 100. Minimum 1.(default is 20) |
| `page` | query | integer (int32) | No | Current page of the search request. Minimum 1(default is 1) |

**Responses:**

- 200: [`OmniumCartOmniumSearchResult`](../../schemas/OmniumCartOmniumSearchResult.md) — Carts is returned
- 400: string — Bad Request
