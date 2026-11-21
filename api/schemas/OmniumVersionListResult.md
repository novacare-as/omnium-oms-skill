# OmniumVersionListResult

One page of versions, newest first.

**Fields:**

- `versions`: List<[`OmniumVersionListItem`](OmniumVersionListItem.md)>, nullable — The versions on this page, newest first.
- `continuationToken`: string, nullable — Send this back as continuationToken to get the next page. Null when there are no more versions.

**Used directly by endpoints in:**

- [Orders | Get](../endpoints/orders/get.md)
