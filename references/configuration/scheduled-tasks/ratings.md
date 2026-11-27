# Rating Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/ratings

> Background jobs for product rating notifications and verification

The Rating scheduled tasks handle notifications related to product ratings that require attention or verification.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Verify Rating Notification](ratings/verify-rating-notification.md) | Send notifications for ratings that require staff verification | Delta |

* * *

## Overview

Rating tasks help manage the product rating verification workflow:

1.  **Verification Notifications** - Alert staff when new ratings need review

* * *

## Common Use Cases

### Rating Moderation

Use Verify Rating Notification to notify staff when product ratings meet criteria for manual review, such as low scores or flagged content.

* * *

## Configuration Requirements

Rating notifications require configuration in tenant settings:

*   `productSettings.productRatingSettings.ratingNeedsVerificationThreshold` - Rating score threshold triggering verification
*   `productSettings.productRatingSettings.verifyRatingNotificationDelayInMinutes` - Delay before sending notification (default: 5 minutes)

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Notification tasks | `*/15 * * * *` (every 15 minutes) | Timely alerts for rating reviews |
