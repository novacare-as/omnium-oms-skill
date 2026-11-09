# Update Customer Club

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/customers/update-customer-club

> Reverse customer loyalty points earned on the original order when items are returned.

## Overview

The **Update Customer Club** step reverses customer loyalty program points when returns are processed. It reverses points that were earned on the original purchase and records a cancellation transaction. Membership tier recalculation is handled by a separate workflow step.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `UpdateCustomerClub` |
| **Group** | Customers |

## Configuration Properties

This step has no configurable properties. Point calculations follow the loyalty program rules configured for the tenant.

## Behavior

### What It Does

1.  Retrieves customer's loyalty membership
2.  Calculates points earned on returned items from original order
3.  Deducts those points from customer's balance
4.  Records a point cancellation transaction

### Prerequisites

*   Customer must be a loyalty program member
*   Original order must have tracked point earnings
*   Loyalty program configuration must be active

### Side Effects

*   Reduces customer's point balance
*   Creates point cancellation record
*   Updates customer's loyalty status

## Business Cases

### When to Use

*   Reversing loyalty points on returns
*   Maintaining accurate point balances
*   Loyalty program integrity

### Example Scenarios

**Simple Point Reversal** Customer earned 150 points on $150 order. Returns full order. Step deducts 150 points from balance.

**Partial Return** Customer earned 150 points on order, returns items worth $50 (50 points). Step deducts 50 points, leaving 100 points from original purchase.

**Bonus Points** Original order had 2x points promotion (earned 300 points on $150). Return reverses the full 300 bonus points.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Points updated | Success | Yes |
| Customer not a member | Success (no action) | Yes |
| No points to reverse | Success (no action) | Yes |
| Loyalty service error | Error | Depends on StopOnError |

## Related Steps

*   [Credit Return](../payment/credit-return.md) - Often processed together
*   [Update Order Status](../status/update-order-status.md) - Update order after loyalty adjustment
