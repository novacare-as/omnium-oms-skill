# Enrich Order with Customer Properties

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-order-with-customer-properties

> Copy custom properties from the customer record to the order.

## Overview

The **Enrich Order with Customer Properties** step retrieves custom properties from the customer record and copies them to the order. This enables customer-specific data to flow to order processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichOrderWithCustomerProperties` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Retrieves customer record for the order
2.  Copies custom properties from customer to order
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must be associated with a customer
*   Customer must have custom properties

### Side Effects

*   Order properties populated from customer
*   Customer preferences available on order
*   Enables customer-specific processing

## Business Cases

### When to Use

*   **Customer preferences**: Copy delivery preferences
*   **B2B settings**: Include payment terms, credit limits
*   **Marketing data**: Include segment or tier information

### Example Scenarios

**Scenario 1: Delivery Preferences** Customer has "PreferredDeliveryTime" property. Copied to order for carrier instructions.

**Scenario 2: B2B Terms** Customer has "PaymentTerms" and "CreditLimit". Copied for invoice processing.

**Scenario 3: Guest Order** Order has no customer record. Step skips with no changes.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| No customer | Success (invisible, no changes) | Yes |

## Related Steps

*   [Enrich Order with Customer External IDs](enrich-order-with-customer-external-ids.md) - External ID enrichment
*   [Enrich B2B Customer ID](enrich-b2b-customer-id.md) - B2B customer linking
