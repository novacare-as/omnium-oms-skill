# Add Shipment Info to Payment Provider

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/add-shipment-info-to-payment-provider

> Send shipment tracking information to payment providers that support it.

## Overview

The **Add Shipment Info to Payment Provider** step sends shipment tracking information (tracking numbers, carrier details) to payment providers. Some providers like Klarna use this information for buyer protection and dispute handling.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddShipmentInfoToPaymentProvider` |
| **Group** | Payments |
| **Applicable Statuses** | Ship, PickedUp, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies shipped shipments (by status or specific shipment)
2.  Retrieves active payments with captured amounts
3.  Gets shipment options configuration for the order's market
4.  For each captured payment, calls `UpdateWithShipmentTrackingInfo` on the payment provider
5.  Passes shipment options and shipped shipments to the provider

### Prerequisites

*   Order must have shipped shipments
*   Order must have active payments with captured amounts
*   Payment provider must support tracking info updates

### Side Effects

*   Updates payment provider with tracking information
*   This step is invisible (doesn't show in workflow history)
*   Failures are logged but don't fail the workflow

## Business Cases

### When to Use

*   **Klarna integration**: Klarna requires shipping info for buyer protection
*   **Dispute prevention**: Provide proof of delivery for payment disputes
*   **Provider requirements**: Some providers require tracking for certain payment types

### Example Scenarios

**Scenario 1: Klarna Shipment Update** Order paid with Klarna, shipped with tracking number. Step sends tracking info to Klarna API.

**Scenario 2: No Captured Amount** Payment is only authorized (not captured). Step skips this payment since no shipping info needed.

**Scenario 3: Multiple Shipments** Order has multiple shipped shipments. Step sends info for all shipped shipments.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipped shipments | Warning | Yes |
| No active payments | Success (invisible) | Yes |
| No captured payments | Success (invisible) | Yes |
| Update successful | Success (invisible) | Yes |
| Update failed | Success (logs warning) | Yes |

## Related Steps

*   [Capture Payments](capture-payments.md) - Capture must happen first
*   [Print Shipping Label](../shipments/print-shipping-label.md) - Creates tracking info sent by this step
