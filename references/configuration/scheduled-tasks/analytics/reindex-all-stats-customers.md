# Reindex All Stats Customers

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/reindex-all-stats-customers

> Rebuild the entire customer statistics index from scratch

## Overview

This task performs a complete rebuild of the customer statistics index by deleting the existing index and regenerating it from scratch. This is a heavy operation intended for data consistency recovery or initial setup, not regular use.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ReindexAllStatsCustomersScheduledTask` |
| **Group** | Analytics |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Initial setup of customer statistics
*   Recovery from data inconsistencies
*   Post-migration data rebuild
*   Periodic full consistency check

**Warning**: This task deletes and rebuilds the entire customer statistics index. Use sparingly and schedule during maintenance windows.

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Deletes the entire customer statistics index
2.  Processes all customers in the system
3.  Regenerates statistics for each customer
4.  Rebuilds the index from scratch

### Destructive Operation

This task performs a destructive delete of the existing index before rebuilding. During execution:

*   Customer statistics will be temporarily unavailable
*   Dependent reports and dashboards may show incomplete data
*   The operation cannot be interrupted safely

### Prerequisites

*   Sufficient system resources for full reindex
*   Scheduled during low-traffic periods
*   Customer data must exist in the system

### Side Effects

*   Temporarily removes all customer statistics
*   Resource-intensive operation affecting system performance
*   May take significant time depending on customer count

* * *

## Example Configuration

```json
{
    "ImplementationType": "ReindexAllStatsCustomersScheduledTask",
    "Schedule": "0 2 1 * *",
    "IsDisabled": true
}
```

* * *

## Recommended Schedule

Run monthly at most (`0 2 1 * *` - 2:00 AM on the 1st of each month), and keep disabled unless specifically needed. For regular updates, use the delta Add Stats Customers task instead.

* * *

## Related Tasks

*   [Add Stats Customers](add-stats-customers.md) - Incremental updates (preferred)
*   [Add Stats Orders](add-stats-orders.md) - Order statistics queue
