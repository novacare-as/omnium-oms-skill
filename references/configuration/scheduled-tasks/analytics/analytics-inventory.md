# Analytics Inventory

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/analytics-inventory

> Index inventory analytics data for reporting and dashboards

## Overview

This task indexes inventory-related analytics with a rolling 7-day lookback window. It tracks inventory changes over time for analytics dashboards and reporting purposes.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AnalyticsInventoryScheduledTask` |
| **Group** | Analytics |
| **Type** | Delta |
| **Minimum Interval** | 100 minutes |

* * *

## When to Use

Enable this task when you need:

*   Historical inventory level tracking
*   Inventory movement analytics
*   Stock level trend reporting
*   Warehouse performance dashboards

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Determines the start date (either last run time or 7 days ago, whichever is more recent)
2.  Retrieves inventory data changed within that window
3.  Indexes the inventory analytics for reporting
4.  Updates trend calculations

### Prerequisites

*   Inventory data must exist in the system
*   Analytics indexing services must be configured

### Data Window Limitation

The task enforces a maximum 7-day lookback window. If more than 7 days have passed since the last run, it will only process the last 7 days of data. This prevents excessive processing after extended downtime.

### Side Effects

*   Updates the analytics inventory index
*   Historical data beyond 7 days may be missing if the task was not running

* * *

## Example Configuration

```json
{
    "ImplementationType": "AnalyticsInventoryScheduledTask",
    "Schedule": "*/30 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 30 minutes (`*/30 * * * *`) to capture inventory movements while maintaining reasonable system load.

* * *

## Related Tasks

*   [Inventory Value](../inventory/inventory-value.md) - Inventory valuation snapshots
*   [Analytics Reorder Suggestions](analytics-reorder-suggestions.md) - Uses inventory data for suggestions
