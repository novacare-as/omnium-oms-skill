# Payment Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/payment

> Workflow steps for processing refunds, credits, and payment exports on returns.

## Overview

Payment workflow steps handle the financial aspects of return processing. They manage refunds to customers, creation of credit notes, and export of payment data to external systems.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Credit Return](payment/credit-return.md) | `CreditReturn` | Process refund to customer's original payment method |
| [Create Credit Note](payment/create-credit-note.md) | `CreateCreditNote` | Generate credit note document for the return |
| [Export Payments](payment/export-payments.md) | `ExportPayments` | Export payment data to external payment systems |

## Common Patterns

### Standard Refund Flow

1.  **CreditReturn** - Process the refund amount
2.  **CreateCreditNote** - Generate documentation (optional)
3.  **ExportPayments** - Sync to accounting/ERP (optional)

### Multi-Payment Handling

When an order has multiple payments, the `CreditReturn` step processes refunds in order of credit priority. If no priority is set, payments are credited in the order they were created.
