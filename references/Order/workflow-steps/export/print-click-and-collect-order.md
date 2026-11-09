# Print Click & Collect Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/export/print-click-and-collect-order

> Print order documents for Click & Collect fulfillment at store.

## Overview

The **Print Click & Collect Order** step generates and prints a PDF document for Click & Collect orders at the pickup store. This supports in-store fulfillment workflows.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `PrintClickAndCollectOrder` |
| **Group** | Export |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties. The printer is determined by the store configuration.

## Behavior

### What It Does

1.  Creates order view model from order
2.  Generates HTML content for Click & Collect order
3.  Converts HTML to PDF
4.  Gets the store associated with the order
5.  Determines printer ID:
    *   Uses store property `bccprinter` if configured
    *   Falls back to store ID as printer identifier
6.  Sends PDF to printer asynchronously

### Prerequisites

*   Order must have a store ID
*   Store must exist in the system
*   Print service must be configured
*   Printer must be available (either via `bccprinter` property or store ID)

### Side Effects

*   PDF document generated
*   Print job sent to store printer
*   Print operation runs in background (fire and forget)

## Business Cases

### When to Use

*   **Click & Collect**: Print packing slips for store pickup orders
*   **In-store fulfillment**: Provide printed order details to store staff
*   **Order preparation**: Generate pick lists for store associates

### Example Scenarios

**Scenario 1: Successful Print** Order printed to store's configured BCC printer.

**Scenario 2: No BCC Printer Configured** Store doesn't have `bccprinter` property. Print sent using store ID as printer.

**Scenario 3: Store Not Found** Order's store ID doesn't match any store. Returns error.

**Scenario 4: PDF Generation Failed** HTML to PDF conversion fails. Returns error.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Print successful | Success | Yes |
| Order view model creation failed | Error | Yes |
| HTML generation failed | Error | Yes |
| PDF generation failed | Error | Yes |
| Store not found | Error | Yes |
| Exception during print | Error with message | Yes |

## Related Steps

*   [Print Shipping Label](../shipments/print-shipping-label.md) - Print shipping labels
*   [Export Order](export-order.md) - Export order to external systems
