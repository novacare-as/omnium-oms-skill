# Create Invoice

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/create-invoice

> Generate an invoice for the order or specific shipment.

## Overview

The **Create Invoice** step generates an invoice document for the order. It can create an invoice for the entire order or for a specific shipment when running at shipment level.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateInvoice` |
| **Group** | Payments |
| **Applicable Statuses** | Ship, ReadyForPickup, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Creates an invoice for the order/shipment
2.  If running at order level: Creates invoice for entire order
3.  If running at shipment level: Creates invoice for specific shipment
4.  Generates invoice document according to tenant configuration

### Prerequisites

*   Order must be in a shippable/complete state
*   Invoice service must be configured

### Side Effects

*   Creates invoice document
*   Invoice number is generated and stored
*   At shipment level, the invoice records the shipment in `shipmentId`, and the [Create Receipts](create-receipts.md) step issues no receipt for that shipment
*   Invoice may be sent to external systems (ERP, accounting)

## Business Cases

### When to Use

*   **Order completion**: Generate invoice when order ships
*   **Shipment-level invoicing**: Separate invoices per shipment
*   **B2B orders**: Invoice generation for business customers

### Example Scenarios

**Scenario 1: Order-Level Invoice** Step runs at order level. Creates single invoice for $150 order total.

**Scenario 2: Shipment-Level Invoice** Order split into two shipments. Each shipment gets its own invoice as it ships.

**Scenario 3: Click-and-Collect** Order ready for pickup. Invoice created for customer to collect with their items.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Invoice created | Success | Yes |
| Creation failed | Error | Depends on StopOnError |

## Related Steps

*   [Capture Payments](capture-payments.md) - Often run together with invoicing
*   [Export Invoices](../export/export-invoices.md) - Exports created invoices to external systems
*   [Create Receipts](create-receipts.md) - Issues a paid receipt for a delivered shipment instead of an invoice to pay
