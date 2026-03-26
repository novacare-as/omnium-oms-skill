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
api/
  index.md            # API table of contents
  endpoints/          # Endpoint specifications per domain
  schemas/            # Request/response schemas per domain
references/           # Conceptual documentation from docs.omnium.no
```

### API reference (`api/`)

Structured API specifications covering authentication, orders, carts, customers, products, inventory, prices, promotions, stores, purchase orders, notifications, analytics, and configuration.

### Domain knowledge (`references/`)

Conceptual documentation covering how things work, best practices, and integration patterns — from getting started and order lifecycle to checkout flows, inventory management, and more.

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
