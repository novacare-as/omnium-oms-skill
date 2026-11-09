# OmniumPatchLineItemIdsResult

Result model for patching line item IDs

**Fields:**

- `totalRequested`: integer (int32) — Total number of line item IDs that were requested to be updated
- `updatedCount`: integer (int32) — Number of line item IDs successfully updated
- `notFoundCount`: integer (int32) — Number of line item IDs that were not found
- `isModified`: boolean, read-only — Whether any modifications were made
- `details`: [`PatchLineItemIdsDetails`](PatchLineItemIdsDetails.md)
- `errorMessage`: string, nullable — Any error messages

**Used directly by endpoints in:**

- [Orders | Others](../endpoints/orders/others.md)
