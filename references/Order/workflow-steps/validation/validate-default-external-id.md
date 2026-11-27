# Validate Default External ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/validate-default-external-id

> Validate that the required default external ID exists on the order.

## Overview

The **Validate Default External ID** step validates that the order has the required default external ID for its order type. This ensures orders have proper external system identifiers before export.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ValidateDefaultExternalId` |
| **Group** | Validation |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties. The default external ID provider is determined by the order type configuration in tenant settings.

## Behavior

### What It Does

1.  Gets the default external ID provider from order type configuration
2.  If a default provider is configured:
    *   Looks for an external ID with matching provider name
    *   If not found or empty, returns error and cancels workflow
3.  If no default provider configured:
    *   Returns success (validation not required)

### Prerequisites

*   Order type must be configured in tenant settings
*   Default external ID provider must be set in order type configuration

### Side Effects

*   May cancel workflow if validation fails

## Business Cases

### When to Use

*   **ERP integration**: Ensure order has ERP reference before processing
*   **External system sync**: Verify external system IDs exist
*   **Export validation**: Gate exports on external ID presence

### Example Scenarios

**Scenario 1: External ID Exists** Order type requires "ERP" external ID. Order has ExternalIds with ProviderName="ERP" and valid ID. Validation passes.

**Scenario 2: External ID Missing** Order type requires "ERP" external ID. Order doesn't have matching external ID. Workflow cancelled.

**Scenario 3: No Default Configured** Order type has no default external ID provider configured. Validation passes (not required).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| External ID found | Success | Yes |
| External ID missing | Error | No (cancels workflow) |
| No default provider configured | Success | Yes |

## Related Steps

*   [Set Default External ID](../enrichment/set-default-external-id.md) - Set the default external ID
*   [Generate External ID](../enrichment/generate-external-id.md) - Generate external IDs
