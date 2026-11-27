# Change Shipping Method for Shipments Without Colli Products

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/change-shipping-method-name-for-shipments-without-colli-products

> Change shipping method for shipments that don't contain colli (bulky) products to reduce shipping costs.

## Overview

The **Change Shipping Method for Shipments Without Colli Products** step changes the shipping method for shipments that don't contain colli (bulky/oversized) products. This enables cost optimization by using cheaper shipping methods for standard-sized items.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeShippingMethodNameForShipmentsWithoutColliProducts` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `defaultShippingMethodName` | String | No | \- | The shipping method to use for non-colli shipments |

Note: Can also use `FallbackShippingMethodName` property on order lines.

## Behavior

### What It Does

1.  Gets the `defaultShippingMethodName` from configuration
2.  Also checks if any order lines have `FallbackShippingMethodName` property
3.  Looks up the shipping option for the market
4.  Evaluates shipments and changes shipping method only for those without colli products

### Prerequisites

*   Either `defaultShippingMethodName` configured or `FallbackShippingMethodName` on order lines
*   Shipping method must exist for the market

### Side Effects

*   Shipping method changed on qualifying shipments
*   Shipping label updated
*   May reduce shipping costs

## Business Cases

### When to Use

*   **Cost optimization**: Use cheaper methods for standard packages
*   **Carrier selection**: Different carriers for different package sizes
*   **Rate shopping**: Automatically select best rate for package type

### Example Scenarios

**Scenario 1: Standard Package Method** Order has furniture (colli) and accessories. Accessories shipment gets changed to cheaper "Standard Parcel" method.

**Scenario 2: No Colli Products** Entire order is standard products. All shipments get the cost-optimized method.

**Scenario 3: All Colli Products** Entire order is bulky items. No shipping method changes occur.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No default method configured | Success (no action) | Yes |
| Shipments changed | Success | Yes |
| No shipments to change | Success | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Change Shipping Method](change-shipping-method.md) - Direct method change
*   [Split All Colli Products to Separate Shipment](../allocation/split-colli-products-to-separate-shipment.md) - Split colli first
