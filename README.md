# Omnium OMS Skill

A Claude Code skill that provides complete reference documentation for the [Omnium OMS](https://docs.omnium.no) (Order Management System) platform.

## What is this?

This skill gives Claude Code deep knowledge of the Omnium OMS API and platform — endpoints, data models, integration patterns, and domain concepts. When installed, Claude can answer questions about Omnium and help you build integrations without constantly referring to external docs.

## When does it activate?

The skill triggers when you mention anything related to Omnium OMS, including:

- Order management, cart/checkout flows, customer management (B2C/B2B)
- Product catalog, inventory, pricing, promotions
- Purchase orders, stores/markets, notifications, analytics
- Omnium-specific concepts like workflow steps, click & collect, delta queries, scroll search
- Any Omnium API endpoint

## Structure

```
SKILL.md              # Skill definition and routing table (always in context)
api/                  # API reference, generated from the OpenAPI spec
  _INDEX.md           # Conventions (hand-written), endpoint files and key schemas (generated)
  endpoints/          # One file per Swagger tag, e.g. orders/get.md
  schemas/            # One file per schema, plus _INDEX.md listing them all
references/           # Conceptual documentation from docs.omnium.no (generated)
  _INDEX.md           # Every page with its description, grouped by topic
  Order.md, Order/... # One Markdown file per docs.omnium.no page, mirroring the site
scripts/sync-docs.ts  # Regenerates references/ from the live site
scripts/sync-api.ts   # Regenerates api/ from the OpenAPI spec
```

### API reference (`api/`)

Endpoints, parameters, and request/response schemas for the whole public API, generated from Omnium's OpenAPI spec (`https://api.omnium.no/docs/oms/docs.json`) by `scripts/sync-api.ts`. Don't edit `api/endpoints/` or `api/schemas/` by hand. In `api/_INDEX.md` and `SKILL.md`, only the blocks between the `BEGIN`/`END generated` comments are generated; the conventions around them are hand-written. Run it locally with `npm run sync:api`.

### Domain knowledge (`references/`)

Conceptual documentation covering how things work, best practices, and integration patterns — from getting started and order lifecycle to checkout flows, inventory management, and more.

This folder is generated — don't edit it by hand. The [Sync Omnium docs and API reference](.github/workflows/sync-omnium.yml) workflow runs daily (or on demand from the Actions tab), regenerates `references/` from the [docs.omnium.no sitemap](https://docs.omnium.no/sitemap.xml) and `api/` from the OpenAPI spec, and opens a pull request when anything changed. To run it locally:

```sh
npm ci
npm run sync        # both; or npm run sync:docs / npm run sync:api for one
```

This needs Node 24 or later, which runs the TypeScript files directly. Topics come from the site: each top-level section (`/docs/Order`, `/docs/Inventory`, …) becomes a topic in `_INDEX.md`, named and summarized by its landing page, and the same topics generate the routing table in `SKILL.md` (between the `BEGIN`/`END generated routing table` comments). New or renamed sections are picked up without code changes. To merge small sections, rename a topic, improve a weak summary, or add a topic that spans sections, edit `SECTION_OVERRIDES` or `EXTRA_TOPICS` in `scripts/sync-docs.ts`; the sync logs a warning when an override refers to a section that no longer exists. The rest of `SKILL.md` is hand-written.

While a sync PR is open, later runs update that same PR instead of opening a new one. Don't push manual commits to its branch (`automation/sync-omnium`), because the next run overwrites them.

The workflow needs **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests** enabled.

## Installation

Add this skill to your Claude Code setup by placing it in your skills directory or referencing it in your configuration. See the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) for details on installing skills.

## Quick API reference

| **Endpoint**      | **Description**                                                          |
|:------------------|:-------------------------------------------------------------------------|
| **Base URLs**     | `https://api.omnium.no` (prod) / `https://apitest.omnium.no` (test)      |
| **Auth**          | `POST /api/token?clientId=...&clientSecret=...` → JWT (valid 10 days)    |
| **Swagger**       | `https://api.omnium.no/documentation`                                    |
| **Search**        | `POST /api/{resource}/Search` (max 10,000 results)                       |
| **Scroll**        | `POST /api/{resource}/Scroll` (for large datasets)                       |
| **Bulk ops**      | `AddMany`, `PatchMany`, `UpdateMany` (100–1000 items per batch)          |
| **Delta queries** | `GET /api/{resource}/GetAll?changedSince=...`                            |
