# OmniumWorkflowStep

**Fields:**

- `name`: string, nullable — Workflow step name
- `active`: boolean — True if step should be run
- `runAfterOrderIsSaved`: boolean — True if step should run after order is saved
- `stopOnError`: boolean — If true, the workflow will continue if current step fails to execute
- `translateKey`: string, nullable — Translation key for workflow step name
- `connector`: string, nullable — Connector to use for workflow step
- `isInvisible`: boolean — True if result should not be shown in GUI
- `enabledForMarkets`: List<string>, nullable — List of markets where this workflow step should be enabled (all markets available if empty)
- `disabledForMarkets`: List<string>, nullable — List of market IDs where the workflow step should be disabled (overrides enabled property)
- `enabledForStores`: List<string>, nullable — List of storeIds where this workflow step should be enabled (all stores available if empty)
- `disabledForStores`: List<string>, nullable — List of storeIds where the workflow step should be disabled (overrides enabled property)
- `enabledForStoreGroups`: List<string>, nullable — List of store group IDs where this workflow step should be enabled (all store groups available if empty)
- `disabledForStoreGroups`: List<string>, nullable — List of store group IDs where the workflow step should be disabled (overrides enabled property)
- `enabledForTags`: List<string>, nullable — List of order tags where the workflow step should be disabled (available if empty)
- `disabledForTags`: List<string>, nullable — List of order tags where the workflow step should be disabled (ovverides enabled property)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Workflow step properties
