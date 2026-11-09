# OmniumPickList

A pick list for retrieving items from the warehouse.

**Fields:**

- `id`: string, nullable — Unique ID.
- `name`: string, nullable — Name of pickList.
- `modified`: string (date-time) — Date pick list was modified (UTC).
- `created`: string (date-time) — Date pick list was created (UTC).
- `warehouseCode`: string, nullable — Unique ID of warehouse.
- `warehouseName`: string, nullable — Name of warehouse.
- `status`: string, nullable — Status of the pick list.
- `pickListOrderItems`: List<[`OmniumPickListOrderItem`](OmniumPickListOrderItem.md)>, nullable, max length 250 — The orders the items in this pick list appear on.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties, key - value pairs.

**Used directly by endpoints in:**

- [Orders | Pick Lists](../endpoints/orders/pick-lists.md)
