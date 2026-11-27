# OmniumEventSubscriptionFilterOptions

The filter values this tenant accepts on Omnium.Public.Events.Models.OmniumEventSubscriptionFilters. Read this
before building a subscription so filters reference names that actually exist for the tenant.

**Fields:**

- `classes`: List<[`OmniumEventSubscriptionClassOption`](OmniumEventSubscriptionClassOption.md)>, nullable — Selectable object types, each with the sub types, statuses and workflow steps that apply to it.
- `categories`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable event categories.
- `markets`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable market ids.
- `stores`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable store ids.
- `storeGroups`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable store group ids.
- `storeGroupsOnShipments`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable store group ids for shipment level filtering.
- `warehouses`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable warehouse codes.
- `includedUsers`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable users for Omnium.Public.Events.Models.OmniumEventSubscriptionFilters.IncludedUserUpdates.
- `excludedUsers`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Selectable users for Omnium.Public.Events.Models.OmniumEventSubscriptionFilters.ExcludedUserUpdates.

**Used directly by endpoints in:**

- [Settings | Event Subscriptions](../endpoints/settings/event-subscriptions.md)
