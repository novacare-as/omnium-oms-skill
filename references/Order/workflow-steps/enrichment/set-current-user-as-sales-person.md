# Set Current User as Sales Person

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/set-current-user-as-sales-person

> Assign the current user as the sales person for the order.

## Overview

The **Set Current User as Sales Person** step assigns the currently logged-in user as the sales person for the order. This is useful for manual order processing where the handling user should get sales credit.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetCurrentUserAsSalesPerson` |
| **Group** | Enrich |
| **Applicable Statuses** | InProgress |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Checks if order already has a sales person assigned
2.  If no sales person, gets current user from context
3.  Sets `SalesPersonId` to current user's email (lowercase)
4.  Sets `SalesPersonName` to current user's name
5.  Returns warning if sales person was already set

### Prerequisites

*   User must be logged in
*   Current context must have user information

### Side Effects

*   Order `SalesPersonId` set
*   Order `SalesPersonName` set
*   Sales attribution assigned

## Business Cases

### When to Use

*   **Manual orders**: Staff-assisted orders get sales credit
*   **Order processing**: Assign handler for commission tracking
*   **In-store orders**: Track which employee assisted

### Example Scenarios

**Scenario 1: Manual Processing** User "[john@company.com](mailto:john@company.com)" processes order. Step assigns John as sales person.

**Scenario 2: Already Assigned** Order already has sales person from POS. Step returns warning, preserves existing.

**Scenario 3: No User Context** Background process without user. Step may skip or leave empty.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Sales person set | Success | Yes |
| Already assigned | Warning | Yes |

## Related Steps

*   [Enrich Order from Products](enrich-order-from-products.md) - General enrichment
