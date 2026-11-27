# Notification Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/notifications

> Workflow steps for sending return-related notifications to customers.

## Overview

Notification workflow steps send communications to customers about their return status. They support email and SMS notifications through configured notification providers.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Notification](notifications/notification.md) | `Notification` | Send email/SMS notification about return status |

## Notification Configuration

Notifications require a configured notification connector. The step uses templates defined in the notification system to format messages with return details.

Common notification points:

*   Return created (New status)
*   Return received
*   Refund processed (Completed status)
