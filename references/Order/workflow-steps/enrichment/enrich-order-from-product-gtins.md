# Enrich Order from Product GTINs

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-order-from-product-gtins

> Lookup products by GTIN and enrich order line items.

## Overview

The **Enrich Order from Product GTINs** step looks up products using GTIN (Global Trade Item Number) codes in order line items and enriches them with product data. This is useful when orders only have barcode/GTIN information.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichOrderFromProductGtins` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Uses GTIN codes from line items to lookup products in the product catalog
2.  Enriches line items with found product information
3.  Can run at shipment level to process specific shipment's lines
4.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order line items must have GTIN/barcode codes
*   Products must be indexed with GTIN information

### Side Effects

*   Line items enriched with product data based on GTIN lookup
*   SKU codes may be populated from GTIN match
*   Product names and properties set

## Business Cases

### When to Use

*   **Barcode scanning**: Orders created by scanning products
*   **POS integration**: POS uses GTINs instead of SKUs
*   **External imports**: Source system uses GTINs

### Example Scenarios

**Scenario 1: Barcode Order** Order created from barcode scan has GTINs. Step looks up products and populates full details.

**Scenario 2: Mixed Data** Some items have SKU, some have GTIN only. Step enriches GTIN items.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| GTIN not found | Success (invisible, partial) | Yes |

## Related Steps

*   [Enrich Order from Products](enrich-order-from-products.md) - SKU-based enrichment
