# Posting Exclusions

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-posting-exclusions

> Keep selected orders out of web-fulfillment accounting postings with exclusion rules that filter by market, store, order type, order status, payment method, order tags, and sales or return side.

**Posting exclusions** are rules that keep matching orders out of [web-fulfillment postings](ledger-postings.md#posting-sources). Use them when some orders are booked another way — for example marketplace orders settled through the marketplace's own accounting, or B2B orders invoiced from an ERP — so the same revenue and payments are not booked twice.

Rules are managed under **Configuration → Settings → Finance → Accounting settings**, in the **Posting exclusions** card. Select **Add exclusion rule** to add one, and the delete icon to remove it.

Exclusions apply **only to web-fulfillment postings**. POS postings built from Z-reports and the **Export bookkeeping file** under **Reports → Payments** are never affected. Rules have no effect unless **Web fulfillment posting enabled** is on, or postings are generated manually from **Reports → Accounting**.

## Rule fields

| Field | Description |
| --- | --- |
| Name | Label describing the rule's purpose. Not used for matching. |
| Active | Only active rules are evaluated. |
| Markets | The order's market. |
| Market groups | The market group of the order's market. An order whose market has no market group never matches this filter. |
| Stores | The order's store, or the store the posting is booked at when the order has no store. |
| Store Groups | The store group of that store. |
| Order types | The order's order type. |
| Order statuses | The order's status. |
| Payment methods | Matches when **any** real-money payment on the order (captured, sold, invoiced, or credited) uses one of the listed payment method names. |
| Included tags | Matches when the order has **any** of the listed tags. |
| Excluded tags | The rule never matches an order that has **any** of the listed tags, even when the order has one of the included tags and matches every other filter. |
| Transaction types | Which side of a matching order to exclude: `Sales`, `Return`, or both. Empty excludes both. |

Both tag lists offer the [order tags](../order-config.md#tags) configured in the order settings.

Order type, order status, and tags are evaluated **when the posting is generated**, not when the order was placed. An order that changes status or tags between runs can match on one run and not on the next.

## How rules are evaluated

*   **Within a rule**, every filter you fill in must match (AND). An empty filter matches every order. Matching is case-insensitive.
*   **Excluded tags** work the other way round: an order with one of them is never matched by that rule. Other rules can still match the order.
*   **Across rules**, one matching active rule is enough (OR). When several rules match, their transaction types add up.
*   **`Sales`** removes the sale side of the order from the posting: its product lines, shipping, captured payments, and deposits taken.
*   **`Return`** removes the refund side: refunds, returned lines, and deposit refunds.
*   Each side is removed together with its payments, so the remaining posting still balances.

Transactions that a rule excludes are not recorded as posted. If you later remove or narrow a rule, generate web-fulfillment postings for the affected days under **Reports → Accounting** to book them.

To stop using a rule, remove it. Turning **Active** off is currently not kept when the settings are saved — the rule is read back as active.

## Examples

| Goal | Filters | Transaction types |
| --- | --- | --- |
| Leave marketplace orders out entirely | Order types: `Marketplace` | Empty (both) |
| Book B2B sales from the ERP, but keep returns in Omnium | Market groups: `B2B` | `Sales` |
| Leave out orders paid by invoice in one market | Markets: `NO`; Payment methods: `invoice` | Empty (both) |
| Leave out rental orders, but keep rentals that ended in a sale | Included tags: `rental`; Excluded tags: `rental-sale` | Empty (both) |

## Validation

The **Validation** tab reports exclusion problems — see [Configuration](ledger-config.md#validation):

*   active rules exist while **Web fulfillment posting enabled** is off (info);
*   an active rule has no filters, so it matches every order — and with both transaction types it turns web-fulfillment postings off entirely (warning);
*   a rule references an unknown market, market group, store group, order type, order status, or payment method (warning). Stores are not checked, and neither are tags, because orders can carry tags that are not in the order settings;
*   a rule has an unknown transaction type (error).

## Related pages

*   [Postings & Ledger Lines](ledger-postings.md) — what the sales and return sides of a web-fulfillment posting contain.
*   [Configuration](ledger-config.md) — web-fulfillment posting settings.
*   [Postings in the UI](ledger-reports.md) — re-run web fulfillment for a date range.
