# Ensure RMA

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/enrichment/ensure-rma

> Generate a unique RMA (Return Merchandise Authorization) number for the return.

## Overview

The **Ensure RMA** step generates a unique Return Merchandise Authorization (RMA) number for tracking the return. The RMA serves as a reference identifier that can be used on shipping labels, in customer communications, and for warehouse processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnsureRma` |
| **Group** | Enrichment |

## Configuration Properties

This step has no configurable properties. RMA number format and sequence follow the tenant's number sequence configuration.

## Behavior

### What It Does

1.  Checks if the return already has an RMA number
2.  If no RMA exists, generates a new unique number from the configured sequence
3.  Stores the RMA number on the return order
4.  Records the RMA assignment in the return history

### Prerequisites

*   Number sequence for RMA must be configured
*   Return must not already have an RMA (or step skips)

### Side Effects

*   Assigns RMA number to return
*   Increments RMA number sequence
*   Updates return record

## Business Cases

### When to Use

*   At the start of return processing to assign tracking number
*   Before sending customer notifications that include RMA
*   Before generating return shipping labels
*   For warehouse receiving reference

### Example Scenarios

**New Return** Return created without RMA. Step generates "RMA-2024-000123" and stores on return.

**Existing RMA** Return already has RMA "RMA-2024-000100". Step detects existing RMA and skips generation.

**Multiple Markets** Different markets may have different RMA formats (e.g., "NO-RMA-001" for Norway, "SE-RMA-001" for Sweden) based on number sequence configuration.

## RMA Number Formats

Common RMA formats include:

*   `RMA-YYYY-NNNNNN` - Year and sequence number
*   `XX-RMA-NNNNNN` - Market code prefix
*   `NNNNNNNN` - Simple numeric sequence

The format is configured in the tenant's number sequence settings.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| RMA generated | Success | Yes |
| RMA already exists | Success (skipped) | Yes |
| Number sequence not configured | Error | Depends on StopOnError |
| Sequence exhausted | Error | Depends on StopOnError |

## Related Steps

*   [Notification](../notifications/notification.md) - Include RMA in customer communications
*   [Create Return Shipment Booking](../shipments/create-return-shipment-booking.md) - Use RMA on shipping labels
