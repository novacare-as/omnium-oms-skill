# Category Configuration

Source: https://docs.omnium.no/docs/Product/product-categories/configuration

> Configure product category settings in Omnium tenant settings including root categories, automatic enrichment, and caching options.

Product category behavior is controlled through tenant settings under **Configuration → Settings → Products**. This page covers all category-related configuration options.

* * *

## Category Settings

These settings control how categories are structured and how products interact with them.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `rootCategoryId` | string | null | The ID of the root/top-level category for the tenant's catalog. Categories outside this hierarchy may not appear in navigation. |
| `seasonCategoryId` | string | null | Parent category ID for automatically created season categories. Required for the [season scheduled task](automatic-categories.md#season-categories). |
| `brandCategoryId` | string | null | Parent category ID for automatically created brand categories. Required for the [brand scheduled task](automatic-categories.md#brand-categories). |
| `isProductCategoryParentsAdded` | bool | false | When enabled, ancestor categories are automatically added to products when a child category is assigned. |
| `isProductCategoryEnriched` | bool | false | When enabled, products are enriched with full category objects (names, descriptions) in the `productCategories` property. |
| `isNonexistentCategoryIdsRemoved` | bool | false | When enabled, category IDs referencing non-existent categories are automatically removed from products during save. |
| `separateRootCategoryColors` | bool | false | UI styling option that allows different colors for each root category in the Omnium interface. |

### Sample Configuration

```
"ProductSettings": {
  "RootCategoryId": "catalog",
  "SeasonCategoryId": "seasons",
  "BrandCategoryId": "brands",
  "IsProductCategoryParentsAdded": true,
  "IsProductCategoryEnriched": true,
  "IsNonexistentCategoryIdsRemoved": true,
  "SeparateRootCategoryColors": false
}
```

* * *

## Understanding Parent Category Addition

When `isProductCategoryParentsAdded` is enabled, assigning a product to a child category automatically includes all ancestor categories.

**Example:**

Category hierarchy:

```
Clothing (clothing)
└── Men (men)
    └── Shirts (shirts)
```

Assigning a product to "Shirts":

*   **Without** `isProductCategoryParentsAdded`: `categoryIds = ["shirts"]`
*   **With** `isProductCategoryParentsAdded`: `categoryIds = ["shirts", "men", "clothing"]`

This ensures products appear in parent category listings without manual assignment. A shirt will appear when browsing "Clothing", "Men", or "Shirts".

* * *

## Understanding Category Enrichment

When `isProductCategoryEnriched` is enabled, Omnium populates the `productCategories` property with full category objects instead of just IDs.

**Without enrichment:**

```json
{
  "categoryIds": ["shirts", "men", "clothing"],
  "productCategories": []
}
```

**With enrichment:**

```json
{
  "categoryIds": ["shirts", "men", "clothing"],
  "productCategories": [
    {
      "categoryId": "shirts",
      "name": "Shirts",
      "description": "Men's dress and casual shirts"
    },
    {
      "categoryId": "men",
      "name": "Men",
      "description": "Men's clothing and accessories"
    },
    {
      "categoryId": "clothing",
      "name": "Clothing",
      "description": "All clothing categories"
    }
  ]
}
```

Enrichment is useful when you need category names for display without making additional API calls. The enriched data is language-specific based on the product's language.

* * *

## Best Practices

### Root Category Setup

*   Always define a `rootCategoryId` to establish the catalog hierarchy
*   Create the root category before setting the ID in configuration
*   Use a descriptive but short category ID (e.g., "catalog", "products")

### Enrichment Recommendations

*   Enable `isProductCategoryEnriched` if your frontend displays category names on product listings
*   Consider performance implications for large product catalogs
*   Run the [UpdateProductCategoriesScheduledTask](product-enrichment.md#sync-scheduled-task) after enabling enrichment

### Automatic Category Settings

*   Set `seasonCategoryId` and `brandCategoryId` before enabling the corresponding scheduled tasks
*   Create the parent categories first, then configure the IDs
*   See [Automatic Categories](automatic-categories.md) for scheduled task configuration

### Data Cleanup

*   Enable `isNonexistentCategoryIdsRemoved` to prevent orphaned category references
*   This is especially useful after bulk category deletions or migrations
