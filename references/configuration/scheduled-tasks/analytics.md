# Analytics Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/analytics

> Background jobs for statistics generation, data aggregation, and reporting

The Analytics scheduled tasks are responsible for generating statistics, aggregating data for reporting, and maintaining analytics indices used by dashboards and business intelligence features.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Analytics Interaction](analytics/analytics-interaction.md) | Index customer interaction analytics from orders | Delta |
| [Analytics Inventory](analytics/analytics-inventory.md) | Index inventory analytics data | Delta |
| [Analytics Order Line](analytics/analytics-order-line.md) | Index order line analytics for changed orders | Delta |
| [Analytics Reorder Suggestions](analytics/analytics-reorder-suggestions.md) | Generate product reorder suggestions | Full |
| [Analytics Reorder Suggestions Delta](analytics/analytics-reorder-suggestions-delta.md) | Update reorder suggestions based on inventory changes | Delta |
| [Add Stats Orders](analytics/add-stats-orders.md) | Queue changed orders for statistics processing | Delta |
| [Add Stats Customers](analytics/add-stats-customers.md) | Queue changed customers for statistics processing | Delta |
| [Reindex All Stats Customers](analytics/reindex-all-stats-customers.md) | Rebuild entire customer statistics index | Full |

* * *

## Overview

Analytics tasks work together to maintain the statistics and reporting infrastructure in Omnium:

1.  **Interaction Analytics** - Tracks customer interactions and order patterns
2.  **Inventory Analytics** - Monitors inventory levels and movements over time
3.  **Order Line Analytics** - Provides detailed order line data for sales analysis
4.  **Reorder Suggestions** - Analyzes sales patterns to recommend inventory replenishment
5.  **Stats Queues** - FIFO queues for asynchronous statistics processing

* * *

## Common Use Cases

### Sales Reporting

Enable order line analytics to provide data for sales reports, revenue tracking, and performance dashboards.

### Inventory Planning

Use reorder suggestions tasks to automatically generate purchase recommendations based on historical sales data.

### Customer Analytics

Enable stats customer processing to maintain customer lifetime value calculations and purchase pattern analysis.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Delta tasks | `*/15 * * * *` (every 15 minutes) | Keep analytics near real-time |
| Full reindex tasks | `0 3 * * 0` (weekly at 3 AM Sunday) | Heavy operation, run off-peak |
| Stats queue tasks | `*/5 * * * *` (every 5 minutes) | Process queue items promptly |
