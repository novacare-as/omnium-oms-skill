# Order Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders

> Background jobs for order lifecycle management, allocation, automation, and cleanup

The Order scheduled tasks manage the entire order lifecycle, from inventory allocation and payment settlement through to status automation and cleanup of old orders.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Allocate Order to Purchase Order](orders/allocate-order-to-purchase-order.md) | Allocate unreserved order lines to incoming purchase orders | Delta |
| [Cancel Expired Click and Collect](orders/cancel-expired-click-collect.md) | Cancel click and collect orders that exceed time limits | Delta |
| [Cancel Expired Orders](orders/cancel-expired-orders.md) | Cancel orders that have exceeded their expiration threshold | Delta |
| [Cancel Orders with Expired Pickup Deadline](orders/cancel-orders-with-expired-pickup-deadline.md) | Cancel orders where the customer pickup deadline has passed | Delta |
| [Create Draft Purchase Orders](orders/create-draft-purchase-orders.md) | Create and refresh one draft purchase order per supplier from reorder suggestions | Delta |
| [Delete Old Orders](orders/delete-old-orders.md) | Permanently remove orders older than the configured retention period | Delta |
| [Order Automation](orders/order-automation.md) | Automatically transition order status based on configurable conditions | Delta |
| [Payment Settlements](orders/payment-settlements.md) | Retrieve and record payment settlement data from payment providers | Delta |
| [Try Reallocate Orders](orders/try-reallocate-orders.md) | Process orders past their reallocation deadline | Delta |
| [Try Reserve Order Lines](orders/try-reserve-order-lines.md) | Reserve inventory for unreserved order lines using FIFO logic | Delta |
| [Update Order Status](orders/update-order-status.md) | Process scheduled status transitions for orders | Delta |
| [Update Overdue Orders](orders/update-overdue-orders.md) | Mark orders as delayed when they pass their expected delivery date | Delta |
| [Update Reservable Orders](orders/update-reservable-orders.md) | Update the reservable status flag on orders | Delta |

* * *

## Overview

Order tasks work together to manage the complete order lifecycle in Omnium:

1.  **Inventory Allocation** - Reserve stock for orders and allocate to purchase orders
2.  **Payment Processing** - Track payment settlements from external providers
3.  **Status Automation** - Automatically progress orders through workflow states
4.  **Lifecycle Management** - Handle expirations, cancellations, and cleanup
5.  **Reallocation** - Move inventory between orders when necessary

* * *

## Common Use Cases

### Inventory Reservation

Use Try Reserve Order Lines to ensure older orders are prioritized for available inventory using FIFO logic.

### Purchase Order Allocation

Enable Allocate Order to Purchase Order to automatically assign unreserved order lines to incoming stock from suppliers.

### Status Automation

Configure Order Automation to automatically progress orders based on conditions like payment status and inventory reservation.

### Click and Collect Management

Use Cancel Expired Click and Collect to automatically handle orders not picked up within the allowed time window.

### Data Retention

Configure Delete Old Orders with an appropriate retention period to comply with data retention policies.

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Inventory tasks | `*/15 * * * *` (every 15 minutes) | Keep allocations current |
| Payment tasks | `*/30 * * * *` (every 30 minutes) | Sync settlement data |
| Automation tasks | `*/10 * * * *` (every 10 minutes) | Responsive status updates |
| Cleanup tasks | `0 3 * * 0` (weekly at 3 AM Sunday) | Heavy operation, run off-peak |
| Expiration tasks | `*/30 * * * *` (every 30 minutes) | Timely cancellation handling |
