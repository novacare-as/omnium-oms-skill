# Export Payments

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/payment/export-payments

> Export return payment data to external payment systems and accounting integrations.

## Overview

The **Export Payments** step sends payment transaction data from the return to external systems. This is commonly used to sync refund information with accounting systems, payment processors, or ERP platforms.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ExportPayments` |
| **Group** | Payments |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| Connector | string | No | The payment exporter connector to use. If omitted, the step exports through all configured payment exporter connectors |

## Behavior

### What It Does

1.  Retrieves payment transactions from the return
2.  Formats data according to connector requirements
3.  Sends payment data to the configured external system
4.  Records export status on the payment transactions

### Prerequisites

*   Return must have payment transactions (credits)
*   Connector must be configured and active
*   External system must be accessible

### Side Effects

*   Marks payment transactions as exported
*   Creates export log entries
*   May update external system records

## Business Cases

### When to Use

*   Syncing refunds to accounting systems
*   Reporting payments to payment aggregators
*   Updating ERP financial records
*   Maintaining payment audit trails

### Example Scenarios

**ERP Integration** Return refund of $150 processed. Export Payments sends the credit transaction to the ERP system for financial reconciliation.

**Payment Provider Sync** After processing a refund through the payment gateway, this step can notify other systems of the transaction for reporting purposes.

## Sample Configuration

```json
{
  "Name": "ExportPayments",
  "Active": true,
  "Connector": "AccountingSystemConnector",
  "TranslateKey": "WorkflowStep_ExportPayments"
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Export successful | Success | Yes |
| No payments to export | Success (no action) | Yes |
| Connector not configured | Error | Depends on StopOnError |
| External system error | Error | Depends on StopOnError |
| Network timeout | Error | Depends on StopOnError |

## Related Steps

*   [Credit Return](credit-return.md) - Process refunds first
*   [Create Credit Note](create-credit-note.md) - Generate credit documentation
