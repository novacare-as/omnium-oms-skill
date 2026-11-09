# Categories

Source: https://docs.omnium.no/docs/Product/api-reference/product-categories

> Getting started guide for working with product categories in Omnium, including model structure, enrichment settings, and synchronization best practices.

## Product Category Model

_The product category model is documented [here](https://api.omnium.no/documentation/index.html#/model-OmniumProductCateogry)._

## Getting Started

Categories are managed independently from products and stored in their own index. Each product contains a copy of the category data (`product.productCategories`), allowing for more flexible searches. This means that **changes to the category tree won’t automatically reflect in products unless the categories are synced**.

To use categories effectively, it’s important to understand the basic structure, configuration settings, and synchronization options.

**Required Fields**

*   `CategoryId`
*   `ParentId`
*   `Language`
*   `Id` (generated as `CategoryId`\_`Language`)

**Important:** The `CategoryId` cannot be modified after creation.

* * *

## Category Tree Structure

Categories follow a tree structure created by the `parentId`. Each category must have a `parentId`, which is the `CategoryId` of its parent category. This allows hierarchical organization.

At the top of this structure is the **Root Category**, defined by `RootCategoryId` the configuration settings.

Navigation Path:
**Configuration → Products → Categories**

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcategories-config.96e037a5.png&w=3840&q=75)

The `RootCategoryId` serves as the starting point of the tree. It is just an ID and **does not need to represent an actual category**. Categories directly under this root will have their `parentId` set to the `RootCategoryId`. When fetching the category tree in the UI or via the API, the tree traversal begins from this root ID.

Categories with a missing or invalid parentId will become **disconnected**. These are shown in the UI under **“Categories Without Link”**, and typically result from incorrect imports or deleted parents. More information about this can be found [here](https://help.omnium.no/hc/en-us/articles/30471739812753-Managing-Categories-Without-Link).

* * *

## Category Enrichment Settings

Once the root is configured, there are three key enrichment settings you can enable to control how product categories are managed:

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcategories-config-enrichment.41282170.png&w=3840&q=75)

### Automatically Enrich Products with Category Parents

When enabled, this setting ensures that all parent categories of the selected categories are automatically added to the product’s category list (`product.productCategories`), eliminating the need to select them manually.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcategories-selector-enriched.ff9b0690.png&w=3840&q=75)

**Note:** All selected categories will be treated as enrichment sources. This means their full parent paths will be added, even if only one of them is intended to act as the main category. To control which categories should be enriched (along with their parent chains), enable [“Enrich product categories from the 'categoryIds' list”](product-categories.md#enrich-product-categories-from-the-categoryids-list), and provide those categories in the categoryIds list. This ensures only the specified categories are enriched, and prevents unexpected parent additions when paths change.

### Enrich Product Categories from the `categoryIds` List

Recommended

This setting ensures that `product.productCategories` (the full category objects) are automatically enriched based on the list of category IDs in `product.categoryIds`.

By separating category selection (`categoryIds`) from the enriched results (`productCategories`), this approach provides greater flexibility and makes it easier to maintain or update the category tree.

When [“Automatically enrich products with category parents”](product-categories.md#automatically-enrich-products-with-category-parents) is enabled, only the categories in `categoryIds` will act as enrichment sources. This means the correct parent categories will still be added to `product.productCategories`, even if the tree structure changes. This is because the enrichment will solely depend on the `categoryIds`, not the full `productCategories` list.

In the UI, categories directly selected in `categoryIds` are displayed in blue, while enriched categories (parents) are shown in a lighter blue. Note that both enriched categories and the selected categories will be added to `product.productCategories`.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcategories-editProduct-enriched.89cf5a69.jpg&w=3840&q=75)

### Remove value from `categoryIds` on product if the category does not exist

This setting is only relevant when [“Enrich product categories from the 'categoryIds' list”](product-categories.md#enrich-product-categories-from-the-categoryids-list) is enabled.

When a category has been deleted from its index, this setting ensures that its ID is removed from the `categoryIds` list on all products. If disabled, deleted categories will remain in product.categoryIds, meaning products will continue referencing non-existent categories unless the ID is manually removed from `categoryIds`.

* * *

## Category Sync Process

The enrichment settings above affect the **category synchronization**, which occurs:

*   **Automatically**, when the product enrichment queue is triggered (e.g. on product updates from the UI).
*   **Manually or continuously**, using the scheduled task: **`UpdateProductCategoriesScheduledTask`**

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcategories-UpdateProductCategoriesScheduledTask.9fdc7315.png&w=3840&q=75)

This job enriches products with full category data:

*   Updating metadata
*   Adding missing parents (if enabled)
*   Removing deleted category references (if enabled)

You can configure this job to run periodically, or set it up without activation to be triggered manually when needed.

* * *

## API Behavior: `GetCategoryTree`

The `GetCategoryTree` endpoint builds the category tree based on the categories currently in use by products, not solely from the main category index.

### Process Overview

1.  **Query Products**
    The endpoint first queries the product index to find all categories in use based on product.productCategories.

2.  **Enrich from Category Index**
    It then attempts to enrich each of those category IDs by retrieving the corresponding category data from the category index. If a category is not found in the category index, the data stored directly on the product will be returned instead.

* * *

### Example: Missing Category

If a category (e.g., `779473`) has been **deleted** from the index but still exists in one or more products:

*   `GetCategoryTree` **will include** it because it's still in use.
*   `GetCategoryById(779473)` → **404 Not Found** since it no longer exists in the index

**How to Resolve**

*   Identify and remove the deleted category from all products (either from `categoryIds` or `productCategories` depending on your settings)
*   Once fully removed, `GetCategoryTree` will stop returning it.

This is where the setting [“Remove value from 'categoryIds' if category does not exist”](product-categories.md#remove-value-from-categoryids-on-product-if-the-category-does-not-exist), along with the UpdateProductCategoriesScheduledTask, can help automate cleanup of stale category references.
