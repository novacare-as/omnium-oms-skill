# API Reference

Source: https://docs.omnium.no/docs/Order/Ledger/api-reference

> Public Accounting API reference — read accounting postings and ledger lines produced by Omnium, with endpoints, search requests, response models, and enums.

The public **Accounting API** is **read-only**. It exposes the postings and ledger lines Omnium generates from POS Z-report closes and daily web-fulfillment batches, so an ERP or accounting integration can pull vouchers for export and reconciliation. Postings are created and managed inside Omnium — the API does not create, update, or delete them.

For the concepts behind these objects, see [Postings & Ledger Lines](ledger-postings.md).

## Base URL

```
https://api.omnium.no/api/Accounting
```

The endpoints appear under the **commerce** group in Swagger: [Omnium API Documentation](https://api.omnium.no/documentation/index.html).

## Authentication

All endpoints require Bearer token authentication and the **Accounting Read** access level. See [Authentication](../../GettingStartedWithAPI/getStarted.md) for obtaining tokens.

**Draft** postings are never returned by the public API. **Superseded** postings are excluded by default and only returned when you set `IncludeSuperseded` on a search request.

* * *

## Get posting by ID

Retrieve a single posting by its ID.

**Endpoint:** `GET /api/Accounting/Postings/{id}`

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | string | path | Yes | The posting ID |

**Response:** `200 OK` with [OmniumAccountingPosting](api-reference.md#posting-model), `400` if the ID is missing, or `404` if not found.

* * *

## Get posting by Z-report

Retrieve the current (non-superseded) posting built from a given Z-report.

**Endpoint:** `GET /api/Accounting/Postings/ByZReport/{zReportId}`

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `zReportId` | string | path | Yes | The Z-report ID |

**Response:** `200 OK` with [OmniumAccountingPosting](api-reference.md#posting-model), or `404` if no posting exists for that Z-report.

* * *

## Search postings

Search postings with filters and pagination.

**Endpoint:** `POST /api/Accounting/Postings/Search`

**Request body:** [OmniumAccountingPostingSearchRequest](api-reference.md#posting-search-request)

**Example request:**

```json
{
  "postingDateFrom": "2026-01-01T00:00:00Z",
  "postingDateTo": "2026-01-31T23:59:59Z",
  "storeId": "Oslo-01",
  "source": "WebFulfillment",
  "status": "Posted",
  "take": 50,
  "page": 1
}
```

**Response:** `200 OK` with a [search result](api-reference.md#search-result) of [OmniumAccountingPosting](api-reference.md#posting-model).

`Take` must be between 1 and **100**. `Take * Page` must be ≤ 10,000. Specify either `StoreId` or `StoreGroupId`, not both.

* * *

## Get lines for a posting

Retrieve all ledger lines for a posting.

**Endpoint:** `GET /api/Accounting/Postings/{id}/Lines`

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | string | path | Yes | The posting ID |

**Response:** `200 OK` with a list of [OmniumAccountingLedgerLine](api-reference.md#ledger-line-model).

* * *

## Get a single ledger line

Retrieve one ledger line. The posting ID is required because lines are partitioned by posting.

**Endpoint:** `GET /api/Accounting/Postings/{postingId}/Lines/{id}`

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `postingId` | string | path | Yes | The parent posting ID |
| `id` | string | path | Yes | The ledger line ID |

**Response:** `200 OK` with [OmniumAccountingLedgerLine](api-reference.md#ledger-line-model), or `404` if the line does not exist on that posting.

* * *

## Search ledger lines

Search ledger lines across postings — useful for building an account-by-account export.

**Endpoint:** `POST /api/Accounting/LedgerLines/Search`

**Request body:** [OmniumAccountingLedgerLineSearchRequest](api-reference.md#ledger-line-search-request)

**Example request:**

```json
{
  "postingDateFrom": "2026-01-01T00:00:00Z",
  "postingDateTo": "2026-01-31T23:59:59Z",
  "accountNumber": "3000",
  "category": "Sales",
  "sortBy": "PostingDate",
  "sortDescending": true,
  "take": 200,
  "page": 1
}
```

**Response:** `200 OK` with a [search result](api-reference.md#search-result) of [OmniumAccountingLedgerLine](api-reference.md#ledger-line-model).

`Take` must be between 1 and **1000**. `Take * Page` must be ≤ 10,000. Specify either `StoreId` or `StoreGroupId`, not both.

* * *

## Models

### Posting model

`OmniumAccountingPosting` — a voucher header summarising a balanced set of ledger lines.

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Unique posting ID. |
| Source | [OmniumPostingSource](api-reference.md#enums) | `PosZReport` or `WebFulfillment`. Returned as a number. |
| OrderType | string | Order type the posting covers, when web-fulfillment postings are split [per order type](ledger-config.md#posting-settings). Empty on per-store `WebFulfillment` postings and on all `PosZReport` postings. |
| ZReportId | string | Z-report the posting was built from (POS only). |
| ZReportNumber | long? | Z-report number, when applicable. |
| OrderIds | List<string> | Orders that contributed to the posting. |
| StoreIds | List<string> | Stores covered. WebFulfillment postings have a single entry. |
| RegisterIds | List<string> | Registers covered by the source Z-report. Empty for WebFulfillment. |
| AccountingCompanyCode | string | Accounting company code of the posting's store, when configured. See [Store Accounts](ledger-store-accounts.md#store-accounting-fields). |
| PostingDate | DateTime | Accounting period date — the transaction day in the accounting time zone for `WebFulfillment`, the Z-report's UTC date for `PosZReport`. |
| CreatedAt | DateTime | UTC creation timestamp. |
| CurrencyCode | string | ISO currency code (e.g. `NOK`). |
| Status | string | `Posted`, `Exported`, `Reconciled`, `Rejected`, or `Superseded`. |
| SupersedesPostingId | string | ID of the posting this one replaces, if any. |
| ExternalReference | string | ERP voucher ID, once exported. |
| ExportedAt | DateTime? | UTC export timestamp, if exported. |
| TotalDebit | decimal | Sum of all debit amounts. |
| TotalCredit | decimal | Sum of all credit amounts. |
| Imbalance | decimal | Signed residual (debit − credit). `0` on a balanced posting. |
| AutoBalanced | bool | True if a suspense line was added to balance the posting. |
| LineCount | int | Number of ledger lines. |
| Warnings | List<string> | Builder diagnostics (e.g. auto-balance notes). |
| RejectionReason | string | Reason recorded when the posting was rejected. |
| PostingHash | string | Deterministic hash over identity fields and ordered lines; stable across lifecycle changes. |

### Ledger line model

`OmniumAccountingLedgerLine` — one debit/credit entry against one account.

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Unique ledger line ID. |
| PostingId | string | Parent posting ID. |
| LineSequence | int | Stable order within the posting. |
| PostingDate | DateTime? | Accounting period date (denormalised from the posting). |
| RegisterId | string | Register that produced the line (POS), when applicable. |
| StoreId | string | Store the line is booked to. On `InternalTransferIn` / `InternalTransferOut` lines, the store's accounting dimension code. |
| AccountingCompanyCode | string | Accounting company code, when configured. |
| AccountNumber | string | GL account number. |
| AccountName | string | Human-readable account name. |
| Category | [OmniumAccountCategory](api-reference.md#enums) | What kind of entry this is. Returned as a number. |
| Debit | decimal | Debit amount in posting currency. |
| Credit | decimal | Credit amount in posting currency. |
| DebitInclVat | decimal? | Debit amount including VAT, for accounting systems that take the VAT-inclusive amount on the revenue line. `Sales`, `Shipping`, and rental revenue lines carry their net amount plus the VAT booked against them, the `OutputVat` line that VAT came from reads `0`, and every other line equals `Debit`. Empty on lines posted before the field existed. See [Accounts and VAT on the ledger lines](ledger-accounting-export.md#accounts-and-vat-on-the-ledger-lines). |
| CreditInclVat | decimal? | Credit amount including VAT. See `DebitInclVat`. |
| CurrencyCode | string | ISO currency code. |
| VatCode | string | VAT code on VAT-related lines. |
| VatRate | decimal? | VAT rate as a percentage (e.g. `25`). |
| VatAmount | decimal? | Not filled by postings. The VAT is the amount of the `OutputVat` line. |
| TaxGroupCode | string | Tax-group code from the line-level snapshot. |
| Description | string | Free-text description. |
| CustomerNumber | string | Customer number, when applicable (e.g. receivables). |
| InvoiceNumber | string | Invoice number, when applicable. |
| CreditNoteNumber | string | Credit note number, when applicable. |
| InvoiceDate | DateTime? | Invoice date, when applicable. |
| DueDate | DateTime? | Due date, when applicable. |
| KidNumber | string | KID / payment reference, when applicable. |
| Dimensions | Dictionary<string,string> | Free-form dimensions / cost centres. Not filled by postings. |

### Posting search request

`OmniumAccountingPostingSearchRequest`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| Take | int | 50 | Page size. Max 100. |
| Page | int | 1 | Page number. |
| StoreId | string | — | Filter by store. Mutually exclusive with `StoreGroupId`. |
| StoreGroupId | string | — | Filter by store group (resolved to its stores). Mutually exclusive with `StoreId`. |
| RegisterId | string | — | Filter by register. |
| AccountingCompanyCode | string | — | Filter by accounting company code. |
| Status | string | — | Filter by status. |
| Source | [OmniumPostingSource](api-reference.md#enums)? | — | Filter by source. |
| PostingDateFrom | DateTime? | — | Posting date on or after (inclusive). |
| PostingDateTo | DateTime? | — | Posting date on or before (inclusive). |
| OrderIds | List<string> | — | Include postings containing any of these order IDs. |
| IncludeSuperseded | bool | false | Include superseded postings (audit view). |

### Ledger line search request

`OmniumAccountingLedgerLineSearchRequest`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| Take | int | 200 | Page size. Max 1000. |
| Page | int | 1 | Page number. |
| PostingId | string | — | Filter to one posting's lines. |
| PostingDateFrom | DateTime? | — | Posting date on or after (inclusive). |
| PostingDateTo | DateTime? | — | Posting date on or before (inclusive). |
| StoreId | string | — | Filter by store. Mutually exclusive with `StoreGroupId`. |
| StoreGroupId | string | — | Filter by store group. Mutually exclusive with `StoreId`. |
| RegisterId | string | — | Filter by register. |
| AccountNumber | string | — | Single account number. Takes precedence over `AccountNumbers`. |
| AccountNumbers | List<string> | — | Filter to any of these account numbers. |
| Category | [OmniumAccountCategory](api-reference.md#enums)? | — | Filter by category. |
| TaxGroupCode | string | — | Filter by tax-group code. |
| VatCode | string | — | Filter by VAT code. |
| CurrencyCode | string | — | Filter by currency. |
| Source | [OmniumPostingSource](api-reference.md#enums)? | — | Filter by parent posting source. |
| IncludeSuperseded | bool | false | Include lines whose parent posting is superseded. |
| SortBy | string | `PostingDate` | Sort field: `PostingDate`, `AccountNumber`, or `PostingId`. |
| SortDescending | bool | false | Sort descending. |

### Search result

Both search endpoints return a paged result:

```json
{
  "totalHits": 142,
  "result": [ /* postings or ledger lines */ ]
}
```

| Property | Type | Description |
| --- | --- | --- |
| TotalHits | long | Total number of matching documents. |
| Result | array | The page of results. |

### Enums

Responses return `source` and `category` as numbers, while the swagger documentation lists their names. Requests accept either the name or the number.

**OmniumPostingSource**

| Value | Name | Meaning |
| --- | --- | --- |
| 0 | `PosZReport` | Built inline when a POS Z-report is closed. |
| 1 | `WebFulfillment` | Built daily per (store, posting date) from the payment transactions of web/CS orders at the store. |

**OmniumAccountCategory**

`Sales` (0), `OutputVat` (1), `PaymentMethod` (2), `Shipping` (3), `Discount` (4), `Rounding` (5), `RefundPaymentMethod` (6), `InternalTransferOut` (7), `InternalTransferIn` (8), `Receivable` (9), `GiftCardLiability` (10), `PaymentProviderFee` (11), `Other` (12), `CashFloat` (13), `CashInTransit` (14), `OverShort` (15), `Tip` (16), `DepositLiability` (17).

See [Account categories](ledger-postings.md#account-categories) for what each represents. Lines booked to a `RentalSales` account are returned with category `Other`; filtering ledger lines by `Other` does not include them.

* * *

## Error handling

| Status | Meaning |
| --- | --- |
| 200 | Success |
| 400 | Bad request (missing ID, invalid pagination, or both `StoreId` and `StoreGroupId` set) |
| 404 | Posting or ledger line not found |
| 500 | Internal server error |

## Related pages

*   [Postings & Ledger Lines](ledger-postings.md) — the model behind these objects.
*   [Postings in the UI](ledger-reports.md) — browse and export the same data.
*   [Chart of Accounts](ledger-chart-of-accounts.md) and [Tax Groups](ledger-tax-groups.md) — what drives account numbers and VAT codes on lines.
