# Set Custom Order Data

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/set-custom-order-data

> Enrich order using a custom connector implementation.

## Overview

The **Set Custom Order Data** step uses a custom connector to enrich the order with additional data. This enables tenant-specific enrichment logic through custom implementations.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetCustomOrderData` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step requires a **Connector** to be configured on the workflow step.

## Behavior

### What It Does

1.  Validates that a connector is configured
2.  Invokes the custom connector implementation to enrich the order
3.  Removes any previous error for this connector on success
4.  Adds error to order if operation fails

### Prerequisites

*   Connector must be specified on workflow step
*   Custom service implementation must exist for the connector

### Side Effects

*   Order enriched with custom data
*   Error tracking on order
*   Depends on custom implementation

## Business Cases

### When to Use

*   **Custom integration**: Tenant-specific data enrichment
*   **External lookups**: Fetch data from external systems
*   **Complex logic**: Implement business-specific rules

### Example Scenarios

**Scenario 1: Custom Pricing** Connector "CustomPricing" enriches order with customer-specific prices from external system.

**Scenario 2: Address Validation** Connector "AddressValidation" validates and enriches shipping addresses.

**Scenario 3: Missing Connector** No connector configured. Step returns error.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No connector | Error | Yes |
| Success | Success | Yes |
| Service error | Error | Depends on StopOnError |

## Related Steps

*   [Enrich Order from Products](enrich-order-from-products.md) - Standard product enrichment
