# OmniumPurchaseOrderLine

Purchase order line

**Fields:**

- `lineItemId`: string, nullable — Unique order line ID. Should be unique across all purchase orders.
- `splitFromLineItemId`: string, nullable — LineItemId of the original line this line was split from. Set automatically when a line is split; always references the original (root) line, even across multiple successive splits.
- `code`: string, nullable — Sku ID of the order line
- `displayName`: string, nullable — Display name of the line item
- `alternativeProductName`: string, nullable — Alternative product name of the line item
- `ean`: string, nullable, **deprecated** — EAN (European Article Number) / GTIN (Global Trade Item Number) of the line item.
- `gtin`: string, nullable — GTIN (Global Trade Item Number) of the line item.
- `imageUrl`: string, nullable — URL of the image associated with the line item
- `size`: string, nullable — Size of the line item
- `color`: string, nullable — Color of the line item
- `brand`: string, nullable — Brand of the line item
- `placedPrice`: number (decimal) — Price for one item that this line item represents. This property does not take any discounts into consideration.
- `placedPriceExclTax`: number (decimal) — Price for one item excluding tax. This property does not take any discounts into consideration.
- `currency`: string, nullable — Currency of the line item price
- `priceListId`: string, nullable — ID of the price list / campaign the line's cost price was taken from, if any.
- `priceListItemId`: string, nullable — ID of the specific price list item the line's cost price was taken from, if any.
- `priceListName`: string, nullable — Name of the price list / campaign the line's cost price was taken from, for display.
- `quantity`: number (decimal) — Number of items
- `lineItemDiscountAmount`: number (decimal) — Total discount amount applied to the line item
- `lineItemDiscountAmountExclTax`: number (decimal) — Total discount amount applied to the line item, excluding tax
- `extendedPrice`: number (decimal) — Calculated - Total price of the line item, including all discounts applied on the line item (entry level and order level discounts).
- `extendedPriceExclTax`: number (decimal) — Calculated - Total price of the line item, excluding tax, including all discounts applied on the line item (entry level and order level discounts).
- `discountedPrice`: number (decimal) — Calculated - Total price of the line item with all entry level discounts applied on the line item. This does not take order level discounts into account.
- `discountedPriceExclTax`: number (decimal) — Calculated - Total price of the line item, excluding tax, with all entry level discounts applied on the line item. This does not take order level discounts into account.
- `taxTotal`: number (decimal) — Calculated - Tax total for the line item, calculated from the tax group on the product
- `taxRate`: number (decimal) — Tax rate applied to the line item. For example, if the tax rate is 25%, the value here should be 25.00.
- `unit`: string, nullable — Unit of measurement for the line item
- `customsCode`: string, nullable — Customs code for the line item
- `updateStock`: boolean — Specifies whether to update the stock for the line item
- `deliveredQuantity`: number (decimal) — Quantity of the line item that has been delivered
- `canceledQuantity`: number (decimal) — Quantity of the line item that has been canceled
- `countedQuantity`: number (decimal) — Quantity of the line item that has been counted
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List of custom properties associated with the line item
- `comment`: string, nullable — Comment for the line item
- `supplierSkuId`: string, nullable — ID of the supplier SKU
- `supplierName`: string, nullable — Name of the supplier
- `purchaseOrderId`: string, nullable — ID of the purchase order associated with the line item
- `deliveryId`: string, nullable — ID of the delivery associated with the line item
- `estimatedTimeOfArrival`: string (date-time), nullable — Estimated time of arrival for the line item
- `isPackage`: boolean — Specifies whether the line item is a package
- `components`: List<[`OmniumProductComponent`](OmniumProductComponent.md)>, nullable, max length 250 — Used for specification of package products
- `packageName`: string, nullable — Name of the package
- `packageSkuId`: string, nullable — SKU ID of the package
- `packageLineItemId`: string, nullable — Line item ID of the package
- `isConfigurableProduct`: boolean — Indicates whether the order line represents a configurable product. This value is set when a configurable product is created from the cart. Configurable products exist only as order lines and do not have standalone product entries
- `warehouseCode`: string, nullable — Warehouse code for the line item
- `stockLocationCode`: string, nullable — Stock location within the line's warehouse that goods reception receives to. Null means the SKU's default location is used
- `isDisabledForAllocation`: boolean — Specifies whether the line item is disabled for allocation
- `volume`: number (double), nullable — Total volume per unit of the line item, in cubic decimeters (dm³).
- `updateCostPrice`: boolean — Specifies whether to update the cost price on the product from this line item when goods reception is processed.
- `location`: string, nullable — Inventory location
- `supplierPackagingQuantity`: number (decimal), nullable — Supplier packaging quantity (D-Pack)
- `allowSupplierPackageBreak`: boolean, nullable — Indicates if supplier packages can be split to order quantities smaller than the full package size.
- `allocateBasedOnRules`: boolean — Only for Virtual Stock Locations - When true the line item inventory will be allocated to the virtual stock locations based on relevant inventory rules.
- `virtualWarehouseAllocations`: List<[`OmniumVirtualWarehouseAllocation`](OmniumVirtualWarehouseAllocation.md)>, nullable, max length 250 — Only for Virtual Stock Locations - When purchase order is created for warehouse with VSLs then this VirtualWarehouseAllocations can be used to specify how the goods are divided between VSLs
- `selectedUnit`: string, nullable — The selected unit of measurement on order line if product is sold in multiple units (Null if sold unit is default unit)
- `selectedUnitConversionFactor`: number (decimal), nullable — Conversion factor from default unit to selected unit
- `selectedUnitQuantity`: number (decimal), nullable — The quantity ordered in the selected unit of measurement.

**Used directly by endpoints in:**

- [Purchase Orders | Deliveries](../endpoints/purchase-orders/deliveries.md)
