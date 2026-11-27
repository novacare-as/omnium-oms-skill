# Verify Rating Notification

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/ratings/verify-rating-notification

> Send notifications for product ratings that require staff verification

## Overview

This task identifies product ratings that require attention and sends notifications to staff for verification. It supports a moderation workflow where low-scoring or flagged ratings can be reviewed before being published or acted upon.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `VerifyRatingNotificationScheduledTask` |
| **Group** | Ratings |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Notification of low product ratings for customer service follow-up
*   Moderation workflow for product reviews
*   Alerts for ratings that may indicate product or service issues
*   Staff review of ratings before publication

* * *

## Configuration Properties

This task requires configuration in tenant settings:

| Setting | Location | Description |
| --- | --- | --- |
| `ratingNeedsVerificationThreshold` | `productSettings.productRatingSettings.ratingNeedsVerificationThreshold` | Rating score at or below which verification is required |
| `verifyRatingNotificationDelayInMinutes` | `productSettings.productRatingSettings.verifyRatingNotificationDelayInMinutes` | Minutes to wait before sending notification (default: 5) |

If `ratingNeedsVerificationThreshold` is not configured, the task will complete successfully without processing any ratings.

* * *

## Behavior

### What It Does

1.  Checks if rating verification is configured in tenant settings
2.  Calculates the time window based on the notification delay setting
3.  Searches for product ratings created within the window that require attention
4.  Sends a verification notification for each qualifying rating
5.  Logs the number of notifications sent

### Prerequisites

*   Rating verification threshold must be configured in tenant settings
*   Rating notification service must be configured
*   Email or notification templates must be set up

### Side Effects

*   Sends notifications (typically email) to configured recipients
*   Does not modify the rating records themselves
*   Notifications may trigger staff actions on ratings

* * *

## Example Configuration

First, ensure tenant settings include the rating configuration:

```json
{
    "productSettings": {
        "productRatingSettings": {
            "ratingNeedsVerificationThreshold": 3,
            "verifyRatingNotificationDelayInMinutes": 10
        }
    }
}
```

Then configure the scheduled task:

```json
{
    "ImplementationType": "VerifyRatingNotificationScheduledTask",
    "Schedule": "*/15 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 15 minutes (`*/15 * * * *`) to ensure timely notifications while avoiding excessive processing. The notification delay setting prevents notifications for ratings that are quickly updated or corrected.

* * *

## Related Tasks

This task works independently but integrates with your broader customer feedback management workflow.
