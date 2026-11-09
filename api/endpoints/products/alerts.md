# Products | Alerts

Source: https://api.omnium.no/documentation

> Product alerts.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/ProductAlerts/Add`

**Add or Update a productAlert. If ID is null, it will be created.**

Operation ID: `ProductAlertsAdd`

**Request body:** [`OmniumProductAlertRequest`](../../schemas/OmniumProductAlertRequest.md) — The product alert object

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `DELETE /api/ProductAlerts/Deactivate`

**Deactivate productAlerts. Active flag will be set to false, and contact information will be removed.**

Operation ID: `ProductAlertsDeactivate`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `omniumProductAlertIds` | query | List<string> | Yes | Product alert Ids - The id of product alert objects to deactivate |

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `GET /api/ProductAlerts/GetProductAlerts`

**Get ProductAlerts.**

Operation ID: `ProductAlertsGetProductAlerts`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `page` | query | integer (int32) | No | Page number |
| `take` | query | integer (int32) | No | Number of elements |

**Responses:**

- 200: Success
- 400: string — Bad Request

---

## `POST /api/ProductAlerts/SearchProductAlerts`

**Search for product alerts.**

Operation ID: `ProductAlertsSearchProductAlerts`

**Request body:** [`OmniumProductAlertSearchRequest`](../../schemas/OmniumProductAlertSearchRequest.md) — Request with search params

**Responses:**

- 200: Success

---

## `POST /api/ProductAlerts/Search`

**Search for product alerts, returning the total hit count and the facets available for the result.**

Operation ID: `ProductAlertsSearch`

Same filters as SearchProductAlerts, but wrapped in the standard search envelope. Facets are
returned for Source, ReferralStore and Store, plus one per custom property key.

**Request body:** [`OmniumProductAlertSearchRequest`](../../schemas/OmniumProductAlertSearchRequest.md) — Request with search params

**Responses:**

- 200: [`OmniumProductAlertOmniumSearchResult`](../../schemas/OmniumProductAlertOmniumSearchResult.md) — Success
