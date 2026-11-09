# Markets

Source: https://api.omnium.no/documentation

> Markets in Omnium are used for configuring currencies, languages, available connectors, etc for different countries, concepts, ownerships or a combination of the above.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Markets`

**Get all markets**

Operation ID: `MarketsGet`

**Responses:**

- 200: List<[`OmniumMarket`](../schemas/OmniumMarket.md)> — Markets found and returned
- 404: No markets found

---

## `GET /api/Markets/GetMarketGroups`

**Get all market groups**

Operation ID: `MarketsGetMarketGroups`

**Responses:**

- 200: List<[`OmniumMarketGroup`](../schemas/OmniumMarketGroup.md)> — Market groups found and returned
- 404: No market groups found

---

## `PUT /api/Markets/Update`

**Update market**

Operation ID: `MarketsUpdate`

**Request body:** [`OmniumMarket`](../schemas/OmniumMarket.md) — The market to be updated in the OMS

**Responses:**

- 200: Success

---

## `DELETE /api/Markets/{marketId}/Delete`

**Delete market - This operation does not clean up other resources or references in Omnium, it only removes the market from the settings.**

Operation ID: `MarketsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | path | string | Yes | Id of the market to be deleted in the OMS |

**Responses:**

- 200: Marked deleted

---

## `GET /api/ShipmentOptions/{marketId}/ShipmentOptions`

**Get shipment options for the market.**

Operation ID: `ShipmentOptionsGetShipmentOptions`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | path | string | Yes |  |

**Responses:**

- 200: List<[`OmniumShipmentOption`](../schemas/OmniumShipmentOption.md)> — Success
- 404: Not Found

---

## `PATCH /api/ShipmentOptions/{marketId}/ShipmentOption`

**Patch the list of shipment options. If the patch object has same ShippingMethodId or ShippingMethodName, it modifies the shipping option. If not, id adds a new one.**

Operation ID: `ShipmentOptionsPatchShipmentOption`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | path | string | Yes |  |

**Request body:** [`OmniumShipmentOption`](../schemas/OmniumShipmentOption.md)

**Responses:**

- 200: List<[`OmniumShipmentOption`](../schemas/OmniumShipmentOption.md)> — Success
- 404: Not Found

---

## `DELETE /api/ShipmentOptions/{marketId}/ShipmentOption`

**Patch the list of shipment options.**

Operation ID: `ShipmentOptionsDeleteShipmentOption`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | path | string | Yes |  |
| `shippingMethodId` | query | string | No |  |
| `shippingMethodName` | query | string | No |  |

**Responses:**

- 200: List<[`OmniumShipmentOption`](../schemas/OmniumShipmentOption.md)> — Success
- 404: Not Found
