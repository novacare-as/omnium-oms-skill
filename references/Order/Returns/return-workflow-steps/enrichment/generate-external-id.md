# Generate External ID

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/enrichment/generate-external-id

> Create a unique external identifier for the return.

## Overview

The **Generate External ID** step creates a unique external identifier for the return. This ID can be used for integration with external systems that require their own reference numbers.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `GenerateExternalId` |
| **Group** | Enrichment |

## Configuration Properties

This step has no configurable properties. Configuration is in the market's number options for the `UniqueExternalId` type.

## Behavior

### What It Does

1.  Gets number options for the `UniqueExternalId` type from market configuration
2.  Generates the next sequential ID from the configured number service
3.  Stores the ID in the return's external IDs collection

### Prerequisites

*   Market must have number options configured for `UniqueExternalId`
*   Number service must be available

### Side Effects

*   Adds external ID to return
*   Increments ID sequence if applicable

## Business Cases

### When to Use

*   Creating references for ERP systems
*   Generating IDs for third-party integrations
*   When external systems need their own reference numbers
*   Multi-system synchronization

### Example Scenarios

**ERP Reference** Generate external ID "ERP-RET-2024-001" for syncing to an enterprise system.

**Fulfillment System** Generate external ID "WMS-RET-12345" for a warehouse management system.

## Sample Configuration

```json
{
  "Name": "GenerateExternalId",
  "Active": true,
  "TranslateKey": "WorkflowStep_GenerateExternalId"
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| ID generated | Success | Yes |
| ID already exists | Warning | Yes |
| No number options | Error | Depends on StopOnError |
| Generation failed | Error | Depends on StopOnError |

## Related Steps

*   [Ensure RMA](ensure-rma.md) - Different tracking number for customer-facing use
*   [Export Order](../export/export-order.md) - Use external ID when exporting
