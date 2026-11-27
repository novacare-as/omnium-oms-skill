# Product Inventory Full Status

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/product-inventory-full-status

> Perform a complete refresh of inventory data on all products

## Overview

This task performs a complete inventory refresh for all products in the catalog. Unlike the delta task, it iterates through every product and updates inventory data regardless of whether changes have occurred. This is a resource-intensive operation and should be scheduled infrequently.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ProductInventoryFullStatusScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Complete inventory data reconciliation
*   Recovery from data inconsistencies
*   Periodic full sync to ensure data integrity
*   Initial population after system setup

**Warning:** This task can be resource-intensive as it processes every product and every SKU across all warehouses. Schedule during off-peak hours.

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Retrieves all configured warehouse IDs from the store service
2.  Iterates through all products in the catalog
3.  For each product, fetches current inventory from all warehouses
4.  Updates the inventory status on each product
5.  Reports the total number of products updated

### Full Sync Process

The full sync:

*   Processes all products regardless of modification date
*   Queries inventory for all SKUs across all warehouses
*   Overwrites existing inventory data with current values
*   Ensures complete data consistency

### Performance Considerations

The task processes data proportional to:

*   Number of products in the catalog
*   Number of SKUs per product
*   Number of warehouses

For large catalogs, this can result in significant data volume and processing time.

### Prerequisites

*   Inventory data must exist in the inventory index
*   Warehouses must be configured in the system

### Side Effects

*   Updates inventory status on all products
*   Triggers mass product reindexing
*   May cause temporary search index lag during processing

* * *

## Example Configuration

```json
{
    "ImplementationType": "ProductInventoryFullStatusScheduledTask",
    "Schedule": "0 4 * * 0",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run weekly during off-peak hours (e.g., `0 4 * * 0` at 4 AM on Sundays). For most scenarios, the delta task provides sufficient synchronization, making weekly full syncs adequate for data integrity verification.

* * *

## Related Tasks

*   [Product Inventory Status](product-inventory-status.md) - Efficient delta-based inventory updates
