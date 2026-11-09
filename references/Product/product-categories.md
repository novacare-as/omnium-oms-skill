# Product Categories

Source: https://docs.omnium.no/docs/Product/product-categories

> Complete guide to product categories in Omnium - hierarchical organization, multi-language support, automatic creation, and API usage.

Product categories in Omnium provide a hierarchical structure for organizing products. Categories support multi-language content, automatic creation from product data, and flexible enrichment options.

## Key Concepts

### Hierarchical Structure

Categories form a tree structure through parent-child relationships:

*   Each category can have a **parent category** (`parentId` property)
*   Categories with no parent are **root categories**
*   Unlimited nesting levels are supported
*   The `rootCategoryId` tenant setting defines the primary catalog root

### Multi-Language Support

Categories are **language-specific**. Each category has:

*   A `categoryId` that identifies it across languages (e.g., `electronics`)
*   A composite `id` combining category and language (e.g., `electronics_en`, `electronics_no`)
*   Language-specific `name` and `description` fields

This means a category like "Electronics" exists as separate documents for each language, sharing the same `categoryId` but with localized content.

### Relationship with Products

Products connect to categories in two ways:

| Property | Type | Description |
| --- | --- | --- |
| `categoryIds` | List<string> | Simple list of category IDs assigned to the product |
| `productCategories` | List<ProductCategory> | Enriched category objects with full details (name, description, etc.) |

The `categoryIds` property stores the raw assignments. When [category enrichment](product-categories/product-enrichment.md) is enabled, Omnium populates `productCategories` with complete category objects.

* * *

## Feature Overview

| Feature | Description | Learn More |
| --- | --- | --- |
| **Configuration** | Tenant settings for category behavior | [Configuration](product-categories/configuration.md) |
| **Category Model** | Full property reference | [Category Model](product-categories/category-model.md) |
| **Category Tree** | Hierarchy and tree operations | [Category Tree](product-categories/category-tree.md) |
| **Automatic Categories** | Create categories from brand/season data | [Automatic Categories](product-categories/automatic-categories.md) |
| **Product Enrichment** | Populate products with category data | [Product Enrichment](product-categories/product-enrichment.md) |
| **Dynamic Categories** | Categories based on saved searches | [Dynamic Categories](product-categories/dynamic-categories.md) |
| **API Reference** | Endpoints for category management | [API Reference](product-categories/api-reference.md) |

* * *

## Common Use Cases

### Catalog Navigation

Build category menus and navigation trees using the [category tree API](product-categories/category-tree.md).

### Brand-Based Organization

Automatically create and maintain brand categories using the [brand scheduled task](product-categories/automatic-categories.md#brand-categories).

### Seasonal Collections

Create season categories automatically from product season data using the [season scheduled task](product-categories/automatic-categories.md#season-categories).

### Dynamic Product Groups

Use [saved searches](product-categories/dynamic-categories.md) to create categories like "New Arrivals" or "On Sale" without manual product assignment.

* * *

## Quick Start

1.  **Configure settings** - Set up category-related tenant settings in [Configuration](product-categories/configuration.md)
2.  **Create categories** - Use the [API](product-categories/api-reference.md) or Omnium UI to create your category structure
3.  **Assign to products** - Add category IDs to products via import or API
4.  **Enable enrichment** - Turn on [product enrichment](product-categories/product-enrichment.md) to populate category details on products
