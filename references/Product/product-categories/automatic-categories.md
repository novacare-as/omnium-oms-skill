# Automatic Category Creation

Source: https://docs.omnium.no/docs/Product/product-categories/automatic-categories

> Automatically create product categories from brand and season data using scheduled tasks in Omnium.

Omnium can automatically create and maintain product categories based on product data. This is useful for retailers with many brands or seasonal collections where manually creating categories would be impractical.

* * *

## Overview

Two scheduled tasks handle automatic category creation:

| Scheduled Task | Source Property | Parent Category Setting |
| --- | --- | --- |
| `CreateCategoriesFromSeasonScheduledTask` | `product.Season` | `seasonCategoryId` |
| `CreateCategoriesFromBrandScheduledTask` | `product.Brand` | `brandCategoryId` |

Both tasks follow the same pattern:

1.  Scan all active products
2.  Extract unique season/brand values
3.  Create categories for values that don't exist yet
4.  Assign the categories to the corresponding products
5.  Update modified products

* * *

## Season Categories

### Use Case

Season categories are ideal for:

*   Fashion retailers with seasonal collections (Spring/Summer, Fall/Winter)
*   Products with seasonal availability
*   Time-based product organization

### Configuration

1.  **Create the parent category** for seasons:

    ```json
    {
      "categoryId": "seasons",
      "name": "Seasons",
      "parentId": "catalog",
      "language": "en"
    }
    ```

2.  **Set the tenant configuration**:

    ```
    "ProductSettings": {
      "SeasonCategoryId": "seasons"
    }
    ```

3.  **Ensure products have season data**:

    ```json
    {
      "productId": "shirt-001",
      "season": "Spring 2024"
    }
    ```

### How It Works

When the `CreateCategoriesFromSeasonScheduledTask` runs:

1.  Loads existing categories under `seasonCategoryId`
2.  Iterates through all active products
3.  For each product with a `Season` value:
    *   Creates a new category if one doesn't exist for that season
    *   Adds the season category ID to the product's `categoryIds`
4.  Saves all new categories and modified products

**Example result:**

```
Seasons (seasons)
├── Spring 2024 (spring-2024)
├── Fall 2024 (fall-2024)
└── Spring 2025 (spring-2025)
```

* * *

## Brand Categories

### Use Case

Brand categories are ideal for:

*   Multi-brand retailers
*   Brand landing pages and navigation
*   Brand-based filtering

### Configuration

1.  **Create the parent category** for brands:

    ```json
    {
      "categoryId": "brands",
      "name": "Brands",
      "parentId": "catalog",
      "language": "en"
    }
    ```

2.  **Set the tenant configuration**:

    ```
    "ProductSettings": {
      "BrandCategoryId": "brands"
    }
    ```

3.  **Ensure products have brand data**:

    ```json
    {
      "productId": "shirt-001",
      "brand": "Acme"
    }
    ```

### How It Works

When the `CreateCategoriesFromBrandScheduledTask` runs:

1.  Loads existing categories under `brandCategoryId`
2.  Iterates through all active products
3.  For each product with a `Brand` value:
    *   Creates a new category if one doesn't exist for that brand
    *   Adds the brand category ID to the product's `categoryIds`
4.  Saves all new categories and modified products

**Example result:**

```
Brands (brands)
├── Acme (acme)
├── Widget Co (widget-co)
└── SuperBrand (superbrand)
```

* * *

## Enabling Scheduled Tasks

Scheduled tasks are configured in tenant settings under **Configuration → Settings → Integrations → Scheduled tasks**.

### Task Configuration

```json
{
  "scheduledTasks": [
    {
      "name": "CreateCategoriesFromSeasonScheduledTask",
      "isActive": true,
      "interval": "0 0 2 * * *"
    },
    {
      "name": "CreateCategoriesFromBrandScheduledTask",
      "isActive": true,
      "interval": "0 0 3 * * *"
    }
  ]
}
```

The `interval` uses cron syntax. The examples above run:

*   Season task: Daily at 2:00 AM
*   Brand task: Daily at 3:00 AM

### Recommended Schedule

| Scenario | Recommended Interval |
| --- | --- |
| Frequent product imports | Every 6 hours (`0 0 */6 * * *`) |
| Stable product catalog | Daily (`0 0 2 * * *`) |
| Manual/on-demand | Disabled (run via UI) |

* * *

## Processing Details

### Active Products Only

Both tasks only process products where `isActive = true`. Inactive products are skipped even if they have season/brand data.

### Category Naming

Categories are created with the product property value as the `name`. The `categoryId` is a generated unique identifier, not derived from the property value:

| Product Property | Created Category ID | Created Category Name |
| --- | --- | --- |
| `season: "Spring 2024"` | (generated unique ID) | `Spring 2024` |
| `brand: "Acme Corp"` | (generated unique ID) | `Acme Corp` |

### Language Handling

Automatically created categories are assigned the Norwegian (`no`) language code. If multi-language support is needed, you'll need to manually create additional language versions of the automatically created categories.

### Batch Processing

Products are processed in batches to handle large catalogs efficiently. Modified products are saved as each batch completes.

* * *

## Combining with Other Features

### With Parent Category Addition

When `isProductCategoryParentsAdded` is enabled, assigning a brand/season category also assigns the parent category:

**Configuration:**

```
"ProductSettings": {
  "BrandCategoryId": "brands",
  "IsProductCategoryParentsAdded": true
}
```

**Result:** A product assigned to "Acme" brand category will have:

```
"categoryIds": ["acme", "brands"]
```

### With Category Enrichment

When `isProductCategoryEnriched` is enabled, the product's `productCategories` array is populated:

```json
{
  "categoryIds": ["acme", "brands"],
  "productCategories": [
    {
      "categoryId": "acme",
      "name": "Acme"
    },
    {
      "categoryId": "brands",
      "name": "Brands"
    }
  ]
}
```

* * *

## Monitoring and Troubleshooting

### Checking Task Status

View scheduled task history in **Configuration → Settings → Integrations → Scheduled tasks → History** to see:

*   Last run time
*   Success/failure status
*   Number of categories created
*   Number of products updated

### Common Issues

| Issue | Cause | Solution |
| --- | --- | --- |
| Task reports "No season/brand category found" | Parent category setting is missing | Configure `seasonCategoryId` or `brandCategoryId` |
| Categories created but products not updated | Products are inactive | Activate products or check `isActive` status |
| Duplicate categories | Category ID normalization differences | Manually clean up duplicates |
| Missing categories for some products | Products don't have season/brand property set | Ensure product data includes the required property |

### Manual Execution

Tasks can be run manually from the Omnium UI:

1.  Navigate to **Configuration → Settings → Integrations → Scheduled tasks**
2.  Find the task (e.g., `CreateCategoriesFromBrandScheduledTask`)
3.  Click **Run Now**

This is useful for:

*   Initial setup after configuration
*   Testing the configuration
*   On-demand synchronization after bulk imports
