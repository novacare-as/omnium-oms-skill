# Validate Colli Count

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/validate-colli-count

> Validate that shipments with mandatory colli count have it set.

## Overview

The **Validate Colli Count** step validates that shipments using shipping methods with mandatory colli (package) count have the count properly set. This ensures accurate package information for carriers.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ValidateColliCount` |
| **Group** | Validation |
| **Applicable Statuses** | InProgress |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Iterates through all order shipments
2.  For each shipment:
    *   Gets the shipment option for the shipping method
    *   Checks if `NumberOfCollisMandatory` is true
    *   If mandatory, checks if `NumberOfCollis` is greater than 0
3.  If any shipment has mandatory colli count but it's missing (0):
    *   Returns error status
    *   Cancels workflow

### Prerequisites

*   Shipment options must be configured with `NumberOfCollisMandatory` flag
*   Shipments must have shipping method assigned

### Side Effects

*   May cancel workflow if validation fails

## Business Cases

### When to Use

*   **Carrier requirements**: Ensure package count for carriers requiring it
*   **Freight shipments**: Validate pallet/package counts for LTL
*   **Multi-package orders**: Ensure accurate package counts

### Example Scenarios

**Scenario 1: Colli Count Set** Shipment uses method requiring colli count. `NumberOfCollis=3`. Validation passes.

**Scenario 2: Colli Count Missing** Shipment uses method requiring colli count. `NumberOfCollis=0`. Workflow cancelled.

**Scenario 3: Not Required** Shipment uses method where colli count is optional. Validation passes regardless of count.

**Scenario 4: No Shipments** Order has no shipments. Validation passes.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Colli count set (when required) | Success | Yes |
| Colli count missing (when required) | Error | No (cancels workflow) |
| Colli count not required | Success | Yes |
| No shipments | Success | Yes |

## Related Steps

*   [Validate Tracking Number](validate-tracking-number.md) - Validate shipment tracking
*   [Create Shipment Packages Based On Product Colli](../shipments/create-shipment-packages-based-on-product-colli.md) - Create packages from colli info
