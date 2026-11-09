# FIFO Provider

Source: https://docs.omnium.no/docs/Inventory/inventory-value/fifo-provider

> First-In-First-Out inventory valuation with precise batch cost tracking

The FIFO (First-In-First-Out) Inventory Value Provider implements precise cost tracking where the oldest inventory is always consumed first. Each batch maintains its original cost, providing accurate cost of goods sold (COGS) calculations.

**Provider Key:** `FifoInventoryValueProvider`

* * *

## Overview

The FIFO method assumes that the first items received are the first items sold or used. Each receipt of inventory creates a distinct batch with its own cost, and when inventory is reduced, costs are applied from the oldest batches first.

```
COGS = Sum of costs from oldest batches consumed
Inventory Value = Sum of remaining batch values
```

This provider is ideal for businesses where precise cost tracking and COGS accuracy are important.

* * *

## How It Works

### Receiving Inventory

When inventory is received, the provider can operate in two modes:

**Mode 1: Create New Batch** (when receiving from a purchase order or explicitly requested)

1.  Create a new batch with the incoming cost details
2.  Convert costs to the default currency using current exchange rates
3.  Add the batch to the inventory item

**Mode 2: Increase Oldest Batch** (default behavior)

1.  Find the oldest existing batch
2.  Add the incoming quantity to that batch
3.  Use the existing batch's cost for the new quantity

### Reducing Inventory

When inventory is reduced (sales, shipments, adjustments):

1.  Order batches by transaction date (oldest first)
2.  Consume from the oldest batch until depleted
3.  Move to the next batch as needed
4.  Calculate weighted COGS from the consumed batches
5.  Remove fully depleted batches

### Batch Cost Tracking

Each batch preserves its original purchase details:

| Field | Description |
| --- | --- |
| Transaction date | When the batch was received |
| Quantity | Remaining units in the batch |
| Billing cost | Original per-unit cost in purchase currency |
| Billing currency | Currency used for the purchase |
| Exchange rate | Exchange rate applied at receipt |
| Cost price | Per-unit cost converted to default currency |

* * *

## Example Scenarios

### Scenario 1: Sequential Receipts

**Receive 100 units at $10:**

| Batch | Date | Quantity | Cost/Unit | Value |
| --- | --- | --- | --- | --- |
| 1 | Jan 1 | 100 | $10.00 | $1,000 |

**Total Inventory Value: $1,000**

* * *

**Receive 50 units at $15:**

| Batch | Date | Quantity | Cost/Unit | Value |
| --- | --- | --- | --- | --- |
| 1 | Jan 1 | 100 | $10.00 | $1,000 |
| 2 | Jan 15 | 50 | $15.00 | $750 |

**Total Inventory Value: $1,750**

* * *

**Receive 75 units at $12:**

| Batch | Date | Quantity | Cost/Unit | Value |
| --- | --- | --- | --- | --- |
| 1 | Jan 1 | 100 | $10.00 | $1,000 |
| 2 | Jan 15 | 50 | $15.00 | $750 |
| 3 | Feb 1 | 75 | $12.00 | $900 |

**Total Inventory Value: $2,650**

### Scenario 2: FIFO Reduction

**Current state:** 225 units across 3 batches (from above)

**Ship 120 units:**

FIFO consumption:

```
Batch 1: Take all 100 units @ $10 = $1,000
Batch 2: Take 20 units @ $15 = $300
Total COGS: $1,300
Average cost per unit: $1,300 / 120 = $10.83
```

**Batches after shipment:**

| Batch | Date | Quantity | Cost/Unit | Value |
| --- | --- | --- | --- | --- |
| 2 | Jan 15 | 30 | $15.00 | $450 |
| 3 | Feb 1 | 75 | $12.00 | $900 |

**Total Inventory Value: $1,350** **Remaining Quantity: 105 units**

### Scenario 3: Purchase Order Batch Creation

When receiving inventory linked to a purchase order, a new batch is always created:

**Receive 50 units at $14 (from Purchase Order PO-001):**

| Batch | Date | Quantity | Cost/Unit | PO Reference |
| --- | --- | --- | --- | --- |
| 2 | Jan 15 | 30 | $15.00 | \- |
| 3 | Feb 1 | 75 | $12.00 | \- |
| 4 | Feb 15 | 50 | $14.00 | PO-001 |

This ensures purchase order receipts are tracked as distinct batches.

### Scenario 4: Multi-Currency Receipt

**Receive 100 units at 1,200 NOK (exchange rate to USD: 0.095):**

```
Cost in USD: 1,200 x 0.095 = $114.00 per unit
```

**Batch created:**

| Property | Value |
| --- | --- |
| Quantity | 100 |
| Billing cost | 1,200 |
| Billing currency | NOK |
| Exchange rate | 0.095 |
| Cost price (USD) | $114.00 |
| Currency date | (date of receipt) |

When these units are later sold, the COGS will reflect both the original NOK cost and the USD converted value.

* * *

## Characteristics

| Aspect | Behavior |
| --- | --- |
| Batch tracking | Yes (essential to FIFO) |
| Cost method | First-In-First-Out |
| Currency handling | Multi-currency with conversion |
| Exchange rate tracking | Full (per batch) |
| Storage requirements | Higher (detailed batch records) |
| Calculation complexity | Moderate to high |

* * *

## Advantages

*   **Accurate COGS**: Reflects actual purchase costs in the order acquired
*   **Precise valuation**: Each batch maintains its true cost
*   **Audit trail**: Complete history of inventory receipts and consumption
*   **Multi-currency**: Full support with preserved exchange rates
*   **Tax benefits**: Often advantageous during rising prices
*   **Natural flow**: Matches physical inventory flow for many businesses

* * *

## Limitations

*   **Complexity**: More complex than average costing
*   **Storage overhead**: Requires maintaining batch records
*   **Variable unit cost**: Different units have different costs, complicating pricing decisions
*   **Batch maintenance**: Need to track and clean up depleted batches

* * *

## When to Use

The FIFO provider is appropriate when:

*   Precise COGS tracking is required for financial reporting
*   You deal with perishable goods or products with shelf life
*   Purchase prices vary significantly over time
*   You need to match physical inventory flow (oldest items sold first)
*   Audit requirements demand detailed cost traceability
*   Your industry standard or regulations require FIFO costing

* * *

## Configuration

```json
{
  "InventoryManagement": {
    "IsEnabled": true,
    "IsWriteEnabled": true,
    "InventoryValueProviders": [
      {
        "Key": "FifoInventoryValueProvider"
      }
    ]
  },
  "ProductSettings": {
    "DefaultProductCostCurrency": "USD"
  }
}
```

### Controlling Batch Creation

By default, the FIFO provider increases the oldest batch when receiving inventory without a purchase order reference. To ensure each receipt creates a distinct batch:

*   **Link to a Purchase Order**: When inventory is received through the purchase order workflow, each receipt automatically creates a new batch
*   **Enable batch creation**: When updating inventory through other channels, request explicit batch creation to track receipts separately

This gives you control over whether inventory receipts are consolidated into existing batches or tracked individually.

* * *

## Comparison with Average Cost

| Aspect | FIFO | Average Cost |
| --- | --- | --- |
| Unit cost | Varies by batch | Same for all units |
| COGS calculation | Uses actual batch costs | Uses averaged cost |
| Rising prices | Lower COGS, higher profits | Averaged impact |
| Falling prices | Higher COGS, lower profits | Averaged impact |
| Best for | Variable costs, perishables | Stable pricing, simplicity |

* * *

## Related Topics

*   [Inventory Value Overview](../inventory-value.md)
*   [Default Provider](default-provider.md)
*   [Average Cost Provider](average-provider.md)
