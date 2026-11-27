# Store Categories

Source: https://docs.omnium.no/docs/Product/product-assortment/store-categories

> Automatic product assortment through store category configuration

Store categories provide an automated way to manage product assortment. Instead of manually assigning products to stores, you configure which product categories each store should carry, and Omnium automatically syncs the `StoreIds` and `MarketIds` on products.

* * *

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  Store Configuration                                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Store: "oslo-store"                                      │    │
│  │ AssortmentIncludeCategoryIds: ["electronics"]     │    │
│  │ AssortmentExcludeCategoryIds: ["restricted"]      │    │
│  │ AvailableOnMarkets: ["no"]                               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Scheduled Task: Update assortment by store categories           │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Product: "smartphone-123"                                       │
│  CategoryIds: ["electronics", "phones"]                          │
│  ──────────────────────────────────────────────────────────────│
│  Result: StoreIds = ["oslo-store"]                               │
│          MarketIds = ["no"]                                      │
└─────────────────────────────────────────────────────────────────┘
```

* * *

## Store Configuration

Each store can define which product categories to include or exclude from its assortment.

### Store Properties

| Property | Type | Description |
| --- | --- | --- |
| `assortmentIncludeCategoryIds` | List<string> | Category IDs to include in store's assortment |
| `assortmentExcludeCategoryIds` | List<string> | Category IDs to exclude from store's assortment |
| `availableOnMarkets` | List<string> | Markets where this store operates |

### Example Store Configuration

```json
{
  "id": "oslo-store",
  "name": "Oslo Flagship Store",
  "assortmentIncludeCategoryIds": [
    "electronics",
    "appliances",
    "accessories"
  ],
  "assortmentExcludeCategoryIds": [
    "online-only",
    "discontinued"
  ],
  "availableOnMarkets": ["no"]
}
```

### API: Configure Store Categories

The assortment category fields are part of the full store object, so they must be set through the store update endpoint (which takes the complete store and the `id` in the body):

```
POST /api/Stores/Update
Content-Type: application/json

{
  "id": "oslo-store",
  "assortmentIncludeCategoryIds": ["electronics", "appliances"],
  "assortmentExcludeCategoryIds": ["online-only"]
}
```

These fields are accepted and returned by the public API as `assortmentIncludeCategoryIds` and `assortmentExcludeCategoryIds`. (Internally the data model names them with "Product" in the key, but the public API omits it.)

The store patch endpoint (`PATCH /api/Stores/PatchStore`) does **not** support these fields. Use `POST /api/Stores/Update` to set store assortment categories.

* * *

## Synchronization Logic

When the scheduled task runs, it processes each product:

### Include Logic

1.  For each product with `categoryIds`
2.  Find all stores where **any** product category matches the store's include list
3.  Add those store IDs to the product's `StoreIds`
4.  Add the stores' markets to the product's `MarketIds`

### Exclude Logic

After include matching:

1.  Find stores where **any** product category matches the store's exclude list
2.  Remove those store IDs from the product's `StoreIds`
3.  Remove those stores' markets from `MarketIds`

### Example Scenario

**Store A:**

*   Include: `["electronics", "phones"]`
*   Exclude: `["restricted"]`

**Store B:**

*   Include: `["electronics"]`
*   Exclude: `["phones"]`

**Product X:**

*   Categories: `["electronics", "phones"]`

**Result:**

*   Store A: Product **included** (matches "electronics" and "phones", no exclusion match)
*   Store B: Product **excluded** (matches "electronics" but also matches excluded "phones")
*   Product X StoreIds: `["store-a"]`

* * *

## Enabling the Feature

### 1\. Enable in Tenant Settings

```json
{
  "ProductSettings": {
    "IsProductAssortmentUpdatedByStoreCategories": true
  }
}
```

### 2\. Configure Store Categories

Set include/exclude categories on each store via the API or Omnium UI.

### 3\. Run the Scheduled Task

The task runs automatically if scheduled, or can be triggered manually:

**Scheduled Task Name:** `Update assortment by store categories`

* * *

## Scheduled Task Details

The scheduled task performs the following:

1.  Loads all stores with their category configurations
2.  Iterates through all products
3.  For each product:
    *   Gets distinct category IDs
    *   Matches against store include categories
    *   Filters out store exclude categories
    *   Collects market IDs from matching stores
    *   Updates product if StoreIds or MarketIds changed
4.  Saves modified products in batches

### Recommended Schedule

Run nightly to ensure all product and store configurations remain synchronized.

* * *

## Order Action: Reallocation

Omnium also supports order-level allocation based on store categories through order actions. This enables dynamic allocation workflows where orders can be reallocated to stores based on product categories.

* * *

## API Reference

### Get Store Categories

```
GET /api/Stores/{storeId}
```

Response includes:

```json
{
  "id": "oslo-store",
  "assortmentIncludeCategoryIds": ["electronics"],
  "assortmentExcludeCategoryIds": ["online-only"]
}
```

### Update Store Categories

```
POST /api/Stores/Update
Content-Type: application/json

{
  "id": "oslo-store",
  "assortmentIncludeCategoryIds": ["electronics", "appliances"],
  "assortmentExcludeCategoryIds": []
}
```

When posting, if categories should be removed, send an empty list `[]`. Sending `null` leaves the existing categories unchanged.

* * *

## Best Practices

### Category Hierarchy

Use parent categories for broad store assignments:

*   Assign "Electronics" category to store
*   All products in "Electronics > Phones", "Electronics > Tablets" automatically included

### Exclusion Strategy

Use exclusions sparingly for:

*   Online-only products that shouldn't appear in physical stores
*   Restricted products requiring special handling
*   Discontinued items being phased out

### Testing Changes

Before enabling in production:

1.  Configure categories on a test store
2.  Run the scheduled task manually
3.  Verify expected products have correct StoreIds
4.  Check that exclusions are working correctly

### Migration from Manual Assignment

When migrating from manual StoreIds to category-based:

1.  Map existing store products to categories
2.  Configure store categories to match current assortments
3.  Enable `isProductAssortmentUpdatedByStoreCategories`
4.  Run initial sync
5.  Verify product visibility unchanged

* * *

## Combining with Other Methods

Store categories can work alongside:

| Method | Behavior |
| --- | --- |
| Direct StoreIds | Overwritten by sync task |
| Assortment Codes | Applied independently (AND logic) |
| Customer Categories | Applied on search (AND logic) |
| Price-Based | Cannot use both simultaneously |

Do not enable both `isProductAssortmentUpdatedByStoreCategories` and `isProductAssortmentUpdatedByPrices` simultaneously. They will overwrite each other's changes.

* * *

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| Product not in expected store | Category not in store's include list | Verify store's `assortmentIncludeCategoryIds` |
| Product excluded unexpectedly | Category matches store's exclude list | Check `assortmentExcludeCategoryIds` |
| Changes not reflecting | Scheduled task hasn't run | Run task manually or check schedule |
| All products removed from stores | Feature enabled but no categories configured | Configure categories before enabling |
| Product in wrong market | Store's `availableOnMarkets` incorrect | Update store's market configuration |
