# Posting Preview (dry run)

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-preview

> Preview the accounting postings an order or a store/date range would generate, without committing them — useful for validating the chart of accounts and tax groups before going live.

**Posting Preview** is a dry run: it builds the web-fulfillment postings that an order — or a store and date range — _would_ produce, and shows them without writing anything. Nothing is committed, no posting is created or superseded, and no export is affected. It is the safe way to validate your [Chart of Accounts](ledger-chart-of-accounts.md) and [tax groups](ledger-tax-groups.md) before enabling the scheduled job, and to answer "what will this order book to?" at any time.

Preview requires **Posting enabled** to be on (see [Configuration](ledger-config.md#posting-settings)). Previewing from **Reports → Accounting** does not require the daily web-fulfillment job to be enabled — you can preview before turning the job on.

## Previewing a single order

From an order's **Payments** tab, the menu in the payment list header offers **Preview postings** when **Web fulfillment posting enabled** is on. This builds the posting(s) that order would contribute to and opens a results panel — no date range needed.

## Previewing a store / date range

From **Reports → Accounting**, **Preview postings** lets you preview by:

*   **Order ID** — a single order (overrides the other filters), or
*   **Date range + stores** — the web-fulfillment postings for the selected stores and days in the range (maximum **90 days**). The stores come from the store filter, or from the stores selected at the top of the page when no store is filtered.

The preview builds the whole day for each store, including transactions that are already on a posting. When a posting already exists for a store and day, the result is marked as skipped, with a link to the existing posting — a real run would then book only the transactions not yet posted, on an additional posting.

## Reading the results

The results panel lists each posting that would be generated, with its store, accounting date, totals, and balancing outcome. Each posting can be expanded to inspect the individual [ledger lines](ledger-postings.md) — account number and name, category, debit, credit, VAT code, store, and description.

Because the preview runs the **same builder** as the real job, what you see for a day that has not been posted yet is what would be committed — including any [auto-balancing](ledger-postings.md#auto-balancing) line and any builder warnings. A line whose account the [Chart of Accounts](ledger-chart-of-accounts.md) can't resolve shows an empty account number; a missing `Receivable` or `OverShort` account needed for auto-balancing is reported as an error. Fix the configuration before any real posting is attempted.

## Preview vs. committed runs

|  | Preview | Scheduled job / backfill |
| --- | --- | --- |
| Writes postings | No | Yes |
| Supersedes prior postings | No | No — transactions already posted are skipped |
| Affects exports | No | Yes |
| Requires Posting enabled | Yes | Yes |
| Scope | One order, or store + range | Store + accounting day(s) |

## Related pages

*   [Postings in the UI](ledger-reports.md) — browse and export committed postings, and run a real backfill.
*   [Postings & Ledger Lines](ledger-postings.md) — the model and auto-balancing rules a preview reflects.
*   [Configuration](ledger-config.md) — enabling postings and validation.
