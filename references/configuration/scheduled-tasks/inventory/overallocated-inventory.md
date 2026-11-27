# Overallocated Inventory

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/overallocated-inventory

> Detect and correct overallocated virtual stock to prevent overselling

## Overview

This task monitors for overallocation situations where the sum of virtual stock location allocations exceeds the available physical warehouse stock. When detected, it automatically reduces virtual stock levels to bring the system back into balance, preventing potential overselling scenarios.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `VslOverallocatedInventoryScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Use Virtual Stock Locations and need automatic correction of overallocation
*   Want to prevent overselling across multi-channel inventory scenarios
*   Need to handle negative spikes in inventory (e.g., from returns, adjustments, or sync issues)
*   Require automated stock balancing without manual intervention

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Searches for unallocated inventory records with negative values (indicating overallocation)
2.  For each overallocated item:
    *   Verifies the overallocation by recalculating from current inventory data
    *   If the index is out of sync, updates the unallocated inventory record and skips correction
    *   If overallocation is confirmed, identifies all virtual stock locations for that physical warehouse
    *   Reduces inventory on virtual locations to eliminate the overallocation
3.  Creates inventory adjustment transactions with the reason "Stock overallocated - automatic virtual stock reduction"

### Correction Algorithm

When reducing virtual stock levels:

1.  Retrieves all virtual stock locations for the affected physical warehouse and SKU
2.  Identifies the virtual location with the highest available inventory
3.  Reduces that location by 1 unit
4.  Repeats until the overallocation amount is resolved
5.  Applies all reductions as a single inventory update

This approach ensures the burden of correction is distributed starting with the locations that have the most stock available.

### Prerequisites

*   Virtual Stock Locations must be enabled
*   The Unallocated Inventory task must have run to populate overallocation data
*   Warehouses must be properly configured with VSL relationships

### Data Verification

Before making corrections, the task recalculates the unallocated inventory from current stock levels. This guards against acting on stale index data:

*   If the recalculated value differs from the indexed value, the index is updated without making stock corrections
*   This prevents unnecessary inventory adjustments when the index is simply out of sync

### Side Effects

*   Reduces inventory quantities on virtual stock locations
*   Creates inventory transaction records documenting the adjustments
*   Updates unallocated inventory records
*   Does not affect physical warehouse stock levels directly

* * *

## Example Configuration

```json
{
    "ImplementationType": "VslOverallocatedInventoryScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 5 minutes (`*/5 * * * *`) to quickly detect and correct overallocation situations. Frequent execution is important because overallocation can lead to overselling if not promptly addressed.

For high-volume environments with rapid inventory changes, consider running every 1-2 minutes.

* * *

## Related Tasks

*   [Unallocated Inventory](unallocated-inventory.md) - Calculates unallocated inventory and identifies overallocation (dependency)
*   [Product Unallocated Inventory](product-unallocated-inventory.md) - Syncs corrected values to product records
