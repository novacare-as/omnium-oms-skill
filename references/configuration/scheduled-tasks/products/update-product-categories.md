# Update Product Categories

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/update-product-categories

> Synchronize product category assignments across all products

## Overview

This task synchronizes category information on all products, ensuring that product category assignments are consistent and up-to-date. It is useful when category structures change or when product-category relationships need to be refreshed across the catalog.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `UpdateProductCategoriesScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Category assignments to be synchronized after category structure changes
*   Product category data to be refreshed across the catalog
*   Category path information to be updated on products
*   Recovery from category data inconsistencies

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Retrieves the current category structure
2.  Iterates through all products in the catalog
3.  For each product, synchronizes category information:
    *   Updates category paths
    *   Updates category names
    *   Updates category hierarchies
4.  Reports the number of products updated

### Category Synchronization

The synchronization process:

*   Ensures product category references match the current category structure
*   Updates denormalized category data on products
*   Maintains category breadcrumbs and paths

### Prerequisites

*   Products must exist in the system
*   Categories must be configured and assigned to products
*   Category structure must be stable during execution

### Side Effects

*   Updates category-related fields on products
*   Triggers product reindexing for updated products
*   May affect category facet counts in search

* * *

## Example Configuration

```json
{
    "ImplementationType": "UpdateProductCategoriesScheduledTask",
    "Schedule": "0 4 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (e.g., `0 4 * * *` at 4 AM). Run immediately after making significant changes to the category structure.

* * *

## Related Tasks

None specific. This task is typically used independently for category maintenance.
