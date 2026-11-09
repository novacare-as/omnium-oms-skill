# Add Cost and Currency to Inventory

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/add-cost-currency-to-inventory

> Propagate cost and currency from products to inventory items

## Overview

This task ensures that all inventory items have accurate cost and currency information by copying these values from their associated product or variant records. This enables inventory valuation reports and cost-based analytics to work with complete data.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AddCostAndCurrencyToAllInventoryItemsScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Need inventory items to contain cost information for valuation reports
*   Want inventory value calculations to reflect current product costs
*   Have updated product costs and need to propagate changes to inventory
*   Are setting up inventory reporting for the first time

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Iterates through all inventory items in the system
2.  For each inventory item:
    *   Retrieves the associated product or variant by SKU
    *   Copies the cost and cost currency from the product to the inventory item
    *   If a variant has no cost but its parent product does, inherits the parent's cost
3.  Updates only inventory items where the cost value has changed

### Cost Inheritance Logic

The task applies the following logic when determining cost:

1.  First, attempts to use the variant's own cost and currency
2.  If the variant has no cost (0 value) but the parent product does, inherits the parent product's cost
3.  This ensures variants without explicit costs still receive cost data for reporting

### Prerequisites

*   Products must have cost and cost currency defined
*   Inventory items must be linked to products via SKU ID

### Side Effects

*   Updates cost and cost currency fields on inventory items
*   Only inventory items with changed cost values are saved (minimizes write operations)
*   Does not modify product records

* * *

## Example Configuration

```json
{
    "ImplementationType": "AddCostAndCurrencyToAllInventoryItemsScheduledTask",
    "Schedule": "0 3 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 3 * * *` - 3:00 AM). Cost changes are typically infrequent, so daily synchronization is usually sufficient.

If product costs change frequently or you need more timely cost data on inventory items, consider running more frequently (e.g., every few hours).

* * *

## Related Tasks

*   [Inventory Value](inventory-value.md) - Uses cost data from inventory items for valuation snapshots
*   [Product Cost in Default Currency](product-cost-default-currency.md) - Normalizes product costs to a standard currency
