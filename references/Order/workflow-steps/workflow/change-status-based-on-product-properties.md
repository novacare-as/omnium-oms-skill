# Change Status Based On Product Properties

Source: https://docs.omnium.no/docs/Order/workflow-steps/workflow/change-status-based-on-product-properties

> Conditionally change order status based on product property values.

## Overview

The **Change Status Based On Product Properties** step changes the order status if any order line item has specific property values. This enables conditional routing based on product characteristics.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ChangeStatusBasedOnProductProperties` |
| **Group** | Modify |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `PropertyKeys` | String | Yes | \- | Comma-separated property keys to check |
| `PropertyValues` | String | Yes | \- | Comma-separated values to match (same order as keys) |
| `ChangeToStatus` | String | Yes | \- | Status to change to if match found |

## Behavior

### What It Does

1.  Parses `PropertyKeys` and `PropertyValues` from configuration
2.  Returns warning if keys or values are missing/mismatched
3.  Returns warning if `ChangeToStatus` is not specified
4.  For each order line item:
    *   Checks custom properties for key/value matches
    *   Uses reflection to check model properties if no custom match
    *   Supports scalar values, string lists, and complex objects
5.  If any line item matches any key/value pair:
    *   Returns with `TriggerNewStatus` set to `ChangeToStatus`
6.  If no matches found:
    *   Returns invisibly with no status change

### Prerequisites

*   All three configuration properties must be set
*   Property keys and values must have matching counts

### Side Effects

*   May trigger status change if matching products found
*   Uses caching for property reflection (performance optimization)

## Business Cases

### When to Use

*   **Product-based routing**: Route orders with specific products differently
*   **Special handling**: Trigger different workflows for hazmat, oversized, etc.
*   **Category routing**: Route based on product category or type

### Example Scenarios

**Scenario 1: Hazmat Product** `PropertyKeys=IsHazmat`, `PropertyValues=true`, `ChangeToStatus=HazmatReview`. Order with hazmat products goes to review.

**Scenario 2: Multiple Properties** `PropertyKeys=Category,Brand`, `PropertyValues=Electronics,Apple`. Matches if any product has Category=Electronics OR Brand=Apple.

**Scenario 3: No Match** No products match the criteria. No status change, step runs invisibly.

**Scenario 4: Custom Property** Checks order line's custom `Properties` collection first, then falls back to model properties.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Match found | Success (triggers status) | Yes |
| No match | Success (invisible) | Yes |
| PropertyKeys missing | Warning | Yes |
| PropertyValues missing/mismatched | Warning | Yes |
| ChangeToStatus missing | Warning | Yes |

## Related Steps

*   [Change Status](change-status.md) - Unconditional status change
*   [Add Order Tags By Category ID](../enrichment/add-order-tags-by-category-id.md) - Tag-based routing alternative
