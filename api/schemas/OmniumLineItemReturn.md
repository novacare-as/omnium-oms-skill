# OmniumLineItemReturn

Request object for adding return line items

**Fields:**

- `lineItemId`: string, nullable — ID of line item to return
- `returnQuantity`: number (decimal) — Quantity returned
- `returnReason`: string, nullable — Return reason. Free text.
- `returnType`: string, nullable — Return type ID
- `isStockUpdated`: boolean, nullable — Whether the return order line should update stock (inventory) value. If set to 'true', the stock would increase with the same amount as the quantity on the return order line. If set to 'false', the stock would be unaffected. If set to null, return settings will decide.
- `isDelivered`: boolean — Whether the returned items on this line were delivered to the customer. Default is true. Set to false for items that were paid for but never delivered, for example a POS order where an item will not be handed over: the return quantity is then registered as cancelled quantity on the order line, and the return does not add the items back to the inventory, unless the line's stock has already been reduced. A stock reduction made within the last few seconds may not be found yet, and the return then does not add the items back. The reservation of the cancelled items is released when the shipment's inventory is reduced, or by the next recalculation of reserved inventory. An order line cannot be returned both as delivered and as not delivered in the same return.
- `creditAmount`: number (decimal), nullable — Amount to credit on a returnItem pr item. Total orderLine credit amount will be creditAmount * quantity.  If not specified, the item will be fully credited. Type: Decimal.
- `internalWarehouseLocation`: string, nullable — Use this to specify location within the warehouse. In case you have separate locations for returned products IE. Broken/UsedOrOpened/SellAsNew **Not required**
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties to set on the return order line
