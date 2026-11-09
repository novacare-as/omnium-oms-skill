# OmniumGetTopSellingProductsRecommendationsRequest

**Fields:**

- `since`: string (date-time)
- `storeIds`: List<string>, nullable, max length 1000
- `marketIds`: List<string>, nullable, max length 250
- `includeProductData`: boolean
- `isInStockRequired`: boolean
- `categoryIDs`: List<string>, nullable, max length 250 — Optional category filter. When set, top sellers are ranked by the precomputed product popularity index (sales over the popularity window, scoped to the first Omnium.Public.Recommendations.Models.OmniumGetTopSellingProductsRecommendationsRequest.MarketIds entry or global) rather than by Omnium.Public.Recommendations.Models.OmniumGetTopSellingProductsRecommendationsRequest.Since, which does not apply to category-filtered queries. Requires the popularity index to be populated for the tenant.

**Used directly by endpoints in:**

- [Products | Recommendations](../endpoints/products/recommendations.md)
