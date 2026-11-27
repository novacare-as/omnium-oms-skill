# OmniumReorderSuggestion

Reorder suggestion for a SKU in a warehouse, calculated by Omnium from inventory levels and sales history.

**Fields:**

- `id`: string, nullable — Suggestion ID on the form "{SkuId}_{WarehouseCode}"
- `skuId`: string, nullable — Product SKU / Code / Variant / ID
- `warehouseCode`: string, nullable — Warehouse Code / ID
- `productName`: string, nullable — Product name
- `productId`: string, nullable — Product ID
- `ean`: string, nullable — EAN / GTIN
- `unit`: string, nullable — Product unit
- `supplierSkuId`: string, nullable — The product's SKU at the supplier
- `supplierId`: string, nullable — Supplier ID
- `supplierName`: string, nullable — Supplier name
- `inventory`: number (decimal) — Current inventory quantity
- `reservedInventory`: number (decimal) — Reserved inventory quantity
- `incomingQuantity`: number (decimal) — Incoming quantity from future deliveries (ATP)
- `calculatedInventory`: number (decimal) — Calculated inventory (used for packages where available inventory is calculated from components)
- `supplierInventory`: number (decimal), nullable — Inventory at the supplier's warehouse, if the supplier has an Omnium store
- `cost`: number (decimal) — Cost price per unit
- `costCurrency`: string, nullable — Currency of the cost price
- `location`: string, nullable — Item (warehouse) location
- `minQuantity`: number (decimal) — Minimum inventory quantity (reorder point). When 0, MinQuantitySuggestion is used instead.
- `maxQuantity`: number (decimal) — Maximum inventory quantity (order-up-to level)
- `reorderMinQuantity`: number (decimal) — Minimum number of items to order
- `minQuantitySuggestion`: number (decimal) — Sales-based reorder point suggestion: (LeadTime + LeadTimeSafetyMarginDays) * boosted average daily sales
- `supplierPackagingQuantity`: number (decimal) — Number of units per supplier package
- `reorderSuggestionSupplierPackages`: number (decimal) — Suggested number of supplier packages to order
- `leadTime`: integer (int32) — Lead time in days
- `leadTimeSafetyMarginDays`: integer (int32) — Safety margin added to the lead time, in days
- `defaultOrderIntervalDays`: integer (int32), nullable — The supplier's default order interval in days
- `averageDailyUnitSales`: number (decimal) — Average units sold per day in the sales period
- `boost`: number (decimal) — Percentage added to the average daily sales before the suggestion is calculated. 0 = no boost, 50 = +50%, -30 = -30%. The boost is one-time and is reset to 0 when the suggestion is released.
- `boostedAverageDailyUnitSales`: number (decimal) — Average daily unit sales with Boost applied - the demand figure the suggestion is calculated from
- `averageDailyUsageDays`: integer (int32) — Number of days in the sales period
- `averageDailyUsageFrom`: string (date-time), nullable — Start of the sales period used to calculate average daily sales
- `averageDailyUsageTo`: string (date-time), nullable — End of the sales period used to calculate average daily sales
- `totalSales`: number (decimal) — Total units sold in the sales period
- `reorderNeed`: number (decimal) — Calculated reorder need before minimum-order and packaging adjustments
- `reorderSuggestion`: number (decimal) — The calculated reorder suggestion
- `reorderQuantity`: number (decimal), nullable — Manual quantity override. When set, this is used instead of the calculated suggestion.
- `quantity`: number (decimal), nullable — The quantity to purchase: ReorderQuantity if set, otherwise ReorderSuggestion plus quantity from customer orders to purchase
- `ordersToPurchase`: number (decimal) — Quantity from customer orders marked for purchase
- `purchaseOrderId`: string, nullable — ID of the purchase order the suggestion has been added to
- `purchaseOrderLineItemId`: string, nullable — ID of the purchase order line the suggestion has been added to
- `created`: string (date-time) — When the suggestion was calculated

**Used directly by endpoints in:**

- [Purchase Orders | Reorder Suggestions](../endpoints/purchase-orders/reorder-suggestions.md)
