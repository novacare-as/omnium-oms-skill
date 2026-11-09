# Credit Payment Export

Source: https://docs.omnium.no/docs/Integrations/credit-payment-export

> Export a credit registered on an order as its own message, so the receiving system can post a separate credit document instead of modifying the original order.

## Overview

When a payment is credited on an order in Omnium, the credit can be exported to an external system as **its own message**, separate from the order export. The message carries the order together with the credited payment, so the receiving system can identify exactly which payment was credited.

This is the mechanism to use when a credit is registered **after the order is completed** and the receiving system has already closed or posted its own document for that order. Many ERP and accounting systems do not allow a posted invoice to be changed. Receiving the credit as a separate message lets you create a credit note or credit memo that references the original order, instead of reopening the original document.

Credit payment export is not a workflow step. It is enabled on a connector, and it triggers directly when the credit is registered.

## What triggers a credit export

| Source | Action |
| --- | --- |
| Omnium UI | **Payments → Credit** on an order |
| Public API | The credit payment endpoint on the Orders API |

Both register a credit transaction on the order and then call every connector configured for credit payment export. Credits registered on a cart are not exported.

## Enabling it

Add `ICreditPaymentExporter` to the `Implementations` array of a connector that supports it (**Tenant Settings → Connectors**):

```json
{
  "Name": "FifoWebhook",
  "ConnectorId": "erp-order-events",
  "Implementations": ["ICreditPaymentExporter"],
  "Properties": [
    { "Key": "WebhookEndpoint", "Value": "https://erp.example.com/api/omnium/orders" }
  ]
}
```

No workflow step is required. Every connector whose `Implementations` contains `ICreditPaymentExporter` receives the export, so you can deliver the same credit to more than one system by configuring more than one connector.

## Supported connectors

| Connector `Name` | Transport | Payload |
| --- | --- | --- |
| `Webhook` | HTTP POST | The order plus a top-level `Payment` object — see [Webhook payload](credit-payment-export.md#webhook-payload) |
| `FifoWebhook` | HTTP POST, ordered delivery with retries | The same envelope plus `WebhookId` and `TenantId` — see [FIFO Webhook](../Order/workflow-steps/export/fifo-webhook.md#step-3-export-credit-payments-optional) |
| `AzureServiceBus` | Message on an Azure Service Bus queue | Event message with `operation` set to `CreditPayment` — see [Queue message](credit-payment-export.md#queue-message) |
| `AzureStorageQueue` | Message on an Azure Storage Queue | The same event message as `AzureServiceBus` |

Some ERP and POS plugins implement credit payment export as part of their own integration. Check the plugin's own page.

Only add `ICreditPaymentExporter` to a connector in the table above, or to one whose plugin page documents it. A connector that advertises a capability it does not implement makes the credit action fail with a "Could not load service" error instead of only skipping the export.

### Webhook payload

`Webhook` and `FifoWebhook` post the order together with the credited payment:

```json
{
  "Order": {
    "Id": "ORD-12345",
    "Status": "Completed",
    "OrderLines": [ ... ]
  },
  "Payment": {
    "Id": "d3f1c2a4-5b6e-4f70-9a81-2c3d4e5f6a7b",
    "TransactionType": "Credit",
    "Amount": 499.00
  }
}
```

The credited payment also appears in the order's own payment list. The top-level `Payment` is what tells you which payment the delivery is about — a delivery without it is an order, shipment or return export.

A credit export has no workflow step behind it, so the endpoint comes from the connector itself. Set `Host` on the connector, or add a `WebhookEndpoint` property to it. An endpoint configured only on a workflow step is not used for credits.

### Queue message

`AzureServiceBus` and `AzureStorageQueue` send the same message, on the queue named by the connector's `OrderQueueName` property:

```json
{
  "entityId": "ORD-12345",
  "entityType": "Order",
  "operation": "CreditPayment",
  "marketId": "NOR",
  "storeId": "epic_webshop_no",
  "properties": [
    { "key": "TransactionId", "value": "YOUR_TRANSACTION_ID" },
    { "key": "Status", "value": "Processed" },
    { "key": "PaymentMethodName", "value": "Stripe" },
    { "key": "Id", "value": "d3f1c2a4-5b6e-4f70-9a81-2c3d4e5f6a7b" }
  ]
}
```

`operation` distinguishes the message from a plain order `Update` or a `Return`. The `properties` identify the credited payment. Fetch the order from the API to read the current payment list and the credited amount.

Order properties whose key starts with `eventMessageMetadata` are copied into `properties`, so you can route or correlate messages using data you set on the order.

## If you already export orders over a webhook

Most webhook integrations use the `Webhook` connector with an `ExportOrder` or `WebhookWorkflowStep` on an order status. To add credits, add `ICreditPaymentExporter` to the `Implementations` of that same connector. No second connector and no extra workflow step are needed:

```json
{
  "Name": "Webhook",
  "ConnectorId": "erp-orders",
  "Implementations": ["ICreditPaymentExporter"],
  "Host": "https://erp.example.com/api/omnium/orders"
}
```

Your existing order export is unchanged. The endpoint now receives credit deliveries as well, so it has to branch on the top-level `Payment` object.

To keep credits on their own endpoint instead, configure a second `Webhook` connector with its own `ConnectorId` and `Host`, and put `ICreditPaymentExporter` only on that one. Credits then go to the second connector and orders keep using the first.

## Alternative: subscribe to the credit event

If you only need to be notified, and will fetch the order yourself, subscribe to the credit event instead of configuring an exporter. Register an event subscription under **Configuration → Event subscriptions**, filtered on the credit operation IDs:

| Operation ID | Operation | Raised when |
| --- | --- | --- |
| `216119` | GuiPaymentCredit | A credit is registered from the Omnium UI |
| `316100` | ApiPaymentCredit | A credit is registered through the public API |

Event subscriptions support webhooks, Azure Storage Queues, Azure Service Bus and Apache Kafka. See [Events](events.md).

The difference between the two approaches: an exporter delivers the order and the credited payment in the message itself, while an event subscription delivers event metadata and leaves you to fetch the order.

## Credits that are part of a return

If the compensation is registered as a **return** rather than as a bare credit, the return workflow handles the export instead. See [Export Order](../Order/Returns/return-workflow-steps/export/export-order.md) for the return export step, and [Credit Return](../Order/Returns/return-workflow-steps/payment/credit-return.md) for refunding the payment as part of the return.

Use credit payment export when there is no return of goods: compensation, goodwill, a price adjustment, or covering a cost on the customer's behalf.
