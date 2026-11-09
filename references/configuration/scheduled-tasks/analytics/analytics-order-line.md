# Analytics Order Line

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/analytics-order-line

> Index order line analytics for sales reporting and analysis

## Overview

This task indexes analytics for order line items, providing detailed sales data for reporting and business intelligence. It processes orders modified since the last run and creates analytics records for each order line.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AnalyticsOrderLineScheduledTask` |
| **Group** | Analytics |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Detailed sales reporting by product
*   Order line-level analytics
*   Revenue breakdown analysis
*   Product performance tracking

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Checks if more than 5 days have passed since last run (skips if so)
2.  Retrieves orders modified since the last run (with 1-minute overlap for safety)
3.  Processes each order's line items
4.  Creates analytics records for reporting
5.  Supports cancellation for timeout management

### Gap Protection

If more than 5 days have passed since the last successful run, the task will skip execution and return a success status with a message indicating the skip. This prevents excessive processing after extended downtime and protects system resources.

### Prerequisites

*   Orders with line items must exist
*   Analytics indexing services must be configured

### Side Effects

*   Updates the analytics order line index
*   Gaps may occur in analytics if the task doesn't run for more than 5 days

* * *

## Lowest General Price and Extra Discount

Turn on **Lowest general price in analytics** under **Order settings → Statistics and analytics** (`OrderSettings.IsAnalyticsLowestGeneralPriceEnabled`, off by default). Order line indexing must also be on under **Platform → Analytics**. Each sales line then gets the price anyone could buy the item for on the order date, and the extra discount the line got below it. With a regular price of 1000, a campaign at 800 and an employee paying 600, the extra discount is 200.

### Which Price Counts

The lowest general price is the price the cart would charge a customer club member with no customer prices, in the order's store.

| Price on the product | Counts |
| --- | --- |
| Base price, price list and campaign prices | Yes |
| Customer club prices | Yes |
| Promotion prices without a customer group | Yes |
| Prices for the order's store or its store group | Yes |
| Prices for other stores | No |
| Customer and customer group prices | No |
| Prices from an external price service | No |

Among the prices that count, the one the cart would charge wins: a price in the line's unit first, then the store's own price, then its store group's, then the lowest. Only the prices on the product are read (or the price index for tenants with separate prices), never the price lists themselves.

### When It Is Looked Up

| Order age at the line's first index | Prices used | Source |
| --- | --- | --- |
| Up to 5 days | Prices valid on the order date, the base price included | `Current` |
| Older | Prices valid on the order date, the undated base price left out | `History` |
| No price found | The line's placed price | `PlacedPrice` |

*   A line keeps the value from its first index. A reindex never changes it, also while the setting is turned off.
*   To fill older orders, turn the setting on and use **Reindex now** for order lines under **Platform → Analytics**. That action reaches at most 100 days back.
*   How far back campaign prices are found depends on how long expired prices stay on the products (`DeleteExpiredPricesScheduledTask`) and on the promotion cleanup task.
*   A return line takes the value of its sale line.

### Fields

The fields are on the `OrderLine` object of an analytics order line, in custom reports for analytics order lines and in the public Analytics API.

| Field | Meaning |
| --- | --- |
| `LowestGeneralPrice`, `LowestGeneralPriceExclTax` | The lowest general price of one unit |
| `LowestGeneralPriceDate` | When the price was looked up |
| `LowestGeneralPriceSource` | `Current`, `History` or `PlacedPrice` |
| `LowestGeneralPriceTotal`, `LowestGeneralPriceTotalExclTax` | The price times the line's net quantity |
| `ExtraDiscount`, `ExtraDiscountExclTax` | (lowest general price − price per unit after line discounts) × net quantity. 0 for a cancelled order, negative on a return line |

* * *

## Example Configuration

```json
{
    "ImplementationType": "AnalyticsOrderLineScheduledTask",
    "Schedule": "*/10 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 10-15 minutes (`*/10 * * * *`) to maintain current order line analytics. Ensure the task runs at least once within any 5-day period to avoid skipping.

* * *

## Related Tasks

*   [Add Stats Orders](add-stats-orders.md) - Order statistics queue
*   [Analytics Interaction](analytics-interaction.md) - Customer interaction analytics
