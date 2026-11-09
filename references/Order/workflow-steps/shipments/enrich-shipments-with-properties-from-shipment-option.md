# Enrich Shipments with Properties from Shipment Option

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/enrich-shipments-with-properties-from-shipment-option

> Copy configured properties from the shipment option to the shipment.

## Overview

The **Enrich Shipments with Properties from Shipment Option** step copies specified properties from the configured shipment option to the shipment. This enables automatic property inheritance from shipping method configuration.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichShipmentsWithPropertiesFromShipmentOption` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `PropertyKeys` | List (comma-separated) | Yes | \- | Property keys to copy from shipment option |

## Behavior

### What It Does

1.  Gets list of property keys from `PropertyKeys` configuration
2.  Identifies shipments to process:
    *   Uses current shipment if at shipment level
    *   Uses all shipments if at order level
3.  For each shipment:
    *   Looks up shipment option from market or shipping provider config
    *   Copies specified properties from option to shipment
4.  Uses `AddOrReplace` to update properties

### Prerequisites

*   `PropertyKeys` must be configured
*   Shipment option must exist for the shipment's method
*   Properties must exist on the shipment option

### Side Effects

*   Shipment properties updated
*   Copies default values from shipping configuration

## Business Cases

### When to Use

*   **Default values**: Inherit carrier-specific defaults
*   **Configuration sync**: Keep shipment in sync with option config
*   **Property propagation**: Copy settings to shipment for processing

### Example Scenarios

**Scenario 1: Carrier Code** Configure `PropertyKeys=CarrierCode,ServiceLevel`. Copies those properties from shipping option to shipment.

**Scenario 2: Multiple Properties** Configure `PropertyKeys=MaxWeight,InsuranceRequired,SignatureRequired`. All three copied to shipment.

**Scenario 3: Missing Property** Configured property doesn't exist on option. That property is skipped, others still copied.

**Scenario 4: No Property Keys** `PropertyKeys` not configured. Step returns warning.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No property keys | Warning | Yes |
| No shipments | Warning | Yes |
| Properties copied | Success | Yes |

## Related Steps

*   [Select Default Shipping Method](select-default-shipping-method.md) - Sets the shipping method
*   [Change Shipping Method](change-shipping-method.md) - Changes the method
