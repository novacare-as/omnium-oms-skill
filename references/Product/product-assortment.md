# Product Assortment

Source: https://docs.omnium.no/docs/Product/product-assortment

> Complete guide to controlling product visibility across stores, markets, and customers in Omnium

Product assortment in Omnium controls which products are visible and purchasable in different contexts - stores, markets, and for specific customers. This guide covers all the mechanisms available for managing product assortment.

* * *

## Overview

Omnium provides multiple complementary mechanisms for controlling product assortment:

| Mechanism | Description | Use Case |
| --- | --- | --- |
| [Store/Market/Market Group IDs](product-assortment/store-market-ids.md) | Direct assignment of products to stores and markets | Simple, direct product-to-store mapping |
| [Assortment Codes](product-assortment/assortment-codes.md) | Time-based assortment groupings | Seasonal assortments, customer-specific catalogs |
| [Store Categories](product-assortment/store-categories.md) | Automatic assignment based on product categories | Category-driven store assortment |
| [Price-Based Assortment](product-assortment/price-based-assortment.md) | Automatic assignment based on price availability | Price-driven product visibility |
| [Customer Categories](product-assortment/customer-categories.md) | Customer-specific category restrictions | B2B customer catalogs |
| [Additional Controls](product-assortment/additional-controls.md) | IsActive, dates, inventory, and other flags | Fine-grained visibility control |

* * *

## How Assortment Works

When a user searches for products, Omnium applies multiple filters to determine which products are visible:

```
Product Search Request
        │
        ▼
┌───────────────────────────────────┐
│  1. Store/Market ID Filtering     │ ← Products must match store/market context
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  2. Assortment Code Filtering     │ ← If customer has assortment codes
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  3. Category Filtering            │ ← Customer include/exclude categories
└───────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────┐
│  4. IsActive/Date/Status Filters  │ ← Publication and availability
└───────────────────────────────────┘
        │
        ▼
    Search Results
```

* * *

## Key Product Properties

Products have several properties that control their assortment:

```json
{
  "storeIds": ["store-001", "store-002"],
  "marketIds": ["no", "se"],
  "marketGroupIds": ["nordic"],
  "categoryIds": ["electronics", "phones"],
  "assortmentCodes": [
    {
      "assortmentCodeId": "retail",
      "validFrom": "2025-01-01T00:00:00Z",
      "validTo": null
    }
  ],
  "isActive": true,
  "published": "2025-01-01T00:00:00Z",
  "stopPublished": null
}
```

* * *

## Configuration Settings

Assortment behavior is controlled through tenant settings under **Configuration → Settings → Products**:

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `isAssortmentStoreIdRequired` | bool | false | Products must have matching store IDs to be visible |
| `isAssortmentCodesRequired` | bool | false | Products must have matching assortment codes |
| `isMultipleAssortmentCodesAllowed` | bool | false | Products can have multiple assortment codes |
| `requireProductMarket` | bool | false | Products must be assigned to a market |
| `isProductAssortmentUpdatedByPrices` | bool | false | Auto-sync assortment from prices |
| `isProductAssortmentUpdatedByStoreCategories` | bool | false | Auto-sync assortment from store categories |

Only enable one of `isProductAssortmentUpdatedByPrices` or `isProductAssortmentUpdatedByStoreCategories` at a time. They represent mutually exclusive approaches to automatic assortment management.

* * *

## Scheduled Tasks

Omnium provides scheduled tasks to keep product assortment synchronized:

| Task | Description |
| --- | --- |
| **Update assortment by store categories** | Syncs product StoreIds/MarketIds based on store category configurations |
| **Update assortment by prices** | Syncs product StoreIds/MarketIds based on price store/market assignments |

These tasks can be configured to run nightly or as needed through the Omnium scheduled tasks interface.

* * *

## Quick Start

### Scenario 1: Simple Store Assignment

For basic store-specific products, directly assign store IDs:

```
PATCH /api/Products/{productId}
{
  "storeIds": ["store-001", "store-002"],
  "marketIds": ["no"]
}
```

### Scenario 2: Category-Based Assortment

1.  Configure categories on stores in **Settings → Stores**
2.  Enable `isProductAssortmentUpdatedByStoreCategories` in tenant settings
3.  Assign categories to products - store assignments happen automatically

### Scenario 3: Customer-Specific Catalog

1.  Set `AssortmentIncludeCategoryIds` on the customer
2.  When the customer searches, only products in those categories are visible

* * *

## Feature Overview

| Feature | Documentation |
| --- | --- |
| **Store/Market IDs** | Direct store and market assignment |
| **Assortment Codes** | Time-based assortment groupings |
| **Store Categories** | Automatic assignment via categories |
| **Price-Based** | Assignment based on price availability |
| **Customer Categories** | B2B customer restrictions |
| **Additional Controls** | IsActive, dates, inventory flags |

* * *

## Best Practices

### Choose the Right Approach

1.  **Small catalog, few stores**: Use direct StoreIds/MarketIds assignment
2.  **Category-driven assortment**: Use store categories with automatic sync
3.  **Price-driven availability**: Use price-based assortment sync
4.  **B2B with customer catalogs**: Use customer assortment codes and categories
5.  **Seasonal/temporal products**: Use assortment codes with validity dates

### Performance Considerations

*   Avoid combining multiple automatic sync methods
*   Run sync scheduled tasks during off-peak hours
*   For large catalogs, prefer category-based assignment over direct assignment

### Common Patterns

**Multi-store Retail:**

*   Configure categories per store
*   Enable `isProductAssortmentUpdatedByStoreCategories`
*   Products automatically appear in stores matching their categories

**B2B with Customer Tiers:**

*   Define assortment codes for each tier (e.g., "bronze", "silver", "gold")
*   Assign assortment codes to customers and products
*   Enable `isAssortmentCodesRequired`

**Omnichannel:**

*   Use MarketIds for online/offline separation
*   Use StoreIds for location-specific inventory
*   Use assortment codes for promotional groupings

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Product not appearing in store | Missing StoreId or `isAssortmentStoreIdRequired` enabled | Add store ID to product or check settings |
| Customer can't see product | Customer has assortment restrictions | Check customer's AssortmentIncludeCategoryIds |
| Product visible when it shouldn't be | Multiple assortment mechanisms may conflict | Review all assortment properties on the product |
| Sync not working | Scheduled task not running or wrong setting enabled | Verify scheduled task status and settings |
| Date-based assortment not updating | ValidFrom/ValidTo not being checked | Ensure product uses correct date fields |
