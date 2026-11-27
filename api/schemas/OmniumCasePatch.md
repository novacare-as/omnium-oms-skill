# OmniumCasePatch

Patch model for partial case updates. Only non-null values will be applied.

**Fields:**

- `id`: string, nullable — Unique Case ID (required)
- `subject`: string, nullable — Case subject / title
- `description`: string, nullable — Case description
- `status`: string, nullable — Case status
- `priority`: string, nullable — Case priority
- `source`: string, nullable — Source of the case
- `assignedToUserId`: string, nullable — User ID of the assigned agent
- `assignedToName`: string, nullable — Display name of the assigned agent
- `customerName`: string, nullable — Name of the customer associated with the case
- `customerEmail`: string, nullable — Email of the customer associated with the case
- `customerId`: string, nullable — Customer ID associated with the case
- `tags`: List<string>, nullable — Tags associated with the case
- `relatedOrders`: List<string>, nullable — Related order IDs
- `relatedCustomers`: List<string>, nullable — Related customer IDs
- `relatedProjects`: List<string>, nullable — Related project IDs
- `relatedCarts`: List<string>, nullable — Related cart IDs
- `relatedSkuIds`: List<string>, nullable — Related SKU IDs (product variant codes)
- `relatedProductIds`: List<string>, nullable — Related product IDs
- `participants`: List<[`OmniumCaseParticipant`](OmniumCaseParticipant.md)>, nullable — Case participants
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties
- `followUpDate`: string (date-time), nullable — Case follow-up date
- `marketId`: string, nullable — Market ID associated with the case
- `marketGroupId`: string, nullable — Market group ID associated with the case

**Used directly by endpoints in:**

- [Cases](../endpoints/cases.md)
