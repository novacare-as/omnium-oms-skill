# Export Order

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/export/export-order

> Export return data to external systems via configured connectors.

## Overview

The **Export Order** step sends return data to external systems such as ERPs, accounting platforms, or other integrations. It uses connectors that implement the return export interface to format and transmit the data.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ExportOrder` |
| **Group** | Export |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| Connector | string | Yes | The export connector to use |

Additional properties can be passed to the connector.

## Behavior

### What It Does

1.  Prepares return data for export
2.  Calls the configured export connector
3.  Transmits data to external system
4.  Records export status and any external reference returned
5.  Stores export result on the return

### Prerequisites

*   Connector must be configured and active
*   External system must be accessible
*   Return must have required data for export

### Side Effects

*   Marks return as exported
*   May add external reference IDs
*   Creates export log entries
*   Updates external system records

## Supported Integrations

The `Connector` property takes the connector's `Name` as configured under **Tenant Settings → Connectors**. Names are matched case-insensitively. Connectors that can receive a return export include:

| Connector `Name` | Type |
| --- | --- |
| `Webhook` | HTTP POST to your endpoint |
| `FifoWebhook` | HTTP POST with ordered delivery and retries |
| `AzureServiceBus` | Message on an Azure Service Bus queue |
| `AzureStorageQueue` | Message on an Azure Storage Queue |
| `Dynamics365` | Microsoft ERP integration |
| `Shopify` | E-commerce platform sync |
| `VoyadoExporter`, `VoyadoOrderV3Exporter` | Marketing/CRM platform |
| `Inretrn` | Returns portal |
| `VitariConnect` | ERP integration |
| `LindbakFileService` | POS integration |

The connector is selected by the `Connector` and optional `ConnectorId` set on the workflow step. Unlike [credit payment export](../../../../Integrations/credit-payment-export.md), this step does not use the connector's `Implementations` list.

## Business Cases

### When to Use

*   Syncing returns to ERP for financial processing
*   Updating e-commerce platforms with return status
*   Integrating with CRM/marketing systems
*   Maintaining data consistency across systems

### Example Scenarios

**ERP Sync** Return completed for $150 refund. Step exports return to Dynamics 365 for credit memo creation.

**E-commerce Update** Return processed in Omnium. Step updates Shopify with return status so customer portal shows current status.

**Webhook Integration** Return data sent to custom webhook for processing by third-party fulfillment system.

## Sample Configuration

```json
{
  "Name": "ExportOrder",
  "Active": true,
  "Connector": "Dynamics365",
  "TranslateKey": "WorkflowStep_ExportReturn"
}
```

## Multiple Exports

You can configure multiple export steps to different systems:

```json
{
  "WorkflowSteps": [
    {
      "Name": "ExportOrder",
      "Active": true,
      "Connector": "Dynamics365",
      "TranslateKey": "WorkflowStep_ExportToERP"
    },
    {
      "Name": "ExportOrder",
      "Active": true,
      "Connector": "Shopify",
      "TranslateKey": "WorkflowStep_ExportToShopify"
    }
  ]
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Export successful | Success | Yes |
| Connector not found | Error | Depends on StopOnError |
| External system error | Error | Depends on StopOnError |
| Network timeout | Error | Depends on StopOnError |

## Related Steps

*   [Credit Return](../payment/credit-return.md) - Process refund before exporting
*   [Export Payments](../payment/export-payments.md) - Export payment-specific data
