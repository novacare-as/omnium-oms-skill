# Create Subscriptions

Source: https://docs.omnium.no/docs/Order/workflow-steps/subscriptions/create-subscriptions

> Create subscriptions from order lines containing subscription products.

## Overview

The **Create Subscriptions** step creates subscription records from order line items that contain subscription-type products. This enables recurring order functionality.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateSubscriptions` |
| **Group** | Subscriptions |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `productType` | String | Yes | \- | Product type identifier for subscription products |

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Gets `productType` from configuration (returns error if missing)
3.  Scans order lines for products matching the specified subscription type
4.  Creates subscription records for matching products and links them to the customer
5.  If no subscription created (no matching products), returns success with message
6.  If subscription created, returns success

### Prerequisites

*   `productType` must be configured
*   Order must contain products of the specified subscription type

### Side Effects

*   Subscription record created for the customer
*   Subscription linked to the order

## Business Cases

### When to Use

*   **Recurring products**: Set up subscriptions for products with regular delivery
*   **Membership products**: Create memberships from product purchases
*   **Service subscriptions**: Enable recurring service orders

### Example Scenarios

**Scenario 1: Subscription Created** Order contains subscription product type "Monthly". Subscription created and linked to customer.

**Scenario 2: No Subscription Products** Order contains no products of configured type. Returns success with "No subscription created".

**Scenario 3: Missing Product Type** `productType` not configured. Returns error.

**Scenario 4: Test Mode** Running in test mode. Subscription creation skipped, success returned.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| Subscription created | Success | Yes |
| No subscription products | Success | Yes |
| productType missing | Error | Yes |
| Exception | Error | Yes |

## Related Steps

*   [Create Replacement Subscription Orders](create-replacement-subscription-orders.md) - Handle cancelled subscription orders
