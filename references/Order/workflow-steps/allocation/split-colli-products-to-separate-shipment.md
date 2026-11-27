# Split Colli Products to Separate Shipment

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/split-colli-products-to-separate-shipment

> Move order lines with colli (multi-package) products to a separate shipment.

## Overview

The **Split Colli Products to Separate Shipment** step identifies order lines containing products with colli (multiple packages/parcels) and moves them to a separate shipment. This ensures that multi-package items are handled appropriately for shipping label generation and tracking.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SplitAllColliProductsToSeparateShipment` |
| **Group** | Shipments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies all order lines where the product has colli (multiple packages)
2.  Creates a new shipment for colli products
3.  Moves the identified order lines to the new shipment
4.  Creates package entries for each colli on the shipment

### Prerequisites

*   Products must have colli information defined
*   Order must have shipments

### Side Effects

*   Creates new shipment(s) for colli products
*   Moves order lines between shipments
*   Creates package entries on the new shipment

## Business Cases

### When to Use

*   **Large items**: Furniture or appliances that ship as multiple boxes
*   **Shipping label requirements**: When colli items need separate labels per package
*   **Carrier requirements**: When multi-package shipments need special handling

### Example Scenarios

**Scenario 1: Furniture Order** A sofa (3 colli) and a lamp (1 colli) are ordered together. The sofa moves to a separate shipment with 3 packages configured, while the lamp stays on the original shipment.

**Scenario 2: Mixed Order** An order with regular items and one colli item - only the colli item is split to enable proper multi-package shipping labels.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No colli products found | Warning | Yes |
| Products split successfully | Success | Yes |

## Related Steps

*   [Split Order Lines with Colli Products](split-order-lines-with-colli-products.md) - Splits colli lines to quantity 1
*   [Create Shipment Packages Based on Product Colli](../shipments/create-shipment-packages-based-on-product-colli.md) - Creates packages without moving lines
