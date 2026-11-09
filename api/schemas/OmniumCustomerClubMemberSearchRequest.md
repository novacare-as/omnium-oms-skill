# OmniumCustomerClubMemberSearchRequest

Customer club member search request

**Fields:**

- `take`: integer (int32) — Paged search - number of items to retrieve
- `page`: integer (int32) — Paged search - page
- `storeIds`: List<string>, nullable, max length 500 — Filter by store IDs
- `marketIds`: List<string>, nullable, max length 500 — Filter by market IDs
- `customerIds`: List<string>, nullable, max length 1000 — Filter by customerIds
- `emailMarketingConsent`: boolean, nullable — Filter by value of email marketing consent

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
