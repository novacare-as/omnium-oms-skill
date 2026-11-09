# Send Product Alerts

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/products/send-product-alerts

> Notify customers when products they are interested in are back in stock

## Overview

This task processes active product alerts (back-in-stock notifications) and sends notifications to customers when products become available. It checks inventory levels for products with pending alerts and triggers notifications when stock is available, either globally or at specific warehouses.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `SendProductAlertsScheduledTask` |
| **Group** | Products |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you need:

*   Back-in-stock notifications for customers
*   Automated alerts when inventory becomes available
*   Warehouse-specific stock notifications
*   Customer engagement for out-of-stock products

* * *

## Configuration Properties

This task has no configurable properties. Product alert behavior is controlled through the Product Alert Settings in tenant configuration.

### Required Settings

The following settings must be configured in Product Alert Settings:

| Setting | Description |
| --- | --- |
| `IsProductAlertEnabled` | Must be `true` for the task to process alerts |
| `AlertIsDeactivatedThreshold` | Number of days after which unprocessed alerts are automatically deactivated |

* * *

## Behavior

### What It Does

1.  Checks that product alert settings are configured and enabled
2.  Retrieves all active product alerts grouped by SKU
3.  For each SKU with alerts:
    *   Fetches current inventory levels from relevant warehouses
    *   Determines if stock is available (inventory minus reserved > 0)
    *   Matches available stock against alert warehouse requirements
4.  Sends notifications for alerts where stock is available
5.  Deactivates alerts after notifications are sent
6.  Deactivates expired alerts that exceed the threshold

### Warehouse-Specific Alerts

Alerts can be configured with specific warehouse codes:

*   If an alert has warehouse codes, it only triggers when those specific warehouses have stock
*   If an alert has no warehouse codes, it triggers when any warehouse has available stock

### Alert Lifecycle

1.  **Active** - Customer has registered for notification
2.  **Triggered** - Stock became available, notification sent
3.  **Deactivated** - Alert has been processed or expired

### Prerequisites

*   Product Alert Settings must be configured and enabled
*   Inventory data must be available in the system
*   Notification services must be configured

### Side Effects

*   Sends notifications to customers (email, SMS, etc.)
*   Deactivates processed alerts
*   Deactivates expired alerts exceeding the threshold

* * *

## Example Configuration

```json
{
    "ImplementationType": "SendProductAlertsScheduledTask",
    "Schedule": "*/15 * * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run frequently (e.g., `*/15 * * * *` every 15 minutes) to provide timely notifications. More frequent runs increase customer satisfaction but also increase system load.

* * *

## Related Tasks

*   [Product Inventory Status](product-inventory-status.md) - Updates product inventory levels
