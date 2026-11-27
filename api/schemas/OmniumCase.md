# OmniumCase

Class containing information for cases, e.g. a support case or customer inquiry

**Fields:**

- `id`: string, nullable — Unique Case ID. Is set by Omnium.
- `caseNumber`: string, nullable — Case number
- `subject`: string, nullable — Case subject / title
- `description`: string, nullable — Case description
- `status`: string, nullable — Case status (e.g. New, Open, Resolved, Closed)
- `priority`: string, nullable — Case priority (e.g. Low, Medium, High, Critical)
- `source`: string, nullable — Source of the case (e.g. Email, Phone, Web)
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
- `caseNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable — Case notes (visible to customer)
- `internalNotes`: List<[`OmniumComment`](OmniumComment.md)>, nullable — Internal notes (not visible to customer)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Custom properties
- `created`: string (date-time) — Date case was created (UTC)
- `changed`: string (date-time) — Date case was last modified (UTC)
- `followUpDate`: string (date-time), nullable — Case follow-up date
- `resolvedDate`: string (date-time), nullable — Date case was resolved (UTC)
- `closedDate`: string (date-time), nullable — Date case was closed (UTC)
- `lastCommentDate`: string (date-time), nullable — Date of the last comment on the case (UTC)
- `lastCommenterName`: string, nullable — Name of the last person who commented
- `commentCount`: integer (int32) — Total number of comments on the case
- `marketId`: string, nullable — Market ID associated with the case
- `marketGroupId`: string, nullable — Market group ID associated with the case
- `caseStatusLog`: List<[`OmniumCaseStatusLogItem`](OmniumCaseStatusLogItem.md)>, nullable — Status change timeline for the case

**Used directly by endpoints in:**

- [Cases](../endpoints/cases.md)
