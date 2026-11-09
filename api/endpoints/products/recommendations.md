# Products | Recommendations

Source: https://api.omnium.no/documentation

> Product recommendations.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Recommendations/Search`

**Get products recommendations based on products IDs, customer ID, boosted properties and/or included/excluded products properties.**

Operation ID: `RecommendationsSearchRecommendations`

**Request body:** [`OmniumSearchRecommendationsRequest`](../../schemas/OmniumSearchRecommendationsRequest.md)

**Responses:**

- 200: [`OmniumRecommendationsResult`](../../schemas/OmniumRecommendationsResult.md) — Success

---

## `POST /api/Recommendations/GetTopSellers`

**Get top selling products recommendations**

Operation ID: `RecommendationsGetTopSellingProductsRecommendations`

**Request body:** [`OmniumGetTopSellingProductsRecommendationsRequest`](../../schemas/OmniumGetTopSellingProductsRecommendationsRequest.md)

**Responses:**

- 200: [`OmniumRecommendationsResult`](../../schemas/OmniumRecommendationsResult.md) — Success
