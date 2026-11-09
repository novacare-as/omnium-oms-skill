# Export Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/export/export-order

> Complete guide to configuring the Export Order workflow step to send orders to external systems like ERPs, warehouses, and fulfillment centers.

## Overview

The **Export Order** workflow step sends order information to external systems like your ERP, warehouse management system, fulfillment center, or other third-party platforms. When an order reaches this workflow step, Omnium will automatically export the order data to your chosen destination.

**Important to know:**

*   The export is **awaited** - Omnium waits for the export to complete before moving to the next workflow step
*   The export **happens immediately** when the workflow step is triggered
*   You get feedback on whether the export succeeded or failed
*   Failed exports can either stop the workflow or just show a warning

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ExportOrder` |
| **Group** | Export |
| **Applicable Statuses** | New, Completed, ReadyForPickup, Ship |

* * *

## Step 1: Configure the Workflow Step

To add order export to your workflow, you need to configure the workflow step properties.

### Minimum Required Configuration

At minimum, you must specify which connector to use:

```json
{
  "Connector": "Webhook"
}
```

### All Available Options

| Property | Required | Type | Description | Example |
| --- | --- | --- | --- | --- |
| **Connector** | Yes | string | The name of the export connector to use | `"Webhook"`, `"AzureServiceBus"`, `"Dynamics365"` |
| **ConnectorId** | No | string | Specific connector instance ID to use when multiple connectors of the same type exist. Must match the `ConnectorId` field in the connector configuration. | `"webhook-warehouse-north"` |
| **RunAfterOrderIsSaved** | No | boolean | Set to `true` if the receiving system will fetch the order from Omnium instead of receiving it in the export. This ensures the order is fully saved before export. | `true` or `false` (default: `false`) |
| **StopOnError** | No | boolean | Set to `true` to stop the entire workflow if export fails | `true` or `false` (default: `false`) |
| **ErrorStatus** | No | string | If export fails AND StopOnError is true, change the order status to this value | `"ExportFailed"` |

### Example Configurations

**Example 1: Simple webhook export (warnings only if it fails)**

```json
{
  "Connector": "Webhook"
}
```

**Example 2: Critical ERP export (stop workflow if it fails)**

```json
{
  "Connector": "Dynamics365",
  "StopOnError": true,
  "ErrorStatus": "ERPExportFailed"
}
```

**Example 3: Using a specific connector instance when multiple exist**

```json
{
  "Connector": "Webhook",
  "ConnectorId": "webhook-warehouse-stockholm",
  "RunAfterOrderIsSaved": true
}
```

_Note: This requires a connector with `ConnectorId: "webhook-warehouse-stockholm"` in your tenant settings._

* * *

## Step 2: Configure the Connector

After configuring the workflow step, you need to configure the **connector itself** in your tenant settings. The configuration depends on which export type you're using.

### Available Export Types

Omnium supports several built-in export types:

| Export Type | What It Does | Best For |
| --- | --- | --- |
| **Webhook** | Sends the order data via HTTP POST to a URL | External APIs, custom integrations |
| **[FifoWebhook](fifo-webhook.md)** | Sends order data via HTTP POST with guaranteed ordering and retries | Systems that must receive updates in sequence |
| **AzureServiceBus** | Sends a message to Azure Service Bus queue/topic | Azure-based integrations, microservices |
| **AzureStorageQueue** | Sends a message to Azure Storage Queue | Simple Azure integrations, async processing |
| **Custom Connectors** | Pre-built integrations for specific systems | Dynamics 365, Fortnox, Shopify, etc. |

* * *

## Connector Configuration Examples

All connectors are configured in **Tenant Settings** in the `Connectors` array. Each connector is a JSON object that must be added to your tenant configuration.

### General Connector Structure

```json
{
  "Connectors": [
    {
      "Name": "ConnectorName",
      "DisplayName": "Optional friendly name for UI",
      "Properties": [
        {
          "Key": "PropertyName",
          "Value": "PropertyValue"
        }
      ]
    }
  ]
}
```

**Common Connector Properties:**

*   `Name` - **Required** - The connector type name (must match exactly)
*   `ConnectorId` - Optional - Unique identifier for this connector instance (required when using multiple connectors of the same type)
*   `DisplayName` - Optional - Friendly name shown in UI
*   `Host` - URL endpoint (alternative to using Properties)
*   `BearerToken` - Bearer token for authentication
*   `Username` / `Password` - Basic authentication credentials
*   `Token` - Custom token authentication
*   `Properties` - Array of key-value pairs for connector-specific configuration
*   `CustomHeaders` - Array of HTTP headers to include in requests
*   `EnabledForMarkets` - Restrict connector to specific markets
*   `DisabledForMarkets` - Exclude connector from specific markets

### Using Multiple Connectors of the Same Type

When you have multiple connectors of the same type (e.g., multiple Webhook connectors for different warehouses), you must:

1.  Set a unique `ConnectorId` on each connector in your tenant settings
2.  Reference that specific `ConnectorId` in your workflow step configuration

**Example: Two Webhook connectors**

```json
{
  "Connectors": [
    {
      "Name": "Webhook",
      "ConnectorId": "webhook-warehouse-north",
      "DisplayName": "North Warehouse",
      "Host": "https://warehouse-north.example.com/api/orders"
    },
    {
      "Name": "Webhook",
      "ConnectorId": "webhook-warehouse-south",
      "DisplayName": "South Warehouse",
      "Host": "https://warehouse-south.example.com/api/orders"
    }
  ]
}
```

Then in your workflow step, specify which one to use:

```json
{
  "Connector": "Webhook",
  "ConnectorId": "webhook-warehouse-north"
}
```

* * *

### Option A: Webhook Export

**What it sends:** The complete order object as JSON via HTTP POST to your specified URL.

**Configuration Location:** Configuration > Settings > Integrations > Connectors

**Connector JSON Configuration:**

```json
{
  "Name": "Webhook",
  "Properties": [
    {
      "Key": "WebhookEndpoint",
      "Value": "https://your-domain.com/api/orders/webhook"
    }
  ]
}
```

**With Authentication Headers:**

```json
{
  "Name": "Webhook",
  "Properties": [
    {
      "Key": "WebhookEndpoint",
      "Value": "https://your-domain.com/api/orders/webhook"
    },
    {
      "Key": "Authorization",
      "Value": "Bearer YOUR_API_TOKEN",
      "KeyGroup": "RequestHeaders"
    },
    {
      "Key": "X-Custom-Header",
      "Value": "CustomValue",
      "KeyGroup": "RequestHeaders"
    }
  ]
}
```

**Alternative: Using Built-in Auth (recommended for basic/bearer auth):**

```json
{
  "Name": "Webhook",
  "Host": "https://your-domain.com/api/orders/webhook",
  "BearerToken": "YOUR_API_TOKEN"
}
```

Or with Basic Authentication:

```json
{
  "Name": "Webhook",
  "Host": "https://your-domain.com/api/orders/webhook",
  "Username": "your-username",
  "Password": "your-password"
}
```

**Example webhook payload sent:**

```json
{
  "Id": "ORD-12345",
  "Status": "New",
  "CustomerEmail": "customer@example.com",
  "OrderLines": [...],
  "ShippingAddress": {...}
}
```

**When to use:**

*   You have a custom API endpoint to receive orders
*   You need real-time order notifications
*   You want complete order data sent to an external system

* * *

### Option B: Azure Service Bus Export

**What it sends:** A lightweight message containing the order ID and metadata. Your subscriber fetches the full order using Omnium's API.

**Connector JSON Configuration:**

```json
{
  "Name": "AzureServiceBus",
  "Properties": [
    {
      "Key": "ConnectionString",
      "Value": "Endpoint=sb://your-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_KEY"
    },
    {
      "Key": "OrderQueueName",
      "Value": "omnium-orders"
    }
  ]
}
```

**Example message sent:**

```json
{
  "EntityId": "ORD-12345",
  "EntityType": "Order",
  "Operation": "Update",
  "MarketId": "SE",
  "StoreId": "MainStore",
  "Status": "New"
}
```

**When to use:**

*   You're already using Azure Service Bus
*   You have microservices that need order notifications
*   **Important:** Set `RunAfterOrderIsSaved: true` in the workflow step when using this method

* * *

### Option C: Azure Storage Queue Export

**What it sends:** Similar to Service Bus - a lightweight message with order ID and metadata.

**Connector JSON Configuration:**

```json
{
  "Name": "AzureStorageQueue",
  "Properties": [
    {
      "Key": "ConnectionString",
      "Value": "DefaultEndpointsProtocol=https;AccountName=youraccount;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net"
    },
    {
      "Key": "OrderQueueName",
      "Value": "omnium-orders"
    }
  ]
}
```

**When to use:**

*   Simpler and cheaper than Service Bus
*   You don't need advanced message broker features
*   **Important:** Set `RunAfterOrderIsSaved: true` in the workflow step

**Note:** There is a built-in 2-second delay before the message is sent.

* * *

### Option D: Custom Connector (ERP/WMS/POS Systems)

Omnium includes pre-built connectors for many popular systems:

**ERP Systems:** Dynamics 365, Fortnox, NexStep, PowerOffice, TripleTex, Vitari

**Warehouse/Fulfillment:** Ongoing WMS, Ramberg WMS

**E-Commerce Platforms:** Shopify, Magento, JetShop, Navimage

**POS Systems:** Sitoo, FrontSystems, WinSilver, VisionPOS

Each connector has its own specific configuration requirements. Check the connector's documentation for details.

* * *

## What Gets Exported?

The export action sends the following information:

| Information | Description |
| --- | --- |
| **Order** | The complete order object with all order lines, customer info, addresses, etc. |
| **Shipment** | Shipment information (if available at the time of export) |
| **Properties** | Any custom properties configured in the workflow step |

**For Webhook exports:** The entire order object is sent as JSON.

**For Queue/Service Bus exports:** Only a message with the order ID is sent. The receiving system must call Omnium's API to fetch the full order.

* * *

## Understanding Export Behavior

### When Does Export Happen?

*   Export happens **immediately** when the workflow step executes
*   The action **waits** for the export to complete (it's synchronous)
*   Only after export completes (success or failure) does the workflow move to the next step

### What Happens on Success?

*   Order event is created with type "Exported"
*   Any previous export errors are removed from the order
*   Workflow continues to the next step

### What Happens on Failure?

It depends on your `StopOnError` setting:

**If StopOnError = false (default):**

*   A **warning** is added to the order with code `OrderExportError`
*   Workflow **continues** to the next step

**If StopOnError = true:**

*   An **error** is added to the order with code `OrderExportError`
*   Workflow **stops** - no further steps execute
*   Order status changes to `ErrorStatus` (if you configured one)

* * *

## Common Scenarios

### Scenario 1: Send Orders to Your Warehouse

```json
{
  "Connector": "Webhook",
  "ConnectorId": "MainWarehouse",
  "StopOnError": false
}
```

If export fails, order processing continues but you get a warning to investigate.

### Scenario 2: Critical ERP Integration

```json
{
  "Connector": "Dynamics365",
  "StopOnError": true,
  "ErrorStatus": "ERPExportFailed"
}
```

If export fails, the entire workflow stops and order is marked as "ERPExportFailed".

### Scenario 3: Multiple Export Destinations

You can add multiple "Export Order" steps in the same workflow to export to different systems:

**Step 1: Export to ERP (Critical)**

```json
{
  "Connector": "Dynamics365",
  "StopOnError": true,
  "ErrorStatus": "ERPExportFailed"
}
```

**Step 2: Export to Fulfillment Partner (Non-Critical)**

```json
{
  "Connector": "Webhook",
  "ConnectorId": "webhook-fulfillment-partner",
  "StopOnError": false
}
```

* * *

## Complete Configuration Example

Here's a complete end-to-end example showing both the **Connector configuration** (in Tenant Settings) and the **Workflow Step configuration** (in Order Type workflow) working together:

**Step 1: Configure the Connector in Tenant Settings**

```json
{
  "Connectors": [
    {
      "Name": "Webhook",
      "DisplayName": "ERP System",
      "Host": "https://erp.yourcompany.com/api/orders",
      "BearerToken": "your-secret-token-here",
      "Timeout": "00:00:30"
    }
  ]
}
```

**Step 2: Configure the Workflow Step**

Add this workflow step to your Order Type (e.g., in the "Ship" status):

```json
{
  "name": "ExportOrder",
  "active": true,
  "runAfterOrderIsSaved": false,
  "stopOnError": true,
  "Connector": "Webhook",
  "ErrorStatus": "ERPExportFailed"
}
```

**How it works:**

1.  When an order reaches "Ship" status, the `ExportOrder` workflow step executes
2.  The step looks for a connector named `"Webhook"` in your Tenant Settings
3.  It sends the order data to `https://erp.yourcompany.com/api/orders` with bearer token authentication
4.  If the export fails, the workflow stops and the order status changes to "ERPExportFailed"
5.  If successful, the workflow continues to the next step

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Export successful | Success | Yes |
| Exporter not found | Error | Based on StopOnError |
| Export failed (StopOnError=true) | Error | No |
| Export failed (StopOnError=false) | Warning | Yes |

* * *

## Troubleshooting

### Export Not Happening

**Check:**

1.  Is the connector name spelled correctly? (it's case-sensitive!)
2.  Is the connector configured in Tenant Settings?
3.  Does the order's workflow actually reach this step?
4.  Check the order events log - is there an "Exported" event?

### Export Failing

**Check:**

1.  Review the `OrderExportError` on the order for the error message
2.  For Webhook: Is the URL accessible? Check authentication and HTTPS certificates
3.  For Azure queues: Is the connection string correct? Does the queue exist?
4.  Check the order events for detailed error information

### Receiving System Gets Stale Data

**Solution:** Set `RunAfterOrderIsSaved: true` in your workflow step configuration.

This is especially important for:

*   Azure Service Bus exports
*   Azure Storage Queue exports
*   Any system that fetches the order from Omnium's API instead of receiving it in the export

## Related Steps

*   [Export Payments](export-payments.md) - Export payment data
*   [Export Invoices](export-invoices.md) - Export invoice data
*   [Webhook Workflow Step](webhook-workflow-step.md) - External webhook with two-way communication
