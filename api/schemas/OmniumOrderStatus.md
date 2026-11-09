# OmniumOrderStatus

**Fields:**

- `name`: string, nullable — Order status name
- `displayName`: string, nullable — Alternative order status name
- `isMainFilter`: boolean — Is main filter
- `order`: integer (int32) — Status sort order index
- `condition`: string, nullable — Condition for showing order status (if more statuses has the same sort order)
- `isCanceledStatus`: boolean — True if orders with this status are canceled
- `isDeliveredStatus`: boolean — True if orders with this status are delivered to customer
- `isExcludedFromReservedInventory`: boolean — True if orders with this status do not reserve inventory, for example because an external system such as the ERP has already reserved the items
- `isInProgressStatus`: boolean — True if orders with this status are in progress
- `isPicked`: boolean — True if orders with this status are canceled. Used by picklist to set correct status when order is ready to ship/pick up
- `shipmentStatusUpdate`: string, nullable — If set, the shipments on order will get this status
- `mainOrderStatus`: string, nullable — If all shipments(split shipment orders) on the order has same status, order will be updated to MainOrderStatus
- `enforceAvailableStepsPolicy`: boolean, nullable — Set to true if selectable order statues should be retrived from AvailableSteps property.
- `availableSteps`: List<string>, nullable, max length 250 — List of available next order statuses. Used if EnforceAvailableStepsPolicy is set to true
- `workflowSteps`: List<[`OmniumOrderWorkflowStep`](OmniumOrderWorkflowStep.md)>, nullable, max length 250 — Workflow steps to run
- `translateKey`: string, nullable — Translation key for order status
- `color`: string, nullable — The colour of the status badge in Omnium and of the buttons that set an order or shipment to the status, one of Blue, Orange, Purple, Green, Red, Yellow, Teal and Grey. Empty when the status keeps its default colour.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `updateStatusButtonIsDisabledInGui`: boolean — If true, the button for updating to the next order status will be disabled
