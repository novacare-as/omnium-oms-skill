# Update Order Status

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/status/update-order-status

> Update the original order's status to reflect the return.

## Overview

The **Update Order Status** step updates the original order's status when a return is processed. It changes the order status to indicate that items have been returned, either partially or fully.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateOrderStatus` |
| **Group** | Status |

## Configuration Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ReturnedStatus | string | `Returned` | The order status to set when all items have been returned. |
| PartiallyReturnedStatus | string | `PartiallyReturned` | The order status to set when some items have been returned. |
| ShipmentReturnedStatus | string | `Returned` | The shipment status to set when all items in a shipment have been returned. |
| ShipmentPartiallyReturnedStatus | string | `PartiallyReturned` | The shipment status to set when some items in a shipment have been returned. |
| SetTag | string | null | A tag to add to the order when this step runs. The tag is added regardless of whether the status is updated. |

### Sample

```json
{
  "Name": "UpdateOrderStatus",
  "Active": true,
  "TranslateKey": "WorkflowStep_UpdateOrderStatus",
  "Properties": [
    { "Key": "ReturnedStatus", "Value": "Returned" },
    { "Key": "PartiallyReturnedStatus", "Value": "PartiallyReturned" },
    { "Key": "ShipmentReturnedStatus", "Value": "Returned" },
    { "Key": "ShipmentPartiallyReturnedStatus", "Value": "PartiallyReturned" },
    { "Key": "SetTag", "Value": "HasReturn" }
  ]
}
```

## Behavior

### What It Does

This step is part of the **return workflow** (not the order workflow). When it runs, it modifies the original order's status. Here is the full sequence:

#### 1\. Tag the order (optional)

If a `SetTag` property is configured, the tag is added to the order. This happens regardless of whether the status is updated.

#### 2\. Check for status skip

If the return was created with the property `SetReturnStatus` = `"false"`, the step skips the status update and returns success. The tag (if configured) is still applied.

#### 3\. Determine the new order status

The step compares `ReturnQuantity` against `Quantity - CanceledQuantity` on each order line item:

*   If **all remaining items** (excluding cancelled) across all line items are returned → new status is `ReturnedStatus` (default: `Returned`)
*   If **some items** are returned → new status is `PartiallyReturnedStatus` (default: `PartiallyReturned`)

#### 4\. Update shipment statuses

For each shipment that contains returned line items, the step also updates the shipment's status using the same logic (`ShipmentReturnedStatus` / `ShipmentPartiallyReturnedStatus`).

#### 5\. After the return workflow completes: order workflow is triggered

This is the most important part to understand. After the return workflow finishes, Omnium checks whether the order status was actually changed by this step.

*   **If the order status changed** (e.g. from "Sent" to "PartiallyReturned"): Omnium calls `UpdateAndRunWorkflow` on the order. This runs the **order workflow** for the new status — the same workflow that runs when you change an order status manually. If there are intermediate statuses between the old and new status, those workflows run in sequence as well.

*   **If the order status did not change** (e.g. the order was already "PartiallyReturned"): The order is saved without running the order workflow again.

If the order workflow for the new status has any steps that fail or abort, the order status is **reverted** back to the previous status. Check the order events to see which workflow step caused the issue.

### Prerequisites

*   Return must be linked to an original order
*   Original order must exist and be accessible
*   The target order statuses (e.g. "PartiallyReturned", "Returned") should be configured in your order type's status list, with any order workflow steps you need

### Side Effects

*   Changes original order's status
*   Changes shipment statuses on affected shipments
*   Triggers the order workflow for the new status (which may send notifications, export to ERP, etc.)
*   Updates order history

## Business Cases

### When to Use

*   Marking orders as returned after processing
*   Tracking partial returns on orders
*   Maintaining accurate order status for reporting
*   Triggering downstream order workflows (e.g. ERP export when order reaches "Returned")

### Example Scenarios

**Full Return** Customer returns all 3 items from order. Step updates order status to "Returned".

**Partial Return** Customer returns 1 of 3 items. Step updates order status to "PartiallyReturned".

**Multiple Returns** First return: 1 of 3 items, status becomes "PartiallyReturned". Second return: remaining 2 items, status becomes "Returned".

**Custom Status Names** Configure `ReturnedStatus` = `"Complete"` and `PartiallyReturnedStatus` = `"PartialReturn"` to use your own status names instead of the defaults.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Status updated | Success | Yes |
| Order not found | Error | Depends on StopOnError |
| Status unchanged (already set) | Success | Yes |
| Order workflow aborts after status change | Order status is reverted to previous value | N/A (order workflow) |

## Troubleshooting

**Order status does not change after return is created:**

1.  Check that the `UpdateOrderStatus` step is configured and **Active** on the correct return status
2.  Check the order events — look for workflow errors or aborts on the **order workflow** for the target status (e.g. "PartiallyReturned")
3.  Verify that the target status (e.g. "PartiallyReturned") exists in your order type's status configuration
4.  If the order workflow for the target status has failing steps, the order status will be reverted to the previous value

**The previous order status workflow seems to re-trigger:** The previous status workflow (e.g. "Sent") is never re-triggered. If the order status appears unchanged, it is because the order workflow for the new status failed and the status was reverted. Check the order events for errors.

## Related Steps

*   [Credit Return](../payment/credit-return.md) - Process refund
*   [Update Inventory](../inventory/update-inventory.md) - Adjust stock levels
*   [Update Project Status](update-project-status.md) - Update related projects
