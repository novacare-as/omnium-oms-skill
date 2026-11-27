# OmniumOrderWorkflowStep

**Fields:**

- `name`: string, nullable — Workflow step name
- `active`: boolean — True if step should be run
- `runAfterOrderIsSaved`: boolean — True if step should run after order is saved
- `stopOnError`: boolean — If true, the workflow will continue if current step fails to execute
- `translateKey`: string, nullable — Translation key for workflow step name
- `connector`: string, nullable — Connector to use for workflow step
- `isInvisible`: boolean — True if result should not be shown in GUI
- `enabledForMarkets`: List<string>, nullable, max length 250 — List of markets where this workflow step should be enabled (all markets available if empty)
- `disabledForMarkets`: List<string>, nullable, max length 250 — List of market IDs where the workflow step should be disabled (overrides enabled property)
- `enabledForStores`: List<string>, nullable, max length 250 — List of storeIds where this workflow step should be enabled (all stores available if empty)
- `disabledForStores`: List<string>, nullable, max length 250 — List of storeIds where the workflow step should be disabled (overrides enabled property)
- `enabledForWarehouses`: List<string>, nullable, max length 250 — List of warehouses where this workflow step should be enabled (all warehouses available if empty)
- `disabledForWarehouses`: List<string>, nullable, max length 250 — List of warehouses where this workflow step should be disabled (overrides enabled property)
- `enabledForShipmentOptions`: List<string>, nullable, max length 250 — List of shipmentOptionNames where this workflow step should be enabled (all shipmentOptions available if empty)
- `disabledForShipmentOptions`: List<string>, nullable, max length 250 — List of shipmentOptionNames where the workflow step should be disabled (overrides enabled property)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Workflow step properties
- `workflowStepConditions`: List<[`OmniumOrderWorkflowStepCondition`](OmniumOrderWorkflowStepCondition.md)>, nullable, max length 250 — Workflow conditions
- `id`: string, nullable — Step ID (provided by Omnium)
- `index`: integer (int32) — Index (for sorting)
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external order IDs
- `description`: string, nullable — Description of the step (what should be done by users during this step)
- `acceptText`: string, nullable — Text on accept button (moving forward to the next step)
- `declineText`: string, nullable — Text on decline button (moving backwards to the previous step)
- `dateText`: string, nullable — Text describing a date input. User should be able to add date if this property has value.
- `current`: boolean — True if this step is the current workflow step
- `startDate`: string (date-time), nullable — Date the step was started
- `dateCompleted`: string (date-time), nullable — Date the step was completed (if null, the step was never completed)
- `hiddenFromCustomer`: boolean — If step should be hidden from customer
- `hiddenFromPartner`: boolean — If step should be hidden from partner
- `isCommentsDisabled`: boolean — If user should be able to enter comments on this step
