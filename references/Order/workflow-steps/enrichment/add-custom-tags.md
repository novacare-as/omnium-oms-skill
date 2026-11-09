# Add Custom Tags

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/add-custom-tags

> Add configured custom tags to the order.

## Overview

The **Add Custom Tags** step adds specific tags to orders based on workflow step configuration. This enables adding fixed tags through workflow without code changes.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddCustomTags` |
| **Group** | Enrich |
| **Applicable Statuses** | New, InProgress, Completed, OrderCanceled, Ship, Returned, ReadyForPickup |
| **Hidden** | Yes |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `AddTag` | String | Yes | \- | Tag value to add (can specify multiple) |

## Behavior

### What It Does

1.  Gets all properties named "AddTag" from workflow step configuration
2.  Collects tag values from those properties
3.  Adds each tag to order (avoiding duplicates)
4.  Returns error if no tags configured

### Prerequisites

*   At least one `AddTag` property must be configured

### Side Effects

*   Tags added to order
*   Duplicates avoided

## Business Cases

### When to Use

*   **Status-based tagging**: Add tags at specific workflow points
*   **Fixed tags**: Add known tags without code
*   **Integration markers**: Tag orders for external systems

### Example Scenarios

**Scenario 1: Single Tag** Configure `AddTag=PROCESSED`. Order gets "PROCESSED" tag.

**Scenario 2: Multiple Tags** Configure multiple `AddTag` properties: "EXPORTED", "VERIFIED". Both added.

**Scenario 3: Duplicate Prevention** Order already has tag "EXPORTED". Step skips that tag, adds others.

**Scenario 4: No Tags Configured** No `AddTag` properties. Step returns error.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Tags added | Success | Yes |
| No tags configured | Error | Depends on StopOnError |

## Related Steps

*   [Add Order Tags](add-order-tags.md) - Calculated tags
*   [Add Order Tags by Category ID](add-order-tags-by-category-id.md) - Category-based tags
