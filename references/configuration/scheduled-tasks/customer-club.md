# Customer Club Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club

> Background jobs for loyalty program management, points, birthdays, and member notifications

The Customer Club scheduled tasks manage all aspects of the loyalty program, including point expiration, birthday rewards, membership lifecycle, and member notifications.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Approve Membership Reminder](customer-club/approve-membership-reminder.md) | Send reminders to members who haven't approved consents | Delta |
| [Birthday Points](customer-club/birthday-points.md) | Award birthday points and send notifications | Delta |
| [Delete Expired Points](customer-club/delete-expired-points.md) | Remove expired loyalty points from member accounts | Full |
| [Delete Inactive Members](customer-club/delete-inactive-members.md) | Remove or deactivate members without consent approval | Full |
| [Expire Soon Notification](customer-club/expire-soon-notification.md) | Notify members about points expiring soon | Full |
| [Monthly Report](customer-club/monthly-report.md) | Generate and email monthly membership statistics report | Full |
| [Point Balance Notification](customer-club/point-balance-notification.md) | Notify members when points reach a threshold | Delta |
| [Set Interests Special](customer-club/set-interests-special.md) | Automatically assign interests to members based on store | Delta |
| [Newsletter](customer-club/newsletter.md) | Process and send scheduled newsletters to segments | Full |

* * *

## Overview

Customer Club tasks maintain the health and engagement of your loyalty program:

1.  **Point Management** - Handle point expiration, notifications, and balance alerts
2.  **Member Lifecycle** - Manage consent reminders, inactive member cleanup
3.  **Engagement** - Birthday rewards, newsletters, and personalized communications
4.  **Reporting** - Monthly statistics for program performance tracking

* * *

## Prerequisites

Most Customer Club tasks require the following tenant settings to be configured:

*   `CustomerClubSettings.IsEnabled` must be `true`
*   Specific settings for each task (documented on individual task pages)
*   Email notification templates configured for member communications

* * *

## Recommended Schedules

| Task | Recommended Schedule | Reason |
| --- | --- | --- |
| Birthday Points | `0 6 * * *` (6 AM daily) | Award points early in the day |
| Delete Expired Points | `0 1 * * *` (1 AM daily) | Clean up during off-peak hours |
| Expire Soon Notification | `0 8 * * *` (8 AM daily) | Send during business hours |
| Monthly Report | `0 7 1 * *` (7 AM on 1st) | Generate after month-end |
| Newsletter | `*/5 * * * *` (every 5 min) | Process scheduled newsletters promptly |
| Other tasks | `0 2 * * *` (2 AM daily) | Run during off-peak hours |
