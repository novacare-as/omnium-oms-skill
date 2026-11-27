# Products | Query

Source: https://api.omnium.no/documentation

> Query products with explicit market, store, and customer context. To keep responses small, a field holding its default value (false, 0, null, the empty date, the empty id) is left out — a missing field means that value, not "unknown". A nullable field defaults to null, so one holding false or 0 is still returned.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/products/Query`

**Query products. Returns full product models with explicit control over market, store, and customer context.**

Operation ID: `ProductQueryQuery`

Primary endpoint for fetching products: single-product lookups, filtered lists, and
paginated UI queries. Pagination is capped at offset (Take * Page) of 10,000 — past that,
use POST /api/products/Query/Scroll.

All filter fields are documented on the request schema below.

### Default values are omitted

To keep responses small, a field is left out when it holds its default value: `false`, `0`,
`null`, the empty date `0001-01-01T00:00:00`, the empty id
`00000000-0000-0000-0000-000000000000`, or an enum's first value. **A missing field means
that value, not "unknown".** `""` and `[]` are real values and are always returned.

A field marked `nullable` in the schema has `null` as its default, so it is left out only
when it is null — a nullable boolean holding `false`, or a nullable number holding `0`, is
still returned.

For the full reference, the ID-lookup matrix, and response-size guidance, see
https://docs.omnium.no/docs/Integrations/product-query.

### Examples

**1. Single product with market pricing.** The simplest case — one product, prices filtered
to one market.
```json
{
  "productIds": ["PROD-123"],
  "marketIds": ["NOR"]
}
```

**2. Single product with market pricing and tight payload** (recommended). Same as above
but only the fields you actually need. Variants come back with just `skuId` and `size` —
every other variant field is stripped. Cart pickers, barcode reverse-lookups, detail views.
```json
{
  "productIds": ["PROD-123"],
  "marketIds": ["NOR"],
  "fields": { "include": ["productId", "name", "prices", "variants.skuId", "variants.size"] }
}
```

**3. Category list page.** Paginated browse with market context and a tight response —
the canonical product-list-in-a-UI pattern.
```json
{
  "take": 50,
  "page": 1,
  "marketIds": ["NOR"],
  "productCategoryIds": ["CAT-summer-clothing"],
  "isActive": true,
  "fields": { "include": ["productId", "name", "prices", "mainImageUrl", "variants.skuId"] }
}
```

**4. Raw product lookup — all prices, no context filtering.** Use `includeAllPrices: true`
to bypass price-context filtering while keeping product-availability filtering. Useful for
price management UIs and audits where you need every price for a product, not just the
market/store/customer-relevant ones.
```json
{
  "productIds": ["PROD-123"],
  "marketIds": ["NOR"],
  "includeAllPrices": true
}
```

**5. Price context — scope prices independently of availability.** Top-level fields filter which
products are returned; `priceContext` controls which prices come back (and how they sort). Each
`priceContext` field overrides its top-level counterpart for pricing only — anything left out
falls back to the top-level value, so the common case needs no `priceContext` at all. Store
groups and additional price stores live here only (they never filter products). Below: products
available in `SWE`, priced for the `SWE` market *and* the `MiraklSellers` store group, club
prices included.
```json
{
  "marketIds": ["SWE"],
  "productParentIds": ["354931"],
  "isCustomerClubMember": true,
  "priceContext": { "storeGroupIds": ["MiraklSellers"] }
}
```

**6. Saved search as the base query.** Run a saved product search (created in the Omnium UI)
and override parts of it per request. The saved search supplies the filters; any field set on
the request replaces the saved value for that field. Pagination, sorting (when given) and
field selection always come from the request. Price context is never taken from the saved
search — pass market/store/customer context explicitly to scope prices, as below.
```json
{
  "savedSearchId": "0e3c9c9b-7b53-4c8e-9f2a-1f5d3f0a1234",
  "take": 50,
  "page": 1,
  "marketIds": ["NOR"],
  "sort": [{ "field": "name", "direction": "asc" }]
}
```

**7. Search group as membership.** Run a search group (created in the Omnium UI) as membership
ANDed with this request. Extra filters on the request AND with membership; they do not replace
member saved-search fields. Mutually exclusive with `savedSearchId`. An unknown id is rejected with 400.
```json
{
  "searchGroupId": "a1b2c3d4-5e6f-7890-abcd-ef1234567890",
  "take": 50,
  "page": 1,
  "marketIds": ["NOR"],
  "productCategoryIds": ["CAT-summer-clothing"]
}
```

Image and asset URLs follow the first entry of the top-level `marketIds` (the availability
market): when the tenant has per-market CDN settings, that market's CDN host is used.
`priceContext` never affects asset URLs — it scopes prices only.

**Request body:** [`OmniumProductQueryRequest`](../../schemas/OmniumProductQueryRequest.md) — Query request with filters, market/store context, pagination, and field selection

**Responses:**

- 200: [`OmniumProductOmniumQueryResult`](../../schemas/OmniumProductOmniumQueryResult.md) — Query successful
- 400: string — Invalid request parameters

---

## `POST /api/products/Query/Scroll`

**Initiate a scroll session for retrieving large product datasets.**

Operation ID: `ProductQueryQueryScroll`

Bulk extraction endpoint — full-catalog syncs (PIM, ERP, marketplace), exports,
search-index reindexing. Also required past the 10,000 offset cap on POST /Query.

Returns a `scrollId` and the first batch. Pass `scrollId` to
GET /api/products/Query/Scroll/{scrollId} until it comes back null. Sessions expire after
10 minutes of inactivity; per-tenant concurrency is capped.

Same filter set as POST /Query (see request schema) and identical response shape — price
context filtering, inventory cleanup and property-list shaping apply on both the initial
batch and continuations. `savedSearchId` works here too (bulk-extract a saved search); the
saved search is resolved once at initiation, so edits to it never affect an active scroll.

### Default values are omitted

To keep responses small, a field is left out when it holds its default value: `false`, `0`,
`null`, the empty date `0001-01-01T00:00:00`, the empty id
`00000000-0000-0000-0000-000000000000`, or an enum's first value. **A missing field means
that value, not "unknown".** `""` and `[]` are real values and are always returned.

A field marked `nullable` in the schema has `null` as its default, so it is left out only
when it is null — a nullable boolean holding `false`, or a nullable number holding `0`, is
still returned.

For full bulk-sync recipes (delta queries, idempotent pipelines) and response-size
guidance, see https://docs.omnium.no/docs/Integrations/product-query.

### Canonical example
Delta sync — capture every product touched in a 5-minute window (modifications, publish/
unpublish events, price activations/deactivations) in a single pass. Run on a cron for an
idempotent replication pipeline:
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

**Request body:** [`OmniumProductScrollQueryRequest`](../../schemas/OmniumProductScrollQueryRequest.md) — Query request with filters, market/store context, and field selection

**Responses:**

- 200: [`OmniumProductOmniumScrollableQueryResult`](../../schemas/OmniumProductOmniumScrollableQueryResult.md) — Scroll initiated successfully
- 400: string — Invalid request parameters

---

## `GET /api/products/Query/Scroll/{scrollId}`

**Continue an active scroll session and fetch the next batch of products.**

Operation ID: `ProductQueryScrollContinuation`

Call repeatedly with the latest returned `scrollId` until it comes back null. Sessions
expire after 10 minutes of inactivity. See `POST /api/products/Query/Scroll` for the
initiation endpoint and full request shape.

### Default values are omitted

To keep responses small, a field is left out when it holds its default value: `false`, `0`,
`null`, the empty date `0001-01-01T00:00:00`, the empty id
`00000000-0000-0000-0000-000000000000`, or an enum's first value. **A missing field means
that value, not "unknown".** `""` and `[]` are real values and are always returned.

A field marked `nullable` in the schema has `null` as its default, so it is left out only
when it is null — a nullable boolean holding `false`, or a nullable number holding `0`, is
still returned.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `scrollId` | path | string | Yes | The scroll ID from the previous response (initial Scroll call or a prior continuation) |

**Responses:**

- 200: [`OmniumProductOmniumScrollableQueryResult`](../../schemas/OmniumProductOmniumScrollableQueryResult.md) — Scroll continuation successful
