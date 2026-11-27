# Enrich Order with Customer External IDs

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/enrich-order-with-customer-external-ids

> Copy external IDs from the customer record to the order.

## Overview

The **Enrich Order with Customer External IDs** step retrieves external system IDs from the customer record and copies them to the order. This enables ERP and CRM integration using customer identifiers.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `EnrichOrderWithCustomerExternalIds` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Retrieves customer record for the order
2.  Copies external IDs from customer to order's external IDs
3.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

*   Order must be associated with a customer
*   Customer must have external IDs configured

### Side Effects

*   Order external IDs populated from customer
*   Enables ERP export with customer references
*   Links order to customer in external systems

## Business Cases

### When to Use

*   **ERP integration**: Export orders with customer numbers
*   **CRM linking**: Associate orders with CRM contacts
*   **Loyalty systems**: Include loyalty ID on orders

### Example Scenarios

**Scenario 1: ERP Customer Number** Customer has SAP customer number. Step copies to order for SAP export.

**Scenario 2: Multiple External IDs** Customer has IDs for SAP, Salesforce, and loyalty system. All copied to order.

**Scenario 3: Guest Order** Order has no customer record. Step skips with no changes.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success (invisible) | Yes |
| No customer | Success (invisible, no changes) | Yes |

## Related Steps

*   [Enrich Order with Customer Properties](enrich-order-with-customer-properties.md) - Property enrichment
*   [Get or Create Customer from Order](../customers/get-or-create-customer-from-order.md) - Create customer first
