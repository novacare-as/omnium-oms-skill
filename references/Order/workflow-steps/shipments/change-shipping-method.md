# Change Shipping Method

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/change-shipping-method

> Change the shipping method for shipments to a specified method.

## Overview

The **Change Shipping Method** step changes the shipping method for shipments to a method specified in the configuration. It supports conditional changes based on warehouse/pickup location matching.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeShippingMethod` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `DefaultShippingMethodName` | String | Yes | \- | The shipping method to change to |
| `ConditionPickupEqualsWarehouse` | Boolean | No | `false` | Only change if pickup location equals warehouse |
| `ConditionPickupNotEqualsWarehouse` | Boolean | No | `false` | Only change if pickup location differs from warehouse |

## Behavior

### What It Does

1.  Gets the configured `DefaultShippingMethodName` from properties
2.  Looks up the shipping option for the market
3.  If running at shipment level, processes only the current shipment
4.  If running at order level, processes all shipments based on conditions:
    *   If `ConditionPickupEqualsWarehouse` is true, only changes when WarehouseCode == PickUpWarehouseCode
    *   If `ConditionPickupNotEqualsWarehouse` is true, only changes when they differ
5.  Updates `ShippingMethodName` and `ShippingLabel` on matching shipments

### Prerequisites

*   Shipping method must exist for the market
*   Shipments must not already have the target method

### Side Effects

*   Shipment shipping method name updated
*   Shipping label updated
*   May affect shipping costs

## Business Cases

### When to Use

*   **Click-and-collect**: Change method when customer picks up at store
*   **Warehouse-specific methods**: Different methods for different warehouses
*   **Override default**: Force specific shipping method

### Example Scenarios

**Scenario 1: Force Specific Method** Configure `DefaultShippingMethodName=EXPRESS`. All shipments get EXPRESS method.

**Scenario 2: Pickup at Store** Configure with `ConditionPickupEqualsWarehouse=true`. Only shipments picking up at their warehouse get the method changed.

**Scenario 3: Ship from Different Location** Configure with `ConditionPickupNotEqualsWarehouse=true`. Changes method only when shipping from a different location than pickup.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No default method configured | Success (no action) | Yes |
| Shipping option not found | Success (no action) | Yes |
| Change successful | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Select Default Shipping Method](select-default-shipping-method.md) - Automatic selection
*   [Change Shipping Method for Non-Colli](change-shipping-method-name-for-shipments-without-colli-products.md) - Conditional change
