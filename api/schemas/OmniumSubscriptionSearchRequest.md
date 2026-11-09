# OmniumSubscriptionSearchRequest

Subscription search request

**Fields:**

- `customerEmail`: string, nullable — Customer e-mail
- `customerPhone`: string, nullable — Customer phone number
- `customerName`: string, nullable — Customer name
- `customerNumber`: string, nullable — Customer Number
- `customerId`: string, nullable — Customer Id
- `storeIds`: List<string>, nullable, max length 1000 — Limit search by store IDs
- `marketIds`: List<string>, nullable, max length 250 — Limit search by store IDs
- `take`: integer (int32) — Number of orders to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `property`: [`OmniumPropertyItem`](OmniumPropertyItem.md)
- `externalIds`: List<string>, nullable, max length 250 — Search subscriptions with external IDs

**Used directly by endpoints in:**

- [Orders | Subscriptions](../endpoints/orders/subscriptions.md)
