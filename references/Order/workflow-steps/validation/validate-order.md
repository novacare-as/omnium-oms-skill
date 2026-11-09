# Validate Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/validate-order

> Run order validators to verify order data integrity and business rules.

## Overview

The **Validate Order** step runs configured order validators against the order to ensure it meets business rules and data integrity requirements. Validators can be run individually via connector or all registered validators at once.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ValidateOrder` |
| **Group** | Validation |
| **Applicable Statuses** | New, InProgress, Completed, OrderCanceled, Ship, Returned, ReadyForPickup |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `Connector` | String | No | \- | Specific validator connector to use (if omitted, runs all validators) |

## Behavior

### What It Does

1.  Checks if a specific connector is configured
2.  If connector specified:
    *   Creates validator instance from factory using connector name
    *   Runs single validator's `Validate()` method
    *   Returns validation errors if validation fails
3.  If no connector specified:
    *   Creates all registered validator instances
    *   Runs each validator against the order
4.  Returns success or error based on validation results

### Prerequisites

*   Order validators must be registered in the system

### Side Effects

*   No direct modifications to order
*   Validation results returned for workflow decision

## Business Cases

### When to Use

*   **Data integrity checks**: Ensure order data is complete before processing
*   **Business rule validation**: Verify orders meet business requirements
*   **Pre-export validation**: Validate order before sending to external systems

### Example Scenarios

**Scenario 1: All Validators** No connector configured. All registered validators run sequentially.

**Scenario 2: Specific Validator** Connector set to "ERPValidator". Only the ERP-specific validator runs.

**Scenario 3: Validation Failure** Validator finds missing required field. Returns error with validation message.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Validation passes | Success | Yes |
| Validation fails | Error with message | Yes |
| Exception thrown | Error with exception message | Yes |

## Related Steps

*   [Check For Fraud](check-for-fraud.md) - Fraud validation
*   [Validate Serial Numbers](validate-serial-numbers.md) - Serial number validation
