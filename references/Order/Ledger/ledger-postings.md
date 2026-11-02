# Postings & Ledger Lines

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-postings

> The double-entry posting model in Omnium — how sales, VAT, tender, returns, and gift cards become balanced ledger lines, plus the posting lifecycle and reposting behaviour.

A **posting** is a voucher: a header plus a set of **ledger lines** whose debits equal credits. Omnium produces a posting per source event — a Z-report close, or a store's web-fulfillment day — and books each line to a general-ledger account drawn from your [Chart of Accounts](ledger-chart-of-accounts.md). A store's web-fulfillment day can have more than one posting: one per order type when per-order-type posting is on, and an additional one for transactions that arrive after the day was posted.

## Posting sources

| Source | When it is built | Scope |
| --- | --- | --- |
| `PosZReport` | Inline, when a register's Z-report is closed | One register's settlement: its sales, returns, tender, and gift cards. Counted cash, the opening float, and cash movements are not posted. |
| `WebFulfillment` | A daily batch, per store and accounting day | The web / click & collect payment transactions of that store's orders on that day: captures book the sale, credits book the refund |

A POS posting references the Z-report it was built from (`ZReportId`, `ZReportNumber`) and the register(s) it covers. A web-fulfillment posting covers a single store for a single posting date — and a single order type, when [per-order-type posting](ledger-config.md#posting-settings) is on — and references the contributing orders in `OrderIds`.

Web-fulfillment postings follow the **payment transaction date**, not the shipping date: an order's sales, VAT, and shipping book on the day its payment is captured (or sold, or invoiced), and a refund books on the day it is credited. The day is determined in the accounting [time zone](ledger-config.md#general-settings), so a capture just before midnight books to the correct period regardless of the server's clock. Lines and payments already registered on a linked POS sale (for example a click & collect order paid in the store) are left out, so they are not booked twice. [Posting exclusions](ledger-posting-exclusions.md) can remove further orders.

POS postings are dated with the Z-report's date in UTC.

## The double-entry model

Each ledger line records an amount as either a **debit** or a **credit** against one GL account. Omnium follows standard retail accounting conventions:

| Event | Account category | Debit | Credit |
| --- | --- | --- | --- |
| Sale of goods | `Sales` |  | ✓ |
| Output VAT on a sale | `OutputVat` |  | ✓ |
| Shipping charged to the customer | `Shipping` |  | ✓ |
| Tender received (card, Vipps, cash, …) | `PaymentMethod` | ✓ |  |
| Gift card used as tender | `GiftCardLiability` | ✓ |  |
| Gift card sold | `GiftCardLiability` |  | ✓ |
| Return / credit of goods | `Sales` | ✓ |  |
| Output VAT reversed on a return | `OutputVat` | ✓ |  |
| Refund paid back to the customer | `RefundPaymentMethod` |  | ✓ |
| Rental deposit taken | `DepositLiability` |  | ✓ |
| Rental deposit refunded | `DepositLiability` | ✓ |  |
| Cost of goods returned to another store in the same store group | `InternalTransferIn` / `InternalTransferOut` | ✓ (in) | ✓ (out) |

Sales and output VAT are **credited** when goods are sold and **debited** when goods are returned; tender is **debited** when money comes in and refunds are **credited** when money goes out. The two sides meet so that the voucher balances.

### Account categories

Every ledger line is classified with a category. Categories are how the [Chart of Accounts](ledger-chart-of-accounts.md) decides which account number to book against.

| Category | Represents |
| --- | --- |
| `Sales` | Revenue from goods sold |
| `RentalSales` | Revenue from rentals, when the chart has a `RentalSales` entry (otherwise rentals book to `Sales`). Returned as `Other` by the public API. |
| `OutputVat` | VAT collected on sales (output/sales VAT) |
| `PaymentMethod` | Tender received for a sale |
| `RefundPaymentMethod` | Tender paid back on a refund |
| `Shipping` | Shipping/freight charged to the customer |
| `Discount` | Discounts given |
| `Rounding` | Currency rounding differences |
| `Receivable` | Amounts owed by the customer (e.g. web sales awaiting settlement) |
| `GiftCardLiability` | Outstanding gift-card balance (a liability) |
| `PaymentProviderFee` | Fees charged by a payment provider |
| `InternalTransferOut` / `InternalTransferIn` | Cost of goods moved between stores when an item is returned to another store in the same store group |
| `DepositLiability` | Refundable customer deposit, such as a rental deposit (a liability, not revenue) |
| `CashFloat` | Opening / closing till float (a balance-sheet asset) |
| `CashInTransit` | Cash deposited to the bank but not yet cleared |
| `OverShort` | Cash discrepancy (suspense). Postings book only [auto-balancing](ledger-postings.md#auto-balancing) residuals here: a Z-report's counted cash is not posted. |
| `Tip` | Tip-pool liability (in markets that support tips) |
| `Other` | Anything not covered above |

Posting generation does not currently produce `Discount`, `PaymentProviderFee`, `CashFloat`, `CashInTransit`, `Tip`, or `Other` lines — discounts are netted into the sales amounts. `Rounding` is used only by the **Export bookkeeping file** under **Reports → Payments** and by **Payment Ledger** [custom reports](../../configuration/custom-reports.md). See [Categories and when they are used](ledger-chart-of-accounts.md#categories-and-when-they-are-used).

## How sales and VAT are split

Sales and output VAT lines are **split by VAT rate**. If a fulfillment day contains goods at 25% and goods at 15%, the posting carries a separate `Sales` line and a separate `OutputVat` line for each rate; a 0% rate produces a `Sales` line but no `OutputVat` line. On web-fulfillment postings, when [tax groups](ledger-tax-groups.md) are enabled, the split also carries the tax-group code, so the same 0% rate can be distinguished — and booked to different accounts — between, for example, "zero-rated" and "outside VAT scope". `OutputVat` lines also carry the group's external VAT code (MVA-kode) when the order line has it.

POS postings are built from the Z-report, which totals VAT per rate and sales per product group and rate, without tax groups. A product group that holds items at several rates, such as toys at 25% and sweets at 15%, gets one `Sales` line per rate. POS lines carry no tax-group code, and their accounts are [resolved by rate](ledger-chart-of-accounts.md#how-an-account-is-resolved).

## How payments are split

Payments get one `PaymentMethod` line per payment method, and refunds one `RefundPaymentMethod` line per method. On web-fulfillment postings, a method's payments taken at different stores get one line per store.

When the chart of accounts has [entries per payment type](ledger-chart-of-accounts.md#accounts-per-payment-type) (`Nets|Visa`), each type with an entry gets a line of its own, described with the type in brackets (`Payment — Nets (Visa)`), and the method's line keeps the rest, so the lines still add up to the method's total. Without such entries the lines, and the [posting hash](ledger-postings.md#reposting-and-the-posting-hash), are the same as before.

## Gift cards

Gift cards are handled as a **liability**, not as revenue or ordinary tender:

*   **Selling** a gift card credits `GiftCardLiability` (you now owe the bearer that value).
*   **Redeeming** a gift card as tender debits `GiftCardLiability` (the liability is drawn down), instead of booking to a `PaymentMethod` account.
*   **Refunding** to a gift card credits `GiftCardLiability` again.

This keeps gift-card float off the revenue and cash accounts and isolates it on a single liability account.

## Auto-balancing

A posting must balance. If the lines leave a residual imbalance larger than the configured [balance tolerance](ledger-config.md#posting-settings), Omnium adds a single balancing line and flags the posting with `AutoBalanced = true`:

*   **POS** postings balance to the **Over/Short** account (`OverShort`).
*   **Web fulfillment** postings, where sales exceed tender (the customer still owes money), balance to a **Receivable** account. Where tender exceeds sales, they balance to `OverShort`.

Small imbalances within the tolerance are left as-is. The `Imbalance` field on the posting reports the signed residual (debit minus credit); it should be `0` on a balanced posting. The auto-balancing line also adds a note to the posting's `Warnings`.

If auto-balancing needs a `Receivable` or `OverShort` account and none is configured, the posting is not created: for a Z-report the error is logged and the Z-report itself still succeeds; for a web-fulfillment run that store and day is counted as failed.

## Posting lifecycle

A posting moves through a status lifecycle:

| Status | Meaning |
| --- | --- |
| `Draft` | Being assembled; not yet final. Draft postings are internal and are never returned by the public API. |
| `Posted` | Final and balanced; the normal state of a completed posting. |
| `Exported` | Sent to the ERP / accounting system. Carries an `ExternalReference` (the ERP voucher ID) and `ExportedAt`. |
| `Reconciled` | Confirmed reconciled against the ERP. |
| `Rejected` | Rejected by an operator; carries a `RejectionReason`. |
| `Superseded` | Replaced by a newer posting for the same source event. `SupersedesPostingId` on the replacement points back to the original. |

When a Z-report posting is regenerated, the previous posting is marked `Superseded` and a new posting is created. Superseded postings are retained for audit and can be included in searches and exports on request.

Web-fulfillment postings are never superseded. Each payment transaction is booked once: a run skips every transaction already on a posting that is not `Draft` or `Superseded` — `Rejected` postings included — and books only the rest. A transaction that arrives after its day was posted is therefore booked on an additional posting for that store and day. To book a transaction again, delete the posting that holds it first.

## Reposting and the posting hash

Every posting carries a **posting hash** — a deterministic SHA-256 over its identity fields and its ordered ledger lines. Lifecycle fields (status, export timestamp, external reference) are deliberately excluded from the hash.

Because the hash depends only on the underlying facts, recomputing the same source event yields the same hash. Compare the hash of a regenerated posting with the one it supersedes to tell whether anything actually changed.

## Related pages

*   [Configuration](ledger-config.md) — enable postings and tune balancing and scheduling.
*   [Chart of Accounts](ledger-chart-of-accounts.md) — map categories and rates to account numbers.
*   [Tax Groups](ledger-tax-groups.md) — VAT codes and MVA-koder.
*   [API Reference](api-reference.md) — read postings and lines programmatically.
