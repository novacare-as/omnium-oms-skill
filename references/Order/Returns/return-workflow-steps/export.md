# Export Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/export

> Workflow steps for exporting return data to external systems.

## Overview

Export workflow steps send return data to external systems such as ERPs, accounting systems, and other integrations. They ensure return information is synchronized across your technology stack.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Export Order](export/export-order.md) | `ExportOrder` | Export return to external system via configured connector |
| [Webhook Return Workflow Step](export/webhook-return-workflow-step.md) | `WebhookReturnWorkflowStep` | Call an external endpoint and optionally update the order from the response |

## Connector Configuration

The `ExportOrder` step requires a `Connector` property specifying which integration to use. The connector must implement the return export interface.

Supported export integrations include Dynamics 365, Shopify, Voyado, Inretrn, Vitari and Lindbak, as well as the generic `Webhook`, `FifoWebhook`, `AzureServiceBus` and `AzureStorageQueue` connectors. See [Export Order](export/export-order.md#supported-integrations) for the connector names to use.

```json
{
  "Name": "ExportOrder",
  "Active": true,
  "Connector": "Dynamics365",
  "TranslateKey": "WorkflowStep_ExportReturn"
}
```
