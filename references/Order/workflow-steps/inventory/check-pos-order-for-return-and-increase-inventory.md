# Check POS Order for Return and Increase Inventory

Source: https://docs.omnium.no/docs/Order/workflow-steps/inventory/check-pos-order-for-return-and-increase-inventory

> Increase inventory for returned items on POS orders.

## Overview

The **Check POS Order for Return and Increase Inventory** step processes returned items on POS (Point of Sale) orders and increases inventory accordingly. It handles the inventory restoration when items are returned through POS systems.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CheckPosOrderForReturnAndIncreaseInventory` |
| **Group** | Modify |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Validates order is in Completed status
2.  Checks if order has return order forms (`ReturnOrderForms`)
3.  If no returns exist, returns success with message
4.  Generates internal references for tracking (OrderId + "return" + LineItemId)
5.  Checks existing inventory transactions to prevent duplicate increases
6.  For each return line item with `ReturnQuantity > 0`:
    *   Skips if transaction already exists
    *   Increases inventory at the store location by the return quantity
7.  Creates inventory transaction records for tracking

### Prerequisites

*   Order must be in Completed status
*   Order must have `ReturnOrderForms` with return line items
*   Return line items must have `ReturnQuantity > 0`

### Side Effects

*   Inventory increased for returned items
*   Creates inventory transaction records
*   Uses store ID as warehouse code

## Business Cases

### When to Use

*   **POS returns**: Process returns from point-of-sale systems
*   **In-store returns**: Handle returns at physical stores
*   **Inventory restoration**: Restore stock for returned merchandise

### Example Scenarios

**Scenario 1: Standard POS Return** Customer returns 2 items at store. POS creates return order form. Step increases inventory by 2 for those SKUs.

**Scenario 2: Already Processed** Return workflow runs twice. Step checks existing transactions and skips already-processed returns.

**Scenario 3: No Returns** Completed order without return forms. Step returns success with "no return products" message.

**Scenario 4: Order Not Completed** Order in status other than Completed. Step returns warning as returns should only process on completed orders.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Order not completed | Warning | Yes |
| No return order forms | Success (no action) | Yes |
| Increase successful | Success | Yes |
| Already processed | Success (skipped) | Yes |

## Related Steps

*   [Reduce Inventory](reduce-inventory.md) - Reduces inventory on shipment
*   [Increase Reserved Inventory](increase-reserved-inventory.md) - Reserves inventory
