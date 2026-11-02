# Orders

Source: https://docs.omnium.no/docs/Order

> Order management in Omnium — lifecycle, workflows, returns, click & collect, and API reference.

Orders are the core of Omnium. An order can originate from any sales channel — a webshop, POS, phone order, or B2B portal — and flow through configurable workflows that handle payment, inventory, fulfillment, and notifications automatically.

Each order follows a lifecycle defined by its **order type**, moving through statuses like New, InProgress, Ship, and Completed. At each status transition, **workflow steps** execute the business logic you've configured.

* * *

## In this section

*   [API Reference](Order/api-reference.md) — Import, update, search, and manage orders via the API
*   [Invoices API](Order/invoices-api.md) — Read the invoices, receipts and credit notes of an order, and download them as PDF
*   [Configuration](Order/order-config.md) — Order types, statuses, workflow configuration, and settings
*   [Sample Order Types](Order/order-type-samples.md) — Sample order type configurations for click and collect, an online order with home delivery or pickup in store from a warehouse or a store, and endless aisle sales
*   [Order Lifecycle](Order/order-lifecycle.md) — How orders flow from creation to completion, with statuses and transitions
*   [Order Locking](Order/order-locking.md) — Concurrent order updates, the optional per-order lock, and the 409 ResourceLocked response
*   [Click & Collect (BOPIS)](Order/order-click-and-collect.md) — Buy online, pick up in store — setup, workflows, and integration
*   [Pick Lists](Order/order-pick-lists.md) — Grouping shipments for picking — statuses, deviation handling, and the Pick List API
*   [Returns](https://docs.omnium.no/docs/Order/Returns) — Return API, configuration, and return workflow steps
*   [Workflow Steps Reference](Order/workflow-steps.md) — All available workflow steps — allocation, payment, inventory, shipments, and more
*   [Allocation Simulator (BETA)](Order/Allocation/allocation-simulator.md) — See which warehouses an order would ship from, and why, without changing anything
*   [Workflows Overview](Order/workflow-steps.md) — How workflows are structured and how order types connect to them
*   [Ledger](Order/Ledger.md) — Accounting postings — double-entry vouchers, chart of accounts, VAT codes, and export
*   [FAQ](Order/order-faq.md) — Common questions about order handling in Omnium
