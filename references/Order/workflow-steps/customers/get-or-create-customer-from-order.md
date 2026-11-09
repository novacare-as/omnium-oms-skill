# Get or Create Customer From Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/customers/get-or-create-customer-from-order

> Create or update customer records from order data.

## Overview

The **Get or Create Customer From Order** step creates a new customer record or updates an existing one based on order data. This ensures customer data is captured in the CRM from every order.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `GetOrCreateCustomerFromOrder` |
| **Group** | Customers |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `Connector` | String | No | \- | Specific customer connector to use |
| `UseOrderSearch` | Boolean | No | false | Use order search to determine if customer is new |

## Behavior

### What It Does

1.  Skips execution in test mode
2.  Checks tenant customer settings for B2B/B2C restrictions
3.  If both B2B and B2C creation are disabled, returns success
4.  Respects market type (B2B markets with disabled B2B creation)
5.  Looks up existing customer by email or creates a new customer record
6.  Determines if customer is new:
    *   With `UseOrderSearch`: Checks for previous orders
    *   Without: Checks if customer was created in last 5 minutes
7.  Sets `order.IsNewCustomer` flag
8.  Adds/updates customer in appropriate service (Private or Business)
9.  Logs customer events (Added or Updated)
10.  Updates order with customer data (PaymentTermsNet, CustomerName, CustomerEmail, CustomerPhone)
11.  Sets `IsPriority` on order if customer is priority

### Prerequisites

*   Customer service must be configured
*   Tenant customer settings should be configured

### Side Effects

*   Customer record created or updated
*   Order enriched with customer data
*   Customer events logged
*   `IsNewCustomer` flag set on order

## Business Cases

### When to Use

*   **CRM integration**: Capture customer data from orders
*   **Customer identification**: Create customer records for guest checkouts
*   **Data enrichment**: Update orders with customer information

### Example Scenarios

**Scenario 1: New Customer** Order from new email address. Customer created, `IsNewCustomer=true`, event logged.

**Scenario 2: Existing Customer** Order from known customer. Customer updated, `IsNewCustomer=false`, order enriched.

**Scenario 3: B2B Customer on B2B Market** Order on B2B market. Business customer created/updated if B2B creation enabled.

**Scenario 4: Priority Customer** Customer has `IsPriority=true`. Order's `OrderForm.IsPriority` set to true.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Test mode | Success (skipped) | Yes |
| B2B and B2C disabled | Success (skipped) | Yes |
| Customer type disabled | Success (skipped) | Yes |
| Customer created/updated | Success | Yes |
| Exception | Error | Yes |

## Related Steps

*   [Enrich Order With Customer Properties](../enrichment/enrich-order-with-customer-properties.md) - Enrich order from customer
*   [Enrich Order With Customer External IDs](../enrichment/enrich-order-with-customer-external-ids.md) - Add customer external IDs
