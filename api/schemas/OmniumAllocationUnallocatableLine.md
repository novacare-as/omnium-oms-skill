# OmniumAllocationUnallocatableLine

A line no warehouse could serve, and why.

**Fields:**

- `lineId`: string, nullable
- `skuId`: string, nullable
- `quantity`: number (decimal)
- `reasons`: List<[`OmniumAllocationTraceEntry`](OmniumAllocationTraceEntry.md)>, nullable, max length 100
