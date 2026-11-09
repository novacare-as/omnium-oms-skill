# Cancel Return

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/status/cancel-return

> Cancel the return and reset all associated financial values.

## Overview

The **Cancel Return** step cancels a return request and resets all financial calculations. This is used when a return needs to be voided, such as when items are not actually returned or the return was created in error.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CancelReturn` |
| **Group** | Status |

## Configuration Properties

This step has no configurable properties. It performs a complete cancellation reset.

## Behavior

### What It Does

1.  Marks the return as cancelled
2.  Resets all refund/credit amounts to zero
3.  Clears return charges (shipping, handling, tax, discount totals)
4.  Restores the returned quantity on the original order lines

### Prerequisites

*   Return must be in a cancellable state
*   Any processed refunds should be handled separately

### Side Effects

*   Return marked as cancelled
*   Financial totals reset to zero
*   Return excluded from reporting
*   Original order status may need updating

This step does not reverse already-processed refunds. If payments have been credited, those transactions remain. Handle payment reversals separately before cancelling.

## Business Cases

### When to Use

*   Customer decides not to return items
*   Return created in error
*   Items never received by warehouse
*   Duplicate return entries

### Example Scenarios

**Customer Changed Mind** Customer requested return but decided to keep items. Return cancelled before processing.

**Items Not Received** Return created with shipping label, but items never arrived after timeout period. Return cancelled.

**Duplicate Entry** Same items accidentally entered on two returns. Duplicate cancelled.

## Sample Configuration

```json
{
  "Name": "CancelReturn",
  "Active": true,
  "IsInvisible": true,
  "TranslateKey": "WorkflowStep_CancelReturn"
}
```

Note: `IsInvisible: true` is commonly used to hide this step from the workflow log since cancellation is self-evident.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Return cancelled | Success | Yes |
| Cancellation failed | Error | No (workflow cancelled) |

## Related Steps

*   [Update Order Status](update-order-status.md) - May need to update original order
*   [Credit Return](../payment/credit-return.md) - Handle before cancelling if refund issued
