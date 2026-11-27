# Analytics Indexing

Source: https://docs.omnium.no/docs/Order/workflow-steps/analytics/analytics-indexing

> Index order data for analytics and reporting.

## Overview

The **Analytics Indexing** step indexes order line data for analytics and reporting purposes. It runs asynchronously in the background to avoid impacting order processing performance.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AnalyticsIndexing` |
| **Group** | Analytics |
| **Applicable Statuses** | New, Completed |
| **Hidden** | Yes |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Queues a background task to index the order
3.  Indexes order data asynchronously for analytics
4.  Returns success immediately (fire and forget)

### Prerequisites

*   Analytics indexing must be configured

### Side Effects

*   Order data indexed in analytics store (runs in background)
*   No blocking of workflow execution

## Business Cases

### When to Use

*   **Sales reporting**: Index order data for revenue analytics
*   **Product analytics**: Track product sales and trends
*   **Customer insights**: Enable customer purchase analysis

### Example Scenarios

**Scenario 1: New Order** Order placed. Analytics indexing queued in background.

**Scenario 2: Order Completed** Order completed. Final order data indexed for analytics.

**Scenario 3: Test Mode** Running in test mode. Indexing skipped, success returned.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Indexing queued | Success | Yes |
| Background task fails | No impact on workflow | Yes |

## Technical Notes

*   Uses fire-and-forget pattern for background processing
*   Indexing failures don't affect order workflow
*   Designed to be called at key order lifecycle points (New, Completed)

## Related Steps

*   [Export Order](../export/export-order.md) - Export order to external systems
