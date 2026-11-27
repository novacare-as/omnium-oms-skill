# Notification

Source: https://docs.omnium.no/docs/Projects/project-actions/notification

> Configure the Notification project action to send email or SMS notifications when a project reaches a workflow step.

## Overview

The **Notification** action sends the notifications configured on the current workflow step. Notifications are defined on the project type step itself (not on the action), so this action simply triggers delivery of whatever is configured there.

Notifications can be sent immediately or after a configurable delay.

**Key behaviours:**

*   Notifications with no delay (or less than 1 minute) are enqueued immediately
*   Notifications with a `SendAfter` delay are added to `PendingNotificationIds` on the project and sent later
*   The action always returns `Success` — it does not fail if a notification is misconfigured

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `Notification` |
| **Group** | Project Actions |

* * *

## Configuration

The action itself requires no properties. Notifications are configured on the workflow step under `notifications`.

```json
{
  "name": "Notification",
  "active": true
}
```

### All Available Options

| Property | Required | Type | Description |
| --- | --- | --- | --- |
| **name** | Yes | string | Must be `Notification` |
| **TranslateKey** | No | string | Translation key shown in the UI action log |

### Notification configuration on the workflow step

Notifications are defined on the project type status, not on the action:

```json
{
  "notifications": [
    {
      "notificationId": "your-notification-id"
    }
  ]
}
```

To send a notification with a delay:

```json
{
  "notifications": [
    {
      "notificationId": "your-notification-id",
      "sendAfter": "00:30:00"
    }
  ]
}
```

* * *

## Behaviour

| Condition | Result |
| --- | --- |
| No notifications configured on the step | Success (nothing sent) |
| Notification with no delay | Enqueued immediately |
| Notification with `SendAfter` delay | Added to `PendingNotificationIds`, sent later |

* * *

## Related

*   [Project Actions overview](../project-actions.md)
