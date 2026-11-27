# Approve Membership Reminder

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/approve-membership-reminder

> Send reminder emails to members who haven't approved their membership consents

## Overview

This task sends reminder emails to customer club members who have not approved their membership consents after a configured number of days. It helps ensure GDPR compliance by prompting members to complete their consent approval.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubApproveMembershipReminderScheduledTask` |
| **Group** | Customer Club |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   GDPR consent compliance reminders
*   Follow-up on incomplete registrations
*   Improved membership completion rates
*   Automated consent collection

* * *

## Configuration Properties

### Required Settings

| Setting | Location | Description |
| --- | --- | --- |
| `IsEnabled` | `CustomerClubSettings` | Must be `true` |
| `DaysToPassBeforeSendingApproveReminder` | `CustomerClubSettings` | Number of days after registration before sending reminder |

* * *

## Behavior

### What It Does

1.  Calculates the date range for members who registered X days ago (where X is configured)
2.  Finds members without approved consents who registered within that window
3.  Checks if a reminder has already been sent (stored in member properties)
4.  Sends reminder notification to eligible members
5.  Marks members as having received the reminder to prevent duplicates

### Member Selection Criteria

Members are selected if they:

*   Have no membership end date (active membership)
*   Have not approved their consents
*   Registered within the configured day range
*   Have not already received a reminder

### Prerequisites

*   Customer Club must be enabled
*   `DaysToPassBeforeSendingApproveReminder` must be configured
*   Email notification template must exist

### Side Effects

*   Sends email notifications to members
*   Marks the member as having received the reminder to prevent duplicate emails

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubApproveMembershipReminderScheduledTask",
    "Schedule": "0 9 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily at a reasonable hour (`0 9 * * *` - 9:00 AM) when members are likely to check their email.

* * *

## Related Tasks

*   [Delete Inactive Members](delete-inactive-members.md) - Removes members who never approve
