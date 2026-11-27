# OmniumAccountingPosting

An accounting posting (voucher header) summarising a balanced set of ledger lines.
Built either from a POS Z-report close or from a daily web-fulfillment batch.

**Fields:**

- `id`: string, nullable — Unique posting ID. Set by Omnium.
- `source`: [`OmniumPostingSource`](OmniumPostingSource.md)
- `orderType`: string, nullable — Order type this posting covers, when the tenant splits WebFulfillment postings per order type. Null on per-store WebFulfillment postings and on all PosZReport postings.
- `zReportId`: string, nullable — Z-report this posting was built from. Set when Source = PosZReport; null otherwise.
- `zReportNumber`: integer (int64), nullable — Z-report number, when applicable.
- `orderIds`: List<string>, nullable — Order IDs that contributed to this posting.
- `storeIds`: List<string>, nullable — Stores covered by this posting. WebFulfillment postings have a single entry.
- `registerIds`: List<string>, nullable — Registers covered by the source Z-report. Empty for WebFulfillment postings.
- `accountingCompanyCode`: string, nullable — Accounting company code (when configured per store/market).
- `postingDate`: string (date-time) — Accounting period date (store-local timezone → date component).
- `createdAt`: string (date-time) — UTC creation timestamp.
- `currencyCode`: string, nullable — ISO currency code for the posting (e.g. NOK, SEK, EUR).
- `status`: string, nullable — Lifecycle status. One of: Draft, Posted, Exported, Reconciled, Rejected, Superseded.
- `supersedesPostingId`: string, nullable — If this posting replaces an earlier one, the ID of the superseded posting.
- `externalReference`: string, nullable — ERP voucher ID once exported.
- `exportedAt`: string (date-time), nullable — UTC timestamp when the posting was exported to the ERP, if exported.
- `totalDebit`: number (decimal) — Sum of all debit amounts on the posting's ledger lines.
- `totalCredit`: number (decimal) — Sum of all credit amounts on the posting's ledger lines.
- `imbalance`: number (decimal) — Signed imbalance (Debit - Credit). Should be 0 after auto-balancing.
- `autoBalanced`: boolean — True if a suspense line was added to make the posting balance.
- `lineCount`: integer (int32) — Number of ledger lines on the posting.
- `warnings`: List<string>, nullable — Builder-emitted diagnostics (e.g. auto-balance notes).
- `rejectionReason`: string, nullable — Operator-supplied reason recorded when the posting was transitioned to Rejected.
- `postingHash`: string, nullable — Tamper-evidence hash over the ordered set of lines + identity fields. Stable across lifecycle transitions (Status / ExportedAt etc. are excluded).

**Used directly by endpoints in:**

- [Accounting | Postings](../endpoints/accounting/postings.md)
