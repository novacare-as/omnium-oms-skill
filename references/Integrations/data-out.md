# Data Out

Source: https://docs.omnium.no/docs/Integrations/data-out

> Best practices for retrieving and synchronizing data from Omnium using delta queries, events, and scrolling.

## Overview

Omnium provides multiple mechanisms for exporting data and keeping external systems synchronized. Choose the right approach based on your use case.

* * *

### Delta Queries

Delta queries let you fetch only data that has changed since a given timestamp. This is ideal for polling-based integrations.

**Example: Get orders modified since a timestamp:**

```
POST /api/orders/Search

{
  "modifiedFrom": "2024-01-15T10:30:00Z",
  "take": 100
}
```

**Benefits:**

*   Retrieve only what has changed
*   Reduce data transfer and processing
*   Simple to implement with timestamp-based polling
*   Works with standard API rate limits

**Best Practice:** Keep track of the timestamp from your last successful query and pass it as modifiedFrom in the next call. This ensures you only process new or updated data once and never miss any updates.

#### Practical Example: Inventory Delta Query with Auto-Scrolling

Here's a real-world example showing how delta queries automatically trigger scrolling for large result sets:

**Sample request for inventory delta query:**

```
POST /api/inventory/search

{
  "lastModified": "2019-11-21T17:32:28Z"
}
```

**Sample response when result set exceeds 2000 items:**

Notice that the `scrollId` property has been populated because `totalHits` exceeds 2000, meaning you should use the scroll endpoint to fetch remaining inventory items:

```json
{
  "totalHits": 41244,
  "result": [
    {
      "sku": "102103",
      "warehouseCode": "40",
      "inventory": 33,
      "reservedInventory": 7,
      "location": "32D-A2"
    },
    {
      "sku": "102104",
      "warehouseCode": "40",
      "inventory": 15,
      "reservedInventory": 2
    }
    // ... more items up to 2000
  ],
  "scrollId": "2f842421e06e4c60bb2c4f0d8b3ef60b"
}
```

**Important:** Specifically for the inventory search endpoint, when the total amount is larger than 2000, the response will automatically contain a `scrollId` which can be used with the scroll endpoint to fetch all remaining items:

```
GET /api/inventory/scroll/2f842421e06e4c60bb2c4f0d8b3ef60b
```

Continue calling the scroll endpoint with the latest `scrollId` until all items are retrieved.

* * *

### Event-Driven Export

Omnium fires events for most operations, whether executed via API or UI. Subscribe to these events for near real-time data synchronization.

**Event Subscription Types:**

*   Webhooks
*   Azure Storage Queues
*   Azure Service Bus
*   Apache Kafka

**Setting Up Event Subscriptions:**

Event subscribers are registered in the Omnium UI under **Configuration > Event subscriptions**. You can filter events by:

*   Entity type (orders, products, inventory, etc.)
*   Order type (Click and Collect, standard, etc.)
*   Status changes
*   Store
*   Market

**Learn More:** See our [Events documentation](events.md) for detailed information on events and event subscriptions

* * *

### Scrolling for Large Datasets

Use scrolling when you need to process large datasets such as initial loads, backfills, recovery operations, or when there has been a massive number of updates. For delta queries, we actually encourage using the scroll endpoints, even if there are few or no data changes.

**Example: Initial scroll request:**

```
POST /api/products/Query/Scroll

{
  "marketIds": ["NOR"],
  "scrollSize": 500,
  "isActive": true
}
```

**Response includes a `scrollId`:**

```json
{
  "result": [...],
  "scrollId": "abc123xyzerogpkaraahhreallylongscrollid",
  "totalHits": 90210
}
```

**Continue scrolling with scrollId:**

```
GET /api/products/Query/Scroll/abc123xyz
```

**Key Features:**

*   Consistent snapshot of data at query time
*   Handles datasets too large for standard pagination
*   Must complete or terminate scroll to free resources
*   Stricter rate limits than standard endpoints

**Warning:** Unfinished scroll operations continue to hold server resources. Always complete your scroll operations by fetching all results, or the scroll context will remain open until it expires (typically after 5 minutes of inactivity). Leaving many scrolls open can negatively impact system performance.

**Learn More:** See our [Scrolling documentation](scrolling.md) for best practices and detailed workflow.

* * *

## Event-Driven vs Polling Integrations

Choosing the right integration pattern depends on your use case. Here's guidance on when to use each approach.

**Polling integrations** use delta queries (aka. `changedSince` or `modifiedSince` parameters) to periodically check for changes, while **event-driven integrations** receive push notifications when changes occur.

### Quick Comparison

| **Aspect** | **Event-Driven (Push)** | **Polling (Pull/Delta Queries)** |
| --- | --- | --- |
| **Latency** | Near real-time | Controlled delay (e.g., 30 sec to hours/daily) |
| **Best For** | Low-volume, time-critical changes | High-volume, frequently changing data |
| **Complexity** | Higher (event processing, replays) | Lower (simple scheduled jobs) |
| **Message Volume** | Can be very high for noisy domains | Batched, controlled volume |
| **Infrastructure** | Requires event processing system | Standard HTTP polling |
| **Control** | Omnium pushes when changes occur | You control polling frequency |
| **Examples** | Order status, payments | Inventory sync, product updates |

* * *

### When Events Shine

**Use events when you need near real-time propagation and precision:**

*   Order lifecycle changes\*\* that drive customer communications or fulfillment
*   Customer profile updates such as consent, loyalty points, or address changes
*   Low-volume but time-critical operations

**Benefits:**

*   Low latency (near real-time)
*   Fine-grained change signals
*   Natural fit for reactive workflows
*   Immediate downstream processing

**Trade-offs:**

*   Potentially very high message counts for noisy domains (e.g., inventory - could be, but not always)
*   Complex error handling and replays
*   Harder to aggregate or reorder for downstream batch systems
*   Requires robust event processing infrastructure

**Example Use Cases:**

*   Notify customer when order is ready for pickup
*   Update product availability on website immediately when stock changes
*   Trigger fulfillment workflows on order placement

* * *

### When Polling is Better

**For high-churn domains such as inventory, polling with delta queries is often more efficient:**

**Recommended Pattern:**

1.  Poll delta queries at fixed intervals (e.g., every 30 seconds to 1 minute for high-priority data, or hourly/daily for less time-sensitive data - tuned to your business needs)
2.  Apply changes downstream using bulk operations
3.  Store the timestamp of successful processing and use it for the next poll.

**Benefits:**

*   Lower operational overhead and simpler error handling
*   Natural batching for downstream systems that prefer bulk writes
*   Easier throughput control and backoff under load
*   Reduced message volume for high-frequency changes
*   Better for aggregation and bulk processing
*   You control the polling frequency

**Trade-offs:**

*   Small, controlled delay compared to pure events (typically 30-60 seconds)
*   You must manage scheduling and checkpoints

**Example Use Cases:**

*   Synchronizing inventory levels to ERP systems
*   Bulk product updates to search indexes
*   Periodic synchronization of customer data to marketing platforms I

### Combo! Best of two worlds? ✌️

**The best integrations often combine both patterns:**

*   **Events** for critical, low-volume, latency-sensitive changes

    *   Order status changes
    *   Payment confirmations
    *   Critical inventory thresholds
*   **Polling (delta queries)** for high-volume, frequently changing entities

    *   Inventory levels
    *   Product catalog updates
    *   Bulk price changes
*   **Scrolling** for initial loads, large backfills, and recovery

    *   Initial data synchronization
    *   System recovery after outages
    *   Full catalog exports

**Example Hybrid Architecture:**

```
Events (Webhook):
  └─ Order.StatusChanged → Trigger fulfillment workflow
  └─ Payment.Completed → Send confirmation email

Delta Polling (Every 60 seconds):
  └─ Inventory changes → Update ERP system in batches
  └─ Product changes → Refresh search index

Scrolling (On-demand):
  └─ Initial catalog load → Populate new system
  └─ Recovery → Re-sync after system downtime
```

### Example Use Case: Exporting Product Data for External Systems

A common scenario is exporting product data from Omnium to external systems such as **search engines**, **marketplaces**, or **product feeds** A common scenario is exporting product data from Omnium to external systems such as search engines, marketplaces, or product feeds for ACP, recommendation engines or marketing platforms.

In these cases, **batch-oriented polling** is usually the better approach:

*   Many external systems expect **bulk imports**, not a constant stream of granular updates.
*   Polling with **delta queries** (poll&scroll) lets you collect all recent changes at a fixed interval and send them in **controlled batches** downstream.
*   This reduces chatter and network overhead while improving stability and predictability.

**Example (recommended):**

> Every 30 seconds, call
> `POST /api/products/Query/Scroll`
> with `modifiedFrom` set to your last successful timestamp.
> Add filters to only retrieve the subset you actually need (for example by channel, assortment, market, or product type).
> Use `fields.include` / `fields.exclude*` to limit the payload to only the fields required by the external system. This reduces transfer size and makes the integration faster and more reliable.
> Persist the **timestamp of the last successful update** so that if your application fails or restarts, you can resume from the same point by setting `modifiedFrom` accordingly.

This approach keeps downstream systems up-to-date without overwhelming them with excessive updates

#### Union Delta Queries

The `isUnionDeltaQuery: true` parameter changes the query logic from **AND** to **OR** for specific time-based parameters:

*   **Without `isUnionDeltaQuery`** (default): All conditions must match (AND logic)
*   **With `isUnionDeltaQuery: true`**: Any of these time-based conditions can match (OR logic):
    *   `modifiedFrom` / `modifiedTo`
    *   `startPublishFrom` / `startPublishTo`
    *   `stopPublishFrom` / `stopPublishTo`
    *   `priceActivatedFrom` / `priceActivatedTo`
    *   `priceDeactivatedFrom` / `priceDeactivatedTo`

This means you can combine multiple time-based filters to catch products that match ANY of the criteria.

##### Basic Union Delta Query

```json
{
  "marketIds": ["NOR"],
  "isUnionDeltaQuery": true,
  "modifiedFrom": "2025-01-08T10:00:00Z",
  "priceActivatedFrom": "2025-01-08T10:00:00Z",
  "priceActivatedTo": "2025-01-08T10:05:00Z",
  "priceDeactivatedFrom": "2025-01-08T10:00:00Z",
  "priceDeactivatedTo": "2025-01-08T10:05:00Z"
}
```

This returns products that:

*   Were recently modified, OR
*   Had prices activate since the last timestamp, OR
*   Had prices deactivate since the last timestamp
*   The "To-values" here is the current time

#### Predictive Delta Queries

Beyond basic union queries, you can use predictive delta queries to detect upcoming activations or expirations before they happen. This makes it possible to retrieve both current changes and time-based updates in a single query. This is useful for proactive updates, cache warming, and early alerts.

##### Comprehensive Predictive Query

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

This returns products that:

*   Were modified since 9:00 AM, OR
*   Will start publishing in the next 5 minutes, OR
*   Will stop publishing in the next 5 minutes, OR
*   Will have prices activate in the next 5 minutes, OR
*   Will have prices deactivate in the next 5 minutes

This approach provides predictive and reactive change detection within a single, unified query. Neat!

**Example: Scheduled predictive delta query (runs every 5 minutes)**

```
// Job runs at 10:15 UTC
{
  "modifiedFrom": "2025-01-08T10:10:00Z",   // lastRunTime
  "startPublishFrom": "2025-01-08T10:15:00Z", // now
  "startPublishTo": "2025-01-08T10:20:00Z"    // now + lookaheadWindow (5m)
}
```

At the next run (10:20 UTC), the values move forward by the same interval:

```
// Job runs at 10:20 UTC
{
  "modifiedFrom": "2025-01-08T10:15:00Z",   // lastRunTime (previous now)
  "startPublishFrom": "2025-01-08T10:20:00Z", // now
  "startPublishTo": "2025-01-08T10:25:00Z"    // now + lookaheadWindow (5m)
}
```

**Pattern summary**

Each run:

*   Moves the window forward by the schedule interval
*   Uses the previous `now` as the new `modifiedFrom`
*   Keeps `lookaheadWindow` equal to the schedule interval

This ensures continuous coverage:

*   **No gaps** → you don't miss future activations
*   **No overlap** → you don't reprocess the same time range

#### Optimizing Product Queries with Field Selection

When working with delta queries, you can dramatically improve performance by requesting only the fields you actually need using `fields.include`:

```json
{
  "marketIds": ["NOR"],
  "modifiedFrom": "2025-01-08T06:00:00Z",
  "fields": {
    "include": [
      "id",
      "skuId",
      "name",
      "brand",
      "mainImageUrl",
      "variants.skuId",
      "variants.inventory.quantity",
      "variants.inventory.warehouseId"
    ]
  }
}
```

**Performance Benefits**

Using `fields.include` with delta queries provides:

*   **Faster Response Times**: Huge potential reduction in response size
*   **Reduced Bandwidth**: Critical for high-volume delta processing
*   **Targeted Data**: Get exactly what you need for your use case

## Best Practices Summary

*   Use **events** for time-critical, low-volume changes
*   Use **polling (delta queries)** for high-volume, frequently changing entities
*   Use **scrolling** for initial loads and large backfills
*   Use **`fields.include`** to maximize performance for product scrolling or searches
*   Consider implementing a **hybrid approach** for optimal performance

* * *

## Next Steps

Now that you understand data export patterns:

*   Explore the [Events documentation](events.md) for event subscription details
*   Check out the [Data In](data-in.md) for import strategies
