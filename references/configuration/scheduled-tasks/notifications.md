# Notification Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/notifications

> Background jobs for processing and sending pending notifications

The Notification scheduled tasks handle the processing and delivery of pending notification messages across various channels.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Process Notifications](notifications/notification.md) | Retrieve and send pending notification messages | Delta |

* * *

## Overview

Notification tasks manage the message delivery pipeline:

1.  **Message Processing** - Find and enqueue pending notifications for delivery

* * *

## Common Use Cases

### Email Delivery

Use Process Notifications to send pending email notifications such as order confirmations, shipping updates, and promotional messages.

### Multi-Channel Notifications

Enable this task to process notifications across various channels (email, SMS, push) based on your notification configuration.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Notification processing | `*/5 * * * *` (every 5 minutes) | Quick delivery of pending messages |
