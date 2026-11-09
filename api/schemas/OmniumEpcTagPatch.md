# OmniumEpcTagPatch

EPC tag patch model for partial updates. Only the values present in the request are updated.
Derived fields (scheme, GTIN-14, company prefix) are managed by Omnium and not patchable.

**Fields:**

- `epc`: string, required — The EPC identifying the tag to patch. Required.
- `skuId`: string, nullable — SKU code of the product the tag is attached to.
- `gtin`: string, nullable — GTIN with leading zeros stripped. The canonical 14-digit form is kept in sync automatically.
- `serialNumber`: string, nullable — Tag serial number.
- `brand`: string, nullable — Product brand.
- `productName`: string, nullable — Product name for display purposes.
- `status`: string, nullable — Lifecycle status. Well-known values: Announced, Received, InStock, Sold, Missing, Deactivated.
- `storeId`: string, nullable — Current/home store of the tagged item.
- `orderId`: string, nullable — Sales order the tagged item was sold on.
- `supplierId`: string, nullable — Supplier that announced/produced the source tag.
- `supplierSkuId`: string, nullable — The supplier's own article number.
- `purchaseOrderId`: string, nullable — Purchase order the tagged item belongs to.
- `deliveryId`: string, nullable — Delivery the tagged item belongs to.
- `lineItemId`: string, nullable — Purchase-order line item the tagged item belongs to.
- `sscc`: string, nullable — SSCC of the pallet/case.
- `lastSeen`: [`OmniumEpcTagObservation`](OmniumEpcTagObservation.md)
- `batchId`: string, nullable — Import or registration batch the tag belongs to.
- `labels`: List<string>, nullable, max length 50 — Free-form keyword labels. When provided, the existing labels are replaced.
- `verification`: [`OmniumEpcTagVerification`](OmniumEpcTagVerification.md)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties (key values).
- `keepExistingProperties`: boolean, nullable — Set to 'false' if you want to replace the whole 'Properties' list. If true, new properties will be added to the existing list of properties. 'True' by default.
- `fieldsToForceNull`: List<string>, nullable — Force nullable fields to null. Use the property path, e.g. "SkuId", "Status", "LastSeen" or "Properties".

**Used directly by endpoints in:**

- [Products | RFID Tags](../endpoints/products/rfid-tags.md)
