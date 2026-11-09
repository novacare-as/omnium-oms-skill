# Unallocated Inventory

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/unallocated-inventory

> Recalculate unallocated inventory for all products with virtual stock locations

## Overview

This task performs a complete recalculation of unallocated inventory across all products and warehouses that use Virtual Stock Locations (VSL). It determines how much physical warehouse stock remains available for allocation to virtual locations, ensuring accurate available-to-sell quantities for multi-channel inventory management.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `UnallocatedInventoryScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Use Virtual Stock Locations to share inventory across multiple sales channels
*   Need to ensure accurate unallocated inventory calculations
*   Want to rebuild the unallocated inventory index from scratch
*   Are setting up VSL for the first time

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Resets the unallocated inventory index (clears existing data)
2.  Identifies all physical warehouses that have virtual stock locations
3.  Iterates through all products in the catalog
4.  For each product variant (SKU) and physical warehouse combination:
    *   Retrieves inventory levels from both physical and virtual warehouses
    *   Calculates unallocated inventory as: physical available stock minus sum of virtual allocations
    *   Only considers positive available inventory (negative values indicate data errors)
5.  Stores the calculated unallocated inventory records

### Calculation Formula

```
Unallocated Inventory = Physical Warehouse Available Stock - Sum of Virtual Stock Location Allocations
```

Where:

*   **Physical Warehouse Available Stock** = Total inventory minus reserved inventory
*   **Virtual Stock Location Allocation** = Inventory assigned to each virtual location

### Prerequisites

*   Virtual Stock Locations must be enabled in tenant settings
*   Warehouses must be configured with the `HasVirtualStockLocations` property
*   Virtual warehouses must be linked to their parent physical warehouses

### Side Effects

*   Completely rebuilds the unallocated inventory index
*   Existing unallocated inventory records are removed before recalculation
*   Updates product records with unallocated inventory data

### Data Integrity Notes

*   Negative available inventory on individual items is treated as a data error and excluded from calculations
*   This prevents incorrect states from propagating into unallocated inventory values

* * *

## Example Configuration

```json
{
    "ImplementationType": "UnallocatedInventoryScheduledTask",
    "Schedule": "0 2 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 2 * * *` - 2:00 AM). This is a full recalculation task that processes all products, so it should be scheduled when system load is low.

For real-time unallocated inventory updates during the day, the system handles incremental changes through inventory transaction events. This scheduled task serves as a daily consistency check and full rebuild.

* * *

## Related Tasks

*   [Product Unallocated Inventory](product-unallocated-inventory.md) - Syncs calculated values to product records (should run after this task)
*   [Overallocated Inventory](overallocated-inventory.md) - Corrects situations where allocations exceed physical stock
