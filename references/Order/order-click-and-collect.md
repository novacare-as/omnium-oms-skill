# Click and Collect

Source: https://docs.omnium.no/docs/Order/order-click-and-collect

> Working with click and collect orders in Omnium.

## Click and Collect Orders

Click and Collect orders typically refer to orders without upfront payment that are picked up in-store. In Omnium, these orders are generally treated as product reservations rather than completed sales.

There are two available views for managaging Click and Collect orders in Omnium:

1.  **Click and Collect Order List**
2.  **Click and Collect Order Line List**

The Click and Collect view is designed as a simple interface for viewing, picking, and canceling Click and Collect orders.

Contact Omnium Support for a assitance on setting the correct version.

* * *

## Setting up Click And Collect

### Deadlines

Click and collect deadlines are configured in **Configuration → Settings → Orders → Click and Collect**, in the **Deadline** card.

| Setting | Default | What it limits | How it is counted |
| --- | --- | --- | --- |
| **Store pick limit** | Not set | How long the store has to pick the order | Opening hours only |
| **Customer pickup deadline** | Not set | How long the customer has to collect it | Opening hours, or whole working days |
| **Extended pick limit** | Not set | Added to the pick deadline when picking is postponed | Opening hours, counted from the current pick deadline |
| **Transit limit** | 30 days | How long an order may stay in transit between stores | Calendar time from the order date |
| **Ignore expiries older than** | 90 days | How far back the cancellation task looks | Whole calendar days from the missed deadline |

A store can use its own values instead. Enable **Use store specific limits** in the **Edit Store** view under **Opening Hours**, and the store's own pick limit, extended pick limit and customer pickup deadline replace the tenant's. The transit limit is always the tenant's.

Opening hours are read in the time zone of the store. A store in another time zone than the tenant needs a time zone override, see [Formatting settings](../configuration/formatting-settings.md#time-zone).

#### Counted in hours and minutes

Time outside opening hours does not count. The limit runs while the store is open, pauses at closing, and picks up again at the next opening.

> A store open 10:00–21:00 gets an order on **Wednesday at 12:00** with a **24 hour** pick limit. Wednesday spends 9 hours, Thursday 11, and the remaining 4 run from Friday's opening. The deadline is **Friday 14:00**.

The store pick limit and the extended pick limit always work this way, and so does the customer pickup deadline when it is set in hours and minutes.

#### Counted in working days

The customer pickup deadline can be set in whole working days instead. It counts only the days the store is open, and lands at closing time on the day it reaches.

> A store open Monday to Friday gets an order on **Friday** with a **2 working day** deadline. Saturday and Sunday are not working days, so they are skipped. The deadline is **Tuesday at closing time**.

Counting starts the day after the order arrives, so the time of day makes no difference. An order at 08:00 and one at 22:00 on the same Friday both land on Tuesday, and so does one that arrives on the Saturday while the store is closed.

A store can set a **Customer pickup deadline offset** in the **Edit Store** view under **Opening Hours**. The offset is subtracted from the closing time, so with a 1 hour offset the deadline above is Tuesday one hour before closing. The offset is used whether or not the store uses store specific limits. A customer pickup deadline in hours and minutes does not use the offset.

Store opening hours must be set in Omnium for click and collect to work. A limit counted in opening hours can never run out in a store that never opens, so no deadline is set on the order at all.

#### An unset limit means no deadline

A limit left empty, or set to zero, means the deadline does not apply. It does not mean the order is due immediately. An order at a store with no pick limit gets no pick deadline, so there is nothing for the cancellation task below to act on.

### Automatic cancellations

Omnium has a scheduled task named `CancelExpiredClickCollectScheduledTask`. This task will automatically cancel all click and collect orders where the deadline has passed.

It will cancel in an order in the following two scenarios:

*   Store pick deadline has expired
*   Customer pick up deadline has expired

#### The status an expired order gets

The task sets a different status for each deadline. Change them in **Configuration → Settings → Orders → Click and Collect**, in the **Deadline** card.

| Deadline | Default status |
| --- | --- |
| Store pick deadline | **Expired** |
| Customer pickup deadline | **Not collected** |
| Transit limit | **Expired** |

Leave a selector empty to keep the default. A status you select must exist on the click and collect order type, so add it there first if it is missing. The status is also written as the cancellation reason on the order lines.

In order to clear the store pick deadline when an order is picked, the click and collect order workflow should contain the workflow step `SetShipmentOrOrderReadyForPickup` on the status **Ready for pickup**. This way the scheduled task will not cancel the order once the store has set it to **Ready for pickup**.

The customer deadline is only relevant when the order has status **Ready for pickup**, so once the order is completed by the store staff the cancellation task will ignore them.

### Notification templates

Omnium has click and collect specific notifications that can be triggered on click and collect specific events. Check out the available notification types under Configuration -> Notifications for more info.

## Working with Click and Collect Orders in Omnium

### Picking Orders

In a standard workflow, when a Click and Collect order is created in Omnium, inventory is reserved for the relevant items, and an order confirmation is sent to the customer indicating which products are reserved.

Once a Click and Collect order is registered in Omnium, it becomes visible in the **Click and Collect list**, typically accessible via the main menu on the left-hand side.

Store employees can **view**, **search**, and **filter** Click and Collect orders within this list. Usually, employees only have access to orders placed in their own store, and the list will reflect this based on who is logged in.

For example, if four new orders are received and only two items are available in stock, the employee can:

*   Select the order lines for items that are in stock.
*   Print a pick list, either collectively or as individual orders.
*   After picking, select the same order lines again and **update their status** to “Ready for Pickup”.

When the status is changed to _Ready for Pickup_, a notification is typically sent to the customer and the customer pick up deadline starts running.

* * *

### Manual Cancellation

If a Click and Collect order is not picked up within the specified pickup deadline, it is flagged as **Urgent** in Omnium.

When urgent orders exist, an **orange button** will appear in the Click and Collect list. Clicking this button filters the list to show only the urgent orders.

To cancel order lines:

1.  Select the rows to be canceled.
2.  Click **Update Status**.
3.  Choose **Cancel Order Lines**.

As part of the cancellation workflow, it's important to:

*   **Release the reservation** or **increase the inventory**—depending on whether inventory was deducted at the time of picking.
*   **Notify the customer** that the order lines have been canceled.
