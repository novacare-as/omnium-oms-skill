# OmniumEpcTagCountRequest

Counts the EPC tags matching a filter, grouped by one or more fields. Only counts are
returned, no tags - use it for reconciliation tables and facets.

**Fields:**

- `filter`: [`OmniumEpcTagSearchRequest`](OmniumEpcTagSearchRequest.md)
- `groupBy`: List<string>, nullable — Fields to group by: Brand, Gtin, SkuId, Status, CompanyPrefix, Scheme, StoreId, LastSeenSource, BatchId, Label, VerificationStatus or ProductInfoState. One group is returned per field. Unknown values are ignored.
- `maxBuckets`: integer (int32) — Maximum number of buckets per field (1-5000). Default 1000. Tags outside the returned buckets are reported in OtherCount.

**Used directly by endpoints in:**

- [Products | RFID Tags](../endpoints/products/rfid-tags.md)
