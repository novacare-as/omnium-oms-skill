# API Reference

Source: https://docs.omnium.no/docs/Product/recommendations/api-reference

> Endpoints, request and response models for the Omnium Recommendations API.

The Recommendations API exposes two endpoints. Both return the same result shape.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/Recommendations/Search` | Related recommendations for one or more seed products, a cart, or a customer. |
| `POST` | `/api/Recommendations/GetTopSellers` | Best-selling products over a period, optionally scoped by store, market, or category. |

Both endpoints require an API user with product read access.

## Search

Returns products related to the supplied seeds, ordered by `score` descending. A response contains up to 5 recommendations. See [How related recommendations are built](../recommendations.md) for the seeding, exclusion, personalization, and filtering rules applied.

### Request

| Field | Type | Description |
| --- | --- | --- |
| `productIds` | array | Seed product IDs to base recommendations on. Up to 250. |
| `cartId` | string | A cart ID. When set, the cart's line items seed the recommendations if `productIds` is empty, products in the cart are excluded from results, and the cart's store and market scope the results. |
| `customerId` | string | A customer ID. When set, products the customer has already purchased are excluded, and results are re-ranked toward the customer's purchased categories and brands. |
| `storeIds` | array | Limit recommendations to these stores. Up to 1000. If omitted, the stores available to your API user are used. When a `cartId` is supplied and `storeIds` is omitted, the cart's store is used. |

At least one seed is required — either `productIds`, or a `cartId` whose cart contains line items. A request with no resolvable seed returns an empty result.

```json
{
  "productIds": ["100123"],
  "customerId": "cust-4471",
  "storeIds": ["oslo-001"]
}
```

### Response

| Field | Type | Description |
| --- | --- | --- |
| `recommendations` | array | The recommended products, ordered by `score` descending. Up to 5. |

Each item in `recommendations`:

| Field | Type | Description |
| --- | --- | --- |
| `product` | object | The recommended product, as a product list item. |
| `recommendedId` | string | The product or SKU ID that was recommended. |
| `score` | number | Relative relevance score. Higher is stronger. Comparable only within this response. |

```json
{
  "recommendations": [
    {
      "recommendedId": "100987",
      "score": 1.42,
      "product": {
        "id": "100987",
        "name": "Trail Running Socks",
        "listPrice": 199.0
      }
    },
    {
      "recommendedId": "100654",
      "score": 1.18,
      "product": {
        "id": "100654",
        "name": "Merino Base Layer",
        "listPrice": 549.0
      }
    }
  ]
}
```

## GetTopSellers

Returns the best-selling products since a given date, ranked by sales. A response contains up to 10 products.

### Request

| Field | Type | Description |
| --- | --- | --- |
| `since` | datetime | Count sales from this date and time (UTC). |
| `storeIds` | array | Limit to these stores. Up to 1000. If omitted, the stores available to your API user are used. |
| `marketIds` | array | Limit to these markets. Up to 250. |
| `categoryIDs` | array | Limit to products in these categories. Up to 250. |
| `includeProductData` | bool | When `true`, each result includes full product data. When `false`, results include only `recommendedId` and `score`, and `product` is `null`. |

```json
{
  "since": "2026-01-01T00:00:00Z",
  "storeIds": ["oslo-001"],
  "includeProductData": true
}
```

### Response

The response uses the same shape as [Search](api-reference.md#search). For top sellers, `score` reflects relative sales volume over the period.

When `includeProductData` is `false`, `product` is omitted:

```json
{
  "recommendations": [
    { "recommendedId": "100987", "score": 540.0, "product": null },
    { "recommendedId": "100654", "score": 512.0, "product": null }
  ]
}
```

* * *

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html) under the **Products | Recommendations** tag.
