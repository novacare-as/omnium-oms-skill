# Validate Serial Numbers

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/validate-serial-numbers

> Validate that serializable products have serial numbers assigned.

## Overview

The **Validate Serial Numbers** step validates that all order line items marked as serializable products have serial numbers assigned. This ensures proper tracking for serialized inventory.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ValidateSerialNumbers` |
| **Group** | Validation |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Iterates through all order line items
2.  For each line item:
    *   Checks if `IsSerializableProduct` is true
    *   If serializable, checks if `SerialNumber` is populated
3.  If any serializable product lacks a serial number:
    *   Returns error status
    *   Cancels workflow

### Prerequisites

*   Order line items must have `IsSerializableProduct` flag set correctly
*   Serial numbers should be assigned during fulfillment

### Side Effects

*   May cancel workflow if validation fails

## Business Cases

### When to Use

*   **Pre-ship validation**: Ensure serial numbers before shipping
*   **Warranty tracking**: Validate serial numbers for warranty registration
*   **Regulatory compliance**: Ensure serialized products are tracked

### Example Scenarios

**Scenario 1: All Serial Numbers Present** All serializable products have serial numbers. Validation passes.

**Scenario 2: Serial Number Missing** Electronics order with `IsSerializableProduct=true` but no serial number. Workflow cancelled.

**Scenario 3: No Serializable Products** Order contains only non-serializable products. Validation passes.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| All serial numbers present | Success | Yes |
| Serial number missing | Error | No (cancels workflow) |
| No serializable products | Success | Yes |
| No line items | Success | Yes |

## Related Steps

*   [Validate Tracking Number](validate-tracking-number.md) - Validate shipment tracking
*   [Validate Order](validate-order.md) - General order validation
