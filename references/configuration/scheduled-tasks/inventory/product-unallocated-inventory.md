# Product Unallocated Inventory

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/product-unallocated-inventory

> Sync unallocated inventory data to product records

## Overview

This task synchronizes unallocated inventory values from the dedicated unallocated inventory index to the corresponding product and variant records. This ensures that products display accurate available-to-allocate stock information for multi-channel inventory management scenarios.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ProductUnallocatedInventoryScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Use Virtual Stock Locations and need unallocated inventory visible on product records
*   Want to filter or search products by their unallocated inventory status
*   Need product APIs to include unallocated inventory information
*   Are displaying available-to-allocate quantities in the UI

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Identifies unallocated inventory records that have been modified since the last task run
2.  For each modified unallocated inventory record:
    *   Retrieves all language variants of the associated product by SKU
    *   Updates the unallocated inventory property on the product or variant
    *   Clears previous unallocated inventory values and replaces with current data
3.  Saves the updated product records

### Prerequisites

*   The Unallocated Inventory task must have run to populate the source data
*   Products must exist in the system matching the SKU IDs in unallocated inventory records

### Delta Processing

This task uses delta processing based on the modification timestamp of unallocated inventory records. It only processes records that have changed since the last successful run, making it efficient for frequent execution.

### Side Effects

*   Updates the `UnallocatedInventory` property on product records
*   For products with variants, updates the property on each variant
*   Products with zero unallocated inventory have the property set to null
*   All language variants of a product are updated together

* * *

## Example Configuration

```json
{
    "ImplementationType": "ProductUnallocatedInventoryScheduledTask",
    "Schedule": "*/15 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 15 minutes (`*/15 * * * *`) to keep product records reasonably current with unallocated inventory changes. For higher-frequency requirements, reduce to every 5 minutes.

This task is lightweight since it only processes changed records, making it suitable for frequent execution.

* * *

## Related Tasks

*   [Unallocated Inventory](unallocated-inventory.md) - Calculates the source data for this task (dependency)
*   [Overallocated Inventory](overallocated-inventory.md) - Corrects overallocation situations that affect unallocated inventory
