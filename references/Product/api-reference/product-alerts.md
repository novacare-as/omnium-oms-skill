# Alerts

Source: https://docs.omnium.no/docs/Product/api-reference/product-alerts

> Getting started with product alerts

## Product Alerts

[Product Alerts Documentation](https://api.omnium.no/documentation/index.html#/Products%20%7C%20Alerts)

### About Product Alerts

Product alerts in Omnium allow you to set up notifications to be sent to customers when a product is back in stock.
To enable the product alert feature, you need to configure the `productAlertSettings` in the product settings. The format of the settings is as follows:

```
"productAlertSettings": {
    "alertIsDeactivatedThreshold": 60,
    "isProductAlertEnabled": true
}
```

*   **'alertIsDeactivatedThreshold'**: Specifies the threshold in days after which an alert will be deactivated. Once deactivated, customer contact information is removed from the alert object. (The object will be stored for reporting and statistics).
*   **'isProductAlertEnabled'**: Determines whether the product alert feature is enabled (true) or disabled (false).

**Important:** Make sure to enable Product Alerts through settings before using.

Before an alert can be sent, you need to add a `ProductAlertRequest`. This request contains the following information:

```json
{
  "id": "string (nullable: true)",
  "skuId": "string (required)",
  "email": "string (nullable: true)",
  "phone": "string (nullable: true)",
  "storeId": "string (nullable: true)"
}
```

*   **'id'** (optional): The unique identifier for the ProductAlert. If not set, it will be automatically assigned a GUID.
*   **'skuId'** (required): The SkuID of the product to set up an alert for.
*   **'email'** (optional): The email address to which the alert should be sent.
*   **'phone'** (optional): The phone number to which the alert should be sent.
*   **'storeId'** (optional): The StoreID of the specific store to monitor inventory for. If not set, the system will monitor all warehouses.

To view pending product alerts, you can select the 'Product alerts' option from the top right navigation menu in the products view.

![Product alert view](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FProduct_Aler_menu.916fa43b.png&w=3840&q=75)

Additionally, pending alerts will be visible in a separate tab within the product view.

### Setting Up the Scheduled Task

To ensure that the notifications are sent out at the appropriate times, you need to add a scheduled task. The scheduled task should be configured using the following format:

```json
{
  "schedule": "*/10 * * * *",
  "implementationType": "SendProductAlertsScheduledTask",
  "isDisabled": false
}
```

*   **schedule**: Specifies the frequency at which the task should run, in cron format. In this example, the task runs every 10 minutes.
*   **implementationType**: Indicates the type of task to be executed, which is "SendProductAlertsScheduledTask" in this case.
*   **isDisabled**: Determines whether the task is currently enabled (`false`) or disabled (`true`).

### Setting Up the Notification Template

To customize the content and timing of the notification sent to customers, you need to set up a notification template named "Product alert - in stock". It is recommended to configure the timing of the notification to allow a few minutes for the stock update to reflect on the online store, in case it is not updated immediately.

![Notification timing](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FTiming_notification.96f3d405.png&w=3840&q=75)

* * *
