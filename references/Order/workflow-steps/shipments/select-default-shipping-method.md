# Select Default Shipping Method

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/select-default-shipping-method

> Set shipping method based on market configuration and shipping options.

## Overview

The **Select Default Shipping Method** step sets the shipping method for shipments based on the configured shipping options for the order's market. It uses the shipping service to determine the appropriate default method.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SelectDefaultShippingMethod` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties. Shipping method selection is based on market configuration.

## Behavior

### What It Does

1.  If running at shipment level:
    *   Validates shipment is not already shipped
    *   Sets the default shipping method for the shipment based on market configuration
2.  If running at order level:
    *   Iterates through all shipments
    *   Sets the default shipping method for each shipment based on market configuration

### Prerequisites

*   Order must have shipments
*   Market must have shipping options configured
*   Shipments must not be already shipped

### Side Effects

*   Shipping method name set on shipments
*   Shipping label updated
*   Shipping costs may be calculated

## Business Cases

### When to Use

*   **New orders**: Assign appropriate shipping method based on market
*   **After allocation**: Set method based on warehouse location
*   **Method reset**: Reapply default shipping logic

### Example Scenarios

**Scenario 1: Standard Selection** New order created. Step evaluates market shipping options and selects the best default method.

**Scenario 2: Per-Shipment Selection** Order split into multiple shipments. Each shipment gets appropriate shipping method.

**Scenario 3: Already Shipped** Shipment already shipped. Step skips with warning.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Already shipped | Warning | Yes |
| No shipments | Warning | Yes |
| Selection successful | Success | Yes |
| Selection failed | Warning (logged) | Yes |

## Related Steps

*   [Change Shipping Method](change-shipping-method.md) - Override with specific method
*   [Create Default Shipment](create-default-shipment.md) - Create shipment first
