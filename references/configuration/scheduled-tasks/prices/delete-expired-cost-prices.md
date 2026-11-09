# Delete Expired Cost Prices

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/prices/delete-expired-cost-prices

> Remove product cost prices that have passed their expiration date

## Overview

This task deletes product cost prices that have expired beyond a configured threshold. It helps maintain system performance and reduces storage by removing historical cost price data that is no longer needed for inventory valuation or reporting.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `DeleteExpiredCostPricesScheduledTask` |
| **Group** | Prices |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Cleanup of historical supplier cost data
*   Maintenance of cost price index performance
*   Reduction of storage costs
*   Compliance with data retention policies

* * *

## Configuration Properties

This task requires configuration in tenant settings:

| Setting | Location | Description |
| --- | --- | --- |
| `deleteExpiredCostPricesThreshold` | `productSettings.deleteExpiredCostPricesThreshold` | Number of days after expiration before cost prices are deleted |

The task will fail if this setting is not configured.

* * *

## Behavior

### What It Does

1.  Reads the `deleteExpiredCostPricesThreshold` from tenant settings
2.  Calculates the cutoff date (current date minus threshold days)
3.  Deletes all cost prices that expired before the cutoff date
4.  Reports the number of cost prices deleted

### Prerequisites

*   `productSettings.deleteExpiredCostPricesThreshold` must be configured in tenant settings
*   Product cost price service must be operational

### Side Effects

*   Permanently removes expired cost price records
*   Reduces cost price index size
*   Historical cost price data beyond threshold will not be available for reporting

* * *

## Example Configuration

First, ensure tenant settings include the threshold:

```json
{
    "productSettings": {
        "deleteExpiredCostPricesThreshold": 365
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "DeleteExpiredCostPricesScheduledTask",
    "Schedule": "0 4 * * 0",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run weekly during off-peak hours (`0 4 * * 0` - 4 AM Sunday). Cost price deletion can be a heavy operation, so running it during low-traffic periods is recommended.

* * *

## Related Tasks

*   [Delete Expired Prices](delete-expired-prices.md) - Clean up expired sales prices
