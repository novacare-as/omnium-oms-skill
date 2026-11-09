# OmniumSupplierUpdateResult

Result of a supplier patch operation. TotalCount is the sum of UpdatedCount, UnchangedCount, NotFoundCount and ErrorCount.

**Fields:**

- `totalCount`: integer (int32) — Total number of suppliers processed
- `updatedCount`: integer (int32) — Number of suppliers updated
- `unchangedCount`: integer (int32) — Number of suppliers unchanged
- `notFoundCount`: integer (int32) — Number of suppliers not found
- `notFoundIds`: List<string>, nullable — List of supplier IDs that were not found
- `errorCount`: integer (int32) — Number of suppliers that could not be patched. These suppliers are not updated.
- `errorMessage`: string, nullable — Error messages
- `isModified`: boolean — True if any supplier was modified

**Used directly by endpoints in:**

- [Suppliers](../endpoints/suppliers.md)
