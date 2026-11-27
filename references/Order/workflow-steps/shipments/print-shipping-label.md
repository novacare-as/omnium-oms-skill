# Print Shipping Label

Source: https://docs.omnium.no/docs/Order/workflow-steps/shipments/print-shipping-label

> Print shipping label via cloud print integration with the shipping provider.

## Overview

The **Print Shipping Label** step sends a print request to the shipping provider's cloud print service. This enables automatic label printing without manual download and print steps.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `PrintShippingLabel` |
| **Group** | Shipments |
| **Applicable Statuses** | Ship, Completed |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Determines the shipment to print:
    *   Uses current shipment if at shipment level
    *   Uses first shipment if order has only one shipment
2.  Validates shipment exists
3.  Validates `ProviderInternalConsignmentId` is set
4.  Checks if already printed (`IsPrinted` property)
5.  Sends a print request to the shipping provider's cloud print service
6.  Marks shipment as printed on success

### Prerequisites

*   Shipment must have consignment ID (booking created)
*   Shipping provider must support cloud print
*   Label must not already be printed

### Side Effects

*   Print request sent to shipping provider
*   `IsPrinted` property set to true on success
*   Physical label printed on configured printer

## Business Cases

### When to Use

*   **Automated fulfillment**: Print labels without user interaction
*   **Warehouse automation**: Integrate with pick/pack systems
*   **Batch printing**: Print labels for multiple orders

### Example Scenarios

**Scenario 1: Successful Print** Shipment has consignment ID. Step sends print request, label prints on warehouse printer.

**Scenario 2: No Consignment** Booking not yet created. Step returns warning that consignment ID is missing.

**Scenario 3: Already Printed** Label was previously printed. Step returns warning to prevent duplicate printing.

**Scenario 4: Print Failed** Provider returns error. Step returns warning with error message.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No shipment | Warning | Yes |
| No consignment ID | Warning | Yes |
| Already printed | Warning | Yes |
| Print successful | Success | Yes |
| Print failed | Warning | Yes |

## Related Steps

*   [Complete Shipment](complete-shipment.md) - Creates consignment first
*   [Create Return Shipment Booking](create-return-shipment-booking.md) - For return labels
