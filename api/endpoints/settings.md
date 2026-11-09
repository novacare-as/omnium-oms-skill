# Settings

Source: https://api.omnium.no/documentation

> Settings

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Settings/OrderSettings`

**Returns order settings**

Operation ID: `SettingsOrderSettings`

**Responses:**

- 200: [`OmniumOrderSettings`](../schemas/OmniumOrderSettings.md) — Success

---

## `GET /api/Settings/OrderTypes`

**Returns order type settings**

Operation ID: `SettingsOrderTypes`

**Responses:**

- 200: List<[`OmniumOrderType`](../schemas/OmniumOrderType.md)> — Success

---

## `GET /api/Settings/CustomerSettings`

**Returns customer settings**

Operation ID: `SettingsCustomerSettings`

**Responses:**

- 200: [`OmniumCustomerSettings`](../schemas/OmniumCustomerSettings.md) — Success
