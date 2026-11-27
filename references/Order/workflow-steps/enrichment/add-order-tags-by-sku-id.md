# Add Order Tags by SKU ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/add-order-tags-by-sku-id

> Add tags to orders based on specific product SKUs.

## Overview

The **Add Order Tags by SKU ID** step adds a specific tag to orders that contain configured product SKUs. This enables SKU-based order tagging for special product handling.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddOrderTagsBySkuId` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `productIds` | String | Yes | \- | Comma-separated SKU IDs to match |
| `tag` | String | Yes | \- | Tag to add if products match |

## Behavior

### What It Does

1.  Gets `productIds` and `tag` from configuration
2.  Parses comma-separated product IDs into list
3.  Checks if any order line item code matches configured IDs
4.  If match found, adds the configured tag to order
5.  Deduplicates order tags

### Prerequisites

*   `productIds` must be configured
*   `tag` must be configured

### Side Effects

*   Tag added if order contains matching SKUs
*   Tags deduplicated

## Business Cases

### When to Use

*   **Specific product handling**: Tag orders with particular products
*   **Promotional items**: Identify orders with promotional SKUs
*   **Restricted items**: Flag orders with age-restricted products

### Example Scenarios

**Scenario 1: Promotional SKU** Configure `productIds=PROMO-001,PROMO-002` and `tag=HAS_PROMO`. Orders with promotional items get tagged.

**Scenario 2: No Match** Order doesn't contain configured SKUs. No tag added.

**Scenario 3: Restricted Product** Configure `productIds=ALCOHOL-001` and `tag=AGE_VERIFICATION`. Orders with alcohol get flagged.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| productIds missing | Error | Yes |
| tag missing | Error | Yes |
| No matching products | Success (no tag) | Yes |
| Tag added | Success | Yes |

## Related Steps

*   [Add Order Tags by Category ID](add-order-tags-by-category-id.md) - Category-based tagging
*   [Add Order Tags](add-order-tags.md) - Default tags
