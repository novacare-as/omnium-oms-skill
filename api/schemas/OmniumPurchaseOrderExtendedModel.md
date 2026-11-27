# OmniumPurchaseOrderExtendedModel

Extended purchase order model with store and supplier information

**Fields:**

- `purchaseOrder`: [`OmniumPurchaseOrder`](OmniumPurchaseOrder.md)
- `supplier`: [`OmniumSupplier`](OmniumSupplier.md)
- `store`: [`OmniumStore`](OmniumStore.md)
- `purchaseOrderLines`: List<[`OmniumPurchaseOrderLineExtendedModel`](OmniumPurchaseOrderLineExtendedModel.md)>, nullable, max length 250 — Extended purchase order lines

**Used directly by endpoints in:**

- [Purchase Orders](../endpoints/purchase-orders.md)
