# Export Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/export

> Workflow steps for exporting orders, payments, and invoices to external systems.

## Overview

Export steps send order data to external systems such as ERP, WMS, accounting systems, and other integrations. They are the primary mechanism for outbound data flow from Omnium.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Export Order](export/export-order.md) | `ExportOrder` | Export orders to ERP/WMS via connectors |
| [Export Payments](export/export-payments.md) | `ExportPayments` | Export payment data for reconciliation |
| [Export Invoices](export/export-invoices.md) | `ExportInvoices` | Export invoices to accounting systems |
| [Webhook Workflow Step](export/webhook-workflow-step.md) | `WebhookWorkflowStep` | Call external webhooks for custom logic |
| [Print Click & Collect Order](export/print-click-and-collect-order.md) | `PrintClickAndCollectOrder` | Print order documents for store pickup |

## Common Use Cases

### ERP Integration

Export orders to ERP system after validation:

```
New Order → ValidateOrder → ExportOrder (ERP) → Continue
```

### Financial Export

Export payments and invoices after completion:

```
Completed → ExportPayments → ExportInvoices → Archive
```

### External Validation

Use webhooks for external business logic:

```
New Order → WebhookWorkflowStep (FraudCheck) → Continue or Cancel
```

## Connector Configuration

Most export steps require connector configuration:

*   **Connector**: Name of the integration connector
*   **StopOnError**: Whether to cancel workflow on failure
*   **ErrorStatus**: Status to set on export failure
*   **RunAfterOrderIsSaved**: Wait for order persistence before export

## Error Handling

Export steps typically support graceful error handling:

1.  **StopOnError=false** (default): Log warning, continue workflow
2.  **StopOnError=true**: Cancel workflow, set error status

This allows critical exports to block workflow while non-critical exports can fail without stopping order processing.
