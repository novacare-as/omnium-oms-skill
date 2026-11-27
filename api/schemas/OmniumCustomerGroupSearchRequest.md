# OmniumCustomerGroupSearchRequest

Customer group search request

**Fields:**

- `take`: integer (int32) — Number of items to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `customerGroupIds`: List<string>, nullable, max length 250 — List of Ids for customer groups to retrieve
- `createdFrom`: string (date-time), nullable — Created from date
- `createdTo`: string (date-time), nullable — Created to date
- `externalIds`: List<string>, nullable, max length 250 — External Ids
- `searchText`: string, nullable — Search text

**Used directly by endpoints in:**

- [Customers | Customer groups](../endpoints/customers/customer-groups.md)
