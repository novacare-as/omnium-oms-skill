# Orders | Analytics

Source: https://api.omnium.no/documentation

> Order analytics endpoints.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/AnalyticsOrders/Search`

**Search and filtering of analytics order lines**

Operation ID: `AnalyticsOrdersSearchAnalyticsOrderLines`

**Request body:** [`OmniumAnalyticsOrderLineSearchRequest`](../../schemas/OmniumAnalyticsOrderLineSearchRequest.md)

**Responses:**

- 200: [`OmniumAnalyticsOrderLineOmniumSearchResult`](../../schemas/OmniumAnalyticsOrderLineOmniumSearchResult.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/AnalyticsOrders/SearchGrouped`

**Search for grouped analytics order lines**

Operation ID: `AnalyticsOrdersSearchOrderLinesGrouped`

**Request body:** [`OmniumAnalyticsOrderLineSearchRequest`](../../schemas/OmniumAnalyticsOrderLineSearchRequest.md)

**Responses:**

- 200: [`OmniumAnalyticsOrderLineGroupedSearchResponse`](../../schemas/OmniumAnalyticsOrderLineGroupedSearchResponse.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
