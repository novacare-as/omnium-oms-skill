# OmniumProductUpdateResult

**Fields:**

- `totalCount`: integer (int32)
- `updatedCount`: integer (int32)
- `unchangedCount`: integer (int32)
- `notFoundCount`: integer (int32)
- `notFoundIds`: List<string>, nullable
- `errorCount`: integer (int32)
- `errorMessage`: string, nullable
- `errorIds`: List<string>, nullable
- `isModified`: boolean

**Used directly by endpoints in:**

- [Products | Categories](../endpoints/products/categories.md)
- [Products | Update](../endpoints/products/update.md)
- [Products | Variants](../endpoints/products/variants.md)
