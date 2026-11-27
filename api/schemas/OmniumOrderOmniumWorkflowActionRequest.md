# OmniumOrderOmniumWorkflowActionRequest

Represents a request to perform a workflow action in the Omnium system.
This generic class allows for flexibility by supporting various models,
such as orders, purchase orders, or products, in different workflows.

**Fields:**

- `value`: [`OmniumOrder`](OmniumOrder.md)
- `workflowStep`: [`OmniumWorkflowStep`](OmniumWorkflowStep.md)
- `shipmentId`: string, nullable
- `returnOrderFormId`: string, nullable
