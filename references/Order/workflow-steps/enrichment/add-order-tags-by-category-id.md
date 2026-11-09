# Add Order Tags by Category ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/add-order-tags-by-category-id

> Add tags to orders based on product category membership.

## Overview

The **Add Order Tags by Category ID** step adds a specific tag to orders that contain products from configured categories. This enables category-based order routing and processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddOrderTagsByCategoryId` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `categoryIds` | String | Yes | \- | Comma-separated category IDs to match |
| `tag` | String | Yes | \- | Tag to add if products match |

## Behavior

### What It Does

1.  Gets `categoryIds` and `tag` from configuration
2.  Collects SKU codes from all order line items
3.  Looks up products for those SKUs
4.  Checks if any product belongs to configured categories
5.  If match found, adds the configured tag to order
6.  Deduplicates order tags

### Prerequisites

*   `categoryIds` must be configured
*   `tag` must be configured
*   Products must have category information

### Side Effects

*   Tag added if products match categories
*   Tags deduplicated

## Business Cases

### When to Use

*   **Category routing**: Route orders by product category
*   **Special handling**: Tag orders with specific product types
*   **Fulfillment rules**: Identify orders needing special processing

### Example Scenarios

**Scenario 1: Hazmat Category** Configure `categoryIds=HAZMAT,FLAMMABLE` and `tag=HAZMAT_ORDER`. Orders with hazmat products get tagged.

**Scenario 2: No Match** Order contains only standard products. No tag added.

**Scenario 3: Multiple Categories** Configure multiple categories. If any product matches any category, tag is added.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| categoryIds missing | Error | Yes |
| tag missing | Error | Yes |
| No matching products | Success (no tag) | Yes |
| Tag added | Success | Yes |

## Related Steps

*   [Add Order Tags by SKU ID](add-order-tags-by-sku-id.md) - SKU-based tagging
*   [Add Order Tags](add-order-tags.md) - Default tags
