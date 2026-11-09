# Delete Inactive Members

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/customer-club/delete-inactive-members

> Remove or deactivate customer club members who haven't approved their consents

## Overview

This task handles members who have not approved their membership consents after a configured period. Depending on settings, it either permanently deletes the membership or ends it while preserving the data.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CustomerClubDeleteInactiveMembersTask` |
| **Group** | Customer Club |
| **Type** | Full |

* * *

## When to Use

Enable this task when you need:

*   GDPR compliance for consent-based memberships
*   Automatic cleanup of incomplete registrations
*   Data hygiene for your customer club
*   Enforcement of consent requirements

* * *

## Configuration Properties

### Required Settings

| Setting | Location | Description |
| --- | --- | --- |
| `DaysToPassBeforeInactiveMembersAreDeleted` | `CustomerClubSettings` | Days without consent before action is taken |

### Action Settings (one required)

| Setting | Location | Description |
| --- | --- | --- |
| `DeleteMembersWithoutConsents` | `CustomerClubSettings` | If `true`, permanently deletes memberships |
| `EndMembershipsForMembersWithoutConsents` | `CustomerClubSettings` | If `true`, sets membership end date instead of deleting |

* * *

## Behavior

### What It Does

1.  Finds members without approved consents who registered before the threshold date
2.  Depending on configuration, either:
    *   **Deletes**: Removes membership from both index and storage, exports customer data
    *   **Ends**: Sets membership end date to now, preserving the record
3.  Updates the linked private customer's `IsCustomerClubMember` flag to `false`
4.  Triggers customer data export (for GDPR compliance)

### Member Selection Criteria

Members are selected if they:

*   Have no membership end date (not already ended)
*   Have not approved their consents (`ApprovedConsents = false`)
*   Registered more than X days ago (configurable)

### Prerequisites

*   Customer Club settings must be configured
*   `DaysToPassBeforeInactiveMembersAreDeleted` must be set
*   Either delete or end membership setting must be enabled

### Side Effects

*   Deletes or updates membership records
*   Updates private customer records
*   May trigger data export for deleted members

* * *

## Example Configuration

```json
{
    "ImplementationType": "CustomerClubDeleteInactiveMembersTask",
    "Schedule": "0 3 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 3 * * *` - 3:00 AM). This is a cleanup task that doesn't need frequent execution.

* * *

## Related Tasks

*   [Approve Membership Reminder](approve-membership-reminder.md) - Send reminders first
