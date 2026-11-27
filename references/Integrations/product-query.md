# Product Query

Source: https://docs.omnium.no/docs/Integrations/product-query

> The unified product query API — single-product lookups, filtered lists, pagination, and bulk extraction with explicit pricing context and configurable response shape.

## Overview

The Product Query API is the primary way to fetch products in Omnium. Two endpoints cover every fetch pattern:

*   **`POST /api/products/Query`** — single-product lookups, filtered lists, paginated UI queries
*   **`POST /api/products/Query/Scroll`** — bulk extraction (catalog syncs, exports, reindexing, delta replication)

Both endpoints return full `OmniumProduct` models and accept the same filter set. They differ only in pagination model: offset-based (`Query`) vs. streaming (`Query/Scroll`).

These endpoints replace `POST /api/products/Search`, `POST /api/products/Scroll`, and the various `ByMarket`/`ByStore`/`ByCustomer` GET endpoints. The legacy endpoints still work but are scheduled for deprecation.

* * *

## Picking an endpoint

| You're doing… | Use |
| --- | --- |
| Fetching one product (with optional pricing context) | `POST /Query` |
| Showing a paginated list in a UI | `POST /Query` |
| Filtering products with text search, tags, categories | `POST /Query` |
| Replicating products to another system (PIM, ERP, marketplace) | `POST /Query/Scroll` |
| Exporting or reindexing the full catalog | `POST /Query/Scroll` |
| Anything past offset `Take * Page` = 10,000 | `POST /Query/Scroll` |

* * *

## ID lookups

Four ID-shaped fields cover every lookup pattern. Choose the one that matches what you actually have:

| Field | Matches | Use when |
| --- | --- | --- |
| `productIds` | `Product.ProductId` only | You have business product IDs |
| `skuIds` | `Product.SkuId` OR `Variants[].SkuId` | You have SKU codes (SKU treated as one logical concept regardless of product- or variant-level) |
| `ids` | `Product.Id` (internal Omnium document id) | You have internal IDs |
| `anyIds` | Any of the above plus `ParentId` | You don't know what kind of ID you have (barcode scanning, dirty data imports, customer-supplied IDs) |

The strict fields (`productIds`, `skuIds`, `ids`) are precise and predictable. `anyIds` is the fuzzy option — it matches across all ID-shaped fields, useful when consumers don't know the ID source upfront.

* * *

## Pricing context

`marketIds`, `storeIds`, `customerId`, `customerGroups`, `storeGroupIds`, `additionalPriceStoreIds`, `priceValidFrom`, and `priceValidTo` filter:

1.  **Which products are returned** — availability, market eligibility, store assortment
2.  **Which prices on those products come back** — only prices matching the context

Set `includeAllPrices: true` to keep the product filtering but disable the price filter — useful for price-management UIs that need every price for the products in a market.

### Products without a market

A product with no `marketIds` counts as available in **every** market. A query for `marketIds: ["NOR"]` therefore returns both the products that list `NOR` and the products that list no market at all.

Set `isMarketRequired: true` to drop the marketless products and keep only real market matches:

```json
{
  "marketIds": ["NOR"],
  "isMarketRequired": true
}
```

| `isMarketRequired` | Result |
| --- | --- |
| `true` | The product must list one of the requested markets |
| `false` | Products with no market are returned next to the market matches |
| omitted | The tenant configuration decides |

The field only narrows the market filter. A request without `marketIds` and `marketGroupIds` has no market filter, so `isMarketRequired` changes nothing.

* * *

## Field selection — shape your response

Use `fields.exclude*` flags to drop heavy parts of the response, or `fields.include` to opt into a narrow set:

**Exclude flags** (booleans):

*   `excludeAssets`, `excludeInventory`, `excludeProperties`
*   `excludeVariants`, `excludePrices`, `excludeCategories`

**Include list** (strings):

*   Top-level fields: `["productId", "name", "prices"]`
*   Nested variant subfields: `["variants.skuId", "variants.size"]`

When `fields.include` lists nested variant subfields, every other variant field is stripped from the response. Useful for cart pickers and barcode-scanner UIs.

* * *

## Default values are omitted from responses

To keep responses small, both endpoints leave out fields that hold their default value. A missing field is not "unknown" — it means the value below.

| Missing field | Means |
| --- | --- |
| Boolean | `false` |
| Number | `0` |
| String, object or array | `null` |
| Date | `0001-01-01T00:00:00` |
| Id | `00000000-0000-0000-0000-000000000000` |
| Enum | its first value |
| Anything marked `nullable` | `null` |

A product returned without `isActive` is **not** active. One without `availableInventory` has `0` available. Map missing fields to these values — do not treat them as "not set" or "unchanged".

`""` and `[]` are real values and are always returned. The rule applies at every level, including variants, prices, inventory and properties.

### Nullable fields disappear only on `null`

When a field is marked `nullable` in the schema, `null` is its default — so `false` and `0` are ordinary values there and are always returned. `preventPackageSplit` comes back as `false` when it is set to false, and is missing only when it was never set. The same goes for `weight`, `taxRate`, `published` and every other nullable field.

### Example

A product where `isActive` and `isInStock` are `true`, `isBundle` is `false`, `availableInventory` is `0`, and `description` and `startDate` are not set:

```json
{
  "productId": "PROD-123",
  "name": "Summer Jacket",
  "isActive": true,
  "isInStock": true
}
```

* * *

## Response size guidance

The default response includes the full product model — variants, prices, assets, inventory, properties. Approximate per-product wire size:

| Configuration | Size per product |
| --- | --- |
| Default (full model) | ~20–50 KB |
| `fields.excludeAssets` | ~10–30 KB |
| `excludeAssets` + `excludeInventory` + `excludeProperties` | ~3–8 KB |
| `fields.include: ["productId","name","prices"]` | ~1 KB |

For high-volume queries (`take` ≥ 100, scroll batches), exclude fields aggressively. A 500-product scroll batch can exceed 10MB at default settings; the `excludeAssets + excludeInventory + excludeProperties` pattern trims that to roughly 2MB.

* * *

## Recipes

### Single product with market pricing

The simplest case: one product with prices filtered to one market.

```json
{
  "productIds": ["PROD-123"],
  "marketIds": ["NOR"]
}
```

### Single product with B2B / customer-group pricing

Returns the product with the customer's prices applied. Customer-specific prices take precedence over group prices, which take precedence over general prices.

```json
{
  "productIds": ["PROD-123"],
  "marketIds": ["NOR"],
  "customerId": "CUST-456",
  "customerGroups": ["VIP"]
}
```

### Product browse / search list (lightweight)

Typical for product browse and search UI. Heavy fields excluded to keep batches tight and fast.

```json
{
  "take": 50,
  "page": 1,
  "searchText": "shoes",
  "marketIds": ["NOR"],
  "isActive": true,
  "fields": {
    "excludeAssets": true,
    "excludeInventory": true,
    "excludeProperties": true
  }
}
```

### Cart picker — minimal variant fields per product

Variants in the response will contain only `skuId` and `size`; every other variant field is stripped. Use this for cart pickers, barcode-scanner reverse lookups, and any UI needing minimal variant metadata.

```json
{
  "productIds": ["PROD-123"],
  "marketIds": ["NOR"],
  "fields": {
    "include": ["productId", "name", "prices", "variants.skuId", "variants.size"]
  }
}
```

### Multi-property filter (AND)

Returns products matching ALL listed property pairs.

```json
{
  "marketIds": ["NOR"],
  "properties": [
    { "key": "Color", "value": "Red" },
    { "key": "Size",  "value": "L" }
  ]
}
```

### Bulk export — full catalog scroll, lightweight

Streams every active product through scroll batches.

```json
{
  "scrollSize": 500,
  "isActive": true,
  "fields": {
    "excludeAssets": true,
    "excludeInventory": true,
    "excludeProperties": true
  }
}
```

### Delta sync — replicate changes to another system

The canonical "replicate to another system" pattern. With `isUnionDeltaQuery: true` the date windows OR together, so one request captures every product touched in the window: modifications, publish/unpublish events, and price activations/deactivations.

Run this on a 5-minute cron for an idempotent product sync pipeline. Persist the `From` timestamp from your last successful run and use it as the next `From`. See [Delta Queries](data-out.md#predictive-delta-queries) for the full predictive-window pattern.

```json
{
  "marketIds": ["NOR"],
  "scrollSize": 500,
  "isUnionDeltaQuery": true,
  "modifiedFrom": "2025-01-08T10:15:00Z",
  "startPublishFrom": "2025-01-08T10:15:00Z",
  "startPublishTo": "2025-01-08T10:20:00Z",
  "stopPublishFrom": "2025-01-08T10:15:00Z",
  "stopPublishTo": "2025-01-08T10:20:00Z",
  "priceActivatedFrom": "2025-01-08T10:15:00Z",
  "priceActivatedTo": "2025-01-08T10:20:00Z",
  "priceDeactivatedFrom": "2025-01-08T10:15:00Z",
  "priceDeactivatedTo": "2025-01-08T10:20:00Z"
}
```

* * *

## Pagination vs scroll mechanics

### POST /Query (offset pagination)

*   `take` — page size. Default 10. Max 1000.
*   `page` — 1-indexed page number. Default 1.
*   Hard cap: `take * page < 10,000`. Past that, switch to scroll.

### POST /Query/Scroll (streaming)

*   `scrollSize` — batch size. Default 500. Allowed range: 100–1000.
*   Returns `scrollId` plus the first batch.
*   Continue with `GET /api/products/Query/Scroll/{scrollId}` until `scrollId` is null.
*   Sessions expire after 10 minutes of inactivity.
*   Per-tenant cap on concurrent active scrolls.
*   Scroll skips post-processing (inventory zero-stripping, property-list filtering) for batch consistency across batches.

Always finish a scroll. Unfinished scrolls hold a snapshot context on the server until the inactivity timeout expires, consuming resources unnecessarily. Per-tenant concurrency is also capped, so leaking scrolls will cause new ones to be rejected.

* * *

## Rate limiting

Both endpoints use a generous concurrency policy. The scroll endpoints additionally enforce a strict per-tenant concurrency limit (default 3 active scrolls) to protect the search cluster. If a fourth concurrent scroll is attempted, the request is rejected with HTTP 429.

* * *

## Swagger reference

For the full interactive API reference and request/response schemas, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
