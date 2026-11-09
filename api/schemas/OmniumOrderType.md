# OmniumOrderType

**Fields:**

- `name`: string, nullable — Order type name (E.g. Online, ClickAndCollect, Pos, etc)
- `enableEdit`: boolean — Is order editable in GUI
- `enableCreateFromCart`: boolean — True if it is possible to create order type from cart
- `disableWorkflow`: boolean — Temporary disable workflow for order type
- `defaultOrderType`: boolean — True if order is default. Autofilter by default types in order list.
- `defaultExternalIdProvider`: string, nullable — External ID provider (Added to list of external IDs)
- `orderStatuses`: List<[`OmniumOrderStatus`](OmniumOrderStatus.md)>, nullable, max length 250 — List of available order statuses
- `deriveOrderStatusFromShipments`: boolean — When enabled, order head status is derived from the main status of the highest qualifying sort order tier based on shipment statuses

**Used directly by endpoints in:**

- [Settings](../endpoints/settings.md)
