# OmniumEpcTagSearchRequest

Search filters for EPC tags. All filters are optional and combined with AND.

**Fields:**

- `epcs`: List<string>, nullable — Specific EPC hex strings to fetch (any spelling of the same EPC matches).
- `skuId`: string, nullable — SKU code to fetch tags for.
- `skuIds`: List<string>, nullable — SKU codes to fetch tags for.
- `gtins`: List<string>, nullable — GTINs to fetch tags for. Each value is matched in both its normalized and its 14-digit form.
- `brands`: List<string>, nullable — Product brands to fetch tags for - e.g. to download all EPCs for one brand.
- `statuses`: List<string>, nullable — Lifecycle statuses (Announced, Received, InStock, Sold, Missing, Deactivated or custom values).
- `storeIds`: List<string>, nullable — Current/home stores.
- `companyPrefixes`: List<string>, nullable — GS1 company prefixes of the tag issuer - separates own labels from supplier source tags.
- `schemes`: List<string>, nullable — EPC encoding schemes, e.g. "SGTIN-96".
- `orderId`: string, nullable — Sales order the tagged items were sold on.
- `supplierId`: string, nullable — Supplier that announced the source tags.
- `supplierSkuId`: string, nullable — The supplier's own article number.
- `purchaseOrderId`: string, nullable — Purchase order the tagged items belong to.
- `deliveryId`: string, nullable — Delivery the tagged items belong to.
- `lineItemId`: string, nullable — Purchase-order line item the tagged items belong to.
- `sscc`: string, nullable — SSCC of the pallet/case.
- `serialNumber`: string, nullable — Tag serial number.
- `serialFrom`: integer (int64), nullable — Lowest serial number to include (inclusive). Tags whose serial is not numeric never match a range.
- `serialTo`: integer (int64), nullable — Highest serial number to include (inclusive).
- `serialRanges`: List<[`OmniumEpcSerialRange`](OmniumEpcSerialRange.md)>, nullable — More serial ranges to include; a tag in any one of them matches. SerialFrom/SerialTo, when given, count as one more range. Tags whose serial is not numeric never match a range.
- `hasSuffix`: boolean, nullable — True returns only EPCs longer than 96 bits (a suffix past character 24), false only plain 96-bit EPCs. Omit for no filter. Combined with Suffixes, false means "everything except tags with one of those suffixes".
- `suffixes`: List<string>, nullable — Suffix values: the hex past character 24 of the EPC, e.g. "99979999". Alone or with HasSuffix true, only tags with one of them are returned; with HasSuffix false, tags with one of them are excluded.
- `requireSuffixAndSerialRange`: boolean, nullable — How the suffix filter (HasSuffix/Suffixes) and the serial ranges (SerialFrom/SerialTo and SerialRanges) combine when both are given: omitted or false returns tags matching either one, true only tags matching both. Every other filter applies either way.
- `lastSeenStoreId`: string, nullable — Store where the tags were last seen.
- `lastSeenSources`: List<string>, nullable — Flows that produced the last observation, e.g. "InventoryCount", "GoodsReception", "Migration".
- `lastSeenLocation`: string, nullable — In-store zone or area of the last observation.
- `lastSeenDeviceId`: string, nullable — Device that produced the last observation.
- `lastSeenFrom`: string (date-time), nullable — Only tags last seen at or after this date.
- `lastSeenTo`: string (date-time), nullable — Only tags last seen at or before this date.
- `modifiedFrom`: string (date-time), nullable — Only tags modified at or after this date - use for delta downloads.
- `modifiedTo`: string (date-time), nullable — Only tags modified at or before this date.
- `batchIds`: List<string>, nullable — Import or registration batches the tags were written in.
- `labels`: List<string>, nullable — Tags carrying any of these labels.
- `verificationStatuses`: List<string>, nullable — Spot-check outcomes: Confirmed, Rejected, NotFound or custom values.
- `productInfoState`: string, nullable — Product enrichment state: Synced (a SKU was resolved), Unsynced (no SKU) or MissingBrand (SKU but no brand).
- `query`: string, nullable — Free text. A hex string is matched against the EPC (exactly when it is a full EPC, otherwise as a prefix), a digit string against GTIN, serial number and SKU, anything else against SKU, brand and product name.
- `randomSample`: boolean — Return the hits in random order instead of SortOrder - use to draw spot-check samples. The same Seed gives the same order, so a sample can be re-drawn.
- `seed`: integer (int64), nullable — Seed for RandomSample. A random seed is used when omitted.
- `take`: integer (int32) — Page size (1-1000). Default 50.
- `page`: integer (int32) — 1-based page number. Paging is limited to the first 20 000 hits - use ModifiedFrom deltas for larger downloads.
- `sortOrder`: string, nullable — Sort order: ModifiedAscending/ModifiedDescending, CreatedAscending/CreatedDescending, LastSeenAscending/LastSeenDescending or StatusAscending/StatusDescending. Default ModifiedDescending.

**Used directly by endpoints in:**

- [Products | RFID Tags](../endpoints/products/rfid-tags.md)
