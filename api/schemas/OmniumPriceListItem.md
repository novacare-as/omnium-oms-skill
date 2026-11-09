# OmniumPriceListItem

Represents an individual item in a price list within the OMS

**Fields:**

- `priceListId`: string, required — The Id of the price list this item is linked to
- `skuId`: string, nullable — Optional: If the price list item should apply on variant level, specify the sku id.
- `productId`: string, nullable — If skuId is provided, this will be calculated. If not, the priceListItem will apply on product level, and the ProductId is requred.
- `unitPrice`: number (decimal) — The unit price of the item
- `cost`: number (decimal) — The cost price in cost currency
- `costInPriceListCurrency`: number (decimal) — Calculated: The cost price in the price lists currency
- `costCurrencyCode`: string, nullable — Optional per-item override for the cost currency. When set, the price-list-level cost currency is ignored for this item. If provided without CostCurrencyExchangeRate, the rate is resolved server-side via the currency service.
- `costCurrencyExchangeRate`: number (decimal), nullable — Optional per-item override for the cost currency exchange rate to the price list currency. When omitted but CostCurrencyCode is set, the rate is resolved server-side via the currency service.
- `name`: string, nullable — Name of the price list item
- `created`: string (date-time), nullable — Time the item was created
- `discount`: number (decimal) — The discount for the price list item
- `discountPercent`: number (decimal) — Calculated: The given discount in percentage
- `discountedPrice`: number (decimal) — Calculated: UnitPrice - Discount
- `profit`: number (decimal) — Calculated: UnitPriceExTax - CostInPriceListCurrency
- `profitPercent`: number (decimal) — Calculated: Profit/Cost
- `profitMargin`: number (decimal) — Calculated: Profit/UnitPriceExTax
- `isActive`: boolean, nullable — Calculated: True if the price is activated for the sku. Is set to active when price list is activated.
- `id`: string, nullable — Calculated: {PricelistId}_{SkuId}
- `taxRate`: number (decimal), nullable — Optional tax rate override for this item. If null, the price list's tax rate is used. Useful when specific products have a different tax rate than the price list default (e.g. 0% for used goods).
- `tags`: List<string>, nullable, max length 250 — Tags for categorizing/labeling price list items (e.g. "Last Chance", "Clearance"). Downstream systems can use these tags for display logic.
- `costDiscount`: number (decimal) — Cost discount amount
- `costDiscountPercent`: number (decimal) — Calculated: Cost discount as percentage
- `discountedCost`: number (decimal) — Calculated: Cost after discount
- `unitPriceBase`: number (decimal) — Calculated: Base unit price before adjustments
- `storeCostPrice`: number (decimal) — Store cost price in price list currency
- `storeCostDiscount`: number (decimal) — Store cost discount amount, in price list currency
- `storeCostDiscountPercent`: number (decimal) — Calculated: Store cost discount as percentage of StoreCostPrice
- `storeDiscountedCostPrice`: number (decimal) — Calculated: Store cost price after the store cost discount
- `storeCostPriceAdditionPercent`: number (decimal) — Calculated: the addition on discounted cost that the store cost price represents. Only used as an input when StoreCostPrice is not set.
- `storeCostPriceMargin`: number (decimal) — Calculated: Store margin against the ex-tax selling price: (DiscountedPrice ex tax - StoreCostPrice) / DiscountedPrice ex tax * 100
- `product`: [`OmniumPriceListItemProduct`](OmniumPriceListItemProduct.md)
- `standardCost`: number (decimal), nullable — Standard cost in cost currency. User-settable via public API.
- `standardCostInPriceListCurrency`: number (decimal), nullable — Standard cost in price list currency. Recomputed by the server from StandardCost x CostCurrencyExchangeRate; values set by the caller are overwritten.
- `discountedStandardCost`: number (decimal), nullable — Standard cost reduced by the absolute CostDiscount amount. Does not factor in CostDiscountPercent. Calculated server-side; values set by the caller are ignored.
- `discountedStandardCostInPriceListCurrency`: number (decimal), nullable — Discounted standard cost in price list currency. Calculated server-side from the absolute CostDiscount; values set by the caller are ignored.
- `plannedSalesVolume`: number (decimal), nullable — Planned sales volume (units) - primary planning input
- `plannedRevenue`: number (decimal), nullable — Planned revenue calculated from PlannedSalesVolume x DiscountedPrice
- `planningComment`: string, nullable — Optional internal comment for planning context
- `plannedPurchaseVolume`: number (decimal), nullable — Planned purchase volume (units) - expected purchasing quantity for the campaign
- `planningPurchaseComment`: string, nullable — Optional internal comment for purchase planning context
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties for this price list item
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable — Validation errors and warnings attached to this item. Populated by price list validation runs.

**Used directly by endpoints in:**

- [Products | Price List Items](../endpoints/products/price-list-items.md)
