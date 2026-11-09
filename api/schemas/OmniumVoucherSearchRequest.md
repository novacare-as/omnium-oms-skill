# OmniumVoucherSearchRequest

**Fields:**

- `take`: integer (int32) — Paged search - max number of invoices to return
- `page`: integer (int32) — Paged search - page
- `customerIds`: List<string>, nullable, max length 250 — Search Vouchers by customerIds
- `statuses`: List<string>, nullable, max length 250 — Search Vouchers by statuses [Available, Applied, Redeemed, Expired]
- `sortOrder`: string, nullable — Sort result. Available options [CreatedAscending, CreatedDescending, ModifiedAscending, ModifiedDescending, ExpiryDateAscending, ExpiryDateDescending]

**Used directly by endpoints in:**

- [Vouchers](../endpoints/vouchers.md)
