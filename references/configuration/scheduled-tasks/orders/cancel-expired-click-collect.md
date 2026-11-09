# Cancel Expired Click and Collect

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/orders/cancel-expired-click-collect

> Automatically cancel click and collect orders that exceed their time limits

## Overview

This task manages the expiration of click and collect orders by monitoring time limits at different stages of the pickup process. It handles three types of expirations: store processing limits (before the order is ready), customer pickup limits (after the order is ready), and transit limits (for orders being transferred between locations).

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `CancelExpiredClickCollectScheduledTask` |
| **Group** | Orders |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Automatic cancellation of click and collect orders not prepared in time
*   Automatic handling of orders not picked up by customers
*   Transit timeout management for inter-store transfers
*   Release of reserved inventory from expired pickup orders

* * *

## Configuration Properties

This task has no scheduled task properties. It reads its configuration from the click and collect settings on the tenant. The time limits are set there, and so are the order statuses the task assigns.

### Time limits

The store pick limit and the customer pickup deadline are **empty by default**, and an empty limit means the task does nothing for that expiry type. A new tenant therefore expires nothing until you set them. The transit limit and the maximum expiry age are the exceptions: they fall back to 30 days and 90 days.

| Setting | Default | Counted from | How it is counted |
| --- | --- | --- | --- |
| `StorePickLimit` | Not set (`00:00:00`) | The time the order was received | Store opening hours only. The result is written to the order as `StorePickDate`. |
| `CustomerPickupDeadlineLimit` | Not set (`00:00:00`) | The time the order was received, or the time it became ready for pickup | Whole working days when the value has a day part, otherwise store opening hours. The result is written to the order as `CustomerPickupDeadline`. |
| `TransitLimit` | Not set, and the task then uses **30 days** | The time the order was created | Calendar time, not opening hours. |
| `MaxExpiryAgeDays` | Not set, and the task then uses **90 days** | The deadline that was missed, or the order date for transit | Whole calendar days. A deadline that passed longer ago than this is out of reach of the task. |

A limit of zero is not "expire at once". A store pick limit or a customer pickup deadline of zero leaves the order with no deadline at all, so the task never picks the order up. `TransitLimit` behaves differently: no value means 30 days, not "no limit".

A store can carry its own values. Enable **Use store specific limits** on the store, under **Opening Hours**, and the store's `StorePickLimit` and `CustomerPickupDeadlineLimit` replace the tenant values for orders in that store.

An order that is still in `Transit` **more than 14 days after it was created** is cancelled as a whole order, including its open shipments. With the default 30 day transit limit every transit order the task finds is already past this point.

#### The age fail-safe

`MaxExpiryAgeDays` protects a tenant that sets the deadlines for the first time. Without it the first run reaches every click and collect order that ever missed its deadline, and cancels up to 1000 orders per expiry type, each with a cancellation notification to the customer. With the default the task never looks further back than 90 days.

Each expiry type bounds the date it already tests: the store pick date, the customer pickup deadline, and, for transit, the order date. The order date is deliberately not used for the first two, because `SetShipmentOrOrderReadyForPickup` rebases the customer deadline when the order becomes ready for pickup. An order placed a year ago as a pre-order, made ready yesterday and not collected, is therefore still expired.

Raise the value only when you mean to reach further back, and expect a large run when you do.

`TransitLimit` must stay below `MaxExpiryAgeDays`. The transit search asks for orders older than the transit limit and younger than the maximum age, so a transit limit of 120 days against the default 90 days leaves an empty window, and no transit order expires.

### Target statuses

`ClickAndCollectSettings.ExpiredOrderStatuses` maps each limit to the order status the task sets. An entry that is missing or empty falls back to its default, so a tenant that has never set the map keeps the original behaviour.

| Key | Default status | Applies to |
| --- | --- | --- |
| `ExceedingStoreLimit` | `Expired` | Orders the store did not prepare before the store pick deadline |
| `ExceedingCustomerLimit` | `NotCollected` | Orders ready for pickup that the customer did not collect in time |
| `ExceedingTransitLimit` | `Expired` | Orders that stayed in transit past the transit limit |

Set the statuses in **Configuration → Settings → Orders → Click and Collect**, in the **Deadline** card. Each of the three limits has its own status selector, and the placeholder shows the default that applies when nothing is selected.

The same setting as JSON:

```
"clickAndCollectSettings": {
    "expiredOrderStatuses": {
        "ExceedingCustomerLimit": "OrderCanceled"
    }
}
```

The status you select must exist on the click and collect order type, with the workflow steps you want the cancellation to run. The task also uses the status as the cancellation reason on the order lines.

* * *

## Behavior

### What It Does

1.  Searches for click and collect orders in eligible statuses (New, In Progress, Picking Postponed)
2.  Identifies orders exceeding their configured time limits:
    *   **Store Limit**: Orders the store has not prepared within the allowed time
    *   **Customer Limit**: Orders ready for pickup but not collected by the customer
    *   **Transit Limit**: Orders in transit between locations for longer than `TransitLimit`, or 30 days when it is not set
3.  For orders with multiple shipments, processes each shipment independently
4.  Sets the status configured for the type of expiration, or the default when none is configured:
    *   `Expired` for orders exceeding store limits
    *   `NotCollected` for orders exceeding customer pickup limits
    *   `Expired` for orders exceeding transit limits
5.  For transit-expired orders, tags the order and either cancels or transitions to "Ready for Pickup" status

### Status Handling

*   **Single Shipment Orders**: The entire order is cancelled with the configured status
*   **Multi-Shipment Orders**: Individual shipments are cancelled while preserving other active shipments. The shipment is moved to the configured status even when the tenant setting `CancelOrderIfAllLineItemsCancelled` is off, so the order status is derived from its shipments
*   **Transit Orders**: Expired transit shipments are cancelled, and remaining open shipments are moved to "Ready for Pickup"

### Prerequisites

*   Click and collect order type must be configured, including every status the task assigns
*   At least one time limit must be set, on the tenant or on the store. Every limit is empty by default
*   Store opening hours must be set, because the store pick limit and the hour-based customer deadline are counted in opening hours
*   Orders must be in processable statuses

### Side Effects

*   Changes order status to the configured cancellation states (`Expired` and `NotCollected` by default)
*   Releases reserved inventory for cancelled items
*   Adds "TransitExpired" tag to transit-expired orders
*   Triggers workflow actions associated with cancellation status changes
*   May update shipment statuses independently of order status

* * *

## Example Configuration

```json
{
    "ImplementationType": "CancelExpiredClickCollectScheduledTask",
    "Schedule": "*/30 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run every 30 minutes (`*/30 * * * *`) to handle expirations in a timely manner. More frequent execution may be needed for stores with short pickup windows.

* * *

## Related Tasks

*   [Cancel Expired Orders](cancel-expired-orders.md) - General order expiration handling
*   [Update Overdue Orders](update-overdue-orders.md) - Mark orders as delayed
*   [Order Automation](order-automation.md) - Automate status transitions
