# Complete Shipment

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/complete-shipment

> Finalize shipments and notify shipping providers about completed shipments.

## Overview

The **Complete Shipment** step finalizes released shipments by notifying the shipping provider and updating the shipment status to shipped. It returns shipping label links when available.

This step sets shipments to `Shipped`. Inventory reduction steps such as [Reduce Inventory and Reserved Inventory](../inventory/reduce-inventory-and-reserved-inventory.md) only process shipments in `Released` status, so they must run **before** this step. Placed after it, they find no `Released` shipments and report success without reducing any inventory.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CompleteShipment` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship, Completed, ReadyForPickup |

## Configuration Properties

This step has no configurable properties. Its behavior can be changed per shipment with the [shipment properties](complete-shipment.md#shipment-properties) below.

## Shipment Properties

These properties are set in the shipment's `properties` list, not on the workflow step. The key is matched case-insensitively, and the property is on only when the value is `true` (case-insensitive). Any other value, or a missing property, means off.

| Property key | Read by | Effect when `true` |
| --- | --- | --- |
| `ShippingPreBooked` | Complete Shipment | Skips the outbound booking with the shipping provider |
| `ReturnShippingPreBooked` | [Create Return Shipment Booking](create-return-shipment-booking.md#returnshippingprebooked) | Skips the return booking with the shipping provider |
| `Virtual` | Complete Shipment, Create Return Shipment Booking | Skips the shipment entirely: no booking, and Complete Shipment does not set it to `Shipped` |

```json
{
  "shipmentId": "1",
  "shippingMethodName": "Bring-Servicepakke",
  "shipmentTrackingNumber": "70712345678901234",
  "shipmentTrackingLink": "https://tracking.bring.com/tracking/70712345678901234",
  "properties": [
    { "key": "ShippingPreBooked", "value": "True" },
    { "key": "ReturnShippingPreBooked", "value": "True" }
  ]
}
```

### ShippingPreBooked

Set `ShippingPreBooked` when the consignment has already been booked with the carrier outside Omnium, for example by the e-commerce platform at checkout, by a WMS, or by the warehouse's transport system. Without it, Complete Shipment books the shipment again and the customer can end up with two consignments.

When `ShippingPreBooked` is `true`, Complete Shipment:

*   **Does not** call the shipping provider, so no consignment is created and no label is generated
*   **Does not** change `shipmentTrackingNumber`, `shipmentTrackingLink`, `labelLink`, `expectedDeliveryDate` or the package tracking data. The shipment keeps the values it already has, so the system that booked the shipment should send them to Omnium.
*   **Does** update delivered quantities on the shipment and order lines and set the shipment to `Shipped`, as for any other shipment
*   Returns `Success` with no label links

The shipment is still validated like any other shipment. It must have line items, the order must have a market, and the shipment's `shippingMethodName` must match a shipment option in that market. A pre-booked shipment with an unknown shipping method fails with `No valid shipment option` and cancels the workflow.

The [Ongoing](../../../plugins/WMS/Ongoing.md) integration sets `ShippingPreBooked` to `true` on the shipments it updates when Ongoing reports a tracking number, because Ongoing has booked the consignment.

### ReturnShippingPreBooked

Complete Shipment does not read `ReturnShippingPreBooked`. It is the return counterpart of `ShippingPreBooked`, read by [Create Return Shipment Booking](create-return-shipment-booking.md#returnshippingprebooked) in the order workflow and in the [return workflow](../../Returns/return-workflow-steps/shipments/create-return-shipment-booking.md#returnshippingprebooked). Set it when the return label has already been booked with the carrier outside Omnium. The step then skips the return booking and keeps `returnTrackingNumber`, `returnTrackingLink` and `returnLabelLink` as they are.

The two properties are independent. A shipment can be pre-booked outbound while Omnium books the return label, or the other way around.

### Splitting and Reallocation

Both properties belong to a booking for one set of items from one warehouse. When a shipment is split, the new shipment does not get `ShippingPreBooked` or `ReturnShippingPreBooked`. When a shipment is reallocated to another warehouse, both properties are removed from it. Omnium then books those shipments with the carrier as usual, unless the properties are set again.

## Behavior

### What It Does

1.  Identifies shipments with `Released` or `SplittedShippedShipment` status
2.  If running at shipment level, only processes the current shipment
3.  For each eligible shipment:
    *   Skips the shipment if it has the `Virtual` property
    *   Validates line items, market and shipment option
    *   Books the shipment with the shipping provider, unless it has the `ShippingPreBooked` property
    *   Stores tracking number, tracking link, label link and expected delivery date from the booking
    *   Updates delivered quantities and sets the shipment status to `Shipped`
4.  Returns label links in the result for UI display

### Prerequisites

*   Shipments must be in `Released` status
*   Shipping provider must be configured
*   The shipment's shipping method must match a shipment option in the order's market, also for pre-booked shipments

### Side Effects

*   Shipment status updated to Shipped
*   Shipping provider notified (booking created), unless the shipment is pre-booked
*   Tracking number assigned, unless the shipment is pre-booked
*   Label links generated, unless the shipment is pre-booked

## Business Cases

### When to Use

*   **Order fulfillment**: Final step when shipping orders
*   **Label generation**: Trigger shipping label creation
*   **Carrier notification**: Inform carrier about shipment

### Example Scenarios

**Scenario 1: Standard Ship** Order picked and ready. Step completes shipment, notifies carrier, returns label PDF link.

**Scenario 2: Multi-Shipment** Order has multiple shipments. Running at order level completes all released shipments.

**Scenario 3: Click-and-Collect** Pickup order ready. Step completes shipment for record-keeping (may not generate carrier label).

**Scenario 4: Already Shipped** Shipment already in Shipped status. Step returns warning.

**Scenario 5: Booked by the Web Shop** The web shop books the consignment with the carrier at checkout and sends the order with `ShippingPreBooked` set to `True` and the tracking number filled in. The step sets the shipment to `Shipped` without booking it again, and the tracking number from the web shop is kept.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No released shipments | Warning | Yes |
| Completion successful | Success (with label links) | Yes |
| Pre-booked shipment completed | Success (no label links) | Yes |
| No shipment option for the shipping method | Error | No (cancels workflow) |
| Provider error | Error | No (cancels workflow) |

## Related Steps

*   [Prepare Shipment Delivery](prepare-shipment-delivery.md) - Pre-notify shipping provider
*   [Print Shipping Label](print-shipping-label.md) - Print the generated label
*   [Update Shipment Status](update-shipment-status.md) - Update status manually
