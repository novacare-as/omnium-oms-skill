# Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks

> Configure and manage background jobs in Omnium

Scheduled tasks are background jobs that run automatically at specified intervals to maintain data consistency, synchronize with external systems, send notifications, and perform various housekeeping operations in Omnium.

## Cron Schedule Format

Scheduling is controlled by a [cron schedule](https://en.wikipedia.org/wiki/Cron):

```
 ┌───────────── minute (0 - 59)
 │ ┌───────────── hour (0 - 23)
 │ │ ┌───────────── day of the month (1 - 31)
 │ │ │ ┌───────────── month (1 - 12)
 │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
 │ │ │ │ │
 │ │ │ │ │
 │ │ │ │ │
 * * * * *
```

### Common Schedule Examples

| Schedule | Description |
| --- | --- |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour (at minute 0) |
| `0 */6 * * *` | Every 6 hours |
| `0 0 * * *` | Daily at midnight |
| `0 3 * * *` | Daily at 3:00 AM |
| `0 0 * * 0` | Weekly on Sunday at midnight |
| `0 0 1 * *` | Monthly on the 1st at midnight |

* * *

## Task Groups

Omnium scheduled tasks are organized into functional groups:

| Group | Description | Tasks |
| --- | --- | --- |
| [Analytics](scheduled-tasks/analytics.md) | Statistics generation, data aggregation, and reporting | 8 |
| [Customer Club](scheduled-tasks/customer-club.md) | Loyalty program management, points, birthdays, and member notifications | 9 |
| [Orders](scheduled-tasks/orders.md) | Order lifecycle management, allocation, automation, and cleanup | 11 |
| [Accounting](scheduled-tasks/accounting.md) | Daily web-fulfillment postings and draft posting cleanup | 2 |
| [Products](scheduled-tasks/products.md) | Product data maintenance, pricing, assortment, and inventory status | 11 |
| [Inventory](scheduled-tasks/inventory.md) | Stock levels, allocation tracking, valuation, and reorder suggestions | 7 |
| [Carts](scheduled-tasks/carts.md) | Shopping cart maintenance and conversion | 2 |
| [Vouchers](scheduled-tasks/vouchers.md) | Voucher lifecycle and reactivation | 2 |
| [Prices](scheduled-tasks/prices.md) | Price data cleanup and maintenance | 2 |
| [Projects](scheduled-tasks/projects.md) | Project lifecycle and anonymization | 2 |
| [Ratings](scheduled-tasks/ratings.md) | Product rating verification | 1 |
| [Stores](scheduled-tasks/stores.md) | Store data maintenance | 1 |
| [Subscriptions](scheduled-tasks/subscriptions.md) | Subscription order generation | 1 |
| [Notifications](scheduled-tasks/notifications.md) | Notification processing and delivery | 1 |
| [Events](scheduled-tasks/events.md) | Event log maintenance | 1 |

* * *

## Task Types

### Delta Tasks

Delta tasks process only data that has changed since the last run. They are efficient and can run frequently (every few minutes). Examples include order import tasks and inventory sync tasks.

### Full Tasks

Full tasks process all relevant data regardless of changes. They are typically scheduled less frequently (daily or weekly) and are used for data consistency checks, cleanup operations, or complete recalculations.

* * *

## Configuration

Scheduled tasks are configured by adding entries to `ScheduledTaskSettings`. Navigate to **Configuration > Settings > Integrations > Scheduled tasks** in the Omnium UI.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Faddscheduletask.215f5af3.png&w=3840&q=75)

### Configuration Properties

| Property | Type | Description |
| --- | --- | --- |
| `Schedule` | string | Cron expression defining when the task runs |
| `ImplementationType` | string | The scheduled task class name |
| `IsDisabled` | bool | Set to `true` to temporarily disable the task |
| `Properties` | array | Task-specific configuration properties |

### Example Configuration

```json
{
    "ImplementationType": "DeleteAbandonedCartScheduledTask",
    "Schedule": "0 3 * * *",
    "IsDisabled": false
}
```

### Configuration with Properties

Some tasks accept additional configuration properties:

```json
{
    "ImplementationType": "DeleteOldOrdersScheduledTask",
    "Schedule": "0 2 * * 0",
    "Properties": [
        {
            "Key": "DeleteOrdersThreshold",
            "Value": "3"
        }
    ]
}
```

* * *

## Plugin Scheduled Tasks

Scheduled tasks for external integrations (ERP, POS, E-commerce, WMS, etc.) are documented within each plugin's documentation:

### Point of Sale (POS)

*   [Sitoo](../plugins/POS/Sitoo.md) - Order import, product/inventory export
*   [FrontSystems](../plugins/POS/FrontSystems.md) - Product import, inventory sync
*   [Flow](../plugins/POS/Flow.md) - Product, price, and inventory export
*   VisionPOS - Product and inventory import

### ERP Systems

*   Dynamics 365 - Orders, inventory, prices, customers
*   Vitari Connect - Orders, inventory, invoices
*   [TripleTex](../plugins/ERP/TripleTex.md) - Invoice synchronization
*   [PowerOffice Go](../plugins/ERP/PowerOffice.md) - Cash sale export, bank vouchers

### E-commerce Platforms

*   [Shopify](../plugins/ECOM/Shopify.md) - Products, orders, inventory
*   [Magento](../plugins/ECOM/Magento.md) - Products, orders, customers, inventory
*   Jetshop - Products, orders, inventory

### Warehouse Management

*   [Ongoing WMS](../plugins/WMS/Ongoing.md) - Order and inventory synchronization

### Product Feeds

*   [Google Shopping](../plugins/Other/GoogleFeeds.md) - Product feed export
*   Nosto - Product recommendations export

* * *

## Best Practices

### Scheduling Guidelines

1.  **Delta tasks**: Schedule frequently (every 1-15 minutes) for near real-time sync
2.  **Full tasks**: Schedule during off-peak hours (typically 2-5 AM)
3.  **Heavy tasks**: Avoid running multiple resource-intensive tasks simultaneously
4.  **Cleanup tasks**: Run weekly or monthly depending on data volume

### Monitoring

*   Check the scheduled task execution logs regularly
*   Set up alerts for failed task executions
*   Monitor task duration trends for performance issues

### Troubleshooting

*   If a task fails, check the event log for detailed error messages
*   Verify that required settings and configurations are in place
*   For integration tasks, ensure external system credentials are valid
