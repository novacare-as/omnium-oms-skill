# OmniumAccountingPostingSearchRequest

Search request for accounting postings.

**Fields:**

- `take`: integer (int32) — Number of items to return per page. Maximum 100.
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take]).
- `storeId`: string, nullable — Filter by store ID. Mutually exclusive with Omnium.Public.Accounting.Models.OmniumAccountingPostingSearchRequest.StoreGroupId.
- `storeGroupId`: string, nullable — Filter to postings covering any store in the given store group. The API resolves this to the set of store IDs that belong to the group. Mutually exclusive with Omnium.Public.Accounting.Models.OmniumAccountingPostingSearchRequest.StoreId.
- `registerId`: string, nullable — Filter by register ID.
- `accountingCompanyCode`: string, nullable — Filter by accounting company code.
- `status`: string, nullable — Filter by posting status (Posted, Exported, Reconciled, Rejected).
- `source`: [`OmniumPostingSource`](OmniumPostingSource.md)
- `postingDateFrom`: string (date-time), nullable — Filter postings whose posting date is on or after this date (inclusive).
- `postingDateTo`: string (date-time), nullable — Filter postings whose posting date is on or before this date (inclusive).
- `orderIds`: List<string>, nullable — Filter to postings that include any of the given order IDs.
- `includeSuperseded`: boolean — When true, include postings with status Superseded (audit view). Default false. Draft postings are never returned by the public API.

**Used directly by endpoints in:**

- [Accounting | Postings](../endpoints/accounting/postings.md)
