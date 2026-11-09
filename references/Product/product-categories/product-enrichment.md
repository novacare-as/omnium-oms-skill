# Product Category Enrichment

Source: https://docs.omnium.no/docs/Product/product-categories/product-enrichment

> How Omnium enriches products with category data, parent category population, and the sync scheduled task.

Product category enrichment is the process of populating products with full category data based on their assigned category IDs. This page explains how enrichment works and how to configure it.

* * *

## How Enrichment Works

Products store category assignments in two properties:

| Property | Type | Description |
| --- | --- | --- |
| `categoryIds` | List<string> | Raw list of assigned category IDs |
| `productCategories` | List<ProductCategory> | Enriched category objects with names, descriptions, etc. |

When enrichment is enabled (`isProductCategoryEnriched: true`), Omnium automatically populates `productCategories` based on `categoryIds` during product save operations.

### Before Enrichment

```json
{
  "productId": "shirt-001",
  "categoryIds": ["mens-shirts", "casual"],
  "productCategories": []
}
```

### After Enrichment

```json
{
  "productId": "shirt-001",
  "categoryIds": ["mens-shirts", "casual"],
  "productCategories": [
    {
      "categoryId": "mens-shirts",
      "name": "Men's Shirts",
      "description": "All men's shirts",
      "parentId": "mens-clothing"
    },
    {
      "categoryId": "casual",
      "name": "Casual",
      "description": "Casual wear",
      "parentId": "styles"
    }
  ]
}
```

* * *

## Parent Category Population

When `isProductCategoryParentsAdded` is enabled, products automatically receive all ancestor categories in addition to their directly assigned categories.

### Configuration

```
"ProductSettings": {
  "IsProductCategoryParentsAdded": true,
  "RootCategoryId": "catalog"
}
```

### How It Works

Given this category hierarchy:

```
Catalog (catalog) - root
└── Clothing (clothing)
    └── Men (mens-clothing)
        └── Shirts (mens-shirts)
```

A product assigned to `mens-shirts` will receive:

*   `mens-shirts` (directly assigned)
*   `mens-clothing` (parent)
*   `clothing` (grandparent)

The root category (`catalog`) is **not** added to products.

### Example Result

```json
{
  "categoryIds": ["mens-shirts", "mens-clothing", "clothing"],
  "productCategories": [
    { "categoryId": "mens-shirts", "name": "Shirts", "parentId": "mens-clothing" },
    { "categoryId": "mens-clothing", "name": "Men", "parentId": "clothing" },
    { "categoryId": "clothing", "name": "Clothing", "parentId": "catalog" }
  ]
}
```

Parent population ensures products appear in category listings at every level of the hierarchy. A shirt will show up when browsing "Shirts", "Men", or "Clothing".

* * *

## Invalid Category Cleanup

When `isNonexistentCategoryIdsRemoved` is enabled, category IDs that reference categories that don't exist are automatically removed from products.

### Configuration

```
"ProductSettings": {
  "IsNonexistentCategoryIdsRemoved": true
}
```

### When This Happens

*   During product save
*   During scheduled sync task execution

### Use Cases

*   After bulk category deletions
*   After data migrations
*   When categories are renamed (changing their ID)

Enable this setting carefully. Once a category ID is removed from a product, you'll need to re-assign it manually if the category is later created.

* * *

## Sync Scheduled Task

The `UpdateProductCategoriesScheduledTask` synchronizes category data across all products.

### What It Does

1.  Iterates through all **active** products
2.  For each product:
    *   Removes duplicate category IDs
    *   Adds missing parent categories (if enabled)
    *   Enriches `productCategories` from `categoryIds` (if enabled)
    *   Removes non-existent category IDs (if enabled)
    *   Syncs the main category name
3.  Saves modified products in batches (default: 100 products per batch)

### Configuration

Enable the task in tenant scheduled task settings:

```json
{
  "scheduledTasks": [
    {
      "name": "UpdateProductCategoriesScheduledTask",
      "isActive": true,
      "interval": "0 0 4 * * *"
    }
  ]
}
```

The example runs daily at 4:00 AM.

### When to Run

Run this task:

*   After enabling `isProductCategoryEnriched` for the first time
*   After enabling `isProductCategoryParentsAdded` for the first time
*   After bulk category structure changes
*   After data migrations or imports

### Manual Execution

Run the task manually from **Configuration → Settings → Integrations → Scheduled tasks → UpdateProductCategoriesScheduledTask → Run Now**.

* * *

## Processing Details

### Active Products Only

Enrichment sync only processes products where `isActive = true`. Inactive products retain their existing category data.

### Batch Processing

Products are processed and saved in configurable batches to handle large catalogs:

*   Default batch size: 100 products
*   Adjustable based on tenant configuration and performance needs

### Language Handling

Enrichment uses language-specific category data. Products receive category objects matching their `language` property:

```json
{
  "productId": "shirt-001",
  "language": "en",
  "categoryIds": ["mens-shirts"],
  "productCategories": [
    {
      "categoryId": "mens-shirts",
      "name": "Men's Shirts",  // English name
      "language": "en"
    }
  ]
}
```

### Main Category Sync

If a product has a `mainCategoryId` set, the enrichment process:

*   Ensures the main category is included in `categoryIds`
*   Populates `mainCategoryName` from the category's name

* * *

## Performance Considerations

**Large Catalogs**

For catalogs with many products (100,000+), consider:

*   Running the sync task during off-peak hours
*   Starting with a subset of products to verify configuration
*   Monitoring task execution time and resource usage

### Caching

Category data is cached to improve enrichment performance:

*   Categories are loaded once and cached for 60 minutes
*   Cache is invalidated when categories are modified
*   Per-language category dictionaries are also cached

### When Enrichment Occurs

Enrichment happens:

*   During `UpdateProductCategoriesScheduledTask` execution
*   During `SyncProductCategories` service calls
*   When products are saved through certain workflows

Enrichment does **not** automatically occur on every product save - it depends on the code path and configuration.

* * *

## Related Settings

| Setting | Effect on Enrichment |
| --- | --- |
| `isProductCategoryEnriched` | Enables populating `productCategories` from `categoryIds` |
| `isProductCategoryParentsAdded` | Enables adding ancestor categories |
| `isNonexistentCategoryIdsRemoved` | Enables removing invalid category IDs |
| `rootCategoryId` | Defines which category is excluded from parent population |

See [Configuration](configuration.md) for complete settings reference.
