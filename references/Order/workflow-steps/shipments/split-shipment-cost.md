# Split Shipment Cost

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/split-shipment-cost

> Distribute shipping cost evenly across multiple shipments.

## Overview

The **Split Shipment Cost** step distributes the total shipping cost evenly across all active shipments. This ensures fair cost allocation when orders are split into multiple shipments.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SplitShipmentCost` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Calculates total shipping cost from all shipments (excluding delivered/cancelled)
2.  Counts active shipments with order lines (not delivered/cancelled)
3.  Divides total cost evenly: `newCost = totalCost / numberOfShipments`
4.  Rounds down to 2 decimal places
5.  Adds any remainder to the last shipment
6.  Recalculates order totals and prices

### Prerequisites

*   Order must have multiple shipments
*   Shipments must have line items

### Side Effects

*   Shipment `ShippingSubTotal` values updated
*   Order totals recalculated
*   Remainder cents added to last shipment

## Business Cases

### When to Use

*   **Split orders**: After splitting order into multiple shipments
*   **Fair allocation**: Distribute shipping costs proportionally
*   **Multi-warehouse**: When fulfilling from multiple locations

### Example Scenarios

**Scenario 1: Equal Split** Order has $30 shipping and splits into 3 shipments. Each shipment gets $10 shipping.

**Scenario 2: Remainder Handling** $10 shipping split into 3 shipments: $3.33, $3.33, $3.34 (remainder on last).

**Scenario 3: Some Delivered** Order has 3 shipments, 1 already delivered. Step only splits cost among the 2 active shipments.

**Scenario 4: Empty Shipments** Shipment has no line items (will be deleted). Step excludes it from cost split.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipments | Success (no action) | Yes |
| No active shipments | Success (no action) | Yes |
| Split successful | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Try Split Order to Warehouse](../allocation/try-split-order-to-warehouse.md) - Splits order first
*   [Try Split Shipment by Category](try-split-shipment-by-category-id.md) - Category-based split
