# Try Map Shipment Description to Pickup Point

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/try-map-shipment-description-to-pickup-point

> Map shipment description data to pickup point information.

## Overview

The **Try Map Shipment Description to Pickup Point** step attempts to map shipment description information to a pickup point. This is used for specialized shipping integrations where pickup point data needs to be extracted or mapped.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryMapShipmentDescriptionToPickUpPoint` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Attempts to parse and map pickup point data from shipment description
2.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have shipment with description data
*   Pickup point mapping logic must be configured

### Side Effects

*   Pickup point data may be updated on shipment
*   Shipping address may be enriched

## Business Cases

### When to Use

*   **Pickup point integration**: Map carrier pickup point codes
*   **Address enrichment**: Extract address details from description
*   **Specialized carriers**: Handle carrier-specific pickup data

### Example Scenarios

**Scenario 1: Pickup Point Code** Shipment description contains pickup point code. Step maps to full pickup point address.

**Scenario 2: No Mapping Needed** Shipment doesn't have pickup point data. Step completes without changes.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Mapping successful | Success (invisible) | Yes |
| No mapping needed | Success (invisible) | Yes |

## Related Steps

*   [Set Pickup Warehouse Code](set-pickup-warehouse-code.md) - Set pickup location
*   [Enrich Shipment Label](../enrichment/enrich-shipment-label.md) - Enrich shipment data
