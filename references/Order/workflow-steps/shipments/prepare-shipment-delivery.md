# Prepare Shipment Delivery

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/prepare-shipment-delivery

> Send shipment preparation notification to the shipping provider.

## Overview

The **Prepare Shipment Delivery** step sends a preparation notification to the shipping provider before the actual shipment is completed. This pre-notifies carriers about upcoming shipments.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `PrepareShipmentDelivery` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies shipments that are not already Released, Shipped, or Cancelled
2.  If running at shipment level, only processes the current shipment
3.  For each eligible shipment:
    *   Sends a preparation notification to the shipping provider
4.  Returns success after processing

### Prerequisites

*   Shipments must exist and not be in final states
*   Shipping provider must support preparation notifications

### Side Effects

*   Shipping provider receives preparation notification
*   May generate preliminary tracking information
*   Prepares carrier for incoming shipment

## Business Cases

### When to Use

*   **Carrier pre-notification**: Alert carriers about shipments
*   **Same-day delivery**: Prepare carriers for urgent deliveries
*   **Scheduled pickups**: Notify carriers before pickup windows

### Example Scenarios

**Scenario 1: Standard Preparation** Order moves to Ship status. Step notifies carrier about incoming shipment before labels are printed.

**Scenario 2: Express Delivery** Same-day delivery order. Step pre-notifies carrier to ensure capacity.

**Scenario 3: Already Released** Shipment already released. Step skips as preparation already done.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No eligible shipments | Warning | Yes |
| Preparation successful | Success | Yes |
| Provider error | Error | Yes (doesn't cancel) |

## Related Steps

*   [Complete Shipment](complete-shipment.md) - Finalize the shipment
*   [Update Shipment Status](update-shipment-status.md) - Update status
