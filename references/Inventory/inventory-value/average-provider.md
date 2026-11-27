# Average Cost Provider

Source: https://docs.omnium.no/docs/Inventory/inventory-value/average-provider

> Weighted average inventory valuation with batch tracking

The Average Cost Inventory Value Provider calculates inventory value using the weighted average cost method. This approach smooths out price fluctuations by recalculating the average cost each time new inventory is received.

**Provider Key:** `AverageInventoryValueProvider`

* * *

## Overview

The Average Cost method maintains a running weighted average of all inventory costs. When new inventory is received, the average cost is recalculated based on the combined value of existing and incoming inventory.

```
New Average Cost = (Existing Value + Incoming Value) / Total Quantity
```

This provider tracks inventory batches for audit purposes while applying the same average cost to all units.

* * *

## How It Works

### Receiving Inventory

When inventory is received:

1.  Calculate the current total value: `Existing Quantity x Current Average Cost`
2.  Calculate incoming value: `Incoming Quantity x Incoming Cost`
3.  Calculate new total quantity: `Existing Quantity + Incoming Quantity`
4.  Calculate new average cost: `(Current Value + Incoming Value) / New Total Quantity`
5.  Create a batch record with the incoming cost details
6.  Update the item's cost and inventory value

### Reducing Inventory

When inventory is reduced:

1.  Apply the current average cost to the units being removed
2.  Reduce batch quantities from oldest to newest (for audit trail)
3.  Remove empty batches
4.  The average cost remains unchanged

### Batch Tracking

The provider maintains batch records for tracking purposes:

*   Each receipt creates a new batch with the original cost details
*   Batches are reduced FIFO-style when inventory decreases
*   All batches share the same effective average cost for valuation

* * *

## Example Scenarios

### Scenario 1: Initial Receipt

**Receive 100 units at $10 each:**

*   Quantity: 100
*   Average Cost: $10.00
*   Inventory Value: $1,000.00

**Batch created:**

| Batch | Quantity | Billing Cost |
| --- | --- | --- |
| 1 | 100 | $10.00 |

### Scenario 2: Second Receipt at Different Price

**Current state:** 100 units at $10.00 average

**Receive 50 units at $16.00:**

Calculation:

```
Existing Value:  100 x $10 = $1,000
Incoming Value:   50 x $16 = $800
New Total:       150 units
New Average:     $1,800 / 150 = $12.00
```

**Result:**

*   Quantity: 150
*   Average Cost: $12.00
*   Inventory Value: $1,800.00

**Batches:**

| Batch | Quantity | Billing Cost |
| --- | --- | --- |
| 1 | 100 | $10.00 |
| 2 | 50 | $16.00 |

### Scenario 3: Reducing Inventory

**Current state:** 150 units at $12.00 average

**Ship 120 units:**

*   Cost applied to shipment: $12.00 per unit
*   COGS: 120 x $12.00 = $1,440.00

**Result:**

*   Quantity: 30
*   Average Cost: $12.00 (unchanged)
*   Inventory Value: $360.00

**Batches after reduction (reduced from oldest first):**

| Batch | Quantity | Original Cost |
| --- | --- | --- |
| 2 | 30 | $16.00 |

(Batch 1 fully consumed, Batch 2 partially consumed)

### Scenario 4: Multi-Currency Receipt

**Current state:** 100 units at $10.00 USD

**Receive 50 units at 150 NOK (exchange rate: 0.10):**

Calculation:

```
Incoming cost in USD: 150 x 0.10 = $15.00
Existing Value:  100 x $10 = $1,000
Incoming Value:   50 x $15 = $750
New Average:     $1,750 / 150 = $11.67
```

**Batch created:**

| Property | Value |
| --- | --- |
| Quantity | 50 |
| Billing cost | 150 |
| Billing currency | NOK |
| Exchange rate | 0.10 |
| Cost price (USD) | $15.00 |

* * *

## Characteristics

| Aspect | Behavior |
| --- | --- |
| Batch tracking | Yes (for audit trail) |
| Cost method | Weighted average |
| Currency handling | Multi-currency with conversion |
| Exchange rate tracking | Full (per batch) |
| Storage requirements | Moderate (batch records) |
| Calculation complexity | Moderate |

* * *

## Advantages

*   **Price smoothing**: Reduces impact of price volatility
*   **Simple COGS**: Same cost applies to all units
*   **Audit trail**: Batch records preserve receipt history
*   **Multi-currency**: Full support for international purchasing
*   **Widely accepted**: Standard accounting method

* * *

## Limitations

*   **Averaged history**: Individual receipt costs are blended together
*   **Phantom profits/losses**: May not reflect actual purchase timing
*   **Batch cleanup**: Requires occasional maintenance to remove empty batches

* * *

## When to Use

The Average Cost provider is appropriate when:

*   You purchase inventory at varying prices
*   You want to smooth out price fluctuations
*   Standard weighted average costing meets your accounting requirements
*   You need an audit trail of receipts
*   You operate in multiple currencies

* * *

## Configuration

```json
{
  "InventoryManagement": {
    "IsEnabled": true,
    "IsWriteEnabled": true,
    "InventoryValueProviders": [
      {
        "Key": "AverageInventoryValueProvider"
      }
    ]
  },
  "ProductSettings": {
    "DefaultProductCostCurrency": "USD"
  }
}
```

Ensure `DefaultProductCostCurrency` is set to define the currency for cost calculations.

* * *

## Comparison with FIFO

| Aspect | Average Cost | FIFO |
| --- | --- | --- |
| Cost per unit | Same for all units | Varies by batch |
| COGS calculation | Uses average cost | Uses oldest batch costs |
| Price changes impact | Smoothed across all inventory | Reflected as batches are consumed |
| Best for | Stable pricing, simplicity | Variable costs, precise tracking |

* * *

## Related Topics

*   [Inventory Value Overview](../inventory-value.md)
*   [Default Provider](default-provider.md)
*   [FIFO Provider](fifo-provider.md)
