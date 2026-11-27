# Inventory Value

Source: https://docs.omnium.no/docs/Inventory/inventory-value

> Understanding inventory valuation methods and how Omnium calculates inventory cost values

Inventory valuation is the process of assigning monetary value to your stock. Accurate inventory valuation is essential for financial reporting, cost of goods sold (COGS) calculations, and understanding the true value of your inventory assets.

Omnium provides pluggable inventory value providers that implement different costing methods to suit various business needs and accounting requirements.

* * *

## How Inventory Value Works

When inventory changes occur (receiving stock, shipping orders, adjustments), Omnium uses the configured inventory value provider to:

1.  **Calculate unit cost** - Determine the cost per unit for the inventory change
2.  **Update inventory value** - Recalculate the total value of inventory on hand
3.  **Track cost history** - Maintain batch records for providers that support it
4.  **Handle multi-currency** - Convert costs to the default currency when needed

### Inventory Value Flow

```
Inventory Update Received
        |
        v
+------------------+
| Get configured   |
| value provider   |
+------------------+
        |
        v
+------------------+
| Update default   |
| inventory cost   |
+------------------+
        |
        v
+------------------+
| Process update   |
| (provider logic) |
+------------------+
        |
        v
+------------------+
| Recalculate      |
| batch quantities |
+------------------+
        |
        v
+------------------+
| Save inventory   |
| and transactions |
+------------------+
```

* * *

## Available Providers

Omnium includes three built-in inventory value providers, each implementing a different costing methodology:

| Provider | Key | Batch Tracking | Best For |
| --- | --- | --- | --- |
| [Default](inventory-value/default-provider.md) | `DefaultInventoryValueProvider` | No | Simple inventory, consistent pricing |
| [Average Cost](inventory-value/average-provider.md) | `AverageInventoryValueProvider` | Yes | Standard accounting, price smoothing |
| [FIFO](inventory-value/fifo-provider.md) | `FifoInventoryValueProvider` | Yes | Manufacturing, perishables, variable costs |

* * *

## Key Concepts

### Inventory Batches

The Average and FIFO providers track inventory in batches. Each batch represents a specific receipt of inventory with its own cost information:

| Property | Description |
| --- | --- |
| Transaction date | When the batch was received |
| Quantity | Available quantity in the batch |
| Cost price | Per-unit cost in the default currency |
| Billing cost | Per-unit cost in the original purchase currency |
| Billing currency | Currency used when purchasing this batch |
| Exchange rate | Exchange rate applied for currency conversion |
| Currency date | Date used for exchange rate lookup |

Batches are ordered by transaction date, with the oldest batches processed first when reducing inventory.

### Multi-Currency Support

Inventory costs can be tracked in multiple currencies. The Average and FIFO providers:

*   Store the original billing currency and cost
*   Apply exchange rates at the time of receipt
*   Convert all costs to the tenant's default cost currency for consistent valuation
*   Track the currency date used for exchange rate lookups

The default cost currency is configured in the tenant's product settings.

### Inventory Value vs. Inventory Cost

*   **Inventory Cost**: The per-unit cost of the item
*   **Inventory Value**: The total value of inventory on hand, calculated as `Cost x Quantity`

For batch-tracking providers, the total inventory value equals the sum of all batch values.

* * *

## Daily Value Snapshots

Omnium can create daily snapshots of your total inventory value across all warehouses. These snapshots are useful for:

*   Financial reporting
*   Trend analysis
*   Audit trails
*   External system synchronization

A scheduled task runs daily to create these snapshots. Each snapshot includes:

*   Warehouse-level breakdown
*   Original currency values
*   Converted values in configured currencies

* * *

## Configuration

Inventory value providers are configured in tenant settings under `InventoryManagement.InventoryValueProviders`:

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
    "DefaultProductCostCurrency": "USD",
    "Currencies": ["USD", "EUR", "NOK"]
  }
}
```

Only one inventory value provider can be active at a time. If no provider is configured, the `DefaultInventoryValueProvider` is used.

For more configuration options, see [Inventory Configuration](inventory-config.md#inventory-value-providers).

* * *

## Choosing a Provider

Consider these factors when selecting an inventory value provider:

| Factor | Default | Average | FIFO |
| --- | --- | --- | --- |
| **Setup complexity** | Minimal | Low | Low |
| **Storage overhead** | Low | Higher (batches) | Higher (batches) |
| **Price fluctuation handling** | None | Smoothed | Precise |
| **COGS accuracy** | Approximate | Good | Best |
| **Audit trail** | None | Full | Full |
| **Multi-currency** | Basic | Full | Full |

**Recommendations:**

*   **Default**: Use when product costs are stable and you don't need detailed cost tracking
*   **Average**: Use for standard retail/wholesale operations where cost smoothing is acceptable
*   **FIFO**: Use for manufacturing, perishable goods, or when precise COGS tracking is required

* * *

## Related Topics

*   [Inventory Configuration](inventory-config.md)
*   [Virtual Stock Locations](virtual-stock-locations.md)
*   [Inventory API](inventory-api.md)
