# Product Inventory Status

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/product-inventory-status

> Update product inventory levels based on recent inventory changes

## Overview

This task updates product inventory status based on inventory changes since the last run. It efficiently synchronizes inventory data from the inventory index to products, enabling accurate stock visibility in search results and product listings. The task also handles new products that have never had inventory assigned and detects warehouse configuration changes.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ProductInventoryStatusScheduledTask` |
| **Group** | Products |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Near real-time inventory visibility on products
*   Inventory status for search filtering (in stock/out of stock)
*   Automatic inventory initialization for new products
*   Warehouse-specific inventory tracking on products

* * *

## Configuration Properties

| Property | Type | Description |
| --- | --- | --- |
| `MarginDays` | integer | Number of days to subtract from the delta timestamp for safety margin |
| `MarginHours` | integer | Number of hours to subtract from the delta timestamp for safety margin |
| `MarginSeconds` | integer | Number of seconds to subtract from the delta timestamp for safety margin |

The margin properties allow you to extend the look-back period when checking for inventory changes, providing a safety buffer in case inventory updates are delayed or out of order.

* * *

## Behavior

### What It Does

1.  Retrieves all configured warehouse IDs from the store service
2.  Detects warehouse configuration changes:
    *   If warehouses have been added or removed since the last run, triggers a full inventory update
    *   Caches current warehouse configuration for comparison on next run
3.  Updates products with inventory changes since the last run
4.  Initializes inventory for products that have never had inventory status set
5.  Periodically updates inventory for recently modified products (once per hour)
6.  Refreshes the product search index after updates

### Warehouse-Specific Mode

When warehouse-specific inventory tracking is enabled:

*   Products track inventory per warehouse
*   Warehouse configuration changes trigger a full resync
*   Each product stores inventory levels for all relevant warehouses

### Delta Processing

The task processes inventory in three phases:

1.  **Changed Inventory** - Products affected by inventory changes since last run
2.  **Missing Inventory** - New products without any inventory status
3.  **Modified Products** - Products that have been modified (hourly check for SKU changes)

### Prerequisites

*   Inventory data must exist in the inventory index
*   Warehouses must be configured in the system
*   Inventory Management settings must be configured

### Side Effects

*   Updates inventory status on products
*   Refreshes the product search index
*   Caches warehouse configuration for change detection
*   Triggers product reindexing for updated products

* * *

## Example Configuration

```json
{
    "ImplementationType": "ProductInventoryStatusScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

### With Safety Margin

```json
{
    "ImplementationType": "ProductInventoryStatusScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false,
    "Properties": [
        {
            "Key": "MarginHours",
            "Value": "1"
        }
    ]
}
```

* * *

## Recommended Schedule

Run frequently (e.g., `*/5 * * * *` every 5 minutes) for near real-time inventory visibility. For high-volume environments, consider running every 1-2 minutes.

* * *

## Related Tasks

*   [Product Inventory Full Status](product-inventory-full-status.md) - Complete inventory refresh for all products
*   [Send Product Alerts](send-product-alerts.md) - Notifies customers when products are back in stock
