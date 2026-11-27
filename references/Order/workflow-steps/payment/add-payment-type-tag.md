# Add Payment Type Tag

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/add-payment-type-tag

> Add order tags based on the payment methods used.

## Overview

The **Add Payment Type Tag** step adds the payment method names as tags on the order. This enables filtering orders by payment type and customizing notifications based on payment method.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddPaymentTypeTagToOrder` |
| **Group** | Payments |
| **Applicable Statuses** | All |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `skipForPaymentTypes` | string | No | Comma-separated list of payment types to skip (not add as tags) |

## Behavior

### What It Does

1.  Checks if order has payments
2.  For each payment method, adds it as a tag (unless in skip list or already present)
3.  Initializes tags array if not present

### Prerequisites

*   Order must have at least one payment

### Side Effects

*   Adds payment method names to order tags
*   Tags can be used for filtering and notification templates

## Business Cases

### When to Use

*   **Notification customization**: Different email templates for different payment methods
*   **Order filtering**: Filter orders by payment type in Omnium UI
*   **Reporting**: Segment orders by payment method

### Example Scenarios

**Scenario 1: Basic Tagging** Order paid with "Klarna". Step adds "Klarna" to order tags.

**Scenario 2: Skip Certain Types** Configure `skipForPaymentTypes = "GiftCard,StoreCredit"` to avoid tagging internal payment types.

**Scenario 3: Multiple Payments** Order has both "Klarna" and "GiftCard" payments. Both are added as tags (unless skipped).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No payments | Warning | Yes |
| Tags added successfully | Success | Yes |

## Related Steps

*   [Add Payment Merchant ID](add-payment-merchant-id.md) - Adds merchant ID to payment properties
*   [Verify Order Payment Method](verify-order-payment-method.md) - Validates payment methods
