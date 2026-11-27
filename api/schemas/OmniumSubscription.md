# OmniumSubscription

Omnium subscription model

**Fields:**

- `id`: string, nullable — Unique subscription ID
- `customerId`: string, nullable — The ID of the customer - should be an unique value
- `customerNumber`: string, nullable — The customer number
- `customerName`: string, nullable — Name of customer
- `customerPhone`: string, nullable — Customer phone number with prefix. e.g. +4740000000
- `customerEmail`: string, nullable — Customer e-mail
- `startDate`: string (date-time), nullable — Start date of the subscription
- `endDate`: string (date-time), nullable — End date of the subscription
- `nextOrderDate`: string (date-time), nullable — Date when next order should be created
- `subscriptionOrderCreationTime`: string — Time of day when the subscription order should be created
- `intervalDays`: integer (int32) — Interval in days between each order
- `schedule`: string, nullable, **deprecated** — Subscription schedule - Cron expression
- `status`: string, required — Subscription current status
- `cartTemplate`: [`OmniumCart`](OmniumCart.md), required
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable, max length 250 — Errors and warnings
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — External IDs
- `payments`: List<[`OmniumPayment`](OmniumPayment.md)>, nullable, max length 250 — Subscription payment - recurring payment reference
- `modifiedBy`: string, nullable — User (or system) that last modified the entity
- `isAnonymized`: boolean — Marked as anonymized              s
- `modified`: string (date-time) — Last time the subscription was updated
- `created`: string (date-time) — When the subscription was created
- `lastFailedVerificationAttempt`: string (date-time), nullable — When subscription verification last failed
- `numberOfVerificationAttempts`: integer (int32), nullable — Number of failed verification attempts. Should be reset when a successful verification attempt
- `createPendingOrders`: boolean — Create pending orders for subscription
- `numberOfPendingOrders`: integer (int32), nullable — Number of pending orders to create (Default: 3)

**Used directly by endpoints in:**

- [Orders | Subscriptions](../endpoints/orders/subscriptions.md)
