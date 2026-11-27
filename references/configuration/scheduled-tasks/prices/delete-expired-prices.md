# Delete Expired Prices

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/prices/delete-expired-prices

> Remove product prices that have passed their expiration date

## Overview

This task deletes product prices that have expired beyond a configured threshold. It helps maintain search index performance and reduces storage by removing historical price data that is no longer needed for business operations.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `DeleteExpiredPricesScheduledTask` |
| **Group** | Prices |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Cleanup of expired promotional prices
*   Maintenance of price index performance
*   Reduction of storage costs
*   Compliance with data retention policies

* * *

## Configuration Properties

This task requires configuration in tenant settings:

| Setting | Location | Description |
| --- | --- | --- |
| `deleteExpiredPricesThreshold` | `productSettings.deleteExpiredPricesThreshold` | Number of days after expiration before prices are deleted |

The task will fail if this setting is not configured.

* * *

## Behavior

### What It Does

1.  Reads the `deleteExpiredPricesThreshold` from tenant settings
2.  Calculates the cutoff date (current date minus threshold days)
3.  Deletes all prices that expired before the cutoff date
4.  Reports the number of prices deleted

### Prerequisites

*   `productSettings.deleteExpiredPricesThreshold` must be configured in tenant settings
*   Product price service must be operational

### Side Effects

*   Permanently removes expired price records
*   Reduces price index size
*   Historical price data beyond threshold will not be available

* * *

## Example Configuration

First, ensure tenant settings include the threshold:

```json
{
    "productSettings": {
        "deleteExpiredPricesThreshold": 90
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "DeleteExpiredPricesScheduledTask",
    "Schedule": "0 3 * * 0",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run weekly during off-peak hours (`0 3 * * 0` - 3 AM Sunday). Price deletion can be a heavy operation, so running it during low-traffic periods is recommended.

* * *

## Related Tasks

*   [Delete Expired Cost Prices](delete-expired-cost-prices.md) - Clean up expired cost prices
