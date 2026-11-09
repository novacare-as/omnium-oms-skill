# OmniumEventSubscriptionClassOption

One selectable object type and the filter values that only apply when that type is selected.

**Fields:**

- `className`: [`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)
- `subClassNames`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Sub types available for this object type.
- `statuses`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Statuses available for this object type.
- `workflowSteps`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Workflow steps available for this object type.
- `tags`: List<[`OmniumEventSubscriptionFilterOption`](OmniumEventSubscriptionFilterOption.md)>, nullable — Tags available for this object type.
- `supportsMarketFilter`: boolean — True when market filtering applies to this object type.
- `supportsStoreFilter`: boolean — True when store filtering applies to this object type.
- `supportsStoreGroupFilter`: boolean — True when store group filtering applies to this object type.
- `supportsStoreGroupOnShipmentsFilter`: boolean — True when shipment level store group filtering applies to this object type.
- `supportsWarehouseFilter`: boolean — True when warehouse filtering applies to this object type.
- `supportsPropertyFilter`: boolean — True when property filtering applies to this object type.
