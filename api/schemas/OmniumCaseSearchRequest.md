# OmniumCaseSearchRequest

Search request for cases

**Fields:**

- `status`: string, nullable — Filter by case status
- `priority`: string, nullable — Filter by case priority
- `assignedToUserId`: string, nullable — Filter by assigned user ID
- `tags`: List<string>, nullable — Filter by tags
- `customerId`: string, nullable — Filter by customer ID
- `orderId`: string, nullable — Filter by related order ID
- `dateFrom`: string (date-time), nullable — Filter cases created after this date
- `dateTo`: string (date-time), nullable — Filter cases created before this date
- `searchText`: string, nullable — Free text search
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `take`: integer (int32) — Number of items to take
- `includeDeleted`: boolean — Include soft-deleted cases in results
- `sortOrder`: string, nullable — Sort order

**Used directly by endpoints in:**

- [Cases](../endpoints/cases.md)
