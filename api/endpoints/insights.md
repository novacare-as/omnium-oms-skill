# Insights

Source: https://api.omnium.no/documentation

> Aggregated daily KPIs for analytics partners.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Insights/Orders`

**Daily order statistics per store: counts, delivery-type splits, revenue (incl. and excl. VAT), and orders-by-status.**

Operation ID: `InsightsGetOrders`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsOrderDailyResponse`](../schemas/OmniumInsightsOrderDailyResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error

---

## `POST /api/Insights/Products`

**Daily product sales per store, grouped by top-level category. Returns the top 20 SKUs per category by revenue.**

Operation ID: `InsightsGetProducts`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsProductDailyResponse`](../schemas/OmniumInsightsProductDailyResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error

---

## `POST /api/Insights/Projects/Activity`

**Daily project transitions per store and project type (new, completed, cancelled, estimated value).**

Operation ID: `InsightsGetProjectsActivity`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsProjectActivityDailyResponse`](../schemas/OmniumInsightsProjectActivityDailyResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error

---

## `POST /api/Insights/Projects/InProgress`

**Current snapshot of projects in progress (non-terminal status) created within the date window. Not a daily series.**

Operation ID: `InsightsGetProjectsInProgress`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsProjectInProgressResponse`](../schemas/OmniumInsightsProjectInProgressResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error

---

## `POST /api/Insights/Loyalty/Orders`

**Daily order statistics per store split by customer-club membership (member vs non-member). Guest orders count as non-member.**

Operation ID: `InsightsGetLoyaltyOrders`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsLoyaltyOrderDailyResponse`](../schemas/OmniumInsightsLoyaltyOrderDailyResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error

---

## `POST /api/Insights/Loyalty/Members`

**Daily new customer-club registrations per store, based on MemberSince.**

Operation ID: `InsightsGetLoyaltyMembers`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsLoyaltyMemberDailyResponse`](../schemas/OmniumInsightsLoyaltyMemberDailyResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error

---

## `POST /api/Insights/Returns`

**Daily return statistics per store: return count, pro-rated return value, and return rate against orders created on the same day.**

Operation ID: `InsightsGetReturns`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsReturnDailyResponse`](../schemas/OmniumInsightsReturnDailyResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error

---

## `POST /api/Insights/Promotions`

**Daily promotion redemption statistics per store. DiscountValue covers only single-promotion order lines; DiscountValueCoverage reports the coverage ratio.**

Operation ID: `InsightsGetPromotions`

**Request body:** [`OmniumInsightsRequest`](../schemas/OmniumInsightsRequest.md)

**Responses:**

- 200: List<[`OmniumInsightsPromotionDailyResponse`](../schemas/OmniumInsightsPromotionDailyResponse.md)> — Success
- 400: string — Bad Request
- 503: string — Server Error
