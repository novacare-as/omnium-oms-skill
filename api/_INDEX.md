# Omnium OMS API Reference — Index

This directory contains the structured API specification for Omnium OMS. Everything under `endpoints/`
and `schemas/`, and the endpoint file tables at the bottom of this page, are generated from the
published OpenAPI spec (`https://api.omnium.no/docs/oms/docs.json`) by `scripts/sync-api.ts`.
The rest of this page is hand-written.

## Structure

```
api/
├── _INDEX.md                ← You are here. Conventions, endpoint files and key schemas per area.
├── endpoints/
│   ├── <area>.md            ← One file per Swagger tag, e.g. tokens.md ("Tokens")
│   └── <area>/<tag>.md      ← e.g. orders/get.md ("Orders | Get"), customers/b2b.md ("Customers | B2B")
└── schemas/
    ├── _INDEX.md            ← Every schema with its description. Search it for a name or keyword.
    └── <SchemaName>.md      ← One file per schema, e.g. OmniumOrder.md
```

Endpoint files link to the schemas they use, and schema files link to nested schemas and to the
endpoint files that use them.

## Base URLs

| Environment | API Base URL | Swagger |
|-------------|-------------|---------|
| Test | `https://apitest.omnium.no` | `https://apitest.omnium.no/documentation` |
| Production | `https://api.omnium.no` | `https://api.omnium.no/documentation` |

Swagger is also segmented: `/documentation/orders`, `/documentation/products`, `/documentation/carts`, 
`/documentation/customers`, `/documentation/projects`.

## Authentication

All endpoints require a JWT Bearer token.

```
POST /api/token?clientId={id}&clientSecret={secret}&returnAsJson=true
→ { "accessToken": "eyJ...", "tokenType": "Bearer", "expiresIn": 864000 }
```

Include in all requests: `Authorization: Bearer {accessToken}`

Token is valid for 10 days. See `endpoints/tokens.md` for full details.

## Common conventions

These apply to all endpoint files below — they are not repeated in each file.

### Content type
All request/response bodies use `Content-Type: application/json`.

### Search pattern
Every major resource has a search endpoint:
```
POST /api/{Resource}/Search
Body: { "take": 20, "page": 0, "sortOrder": "CreatedDescending", ...filters }
Response: { "result": [...], "totalHits": N, "facets": [...], "scrollId": null }
```
- `take`: max 100 per page
- `page`: 0-based. Max offset: take × page ≤ 10,000
- Disable facets with `disableFacets: true` (or `isFacetsDisabled: true` for products)

### Scroll pattern (large datasets)
```
POST /api/{Resource}/Scroll  →  { "result": [...], "scrollId": "abc" }
GET  /api/{Resource}/Scroll/{scrollId}  →  next batch
```
Keep calling until `result` is empty.

### Patch pattern (partial updates)
```
PATCH /api/{Resource}/{id}/Patch{Resource}
Body: { only the fields you want to change }
```
- `keepExistingCustomProperties`: true (default) = merge, false = replace all
- `keepExistingListItems`: true (default) = merge tags/externalIds, false = replace
- `propertiesRemovalConditions`: remove specific properties before applying patch

### Bulk operations
- `POST /api/{Resource}/AddMany` — batch create (100-1000 items)
- `PATCH /api/{Resource}/PatchMany` — batch partial update
- `PUT /api/{Resource}/UpdateMany` — batch full update

### Delta queries
```
GET /api/{Resource}/GetAll?changedSince=2025-01-01T00:00:00Z&page=1&pageSize=100
```

### Standard error responses
All endpoints may return these (not repeated per endpoint):

| Code | Meaning |
|------|---------|
| 400 | Validation error or invalid parameters |
| 401 | Missing, expired, or invalid token |
| 404 | Resource not found |
| 409 | Conflict (duplicate ID on create) |
| 429 | Rate limited — check `Retry-After` header |
| 500 | Server error |

### Roles
Each domain has Read and Admin roles. Read = GET/Search. Admin = full CRUD.
- Orders: `OrderRead`, `OrderAdmin`
- Products: `ProductRead`, `ProductAdmin`
- Customers: `CustomerRead`, `CustomerAdmin`
- Carts: `CartRead`, `CartAdmin`
- Inventory: `InventoryRead`, `InventoryAdmin`
- Special: `CommerceUser` (headless commerce), `ApiOwner` (full access)

## Endpoint files and key schemas

<!-- BEGIN generated endpoint files: see scripts/sync-api.ts -->
### Accounting

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/accounting/ledger-lines.md`](endpoints/accounting/ledger-lines.md) | Accounting \| Ledger Lines | 3 |  |
| [`endpoints/accounting/postings.md`](endpoints/accounting/postings.md) | Accounting \| Postings | 3 |  |

Key schemas: [`OmniumAccountingLedgerLine`](schemas/OmniumAccountingLedgerLine.md), [`OmniumAccountingPosting`](schemas/OmniumAccountingPosting.md), [`OmniumAccountingLedgerLineOmniumSearchResult`](schemas/OmniumAccountingLedgerLineOmniumSearchResult.md), [`OmniumAccountingLedgerLineSearchRequest`](schemas/OmniumAccountingLedgerLineSearchRequest.md), [`OmniumAccountingPostingOmniumSearchResult`](schemas/OmniumAccountingPostingOmniumSearchResult.md), [`OmniumAccountingPostingSearchRequest`](schemas/OmniumAccountingPostingSearchRequest.md)

### Allocation

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/allocation.md`](endpoints/allocation.md) | Allocation | 1 | Ask the allocation engine where an order or basket should ship from, without changing anything. |

Key schemas: [`OmniumAllocationResult`](schemas/OmniumAllocationResult.md), [`OmniumAllocationSimulationRequest`](schemas/OmniumAllocationSimulationRequest.md)

### Assets

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/assets/files.md`](endpoints/assets/files.md) | Assets \| Files | 1 | File operations. |
| [`endpoints/assets/images.md`](endpoints/assets/images.md) | Assets \| Images | 1 | Image operations. |

Key schemas: [`OmniumFileDownloadRequest`](schemas/OmniumFileDownloadRequest.md)

### Carts

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/carts/add.md`](endpoints/carts/add.md) | Carts \| Add | 10 | Contains endpoints for adding items to carts. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties. |
| [`endpoints/carts/checkout.md`](endpoints/carts/checkout.md) | Carts \| Checkout | 21 | Contains endpoints for the cart checkout process. Adding payment, customer, discounts, validating cart etc. |
| [`endpoints/carts/get.md`](endpoints/carts/get.md) | Carts \| Get | 3 | Contains endpoints for getting items to carts. |
| [`endpoints/carts/line-items.md`](endpoints/carts/line-items.md) | Carts \| Line Items | 5 | Contains endpoints for updating cart orderLines. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties. |
| [`endpoints/carts/other.md`](endpoints/carts/other.md) | Carts \| Other | 4 | Various endpoints for carts. |
| [`endpoints/carts/search.md`](endpoints/carts/search.md) | Carts \| Search | 3 | Contains endpoints for searching for carts with different parameters. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties. |
| [`endpoints/carts/templates.md`](endpoints/carts/templates.md) | Carts \| Templates | 5 | Various endpoints for carts. Cart templates are typically used as an easy way to create multiple offers to customers in a B2B context, but can be used in other scenarios as well. |
| [`endpoints/carts/update.md`](endpoints/carts/update.md) | Carts \| Update | 8 | Contains endpoints for creating and modifying carts. Carts are orders that are not yet confirmed by customer. Inherits order model, but has additional properties. |

Key schemas: [`OmniumCart`](schemas/OmniumCart.md), [`OmniumCartOmniumValidationResult`](schemas/OmniumCartOmniumValidationResult.md), [`OmniumCartOmniumSearchResult`](schemas/OmniumCartOmniumSearchResult.md), [`OmniumCartTemplate`](schemas/OmniumCartTemplate.md), [`OmniumProductComponent`](schemas/OmniumProductComponent.md), [`OmniumCartSearchRequest`](schemas/OmniumCartSearchRequest.md), [`OmniumDiscount`](schemas/OmniumDiscount.md), [`OmniumOrderLine`](schemas/OmniumOrderLine.md)

### Cases

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/cases.md`](endpoints/cases.md) | Cases | 8 | Customer cases and support tickets. |

Key schemas: [`OmniumCase`](schemas/OmniumCase.md), [`OmniumCaseOmniumSearchResult`](schemas/OmniumCaseOmniumSearchResult.md), [`OmniumCasePatch`](schemas/OmniumCasePatch.md), [`OmniumCaseSearchRequest`](schemas/OmniumCaseSearchRequest.md)

### Comments

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/comments.md`](endpoints/comments.md) | Comments | 5 | Endpoints for managing comments. Only used for Project comments at the moment. For comments related to other objects comments should be added on the objects themselves or through dedicated endpoints. |

Key schemas: [`OmniumComment`](schemas/OmniumComment.md), [`OmniumCommentPatch`](schemas/OmniumCommentPatch.md), [`OmniumCommentSearchRequest`](schemas/OmniumCommentSearchRequest.md)

### Customers

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/customers/b2b.md`](endpoints/customers/b2b.md) | Customers \| B2B | 21 | Business customers are used for B2B commerce. Share many of the same properties as private customers. |
| [`endpoints/customers/b2b-assets.md`](endpoints/customers/b2b-assets.md) | Customers \| B2B \| Assets | 5 | Manage assets on Business Customers. |
| [`endpoints/customers/b2b-contact-persons.md`](endpoints/customers/b2b-contact-persons.md) | Customers \| B2B \| Contact persons | 3 | Manage contact persons on Business Customers. |
| [`endpoints/customers/b2c.md`](endpoints/customers/b2c.md) | Customers \| B2C | 36 | Private customers are used for B2C or D2C commerce. |
| [`endpoints/customers/b2c-privacy.md`](endpoints/customers/b2c-privacy.md) | Customers \| B2C \| Privacy | 3 | Endpoints for ensuring privacy and GDPR compliance. |
| [`endpoints/customers/b2c-versions.md`](endpoints/customers/b2c-versions.md) | Customers \| B2C \| Versions | 2 | Fetch previous versions of private customers. |
| [`endpoints/customers/customer-groups.md`](endpoints/customers/customer-groups.md) | Customers \| Customer groups | 4 | Customers groups are used to organize groups of customers and assign prices and promotions to groups of customers. |

Key schemas: [`OmniumBusinessCustomer`](schemas/OmniumBusinessCustomer.md), [`OmniumCustomerClubMember`](schemas/OmniumCustomerClubMember.md), [`OmniumPrivateCustomer`](schemas/OmniumPrivateCustomer.md), [`OmniumBusinessCustomerOmniumSearchResult`](schemas/OmniumBusinessCustomerOmniumSearchResult.md), [`OmniumConsent`](schemas/OmniumConsent.md), [`OmniumCustomerSearchRequest`](schemas/OmniumCustomerSearchRequest.md), [`OmniumCustomerUpdateResult`](schemas/OmniumCustomerUpdateResult.md), [`OmniumAsset`](schemas/OmniumAsset.md)

### Date Planners

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/date-planners.md`](endpoints/date-planners.md) | Date Planners | 3 | Date planners. |

Key schemas: [`OmniumDatePlanner`](schemas/OmniumDatePlanner.md)

### Event Log

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/event-log.md`](endpoints/event-log.md) | Event Log | 2 | Event log endpoints |

Key schemas: [`OmniumEventLogCompareRequest`](schemas/OmniumEventLogCompareRequest.md), [`OmniumEventLogItem`](schemas/OmniumEventLogItem.md), [`OmniumEventLogItemOmniumResult`](schemas/OmniumEventLogItemOmniumResult.md), [`OmniumEventLogModelType`](schemas/OmniumEventLogModelType.md), [`OmniumEventLogSearchRequest`](schemas/OmniumEventLogSearchRequest.md)

### Health

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/health.md`](endpoints/health.md) | Health | 1 | Check health of Omnium API. Will return 200 when Omnium services are healthy ❤ |

### Insights

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/insights.md`](endpoints/insights.md) | Insights | 8 | Aggregated daily KPIs for analytics partners. |

Key schemas: [`OmniumInsightsRequest`](schemas/OmniumInsightsRequest.md), [`OmniumInsightsLoyaltyMemberDailyResponse`](schemas/OmniumInsightsLoyaltyMemberDailyResponse.md), [`OmniumInsightsLoyaltyOrderDailyResponse`](schemas/OmniumInsightsLoyaltyOrderDailyResponse.md), [`OmniumInsightsOrderDailyResponse`](schemas/OmniumInsightsOrderDailyResponse.md), [`OmniumInsightsProductDailyResponse`](schemas/OmniumInsightsProductDailyResponse.md), [`OmniumInsightsProjectActivityDailyResponse`](schemas/OmniumInsightsProjectActivityDailyResponse.md), [`OmniumInsightsProjectInProgressResponse`](schemas/OmniumInsightsProjectInProgressResponse.md), [`OmniumInsightsPromotionDailyResponse`](schemas/OmniumInsightsPromotionDailyResponse.md)

### Invoices

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/invoices.md`](endpoints/invoices.md) | Invoices | 10 | Invoices |

Key schemas: [`OmniumInvoice`](schemas/OmniumInvoice.md), [`OmniumInvoiceOmniumSearchResult`](schemas/OmniumInvoiceOmniumSearchResult.md), [`OmniumInvoiceOmniumInvoiceTotalsOmniumSearchResultWithTotals`](schemas/OmniumInvoiceOmniumInvoiceTotalsOmniumSearchResultWithTotals.md), [`OmniumInvoiceSearchRequest`](schemas/OmniumInvoiceSearchRequest.md)

### Markets

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/markets.md`](endpoints/markets.md) | Markets | 7 | Markets in Omnium are used for configuring currencies, languages, available connectors, etc for different countries, concepts, ownerships or a combination of the above. |

Key schemas: [`OmniumShipmentOption`](schemas/OmniumShipmentOption.md), [`OmniumMarket`](schemas/OmniumMarket.md), [`OmniumMarketGroup`](schemas/OmniumMarketGroup.md)

### Notifications

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/notifications.md`](endpoints/notifications.md) | Notifications | 2 | Send e-mail or SMS through Omnium. |

Key schemas: [`OmniumEmailMessage`](schemas/OmniumEmailMessage.md), [`OmniumSmsMessage`](schemas/OmniumSmsMessage.md)

### Obsolete

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/obsolete.md`](endpoints/obsolete.md) | Obsolete | 15 | Obsolete endpoints |

Key schemas: [`OmniumProject`](schemas/OmniumProject.md), [`OmniumComment`](schemas/OmniumComment.md), [`OmniumCustomerClubConsents`](schemas/OmniumCustomerClubConsents.md), [`OmniumCustomerClubMember`](schemas/OmniumCustomerClubMember.md), [`OmniumPrivateCustomerOmniumSearchResult`](schemas/OmniumPrivateCustomerOmniumSearchResult.md), [`OmniumOrder`](schemas/OmniumOrder.md), [`OmniumProductListItemViewModelOmniumSearchResult`](schemas/OmniumProductListItemViewModelOmniumSearchResult.md), [`OmniumProductSearchRequest`](schemas/OmniumProductSearchRequest.md)

### Orders

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/orders/analytics.md`](endpoints/orders/analytics.md) | Orders \| Analytics | 2 | Order analytics endpoints. |
| [`endpoints/orders/batch-updates.md`](endpoints/orders/batch-updates.md) | Orders \| Batch Updates | 5 | Endpoints for batch updates for orders. |
| [`endpoints/orders/click-and-collect.md`](endpoints/orders/click-and-collect.md) | Orders \| Click and Collect | 3 | Click and collect order type has some custom features in Omnium UI and API. |
| [`endpoints/orders/get.md`](endpoints/orders/get.md) | Orders \| Get | 9 | Endpoints for order getters. |
| [`endpoints/orders/gift-cards.md`](endpoints/orders/gift-cards.md) | Orders \| Gift Cards | 4 | Gift cards |
| [`endpoints/orders/invoices.md`](endpoints/orders/invoices.md) | Orders \| Invoices | 1 | Invoices |
| [`endpoints/orders/order-lines.md`](endpoints/orders/order-lines.md) | Orders \| Order Lines | 6 | Order lines. |
| [`endpoints/orders/others.md`](endpoints/orders/others.md) | Orders \| Others | 10 | Various endpoints for order management. |
| [`endpoints/orders/payments.md`](endpoints/orders/payments.md) | Orders \| Payments | 7 | Payments |
| [`endpoints/orders/pick-lists.md`](endpoints/orders/pick-lists.md) | Orders \| Pick Lists | 3 | Pick lists for warehouse movements. |
| [`endpoints/orders/returns.md`](endpoints/orders/returns.md) | Orders \| Returns | 6 | Return processing. |
| [`endpoints/orders/search.md`](endpoints/orders/search.md) | Orders \| Search | 5 | Search for orders. |
| [`endpoints/orders/shipments.md`](endpoints/orders/shipments.md) | Orders \| Shipments | 5 | Order shipments. |
| [`endpoints/orders/subscriptions.md`](endpoints/orders/subscriptions.md) | Orders \| Subscriptions | 8 | Subscriptions |
| [`endpoints/orders/update.md`](endpoints/orders/update.md) | Orders \| Update | 5 | Main endpoints for order management. |
| [`endpoints/orders/workflow.md`](endpoints/orders/workflow.md) | Orders \| Workflow | 4 | Order workflow processing. |

Key schemas: [`OmniumOrder`](schemas/OmniumOrder.md), [`OmniumOrderOmniumSearchResult`](schemas/OmniumOrderOmniumSearchResult.md), [`OmniumOrderWorkflowExecutionResult`](schemas/OmniumOrderWorkflowExecutionResult.md), [`OmniumSubscription`](schemas/OmniumSubscription.md), [`OmniumPayment`](schemas/OmniumPayment.md), [`OmniumAnalyticsOrderLineSearchRequest`](schemas/OmniumAnalyticsOrderLineSearchRequest.md), [`OmniumGiftCardOmniumSearchResult`](schemas/OmniumGiftCardOmniumSearchResult.md), [`OmniumGiftCardSearchRequest`](schemas/OmniumGiftCardSearchRequest.md)

### POS

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/pos/reports.md`](endpoints/pos/reports.md) | POS \| Reports | 2 |  |

Key schemas: [`GenerateSAFTReportRequest`](schemas/GenerateSAFTReportRequest.md), [`OmniumZReport`](schemas/OmniumZReport.md), [`OmniumZReportFilter`](schemas/OmniumZReportFilter.md)

### Products

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/products.md`](endpoints/products.md) | Products | 4 | Product information and enrichment. |
| [`endpoints/products/alerts.md`](endpoints/products/alerts.md) | Products \| Alerts | 5 | Product alerts. |
| [`endpoints/products/assets.md`](endpoints/products/assets.md) | Products \| Assets | 6 | Product assets. |
| [`endpoints/products/batch-updates.md`](endpoints/products/batch-updates.md) | Products \| Batch Updates | 4 | Batch updates for products. |
| [`endpoints/products/categories.md`](endpoints/products/categories.md) | Products \| Categories | 14 | Product category information. |
| [`endpoints/products/cost-prices.md`](endpoints/products/cost-prices.md) | Products \| Cost Prices | 3 | Product cost prices. |
| [`endpoints/products/get.md`](endpoints/products/get.md) | Products \| Get | 9 | Get products by parameters. |
| [`endpoints/products/inventory.md`](endpoints/products/inventory.md) | Products \| Inventory | 22 | Fetch and update inventory. |
| [`endpoints/products/price-list-items.md`](endpoints/products/price-list-items.md) | Products \| Price List Items | 7 | Product price list items. |
| [`endpoints/products/price-lists.md`](endpoints/products/price-lists.md) | Products \| Price Lists | 7 | Product price list information. |
| [`endpoints/products/prices.md`](endpoints/products/prices.md) | Products \| Prices | 4 | Fetch and update product prices. |
| [`endpoints/products/query.md`](endpoints/products/query.md) | Products \| Query | 3 | Query products with explicit market, store, and customer context. To keep responses small, a field holding its default value (false, 0, null, the empty date, the empty id) is left out — a missing field means that value, not "unknown". A nullable field defaults to null, so one holding false or 0 is still returned. |
| [`endpoints/products/recommendations.md`](endpoints/products/recommendations.md) | Products \| Recommendations | 2 | Product recommendations. |
| [`endpoints/products/rentals.md`](endpoints/products/rentals.md) | Products \| Rentals | 10 | Product Rentals. |
| [`endpoints/products/rfid-tags.md`](endpoints/products/rfid-tags.md) | Products \| RFID Tags | 9 | RFID EPC tags with loose references to products, deliveries and orders. |
| [`endpoints/products/search.md`](endpoints/products/search.md) | Products \| Search | 3 | Search for products. |
| [`endpoints/products/update.md`](endpoints/products/update.md) | Products \| Update | 4 | Update products. |
| [`endpoints/products/variants.md`](endpoints/products/variants.md) | Products \| Variants | 8 | Product variant information. |

Key schemas: [`OmniumProduct`](schemas/OmniumProduct.md), [`OmniumPriceList`](schemas/OmniumPriceList.md), [`OmniumProductCategory`](schemas/OmniumProductCategory.md), [`OmniumAsset`](schemas/OmniumAsset.md), [`OmniumInventoryItem`](schemas/OmniumInventoryItem.md), [`OmniumProductListItemViewModelOmniumSearchResult`](schemas/OmniumProductListItemViewModelOmniumSearchResult.md), [`OmniumProductPatch`](schemas/OmniumProductPatch.md), [`OmniumProductUpdateResult`](schemas/OmniumProductUpdateResult.md)

### Projects

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/projects.md`](endpoints/projects.md) | Projects | 32 | Projects |
| [`endpoints/projects/assets.md`](endpoints/projects/assets.md) | Projects \| Assets | 6 | Project assets |
| [`endpoints/projects/change-orders.md`](endpoints/projects/change-orders.md) | Projects \| Change orders | 6 | Project change orders |
| [`endpoints/projects/logs.md`](endpoints/projects/logs.md) | Projects \| Logs | 4 | Project logs |
| [`endpoints/projects/parts.md`](endpoints/projects/parts.md) | Projects \| Parts | 7 | Project parts |
| [`endpoints/projects/project-types.md`](endpoints/projects/project-types.md) | Projects \| Project types | 2 | Project types |
| [`endpoints/projects/reports.md`](endpoints/projects/reports.md) | Projects \| Reports | 2 | Project reports |
| [`endpoints/projects/time-entries.md`](endpoints/projects/time-entries.md) | Projects \| Time entries | 5 | Project time entries |
| [`endpoints/projects/transactions.md`](endpoints/projects/transactions.md) | Projects \| Transactions | 7 | Project transactions |
| [`endpoints/projects/versions.md`](endpoints/projects/versions.md) | Projects \| Versions | 2 | Project versioning |

Key schemas: [`OmniumProject`](schemas/OmniumProject.md), [`OmniumProjectChangeOrder`](schemas/OmniumProjectChangeOrder.md), [`OmniumProjectPart`](schemas/OmniumProjectPart.md), [`OmniumProjectTransaction`](schemas/OmniumProjectTransaction.md), [`OmniumWorkflowStepRequest`](schemas/OmniumWorkflowStepRequest.md), [`OmniumAsset`](schemas/OmniumAsset.md), [`OmniumProjectLog`](schemas/OmniumProjectLog.md), [`OmniumProjectOmniumSearchResult`](schemas/OmniumProjectOmniumSearchResult.md)

### Promotions

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/promotions.md`](endpoints/promotions.md) | Promotions | 11 | Discount and promotion API |
| [`endpoints/promotions/campaigns.md`](endpoints/promotions/campaigns.md) | Promotions \| Campaigns | 7 | Campaign management API for planning and grouping promotions |

Key schemas: [`OmniumCampaign`](schemas/OmniumCampaign.md), [`OmniumCampaignRequest`](schemas/OmniumCampaignRequest.md), [`OmniumPromotionOmniumResult`](schemas/OmniumPromotionOmniumResult.md), [`OmniumCampaignOmniumSearchResult`](schemas/OmniumCampaignOmniumSearchResult.md), [`OmniumCampaignSearchRequest`](schemas/OmniumCampaignSearchRequest.md), [`OmniumCampaignStatusUpdate`](schemas/OmniumCampaignStatusUpdate.md), [`OmniumPotentialDiscountHint`](schemas/OmniumPotentialDiscountHint.md), [`OmniumProductPromotionIdSearchResultOmniumSearchResult`](schemas/OmniumProductPromotionIdSearchResultOmniumSearchResult.md)

### Purchase Orders

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/purchase-orders.md`](endpoints/purchase-orders.md) | Purchase Orders | 22 | Purchase orders |
| [`endpoints/purchase-orders/deliveries.md`](endpoints/purchase-orders/deliveries.md) | Purchase Orders \| Deliveries | 12 | Deliveries |
| [`endpoints/purchase-orders/workflows.md`](endpoints/purchase-orders/workflows.md) | Purchase Orders \| Workflows | 2 | Purchase order workflows |

Key schemas: [`OmniumPurchaseOrder`](schemas/OmniumPurchaseOrder.md), [`OmniumComment`](schemas/OmniumComment.md), [`OmniumDelivery`](schemas/OmniumDelivery.md), [`OmniumDeliveryGoodsReceptionLine`](schemas/OmniumDeliveryGoodsReceptionLine.md), [`OmniumPurchaseOrderOmniumResult`](schemas/OmniumPurchaseOrderOmniumResult.md), [`OmniumPurchaseOrderOmniumScrollableQueryResult`](schemas/OmniumPurchaseOrderOmniumScrollableQueryResult.md), [`OmniumPurchaseOrderOmniumSearchResult`](schemas/OmniumPurchaseOrderOmniumSearchResult.md), [`OmniumPurchaseOrderSearchRequest`](schemas/OmniumPurchaseOrderSearchRequest.md)

### Ratings

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/ratings.md`](endpoints/ratings.md) | Ratings | 7 | Add or get ratings. |

Key schemas: [`OmniumRatingOmniumSearchResult`](schemas/OmniumRatingOmniumSearchResult.md), [`OmniumSearchRatingRequest`](schemas/OmniumSearchRatingRequest.md), [`OmniumRating`](schemas/OmniumRating.md), [`OmniumRatingOmniumResult`](schemas/OmniumRatingOmniumResult.md)

### Settings

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/settings.md`](endpoints/settings.md) | Settings | 3 | Settings |
| [`endpoints/settings/event-subscriptions.md`](endpoints/settings/event-subscriptions.md) | Settings \| Event Subscriptions | 7 |  |
| [`endpoints/settings/products.md`](endpoints/settings/products.md) | Settings \| Products | 3 | Product related tenant settings |
| [`endpoints/settings/property-options.md`](endpoints/settings/property-options.md) | Settings \| Property Options | 9 | Property options for products, customers, and other entities |

Key schemas: [`OmniumEventSubscription`](schemas/OmniumEventSubscription.md), [`OmniumPropertyOption`](schemas/OmniumPropertyOption.md), [`OmniumPropertyOptionOmniumResult`](schemas/OmniumPropertyOptionOmniumResult.md), [`OmniumPropertyOptionSearchRequest`](schemas/OmniumPropertyOptionSearchRequest.md), [`ValidationProblemDetails`](schemas/ValidationProblemDetails.md), [`OmniumCustomerSettings`](schemas/OmniumCustomerSettings.md), [`OmniumEventSubscriptionFilterOptions`](schemas/OmniumEventSubscriptionFilterOptions.md), [`OmniumEventSubscriptionTestResult`](schemas/OmniumEventSubscriptionTestResult.md)

### Stores

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/stores.md`](endpoints/stores.md) | Stores | 13 | Warehouses, stores, and other sales channels. |

Key schemas: [`OmniumStore`](schemas/OmniumStore.md), [`OmniumStoreOmniumSearchResult`](schemas/OmniumStoreOmniumSearchResult.md), [`OmniumStoreOmniumResult`](schemas/OmniumStoreOmniumResult.md), [`OmniumStorePatch`](schemas/OmniumStorePatch.md), [`OmniumStoreSearchRequest`](schemas/OmniumStoreSearchRequest.md), [`OmniumStoreUpdateResult`](schemas/OmniumStoreUpdateResult.md), [`OmniumTaxGroup`](schemas/OmniumTaxGroup.md)

### Suppliers

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/suppliers.md`](endpoints/suppliers.md) | Suppliers | 7 | Suppliers |

Key schemas: [`OmniumSupplier`](schemas/OmniumSupplier.md), [`OmniumSupplierOmniumSearchResult`](schemas/OmniumSupplierOmniumSearchResult.md), [`OmniumSupplierPatch`](schemas/OmniumSupplierPatch.md), [`OmniumSupplierSearchRequest`](schemas/OmniumSupplierSearchRequest.md), [`OmniumSupplierUpdateResult`](schemas/OmniumSupplierUpdateResult.md)

### Tokens

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/tokens.md`](endpoints/tokens.md) | Tokens | 1 | Get JWT token for access to Omnium APIs. |

Key schemas: [`OmniumTokenResponse`](schemas/OmniumTokenResponse.md)

### Triggers

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/triggers.md`](endpoints/triggers.md) | Triggers | 1 | Trigger actions |

Key schemas: [`OmniumTriggerRequest`](schemas/OmniumTriggerRequest.md)

### Users

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/users.md`](endpoints/users.md) | Users | 11 | Administrate users and roles |

Key schemas: [`OmniumRole`](schemas/OmniumRole.md), [`OmniumUserModel`](schemas/OmniumUserModel.md), [`OmniumUserPatch`](schemas/OmniumUserPatch.md)

### Vouchers

| File | Tag | Endpoints | Description |
|------|-----|-----------|-------------|
| [`endpoints/vouchers.md`](endpoints/vouchers.md) | Vouchers | 5 | Vouchers |

Key schemas: [`OmniumVoucherOmniumSearchResult`](schemas/OmniumVoucherOmniumSearchResult.md), [`OmniumVoucherSearchRequest`](schemas/OmniumVoucherSearchRequest.md), [`OmniumVoucher`](schemas/OmniumVoucher.md), [`OmniumVoucherOmniumResult`](schemas/OmniumVoucherOmniumResult.md)

### Shared schemas

Used by endpoints in 3 or more areas. The full list of schemas is in [`schemas/_INDEX.md`](schemas/_INDEX.md).

| Schema | Areas | Description |
|--------|-------|-------------|
| [`OmniumAsset`](schemas/OmniumAsset.md) | Customers, Products, Projects |  |
| [`OmniumCart`](schemas/OmniumCart.md) | Carts, Orders, Products | The cart class is the main class used for handling both carts and offers given to a customer. Could be online carts, or offers from physical stores |
| [`OmniumComment`](schemas/OmniumComment.md) | Comments, Obsolete, Purchase Orders | Object used for adding and getting comments on all models |
| [`OmniumEmailMessage`](schemas/OmniumEmailMessage.md) | Customers, Notifications, Projects | Class for sending email |
| [`OmniumInvoiceOmniumSearchResult`](schemas/OmniumInvoiceOmniumSearchResult.md) | Invoices, Orders, Projects | Generic class for receiving search results with facets |
| [`OmniumProductSearchRequest`](schemas/OmniumProductSearchRequest.md) | Obsolete, Products, Promotions | Search request object for products |
| [`ProblemDetails`](schemas/ProblemDetails.md) | Accounting, Carts, Cases, Customers, Insights, Obsolete, Orders, Products, Projects, Promotions, Settings, Stores |  |
<!-- END generated endpoint files -->
