# Analytics Interaction

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/analytics-interaction

> Index customer interaction analytics from orders

## Overview

This task indexes customer interaction analytics by processing orders and creating analytics records for interaction tracking and reporting purposes. It enables analysis of customer engagement patterns and order-related interactions.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AnalyticsInteractionScheduledTask` |
| **Group** | Analytics |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Customer interaction tracking and analysis
*   Order-based engagement metrics
*   Customer journey analytics
*   Interaction pattern reporting

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Retrieves all orders modified since the last run
2.  Extracts interaction data from each order (customer touchpoints, order events)
3.  Creates or updates interaction analytics records
4.  Indexes the analytics data for reporting

### Prerequisites

*   Orders must exist in the system
*   Analytics indexing services must be configured

### Side Effects

*   Updates the analytics interaction index
*   May increase storage usage as interaction records accumulate

* * *

## Example Configuration

```json
{
    "ImplementationType": "AnalyticsInteractionScheduledTask",
    "Schedule": "*/15 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 15 minutes (`*/15 * * * *`) to maintain near real-time interaction analytics while balancing system resources.

* * *

## Related Tasks

*   [Analytics Order Line](analytics-order-line.md) - Complementary order analytics
*   [Add Stats Orders](add-stats-orders.md) - Order statistics queue
