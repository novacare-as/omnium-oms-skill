# OmniumAccountingLedgerLineSearchRequest

Search request for accounting ledger lines.

**Fields:**

- `take`: integer (int32) — Number of items to return per page. Maximum 1000.
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take]).
- `postingId`: string, nullable — Filter to lines belonging to a specific posting.
- `postingDateFrom`: string (date-time), nullable — Filter lines whose posting date is on or after this date (inclusive).
- `postingDateTo`: string (date-time), nullable — Filter lines whose posting date is on or before this date (inclusive).
- `storeId`: string, nullable — Filter by store ID. Mutually exclusive with Omnium.Public.Accounting.Models.OmniumAccountingLedgerLineSearchRequest.StoreGroupId.
- `storeGroupId`: string, nullable — Filter to lines from any store in the given store group. The API resolves this to the set of store IDs that belong to the group. Mutually exclusive with Omnium.Public.Accounting.Models.OmniumAccountingLedgerLineSearchRequest.StoreId.
- `registerId`: string, nullable — Filter by register ID.
- `accountNumber`: string, nullable — Single account number; takes precedence over AccountNumbers if both are set.
- `accountNumbers`: List<string>, nullable — Filter to lines on any of the given account numbers.
- `category`: [`OmniumAccountCategory`](OmniumAccountCategory.md)
- `taxGroupCode`: string, nullable — Filter by tax-group code.
- `vatCode`: string, nullable — Filter by VAT code.
- `currencyCode`: string, nullable — Filter by currency code.
- `source`: [`OmniumPostingSource`](OmniumPostingSource.md)
- `includeSuperseded`: boolean — When true, include lines whose parent posting has status Superseded. Default false.
- `sortBy`: string, nullable — Sort field — "PostingDate" (default), "AccountNumber", or "PostingId".
- `sortDescending`: boolean — When true, sort in descending order.

**Used directly by endpoints in:**

- [Accounting | Ledger Lines](../endpoints/accounting/ledger-lines.md)
