# Analytics Reorder Suggestions

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/analytics-reorder-suggestions

> Generate product reorder suggestions based on sales patterns

## Overview

This task generates product reorder suggestions by analyzing historical sales data and current inventory levels. It performs a full reindex of all reorder suggestions, making it suitable for periodic complete recalculations.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AnalyticsReorderSuggestionsScheduledTask` |
| **Group** | Analytics |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Automatic inventory replenishment recommendations
*   Purchase order planning assistance
*   Stock level optimization
*   Demand forecasting support

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Analyzes historical sales data across all products
2.  Reads the inventory transactions of each batch of SKUs in every warehouse for the sales period, and works out how many days of the period each SKU was in stock (see [Time in stock](analytics-reorder-suggestions.md#time-in-stock))
3.  Calculates reorder points based on sales velocity
4.  Compares current inventory levels against calculated minimums
5.  Generates reorder suggestions for products below threshold
6.  Indexes all suggestions for access via API and UI

### Time in stock

Every suggestion carries how its SKU was stocked in the warehouse during the sales period. The figures come from the inventory transactions, so nothing extra is written when stock changes.

| Field | Meaning |
| --- | --- |
| `DaysInStock` | Days of the sales period with stock above 0 at some point in the day. The day an item sells out counts as in stock, so its sales are not lost. |
| `DaysOutOfStock` | Days of the sales period with no stock above 0. Together with `DaysInStock` it adds up to the days of the period up to now. |
| `StockOutCount` | Times the stock went from above 0 to 0 or below in the period. |
| `LastStockOutDate` | When the stock last went to 0 or below in the period. |
| `LastSellThroughDays` | Days in stock of the lot that sold out last, from its restock to the sell-out. A lot that was in stock when the period started is counted from the start of the period. |
| `InStockSince` | When the current stock last went from 0 to above 0, or the start of the period when it was in stock all period. |
| `SoldOutInPeriod` | True when the item sold out in the period, or was out of stock for some days and in stock for others. An item not in stock on any day of the period is not counted. |
| `InStockAverageDailyUnitSales` | Total sales divided by `DaysInStock`. 0 when the item was not in stock in the period. |
| `DemandDailyUnitSales` | The daily sales the suggestion is calculated from, before boost. |

Out of stock means a physical level of 0 or below; reservations are not counted. Days follow the tenant's time zone. Transactions that only change the reservation are skipped, and transactions without a transaction type are included. Only the transactions of the sales period are read; for a SKU with none, the first transaction after the period gives the level the period had.

The figures are empty when the warehouse has neither an inventory item nor inventory transactions for the SKU. When the transactions cannot be read, a suggestion keeps the figures it has from the last run that read them.

By default the figures are shown only. When the purchase order setting `ReorderSuggestionsUseInStockSales` is on, `DemandDailyUnitSales` is the sales per day in stock for SKUs that were in stock for at least `ReorderSuggestionsMinDaysInStock` days (14 when not set), so days an item was sold out do not lower its suggestion. Otherwise it is `AverageDailyUnitSales`. See [Purchase order configuration](../../../PurchaseOrders/purchase-order-config.md#reorder-suggestions).

### Prerequisites

*   Historical order data must exist for accurate suggestions
*   Inventory levels must be tracked in the system
*   Products must have sales history for meaningful recommendations

### Side Effects

*   Rebuilds the entire reorder suggestions index
*   Previous suggestions are replaced with newly calculated ones
*   Reads the inventory transactions of the sales period once per batch of SKUs, with only the fields the calculation uses
*   Resource-intensive operation that may impact system performance

* * *

## Example Configuration

```json
{
    "ImplementationType": "AnalyticsReorderSuggestionsScheduledTask",
    "Schedule": "0 4 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 4 * * *` - 4:00 AM) as this is a resource-intensive full reindex operation. For more frequent updates, use the delta version instead.

* * *

## Related Tasks

*   [Analytics Reorder Suggestions Delta](analytics-reorder-suggestions-delta.md) - Incremental updates
*   [Supplier Reorder Suggestions](../inventory/supplier-reorder-suggestions.md) - Supplier-specific suggestions
