# API Developer Guide

Source: https://docs.omnium.no/docs/GettingStartedWithAPI/api-developer-guide

> Complete guide to integrating with the Omnium API — authentication, searching, updating, error handling, and best practices.

## Overview

The Omnium API is a RESTful JSON API that gives you full access to your order management system. This guide covers everything you need to build a robust integration: authentication, common patterns, error handling, and performance optimization.

**Base URLs:**

| Environment | API Base URL | Swagger Documentation |
| --- | --- | --- |
| **Test** | `https://apitest.omnium.no` | [https://apitest.omnium.no/documentation](https://apitest.omnium.no/documentation) |
| **Production** | `https://api.omnium.no` | [https://api.omnium.no/documentation](https://api.omnium.no/documentation) |

The Swagger documentation is also available segmented by domain:

| Segment | URL |
| --- | --- |
| Orders | `/documentation/orders` |
| Products | `/documentation/products` |
| Carts | `/documentation/carts` |
| Customers | `/documentation/customers` |
| Projects | `/documentation/projects` |

* * *

## Authentication

Omnium uses JWT Bearer tokens for authentication. You obtain a token by calling the token endpoint with your API credentials, then include it in the `Authorization` header of all subsequent requests.

### Step 1: Create API Credentials

1.  Log in to the Omnium GUI
2.  Navigate to **Configuration > Authorization > API Users**
3.  Click the three-dot menu and select **"Create API user"**
4.  Give the user a descriptive name (e.g., `"ERP Sync"` or `"E-Commerce Frontend"`)
5.  Copy the generated `ClientId` and `ClientSecret`

The `ClientSecret` is only shown once when the API user is created. Store it securely — if lost, you'll need to create a new API user.

### Step 2: Request a Token

```
POST /api/token?clientId=YOUR_CLIENT_ID&clientSecret=YOUR_CLIENT_SECRET
```

**Plain text response (default):** The response body contains the JWT token as a plain string.

**JSON response (recommended):** Add `returnAsJson=true` to get a structured response:

```
POST /api/token?clientId=YOUR_CLIENT_ID&clientSecret=YOUR_CLIENT_SECRET&returnAsJson=true
```

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 864000
}
```

| Field | Description |
| --- | --- |
| `accessToken` | The JWT token to use in the `Authorization` header |
| `tokenType` | Always `"Bearer"` |
| `expiresIn` | Token lifetime in seconds (864000 = 10 days) |

### Step 3: Use the Token

Include the token in the `Authorization` header of every API request:

```
GET /api/orders/ORD-001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Token Lifetime and Renewal

Tokens are valid for **10 days**. You do not need to request a new token for every call — reuse the token until it expires.

To check when a token expires, decode the JWT and read the `exp` claim, or track the `expiresIn` value from the JSON response.

**C# example — token management:**

```
var client = _httpClientFactory.CreateClient();
client.BaseAddress = new Uri("https://apitest.omnium.no");

// Request token
var response = await client.PostAsync(
    "/api/token?clientId=YOUR_CLIENT_ID&clientSecret=YOUR_CLIENT_SECRET&returnAsJson=true",
    null);

if (!response.IsSuccessStatusCode)
    throw new Exception($"Authentication failed: {response.StatusCode}");

var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponse>();

// Add token to all subsequent requests
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", tokenResponse.AccessToken);

// Check expiry
var handler = new JwtSecurityTokenHandler();
var jwt = handler.ReadJwtToken(tokenResponse.AccessToken);
DateTime expiresUtc = jwt.ValidTo;
```

**cURL example:**

```
# Get token
TOKEN=$(curl -s -X POST \
  "https://apitest.omnium.no/api/token?clientId=YOUR_ID&clientSecret=YOUR_SECRET")

# Use token
curl -H "Authorization: Bearer $TOKEN" \
  https://apitest.omnium.no/api/orders/ORD-001
```

* * *

## Roles and Permissions

Each API user is assigned one or more roles that control which endpoints they can access. Roles follow a hierarchy — higher roles automatically include the permissions of lower roles.

### Role Hierarchy

| Role | Description |
| --- | --- |
| **ApiOwner** | Full access to all API endpoints. Equivalent to `Admin`. |
| **CommerceUser** | Access to headless commerce endpoints (carts, products, customers). |
| **ApiUser** | Base API access. Required for authentication but doesn't grant access to specific resource endpoints. |

### Resource-Specific Roles

Each resource domain has a **Read** and **Admin** role. Read grants GET/Search access; Admin grants full CRUD:

| Resource | Read Role | Admin Role |
| --- | --- | --- |
| Orders | `OrderRead` | `OrderAdmin` |
| Products | `ProductRead` | `ProductAdmin` |
| Customers | `CustomerRead` | `CustomerAdmin` |
| Carts | `CartRead` | `CartAdmin` |
| Inventory | `InventoryRead` | `InventoryAdmin` |
| Promotions | `PromotionRead` | `PromotionAdmin` |
| Stores | `StoreRead` | `StoreAdmin` |
| Projects | `ProjectRead` | `ProjectAdmin` |
| Suppliers | `SupplierRead` | `SupplierAdmin` |
| Purchase Orders | `PurchaseOrderRead` | `PurchaseOrderAdmin` |
| Settings | `SettingsRead` | `SettingsAdmin` |
| Users | `UserRead` | `UserAdmin` |

**Best practice:** Follow the principle of least privilege. An e-commerce frontend only needs `CartAdmin` + `ProductRead` + `CustomerAdmin`. An ERP sync might need `OrderRead` + `ProductAdmin` + `InventoryAdmin`.

### Store and Market Scoping

API users can be scoped to specific stores or markets using the roles `AllStores` and `AllMarkets`, or by assigning store/market-specific roles (e.g., `store-oslo-downtown`, `market-nor`).

* * *

## REST Patterns

The API follows consistent REST conventions across all resources.

### HTTP Methods

| Method | Usage | Example |
| --- | --- | --- |
| `GET` | Retrieve a single resource | `GET /api/orders/{id}` |
| `POST` | Create a resource, or execute a search/action | `POST /api/orders` |
| `PUT` | Create with auto-generated ID, or bulk create | `PUT /api/orders` |
| `PATCH` | Partial update (only supplied fields are changed) | `PATCH /api/orders/{id}/PatchOrder` |
| `DELETE` | Remove a resource | `DELETE /api/orders/{id}` |

### Common Endpoint Patterns

Every major resource (orders, products, customers, carts) follows this pattern:

```
GET    /api/{resource}/{id}           → Get by ID
POST   /api/{resource}                → Create (explicit ID required)
PUT    /api/{resource}                → Create (auto-generated ID)
POST   /api/{resource}/Search         → Search with filters
POST   /api/{resource}/Scroll         → Cursor-based search for large datasets
PATCH  /api/{resource}/{id}/Patch...  → Partial update
DELETE /api/{resource}/{id}           → Delete
POST   /api/{resource}/AddMany        → Bulk create
PATCH  /api/{resource}/PatchMany      → Bulk partial update
PUT    /api/{resource}/UpdateMany     → Bulk full update
```

### Content Type

All request and response bodies use JSON:

```
Content-Type: application/json
```

* * *

## Working with IDs

All entity IDs in Omnium — orders, products, customers, stores, price lists, etc. — appear directly in URL paths (e.g., `GET /api/orders/{id}`). This means IDs **must be URL-safe** to work correctly with the API.

### Allowed Characters

| Characters | Examples | Safe? |
| --- | --- | --- |
| Letters and digits | `a-z`, `A-Z`, `0-9` | Yes |
| Hyphens | `-` | Yes |
| Underscores | `_` | Yes |

### Characters to Avoid

| Character | Why |
| --- | --- |
| Space ( ) | Breaks URL parsing; must be percent-encoded as `%20` |
| Forward slash (`/`) | Interpreted as a URL path separator |
| Backslash (`\`) | Interpreted as a path separator on some systems |
| `#` | Interpreted as a URL fragment delimiter |
| `?` | Interpreted as a query string delimiter |
| `&` | Interpreted as a query parameter separator |
| `%` | Used for percent-encoding; causes double-encoding issues |
| `+` | Interpreted as a space in query strings |
| `.` | Can conflict with file extension parsing in URL routing |

### Best Practices

*   **Keep IDs URL-safe** — stick to alphanumeric characters, hyphens, and underscores
*   **Avoid whitespace** — leading, trailing, or embedded spaces cause lookup failures and are easy to introduce accidentally in imports
*   **Be consistent** — pick a convention (e.g., `UPPER-CASE`, `lower-case`, or `PascalCase`) and stick to it across your integration
*   **Match your source system** — use the same IDs as your ERP, POS, or e-commerce platform to simplify troubleshooting and cross-referencing

If an ID contains URL-unsafe characters, API calls like `GET /api/orders/ORD 123` or `GET /api/products/item/456` will fail or return unexpected results. Always sanitize IDs before sending them to Omnium.

* * *

## Searching

Search is the primary way to query data. All search endpoints accept a `POST` request with a JSON body containing filter criteria.

### Basic Search

```
POST /api/orders/Search

{
  "take": 20,
  "page": 0,
  "sortOrder": "CreatedDescending"
}
```

### Search Response Structure

All search endpoints return the same wrapper:

```json
{
  "result": [ ... ],
  "totalHits": 1520,
  "facets": [ ... ],
  "scrollId": null
}
```

| Field | Description |
| --- | --- |
| `result` | Array of matching items |
| `totalHits` | Total number of matches (not just the current page) |
| `facets` | Aggregations for filtering UI (categories, brands, statuses, etc.) |
| `scrollId` | Used for cursor-based pagination with Scroll endpoints |

### Pagination

| Parameter | Description | Limits |
| --- | --- | --- |
| `take` | Number of items per page | Max **100** |
| `page` | Page number (0-based) | Max offset: `take * page` must not exceed **10,000** |

**Example — page 3 with 25 items per page:**

```json
{
  "take": 25,
  "page": 2,
  "sortOrder": "CreatedDescending"
}
```

This returns items 50–74 (0-indexed page 2 × 25 items).

### Scroll Search (Large Datasets)

For datasets larger than 10,000 items, use the Scroll endpoint instead of pagination:

```
POST /api/orders/Scroll

{
  "take": 100,
  "sortOrder": "CreatedAscending"
}
```

The response includes a `scrollId`. Use it to fetch subsequent batches:

```
GET /api/orders/Scroll/{scrollId}
```

Keep calling the scroll endpoint until `result` is empty. See [Scrolling](../Integrations/scrolling.md) for more details.

### Sort Orders

Available sort options vary by resource but commonly include:

| Sort Order | Description |
| --- | --- |
| `CreatedAscending` / `CreatedDescending` | Sort by creation date |
| `ModifiedAscending` / `ModifiedDescending` | Sort by last modification |
| `DocumentId` | Sort by internal ID (fastest performance) |

Product search supports multi-level sorting with `sortOrder`, `sortOrder2nd`, and `sortOrder3rd`.

### Filtering Examples

**Orders — filter by status and date range:**

```
POST /api/orders/Search

{
  "selectedStatuses": ["New", "InProgress"],
  "createdFrom": "2025-01-01T00:00:00Z",
  "createdTo": "2025-12-31T23:59:59Z",
  "take": 50,
  "page": 0,
  "sortOrder": "CreatedDescending"
}
```

**Products — filter by market, stock, and category:**

```
POST /api/products/SearchProducts

{
  "marketId": "nor",
  "productCategoryIds": ["tees"],
  "isInStock": true,
  "take": 50,
  "page": 0,
  "isFacetsDisabled": true
}
```

**Customers — search by email:**

Customer search is split by customer type: use `/api/PrivateCustomers/Search` for B2C customers and `/api/BusinessCustomers/Search` for B2B customers. Both accept the same request body.

```
POST /api/PrivateCustomers/Search

{
  "email": "customer@example.com",
  "take": 10,
  "page": 0
}
```

### Disabling Facets

Facets (aggregations) add overhead to search queries. If you don't need them, disable them for better performance:

```json
{
  "disableFacets": true
}
```

For product search, the parameter is `isFacetsDisabled`:

```json
{
  "isFacetsDisabled": true
}
```

Always disable facets for backend integrations (ERP sync, inventory updates, etc.). Only enable them when building customer-facing filter UIs.

* * *

## Updating Resources (PATCH)

PATCH endpoints let you update specific fields without sending the entire object. Only the fields you include in the request body are modified — everything else is left unchanged.

### Basic Patch

```
PATCH /api/orders/{orderId}/PatchOrder

{
  "status": "InProgress",
  "salesPersonId": "user@company.com"
}
```

### Patching Custom Properties

Custom properties can be added, updated, or replaced:

```
PATCH /api/orders/{orderId}/PatchOrder

{
  "properties": [
    { "key": "erpReference", "value": "ERP-12345" },
    { "key": "priority", "value": "high" }
  ],
  "keepExistingCustomProperties": true
}
```

| Parameter | Default | Description |
| --- | --- | --- |
| `keepExistingCustomProperties` | `true` | `true`: merge with existing properties. `false`: replace all properties. |
| `keepExistingListItems` | `true` | `true`: merge list items (tags, external IDs). `false`: replace the list. |

### Removing Properties

Use `propertiesRemovalConditions` to remove specific properties before applying the patch:

```
PATCH /api/orders/{orderId}/PatchOrder

{
  "propertiesRemovalConditions": [
    { "key": "obsoleteField" }
  ],
  "properties": [
    { "key": "newField", "value": "replacement" }
  ]
}
```

### Updating Order Lines

```
PATCH /api/orders/{orderId}/PatchUpdateOrderLines

[
  {
    "lineItemId": "line_001",
    "quantity": 3,
    "properties": [
      { "key": "giftWrap", "value": "true" }
    ]
  }
]
```

### Bulk Patching

Update multiple resources in one request:

```
PATCH /api/products/PatchMany

[
  { "id": "product-1_no", "description": "Updated description" },
  { "id": "product-2_no", "isActive": false }
]
```

Bulk endpoints handle up to **1000 items per request** and automatically skip items with no actual changes.

* * *

## Error Handling

### HTTP Status Codes

| Code | Meaning | When It Happens |
| --- | --- | --- |
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Validation error, invalid parameters, or `take * page > 10000` |
| `401` | Unauthorized | Missing, expired, or invalid token |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Resource already exists (e.g., creating an order with a duplicate ID) |
| `429` | Too Many Requests | Rate limit exceeded (see [Rate Limits](../Environments/rate-limits.md)) |
| `500` | Internal Server Error | Unexpected server error |

### Handling 401 Unauthorized

If you receive a 401, your token has likely expired. Request a new token and retry:

```
if (response.StatusCode == HttpStatusCode.Unauthorized)
{
    await RefreshTokenAsync();
    response = await RetryRequestAsync(request);
}
```

### Handling 409 Conflict

A 409 occurs when you try to create a resource with an ID that already exists. This commonly happens with `POST /api/orders` when the order ID is already taken. Use `PUT /api/orders` instead to let Omnium auto-generate the order number, or handle the conflict in your code.

### Handling 429 Too Many Requests

When rate-limited, the response includes a `Retry-After` header indicating how many seconds to wait:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 2
```

**Best practice:** Implement exponential backoff with jitter:

```
if (response.StatusCode == (HttpStatusCode)429)
{
    var retryAfter = response.Headers.RetryAfter?.Delta
        ?? TimeSpan.FromSeconds(2);
    await Task.Delay(retryAfter);
    // Retry the request
}
```

* * *

## Rate Limits

Rate limits protect the platform and ensure fair usage across tenants. See [Rate Limits](../Environments/rate-limits.md) for the full policy details.

**Summary of default limits:**

| Limit | Default |
| --- | --- |
| Concurrent requests per API user | 20 |
| Token bucket | 12,000 tokens; refill 1,000 every 10 seconds |
| Tenant-wide concurrency | 40 concurrent requests |
| Batch operations (`AddMany`, `UpdateMany`) | 4 concurrent |
| High-traffic read endpoints (products, inventory) | 150 concurrent |

The token endpoint (`POST /api/token`) is excluded from all rate limits.

**Tips to stay within limits:**

*   Reuse your token (10-day validity) — don't request a new token per call
*   Use batch endpoints (`AddMany`, `PatchMany`, `UpdateMany`) instead of single-item calls
*   Use `disableFacets: true` on search calls you don't need facets for
*   Process batch operations sequentially rather than in parallel
*   For large data syncs, use Scroll endpoints with moderate `take` values

* * *

## Bulk Operations

For high-volume integrations, always prefer bulk endpoints over individual calls.

### AddMany (Create)

```
POST /api/products/AddMany

[
  { "id": "prod-1_no", "productId": "prod-1", "name": "Product 1", ... },
  { "id": "prod-2_no", "productId": "prod-2", "name": "Product 2", ... }
]
```

### UpdateMany (Full Replace)

```
PUT /api/inventory/UpdateMany

[
  { "sku": "SKU-001", "warehouseCode": "warehouse-1", "inventory": 50 },
  { "sku": "SKU-002", "warehouseCode": "warehouse-1", "inventory": 100 }
]
```

### PatchMany (Partial Update)

```
PATCH /api/products/PatchMany

[
  { "id": "prod-1_no", "isActive": false },
  { "id": "prod-2_no", "description": "New description" }
]
```

**Limits:**

*   Up to **1000 items** per batch request
*   Max **4 concurrent** batch operations (per API user)
*   Items with no actual changes are automatically skipped

* * *

## Performance Best Practices

### Search Optimization

1.  **Disable facets** when you don't need them — this is the single biggest performance improvement for search calls
2.  **Exclude unnecessary fields** on product search to reduce payload size:

```json
{
  "excludedFields": {
    "isVariantsExcluded": true,
    "isPropertiesExcluded": true,
    "isPricesExcluded": true
  }
}
```

3.  **Use specific filters** rather than broad queries — filtered searches are faster than free-text search
4.  **Use Scroll** for datasets beyond 10,000 items instead of deep pagination

### Integration Patterns

1.  **Delta sync**: Use `modifiedFrom` / `modifiedTo` filters to only fetch changed records since your last sync. See [Delta Queries](../Integrations/delta.md) for details.
2.  **Batch writes**: Always prefer `AddMany` / `PatchMany` / `UpdateMany` over single-item operations
3.  **Respect rate limits**: Process batch operations sequentially, not in parallel
4.  **Cache your token**: Reuse the JWT token for its full 10-day lifetime

### Payload Size

*   Keep bulk request payloads under 1000 items
*   For very large product catalogs, split into batches and process sequentially
*   Use PATCH instead of PUT when you only need to update a few fields

* * *

## Webhooks

Omnium can send HTTP notifications to your systems when events occur (e.g., order status changes, shipment updates). Webhooks are configured per tenant via the Omnium GUI.

### Configuration

Webhooks are set up under **Configuration > Workflow Steps** in the Omnium GUI. Each workflow step can be configured to call an external URL when triggered.

### Webhook Request Format

When a webhook fires, Omnium sends an HTTP request (POST or GET, as configured) to your endpoint with the relevant entity data in the request body.

**Your endpoint should:**

*   Return a `2xx` status code to acknowledge receipt
*   Respond within a reasonable timeout
*   Be idempotent (the same webhook may be delivered more than once)

See [Data Out](../Integrations/data-out.md) and [Events](../Integrations/events.md) for more on integration patterns.

* * *

## Quick Reference

### Your First API Call in 60 Seconds

```
# 1. Get a token
TOKEN=$(curl -s -X POST \
  "https://apitest.omnium.no/api/token?clientId=YOUR_ID&clientSecret=YOUR_SECRET")

# 2. Search for orders
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"take": 5, "page": 0, "sortOrder": "CreatedDescending"}' \
  https://apitest.omnium.no/api/orders/Search
```

### Common Endpoints

| Action | Method | Endpoint |
| --- | --- | --- |
| Get token | POST | `/api/token` |
| Search orders | POST | `/api/orders/Search` |
| Get order | GET | `/api/orders/{id}` |
| Create order | POST | `/api/orders` |
| Update order | PATCH | `/api/orders/{id}/PatchOrder` |
| Search products | POST | `/api/products/SearchProducts` |
| Get product | GET | `/api/products/{id}` |
| Update inventory | PUT | `/api/inventory/UpdateMany` |
| Search customers (B2C) | POST | `/api/PrivateCustomers/Search` |
| Search customers (B2B) | POST | `/api/BusinessCustomers/Search` |
| Create cart | POST | `/api/Cart/AddItemToCart?skuId={sku}&quantity=1&marketId={market}` |
| Checkout | POST | `/api/Cart/CreateOrderFromCart/{cartId}` |

* * *

## Next Steps

*   **[Omnichannel E-Commerce Tutorial](Tutorials/omnichannel-ecom.md)** — Build a complete checkout flow step by step
*   **[User Guides by Role](user-guides.md)** — Find the right endpoints for your integration type
*   **[Integration Patterns](../Integrations/connectors.md)** — Learn about connectors, delta sync, scrolling, and event-driven architectures
*   **[Rate Limits](../Environments/rate-limits.md)** — Detailed rate limiting policies
*   **[Swagger Documentation](https://api.omnium.no/documentation)** — Full interactive API reference
