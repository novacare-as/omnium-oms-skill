# Default Provider

Source: https://docs.omnium.no/docs/Inventory/inventory-value/default-provider

> Simple inventory valuation using a single cost per product

The Default Inventory Value Provider is the simplest valuation method in Omnium. It uses a single cost value per inventory item without tracking individual batches.

**Provider Key:** `DefaultInventoryValueProvider`

* * *

## Overview

The Default provider calculates inventory value using a straightforward formula:

```
Inventory Value = Unit Cost x Quantity
```

This provider is automatically used when no other provider is configured in tenant settings.

* * *

## How It Works

### Receiving Inventory

When inventory is received with a cost:

1.  The item's cost is updated to the new cost (if provided)
2.  The item's cost currency is updated (if provided)
3.  The total inventory value is recalculated

If no cost is provided in the update, the existing item cost is used.

### Reducing Inventory

When inventory is reduced (sales, returns, adjustments):

1.  The existing item cost is applied to the update
2.  The total inventory value is recalculated

The same cost is used regardless of when the inventory was originally received.

### Cost Updates

The provider follows these rules for cost assignment:

| Condition | Action |
| --- | --- |
| Update has cost + currency | Use update values, update item |
| Update has no cost, item has cost | Use item values, copy to update |
| Neither has cost | No cost assigned |

* * *

## Example Scenarios

### Scenario 1: Receiving with Cost

**Initial state:**

*   Inventory: 0 units
*   Cost: $0

**Receive 100 units at $10 each:**

*   Inventory: 100 units
*   Cost: $10
*   Inventory Value: $1,000

### Scenario 2: Receiving Without Cost

**Initial state:**

*   Inventory: 100 units
*   Cost: $10

**Receive 50 units (no cost specified):**

*   Inventory: 150 units
*   Cost: $10 (unchanged)
*   Inventory Value: $1,500

### Scenario 3: Reducing Inventory

**Initial state:**

*   Inventory: 150 units
*   Cost: $10

**Ship 25 units:**

*   Inventory: 125 units
*   Cost: $10
*   Inventory Value: $1,250
*   Cost per shipped unit: $10

### Scenario 4: Cost Change

**Initial state:**

*   Inventory: 100 units
*   Cost: $10
*   Inventory Value: $1,000

**Receive 50 units at $15 each:**

*   Inventory: 150 units
*   Cost: $15 (updated to new cost)
*   Inventory Value: $2,250

Note that in this scenario, the entire inventory is revalued at the new cost. This is a key characteristic of the Default provider that differs from Average and FIFO methods.

* * *

## Characteristics

| Aspect | Behavior |
| --- | --- |
| Batch tracking | None |
| Cost method | Last cost received |
| Currency handling | Single currency per item |
| Exchange rate tracking | None |
| Storage requirements | Minimal |
| Calculation complexity | Very low |

* * *

## Advantages

*   **Simplicity**: Easy to understand and audit
*   **Low overhead**: No batch records to maintain
*   **Fast processing**: Minimal calculations per transaction
*   **Predictable**: Always uses the current cost value

* * *

## Limitations

*   **No cost history**: Previous costs are not retained
*   **Inaccurate COGS**: Cost of goods sold may not reflect actual purchase costs
*   **Revaluation effect**: Receiving at a new cost changes the value of all existing inventory
*   **No multi-currency tracking**: Exchange rates are not preserved

* * *

## When to Use

The Default provider is appropriate when:

*   Product costs are stable and rarely change
*   Detailed cost tracking is not required
*   You have simple inventory operations
*   Historical cost analysis is not needed
*   You want minimal storage and processing overhead

* * *

## Configuration

```json
{
  "InventoryManagement": {
    "IsEnabled": true,
    "IsWriteEnabled": true,
    "InventoryValueProviders": [
      {
        "Key": "DefaultInventoryValueProvider"
      }
    ]
  }
}
```

Since this is the default provider, you can also omit the `InventoryValueProviders` configuration entirely.

* * *

## Related Topics

*   [Inventory Value Overview](../inventory-value.md)
*   [Average Cost Provider](average-provider.md)
*   [FIFO Provider](fifo-provider.md)
