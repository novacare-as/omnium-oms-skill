# Generate External ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/generate-external-id

> Generate a unique external ID for the order using configured number service.

## Overview

The **Generate External ID** step generates a unique external identifier for the order using the configured number service. This creates IDs for ERP systems and external integrations.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `GenerateExternalId` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties. Configuration is in market number options.

## Behavior

### What It Does

1.  Gets number options for `UniqueExternalId` type from market configuration
2.  Validates number options exist and have a key
3.  Checks if external ID already exists (returns warning if so)
4.  Generates the next sequential ID from the configured number service
5.  Sets external ID on order with the generated value
6.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Market must have number options configured for `UniqueExternalId`
*   Number service must be available

### Side Effects

*   Unique external ID generated
*   External ID set on order
*   Number sequence incremented

## Business Cases

### When to Use

*   **ERP integration**: Generate order numbers for SAP, NAV, etc.
*   **Unique identifiers**: Create sequential external IDs
*   **System integration**: Generate IDs for external systems

### Example Scenarios

**Scenario 1: Standard Generation** Market configured with sequential number service. Step generates "SAP-10001" as external ID.

**Scenario 2: Already Has ID** Order already has external ID. Step returns warning, doesn't overwrite.

**Scenario 3: Missing Config** Market doesn't have number options. Step returns error.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| ID generated | Success (invisible) | Yes |
| Already has ID | Warning (invisible) | Yes |
| No number options | Error (invisible) | Yes |
| Generation failed | Error (invisible) | Yes |

## Related Steps

*   [Set Default External ID](set-default-external-id.md) - Set ID key first
*   [Validate Default External ID](../validation/validate-default-external-id.md) - Validate generated ID
