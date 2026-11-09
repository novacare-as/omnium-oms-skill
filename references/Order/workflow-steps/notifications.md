# Notification Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/notifications

> Workflow steps for sending customer notifications via email and SMS.

## Overview

Notification steps handle customer communication during order processing. They send emails and SMS messages based on configured templates and order status.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Notification](notifications/notification.md) | `Notification` | Send email and SMS notifications |

## Common Use Cases

### Order Lifecycle Notifications

Send notifications at key order milestones:

```
New Order → Notification (Order Confirmation)
↓
Ship → Notification (Shipping Confirmation)
↓
Completed → Notification (Delivery Confirmation)
```

### Click & Collect Flow

Notify customers when orders are ready:

```
ReadyForPickup → Notification (Ready for Pickup)
```

### Cancellation Communication

Inform customers of cancellations:

```
OrderCanceled → Notification (Cancellation Notice)
```

## Notification Templates

Notifications are driven by templates configured in the system. Templates define:

*   **Trigger conditions**: Which order statuses trigger the notification
*   **Channel**: Email, SMS, or both
*   **Content**: Message templates with order data placeholders
*   **Recipients**: Customer, store staff, or custom recipients

## Best Practices

1.  **Configure templates before workflow**: Ensure notification templates exist for each status where notifications are needed
2.  **Handle missing contact info gracefully**: The step returns warning (not error) if no messages can be sent
3.  **Test notifications**: Use test mode to verify workflow without sending actual messages
