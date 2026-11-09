# Change Status If Out of Stock

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/change-status-if-out-of-stock

> Trigger an order status change if any line item is out of stock.

## Overview

The **Change Status If Out of Stock** step checks inventory availability for all order/shipment line items and triggers a status change if any item is out of stock. This enables automatic routing of orders with inventory issues.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeStatusIfOutOfStock` |
| **Group** | Inventory |
| **Applicable Statuses** | New |
| **Hidden** | Yes |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `orderStatus` | String | Yes | \- | Status to trigger if out of stock |
| `triggerNewStatusWithoutWorkflow` | Boolean | No | `false` | Skip workflow when changing status |

## Behavior

### What It Does

1.  Retrieves the target `orderStatus` from configuration
2.  Gets store warehouses for the order
3.  Retrieves inventory for all SKUs in those warehouses
4.  For each SKU, checks if available inventory exists (Inventory - ReservedInventory >= 0)
5.  If any SKU has no available inventory:
    *   Sets `TriggerNewStatus` to the configured status
    *   Sets `TriggerNewStatusWithoutWorkflow` based on property
6.  If shipment context, checks shipment warehouse specifically
7.  Returns success whether stock was found or not

### Prerequisites

*   `orderStatus` property must be configured
*   Store warehouses must be configured
*   Inventory data must be available

### Side Effects

*   May trigger order status change
*   Status change may or may not run workflow depending on configuration
*   Does not modify inventory

## Business Cases

### When to Use

*   **Backorder routing**: Send out-of-stock orders to a backorder status
*   **Manual review**: Route inventory issues to a review queue
*   **Alternate fulfillment**: Trigger different processing for unavailable items
*   **Pre-order handling**: Route orders when stock hasn't arrived

### Example Scenarios

**Scenario 1: Backorder Routing** Order placed for item with 0 inventory. Step detects out-of-stock and triggers status change to "Backorder".

**Scenario 2: All In Stock** Order has 3 items, all with sufficient inventory. Step completes successfully without triggering status change.

**Scenario 3: Shipment-Level Check** Running at shipment level. Checks only the shipment's warehouse for availability.

**Scenario 4: Without Workflow** `triggerNewStatusWithoutWorkflow=true`. Status changes directly without running the new status's workflow.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| orderStatus not configured | Error | No |
| Out of stock found | Success (triggers status) | Depends on new status |
| All in stock | Success | Yes |

## Related Steps

*   [Set Items Out of Stock](set-items-out-of-stock.md) - Force items to zero inventory
*   [Allocate to Warehouse](../allocation/allocate-to-warehouse.md) - Standard allocation checks stock
