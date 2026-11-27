# Export Payments

Source: https://docs.omnium.no/docs/Order/workflow-steps/export/export-payments

> Export payment data to external systems using payment exporter connectors.

## Overview

The **Export Payments** step exports payment data to external systems using configured payment exporter connectors. This enables financial system integration for payment reconciliation.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ExportPayments` |
| **Group** | Export |
| **Applicable Statuses** | Completed, ReadyForPickup, Ship |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `Connector` | String | No | \- | Specific payment exporter connector (if omitted, uses all) |

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Executes payment export using the configured payment export connectors
3.  Passes order, shipment, and workflow step configuration
4.  Returns export result

### Prerequisites

*   Payment exporter connectors must be configured
*   Order should have payment data to export

### Side Effects

*   Payment data exported to external systems
*   Export results returned for workflow decision

## Business Cases

### When to Use

*   **Financial reconciliation**: Export payments to accounting systems
*   **Payment reporting**: Send payment data to analytics platforms
*   **ERP integration**: Sync payment data with ERP

### Example Scenarios

**Scenario 1: Successful Export** All payment data exported successfully to financial system.

**Scenario 2: Test Mode** Running in test mode. Export skipped, success returned.

**Scenario 3: Multiple Exporters** No connector specified. All registered payment exporters process the order.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Export successful | Success | Yes |
| Export failed | Based on service result | Yes |

## Related Steps

*   [Export Order](export-order.md) - Export order data
*   [Export Invoices](export-invoices.md) - Export invoice data
*   [Capture Payments](../payment/capture-payments.md) - Capture payments before export
