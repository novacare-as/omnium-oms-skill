# Product Lowest Price

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/product-lowest-price

> Calculate and update the lowest available price for each product across all variants

## Overview

This task calculates and updates the lowest price for each product by analyzing all variant prices. This enables accurate price filtering, sorting by price, and displaying "from" prices on product listings without needing to query all variants in real-time.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ProductLowestPriceScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   "From price" display on product listings
*   Price range filtering in search
*   Sorting products by price
*   Accurate minimum price across all variants

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Iterates through all products in the catalog
2.  For each product, examines all variant prices
3.  Calculates the lowest available price across all variants
4.  Updates the product's lowest price field
5.  Reports the total number of products updated

### Price Calculation

The lowest price calculation considers:

*   All active variants
*   All price lists and currencies
*   Current promotional prices where applicable

### Prerequisites

*   Products with variants and prices must exist in the system
*   Price data must be up-to-date

### Side Effects

*   Updates the lowest price field on products
*   Triggers product reindexing for updated products

* * *

## Example Configuration

```json
{
    "ImplementationType": "ProductLowestPriceScheduledTask",
    "Schedule": "0 2 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily after price imports or updates (e.g., `0 2 * * *` at 2 AM). If prices change frequently throughout the day, consider running every few hours.

* * *

## Related Tasks

*   [Remove Unmodified Prices](remove-unmodified-prices.md) - Cleans up stale customer-specific prices
*   [Update Assortment By Price](update-assortment-by-price.md) - Updates assortment based on price availability
