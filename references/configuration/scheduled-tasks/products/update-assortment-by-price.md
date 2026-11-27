# Update Assortment By Price

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/update-assortment-by-price

> Update product assortment based on price availability for markets and price lists

## Overview

This task updates product assortment flags based on whether valid prices exist for each market or price list. Products without valid prices for a specific market can be automatically excluded from that market's assortment, ensuring customers only see products that can actually be purchased.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `UpdateAssortmentByPriceScheduledTask` |
| **Group** | Products |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Automatic market filtering based on price availability
*   Products to be hidden in markets where no price exists
*   Price list-based product visibility
*   Dynamic assortment management driven by pricing data

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Iterates through all products in the catalog
2.  For each product, evaluates available prices across markets and price lists
3.  Updates the product's assortment flags based on price availability
4.  Products without valid prices for a market are excluded from that market's assortment

### Assortment Logic

A product is included in a market's assortment if:

*   At least one variant has a valid price for that market
*   The price is currently active (not expired)
*   The price list is applicable to that market

### Prerequisites

*   Products with prices must exist in the system
*   Markets must be configured
*   Price lists must be assigned to markets

### Side Effects

*   Updates assortment flags on products
*   May hide products from certain markets
*   Triggers product reindexing for affected products

* * *

## Example Configuration

```json
{
    "ImplementationType": "UpdateAssortmentByPriceScheduledTask",
    "Schedule": "0 3 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily after price import tasks complete (e.g., `0 3 * * *` at 3 AM). Run more frequently if prices change throughout the day and immediate visibility changes are required.

* * *

## Related Tasks

*   [Update Assortment By Store](update-assortment-by-store.md) - Updates assortment based on store assignment
*   [Product Lowest Price](product-lowest-price.md) - Calculates lowest prices for products
