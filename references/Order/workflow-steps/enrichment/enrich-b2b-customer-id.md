# Enrich B2B Customer ID

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-b2b-customer-id

> Enrich order with B2B customer identifier for business customers.

## Overview

The **Enrich B2B Customer ID** step sets the B2B customer identifier on orders for business customers. This enables proper B2B order processing and customer association.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichB2BCustomerId` |
| **Group** | Customers |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Looks up B2B customer based on order data
2.  Sets B2B customer identifier on the order
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order should be a B2B order
*   B2B customer must exist in the system

### Side Effects

*   Order B2B customer ID set
*   Enables B2B-specific pricing and terms
*   Links order to customer account

## Business Cases

### When to Use

*   **B2B orders**: Process business customer orders
*   **Account linking**: Associate orders with customer accounts
*   **Credit terms**: Enable invoice/credit payment

### Example Scenarios

**Scenario 1: B2B Order** Business customer places order. Step looks up and links the B2B customer account.

**Scenario 2: Consumer Order** Regular consumer order. Step may skip or set no B2B ID.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| Customer not found | Success (invisible) | Yes |

## Related Steps

*   [Enrich Order with Customer Properties](enrich-order-with-customer-properties.md) - Customer property enrichment
*   [Get or Create Customer from Order](../customers/get-or-create-customer-from-order.md) - Customer creation
