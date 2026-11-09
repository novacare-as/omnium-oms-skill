# Operations

Source: https://docs.omnium.no/docs/Environments/operations

> How to monitor, maintain, and optimize your Omnium instance — event logs, scheduled tasks, data maintenance, environment management, and performance best practices.

## Monitoring Your Instance

Omnium provides several tools for understanding what's happening in your tenant at any given time.

### Event log

The event log is your primary window into system activity. Almost every operation in Omnium — whether triggered via API, the UI, a scheduled task, or an integration — creates an event. Events capture what happened, when, who triggered it, and the result.

Access the event log in the UI under **Configuration > Advanced > Events**.

Events include:

*   **Operation ID** — numeric code identifying the type of operation (e.g., 110100 = Order created from cart)
*   **Status and previous status** — the state change that occurred
*   **Origin** — which API endpoint, scheduled task, or integration triggered the event
*   **Error flag** — whether the operation failed
*   **Attachments** — additional data such as workflow results

Use the event log to:

*   Track order state changes and identify where processing stalled
*   Debug failed integration syncs (ERP, POS, e-commerce)
*   Audit user actions in the backoffice
*   Monitor webhook delivery success/failure

For the complete event structure and operation ID reference, see [Events](../Integrations/events.md).

### Scheduled task status

Scheduled tasks run background jobs on a cron schedule. You can monitor their status in the UI under **Configuration > Settings > Integrations > Scheduled tasks**, which shows:

*   **Last successful run** — when the task last completed successfully
*   **Next occurrence** — when the task will run next (based on cron schedule)
*   **Running state** — whether the task is currently executing

If a task hasn't run when expected, check:

1.  Is it disabled? (`IsDisabled: true`)
2.  Is the cron schedule correct?
3.  Is it already running? (long-running tasks won't start a new instance)
4.  Are there errors in the event log for the task?

You can also manually trigger any scheduled task from the UI for testing or to force an immediate run.

For task configuration details, see [Scheduled Tasks](../configuration/scheduled-tasks.md).

### Event subscriptions

For automated monitoring, subscribe to events via webhooks, Azure Service Bus, Azure Storage Queues, or Apache Kafka. This lets you build alerts for specific conditions — for example, notify a Slack channel when an order export fails.

Event subscriptions are configured under **Configuration > Event subscriptions**. You can filter by:

*   Entity type (orders, products, customers, etc.)
*   Order type or status
*   Store or market
*   Error events only

For setup details, see [Events](../Integrations/events.md).

* * *

## Data Maintenance

### Event log cleanup

Event logs accumulate over time. Configure the `DeleteEventLogScheduledTask` to automatically remove old events:

```json
{
  "ImplementationType": "DeleteEventLogScheduledTask",
  "Schedule": "0 3 * * 0",
  "Properties": [
    { "Key": "EventLogPreservationDays", "Value": "90" },
    { "Key": "EventLogOrderPreservationDays", "Value": "365" }
  ]
}
```

Order events can be preserved longer than general events since they're often needed for auditing.

### Expired price cleanup

Prices with past expiration dates should be cleaned up to keep product documents lean:

```json
{
  "ImplementationType": "DeleteExpiredPricesScheduledTask",
  "Schedule": "0 4 * * *"
}
```

### Abandoned cart cleanup

Carts that were never completed should be periodically removed:

```json
{
  "ImplementationType": "DeleteAbandonedCartScheduledTask",
  "Schedule": "0 3 * * *"
}
```

### Historical opening hours

Special opening hours (holidays, temporary changes) accumulate on store documents. Configure cleanup via `DeleteAdditionalOpeningHoursThreshold` in [Store configuration](../Stores/store-config.md#historical-opening-hours-cleanup).

* * *

## Environment Management

Omnium provides three environments:

| Environment | URL | Updated | Purpose |
| --- | --- | --- | --- |
| **Production** | omnium.no / api.omnium.no | Tuesdays | Live environment |
| **Test** | test.omnium.no / apitest.omnium.no | Tuesdays (after production) | Release validation |
| **Dev** | dev.omnium.no / apidev.omnium.no | Continuously | Early feature testing |

Key operational notes:

*   **Dev and Test share data** (except settings) — only run scheduled tasks in one environment
*   **Settings can be copied** between environments, but scheduled tasks are automatically disabled in the target to prevent unintended execution
*   **Test mirrors the next release** — use it to validate upcoming changes before they go live
*   **Settings copy is only available in Dev and Test** — not production, for safety

For details, see [Test & Dev Environments](test-dev.md).

* * *

## Performance Considerations

### API integration performance

*   **Use batch endpoints** where available (`AddMany`, `UpdateMany`) instead of individual calls
*   **Respect concurrency limits** — 20 concurrent requests per API user is the default
*   **Use delta queries** for synchronization instead of full data pulls. See [Data Out](../Integrations/data-out.md)
*   **Implement exponential backoff** for 429 responses — don't retry immediately
*   **Batch operations are limited to 4 concurrent** — process them sequentially for best results

### Product document size

Large product documents slow down search and indexing. Watch for:

*   **Too many prices** — if a product has 150+ prices, consider using separate price storage
*   **Too many store assignments** — with hundreds of stores, the `inStoreIds` array grows large
*   **Large custom properties** — avoid storing large text blobs in product properties
*   **Historical data** — clean up expired prices and old inventory snapshots

### Scheduled task performance

*   **Stagger heavy tasks** — don't schedule multiple resource-intensive tasks at the same time
*   **Delta tasks** are preferred over full tasks for ongoing sync (much faster)
*   **Monitor duration trends** — if a task takes increasingly longer, it may indicate growing data that needs attention
*   **Off-peak scheduling** — run full tasks during off-peak hours (typically 2-5 AM)

* * *

## Operational Checklist

Use this checklist when setting up or reviewing an Omnium tenant:

### Before go-live

*   [ ]  API credentials created with appropriate roles and store/market access
*   [ ]  Scheduled tasks configured and tested in the Test environment
*   [ ]  Event subscriptions set up for critical integrations (ERP, WMS)
*   [ ]  Rate limits reviewed — request custom limits if needed for high-volume scenarios
*   [ ]  Cleanup tasks configured (event logs, expired prices, abandoned carts)
*   [ ]  Integration connectors tested end-to-end (payment, shipping, ERP)
*   [ ]  Webhook endpoints verified and monitoring alerts configured

### Ongoing monitoring

*   [ ]  Event log reviewed regularly for error events
*   [ ]  Scheduled task execution status checked weekly
*   [ ]  Integration sync health validated (orders, inventory, products)
*   [ ]  Rate limit headroom confirmed for peak traffic periods

### Periodic maintenance

*   [ ]  Event log retention configured appropriately
*   [ ]  Expired price cleanup running
*   [ ]  Abandoned cart cleanup running
*   [ ]  Historical opening hours cleanup running (if applicable)
*   [ ]  API credentials rotated per your security policy

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| Event structure and operation IDs | [Events](../Integrations/events.md) |
| Scheduled task configuration | [Scheduled Tasks](../configuration/scheduled-tasks.md) |
| Rate limits and throttling | [Rate Limits](rate-limits.md) |
| Dev and Test environments | [Test & Dev](test-dev.md) |
| Data synchronization patterns | [Data Out](../Integrations/data-out.md) |
| Store data maintenance | [Store Configuration](../Stores/store-config.md) |
| Troubleshooting common issues | [Troubleshooting](../Integrations/troubleshooting.md) |
