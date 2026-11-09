# Orders | Click and Collect

Source: https://api.omnium.no/documentation

> Click and collect order type has some custom features in Omnium UI and API.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/ClickAndCollect/GetOrdersForCustomer`

**Get Click and Collect orders for customer. Support paging**

Operation ID: `ClickAndCollectGetOrdersForCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | No | Customer ID |
| `phone` | query | string | No | Phone number |
| `email` | query | string | No | E-mail address |
| `storeId` | query | List<string> | No | Store ID |
| `page` | query | integer (int32) | No | Page number. Minimum 1. Defaults to 1 |
| `pageSize` | query | integer (int32) | No | Max 100. Defaults to 20 |

**Responses:**

- 200: [`OmniumOrderOmniumSearchResult`](../../schemas/OmniumOrderOmniumSearchResult.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `GET /api/ClickAndCollect/GetOrderForCustomer`

**Get a click and collect order for a single customers**

Operation ID: `ClickAndCollectGetOrderForCustomer`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `customerId` | query | string | No | The id of the customer |
| `orderId` | query | string | No | The id of the order |

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — Success
- 400: Bad Request
- 404: Not Found

---

## `POST /api/ClickAndCollect/ExtendCustomerPickupDeadline`

**Extend the customer pickup deadline for a click and collect order**

Operation ID: `ClickAndCollectExtendCustomerPickupDeadline`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | query | string | Yes | The id of the order |
| `extendedPickupTime` | query | string | Yes | TimeSpan for which the customerPickupDeadline will be extended |

**Responses:**

- 200: Success
- 400: Bad Request
- 404: Not Found
