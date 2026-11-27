# OmniumCartPatchUpdateResult

Result of a cart patch operation.

**Fields:**

- `updatedItem`: [`OmniumCart`](OmniumCart.md)
- `totalCount`: integer (int32)
- `updatedCount`: integer (int32)
- `unchangedCount`: integer (int32)
- `notFoundCount`: integer (int32)
- `errorCount`: integer (int32)
- `errorMessage`: string, nullable
- `isModified`: boolean

**Used directly by endpoints in:**

- [Carts | Update](../endpoints/carts/update.md)
