# Configuration

Source: https://docs.omnium.no/docs/Product/recommendations/configuration

> Tenant settings that control how Omnium filters and surfaces product recommendations.

## Recommendations settings

Recommendation behavior is controlled by `RecommendationsSettings` in your tenant configuration. These settings determine where recommendations appear in Omnium and how results are filtered.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsCartRecommendationsEnabled | bool | false | When enabled, product recommendations are shown in the cart experience in Omnium. |
| ExcludeOutOfStock | bool | false | When enabled, products with no available stock are removed from recommendation results. Off by default, because tenants that do not track inventory would otherwise have all products filtered out. A product counts as in stock when it allows backorder or has available inventory. |
| PriceBand | string | Off | Constrains related recommendations to a price range around the seed product's price. `Off` applies no price filtering, `Narrow` keeps results close to the seed price, and `Wide` allows a broader range. Applies to the `Search` endpoint's related recommendations. |

### PriceBand values

| Value | Description |
| --- | --- |
| `Off` | No price filtering. |
| `Narrow` | Keep candidates close to the seed product's price. |
| `Wide` | Allow a broad price range around the seed product's price. |

#### Sample

```
"RecommendationsSettings": {
  "IsCartRecommendationsEnabled": true,
  "ExcludeOutOfStock": false,
  "PriceBand": "Narrow"
}
```

`ExcludeOutOfStock` and `PriceBand` apply to results returned by the [Recommendations API](api-reference.md). `PriceBand` affects only related recommendations from the `Search` endpoint.
