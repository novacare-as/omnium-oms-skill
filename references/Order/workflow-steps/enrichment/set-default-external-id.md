# Set Default External ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/set-default-external-id

> Set external ID on order from the order type configuration.

## Overview

The **Set Default External ID** step sets an external ID on the order based on the default external ID provider configured for the order type. This prepares the order for export to external systems.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetDefaultExternalId` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties. Configuration is in order type settings.

## Behavior

### What It Does

1.  Gets tenant settings for order types
2.  Finds the order type matching the order's `OrderType`
3.  Gets `DefaultExternalIdProvider` from the order type config
4.  If configured, sets an empty external ID with that key
5.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must have an order type
*   Order type must have `DefaultExternalIdProvider` configured

### Side Effects

*   External ID slot created on order
*   Prepares order for ID generation
*   Key comes from order type configuration

## Business Cases

### When to Use

*   **ERP preparation**: Set up external ID before generation
*   **Order type routing**: Different order types use different IDs
*   **Export preparation**: Prepare for external system integration

### Example Scenarios

**Scenario 1: Standard Order** Order type "WebOrder" has `DefaultExternalIdProvider=SAP`. Step creates SAP external ID slot.

**Scenario 2: POS Order** Order type "POSOrder" has `DefaultExternalIdProvider=RETAIL`. Step creates RETAIL external ID slot.

**Scenario 3: No Config** Order type doesn't have external ID configured. Step does nothing.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| ID set | Success (invisible) | Yes |
| No config | Success (invisible, no changes) | Yes |

## Related Steps

*   [Generate External ID](generate-external-id.md) - Generate actual ID value
*   [Validate Default External ID](../validation/validate-default-external-id.md) - Validate the ID
