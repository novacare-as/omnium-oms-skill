# Popularity Sort Index

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/popularity-sort-index

> Calculate product popularity scores based on sales data for improved search and sorting

## Overview

This task calculates popularity scores for products based on sales performance over the last 30 days. The scores enable sorting products by popularity in search results, category pages, and product listings. Popularity is calculated both globally and per market, allowing for market-specific popularity sorting.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `PopularitySortIndexScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Popularity-based product sorting in search results
*   "Best Sellers" or "Trending" product lists
*   Market-specific popularity rankings
*   Improved product discovery based on actual sales data

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Retrieves top-selling products from the recommendations engine for the last 30 days
2.  For each configured market:
    *   Fetches market-specific top sellers (up to 10,000 products)
    *   Updates each product's market-specific popularity score
    *   Only updates products where the score has actually changed
3.  Calculates a global popularity score across all markets
4.  Updates products in batches of 500 for efficiency

### Popularity Score

The popularity score is derived from the recommendations engine's sales analysis:

*   Higher scores indicate more popular products
*   Scores are relative to other products in the catalog
*   Market-specific scores allow products to rank differently in different markets

### Prerequisites

*   Recommendations engine must be configured and have sales data
*   Markets must be configured in the system
*   Products must exist in the product index

### Side Effects

*   Updates market-specific popularity scores on products
*   Updates global popularity scores on products
*   Triggers product reindexing for updated products

* * *

## Example Configuration

```json
{
    "ImplementationType": "PopularitySortIndexScheduledTask",
    "Schedule": "0 4 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (e.g., `0 4 * * *` at 4 AM). Popularity scores typically do not change dramatically within a day, so more frequent runs are usually unnecessary.

* * *

## Related Tasks

*   [Analytics Order Line](../analytics/analytics-order-line.md) - Provides the order data used for popularity calculations
