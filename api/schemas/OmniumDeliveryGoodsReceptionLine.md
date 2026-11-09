# OmniumDeliveryGoodsReceptionLine

Representing a line item for goods reception of purchase order deliveries

**Fields:**

- `lineItemId`: string, nullable — Line item ID
- `purchaseOrderId`: string, nullable — Optional, but recommended. Id of the purchase order the line item belongs to. Line item ids are only unique within a single purchase order, so without this the line item id has to be unique across all purchase orders for the line to be resolved.
- `deliveredQuantity`: number (decimal) — Quantity delivered
- `costPrice`: number (decimal) — Cost price of delivery (optional)
- `warehouseCode`: string, nullable — Warehouse code of delivery (optional)
- `updateProductCostPrice`: boolean — If true, product will be updated with new cost price
- `receiveAsUnallocated`: boolean — Only relevant when using VSL - If true then the inventory is not distributed to the virtual stock locations, resulting in unallocated inventory on the physical warehouse.
- `allocateBasedOnRules`: boolean, nullable — Only relevant when using VSL - If set then it overrides the same property on the purchase order lineItem. If true then the inventory rule engine is used to distribute inventory over the virtual stock locations based on specified rules. If false then the specified quantities on the virtual warehouses allocation lines are used to distribute inventory over the virtual stock locations.
- `goodsReceptionId`: string, nullable — Optional. If specified, the value is stored on the InventoryTransaction. Before processing the goods reception, the system checks for any existing InventoryTransaction with the same GoodsReceptionId. If a match is found, processing is cancelled to prevent duplicate handling.

**Used directly by endpoints in:**

- [Purchase Orders | Deliveries](../endpoints/purchase-orders/deliveries.md)
