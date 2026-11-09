# Split All Line Items

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/split-all-line-items

> Split each line item into a separate shipment.

## Overview

The **Split All Line Items** step splits every line item into its own separate shipment. This enables individual tracking and fulfillment of each product in an order.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SplitAllLineItems` |
| **Group** | Modify |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Validates order has line items
2.  Iterates through all shipments
3.  For each shipment with more than 1 line item:
    *   Keeps the first line item in the original shipment
    *   Creates new shipments for each additional line item
4.  New shipments have `AwaitingInventory` status

### Prerequisites

*   Order must have line items
*   Shipments must have multiple line items to split

### Side Effects

*   Multiple new shipments created
*   Each line item in its own shipment
*   Original shipment reduced to one item

## Business Cases

### When to Use

*   **Individual tracking**: Each item needs separate tracking
*   **Dropship orders**: Items ship from different suppliers
*   **Gift orders**: Multiple recipients in one order
*   **Partial fulfillment**: Enable shipping items as they become available

### Example Scenarios

**Scenario 1: Three Items** Order has one shipment with 3 items. Step creates 2 new shipments, resulting in 3 shipments with 1 item each.

**Scenario 2: Already Split** Each shipment already has 1 item. Step completes without changes.

**Scenario 3: Multi-Shipment Order** Order already has 2 shipments with 2 items each. Step splits each, resulting in 4 shipments.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No order lines | Warning | Yes |
| Split successful | Success | Yes |
| Exception | Warning | Yes |

## Related Steps

*   [Split Order Lines to Be Purchased](split-order-lines-to-be-purchased-to-shipment.md) - Split backorder items
*   [Split Shipment Cost](split-shipment-cost.md) - Distribute costs after split
