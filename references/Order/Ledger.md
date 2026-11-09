# Ledger

Source: https://docs.omnium.no/docs/Order/Ledger

> Accounting postings in Omnium — how sales, VAT, tender, and gift cards are turned into balanced double-entry vouchers for export to your ERP or accounting system.

The Ledger turns the commercial activity that flows through Omnium — POS sales, web and click & collect fulfillment, returns, gift cards, and tender — into **balanced double-entry accounting postings**. Each posting is a voucher: a set of ledger lines whose debits equal credits, ready to export to your ERP or accounting system.

Postings are generated automatically from two sources:

*   **POS Z-report close** — when a register's Z-report is settled, Omnium builds the posting for that register inline.
*   **Web fulfillment** — a daily batch posts the previous accounting day's payment transactions — captures and refunds — of the web and click & collect orders at each store.

Every line carries the GL account and debit/credit amount, and — where relevant — the VAT code, VAT rate, and tax-group code, so the resulting voucher is self-describing and reconcilable.

The Ledger is **off by default** and enabled per tenant. Posting generation and the tax-group subsystem are independent switches — tax groups tag products and order lines without postings enabled, and postings can be generated without tax groups. See [Configuration](Ledger/ledger-config.md).

* * *

## In this section

*   [Postings & Ledger Lines](Ledger/ledger-postings.md) — How postings are built, the double-entry model, gift-card tender, VAT splitting, and the posting lifecycle
*   [Configuration](Ledger/ledger-config.md) — Tenant accounting settings — enable postings, currency, time zone, balancing, and the daily web-fulfillment job
*   [Chart of Accounts](Ledger/ledger-chart-of-accounts.md) — Map Omnium events to GL accounts — categories, discriminators, country presets, and payment-method generation
*   [Tax Groups (VAT codes)](Ledger/ledger-tax-groups.md) — Tenant-managed VAT codes that tag products and lines with a rate and a SAF-T / ERP MVA-kode
*   [Posting Exclusions](Ledger/ledger-posting-exclusions.md) — Keep selected orders out of web-fulfillment postings by market, store, order type, status, or payment method
*   [Store Accounts](Ledger/ledger-store-accounts.md) — Replace individual tenant accounts for one store, and set the store's accounting company and dimension codes
*   [Postings in the UI](Ledger/ledger-reports.md) — Browse postings under Reports, inspect ledger lines, export CSV, and run the Accounting Ledger custom report
*   [Posting Preview (dry run)](Ledger/ledger-preview.md) — Preview the postings an order or date range would generate, without committing them
*   [API Reference](Ledger/api-reference.md) — Read postings and ledger lines through the public Accounting API
*   [Export to an Accounting System](Ledger/ledger-accounting-export.md) — How POS and web postings fit together, and how to book them as vouchers from the Accounting API

* * *

## Key terms

| Term | Meaning |
| --- | --- |
| **Posting** | A voucher header summarising one balanced set of ledger lines. One posting per source event (a Z-report close, or one store's fulfillment day — split per order type when configured, plus additional postings for late transactions). |
| **Ledger line** | A single debit or credit entry against one GL account. A posting has many lines. |
| **GL account** | A general-ledger account number in your accounting system. Omnium books each line to one account. |
| **Chart of Accounts** | The tenant's mapping from Omnium events (sales at a given rate, a tender type, a gift-card sale) to GL account numbers. |
| **Tax group** | A tenant-defined VAT code carrying a rate and an ERP/SAF-T external code (MVA-kode). Tags products, prices, and lines. |
| **Source** | Where a posting came from: `PosZReport` or `WebFulfillment`. |
| **Posting hash** | A deterministic hash over a posting's identity and lines, used to tell whether a regenerated posting differs from the one it replaces. |
