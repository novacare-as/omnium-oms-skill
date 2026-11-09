# Inventory Value

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/inventory-value

> Create daily snapshots of inventory valuation by warehouse and currency

## Overview

This task creates a point-in-time snapshot of total inventory value across all warehouses. It aggregates inventory quantities with their cost prices and converts values to configured currencies, producing historical valuation records for financial reporting and trend analysis.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `InventoryValueScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Daily inventory valuation snapshots for financial reporting
*   Historical inventory value trends over time
*   Warehouse-by-warehouse inventory worth tracking
*   Multi-currency inventory value reporting
*   Integration with external accounting systems

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Retrieves all configured currencies from tenant settings
2.  For each currency, calculates total inventory value by warehouse
3.  Converts original cost values to the target currency
4.  Creates a new inventory value record with timestamp
5.  Stores the record for historical reference and indexing

### Prerequisites

*   Products must have cost and cost currency defined
*   At least one currency must be configured in tenant settings (`ProductSettings.Currencies`)
*   Inventory items must exist in the system

### Side Effects

*   Creates a new inventory value record indexed by date
*   Updates the searchable inventory value index
*   Does not modify existing inventory or product data

### Output Data

Each snapshot includes per-warehouse breakdowns with:

*   Warehouse code and name
*   Original currency and value
*   Converted currency and value

* * *

## Example Configuration

```json
{
    "ImplementationType": "InventoryValueScheduledTask",
    "Schedule": "0 1 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily at off-peak hours (`0 1 * * *` - 1:00 AM) to create a daily valuation snapshot. More frequent execution is possible but typically unnecessary for financial reporting purposes.

* * *

## Related Tasks

*   [Add Cost and Currency to Inventory](add-cost-currency-to-inventory.md) - Ensures inventory items have cost data
*   [Product Cost in Default Currency](product-cost-default-currency.md) - Normalizes product costs to a standard currency
*   [Analytics Inventory](../analytics/analytics-inventory.md) - Indexes inventory data for analytics dashboards
