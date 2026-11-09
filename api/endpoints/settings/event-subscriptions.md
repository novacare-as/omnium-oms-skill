# Settings | Event Subscriptions

Source: https://api.omnium.no/documentation

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/EventSubscriptions`

**Returns every event subscription for the tenant, active or not.**

Operation ID: `EventSubscriptionsGet`

Credentials are omitted from every read: `clientSecret` comes back as `null`, and so does the
value of any credential-carrying request header. The header's `key` is still returned, so you
can see *that* an `Authorization` header is configured without being shown its value.

```json
[
  {
    "id": "b7c1f0e2-4d3a-4f6b-9a21-0c5e8d7a1234",
    "name": "Order created to ERP",
    "isActive": true,
    "connector": "Webhook",
    "baseUrl": "https://erp.example.com",
    "requestUri": "/omnium/orders",
    "httpVerb": "POST",
    "clientId": "omnium-integration",
    "clientSecret": null,
    "requestHeaders": [
      { "key": "Authorization", "value": null },
      { "key": "X-Source", "value": "omnium" }
    ],
    "useQueueDelivery": true,
    "filters": { "classNames": ["Order"], "statuses": ["Created"], "markets": ["NOR"] }
  }
]
```

**Responses:**

- 200: List<[`OmniumEventSubscription`](../../schemas/OmniumEventSubscription.md)> — Subscriptions returned. Credentials are omitted.

---

## `POST /api/EventSubscriptions`

**Creates an event subscription. Omit `id` to have one generated, or supply your own to keep ids stable across environments.**

Operation ID: `EventSubscriptionsPost`

**Setting one up end to end**

1. `GET /api/EventSubscriptions/Filters` — read the object types, statuses, markets, stores and
   users this tenant actually has, so the filters you send reference real values.
2. `POST /api/EventSubscriptions` — create it, usually with `isActive: false` first.
3. `POST /api/EventSubscriptions/{id}/Test` — fire one event at the destination and check the
   endpoint really accepts it.
4. `PUT /api/EventSubscriptions/{id}` — flip `isActive` to `true` once the test passes.

**A webhook that fires when an order is created**

```json
{
  "name": "Order created to ERP",
  "isActive": true,
  "connector": "Webhook",
  "baseUrl": "https://erp.example.com",
  "requestUri": "/omnium/orders",
  "httpVerb": "POST",
  "messageEncoding": "UTF-8",
  "useQueueDelivery": true,
  "clientId": "omnium-integration",
  "clientSecret": "the-secret-value",
  "requestHeaders": [
    { "key": "Authorization", "value": "Bearer eyJhbGciOi..." },
    { "key": "X-Source", "value": "omnium" }
  ],
  "filters": {
    "classNames": ["Order"],
    "statuses": ["Created"],
    "markets": ["NOR"],
    "excludedUserUpdates": ["System"]
  }
}
```

`excludedUserUpdates` is worth setting on any integration that also writes back to Omnium —
without it the integration is woken by the events its own writes produce.

**A queue subscription instead of a webhook**

Queue and bus connectors use `topic` rather than a URL, and `clientSecret` carries the
connection string:

```json
{
  "name": "All product changes to the bus",
  "isActive": true,
  "connector": "AzureServiceBus",
  "topic": "omnium-products",
  "clientSecret": "Endpoint=sb://...;SharedAccessKey=...",
  "filters": { "classNames": ["Product"] }
}
```

Built-in `connector` values are `Webhook`, `AzureServiceBus`, `AzureStorageQueue`, `Kafka` and
`RabbitMQ`; installed integration modules may add more. The name is not validated on write, so a
typo produces a subscription that never delivers — use `Test` to confirm it before relying on it.

Omitting `filters` entirely subscribes to **every** event for the tenant. An empty or omitted
list inside `filters` places no restriction on that one dimension rather than matching nothing.

**Request body:** [`OmniumEventSubscription`](../../schemas/OmniumEventSubscription.md) — The subscription to create.

**Responses:**

- 201: [`OmniumEventSubscription`](../../schemas/OmniumEventSubscription.md) — Subscription created. The response carries the assigned `id`, with credentials omitted.
- 400: [`ValidationProblemDetails`](../../schemas/ValidationProblemDetails.md) — `name` or `connector` is missing, the body is absent, or a request header has no `key`.
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — A subscription with the supplied id already exists. Use PUT to update it.

---

## `GET /api/EventSubscriptions/{id}`

**Returns a single event subscription.**

Operation ID: `EventSubscriptionsGetById`

Same credential rule as the list endpoint: `clientSecret` and credential header values are
`null`. This is the call to make before a `PUT`, since the object you get back is the correct
starting point for a replacement.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Id of the subscription. |

**Responses:**

- 200: [`OmniumEventSubscription`](../../schemas/OmniumEventSubscription.md) — Subscription returned. Credentials are omitted.
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — No subscription with that id exists.

---

## `PUT /api/EventSubscriptions/{id}`

**Replaces an event subscription. Send the whole object — every field is overwritten, so an omitted filter list clears that filter.**

Operation ID: `EventSubscriptionsPut`

**Credentials are the one exception, and it is what makes replace safe**

A read never returns `clientSecret` or credential header values, so the obvious
`GET` → change a field → `PUT` round trip would otherwise erase them. Instead:

| You send | Result |
|---|---|
| the field omitted, or `null` | the stored credential is kept |
| `""` (empty string) | the stored credential is cleared |
| any other value | the credential is replaced |

So a pipeline can read a subscription, edit one field and write it straight back without ever
handling the secret.

**Turning a subscription off, after reading it with GET**

```json
{
  "name": "Order created to ERP",
  "isActive": false,
  "connector": "Webhook",
  "baseUrl": "https://erp.example.com",
  "requestUri": "/omnium/orders",
  "httpVerb": "POST",
  "clientSecret": null,
  "requestHeaders": [
    { "key": "Authorization", "value": null },
    { "key": "X-Source", "value": "omnium" }
  ],
  "filters": { "classNames": ["Order"], "statuses": ["Created"], "markets": ["NOR"] }
}
```

The nulls here are exactly what `GET` returned, and they leave the stored secret and the stored
`Authorization` value untouched.

**Rotating the secret** — send the new value instead of the null:

```json
{ "clientSecret": "the-new-secret-value" }
```

(as part of the full object — this is a replace, not a patch).

An `id` in the body is ignored; the one in the route wins.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Id of the subscription to replace. |

**Request body:** [`OmniumEventSubscription`](../../schemas/OmniumEventSubscription.md) — The updated subscription.

**Responses:**

- 200: [`OmniumEventSubscription`](../../schemas/OmniumEventSubscription.md) — Subscription updated. Credentials are omitted from the response.
- 400: [`ValidationProblemDetails`](../../schemas/ValidationProblemDetails.md) — `name` or `connector` is missing, the body is absent, or a request header has no `key`.
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — No subscription with that id exists.

---

## `DELETE /api/EventSubscriptions/{id}`

**Deletes an event subscription.**

Operation ID: `EventSubscriptionsDelete`

Events already queued for delivery are not recalled, so a subscription using
`useQueueDelivery` can still deliver a handful of events shortly after it is deleted. To stop
delivery immediately, `PUT` it with `isActive: false` instead.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Id of the subscription to delete. |

**Responses:**

- 204: Subscription deleted.
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — No subscription with that id exists.

---

## `POST /api/EventSubscriptions/{id}/Test`

**Delivers a single test event to a stored subscription's destination, so a pipeline can verify connectivity and credentials right after creating it.**

Operation ID: `EventSubscriptionsTest`

The subscription does not have to be active, and no filters are applied — the test event is
synthetic, not a real one, so this is safe to call against a production subscription. The
destination receives one message and nothing is written back to Omnium.

The call returns `200` whether or not the delivery worked; read `isSuccess` for the outcome.
A refused connection, a `401` from the destination or a `connector` name with no exporter
behind it are all configuration answers rather than server faults.

```json
{ "isSuccess": true, "message": "Delivered to https://erp.example.com/omnium/orders", "errorMessage": null, "responseContent": "" }
```

```json
{ "isSuccess": false, "message": null, "errorMessage": "401 Unauthorized", "responseContent": "{\"error\":\"invalid token\"}" }
```

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Id of the subscription to test. |

**Responses:**

- 200: [`OmniumEventSubscriptionTestResult`](../../schemas/OmniumEventSubscriptionTestResult.md) — The test ran. Check `isSuccess` for the outcome.
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — No subscription with that id exists.

---

## `GET /api/EventSubscriptions/Filters`

**Returns the filter values this tenant accepts — object types, statuses, markets, stores, warehouses and users.**

Operation ID: `EventSubscriptionsFilters`

Call this first when building a subscription's filters: the values are tenant-specific, so an
order status or market id that exists on one tenant may not exist on another. Send the `value`
of an option in the matching `filters` list; `displayName` is for showing a human.

`classes` is nested because some filters only apply to certain object types. Each entry carries
the statuses, sub types, workflow steps and tags valid for that type, plus `supports*` flags
saying whether market, store, store-group, warehouse and property filtering apply to it at all.

```json
{
  "classes": [
    {
      "className": { "value": "Order", "displayName": "Order" },
      "statuses": [{ "value": "Created", "displayName": "Created", "translationKey": "OrderCreated" }],
      "supportsMarketFilter": true,
      "supportsWarehouseFilter": false
    }
  ],
  "markets": [{ "value": "NOR", "displayName": "Norway" }]
}
```

**Responses:**

- 200: [`OmniumEventSubscriptionFilterOptions`](../../schemas/OmniumEventSubscriptionFilterOptions.md) — Filter options returned.
