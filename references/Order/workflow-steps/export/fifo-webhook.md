# FIFO Webhook

Source: https://docs.omnium.no/docs/Order/workflow-steps/export/fifo-webhook

> Export orders, returns, and credit payments via HTTP POST with guaranteed ordering and automatic retries.

## Overview

The **FifoWebhook** connector sends order data to an HTTP endpoint, like the regular [Webhook export](export-order.md), but with delivery guarantees the regular export does not provide:

*   **Ordered delivery** — each FifoWebhook connector has its own delivery queue. Messages are delivered one at a time, in the order they were exported.
*   **Guaranteed delivery** — failed deliveries are retried with an escalating delay until they succeed. While a message is failing, later messages wait in the queue, so your endpoint never receives updates out of order.

Use it when the receiving system depends on processing order updates in sequence, or must not miss updates while it is down.

The FIFO webhook posts the same envelope as the regular Webhook export — the order, and optionally a shipment, a return or a credited payment — plus `WebhookId` and `TenantId` — see [Request Format](fifo-webhook.md#request-format).

* * *

## Setup

### Step 1: Create the connector

Create a connector in **Configuration → Settings → Integrations → Connectors**:

```json
{
  "Name": "FifoWebhook",
  "ConnectorId": "erp-order-events",
  "DisplayName": "Order events to ERP",
  "Properties": [
    { "Key": "WebhookEndpoint", "Value": "https://erp.example.com/api/omnium/orders" },
    { "Key": "Authorization", "Value": "Bearer YOUR_API_TOKEN", "KeyGroup": "RequestHeaders" }
  ]
}
```

| Property | Required | Description |
| --- | --- | --- |
| `Name` | Yes | Must be `"FifoWebhook"` |
| `ConnectorId` | Yes | Unique ID for this connector. It identifies the delivery queue and appears as `WebhookId` in every delivery. |
| `WebhookEndpoint` | Yes | URL that receives the HTTP POST (set as a property) |
| Properties with `KeyGroup: "RequestHeaders"` | No | Sent as HTTP headers on every delivery — use for authentication |

Request headers must be configured on the connector, not on the workflow step. Allow a few minutes after creating a new connector before deliveries start.

### Step 2: Export orders and returns

Add an [Export Order](export-order.md) workflow step (or the return-side export step) that references the connector:

```json
{
  "Connector": "FifoWebhook",
  "ConnectorId": "erp-order-events"
}
```

The step supports the same options as any Export Order step (`StopOnError`, `ErrorStatus`, `RunAfterOrderIsSaved`).

If you have multiple FifoWebhook connectors, always set `ConnectorId` on the workflow step. Each connector has its own queue and endpoint, and the `ConnectorId` determines which one receives the export.

### Step 3: Export credit payments (optional)

To also receive a webhook whenever a payment is credited from Omnium, add `ICreditPaymentExporter` to the connector's `Implementations`:

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

No workflow step is needed — the export triggers when the payment is credited. The delivery contains the full order plus a top-level `Payment` object identifying the credited payment:

```json
{
  "Order": {
    "Id": "ORD-12345",
    "Status": "Completed",
    "OrderLines": [ ... ]
  },
  "Payment": {
    "Id": "d3f1c2a4-...",
    "TransactionType": "Credit",
    "Amount": 499.00
  },
  "WebhookId": "erp-order-events",
  "TenantId": "acme"
}
```

The payment also appears in the order's own payment list — the top-level `Payment` tells you which payment the event is about.

* * *

## Request Format

Omnium sends a `POST` request. `Order` is always included; fields that are not relevant for the event are omitted from the JSON. A typical order export:

```json
{
  "Order": {
    "Id": "ORD-12345",
    "Status": "Completed",
    "OrderLines": [ ... ]
  },
  "WebhookId": "erp-order-events",
  "TenantId": "acme"
}
```

| Field | Present | Description |
| --- | --- | --- |
| `Order` | Always | The full order object |
| `Shipment` | Shipment exports | The shipment that triggered the export |
| `ReturnOrderForm` | Return exports | The return that triggered the export |
| `Payment` | Credit payment exports | The credited payment |
| `WebhookId` | Always | The connector's `ConnectorId` |
| `TenantId` | Always | Your tenant ID |

Determine the event type from which of the optional objects is present: a delivery with `ReturnOrderForm` is a return, with `Payment` a credited payment, with `Shipment` a shipment update, and with none of them a plain order update.

* * *

## Delivery and Retries

*   Any `2xx` response counts as delivered. Respond quickly and process asynchronously if needed — see [securing your webhook endpoint](../../../Security/api-security.md#securing-your-webhook-endpoint).
*   On failure, the delivery is retried with an escalating delay, starting at 1 second and growing to 60 minutes between attempts, until it succeeds.
*   Because delivery is ordered, later messages wait while a message is failing. A consistently failing endpoint blocks its queue — deliveries resume in order once the endpoint recovers.
*   Deliveries and failures are logged as order events, and the state of each FIFO webhook queue can be inspected in the Omnium queue viewer.

* * *

## Related

*   [Export Order](export-order.md) — the workflow step that triggers the export, and the regular (unordered) Webhook export type
*   [Webhook Workflow Step](webhook-workflow-step.md) — two-way webhook that can update the order from the response
*   [Events & Webhooks](../../../Integrations/events.md) — lightweight event notifications as an alternative to full order exports
