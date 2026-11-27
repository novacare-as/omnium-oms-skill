# Shipment Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/shipments

> Workflow steps for managing return shipments and labels.

## Overview

Shipment workflow steps handle the logistics of return processing, including creating return shipping labels and completing shipment records.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Create Return Shipment Booking](shipments/create-return-shipment-booking.md) | `CreateReturnShipmentBooking` | Book return shipment and generate label |
| [Complete Shipment](shipments/complete-shipment.md) | `CompleteShipment` | Mark return shipment as completed |

## Return Label Creation

The `CreateReturnShipmentBooking` step:

1.  Books a return shipment with the configured shipping provider
2.  Generates a return shipping label
3.  Stores tracking information on the return

This step only executes if the return was created with the `CreateReturnLabel` property set to "true".

## Shipment Completion

The `CompleteShipment` step marks return shipments as completed and can notify shipping providers of the final status. This is typically used when items are received at the warehouse.
