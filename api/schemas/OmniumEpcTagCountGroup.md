# OmniumEpcTagCountGroup

Counts for one GroupBy field.

**Fields:**

- `field`: string, nullable — The GroupBy field this group was built for.
- `buckets`: List<[`OmniumEpcTagCountBucket`](OmniumEpcTagCountBucket.md)>, nullable — Distinct values and their counts, largest first. A tag with several values (Label) is counted under each of them, and the ProductInfoState buckets overlap (MissingBrand is a subset of Synced), so bucket counts need not add up to TotalHits.
- `otherCount`: integer (int64) — Tags matching the filter that fell outside the returned buckets because MaxBuckets was exceeded.
- `missingCount`: integer (int64) — Tags matching the filter that have no value for the field.
