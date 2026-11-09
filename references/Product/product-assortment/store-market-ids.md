# Store and Market IDs

Source: https://docs.omnium.no/docs/Product/product-assortment/store-market-ids

> Direct product assignment to stores, markets, and market groups

The most direct way to control product assortment is through the `StoreIds`, `MarketIds`, and `MarketGroupIds` properties on products. These properties explicitly define where a product is available.

* * *

## Product Properties

| Property | Type | Description |
| --- | --- | --- |
| `storeIds` | List<string> | Store IDs where this product is available |
| `marketIds` | List<string> | Market IDs where this product is available |
| `marketGroupIds` | List<string> | Market group IDs where this product is available |

### Example Product

```json
{
  "id": "product-123_no",
  "productId": "product-123",
  "name": "Premium Headphones",
  "storeIds": ["oslo-store", "bergen-store", "stockholm-store"],
  "marketIds": ["no", "se"],
  "marketGroupIds": ["nordic"]
}
```

* * *

## How Filtering Works

When a product search is performed, Omnium applies store/market filters based on the search context.

### Store ID Filtering

```
Search Request: storeId = "oslo-store"
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  If isAssortmentStoreIdRequired = false (default):              │
│  ✓ Products with "oslo-store" in storeIds                       │
│  ✓ Products with empty/null storeIds (available everywhere)    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  If isAssortmentStoreIdRequired = true:                         │
│  ✓ Products with "oslo-store" in storeIds ONLY                  │
│  ✗ Products without storeIds are excluded                       │
└─────────────────────────────────────────────────────────────────┘
```

### Market ID Filtering

The same logic applies to markets:

*   **Without `requireProductMarket`**: Products without marketIds are considered "global" and appear in all markets
*   **With `requireProductMarket`**: Products must have a matching marketId

### Market Group Filtering

Market groups provide a higher-level grouping (e.g., "Nordic" contains markets "no", "se", "dk", "fi"). A group is defined with a `groupId` and `groupName`, and each market references the group through its own `marketGroupId`:

```json
{
  "marketGroups": [
    {
      "groupId": "nordic",
      "groupName": "Nordic"
    }
  ],
  "markets": [
    { "marketId": "no", "marketGroupId": "nordic" },
    { "marketId": "se", "marketGroupId": "nordic" },
    { "marketId": "dk", "marketGroupId": "nordic" },
    { "marketId": "fi", "marketGroupId": "nordic" }
  ]
}
```

* * *

## API Operations

### Assign Product to Stores

```
PATCH /api/Products/{productId}
Content-Type: application/json

{
  "storeIds": ["oslo-store", "bergen-store"],
  "marketIds": ["no"]
}
```

### Add to Existing Stores

To add stores without removing existing ones, first read the product, then update:

```
GET /api/Products/{productId}

// Response includes current storeIds: ["oslo-store"]

PATCH /api/Products/{productId}
{
  "storeIds": ["oslo-store", "bergen-store"]  // Include existing + new
}
```

### Remove from All Stores

Set to empty array to make product globally available (when `isAssortmentStoreIdRequired` is false):

```
PATCH /api/Products/{productId}
{
  "storeIds": []
}
```

* * *

## Configuration Settings

Configure these settings in **Configuration → Settings → Products**:

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `isAssortmentStoreIdRequired` | bool | false | When true, products without storeIds are not visible |
| `requireProductMarket` | bool | false | When true, products must have at least one marketId |
| `requireStoreIdsForAccess` | bool | null | When true, users can only view products assigned to their stores |

### Sample Configuration

```json
{
  "ProductSettings": {
    "IsAssortmentStoreIdRequired": true,
    "RequireProductMarket": true
  }
}
```

* * *

## Automatic Assignment

While StoreIds/MarketIds can be set manually, Omnium also supports automatic assignment through:

1.  **Store Categories**: When `isProductAssortmentUpdatedByStoreCategories` is enabled
2.  **Prices**: When `isProductAssortmentUpdatedByPrices` is enabled

See [Store Categories](store-categories.md) and [Price-Based Assortment](price-based-assortment.md) for details.

* * *

## Search Request Parameters

When searching products, you can filter by store/market:

| Parameter | Type | Description |
| --- | --- | --- |
| `storeId` | string | Filter by single store |
| `marketId` | string | Filter by single market |
| `marketGroupId` | string | Filter by market group |
| `marketIds` | List<string> | Filter by multiple markets |

### Example Search

```
POST /api/Products/SearchProducts
Content-Type: application/json

{
  "storeId": "oslo-store",
  "marketId": "no",
  "query": "headphones"
}
```

* * *

## Inheritance and Variants

Store/Market assignments on parent products are **not** automatically inherited by variants. Each variant can have its own assignments if needed, but typically these are managed at the product level.

* * *

## Best Practices

### When to Use Direct Assignment

*   **Small product catalogs** with simple store structures
*   **Manual curation** of store assortments
*   **One-off products** that need specific store availability

### When to Use Automatic Assignment

*   **Large catalogs** where manual management is impractical
*   **Category-driven assortment** where stores carry certain categories
*   **Price-driven availability** where products appear where they're priced

### Global vs Store-Specific Products

| Scenario | StoreIds | isAssortmentStoreIdRequired |
| --- | --- | --- |
| Product available everywhere | `[]` or `null` | false |
| Product in specific stores only | `["store-1", "store-2"]` | false or true |
| Strict store assignment | `["store-1"]` | true |

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Product not visible in any store | `isAssortmentStoreIdRequired` is true but product has no storeIds | Add storeIds or disable setting |
| Product visible in wrong store | StoreIds not correctly set | Verify storeIds array on product |
| Market filter not working | Product has no marketIds and `requireProductMarket` is false | Add marketIds or enable setting |
| User can't see products | `requireStoreIdsForAccess` enabled | Ensure user has access to product's stores |
