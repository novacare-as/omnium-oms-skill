# Product Cost in Default Currency

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/product-cost-default-currency

> Calculate and update product cost in the default currency

## Overview

This task converts product costs from their original currencies to a configured default cost currency. This enables consistent cost comparisons, margin calculations, and reporting across products that may have costs defined in different currencies.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `ProductCostInDefaultCurrencyScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Have products with costs in multiple currencies
*   Need a standardized cost field for reporting and analysis
*   Want to calculate margins using a consistent currency
*   Require currency-normalized cost data for business intelligence

* * *

## Configuration Properties

This task has no configurable properties. The default cost currency is configured in tenant settings.

### Required Tenant Setting

The task requires the following setting to be configured:

```
ProductSettings.DefaultProductCostCurrency
```

This should be set to a valid currency code (e.g., "NOK", "EUR", "USD").

* * *

## Behavior

### What It Does

1.  Retrieves the default cost currency from tenant settings
2.  Iterates through all products in the catalog
3.  For each product with a cost:
    *   Converts the cost from the product's cost currency to the default currency
    *   Updates the `CostInDefaultCurrency` field if the converted value differs
    *   Sets the field to null if the converted value is zero
4.  Saves updated products in batches

### Conversion Logic

*   Uses the system's currency conversion service with current exchange rates
*   Only processes products that have a non-zero cost defined
*   Skips products where both the original cost and the default currency cost are zero or null
*   Products with zero converted cost have the field cleared (set to null)

### Prerequisites

*   `DefaultProductCostCurrency` must be configured in tenant settings
*   Products must have cost and cost currency defined
*   Currency conversion rates must be available for the relevant currency pairs

### Error Handling

If no default cost currency is configured, the task fails with the message "No default cost currency is set".

### Side Effects

*   Updates the `CostInDefaultCurrency` field on product records
*   Only products with changed values are saved (minimizes write operations)
*   Does not affect the original cost or cost currency fields

* * *

## Example Configuration

```json
{
    "ImplementationType": "ProductCostInDefaultCurrencyScheduledTask",
    "Schedule": "0 3 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 3 * * *` - 3:00 AM). Exchange rates and product costs typically don't change frequently enough to warrant more frequent execution.

Consider running more frequently if:

*   Exchange rates are updated multiple times per day
*   Real-time margin calculations are critical to operations

* * *

## Related Tasks

*   [Add Cost and Currency to Inventory](add-cost-currency-to-inventory.md) - Propagates cost data to inventory items
*   [Inventory Value](inventory-value.md) - Uses cost data for inventory valuation
