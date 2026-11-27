# Validate Tracking Number

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/validate-tracking-number

> Validate that shipments have tracking numbers assigned.

## Overview

The **Validate Tracking Number** step validates that all shipments have tracking numbers assigned. This ensures shipments can be tracked before completing the order.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ValidateTrackingNumber` |
| **Group** | Validation |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Gets shipments to validate:
    *   If shipment parameter provided, validates that single shipment
    *   If no shipment parameter, validates all order shipments
2.  For each shipment:
    *   Checks if `ShipmentTrackingNumber` is populated
3.  If any shipment lacks a tracking number:
    *   Returns error status
    *   Cancels workflow

### Prerequisites

*   Shipments should have tracking numbers from shipping provider

### Side Effects

*   May cancel workflow if validation fails

## Business Cases

### When to Use

*   **Pre-completion validation**: Ensure tracking before completing
*   **Customer communication**: Verify tracking available for notifications
*   **Carrier integration**: Validate carrier has provided tracking

### Example Scenarios

**Scenario 1: All Tracking Numbers Present** All shipments have tracking numbers. Validation passes.

**Scenario 2: Tracking Number Missing** One shipment missing tracking number. Workflow cancelled.

**Scenario 3: Single Shipment Validation** Workflow runs on specific shipment with tracking number. Validation passes.

**Scenario 4: No Shipments** Order has no shipments yet. Validation passes.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| All tracking numbers present | Success | Yes |
| Tracking number missing | Error | No (cancels workflow) |
| No shipments | Success | Yes |

## Related Steps

*   [Validate Serial Numbers](validate-serial-numbers.md) - Validate product serial numbers
*   [Print Shipping Label](../shipments/print-shipping-label.md) - Generate shipping labels with tracking
