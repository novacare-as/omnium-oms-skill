# OmniumPriceListItemPatch

Partial update model for a price list item. Only non-null fields will be applied.

**Fields:**

- `id`: string, nullable — The Id of the price list item to patch. Format: {PriceListId}_{SkuId} or {PriceListId}_{ProductId}. Can be omitted if PriceListId and SkuId/ProductId are provided separately.
- `priceListId`: string, nullable — The price list this item belongs to. Used together with SkuId or ProductId to derive the Id when Id is not set.
- `skuId`: string, nullable — The SKU identifier. Used together with PriceListId to derive the Id when Id is not set.
- `productId`: string, nullable — The product identifier. Used together with PriceListId to derive the Id when Id is not set. SkuId takes precedence if both are provided.
- `name`: string, nullable — Name of the price list item
- `unitPrice`: number (decimal), nullable — The unit price of the item
- `cost`: number (decimal), nullable — The cost price in cost currency. Patching it alone changes only the base cost: any existing cost discount is re-applied to the new cost, and an item without one stays undiscounted. Supply Omnium.Public.PriceLists.OmniumPriceListItemPatch.CostDiscount or Omnium.Public.PriceLists.OmniumPriceListItemPatch.CostDiscountPercent only to change the discount itself.
- `costCurrencyCode`: string, nullable — Optional per-item override for the cost currency. When set, the price-list-level cost currency is ignored for this item. If provided without CostCurrencyExchangeRate, the rate is resolved server-side via the currency service.
- `costCurrencyExchangeRate`: number (decimal), nullable — Optional per-item override for the cost currency exchange rate to the price list currency. When omitted but CostCurrencyCode is set, the rate is resolved server-side via the currency service.
- `standardCost`: number (decimal), nullable — Standard cost in cost currency.
- `standardCostInPriceListCurrency`: number (decimal), nullable — Standard cost in price list currency. Recomputed by the server from StandardCost x CostCurrencyExchangeRate; values set by the caller are overwritten.
- `discount`: number (decimal), nullable — The absolute discount amount for the price list item, in price list currency. Discount, DiscountPercent and DiscountedPrice are three ways to express the same discount. When more than one is supplied, the absolute Discount takes precedence, then DiscountPercent, then DiscountedPrice. Any of the three you omit is reset (it is not carried over from the stored value), so the supplied field alone drives the result.
- `discountPercent`: number (decimal), nullable — The discount expressed as a percentage of UnitPrice (e.g. 20 for 20%). See Omnium.Public.PriceLists.OmniumPriceListItemPatch.Discount for how it interacts with Discount and DiscountedPrice.
- `discountedPrice`: number (decimal), nullable — The resulting price after discount, in price list currency. Must be less than UnitPrice to register a discount. See Omnium.Public.PriceLists.OmniumPriceListItemPatch.Discount for how it interacts with Discount and DiscountPercent.
- `costDiscount`: number (decimal), nullable — Cost discount amount, in cost currency. Deducted from Omnium.Public.PriceLists.OmniumPriceListItemPatch.Cost to give the discounted cost. Supply either this or Omnium.Public.PriceLists.OmniumPriceListItemPatch.CostDiscountPercent — the server derives the other, and 0 clears the discount.
- `costDiscountPercent`: number (decimal), nullable — The cost discount expressed as a percentage of Omnium.Public.PriceLists.OmniumPriceListItemPatch.Cost (e.g. 20 for 20%). When both are set they must agree: the percentage is only kept to two decimals, so the amount is used as given when it matches, and takes over only when the two contradict each other.
- `storeCostPrice`: number (decimal), nullable — Store cost price in price list currency. When it is not set, StoreCostPriceAdditionPercent is used to derive it.
- `storeCostDiscount`: number (decimal), nullable — Discount on the store cost price, in price list currency. Deducted from StoreCostPrice to give StoreDiscountedCostPrice. Supply either this or StoreCostDiscountPercent — the server derives the other.
- `storeCostDiscountPercent`: number (decimal), nullable — The store cost discount expressed as a percentage of StoreCostPrice (e.g. 20 for 20%). When both are set they must agree: the percentage is only kept to two decimals, so the amount is used as given when it matches, and takes over only when the two contradict each other.
- `storeCostPriceAdditionPercent`: number (decimal), nullable — Addition percentage on discounted cost, used to derive the store cost price when StoreCostPrice is not set.
- `taxRate`: number (decimal), nullable — Optional tax rate override for this item. If null, the price list's tax rate is used. Set to a value (e.g. 0, 12, 25) to override, or omit to leave unchanged.
- `tags`: List<string>, nullable, max length 250 — Tags for categorizing/labeling price list items (e.g. "Last Chance", "Clearance").
- `plannedSalesVolume`: number (decimal), nullable — Planned sales volume (units) - primary planning input
- `plannedRevenue`: number (decimal), nullable — Planned revenue calculated from PlannedSalesVolume x DiscountedPrice
- `planningComment`: string, nullable — Optional internal comment for planning context
- `plannedPurchaseVolume`: number (decimal), nullable — Planned purchase volume (units) - expected purchasing quantity for the campaign
- `planningPurchaseComment`: string, nullable — Optional internal comment for purchase planning context
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties for this price list item

**Used directly by endpoints in:**

- [Products | Price List Items](../endpoints/products/price-list-items.md)
