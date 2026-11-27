# Split Order Lines with Colli Products

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/split-order-lines-with-colli-products

> Split order lines containing colli products into individual line items with quantity 1.

## Overview

The **Split Order Lines with Colli Products** step splits order lines that have colli (multi-package) products into separate line items, each with quantity 1. This is useful when each colli item needs to be tracked individually or when serial numbers need to be assigned to each unit.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SplitOrderLinesWithColliProducts` |
| **Group** | Modify |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies all order lines where the product has colli defined
2.  For lines with quantity > 1, splits into multiple lines with quantity 1 each
3.  Performs the split operation while preserving pricing and product information on each new line

### Prerequisites

*   Order must have line items
*   Products must have colli information defined

### Side Effects

*   Increases the number of order lines
*   Each original line becomes multiple lines with quantity 1
*   Line item IDs change for the split lines

## Business Cases

### When to Use

*   **Serial number tracking**: When each unit needs an individual serial number
*   **Individual package tracking**: When each colli item needs separate tracking
*   **Inspection requirements**: When each unit must be individually inspected

### Example Scenarios

**Scenario 1: Quantity Split** Order line for 3 units of a TV (colli product) becomes 3 separate lines, each for 1 TV.

**Scenario 2: Serial Number Assignment** After splitting, each TV line can receive its own serial number during warehouse processing.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No order lines | Warning | Yes |
| No colli products | Success (no action) | Yes |
| Split successful | Success | Yes |
| Exception during split | Warning | Yes |

## Related Steps

*   [Split Colli Products to Separate Shipment](split-colli-products-to-separate-shipment.md) - Moves colli to separate shipment
*   [Split All Line Items](../shipments/split-all-line-items.md) - Splits all lines regardless of colli
