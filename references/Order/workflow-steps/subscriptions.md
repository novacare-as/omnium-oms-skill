# Subscription Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/subscriptions

> Workflow steps for managing subscriptions and recurring orders.

## Overview

Subscription steps manage the creation and maintenance of customer subscriptions for recurring orders. They handle both initial subscription creation and order replacement when subscription orders are cancelled.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Create Subscriptions](subscriptions/create-subscriptions.md) | `CreateSubscriptions` | Create subscriptions from subscription products |
| [Create Replacement Subscription Orders](subscriptions/create-replacement-subscription-orders.md) | `CreateReplacementSubscriptionOrders` | Replace cancelled subscription orders |

## Common Use Cases

### Subscription Creation

Create subscriptions when orders with subscription products are placed:

```
New Order (with subscription product) → CreateSubscriptions → Continue
```

### Cancellation Handling

Ensure subscriptions continue when individual orders are cancelled:

```
OrderCanceled → CreateReplacementSubscriptionOrders → Archive
```

## Subscription Lifecycle

1.  **Order Placed**: Customer orders a subscription product
2.  **Subscription Created**: `CreateSubscriptions` creates the subscription record
3.  **Recurring Orders**: System generates pending orders based on subscription schedule
4.  **Order Cancelled**: If a pending order is cancelled, `CreateReplacementSubscriptionOrders` creates a new one
5.  **Subscription Ends**: When subscription is cancelled by customer or expires

## Configuration

Subscriptions require:

*   **Product Type**: Products must be marked with a subscription product type
*   **Subscription Service**: Backend service to manage subscription records
*   **Schedule Configuration**: Delivery frequency and timing settings
