# Add Stats Customers

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/add-stats-customers

> Queue changed customers for asynchronous statistics processing

## Overview

This task identifies customers that have been created or modified (including those with changed orders) and adds them to the statistics processing queue. It enables customer lifetime value calculations, purchase pattern analysis, and customer segmentation.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AddStatsCustomersScheduledTask` |
| **Group** | Analytics |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Customer lifetime value (CLV) calculations
*   Purchase pattern analysis
*   Customer segmentation and scoring
*   Customer-level reporting and analytics

* * *

## Configuration Properties

This task has no configurable properties, but requires a tenant setting to be enabled.

### Required Setting

This task only runs if the "Use Stats Customer Queues" feature is enabled in tenant settings. If this setting is not enabled, the task will return success without processing any data.

* * *

## Behavior

### What It Does

1.  Checks if stats customer queues feature is enabled
2.  Finds customers created or modified since the last run
3.  Finds orders modified since the last run and extracts their customer IDs
4.  Combines and deduplicates the customer lists
5.  Adds all affected customers to the statistics queue

### Customer Detection

The task detects customers needing statistics updates through two mechanisms:

*   **Direct changes**: Customers whose profile was created or modified
*   **Order changes**: Customers who have orders that were modified (captures purchase activity)

### Prerequisites

*   "Use Stats Customer Queues" feature must be enabled in tenant settings
*   Customer and order data must exist in the system

### Side Effects

*   Adds entries to the stats customer queue
*   Queue will grow if processing cannot keep up with changes

* * *

## Example Configuration

```json
{
    "ImplementationType": "AddStatsCustomersScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 5 minutes (`*/5 * * * *`) to keep customer statistics current. Align schedule with the Add Stats Orders task for consistent processing.

* * *

## Related Tasks

*   [Add Stats Orders](add-stats-orders.md) - Order statistics queue
*   [Reindex All Stats Customers](reindex-all-stats-customers.md) - Full customer stats rebuild
