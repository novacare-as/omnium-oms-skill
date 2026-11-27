# Postings in the UI

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-reports

> Browse accounting postings under Reports — the list and detail views, ledger-line inspection, CSV export, the Accounting Ledger custom report, and the per-Z-report VAT settlement export.

Postings are browsable in the Omnium UI under **Reports → Accounting**. The screens are read-and-operate views over the same postings the [public API](api-reference.md) exposes — list, inspect lines, export, and re-run web-fulfillment posting for a date range.

## Postings list

The list view shows postings matching the current filters, most recent first.

**Filters:**

| Filter | Effect |
| --- | --- |
| Posting date from / to | Restrict to an accounting-date range. |
| Store | Restrict to one store. |
| Status | Restrict to a single [lifecycle status](ledger-postings.md#posting-lifecycle). |
| Order type | Restrict to postings for one order type, when [per-order-type posting](ledger-config.md#posting-settings) is on. |
| Include superseded | When on, also show superseded postings (audit view). Off by default. |

Each row summarises the posting: posting date, [source](ledger-postings.md#posting-sources) (`PosZReport` / `WebFulfillment`), store(s), status, and total debit / credit. Selecting a row opens the detail view.

## Posting detail

The detail view loads the posting header and all its **ledger lines**. The lines table shows, per line: account number and name, [category](ledger-postings.md#account-categories), debit, credit, currency, VAT code, VAT rate, VAT amount, and description. Header fields include the source, Z-report number (for POS), stores, status, totals, imbalance, auto-balanced flag, and — once exported — the external reference and export timestamp.

## CSV export

Two CSV exports are available, both **UTF-8 with BOM** and **semicolon-delimited** (so they open cleanly in European Excel):

*   **Single posting** — from the detail view, exports that posting's lines.
*   **Date range** — from the list view, exports all matching lines for the selected range (maximum **90 days**). Honours the store, status, order type, and include-superseded filters. The export produces one file per posting date and order type; when the range covers more than one, the files are downloaded together as a ZIP.

Both use the same column layout, one row per ledger line:

```
PostingDate;PostingId;LineSequence;StoreId;RegisterId;AccountNumber;AccountName;
Category;Debit;Credit;CurrencyCode;VatCode;VatRate;VatAmount;Description;
ZReportNumber;Source
```

## Accounting Ledger custom report

The **Accounting Ledger** custom report produces one spreadsheet row per ledger line, with columns you configure on the report definition. Each row can pull fields from both the ledger line and its parent posting, so you can build, for example, an export shaped exactly to your ERP's import template.

It accepts the same criteria as the list view — date range, store, include-superseded — and can also be run for a **single posting** from the detail view. Very large result sets are truncated with a marker row; narrow the filters and re-run if you hit it.

## VAT settlement (Z-report)

For POS, each Z-report can produce a **tax-settlement CSV** summarising VAT per rate for that report — one row per VAT rate and direction (sale / refund), with columns:

```
Date;Store;Register;Direction;TaxGroupCode;ExternalCode;Rate;
TaxableAmount;VatAmount;GrossAmount
```

The `TaxGroupCode` and `ExternalCode` columns are currently empty, because the Z-report totals VAT by rate without [tax groups](ledger-tax-groups.md).

## Re-running web fulfillment

From the list view, **Generate web fulfillment postings** runs a **web-fulfillment backfill** for a date range (both dates inclusive, maximum **90 days**) and the stores from the store filter — or the stores selected at the top of the page when no store is filtered. It runs in the background with a progress bar and requires only **Posting enabled**, not **Web fulfillment posting enabled**.

Re-running is safe: transactions already on a posting are [skipped](ledger-postings.md#posting-lifecycle), and only transactions not yet posted are booked, on a new posting. A run never supersedes or changes an existing web-fulfillment posting. To book a range again from scratch, users with the **Administer** access level can first remove its web-fulfillment postings with **Delete postings** in the same dialog, which needs **Posting enabled**, both dates, and at least one store.

**Delete postings** removes web-fulfillment postings in every status, including `Exported` and `Reconciled`. Re-generating the range afterwards books those transactions again, which duplicates vouchers already sent to your accounting system.

To see what a run _would_ produce before committing it, use the [Posting Preview](ledger-preview.md) dry run instead.

## Related pages

*   [Posting Preview (dry run)](ledger-preview.md) — preview without committing.
*   [Postings & Ledger Lines](ledger-postings.md) — the model behind these views.
*   [API Reference](api-reference.md) — read the same data programmatically.
