# OmniumEpcTagUpdateResult

Result of an EPC tag patch operation

**Fields:**

- `totalCount`: integer (int32) — Total number of EPC tags processed
- `updatedCount`: integer (int32) — Number of EPC tags updated
- `unchangedCount`: integer (int32) — Number of EPC tags unchanged
- `notFoundCount`: integer (int32) — Number of EPC tags not found
- `notFoundIds`: List<string>, nullable — List of EPCs that were not found
- `errorCount`: integer (int32) — Number of errors encountered
- `errorMessage`: string, nullable — Error messages
- `isModified`: boolean — True if any EPC tag was modified

**Used directly by endpoints in:**

- [Products | RFID Tags](../endpoints/products/rfid-tags.md)
