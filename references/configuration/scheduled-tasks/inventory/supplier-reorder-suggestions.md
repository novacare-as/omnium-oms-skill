# Supplier Reorder Suggestions

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/inventory/supplier-reorder-suggestions

> Update supplier records with reorder recommendations

## Overview

This task aggregates product reorder suggestions by supplier and updates supplier records with summarized replenishment recommendations. This enables procurement workflows by providing a supplier-centric view of which products need to be reordered and in what quantities.

## Identifier

| Property | Value |
| --- | --- |
| **Implementation Type** | `SupplierReorderSuggestionsScheduledTask` |
| **Group** | Inventory |
| **Type** | Delta |

* * *

## When to Use

Enable this task when you:

*   Want supplier records to include aggregated reorder suggestions
*   Use the supplier list view for procurement planning
*   Need to identify which suppliers require purchase orders
*   Want to streamline the reordering workflow

* * *

## Configuration Properties

This task has no configurable properties.

* * *

## Behavior

### What It Does

1.  Iterates through all suppliers in the system
2.  For each supplier, retrieves reorder suggestions from the analytics engine
3.  Aggregates suggestions by warehouse/store location
4.  Updates the supplier record with summarized reorder data
5.  Clears reorder suggestions from suppliers that no longer have any

### Aggregated Data per Supplier

Each supplier's reorder suggestions include per-warehouse breakdowns with:

*   **Warehouse Code**: The location requiring stock
*   **Quantity**: Total units currently in stock
*   **Reorder Quantity**: Recommended quantity to order
*   **Count**: Number of distinct products needing reorder
*   **Orders to Purchase**: Pending orders requiring this stock
*   **Suggested Reorder Quantity**: System-calculated optimal order quantity

### Prerequisites

*   The Analytics Reorder Suggestions task must have run to generate source data
*   Suppliers must be defined and linked to products
*   Products must have supplier associations

### Data Source

This task consumes data from the analytics reorder suggestion engine, which analyzes:

*   Current inventory levels vs. minimum stock thresholds
*   Historical sales velocity
*   Pending orders requiring allocation
*   Lead times and safety stock requirements

### Side Effects

*   Updates the `ReorderSuggestions` property on supplier records
*   Suppliers with no reorder needs have this property set to null
*   Does not modify product, inventory, or analytics data

* * *

## Example Configuration

```json
{
    "ImplementationType": "SupplierReorderSuggestionsScheduledTask",
    "Schedule": "0 4 * * *",
    "IsDisabled": false
}
```

* * *

## Recommended Schedule

Run daily during off-peak hours (`0 4 * * *` - 4:00 AM), after the analytics reorder suggestions task has completed. Procurement planning is typically done daily, so once-per-day execution is usually sufficient.

Schedule this task to run after:

*   Analytics Reorder Suggestions (Full or Delta)
*   Inventory sync tasks (if using external inventory sources)

* * *

## Related Tasks

*   [Analytics Reorder Suggestions](../analytics/analytics-reorder-suggestions.md) - Generates the source reorder data (dependency)
*   [Analytics Reorder Suggestions Delta](../analytics/analytics-reorder-suggestions-delta.md) - Updates reorder data based on inventory changes
