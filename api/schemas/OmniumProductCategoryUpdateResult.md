# OmniumProductCategoryUpdateResult

Result of a product category patch operation

**Fields:**

- `totalCount`: integer (int32) — Total number of categories processed
- `updatedCount`: integer (int32) — Number of categories updated
- `unchangedCount`: integer (int32) — Number of categories unchanged
- `notFoundCount`: integer (int32) — Number of categories not found
- `notFoundIds`: List<string>, nullable — List of category IDs that were not found
- `errorCount`: integer (int32) — Number of errors encountered
- `errorMessage`: string, nullable — Error messages
- `isModified`: boolean — True if any category was modified

**Used directly by endpoints in:**

- [Products | Categories](../endpoints/products/categories.md)
