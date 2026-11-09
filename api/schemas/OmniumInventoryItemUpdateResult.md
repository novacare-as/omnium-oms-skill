# OmniumInventoryItemUpdateResult

Result of an inventory item patch operation

**Fields:**

- `totalCount`: integer (int32) — Total number of inventory items processed
- `updatedCount`: integer (int32) — Number of inventory items updated
- `unchangedCount`: integer (int32) — Number of inventory items unchanged
- `notFoundCount`: integer (int32) — Number of inventory items not found
- `notFoundIds`: List<string>, nullable — List of inventory item IDs that were not found
- `errorCount`: integer (int32) — Number of errors encountered
- `errorMessage`: string, nullable — Error messages
- `isModified`: boolean — True if any inventory item was modified

**Used directly by endpoints in:**

- [Products | Inventory](../endpoints/products/inventory.md)
