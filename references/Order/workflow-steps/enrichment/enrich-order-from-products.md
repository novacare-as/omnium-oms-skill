# Enrich Order from Products

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-order-from-products

> Populate order line items with product details from the product catalog.

## Overview

The **Enrich Order from Products** step retrieves product information from the catalog and enriches order line items with that data. This ensures orders have complete product details for fulfillment and reporting.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichOrderFromProducts` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Retrieves product data for all order line item SKUs from the product catalog
2.  Enriches line items with product information (name, description, images, etc.)
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have line items with SKU codes
*   Products must exist in the catalog

### Side Effects

*   Order line items enriched with product data
*   Product names, descriptions, and properties copied to lines
*   May set additional line item properties from products

## Business Cases

### When to Use

*   **POS orders**: POS sends minimal data, need full product info
*   **API imports**: External orders need product enrichment
*   **Cart conversion**: Ensure cart data has latest product info

### Example Scenarios

**Scenario 1: POS Order** POS order has SKU codes only. Step retrieves full product names, prices, and images for order display.

**Scenario 2: Missing Product** Product doesn't exist for a SKU. Line item may remain incomplete.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| Products not found | Success (invisible, partial) | Yes |

## Related Steps

*   [Enrich Order Cost from Products](enrich-order-cost-from-products.md) - Enrich cost data
*   [Enrich Order from Product GTINs](enrich-order-from-product-gtins.md) - GTIN-based lookup
