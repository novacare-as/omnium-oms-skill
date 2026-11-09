# Create Return Shipment Booking

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/shipments/create-return-shipment-booking

> Book a return shipment and generate a return shipping label.

## Overview

The **Create Return Shipment Booking** step books a return shipment with the configured shipping provider and generates a return shipping label. This allows customers to ship items back using a pre-paid or pre-arranged shipping label.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateReturnShipmentBooking` |
| **Group** | Shipments |

## Configuration Properties

This step reads properties from the return request. The `CreateReturnLabel` property must be set to "true" for the step to execute.

## Shipment Properties

### ReturnShippingPreBooked

The step books the first shipment on the return. Set `ReturnShippingPreBooked` to `true` in that shipment's `properties` list when the return label has already been booked with the carrier outside Omnium. The key is matched case-insensitively, and any value other than `true` (case-insensitive) means off.

When it is `true`, the step does not call the shipping provider and does not change `returnTrackingNumber` or `returnTrackingLink`. The rest of the step runs as usual: the shipment is set to `Shipped`, its address is set to the receiving store, and the return is saved. The shipment's `labelLink` is cleared, because no label was created, so a label link from outside Omnium is not kept there.

The same property is read in the order workflow. See [Create Return Shipment Booking](../../../workflow-steps/shipments/create-return-shipment-booking.md#returnshippingprebooked) and [Complete Shipment](../../../workflow-steps/shipments/complete-shipment.md#shipment-properties) for the outbound counterpart `ShippingPreBooked`.

## Behavior

### What It Does

1.  Checks if return label creation was requested
2.  Retrieves shipping provider configuration
3.  Books return consignment with carrier
4.  Generates return shipping label (PDF/ZPL)
5.  Stores tracking information on return
6.  Makes label available for customer/notification

### Prerequisites

*   Return must have the `CreateReturnLabel` property set to "true"
*   Shipping provider must support return bookings
*   Valid return address configured

### Side Effects

*   Creates shipment booking with carrier
*   Generates shipping label document
*   Stores tracking number on return
*   May incur shipping costs

## Business Cases

### When to Use

*   Providing pre-paid return labels to customers
*   Automated return logistics
*   Carrier integration for returns
*   Tracking return shipments

### Example Scenarios

**Pre-Paid Return** Customer requests return with shipping label. Step books return with carrier, generates label, and includes in customer notification.

**Drop-off Return** Label generated for customer to drop at carrier location. Tracking number provided for visibility.

**Pick-up Arrangement** Some carriers support pick-up bookings. Step creates booking and provides pick-up confirmation.

## Label Formats

Return labels can be generated in various formats depending on carrier:

*   **PDF** - Standard printable format
*   **ZPL** - Thermal printer format
*   **PNG** - Image format

## Sample Workflow Configuration

```json
{
  "Name": "New",
  "WorkflowSteps": [
    {
      "Name": "CreateReturnShipmentBooking",
      "Active": true,
      "TranslateKey": "WorkflowStep_CreateReturnLabel"
    },
    {
      "Name": "Notification",
      "Active": true,
      "TranslateKey": "WorkflowStep_SendReturnLabel"
    }
  ]
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Label created | Success | Yes |
| Label not requested | Success (skipped) | Yes |
| Carrier booking failed | Error | Depends on StopOnError |
| Carrier unavailable | Error | Depends on StopOnError |
| Invalid address | Error | Depends on StopOnError |

## Related Steps

*   [Notification](../notifications/notification.md) - Send label to customer
*   [Complete Shipment](complete-shipment.md) - Mark shipment complete on arrival
*   [Ensure RMA](../enrichment/ensure-rma.md) - RMA number for tracking
