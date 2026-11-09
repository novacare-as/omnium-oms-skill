# Cost Prices

Source: https://docs.omnium.no/docs/Product/local-products/cost-prices

> Managing store-specific cost prices for local products

When local products are combined with the separate cost prices feature, each store can have its own cost price for the same product. This is useful when stores source products independently or negotiate different supplier prices.

* * *

## How It Works

When both `isLocalProductsEnabled` and `hasSeparateCostPrices` are enabled in tenant settings, the system creates individual cost price entries for each store assigned to a local product.

```
Local Product: "Artisan Sourdough Bread"
Assigned Stores: [oslo-grunerløkka, oslo-majorstuen]
                    │
                    ▼
┌──────────────────────────────────────┐
│  Cost Price Entries:                 │
│  ├─ oslo-grunerløkka  → 25.00 NOK   │
│  └─ oslo-majorstuen   → 28.00 NOK   │
└──────────────────────────────────────┘
```

* * *

## Configuration

Both settings must be enabled for store-specific cost prices to work:

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `isLocalProductsEnabled` | bool | false | Enables the local products feature |
| `hasSeparateCostPrices` | bool | false | Enables separate cost price entries per store |

```json
{
  "ProductSettings": {
    "IsLocalProductsEnabled": true,
    "HasSeparateCostPrices": true
  }
}
```

* * *

## Cost Price Entries

When a local product is assigned to stores, the system automatically creates cost price records:

| Property | Description |
| --- | --- |
| `storeId` | The store this cost price applies to |
| `marketId` | The market associated with the store |
| `costPrice` | The cost price value for this store |

### Automatic Updates

Cost price entries are managed when store assignments change:

*   **Store added**: A new cost price entry is created for the store
*   **Store removed**: The cost price entry for that store is removed
*   **Store reassigned**: Existing cost price entries are preserved

Automatic cost price creation is currently only applied when updating existing products. When creating a new local product, you may need to manually set cost prices for each store after creation.

* * *

## Use Cases

### Independent Sourcing

Different stores source the same product from different suppliers at different costs:

| Store | Supplier | Cost Price |
| --- | --- | --- |
| Oslo Downtown | Local Bakery A | 22.00 NOK |
| Bergen Central | Local Bakery B | 25.00 NOK |
| Stavanger Mall | Local Bakery C | 20.00 NOK |

### Franchise Pricing

Franchise locations with different cost structures can track their actual product costs independently while sharing the same retail prices.

* * *

## Best Practices

1.  **Enable both settings together** — separate cost prices are most useful when combined with local products
2.  **Review cost prices after store changes** — verify that cost prices are correct after modifying store assignments
3.  **Use for margin analysis** — store-specific cost prices enable per-store margin reporting
