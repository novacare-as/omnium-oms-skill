# OmniumEpcTagCountResult

Result of an EPC tag count.

**Fields:**

- `totalHits`: integer (int64) — Number of tags matching the filter.
- `groups`: List<[`OmniumEpcTagCountGroup`](OmniumEpcTagCountGroup.md)>, nullable — One group per requested GroupBy field, in request order.

**Used directly by endpoints in:**

- [Products | RFID Tags](../endpoints/products/rfid-tags.md)
