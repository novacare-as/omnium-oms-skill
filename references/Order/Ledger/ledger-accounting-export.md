# Export to an Accounting System

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-accounting-export

> How POS Z-report postings and web-fulfillment postings fit together, and how to turn postings and ledger lines from the Accounting API into vouchers in your accounting system or ERP.

An accounting integration reads Omnium's postings through the read-only [Accounting API](api-reference.md) and books them as vouchers (journal entries, or _bilag_) in the accounting system or ERP. This page explains how POS sales and web sales reach the ledger, what each kind of posting contains, and how to build vouchers from postings and ledger lines without booking anything twice.

For the posting model itself, see [Postings & Ledger Lines](ledger-postings.md).

## How POS and web sales reach the ledger

Omnium builds postings from two sources. Both are read through the same endpoints, and the posting's `Source` tells them apart.

|  | `PosZReport` | `WebFulfillment` |
| --- | --- | --- |
| Built | When a register's Z-report is closed in Omnium POS | By the [Web Fulfillment Posting](../../configuration/scheduled-tasks/accounting/web-fulfillment-posting.md) scheduled task, for the previous accounting day, from the [cutoff hour](ledger-config.md#posting-settings) (default 02:00) |
| One posting per | Z-report — one register, one settlement | Store and accounting day, or store, order type, and day when [per-order-type posting](ledger-config.md#posting-settings) is on |
| Built from | The Z-report's totals | The payment transactions of the store's orders on that day |
| `ZReportId` | Set | Empty |
| `OrderIds` | Empty — POS lines carry no order numbers | The orders that contributed |
| `RegisterId` on lines | Set | Empty |

### What a Z-report posting contains

A Z-report posting is built from the totals of the Z-report, not from individual orders:

*   Net sales per product group and VAT rate, and output VAT per rate
*   Returns and the VAT reversed on them
*   Tender received per payment method, and refunds paid out
*   Gift cards sold, and gift cards used as tender

The Z-report's counted cash, opening float, and cash movements such as bank deposits are not posted. The `OverShort` account only receives an [auto-balancing](ledger-postings.md#auto-balancing) line when the posting would otherwise not balance.

Postings are built only for Z-reports closed in Omnium POS. You can read the Z-reports themselves through `POST /api/ZReport/GetOmniumZReports` (requires the **Order Read** role). When the tenant has a connected POS system that supplies Z-reports, the endpoint returns that system's Z-reports, which produce no postings. Otherwise it returns the Omnium POS Z-reports, and their `zreportId` is the ID that `GET /api/Accounting/Postings/ByZReport/{zReportId}` takes. You do not need the Z-report endpoint to build vouchers: the posting carries everything the voucher needs.

### What a web-fulfillment posting contains

A web-fulfillment posting books the web and click & collect payment transactions of one store's orders on one accounting day. An order's sales, VAT, and shipping book on the day its payment is captured, sold, or invoiced, and a refund books on the day it is credited. Orders that are only authorized wait for their capture.

### A sale is booked once

A sale registered on an Omnium POS register books through that register's Z-report posting, and the web-fulfillment posting leaves it out:

*   An order line is left out when the order's POS sale covers its full quantity of that SKU. A line the POS sale covers only in part stays on the web-fulfillment posting.
*   A payment is left out when the POS sale has a payment with the same payment reference, or with the same payment method and amount.
*   Whatever the POS sale does not cover — a part payment, or lines handed over later — books on the web-fulfillment posting.

Orders that have no sale in Omnium POS, such as POS orders imported from an external POS system, are on no Z-report posting. Their payments book on the web-fulfillment posting of their store like any web order. To keep them out, add a [posting exclusion](ledger-posting-exclusions.md), for example on their order type.

## Build one voucher per posting

Every posting balances on its own: `TotalDebit` equals `TotalCredit`, or differs from it by no more than the [balance tolerance](ledger-config.md#posting-settings), reported in `Imbalance`. Book each posting as one voucher, with one voucher line per ledger line, rather than merging postings into a single daily voucher. One store's day usually produces several postings:

*   One `PosZReport` posting per register Z-report closed that day
*   One `WebFulfillment` posting, or one per order type when per-order-type posting is on
*   An additional `WebFulfillment` posting when transactions for the day arrive after the day was posted

Use these posting fields on the voucher:

| Field | Use |
| --- | --- |
| `Id` | The voucher's external reference. It is unique and never reused: store it to know which postings you have booked. Treat it as opaque. |
| `PostingDate` | The voucher date — the transaction day in the accounting time zone for web-fulfillment postings, the Z-report's UTC date for POS postings. |
| `AccountingCompanyCode` | The company to book in, when stores belong to different companies. See [Store Accounts](ledger-store-accounts.md#store-accounting-fields). |
| `CurrencyCode` | The voucher currency. |
| `AutoBalanced`, `Warnings` | Whether Omnium added a balancing line, and why. |

### Fetch postings and their lines

1.  Search postings for a date window with `POST /api/Accounting/Postings/Search`, page by page:

```json
{
  "postingDateFrom": "2026-10-20T00:00:00Z",
  "postingDateTo": "2026-10-25T23:59:59Z",
  "storeGroupId": "Norway",
  "take": 100,
  "page": 1
}
```

2.  Skip the postings whose `id` you have already booked, and postings with status `Rejected`, which the search returns.
3.  Read each new posting's lines with `GET /api/Accounting/Postings/{id}/Lines`. The lines come back in `lineSequence` order.
4.  Book the voucher and store the posting `id`.

A POS posting exists as soon as its Z-report is closed. A web-fulfillment posting for a day exists once the scheduled task has run after the cutoff hour on the following day.

The search filters on the posting date, not on when a posting was created. A posting created later for an earlier day — for late transactions, or for a day or Z-report generated manually under **Reports → Accounting** — carries that earlier posting date, and a search finds it only when its window reaches back to that date. Let each run search a window that overlaps the previous runs, and rely on the posting `id` to skip what you have booked.

A ledger line from a web-fulfillment posting looks like this:

```json
[
  {
    "id": "web:Oslo-01:2026-10-24:all:v4b1d0e7c9a2f4e0b8c6d5a3f2e1b0c9d:0000",
    "postingId": "web:Oslo-01:2026-10-24:all:v4b1d0e7c9a2f4e0b8c6d5a3f2e1b0c9d",
    "lineSequence": 0,
    "postingDate": "2026-10-24T00:00:00Z",
    "storeId": "Oslo-01",
    "accountingCompanyCode": "NO01",
    "accountNumber": "3000",
    "accountName": "Salg, høy sats",
    "category": 0,
    "debit": 0.0,
    "credit": 2396.0,
    "debitInclVat": 0.0,
    "creditInclVat": 2995.0,
    "currencyCode": "NOK",
    "vatRate": 25.0,
    "taxGroupCode": "HIGH",
    "description": "Sales — HIGH 25%"
  }
]
```

### Search ledger lines across postings

`POST /api/Accounting/LedgerLines/Search` returns lines across postings, filtered by account, category, VAT code, store, or date — useful for account-level reconciliation. Its `Source` and superseded filters are applied to each page after the page is read: a page can hold fewer lines than `take`, even none, while later pages still hold matches, and `totalHits` counts the lines before those filters. Keep paging until `page × take` reaches `totalHits`. For voucher export, fetch lines per posting instead.

## Accounts and VAT on the ledger lines

The account number, VAT code, VAT rate, and tax-group code on each line come from the [Chart of Accounts](ledger-chart-of-accounts.md), [store accounts](ledger-store-accounts.md), and [Tax Groups](ledger-tax-groups.md), so the accounting is set up in Omnium and the integration copies it.

VAT is booked on separate `OutputVat` lines, per rate, tax group, and store, with sales and returns on separate lines. `VatAmount` is not filled on any line; the VAT is the amount of the `OutputVat` line.

For accounting systems that take the VAT-inclusive amount on the revenue line and derive the VAT from the VAT code, use `DebitInclVat` and `CreditInclVat` instead of `Debit` and `Credit`:

*   `Sales`, `Shipping`, and rental revenue lines (returned with category `Other`) carry their net amount plus the VAT booked against them.
*   The `OutputVat` line that VAT came from reads `0`.
*   Every other line equals `Debit` and `Credit`.

The inclusive amounts of a posting balance among themselves. VAT with no revenue line of the same rate, tax group, and store to take it stays on its own `OutputVat` line. Lines posted before these fields existed have them empty.

## Tell POS and web lines apart

A ledger line has no source field of its own. Derive what you need from the line and its posting:

| To know | Use |
| --- | --- |
| POS or web | `Source` on the posting, fetched by the line's `PostingId`. `ZReportId` is set only on POS postings. |
| Register | `RegisterId`, set only on lines of POS postings. |
| Order type | `OrderType` on the posting, when web-fulfillment postings are split per order type. |
| Department or project | `StoreId` on the line. Map it to the store's [accounting dimension code](ledger-store-accounts.md#store-accounting-fields), returned as `accountingDimensionCode` by the Store API, or to your own table. |

A line on a web-fulfillment posting can carry another store than the posting itself, for example a payment taken at another store, or a return handed in at a store outside the order's store group. [Which store's accounts a line uses](ledger-store-accounts.md#which-stores-accounts-a-line-uses) has the full rules. On `InternalTransferIn` and `InternalTransferOut` lines, `StoreId` already holds the store's accounting dimension code, or the store ID when the store has none.

The `Dimensions` field on ledger lines is not filled by Omnium.

## Enum values in responses

`source` on postings and `category` on ledger lines are returned as numbers, while the [swagger documentation](https://api.omnium.no/documentation/index.html) lists their names. Requests accept either the name or the number.

| Value | `source` | `category` |
| --- | --- | --- |
| 0 | `PosZReport` | `Sales` |
| 1 | `WebFulfillment` | `OutputVat` |
| 2 |  | `PaymentMethod` |
| 3 |  | `Shipping` |
| 4 |  | `Discount` |
| 5 |  | `Rounding` |
| 6 |  | `RefundPaymentMethod` |
| 7 |  | `InternalTransferOut` |
| 8 |  | `InternalTransferIn` |
| 9 |  | `Receivable` |
| 10 |  | `GiftCardLiability` |
| 11 |  | `PaymentProviderFee` |
| 12 |  | `Other` |
| 13 |  | `CashFloat` |
| 14 |  | `CashInTransit` |
| 15 |  | `OverShort` |
| 16 |  | `Tip` |
| 17 |  | `DepositLiability` |

The swagger documentation also lists `RentalSales`, but the API never returns it: rental revenue lines come back as `Other` (12).

## Replaced and deleted postings

The Accounting API is read-only, so Omnium does not learn which postings you have booked. Keep that record on your side, keyed by posting `id`.

*   **Replaced postings.** When a posting replaces an earlier one, the earlier posting becomes `Superseded` and drops out of searches by default, and the new posting points back to it with `SupersedesPostingId`. Only Z-report postings are replaced this way; web-fulfillment postings never are. When a new posting's `SupersedesPostingId` is a posting you have booked, reverse that voucher and book the new one.
*   **Deleted postings.** Any posting can be deleted in Omnium, and it then disappears from the API. Generating its Z-report or day again creates a posting with a new `id` and no link to the deleted one. Agree on a routine with the Omnium users who can delete postings, so a booked posting is reversed in the accounting system before it is generated again.

## Before you start

*   **Posting enabled** must be on for any postings, and **Web fulfillment posting enabled** plus the scheduled task for web-fulfillment postings — see [Configuration](ledger-config.md).
*   The API client needs the **Accounting Read** access level — see [Authentication](../../GettingStartedWithAPI/getStarted.md).

## Related pages

*   [API Reference](api-reference.md) — endpoints, search requests, and models.
*   [Postings & Ledger Lines](ledger-postings.md) — the double-entry model and the posting lifecycle.
*   [Chart of Accounts](ledger-chart-of-accounts.md) — how account numbers and VAT codes are resolved.
*   [Posting Exclusions](ledger-posting-exclusions.md) — keep selected orders out of web-fulfillment postings.
