# Complete Shipment

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/shipments/complete-shipment

> Mark return shipments as completed and notify shipping providers.

## Overview

The **Complete Shipment** step marks return shipments as completed and can notify shipping providers of the final status. This is typically used when returned items have been received at the warehouse.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CompleteShipment` |
| **Group** | Shipments |

## Configuration Properties

This step has no configurable properties.

## Shipment Properties

The step completes the return's shipments with the same logic as [Complete Shipment](../../../workflow-steps/shipments/complete-shipment.md) in the order workflow, so it reads the same shipment properties. Set `ShippingPreBooked` to `true` on a return shipment to complete it without booking it with the shipping provider. See [ShippingPreBooked](../../../workflow-steps/shipments/complete-shipment.md#shippingprebooked) for details.

## Behavior

### What It Does

1.  Retrieves shipment information from the return
2.  Marks shipment status as completed
3.  Notifies shipping provider of completion (if applicable)
4.  Records completion timestamp
5.  Updates return with shipment status

### Prerequisites

*   Return must have associated shipment(s)
*   Shipment must have status `Released` (only released shipments are processed)

### Side Effects

*   Updates shipment status
*   May notify shipping provider
*   Records completion timestamp
*   Affects shipment tracking display

## Business Cases

### When to Use

*   When items are received at warehouse
*   Finalizing return logistics
*   Closing out return shipment tracking
*   Triggering downstream processes after receipt

### Example Scenarios

**Items Received** Warehouse scans returned items as received. Return status changed to "Received", triggering Complete Shipment step.

**Return Confirmed** After inspection, items confirmed received in acceptable condition. Shipment marked complete.

## Typical Workflow Position

Complete Shipment is typically used in a "Received" or "Completed" return status:

```json
{
  "Name": "Received",
  "WorkflowSteps": [
    {
      "Name": "CompleteShipment",
      "Active": true,
      "TranslateKey": "WorkflowStep_CompleteShipment"
    }
  ]
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Shipment completed | Success | Yes |
| No shipment with status `Released` found | Warning | Yes |
| Provider notification failed | Warning | Yes |
| Shipment update failed | Error | Depends on StopOnError |

## Related Steps

*   [Create Return Shipment Booking](create-return-shipment-booking.md) - Initial shipment creation
*   [Update Inventory](../inventory/update-inventory.md) - Process after items received
*   [Credit Return](../payment/credit-return.md) - Process refund after receipt
