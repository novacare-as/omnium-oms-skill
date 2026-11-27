# Orders | Shipments

Source: https://api.omnium.no/documentation

> Order shipments.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PUT /api/OrderShipments/{orderId}`

**Put shipment on order**

Operation ID: `ShipmentsPut`

Add/Update shipment on order.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID |

**Request body:** List<[`OmniumShipment`](../../schemas/OmniumShipment.md)> — Shipment to put

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 201: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PATCH /api/OrderShipments/{orderId}`

**Patch Shipment on order**

Operation ID: `ShipmentsPatch`

Patch shipment on order.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID |

**Request body:** List<[`OmniumShipmentPatch`](../../schemas/OmniumShipmentPatch.md)> — Shipment to put

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/OrderShipments/{orderId}/DeleteShipments`

**Delete shipment**

Operation ID: `ShipmentsDeleteShipments`

Delete shipment from order.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID |

**Request body:** List<string> — Shipment IDs to delete

**Responses:**

- 200: string — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/OrderShipments/{orderId}/AddOrderLinesToShipment`

**Add order lines to shipment**

Operation ID: `ShipmentsAddOrderLinesToShipment`

Add existing order lines to shipment.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID |

**Request body:** List<[`OmniumShipmentLineItemsUpdateModel`](../../schemas/OmniumShipmentLineItemsUpdateModel.md)> — Shipment with lineItemIds to add

**Responses:**

- 200: string — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/OrderShipments/{orderId}/RemoveOrderLinesFromShipment`

**Remove order lines from shipment**

Operation ID: `ShipmentsRemoveOrderLinesFromShipment`

Remove existing order lines from shipment.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order ID |
| `removeEmptyShipments` | query | boolean | No |  |

**Request body:** List<[`OmniumShipmentLineItemsUpdateModel`](../../schemas/OmniumShipmentLineItemsUpdateModel.md)> — Shipment with lineItemIds to remove

**Responses:**

- 200: string — Success
- 400: string — Bad Request
- 404: string — Not Found
