# OmniumSearchRecommendationsRequest

**Fields:**

- `productIds`: List<string>, nullable, max length 250
- `skuIds`: List<string>, nullable, max length 250
- `cartId`: string, nullable
- `customerId`: string, nullable
- `storeIds`: List<string>, nullable, max length 1000
- `boostedProperties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250
- `excludedProperties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250
- `includedProperties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250

**Used directly by endpoints in:**

- [Products | Recommendations](../endpoints/products/recommendations.md)
