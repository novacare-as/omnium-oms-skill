# OmniumCustomerUpdateResult

Result of a customer patch/update operation, summarising how many records were processed and the outcome of each.

**Fields:**

- `isModified`: boolean — True if at least one property on the customer was changed by the patch operation.
- `totalCount`: integer (int32) — Total number of customers processed by the operation.
- `updatedCount`: integer (int32) — Number of customers that were modified and persisted.
- `unchangedCount`: integer (int32) — Number of customers that were processed but had no changes to apply.
- `notFoundCount`: integer (int32) — Number of customers that could not be found and were therefore skipped.
- `notFoundIds`: List<string>, nullable — Ids of customers that could not be found and were therefore skipped. Null for single-customer operations.
- `errorCount`: integer (int32) — Number of customers where the update failed due to an error.
- `errorMessage`: string, nullable — Concatenated error messages for any customers that failed to update. Each entry includes the customer id and the underlying error.

**Used directly by endpoints in:**

- [Customers | B2B](../endpoints/customers/b2b.md)
- [Customers | B2C](../endpoints/customers/b2c.md)
