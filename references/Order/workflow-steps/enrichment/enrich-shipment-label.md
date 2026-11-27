# Enrich Shipment Label

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-shipment-label

> Set shipping label on shipments from the shipping option configuration.

## Overview

The **Enrich Shipment Label** step sets the shipping label text on shipments based on the configured shipping option. This ensures shipments have proper label information for display and printing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichShipmentLabel` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Looks up shipping option for each shipment's method
2.  Sets `ShippingLabel` from the shipping option configuration
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have shipments with shipping methods
*   Shipping options must be configured with labels

### Side Effects

*   Shipment `ShippingLabel` property set
*   Label used for display and notifications
*   May affect packing slip generation

## Business Cases

### When to Use

*   **Label display**: Show proper shipping method name to customers
*   **Packing slips**: Include shipping method on documents
*   **Notifications**: Include shipping info in emails

### Example Scenarios

**Scenario 1: Standard Enrichment** Shipment has method "BRING\_SERVICEPAKKE". Step sets label "Bring Servicepakke" for display.

**Scenario 2: Multiple Shipments** Order has 3 shipments with different methods. Each gets appropriate label.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| Option not found | Success (invisible, falls back to shipping method name) | Yes |

## Related Steps

*   [Select Default Shipping Method](../shipments/select-default-shipping-method.md) - Sets method first
*   [Enrich Shipments with Properties](../shipments/enrich-shipments-with-properties-from-shipment-option.md) - More property enrichment
