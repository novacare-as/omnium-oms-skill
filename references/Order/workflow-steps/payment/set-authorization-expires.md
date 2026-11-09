# Set Authorization Expires

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/set-authorization-expires

> Calculate and set payment authorization expiration dates from payment provider settings.

## Overview

The **Set Authorization Expires** step calculates when payment authorizations will expire based on payment provider configuration. This information is used to prioritize orders that need to be processed before their payment authorization expires.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetAuthorizationExpires` |
| **Group** | Payments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties. Expiration periods are determined by payment provider configuration.

## Behavior

### What It Does

1.  Validates order has payments
2.  Calculates expiration dates based on payment provider configuration
3.  Sets expiration dates on payment records based on provider settings

### Prerequisites

*   Order must have at least one payment
*   Payment providers must have authorization expiration configured

### Side Effects

*   Sets authorization expiration dates on payment records
*   Enables filtering/sorting by expiration in Omnium UI

## Business Cases

### When to Use

*   **Order prioritization**: Identify orders needing urgent processing before auth expires
*   **Payment method awareness**: Different methods have different expiration periods
*   **Operational visibility**: Show expiring payments in dashboards

### Example Scenarios

**Scenario 1: Standard Expiration** Klarna authorization expires in 28 days. Step sets expiration date 28 days from authorization.

**Scenario 2: Short Expiration** Vipps authorization expires in 7 days. Step sets closer expiration requiring faster processing.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No payments | Warning | Yes |
| Successful | Success | Yes |
| Exception | Error (workflow continues) | Yes |

## Related Steps

*   [Remove Authorization Expires](remove-authorization-expires.md) - Clears expiration after capture
*   [Capture Payments](capture-payments.md) - Should happen before expiration
