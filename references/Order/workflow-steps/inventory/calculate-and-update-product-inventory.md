# Calculate and Update Product Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/calculate-and-update-product-inventory

> Update inventory status on products based on order line SKUs.

## Overview

The **Calculate and Update Product Inventory** step updates the inventory status on product records for all SKUs in the order. This ensures product availability information is current after order processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CalculateAndUpdateProductInventory` |
| **Group** | Inventory |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Validates order has line items
2.  Collects all SKU codes from order line items
3.  Updates the inventory status for each product based on the collected SKU list
4.  Products are updated with current inventory status

### Prerequisites

*   Order must have line items with SKU codes
*   Product inventory service must be configured

### Side Effects

*   Product records are updated with current inventory status
*   May affect product visibility/availability in external systems
*   Triggers after order inventory operations complete

## Business Cases

### When to Use

*   **Stock synchronization**: Keep product availability current
*   **New order processing**: Update after inventory is reserved
*   **Inventory changes**: After any operation affecting stock levels

### Example Scenarios

**Scenario 1: New Order** Order placed for 5 different products. Step updates inventory status on all 5 product records to reflect new reserved quantities.

**Scenario 2: Stock Level Change** After inventory operations, step ensures product shows correct availability status (in stock, low stock, out of stock).

**Scenario 3: No Line Items** Order has no line items (unusual state). Step returns warning and continues.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No line items | Warning | Yes |
| Update successful | Success | Yes |
| Update failed | Error | Depends on StopOnError |

## Related Steps

*   [Calculate ATP](calculate-atp.md) - Calculates available-to-promise
*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Run before to reserve stock
