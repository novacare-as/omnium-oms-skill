# Purchase Orders

Source: https://docs.omnium.no/docs/PurchaseOrders

> Manage procurement in Omnium — create purchase orders, track supplier deliveries, handle goods reception, and reserve customer orders against incoming stock.

Purchase orders in Omnium represent orders placed with suppliers to replenish inventory. They support the full procurement lifecycle — from creating orders based on reorder suggestions, through supplier confirmation, to goods reception at the warehouse.

Purchase orders can also represent **internal transfers** between warehouses, where one warehouse acts as the supplier for another.

* * *

## In this section

*   [API Reference](PurchaseOrders/purchase-order-api.md) — Create, update, and manage purchase orders via the API
*   [Configuration](PurchaseOrders/purchase-order-config.md) — Purchase order types, statuses, and settings
*   [Reservations](PurchaseOrders/purchase-order-reservations.md) — How customer orders are reserved against incoming purchase order stock
*   [Suppliers](PurchaseOrders/Suppliers.md) — Supplier management, API, configuration, and ERP integration
*   [Deliveries](PurchaseOrders/Deliveries.md) — Goods reception, delivery tracking, and warehouse receiving

* * *

## Reorder suggestions and time in stock

Reorder suggestions are calculated per SKU and warehouse from the sales in the sales period (100 days unless `AverageDailyUsageDays` is set). The average daily sales is the total sales divided by the days of the period. An item that was sold out for most of the period therefore looks like a slow seller, and its suggestion is too low.

Each suggestion also shows how the item was stocked in the period, worked out from the inventory transactions when the suggestion is indexed: the days in and out of stock, how often and when it sold out, how long the last lot lasted, and since when the current stock has been in stock. From these it calculates the sales per day in stock:

```
InStockAverageDailyUnitSales = TotalSales / DaysInStock
```

| Mode | Daily sales the suggestion uses |
| --- | --- |
| `ReorderSuggestionsUseInStockSales` off (default) | `AverageDailyUnitSales`. The time in stock is shown, and the purchaser can apply a one-time boost from the in-stock rate on a row. |
| `ReorderSuggestionsUseInStockSales` on | `InStockAverageDailyUnitSales` for items in stock for at least `ReorderSuggestionsMinDaysInStock` days (14 when not set), `AverageDailyUnitSales` for the rest. |

The rate the suggestion uses is stored as `DemandDailyUnitSales`, and the boost is applied on top of it. The reorder suggestion list can be filtered to items sold out in the period and sorted by days out of stock. The public API returns the same fields on `OmniumReorderSuggestion`.

See [time in stock](configuration/scheduled-tasks/analytics/analytics-reorder-suggestions.md#time-in-stock) for how each figure is calculated, and [Configuration](PurchaseOrders/purchase-order-config.md#reorder-suggestions) for the settings.
