# Add Stats Orders

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics/add-stats-orders

> Queue changed orders for asynchronous statistics processing

## Overview

This task identifies orders that have been modified and adds them to the statistics processing queue. The queue is processed asynchronously using a FIFO (First In, First Out) approach, ensuring order statistics are updated efficiently without impacting real-time operations.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `AddStatsOrdersScheduledTask` |
| **Group** | Analytics |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Order statistics and metrics
*   Sales performance tracking
*   Order-based reporting
*   Asynchronous statistics processing

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Queries for all orders modified since the last run
2.  For each modified order, adds it to the statistics queue
3.  Processes orders in batches for efficiency
4.  Reports the number of orders queued vs total changed orders

### Queue Processing

Orders are added to a FIFO queue for asynchronous processing. This decouples the detection of changes from the actual statistics calculation, improving system responsiveness.

### Prerequisites

*   Orders must exist in the system
*   Statistics services must be configured

### Side Effects

*   Adds entries to the stats order queue
*   Queue will grow if processing cannot keep up with changes

* * *

## Example Configuration

```json
{
    "ImplementationType": "AddStatsOrdersScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 5 minutes (`*/5 * * * *`) to keep the statistics queue current with order changes.

* * *

## Related Tasks

*   [Add Stats Customers](add-stats-customers.md) - Customer statistics queue
*   [Analytics Order Line](analytics-order-line.md) - Order line analytics
