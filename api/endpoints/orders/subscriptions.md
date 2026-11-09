# Orders | Subscriptions

Source: https://api.omnium.no/documentation

> Subscriptions

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Subscriptions`

**Create a new subscription, with an auto generated ID**

Operation ID: `SubscriptionsPost`

**Request body:** [`OmniumSubscription`](../../schemas/OmniumSubscription.md)

**Responses:**

- 201: [`OmniumSubscription`](../../schemas/OmniumSubscription.md) — Success
- 400: string — Bad Request

---

## `PUT /api/Subscriptions`

**Add or update subscription**

Operation ID: `SubscriptionsPut`

**Request body:** [`OmniumSubscription`](../../schemas/OmniumSubscription.md) — Subscriptions object that needs to be added to the OMS

**Responses:**

- 200: [`OmniumSubscription`](../../schemas/OmniumSubscription.md) — Success
- 201: [`OmniumSubscription`](../../schemas/OmniumSubscription.md) — Success
- 400: string — Bad Request

---

## `POST /api/Subscriptions/Update`

**Update subscription**

Operation ID: `SubscriptionsUpdate`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `runWorkflow` | query | boolean | No | If true, workflow will be processed |

**Request body:** [`OmniumSubscription`](../../schemas/OmniumSubscription.md) — Subscription to update

**Responses:**

- 200: Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `GET /api/Subscriptions/{id}`

**Returns a single subscription**

Operation ID: `SubscriptionsGet`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the subscription to return |

**Responses:**

- 200: [`OmniumSubscription`](../../schemas/OmniumSubscription.md) — Success
- 404: string — The subscription was not found

---

## `DELETE /api/Subscriptions/{id}`

**Deletes a subscription from the OMS**

Operation ID: `SubscriptionsDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 200: string — Success
- 400: string — Bad Request
- 404: string — Subscription to delete was not found

---

## `POST /api/Subscriptions/Search`

**Search and filtering of subscriptions.**

Operation ID: `SubscriptionsSearch`

**Request body:** [`OmniumSubscriptionSearchRequest`](../../schemas/OmniumSubscriptionSearchRequest.md)

**Responses:**

- 200: [`OmniumSubscriptionOmniumSearchResult`](../../schemas/OmniumSubscriptionOmniumSearchResult.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Subscriptions/CreatePendingOrders/{numberOfPendingOrders}`

**Create pending orders for subscription**

Operation ID: `SubscriptionsCreatePendingOrders`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `numberOfPendingOrders` | path | integer (int32) | Yes |  |

**Request body:** [`OmniumSubscription`](../../schemas/OmniumSubscription.md)

**Responses:**

- 200: string — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Subscriptions/{id}/CancelSubscription`

**Cancel a subscription and all its pending orders**

Operation ID: `SubscriptionsCancelSubscription`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | ID of the subscription |

**Responses:**

- 200: Success
- 400: string — Bad Request
- 404: string — Subscription was not found
