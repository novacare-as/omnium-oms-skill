# Price-Based Assortment

Source: https://docs.omnium.no/docs/Product/product-assortment/price-based-assortment

> Automatic product assortment based on price availability

Price-based assortment automatically syncs product `StoreIds`, `MarketIds`, and `MarketGroupIds` based on the store and market assignments on the product's prices. This approach is ideal when product availability is determined by pricing agreements.

* * *

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  Product Prices                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Price 1: StoreId="oslo-store", MarketId="no"            │    │
│  │          ValidFrom=2025-01-01, ValidUntil=null          │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ Price 2: StoreId="stockholm-store", MarketId="se"       │    │
│  │          ValidFrom=2025-01-01, ValidUntil=null          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Scheduled Task: Update assortment by prices                     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Product Updated:                                                │
│  StoreIds = ["oslo-store", "stockholm-store"]                   │
│  MarketIds = ["no", "se"]                                        │
└─────────────────────────────────────────────────────────────────┘
```

* * *

## Price Model

Prices contain store and market context that drives assortment:

| Property | Type | Description |
| --- | --- | --- |
| `storeId` | string | Specific store for this price |
| `storeGroupId` | string | Group of stores |
| `marketId` | string | Market for this price |
| `marketGroupId` | string | Market group |
| `validFrom` | DateTime | When price becomes active |
| `validUntil` | DateTime? | When price expires |

### Example Prices

```json
{
  "prices": [
    {
      "unitPrice": 999.00,
      "currencyCode": "NOK",
      "storeId": "oslo-store",
      "marketId": "no",
      "validFrom": "2025-01-01T00:00:00Z",
      "validUntil": null
    },
    {
      "unitPrice": 899.00,
      "currencyCode": "SEK",
      "storeId": "stockholm-store",
      "marketId": "se",
      "validFrom": "2025-01-01T00:00:00Z",
      "validUntil": null
    }
  ]
}
```

* * *

## Synchronization Logic

Omnium extracts store and market information from valid prices on products and their variants.

### Validity Rules

A price is considered valid when:

*   `validFrom` is null OR `validFrom <= now`
*   `validUntil` is null OR `validUntil > now`

### Extraction Process

For each product:

1.  Iterate through all prices on the product
2.  For each currently valid price, collect the `storeId` and `marketId`
3.  Repeat for all variant prices
4.  Combine into distinct lists of store and market IDs

### Store Category Exclusions

Even with price-based assortment, store category exclusions still apply:

1.  Extract storeIds from valid prices
2.  Check if product categories match any store's `AssortmentExcludeProductCategoryIds`
3.  Remove excluded stores from the final storeIds list

* * *

## Enabling the Feature

### 1\. Enable in Tenant Settings

```json
{
  "ProductSettings": {
    "IsProductAssortmentUpdatedByPrices": true
  }
}
```

### 2\. Ensure Prices Have Store/Market Data

When creating or importing prices, include store and market information:

```
PUT /api/Prices/AddMany
Content-Type: application/json

[
  {
    "productId": "product-123",
    "prices": [
      {
        "unitPrice": 999.00,
        "currencyCode": "NOK",
        "storeId": "oslo-store",
        "marketId": "no",
        "validFrom": "2025-01-01T00:00:00Z"
      }
    ]
  }
]
```

### 3\. Run the Scheduled Task

**Scheduled Task Name:** `Update assortment by prices`

* * *

## Scheduled Task Details

The scheduled task performs:

1.  Loads all stores (for category exclusion checking)
2.  Iterates through all products
3.  For each product:
    *   Extracts StoreIds from currently valid prices
    *   Extracts MarketIds from currently valid prices
    *   Derives MarketGroupIds from MarketIds
    *   Applies store category exclusions
    *   Updates product if any IDs changed
4.  Saves modified products in batches

* * *

## Dynamic Availability

Price-based assortment enables dynamic product availability:

### Scenario: Timed Launch

Product available in Norway starting February 1st:

```json
{
  "prices": [
    {
      "storeId": "oslo-store",
      "marketId": "no",
      "validFrom": "2025-02-01T00:00:00Z",
      "validUntil": null
    }
  ]
}
```

**Before Feb 1:** Product not in oslo-store assortment **After Feb 1:** Product appears in oslo-store assortment

### Scenario: Limited Time Sale

Price valid only during promotional period:

```json
{
  "prices": [
    {
      "storeId": "sale-store",
      "validFrom": "2025-01-15T00:00:00Z",
      "validUntil": "2025-01-31T23:59:59Z"
    }
  ]
}
```

Product automatically leaves sale-store assortment when price expires.

* * *

## Market Groups

MarketGroupIds are derived from MarketIds through tenant configuration. A market group is defined with a `groupId` and `groupName`, and each market is linked to a group through its own `marketGroupId`:

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

When a product has prices for markets "no" and "se", its `MarketGroupIds` will include "nordic".

* * *

## Variant Prices

Prices on variants are included in the calculation:

```json
{
  "id": "product-123",
  "variants": [
    {
      "variantId": "variant-small",
      "prices": [
        { "storeId": "store-a", "marketId": "no" }
      ]
    },
    {
      "variantId": "variant-large",
      "prices": [
        { "storeId": "store-b", "marketId": "se" }
      ]
    }
  ]
}
```

**Result:** Product gets `StoreIds = ["store-a", "store-b"]`, `MarketIds = ["no", "se"]`

* * *

## Price Filtering Priority

When displaying products, store-specific prices take priority:

1.  **Store-specific price** (highest priority)
2.  **Market-level price** (no storeId)
3.  **Generic price** (no storeId or marketId)

This ensures customers see the most relevant price for their context.

* * *

## Best Practices

### Price Data Quality

Ensure prices have complete store/market information:

*   Always specify `storeId` for store-specific pricing
*   Always specify `marketId` for market-level pricing
*   Use `validFrom` and `validUntil` for temporal pricing

### Separate vs Embedded Prices

| Model | Best For |
| --- | --- |
| Embedded (on product) | Simple pricing, few price variants |
| Separate | Complex pricing, many stores/markets |

For price-based assortment with many stores, use separate prices (`hasSeparatePrices: true`).

### Combining with Exclusions

Price-based assortment respects store category exclusions:

*   Use exclusions for products that shouldn't appear in certain stores regardless of pricing
*   Useful for compliance or channel restrictions

* * *

## Comparison: Prices vs Categories

| Aspect | Price-Based | Category-Based |
| --- | --- | --- |
| Configuration | Prices contain store/market | Stores contain categories |
| Trigger | Price changes | Category changes |
| Granularity | Per-product | Per-category |
| Best for | Price-driven availability | Category-driven assortment |
| Temporal control | Built-in (ValidFrom/ValidUntil) | Manual |

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Product not in store | No valid price with that storeId | Add price with storeId and valid dates |
| Product appeared then disappeared | Price expired (ValidUntil passed) | Extend or create new price |
| Store excluded despite price | Category exclusion on store | Check store's `assortmentExcludeProductCategoryIds` |
| Variant not in assortment | Variant has no prices with storeId | Add prices to variant |
| MarketGroupId not set | MarketId not in any market group | Configure market groups in tenant settings |
