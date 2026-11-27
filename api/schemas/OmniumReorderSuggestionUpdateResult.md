# OmniumReorderSuggestionUpdateResult

Result of a reorder suggestion patch operation

**Fields:**

- `totalCount`: integer (int32) — Total number of reorder suggestions processed
- `updatedCount`: integer (int32) — Number of reorder suggestions updated
- `unchangedCount`: integer (int32) — Number of reorder suggestions unchanged
- `notFoundCount`: integer (int32) — Number of reorder suggestions not found
- `notFoundIds`: List<string>, nullable — List of reorder suggestion IDs that were not found
- `errorCount`: integer (int32) — Number of errors encountered
- `errorMessage`: string, nullable — Error messages
- `isModified`: boolean — True if any reorder suggestion was modified
- `updatedSuggestion`: [`OmniumReorderSuggestion`](OmniumReorderSuggestion.md)

**Used directly by endpoints in:**

- [Purchase Orders | Reorder Suggestions](../endpoints/purchase-orders/reorder-suggestions.md)
