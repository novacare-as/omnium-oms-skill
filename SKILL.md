---
name: omnium-oms
description: >
  Complete reference for the Omnium OMS (Order Management System) platform — API endpoints, data models, 
  integration patterns, and domain knowledge. Use this skill whenever the user asks about Omnium OMS, 
  including order management, cart/checkout flows, customer management (B2C and B2B), product catalog, 
  inventory, pricing/promotions, purchase orders, stores/markets, notifications, analytics, or any 
  Omnium API endpoint. Also trigger when the user mentions Omnium-specific concepts like workflow steps, 
  order lifecycle, click & collect, delta queries, scroll search, or the Omnium GUI. Even if the user 
  only says "Omnium" or "OMS" in passing, consult this skill — it covers both the REST API and the 
  conceptual documentation at docs.omnium.no.
---

# Omnium OMS Skill

Omnium is a cloud-based Order Management System (OMS) and e-commerce platform for unified commerce. 
It manages orders from all sales channels (webshop, POS, phone, B2B portal) through configurable 
workflows handling payment, inventory, fulfillment, and notifications.

## Quick facts

- **API type**: RESTful JSON API with JWT Bearer authentication
- **Base URLs**: `https://api.omnium.no` (prod), `https://apitest.omnium.no` (test)
- **Auth**: `POST /api/token?clientId=...&clientSecret=...` → JWT token valid for 10 days
- **Swagger**: `https://api.omnium.no/documentation` (also segmented by domain)
- **Docs site**: https://docs.omnium.no

## How to use this skill

This skill has three layers. Read only what you need for the task at hand.

### Layer 1: This file (SKILL.md)
Always in context. Use the routing table below to decide which files to read next.

### Layer 2: Domain knowledge (references/)
Conceptual documentation from docs.omnium.no — how things work, best practices, integration patterns.
Read these when the user asks "how does X work" or "what's the best way to do Y".
`references/` mirrors the site: https://docs.omnium.no/docs/Order/order-click-and-collect is
`references/Order/order-click-and-collect.md`. It is refreshed daily from the live site, and each page names
its source URL. `references/_INDEX.md` lists every page with a one-line description, grouped by topic. It is
large, so search it for keywords or read only the topic section you need instead of reading the whole file.

### Layer 3: API reference (api/)
Structured API specification — endpoints, parameters, request/response schemas.
Generated from the OpenAPI spec and refreshed daily. Start with `api/_INDEX.md` for conventions and the endpoint file list.
Read these when the user asks about specific endpoints, request formats, or data models.

## Routing table

Use this table to determine which file(s) to read based on the user's question.

### Conceptual / "how does it work" questions → references/

<!-- BEGIN generated routing table: see SECTION_OVERRIDES in scripts/sync-docs.ts -->
| Topic | Section in `references/_INDEX.md` |
|-------|-----------|
| Carts and offers in Omnium — managing shopping carts, offers, and pre-order entities. | [Carts](references/_INDEX.md#carts) |
| Platform settings, scheduled tasks, GUI extensions, reports, and other configuration options in Omnium. | [Configuration](references/_INDEX.md#configuration) |
| Pre-built integrations maintained by the Omnium team — payment providers, shipping carriers, ERP systems, POS, CRM, and more. | [Connectors & Plugins](references/_INDEX.md#connectors--plugins) |
| Manage private (B2C) and business (B2B) customers in Omnium — profiles, loyalty clubs, and communication. | [Customers](references/_INDEX.md#customers) |
| Authentication, API conventions, search, pagination, scroll, error handling, security, environments | [Getting Started, API Conventions & Security](references/_INDEX.md#getting-started-api-conventions--security) |
| Learn how to synchronize data with Omnium using delta queries, events, queues, and other integration patterns. | [Integrations](references/_INDEX.md#integrations) |
| Inventory management in Omnium — stock levels, ATP calculations, inventory valuation, and virtual stock locations. | [Inventory](references/_INDEX.md#inventory) |
| Order management in Omnium — lifecycle, workflows, returns, click & collect, and API reference. | [Orders](references/_INDEX.md#orders) |
| How prices work in Omnium — price levels, promotions, price lists, prioritization, and tax handling. | [Prices](references/_INDEX.md#prices) |
| Product catalog, categories, assets, assortment | [Products](references/_INDEX.md#products) |
| Manage long-running activities like returns, claims, and complex sales processes using Omnium's project framework. | [Projects](references/_INDEX.md#projects) |
| Manage procurement in Omnium — create purchase orders, track supplier deliveries, handle goods reception, and reserve customer orders against incoming stock. | [Purchase Orders](references/_INDEX.md#purchase-orders) |
| What changed recently in Omnium | [Release notes](references/_INDEX.md#release-notes) |
| Stores, markets, warehouses, regions | [Stores & Markets](references/_INDEX.md#stores--markets) |
| Step-by-step guides (ERP, POS, omnichannel e-com integration) | [Tutorials](references/_INDEX.md#tutorials) |
| Email, SMS, notification templates | [Notifications — Email & SMS](references/_INDEX.md#notifications--email--sms) |
<!-- END generated routing table -->

### API endpoint / "which endpoint" / "how do I call" questions → api/

Find the area below, open its section in `api/_INDEX.md` to pick the endpoint file (one per Swagger tag),
then follow the schema links in that file. To look up a data model by name, search `api/schemas/_INDEX.md`
or open `api/schemas/<SchemaName>.md` directly.

<!-- BEGIN generated API routing table: see scripts/sync-api.ts -->
| Area | Tags | Endpoint files |
|------|------|----------------|
| Accounting | Ledger Lines, Postings | [api/_INDEX.md › Accounting](api/_INDEX.md#accounting) |
| Allocation | Allocation | [api/_INDEX.md › Allocation](api/_INDEX.md#allocation) |
| Assets | Files, Images | [api/_INDEX.md › Assets](api/_INDEX.md#assets) |
| Carts | Add, Checkout, Get, Line Items, Other, Search, Templates, Update | [api/_INDEX.md › Carts](api/_INDEX.md#carts) |
| Cases | Cases | [api/_INDEX.md › Cases](api/_INDEX.md#cases) |
| Comments | Comments | [api/_INDEX.md › Comments](api/_INDEX.md#comments) |
| Customers | B2B, B2B › Assets, B2B › Contact persons, B2C, B2C › Privacy, B2C › Versions, Customer groups | [api/_INDEX.md › Customers](api/_INDEX.md#customers) |
| Date Planners | Date Planners | [api/_INDEX.md › Date Planners](api/_INDEX.md#date-planners) |
| Event Log | Event Log | [api/_INDEX.md › Event Log](api/_INDEX.md#event-log) |
| Health | Health | [api/_INDEX.md › Health](api/_INDEX.md#health) |
| Insights | Insights | [api/_INDEX.md › Insights](api/_INDEX.md#insights) |
| Invoices | Invoices | [api/_INDEX.md › Invoices](api/_INDEX.md#invoices) |
| Markets | Markets | [api/_INDEX.md › Markets](api/_INDEX.md#markets) |
| Notifications | Notifications | [api/_INDEX.md › Notifications](api/_INDEX.md#notifications) |
| Obsolete | Obsolete | [api/_INDEX.md › Obsolete](api/_INDEX.md#obsolete) |
| Orders | Analytics, Batch Updates, Click and Collect, Get, Gift Cards, Invoices, Order Lines, Others, Payments, Pick Lists, Returns, Search, Shipments, Subscriptions, Update, Workflow | [api/_INDEX.md › Orders](api/_INDEX.md#orders) |
| POS | Reports | [api/_INDEX.md › POS](api/_INDEX.md#pos) |
| Products | Products, Alerts, Assets, Batch Updates, Categories, Cost Prices, Get, Inventory, Price List Items, Price Lists, Prices, Query, Recommendations, Rentals, RFID Tags, Search, Update, Variants | [api/_INDEX.md › Products](api/_INDEX.md#products) |
| Projects | Projects, Assets, Change orders, Logs, Parts, Project types, Reports, Time entries, Transactions, Versions | [api/_INDEX.md › Projects](api/_INDEX.md#projects) |
| Promotions | Promotions, Campaigns | [api/_INDEX.md › Promotions](api/_INDEX.md#promotions) |
| Purchase Orders | Purchase Orders, Deliveries, Workflows | [api/_INDEX.md › Purchase Orders](api/_INDEX.md#purchase-orders) |
| Ratings | Ratings | [api/_INDEX.md › Ratings](api/_INDEX.md#ratings) |
| Settings | Settings, Event Subscriptions, Products, Property Options | [api/_INDEX.md › Settings](api/_INDEX.md#settings) |
| Stores | Stores | [api/_INDEX.md › Stores](api/_INDEX.md#stores) |
| Suppliers | Suppliers | [api/_INDEX.md › Suppliers](api/_INDEX.md#suppliers) |
| Tokens | Tokens | [api/_INDEX.md › Tokens](api/_INDEX.md#tokens) |
| Triggers | Triggers | [api/_INDEX.md › Triggers](api/_INDEX.md#triggers) |
| Users | Users | [api/_INDEX.md › Users](api/_INDEX.md#users) |
| Vouchers | Vouchers | [api/_INDEX.md › Vouchers](api/_INDEX.md#vouchers) |
<!-- END generated API routing table -->

### Both layers needed

Some questions need both conceptual context and API details. For example:
- "How do I implement click & collect?" → read `references/Order/order-click-and-collect.md` first, then `api/endpoints/orders/click-and-collect.md`
- "Set up a checkout flow" → find the checkout pages under "Carts" in `references/_INDEX.md`, then `api/endpoints/carts/checkout.md`
- "Integrate our ERP with Omnium" → read `references/GettingStartedWithAPI/Tutorials/erp-integration.md` first, then the relevant endpoint files

## Common API patterns (quick reference)

These patterns apply across all domains — no need to look them up each time.

**Search**: `POST /api/{resource}/Search` with JSON body containing `take`, `page`, `sortOrder`, and filters.
Max result window: `take × page ≤ 10,000`. Disable facets with `disableFacets: true` for backend integrations.

**Scroll**: `POST /api/{resource}/Scroll` → returns `scrollId` → `GET /api/{resource}/Scroll/{scrollId}` until empty.
Use for datasets > 10,000 items.

**Patch**: `PATCH /api/{resource}/{id}/Patch{Resource}` — partial update, only supplied fields change.
Set `keepExistingCustomProperties: true` to merge (default), `false` to replace.

**Bulk operations**: Most resources support `AddMany`, `PatchMany`, `UpdateMany` — max 100-1000 items per batch.

**Delta queries**: `GET /api/{resource}/GetAll?changedSince=2025-01-01T00:00:00Z` — fetch only changed items.

**HTTP status codes**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized (token expired), 
404 Not Found, 409 Conflict (duplicate ID), 429 Rate Limited (check Retry-After header), 500 Server Error.
