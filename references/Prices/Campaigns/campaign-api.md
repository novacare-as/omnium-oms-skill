# API Reference

Source: https://docs.omnium.no/docs/Prices/Campaigns/campaign-api

> Technical guide to the Campaign public REST API — create, update, search, and manage campaign lifecycles programmatically via the Omnium API.

## Overview

The Campaign API lets external systems manage campaigns programmatically. Use it to integrate campaign management with your ERP, build custom campaign dashboards, or automate campaign workflows from external systems.

All endpoints are available at `https://apitest.omnium.no/api/Campaigns` (test) and your production API host under the same path.

### What you can do

*   Create and update campaigns with markets, stores, tags, and custom properties
*   Give a campaign its campaign code (`externalIds`) and the same campaign in an earlier year (`previousCampaignId`)
*   Read a campaign's status timeline and milestones
*   Search and filter campaigns by date range, status, market, and more
*   Transition campaigns through their lifecycle (Planning → Active → Completed → Archived)
*   Retrieve promotion IDs linked to a campaign (promotions are linked with `campaignId` on the [Promotions API](campaign-api.md#build-a-campaign-with-promotions-and-price-lists))
*   Delete campaigns (with automatic promotion unlinking)

### What the Campaign API does not do

Campaign API manages the campaign container itself. To manage the promotions within a campaign, use the [Promotions API](../Promotions.md): a promotion joins a campaign through its `campaignId`. To set SKU-level pricing, use the [Price Lists API](../PriceLists.md): a price list is planned under the campaign of the promotion it belongs to. The relationship looks like this:

```
  ┌──────────────────────────────────────┐
  │          Campaign API                │  ← You are here
  │   POST /api/Campaigns                │
  │   Create, update, search, delete     │
  └──────────────┬───────────────────────┘
                 │
                 │  GET /api/Campaigns/{id}/promotions
                 │  (returns promotion IDs)
                 │  ▲ promotion.campaignId links it
                 ▼
  ┌──────────────────────────────────────┐
  │         Promotions API               │
  │   POST /api/Promotions               │
  │   Define discount rules              │
  └──────────────┬───────────────────────┘
                 │  priceList.promotionId links it
                 ▼
  ┌──────────────────────────────────────┐
  │        Price Lists API               │
  │   SKU-level prices and planning      │
  └──────────────────────────────────────┘
```

* * *

## Authentication and Authorization

All Campaign endpoints require a valid JWT Bearer token. Include it in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

Obtain a token via `POST /api/Token`. See [Authentication](../../GettingStartedWithAPI/introtoapi.md#authentication) for details.

### Access Levels

| Operation | Required Role | Description |
| --- | --- | --- |
| Read (GET, Search) | `PromotionRead` | View campaigns and linked promotions |
| Write (POST, PUT, PATCH, DELETE) | `PromotionAdmin` | Create, update, delete, and change status |

* * *

## Campaign Model

The API returns campaigns using the `OmniumCampaign` model.

| Property | Type | Description |
| --- | --- | --- |
| `Id` | `string` | Unique campaign identifier (GUID). Auto-generated on create if not provided. |
| `Name` | `string` | Campaign display name. **Required.** |
| `Description` | `string` | Optional internal description. |
| `Tags` | `string[]` | Labels for categorization and filtering (e.g., `["seasonal", "clearance"]`). |
| `StartDate` | `datetime` | When the campaign begins. **Required.** |
| `EndDate` | `datetime` | When the campaign ends. Must be after `StartDate`. **Required.** |
| `Status` | `string` | Lifecycle status: the name of one of the [campaign statuses](campaign-api.md#campaign-statuses) configured for your environment. Without configured statuses: `Planning`, `Active`, `Completed`, or `Archived`. |
| `Markets` | `string[]` | Market IDs where the campaign applies (e.g., `["NOR", "SWE"]`). |
| `Stores` | `string[]` | Store IDs where the campaign targets. Empty means all stores. |
| `PlanningNotes` | `string` | Internal notes for the planning phase. |
| `CreatedDate` | `datetime?` | When the campaign was created. Read-only (set by server). |
| `UpdatedDate` | `datetime?` | When the campaign was last updated. Read-only (set by server). |
| `Properties` | `OmniumPropertyItem[]` | Custom key-value pairs for extensibility. |
| `Errors` | `OmniumEntityError[]` | Validation or processing errors. Read-only (set by server). |
| `InternalComments` | `OmniumComment[]` | Internal comments on the campaign. Read-only. |
| `ExternalIds` | `OmniumExternalId[]` | Identifiers of the campaign in other systems, one per provider. The first one is shown as the campaign code in Omnium. |
| `PreviousCampaignId` | `string` | The same campaign in an earlier year. The follow-up uses its actual sales as the campaign's last year. |
| `Milestones` | `OmniumCampaignMilestone[]` | Read-only. The campaign's deadlines that are not statuses, one per [milestone type](campaign-settings.md#give-every-campaign-milestones-and-deadlines) configured for your environment. |
| `StatusSteps` | `OmniumCampaignStatusStep[]` | Read-only. The campaign's status timeline, one step per configured status, in status order. |

### OmniumExternalId

| Property | Type | Description |
| --- | --- | --- |
| `ProviderName` | `string` | The system the id belongs to, such as `Erp` |
| `Id` | `string` | The campaign's id in that system |

### OmniumCampaignMilestone

| Property | Type | Description |
| --- | --- | --- |
| `Key` | `string` | Key of the milestone type. `PlanningStart` is the day planning opens. |
| `Name` | `string` | Display name of the milestone |
| `Date` | `datetime?` | The deadline. `null` when the campaign has no start date to count it from. |
| `IsCompleted` | `bool` | The milestone has been marked as done |
| `IsManuallySet` | `bool` | A user set the date. A date set by hand stays when the start date moves; the others move with it. |

### OmniumCampaignStatusStep

| Property | Type | Description |
| --- | --- | --- |
| `Name` | `string` | Name of the status |
| `Order` | `int` | Position of the status in the configured sequence |
| `Date` | `datetime?` | The planned date before the campaign enters the status; the date it entered it after |
| `IsActivated` | `bool` | The campaign has entered the status |

Milestones and status steps are edited in the Omnium UI. The API returns them but does not set them; a create or update fills and moves them from the campaign's start date as described under [Update a Campaign](campaign-api.md#update-a-campaign), and a status change through [Update Campaign Status](campaign-api.md#update-campaign-status) activates and dates the step of the new status.

### Campaign statuses

The statuses a campaign can have are configured per environment, under **Configuration → Settings → Orders → Promotion → Campaign Statuses** (see [Campaign Settings](campaign-settings.md#lock-the-plan-with-a-locked-campaign-status)). Each status has a name, an order and its available next steps. An environment that configures none uses the four default statuses:

| Status | Available next steps |
| --- | --- |
| `Planning` | `Active` |
| `Active` | `Completed`, `Planning` |
| `Completed` | `Archived` |
| `Archived` | (none) |

Wherever the API takes a status (`Status` on create and update, `status` on the status change, `Statuses` in the search), it is the status **name**, compared case-sensitively. A name that is not configured answers `400 Bad Request` with the configured names, for example `"Invalid status. Valid values: Planning, Locked, Active, Completed, Archived"` in an environment that adds a `Locked` status.

### OmniumPropertyItem

| Property | Type | Description |
| --- | --- | --- |
| `Key` | `string` | Property name |
| `Value` | `string` | Property value |
| `KeyGroup` | `string` | Optional grouping key |
| `ValueType` | `string` | Optional type hint (e.g., `"string"`, `"number"`, `"boolean"`) |

* * *

## Endpoints

### Get a Campaign

```
GET /api/Campaigns/{id}
```

Returns a single campaign by ID.

**Response:** `200 OK` with `OmniumCampaign` body, or `404 Not Found`.

**Example:**

```
curl -X GET "https://apitest.omnium.no/api/Campaigns/abc-123" \
  -H "Authorization: Bearer <token>"
```

```json
{
  "id": "abc-123",
  "name": "Summer Sale 2026",
  "description": "Annual summer clearance across all markets",
  "tags": ["seasonal", "clearance"],
  "startDate": "2026-06-01T00:00:00",
  "endDate": "2026-08-31T23:59:59",
  "status": "Planning",
  "markets": ["NOR", "SWE"],
  "stores": [],
  "planningNotes": "Focus on shoe and clothing categories. Target 500k NOK.",
  "createdDate": "2026-03-15T10:30:00Z",
  "updatedDate": "2026-03-18T14:22:00Z",
  "properties": [],
  "errors": [],
  "externalIds": [
    { "providerName": "Erp", "id": "260601" }
  ],
  "previousCampaignId": "summer-sale-2025",
  "milestones": [
    {
      "key": "PlanningStart",
      "name": "Planning start",
      "date": "2026-03-01T00:00:00",
      "isCompleted": true,
      "isManuallySet": false
    },
    {
      "key": "StoreOrder",
      "name": "Store order deadline",
      "date": "2026-05-04T00:00:00",
      "isCompleted": false,
      "isManuallySet": true
    }
  ],
  "statusSteps": [
    { "name": "Planning", "order": 1, "date": "2026-03-15T10:30:00Z", "isActivated": true },
    { "name": "Active", "order": 2, "date": "2026-06-01T00:00:00", "isActivated": false },
    { "name": "Completed", "order": 3, "date": null, "isActivated": false },
    { "name": "Archived", "order": 4, "date": null, "isActivated": false }
  ]
}
```

* * *

### Search Campaigns

```
POST /api/Campaigns/Search
```

Search and filter campaigns with pagination. This is the primary way to list campaigns — there is no `GET /api/Campaigns` list endpoint.

**Request body:** `OmniumCampaignSearchRequest`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `SearchText` | `string` | — | Free-text search across name, description, tags, and ID. Supports fuzzy matching. |
| `StartFrom` | `datetime?` | — | Campaigns that start on or after this date |
| `StartTo` | `datetime?` | — | Campaigns that start on or before this date |
| `EndFrom` | `datetime?` | — | Campaigns that end on or after this date |
| `EndTo` | `datetime?` | — | Campaigns that end on or before this date |
| `Statuses` | `string[]` | — | Filter by statuses. Empty means all. Values: the configured [campaign status](campaign-api.md#campaign-statuses) names, by default `Planning`, `Active`, `Completed`, `Archived` |
| `MarketIds` | `string[]` | — | Filter by market IDs |
| `StoreIds` | `string[]` | — | Filter by store IDs |
| `Tags` | `string[]` | — | Filter by tags |
| `CampaignIds` | `string[]` | — | Filter by specific campaign IDs |
| `Page` | `int` | `1` | Page number (1-based) |
| `Take` | `int` | `20` | Results per page. **Max 200.** |
| `SortOrder` | `string` | `StartDateDesc` | Sort order (see table below) |
| `ExcludeArchived` | `bool` | `true` | Exclude archived campaigns from results |

**Sort options:**

| Value | Description |
| --- | --- |
| `StartDateDesc` | Newest start date first (default) |
| `StartDateAsc` | Oldest start date first |
| `EndDateDesc` | Newest end date first |
| `EndDateAsc` | Oldest end date first |
| `NameAsc` | Alphabetical A-Z |
| `NameDesc` | Alphabetical Z-A |
| `CreatedAsc` | Oldest created first |
| `CreatedDesc` | Newest created first |

**Pagination limits:** `Take` cannot exceed 200. `Take × Page` cannot exceed 10,000. For larger datasets, use narrower filters.

**Response:** `200 OK` with `OmniumSearchResult<OmniumCampaign>`:

```json
{
  "result": [ ... ],
  "totalHits": 42
}
```

**Example — Find all active campaigns in the Norwegian market:**

```
curl -X POST "https://apitest.omnium.no/api/Campaigns/Search" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "statuses": ["Active"],
    "marketIds": ["NOR"],
    "page": 1,
    "take": 20
  }'
```

**Example — Find campaigns running during a specific week:**

To find campaigns that overlap with a date range, combine `StartTo` and `EndFrom`. This returns campaigns where `StartDate <= endOfRange` AND `EndDate >= startOfRange`:

```
curl -X POST "https://apitest.omnium.no/api/Campaigns/Search" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "startTo": "2026-07-07T23:59:59",
    "endFrom": "2026-07-01T00:00:00",
    "page": 1,
    "take": 50
  }'
```

**Example — Full-text search with tag filter:**

```
curl -X POST "https://apitest.omnium.no/api/Campaigns/Search" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "searchText": "summer",
    "tags": ["seasonal"],
    "excludeArchived": true
  }'
```

* * *

### Create a Campaign

```
POST /api/Campaigns
```

Creates a new campaign. Returns the created campaign with server-set fields (`Id`, `CreatedDate`, `Status`).

**Request body:** `OmniumCampaignRequest`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Id` | `string` | No | Custom ID. A GUID is generated if omitted. |
| `Name` | `string` | **Yes** | Campaign display name |
| `Description` | `string` | No | Internal description |
| `Tags` | `string[]` | No | Categorization labels |
| `StartDate` | `datetime` | **Yes** | Campaign start date |
| `EndDate` | `datetime` | **Yes** | Campaign end date (must be after `StartDate`) |
| `Status` | `string` | No | Initial status: one of the configured [campaign statuses](campaign-api.md#campaign-statuses). Defaults to the first configured status (`Planning` by default) if omitted. |
| `Markets` | `string[]` | No | Market IDs |
| `Stores` | `string[]` | No | Store IDs |
| `PlanningNotes` | `string` | No | Internal planning notes |
| `Properties` | `OmniumPropertyItem[]` | No | Custom key-value pairs |
| `ExternalIds` | `OmniumExternalId[]` | No | Identifiers of the campaign in other systems, one per provider. The first one is the campaign code. |
| `PreviousCampaignId` | `string` | No | The same campaign in an earlier year. Must be another existing campaign. |

**Response:** `201 Created` with the full `OmniumCampaign` body.

**Validation rules:**

*   `Name` must not be empty
*   `EndDate` must be after `StartDate`
*   `Status` (if provided) must be the name of a configured [campaign status](campaign-api.md#campaign-statuses), case-sensitive
*   `PreviousCampaignId` (if provided) must be an existing campaign other than this one

**Example — Create a basic campaign:**

```
curl -X POST "https://apitest.omnium.no/api/Campaigns" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday 2026",
    "description": "Annual Black Friday campaign across all channels",
    "startDate": "2026-11-20T00:00:00",
    "endDate": "2026-11-30T23:59:59",
    "markets": ["NOR", "SWE", "DNK"],
    "tags": ["black-friday", "seasonal"],
    "planningNotes": "Coordinate with marketing team. Budget: 200k NOK.",
    "externalIds": [{ "providerName": "Erp", "id": "261101" }],
    "previousCampaignId": "black-friday-2025"
  }'
```

**Example — Create with custom properties:**

Properties let you attach arbitrary metadata to campaigns. Use them for ERP references, budget tracking, or any custom data:

```
curl -X POST "https://apitest.omnium.no/api/Campaigns" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spring Collection Launch",
    "startDate": "2026-03-15T00:00:00",
    "endDate": "2026-04-15T23:59:59",
    "markets": ["NOR"],
    "properties": [
      { "key": "ErpCampaignId", "value": "CAMP-2026-042", "keyGroup": "ERP" },
      { "key": "Budget", "value": "150000", "valueType": "number", "keyGroup": "Finance" }
    ]
  }'
```

* * *

### Update a Campaign

```
PUT /api/Campaigns/{id}
```

Replaces an existing campaign with the provided data. This is a full replacement — all fields in the request body overwrite the existing values. Fields you omit will be cleared, except server-managed fields like `CreatedDate` and the fields listed under **Important behavior** below.

**Request body:** Same as Create (`OmniumCampaignRequest`).

**Response:** `200 OK` with updated `OmniumCampaign`, or `404 Not Found`.

**Important behavior:**

*   The `Id` in the URL takes precedence over any `Id` in the request body
*   `CreatedDate` is preserved from the original campaign
*   If `Status` is omitted or empty, the existing status is preserved
*   A `Status` must be a configured [campaign status](campaign-api.md#campaign-statuses) or the one already stored. It is saved as given: the update does not check the transition rules, activate the status step or run the status workflow. Use [Update Campaign Status](campaign-api.md#update-campaign-status) to move a campaign to its next status
*   Server-managed fields (such as `CreatedDate`, `Errors`) are preserved
*   `ExternalIds` and `PreviousCampaignId` are often set in the Omnium UI, so they are preserved when the request leaves them out (`null`). An empty list (`"externalIds": []`) removes the external ids, and an empty string (`"previousCampaignId": ""`) removes the previous campaign
*   `PreviousCampaignId` must be an existing campaign other than the one you update; the one already stored is accepted as it is
*   The campaign's status step dates and [milestones](campaign-settings.md#give-every-campaign-milestones-and-deadlines) are preserved. When you change `startDate`, milestone dates that nobody has set by hand move by the same number of days, and so do default status step dates that are neither set by hand nor activated. Later status steps without a date get their default date. Every update of a campaign with a start date also adds the milestones of milestone types configured since

**Example — Update campaign dates and add a store filter:**

```
curl -X PUT "https://apitest.omnium.no/api/Campaigns/abc-123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Sale 2026",
    "description": "Extended to include August",
    "startDate": "2026-06-01T00:00:00",
    "endDate": "2026-08-31T23:59:59",
    "markets": ["NOR", "SWE"],
    "stores": ["store-oslo", "store-stockholm"],
    "tags": ["seasonal", "clearance"]
  }'
```

> Since PUT is a full replacement, include all fields you want to keep. For example, if the campaign had `Tags` and you omit `Tags` in the PUT request, the tags will be cleared. `ExternalIds` and `PreviousCampaignId` are the exception: leave them out to keep them.

* * *

### Delete a Campaign

```
DELETE /api/Campaigns/{id}
```

Permanently deletes a campaign. All promotions linked to the campaign are automatically unlinked (but not deleted).

**Response:** `204 No Content` on success, or `404 Not Found`.

**Example:**

```
curl -X DELETE "https://apitest.omnium.no/api/Campaigns/abc-123" \
  -H "Authorization: Bearer <token>"
```

> Deletion is permanent. Campaign performance data is also removed. Linked promotions continue to function independently after being unlinked.

* * *

### Update Campaign Status

```
PATCH /api/Campaigns/{id}/status
```

Moves a campaign to a new lifecycle status, the same way a status change on the campaign page does. This is the way to change status: the move is checked against the configured transitions, the status step of the new status is activated and dated, and the workflow steps configured for the new status run (for example notification emails or SMS messages).

**Request body:**

```json
{
  "status": "Active"
}
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `string` | **Yes** | Name of the target status: one of the configured [campaign statuses](campaign-api.md#campaign-statuses), case-sensitive, that is an available next step of the campaign's current status |

**Response:** `200 OK` with the updated `OmniumCampaign`, `404 Not Found`, or `400 Bad Request`:

| When | Message |
| --- | --- |
| `status` is missing | `"Status is required"` |
| `status` is not a configured status | `"Invalid status. Valid values: Planning, Active, Completed, Archived"` (the configured names) |
| The current status does not list `status` as an available next step | `"Invalid status transition from 'Planning' to 'Completed'. Allowed next statuses: Active."` |
| The current status has no next steps | `"Invalid status transition from 'Archived' to 'Active'. A campaign in 'Archived' cannot change status."` |

**Status transition rules:**

A campaign can move only to a status that its current status lists as an available next step. A status with no available next steps configured at all can move to any configured status. With the default statuses:

```
  Planning  ──→  Active  ──→  Completed  ──→  Archived
                   │
                   └──→  Planning  (rollback)
```

An environment with a locked status typically moves `Planning → Locked → Active`, so a `Planning` campaign must be locked before it can go live:

```
curl -X PATCH "https://apitest.omnium.no/api/Campaigns/abc-123/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Locked" }'
```

The `AutoTransitionCampaignsScheduledTask` scheduled task makes the same moves on the dates of the status steps, so you only need this endpoint for moves you want to make before or without those dates.

**What happens on status change:**

When you change a campaign's status, the workflow steps configured for the new status run, for example sending notification emails or SMS messages to relevant stakeholders. A workflow step that fails is logged and does not undo the status change.

**Example — Activate a campaign:**

```
curl -X PATCH "https://apitest.omnium.no/api/Campaigns/abc-123/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Active" }'
```

**Example — Complete a campaign after its end date:**

```
curl -X PATCH "https://apitest.omnium.no/api/Campaigns/abc-123/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Completed" }'
```

* * *

### Get Linked Promotions

```
GET /api/Campaigns/{id}/promotions
```

Returns the IDs of all promotions linked to a campaign. Use these IDs with the Promotions API to retrieve full promotion details.

**Response:** `200 OK` with `string[]`, or `404 Not Found`.

**Example:**

```
curl -X GET "https://apitest.omnium.no/api/Campaigns/abc-123/promotions" \
  -H "Authorization: Bearer <token>"
```

```json
["promo-001", "promo-002", "promo-003"]
```

> To link a promotion to the campaign, or move or remove it, set `campaignId` on the promotion with `POST /api/Promotions` or `PATCH /api/Promotions`. See [Build a campaign with promotions and price lists](campaign-api.md#build-a-campaign-with-promotions-and-price-lists).

* * *

## Common Integration Patterns

### Build a campaign with promotions and price lists

A campaign's **Planning** tab lists the items of the price lists that belong to the campaign's promotions. To build a planned campaign through the API, create the campaign, then the promotions with `campaignId`, then their price lists with `promotionId`, then the items:

```
  Campaign  ◄── campaignId ──  Promotion  ◄── promotionId ──  Price list  ◄── priceListId ──  Items
```

**Step 1:** Create the campaign, with its campaign code and last year's campaign:

```
curl -X POST "https://apitest.omnium.no/api/Campaigns" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "black-friday-2026",
    "name": "Black Friday 2026",
    "startDate": "2026-11-20T00:00:00",
    "endDate": "2026-11-30T23:59:59",
    "markets": ["NOR"],
    "externalIds": [{ "providerName": "Erp", "id": "261101" }],
    "previousCampaignId": "black-friday-2025"
  }'
```

**Step 2:** Create a price list promotion in the campaign. `campaignId` must be an existing campaign:

```
curl -X POST "https://apitest.omnium.no/api/Promotions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "bf26-shoes",
    "name": "Black Friday shoes",
    "activeFrom": "2026-11-20T00:00:00",
    "activeTo": "2026-11-30T23:59:59",
    "markets": ["NOR"],
    "campaignId": "black-friday-2026",
    "promotionData": { "promotionType": 6, "priceListId": "bf26-shoes" }
  }'
```

**Step 3:** Create the promotion's price list. `promotionId` puts it under the campaign; `campaignId` records the campaign on the price list too:

```
curl -X POST "https://apitest.omnium.no/api/PriceLists/AddPriceList" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "bf26-shoes",
    "name": "Black Friday shoes",
    "currencyCode": "NOK",
    "marketIds": ["NOR"],
    "promotionId": "bf26-shoes",
    "campaignId": "black-friday-2026",
    "isStoreCostPriceEnabled": true,
    "storeCostPriceMarketIds": ["NOR"]
  }'
```

**Step 4:** Add the items with their campaign prices and planning figures:

```
curl -X POST "https://apitest.omnium.no/api/PriceLists/AddPriceListItems" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "priceListId": "bf26-shoes",
      "skuId": "SHOE-1042-42",
      "unitPrice": 1299.00,
      "discountedPrice": 899.00,
      "cost": 420.00,
      "standardCost": 410.00,
      "storeCostPrice": 610.00,
      "plannedSalesVolume": 120,
      "planningComment": "Same volume as last year"
    }
  ]'
```

`AddPriceListItems` and `PatchPriceListItems` accept the same item fields, including the store cost fields `storeCostPrice`, `storeCostDiscount`, `storeCostDiscountPercent` and `storeCostPriceAdditionPercent`.

Linking a promotion with `campaignId` works as adding it on the campaign page: the campaign's start and end dates are recalculated from the dates of its promotions, and so are those of the campaign the promotion leaves. On the promotion and price list endpoints, `campaignId` left out (`null`) keeps the stored campaign, and an empty string removes it.

**Move or remove a promotion:** send only the campaign in a patch. A patch that changes nothing but the campaign does not save the promotion itself, so its prices are not rebuilt:

```
curl -X PATCH "https://apitest.omnium.no/api/Promotions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "id": "bf26-shoes", "campaignId": "" }'
```

### ERP Campaign Sync

A typical ERP integration creates campaigns in Omnium to match campaign plans from the ERP, then tracks performance back:

```
  ┌────────────┐        ┌───────────────┐
  │    ERP     │───────►│  Omnium API   │
  │  (source)  │ Create │               │
  └────────────┘        └───────┬───────┘
                                │
                         Campaign created
                         (Status: Planning)
                                │
                                ▼
                        ┌───────────────┐
                        │  Omnium UI    │
                        │  Link promos  │
                        │  Set targets  │
                        └───────┬───────┘
                                │
                          Status → Active
                                │
                                ▼
  ┌────────────┐        ┌───────────────┐
  │    ERP     │◄───────│  Omnium API   │
  │  (target)  │ Search │               │
  └────────────┘ + Get  └───────────────┘
```

**Step 1:** ERP creates the campaign via `POST /api/Campaigns` with the ERP campaign number as its campaign code in `ExternalIds`:

```json
{
  "name": "Q2 Clearance",
  "startDate": "2026-04-01T00:00:00",
  "endDate": "2026-06-30T23:59:59",
  "markets": ["NOR"],
  "externalIds": [
    { "providerName": "Erp", "id": "ERP-2026-Q2-CLR" }
  ]
}
```

**Step 2:** Merchandising team links promotions and sets targets in the Omnium UI, or the ERP creates the promotions with `campaignId` as shown [above](campaign-api.md#build-a-campaign-with-promotions-and-price-lists).

**Step 3:** ERP activates the campaign via `PATCH /api/Campaigns/{id}/status`.

**Step 4:** ERP periodically searches for active campaigns to pull status updates:

```json
{
  "statuses": ["Active"],
  "marketIds": ["NOR"],
  "sortOrder": "EndDateAsc"
}
```

### Custom Dashboard

Build a campaign calendar or dashboard by searching for campaigns across a date range:

```json
{
  "startTo": "2026-12-31T23:59:59",
  "endFrom": "2026-01-01T00:00:00",
  "excludeArchived": true,
  "take": 200,
  "sortOrder": "StartDateAsc"
}
```

This returns all campaigns that overlap with the year 2026, sorted chronologically.

### Automated Lifecycle Management

Use the status endpoint to automate campaign transitions based on business rules:

1.  **Activate on start date:** A scheduled job searches for `Planning` campaigns where `StartDate` has passed, then calls `PATCH /status` with `Active`
2.  **Complete on end date:** Search for `Active` campaigns where `EndDate` has passed, then transition to `Completed`
3.  **Archive after review period:** Search for `Completed` campaigns older than 90 days, then archive

* * *

## Error Handling

All endpoints follow a consistent error pattern:

| Status Code | Meaning | When |
| --- | --- | --- |
| `200 OK` | Success | GET, PUT, PATCH |
| `201 Created` | Resource created | POST (create) |
| `204 No Content` | Deleted successfully | DELETE |
| `400 Bad Request` | Validation error | Missing `Name`, a `Status` that is not configured, a status change the current status does not allow, `EndDate` before `StartDate`, unknown `PreviousCampaignId` or the campaign itself, pagination limits exceeded |
| `404 Not Found` | Campaign not found | GET, PUT, PATCH, DELETE with non-existent ID |
| `401 Unauthorized` | Missing or invalid token | Any endpoint |
| `403 Forbidden` | Insufficient permissions | Write operations without `PromotionAdmin` role |
| `500 Internal Server Error` | Server error | Unexpected failures |

**400 errors** return a descriptive message in the response body:

```
"EndDate must be after StartDate"
```

```
"Invalid status. Valid values: Planning, Active, Completed, Archived"
```

```
"Invalid status transition from 'Planning' to 'Completed'. Allowed next statuses: Active."
```

```
"Take cannot exceed 200"
```

```
"Previous campaign black-friday-2025 was not found"
```

* * *

## Endpoint Summary

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/Campaigns/{id}` | Read | Get a single campaign |
| `POST` | `/api/Campaigns/Search` | Read | Search with filters and pagination |
| `POST` | `/api/Campaigns` | Admin | Create a new campaign |
| `PUT` | `/api/Campaigns/{id}` | Admin | Full update of an existing campaign |
| `DELETE` | `/api/Campaigns/{id}` | Admin | Delete a campaign |
| `PATCH` | `/api/Campaigns/{id}/status` | Admin | Change campaign status |
| `GET` | `/api/Campaigns/{id}/promotions` | Read | Get linked promotion IDs |
