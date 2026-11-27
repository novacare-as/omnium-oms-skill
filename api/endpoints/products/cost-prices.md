# Products | Cost Prices

Source: https://api.omnium.no/documentation

> Product cost prices.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PUT /api/CostPrices/AddMany`

Operation ID: `CostPricesPutCostPrices`

**Request body:** List<[`OmniumCostPriceUpdateRequest`](../../schemas/OmniumCostPriceUpdateRequest.md)>

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `POST /api/CostPrices/Search`

Operation ID: `CostPricesSearch`

**Request body:** [`OmniumCostPriceSearchRequest`](../../schemas/OmniumCostPriceSearchRequest.md) — The CostPriceSearchRequest contains properties for filtering cost prices

**Responses:**

- 200: [`OmniumCostPriceOmniumResult`](../../schemas/OmniumCostPriceOmniumResult.md) — Search successful, returning cost prices
- 400: string — Search request invalid

---

## `DELETE /api/CostPrices`

**Delete one or more cost prices on a product in Omnium. Will delete existing cost price if found.**

Operation ID: `CostPricesDeleteCostPrices`

**Request body:** List<[`OmniumCostPriceDeleteRequest`](../../schemas/OmniumCostPriceDeleteRequest.md)>

**Responses:**

- 204: Success
- 400: string — Bad Request
