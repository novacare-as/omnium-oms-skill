# Stock Buffer

Source: https://docs.omnium.no/docs/Inventory/stock-buffer

> Hold back a fixed number of units from available inventory so they are not sold through normal cart or order flows.

## Stock buffer

A stock buffer is subtracted from available inventory during cart validation. If the requested quantity would consume the buffered units, the cart fails validation.

Use it to keep a safety margin for in-store walk-ins, exchanges, or B2B fulfillment without changing the inventory counts that integrations and reports rely on.

### Resolution order

The buffer is resolved per cart line item in this order. The first non-null value wins.

1.  **Product property** — a `StockBuffer` entry on the product's `Properties` list. Treated as unset if the value is empty or `"0"`.
2.  **Store** — the `stockBuffer` field on the store record.
3.  **Tenant global** — the `StockBuffer` field on `InventoryManagement` in tenant settings.
4.  **`0`** — no buffer applied.

Negative values are clamped to zero.

### Null versus zero

At the store and tenant levels:

*   `null` — falls through to the next step.
*   `0` — explicit override. The fallback below is not used.

This lets you set a global default and opt a single store out by setting its value to `0`.

* * *

## Configure the global stock buffer

The global value applies to every store that does not set its own value.

**Configuration → Settings → Products → Inventory Management → Global stock buffer**

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `StockBuffer` | decimal | null | Default units subtracted from available stock for every store. Overridden by store-level value. |

```
"InventoryManagement": {
  "StockBuffer": 2
}
```

* * *

## Configure a store-level stock buffer

A store-level value overrides the global default.

**Configuration → Stores → (select store) → Settings → Warehouse and inventory → Stock buffer**

The field shows the effective fallback as a placeholder when empty. A clear icon next to the field removes the override.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `stockBuffer` | decimal | null | Units subtracted from available stock for this store. Set to `0` to disable the global fallback for this store. |

```json
{
  "id": "Acme-Oslo",
  "name": "Acme Oslo",
  "stockBuffer": 5
}
```

The PATCH endpoint treats `null` as "no change". To clear an existing override back to the global default through the API, use PUT with `stockBuffer` set to `null`.

* * *

## Configure a product-level stock buffer

Add a `StockBuffer` entry to the product's `Properties` list. The value is a string and must parse as a positive decimal — empty or `"0"` falls through to the store and global values.

```json
{
  "id": "12345",
  "properties": [
    { "key": "StockBuffer", "value": "10" }
  ]
}
```

* * *

## Scope

The buffer is applied only by the cart inventory validator. It does not change:

*   Inventory counts returned by the inventory API.
*   Stock levels exported to integrations.
*   Reservation logic.

When the buffer blocks a line item, the cart validation result includes an inventory error on that line and the cart cannot be converted to an order until the quantity is reduced or the buffer is changed.

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
