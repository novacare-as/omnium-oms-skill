# Enrich Order Line with Location

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-order-line-with-location

> Add warehouse location information to order line items.

## Overview

The **Enrich Order Line with Location** step adds warehouse location information to order line items. This enables pick list generation with shelf locations for warehouse staff.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichOrderLineWithLocation` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Looks up warehouse location for each line item's SKU
2.  Sets location information on line items
3.  Can run at shipment level to process specific shipment's lines
4.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have line items with SKUs
*   Warehouse locations must be configured for products

### Side Effects

*   Line item location properties set
*   Enables pick path optimization
*   Supports pick list generation

## Business Cases

### When to Use

*   **Pick list generation**: Include shelf locations
*   **Warehouse picking**: Guide staff to product locations
*   **Pick path optimization**: Sort by location for efficiency

### Example Scenarios

**Scenario 1: Standard Picking** Order has 5 items. Step enriches each with warehouse location (aisle, shelf, bin).

**Scenario 2: Shipment Level** Processing specific shipment. Only that shipment's lines get location data.

**Scenario 3: No Location Data** Product doesn't have location configured. Line item location remains empty.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| No location data | Success (invisible, partial) | Yes |

## Related Steps

*   [Enrich Order from Products](enrich-order-from-products.md) - General product enrichment
*   [Update Shipment Status](../shipments/update-shipment-status.md) - Status for picking
