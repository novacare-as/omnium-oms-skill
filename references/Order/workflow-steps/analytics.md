# Analytics Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/analytics

> Workflow steps for analytics and reporting data indexing.

## Overview

Analytics steps handle indexing order data for analytics, reporting, and business intelligence purposes. They run asynchronously to avoid impacting order processing performance.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Analytics Indexing](analytics/analytics-indexing.md) | `AnalyticsIndexing` | Index order data for analytics |

## Common Use Cases

### Order Lifecycle Analytics

Index orders at key points for complete analytics:

```
New Order → AnalyticsIndexing (capture initial order)
↓
Completed → AnalyticsIndexing (capture final state)
```

## Design Principles

Analytics steps follow these principles:

1.  **Non-blocking**: Run in background, don't delay order processing
2.  **Fire-and-forget**: Failures don't impact order workflow
3.  **Idempotent**: Safe to run multiple times on same order

## Data Indexed

The analytics indexing step captures order line data including:

*   Product information
*   Quantities and prices
*   Order metadata
*   Customer information
*   Timestamps

This data feeds into analytics dashboards and reports for business insights.
