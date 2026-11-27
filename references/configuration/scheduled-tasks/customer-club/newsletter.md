# Newsletter

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/newsletter

> Process and send scheduled newsletters to customer segments

## Overview

This task processes newsletters that are ready for sending, segmenting customers based on configured filters and enqueuing email batches for delivery. It supports A/B testing for optimizing newsletter content.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `NewsletterScheduledTask` |
| **Group** | Customer Club |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   Scheduled newsletter delivery
*   Segmented email campaigns
*   A/B testing for email content
*   Bulk email processing

* * *

## Configuration Properties

This task has no configurable properties. Newsletters are configured individually through the Omnium UI.

* * *

## Behavior

### What It Does

1.  Searches for newsletters with "Ready" status and send date in the past
2.  Takes up to 10 newsletters per run for processing
3.  For each newsletter:
    *   Updates status to "In Progress"
    *   Processes additional recipients (direct email list)
    *   Retrieves customer segmentation filters
    *   Segments customers based on filters
    *   Enqueues email batches for async delivery

### A/B Testing Support

When A/B testing is enabled on a newsletter:

*   Calculates test group size based on percentage
*   Randomly assigns customers to Group A or Group B
*   Each group receives different content variants
*   Results can be analyzed to determine winning content

### Batch Processing

Newsletters are processed in batches to:

*   Manage memory usage for large segments
*   Enable progress tracking
*   Support parallel delivery processing

### Prerequisites

*   Newsletter must exist with "Ready" status
*   Send date must be in the past (or now)
*   Customer segmentation filters must be configured
*   Email gateway must be configured

### Side Effects

*   Updates newsletter status
*   Creates newsletter recipient records
*   Enqueues messages for email delivery

* * *

## Example Configuration

```json
{
    "ImplementationType": "NewsletterScheduledTask",
    "Schedule": "*/5 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run frequently (`*/5 * * * *` - every 5 minutes) to ensure newsletters are sent promptly when their scheduled time arrives.

* * *

## Related Tasks

*   [Add Stats Customers](../analytics/add-stats-customers.md) - Customer data for segmentation
*   [Set Interests Special](set-interests-special.md) - Interest-based segmentation
