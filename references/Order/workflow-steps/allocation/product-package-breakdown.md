# Product Package Breakdown

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/product-package-breakdown

> Break down bundled or packaged products into their individual component products.

## Overview

The **Product Package Breakdown** step expands bundled or packaged products into their individual components on the order. This is essential for accurate inventory tracking and fulfillment when products are stored and shipped as individual items rather than pre-assembled bundles.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ProductPackageBreakDown` |
| **Group** | Modify |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Identifies all line items that are bundles or packages
2.  Expands each package into its individual component products
3.  Creates new order lines for each component product
4.  Marks the original package line as "broken down"

### Prerequisites

*   Products must have component definitions configured in the product catalog
*   Order must have line items with package or bundle products

### Side Effects

*   Adds new order lines for component products
*   Modifies the original package line item to indicate it has been broken down
*   May affect order totals if component pricing differs from package pricing

## Business Cases

### When to Use

*   **Component-level inventory**: When inventory is tracked at the component level, not the bundle level
*   **Mixed fulfillment**: When bundle components may ship from different warehouses
*   **Partial fulfillment**: When you need to ship available components and backorder others

### Example Scenarios

**Scenario 1: Gift Set Breakdown** A "Gift Set" product contains a shirt, tie, and cufflinks. Breaking it down allows each item to be picked from its respective location in the warehouse.

**Scenario 2: Kit Assembly** A computer kit contains CPU, RAM, and storage. After breakdown, inventory is decremented for each individual component.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No packages to break down | Success | Yes |
| Successful breakdown | Success | Yes |
| Missing component definitions | Success (skips item) | Yes |

## Related Steps

*   [Reset All Package Components](reset-all-package-components.md) - Reverses this operation
*   [Split Order Lines with Colli Products](split-order-lines-with-colli-products.md) - Handles colli-specific splitting
