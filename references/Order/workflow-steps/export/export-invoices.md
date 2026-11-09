# Export Invoices

Source: https://docs.omnium.no/docs/Order/workflow-steps/export/export-invoices

> Export invoice data to external systems using invoice export connectors.

## Overview

The **Export Invoices** step exports invoice data to external systems using configured invoice export connectors. This enables integration with accounting and invoicing systems.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ExportInvoices` |
| **Group** | Export |
| **Applicable Statuses** | Completed, PickedUp, Ship |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `Connector` | String | No | \- | Specific invoice exporter connector (if omitted, uses all) |

## Behavior

### What It Does

1.  Skips execution in test mode
2.  If specific connector is configured:
    *   Gets connector options from tenant settings
    *   Throws exception if connector not found
    *   Exports invoice using specified connector
3.  If no connector specified:
    *   Exports invoices using all registered exporters
4.  Logs export results and any failures
5.  Returns success or error based on export results

### Prerequisites

*   Invoice export connectors must be configured
*   Order should have invoice data to export

### Side Effects

*   Invoice data exported to external systems
*   Export results logged

## Business Cases

### When to Use

*   **Accounting integration**: Export invoices to accounting systems
*   **Invoice delivery**: Send invoices to invoice service providers
*   **Financial reporting**: Export for financial reconciliation

### Example Scenarios

**Scenario 1: Specific Connector** Connector set to "Fortnox". Invoice exported only to Fortnox.

**Scenario 2: All Connectors** No connector specified. Invoice exported to all registered invoice exporters.

**Scenario 3: Connector Not Found** Specified connector doesn't exist in settings. Exception thrown.

**Scenario 4: Test Mode** Running in test mode. Export skipped, success returned.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Export successful | Success | Yes |
| Connector not found | Exception | No |
| Export failed (specific connector) | Error | Yes |
| Export failed (all connectors) | Success with logs | Yes |

## Related Steps

*   [Create Invoice](../payment/create-invoice.md) - Create invoice before export
*   [Export Order](export-order.md) - Export order data
*   [Export Payments](export-payments.md) - Export payment data
