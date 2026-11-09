# Enrich Order Cost from Products

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-order-cost-from-products

> Set cost data on order line items from product information.

## Overview

The **Enrich Order Cost from Products** step retrieves cost information from the product catalog and sets it on order line items. This enables margin calculation and cost reporting.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichOrderCostFromProducts` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Retrieves cost data for all order line item SKUs from the product catalog
2.  Sets cost and cost total on line items
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have line items with SKU codes
*   Products must have cost information

### Side Effects

*   Line item `Cost` property set
*   Line item `CostTotal` calculated
*   Enables margin reporting

## Business Cases

### When to Use

*   **Margin reporting**: Need cost data for profit calculation
*   **Cost tracking**: Track cost of goods sold
*   **Early cost capture**: Capture cost at order time vs fulfillment

### Example Scenarios

**Scenario 1: Standard Order** Order has 5 items. Step retrieves product costs and sets them on each line item.

**Scenario 2: No Cost Data** Product doesn't have cost configured. Line item cost remains unset.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| Missing cost data | Success (invisible, partial) | Yes |

## Related Steps

*   [Enrich Order from Products](enrich-order-from-products.md) - General product enrichment
*   [Reduce Inventory](../inventory/reduce-inventory.md) - Also sets cost from inventory
