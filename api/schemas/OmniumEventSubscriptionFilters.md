# OmniumEventSubscriptionFilters

Narrows which events a subscription receives. Each list is independent and is only applied when
it has values, so an omitted list places no restriction on that dimension. Call
GET /api/EventSubscriptions/Filters for the values this tenant accepts.

**Fields:**

- `classNames`: List<string>, nullable — Object types to subscribe to, for example Order, Product or Customer.
- `subClassNames`: List<string>, nullable — Sub types within the selected classes, for example an order type name.
- `statuses`: List<string>, nullable — Statuses to subscribe to, for example an order status name.
- `workflowSteps`: List<string>, nullable — Workflow step names to subscribe to.
- `categories`: List<string>, nullable — Event categories to subscribe to.
- `markets`: List<string>, nullable — Market ids the event must belong to.
- `stores`: List<string>, nullable — Store ids the event must belong to.
- `storeGroups`: List<string>, nullable — Store group ids the event must belong to.
- `storeGroupsOnShipments`: List<string>, nullable — Store group ids matched against the shipment rather than the order.
- `warehouseCodes`: List<string>, nullable — Warehouse codes the event must belong to.
- `includedTags`: List<string>, nullable — Only deliver events for objects carrying at least one of these tags.
- `excludedTags`: List<string>, nullable — Never deliver events for objects carrying any of these tags. Applied after Omnium.Public.Events.Models.OmniumEventSubscriptionFilters.IncludedTags.
- `includedUserUpdates`: List<string>, nullable — Only deliver events caused by these users.
- `excludedUserUpdates`: List<string>, nullable — Never deliver events caused by these users. Typically used to stop an integration from receiving the events its own writes produced.
- `excludedOrigins`: List<string>, nullable — Never deliver events whose origin contains one of these values, case-insensitive. An origin is a scheduled task or queue name, or "METHOD /path" for an http request, so "POST /api/orders" covers every order post.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Property key and value pairs the object must carry.
- `operationId`: string, nullable, max length 200 — Only deliver events produced by this operation.
- `query`: string, nullable, max length 2000 — Search query the object must match for the event to be delivered.
