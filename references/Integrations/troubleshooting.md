# Troubleshooting

Source: https://docs.omnium.no/docs/Integrations/troubleshooting

> Common HTTP errors, integration issues, and step-by-step troubleshooting guides for Omnium.

## Common HTTP Errors

When integrating with the Omnium API, you may encounter these error responses:

### 400 Bad Request

The request body is invalid or fails validation.

**Common causes:**

*   Missing required fields (e.g., `MarketId` on an order)
*   Invalid field values (e.g., negative prices, malformed dates)
*   Document too large (exceeds the search index document size limit)
*   Validation rule failure (e.g., duplicate order ID)

**What to do:** Check the response body for a validation message describing the specific error. Fix the request payload and retry.

### 401 Unauthorized

Authentication failed.

**Common causes:**

*   Missing or expired Bearer token
*   Invalid API credentials
*   Token generated for a different tenant

**What to do:** Generate a new token using your API credentials. Tokens are valid for 10 days. See the [API Developer Guide](../GettingStartedWithAPI/api-developer-guide.md) for authentication details.

### 403 Forbidden

Authentication succeeded, but the user doesn't have permission for this operation.

**Common causes:**

*   API user lacks the required role (e.g., trying an admin operation with an ApiUser role)
*   User doesn't have access to the requested store or market
*   Endpoint requires a higher privilege level

**What to do:** Check the user's roles and store/market access. See [Authentication & Roles](../Security/authentication-roles.md) for the role hierarchy.

### 404 Not Found

The requested resource doesn't exist.

**Common causes:**

*   Incorrect entity ID
*   Entity was deleted
*   Wrong API endpoint path

**What to do:** Verify the ID and endpoint. Use search endpoints to confirm the entity exists.

### 409 Conflict

A conflict with the current state of the entity occurred.

**Common causes:**

*   Creating an entity with an ID that already exists (for example `POST /api/orders` with a duplicate order ID)
*   Another operation holds the lock on the same order, purchase order, or project. The response body then contains `"error": "ResourceLocked"`. For orders this only happens when [order locking](../Order/order-locking.md) is enabled for your tenant; without it, overlapping order writes do not fail, the last save wins.
*   Purchase order version conflict (optimistic concurrency on `VersionId`)

**What to do:** For a duplicate ID, use a different ID or update the existing entity. For `ResourceLocked`, wait for the `retryAfter` seconds in the response (or a short backoff) and retry. For a version conflict, read the latest version of the entity, apply your changes, and retry.

### 429 Too Many Requests

You've exceeded the rate limit.

**Common causes:**

*   Too many concurrent requests (default: 20 per API user, 40 per tenant)
*   Token bucket exhausted (12,000 capacity, refills 1,000 every 10 seconds)
*   Too many concurrent batch operations (limit: 4)

**What to do:** Implement exponential backoff with jitter. Reduce parallelism. For sustained high throughput, contact Omnium about custom rate limits. See [Rate Limits](../Environments/rate-limits.md) for details.

### 500 Internal Server Error

An unexpected error occurred on the server.

**What to do:** Note the timestamp and any request details, then check the event log for error entries around that time. If the issue persists, [contact support](../support.md) with the details.

* * *

## Troubleshooting Integration Issues

### Orders not syncing to ERP

1.  **Check the event log** for export errors — filter by className "Order" and look for error events
2.  **Verify connector credentials** — expired or rotated credentials are the most common cause
3.  **Check the scheduled task** — is the export task enabled and running on schedule?
4.  **Check the order status** — some export tasks only process orders in specific statuses
5.  **Check market/store filtering** — the connector may be restricted to specific markets via `EnabledForMarkets`

### Products not appearing after import

1.  **Verify the API response** — did the create/update call return a success status?
2.  **Check product status** — is the product set to active?
3.  **Check market assignment** — does the product have the correct `marketIds`?
4.  **Check store assortment** — if using store-based assortments, is the product's category assigned to the store?
5.  **Wait for indexing** — search-index indexing has a short delay (typically under a second, but can be longer during bulk operations)

### Inventory out of sync

1.  **Check the inventory import task** — is it running and when did it last succeed?
2.  **Compare with source system** — use the inventory API to check the current values in Omnium
3.  **Check warehouse assignment** — is the inventory on the correct warehouse (store with `IsWarehouse: true`)?
4.  **Check for reservations** — active orders may have reserved stock, reducing available quantity
5.  **Virtual stock locations** — if using VSLs, check that allocation rules are distributing inventory correctly

### Webhook deliveries failing

1.  **Check event log** — look for subscription result events showing delivery failures
2.  **Verify endpoint** — is your webhook URL accessible from the internet?
3.  **Check response** — webhooks expect a 2xx response within a reasonable timeout
4.  **Check authentication** — if your endpoint requires auth headers, verify they're configured in the subscription
5.  **Retry behavior** — failed webhooks are retried with increasing delays (1s, 5s, 15s)

### Scheduled task not running

1.  **Check if disabled** — `IsDisabled: true` prevents execution
2.  **Check cron schedule** — verify the schedule expression is correct
3.  **Check if already running** — tasks won't start a new execution if one is already in progress
4.  **Check the environment** — if Dev and Test share data, only run tasks in one environment to avoid duplicates
5.  **Manual trigger** — try running the task manually from the UI to see if it produces errors

* * *

## Getting Help

When you encounter an issue you can't resolve:

1.  **Check the event log** for errors around the time the issue occurred
2.  **Search this documentation** for the specific error or topic
3.  **Contact support** at [help.omnium.no](https://help.omnium.no/) with:
    *   Your tenant name and environment
    *   A detailed description of the issue
    *   Steps to reproduce
    *   Relevant IDs (order IDs, product IDs, etc.)
    *   Screenshots and API request/response details

For urgent matters, call [+47 22 12 01 01](tel:+4722120101).

See the [Support](../support.md) page for guidelines on writing effective support requests.

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| API authentication | [API Developer Guide](../GettingStartedWithAPI/api-developer-guide.md) |
| Roles and permissions | [Authentication & Roles](../Security/authentication-roles.md) |
| API security best practices | [API Security](../Security/api-security.md) |
| Rate limits and throttling | [Rate Limits](../Environments/rate-limits.md) |
| Event structure and operation IDs | [Events](events.md) |
| Monitoring and maintenance | [Operations](../Environments/operations.md) |
| Support request guidelines | [Support](../support.md) |
