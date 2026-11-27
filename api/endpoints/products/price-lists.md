# Products | Price Lists

Source: https://api.omnium.no/documentation

> Product price list information.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/PriceLists/{id}`

**Get price list**

Operation ID: `PriceListsGetPriceList`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The id of the price list |

**Responses:**

- 200: [`OmniumPriceList`](../../schemas/OmniumPriceList.md) — Success
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `DELETE /api/PriceLists/{id}`

**Delete a price list and the corresponding price list items**

Operation ID: `PriceListsDeletePriceList`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The id of the price list to delete |

**Responses:**

- 200: Success

---

## `POST /api/PriceLists/SearchPriceLists`

**Search price lists**

Operation ID: `PriceListsSearchPriceLists`

**Request body:** [`OmniumPriceListSearchRequest`](../../schemas/OmniumPriceListSearchRequest.md) — Price list search request

**Responses:**

- 200: [`OmniumPriceListOmniumSearchResult`](../../schemas/OmniumPriceListOmniumSearchResult.md) — Success
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Bad Request
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `POST /api/PriceLists/AddPriceList`

**Add price list, if a priceList with the same ID already exists, it will be updated.**

Operation ID: `PriceListsAddPriceList`

**Request body:** [`OmniumPriceList`](../../schemas/OmniumPriceList.md)

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `POST /api/PriceLists/ActivatePriceList/{priceListId}`

**Activate price list. Will create product prices for all items in the price list.**

Operation ID: `PriceListsActivatePriceList`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `priceListId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumPriceList`](../../schemas/OmniumPriceList.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/PriceLists/DeactivatePriceList/{priceListId}`

**Deactivate price list. Will remove product prices for all items in the price list.**

Operation ID: `PriceListsDeactivatePriceList`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `priceListId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumPriceList`](../../schemas/OmniumPriceList.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/PriceLists/ValidatePriceList/{priceListId}`

**Enqueue a validation run for the price list. Validators configured for the tenant are run sequentially across all items, and per-item validation errors are persisted on each item's Errors list. Returns immediately with Status set to "Validating"; poll GetPriceList to observe completion.**

Operation ID: `PriceListsValidatePriceList`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `priceListId` | path | string | Yes |  |

**Responses:**

- 200: [`OmniumPriceList`](../../schemas/OmniumPriceList.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
