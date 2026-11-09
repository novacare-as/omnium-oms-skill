# OmniumEpcTag

A single physical RFID tag, identified by its EPC. Tags carry loose references to
products (skuId/GTIN), deliveries and orders - inventory quantities never depend on them.

**Fields:**

- `epc`: string, required — The EPC as a hex string (e.g. "3035BF8AF03BF5403750303C"). Case and whitespace/dashes are normalized by Omnium, so any spelling of the same EPC refers to the same tag.
- `scheme`: string, nullable — EPC encoding scheme, e.g. "SGTIN-96". Derived from the EPC header when omitted.
- `gtin14`: string, nullable — Canonical 14-digit GTIN. Derived from an SGTIN EPC or from Gtin when omitted.
- `gtin`: string, nullable — GTIN with leading zeros stripped (12/13/14 digits), matching how products store EAN/GTIN. Derived from an SGTIN EPC or from Gtin14 when omitted.
- `serialNumber`: string, nullable — Tag serial number. Derived from an SGTIN/GRAI EPC when omitted.
- `serialValue`: integer (int64), nullable — The serial number as a number, for range searches. Managed by Omnium from SerialNumber; null when the serial is not numeric.
- `companyPrefix`: string, nullable — GS1 company prefix of the tag issuer. Derived from an SGTIN/GRAI EPC when omitted.
- `skuId`: string, nullable — SKU code of the product the tag is attached to. Resolved from the GTIN when omitted.
- `brand`: string, nullable — Product brand. Resolved from the product when omitted - enables fetching all EPCs for one brand.
- `productName`: string, nullable — Product name for display purposes. Resolved from the product when omitted.
- `status`: string, nullable — Lifecycle status. Well-known values: Announced, Received, InStock, Sold, Missing, Deactivated. Custom values are allowed.
- `storeId`: string, nullable — Current/home store of the tagged item.
- `created`: string (date-time) — Created date. Managed by Omnium when omitted.
- `modified`: string (date-time) — Modified date. Managed by Omnium.
- `lastSeen`: [`OmniumEpcTagObservation`](OmniumEpcTagObservation.md)
- `supplierId`: string, nullable — Supplier that announced/produced the source tag.
- `supplierSkuId`: string, nullable — The supplier's own article number.
- `purchaseOrderId`: string, nullable — Purchase order the tagged item belongs to.
- `deliveryId`: string, nullable — Delivery the tagged item belongs to - used to validate goods reception against source tags.
- `lineItemId`: string, nullable — Purchase-order line item the tagged item belongs to.
- `orderId`: string, nullable — Sales order the tagged item was sold on.
- `sscc`: string, nullable — SSCC of the pallet/case the tag was announced or received under.
- `batchId`: string, nullable — Import or registration batch the tag was written in, e.g. one upload from a handheld. Lets a whole batch be listed, counted or deleted.
- `labels`: List<string>, nullable, max length 50 — Free-form keyword labels, e.g. which import rule matched the tag. Filterable and countable.
- `verification`: [`OmniumEpcTagVerification`](OmniumEpcTagVerification.md)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties (key values), e.g. TID or reader metadata.

**Used directly by endpoints in:**

- [Products | RFID Tags](../endpoints/products/rfid-tags.md)
