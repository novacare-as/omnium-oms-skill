# OmniumProject

Class containing information for projects, e.g. a claim from a customer, or a service provided to an end customer

**Fields:**

- `id`: string, nullable — Unique Project ID. Is set by Omnium.
- `projectNumber`: string, nullable — Project number
- `versionId`: string, nullable — Project version
- `externalReference`: string, nullable — An external reference to project (optional)
- `name`: string, nullable — Project name
- `publicUrl`: string, nullable — URL to public project website
- `storeId`: string, nullable — Store handling the project
- `stores`: List<[`OmniumProjectStore`](OmniumProjectStore.md)>, nullable, max length 250 — Additional stores with access to project
- `customer`: [`OmniumProjectCustomer`](OmniumProjectCustomer.md)
- `type`: string, nullable — Project type ID
- `subType`: string, nullable — Project subtype
- `status`: string, nullable — Project status (Active / Completed / New etc). Populate from constant class OmniumProjectStatus.
- `projectTypeName`: string, nullable — Name of project's project type.
- `workflowStep`: [`OmniumProjectWorkflowStep`](OmniumProjectWorkflowStep.md)
- `storeContact`: [`OmniumContactPerson`](OmniumContactPerson.md)
- `contactPersons`: List<[`OmniumContactPerson`](OmniumContactPerson.md)>, nullable, max length 250 — Contact persons
- `logItems`: List<[`OmniumProjectLog`](OmniumProjectLog.md)>, nullable, **deprecated**, max length 250 — Log items (tracking each step in the project process) (Obsolete - can be fetched from ProjectLog-endpoints)
- `partner`: [`OmniumBusinessCustomer`](OmniumBusinessCustomer.md)
- `partners`: List<[`OmniumProjectPartner`](OmniumProjectPartner.md)>, nullable, max length 250 — Project partners (used if project type supports multiple partners)
- `hasMultiplePartners`: boolean, read-only — True if project has more than one partner
- `formData`: List<[`OmniumProjectFormEntry`](OmniumProjectFormEntry.md)>, nullable, max length 250 — Custom project data (e.g. from at public form)
- `comments`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — Comments only visible to partners
- `customerComments`: List<[`OmniumComment`](OmniumComment.md)>, nullable, max length 250 — Comments visible to customers
- `created`: string (date-time) — Date project is created (UTC)
- `modified`: string (date-time) — Date project is modified (UTC)
- `workflowSteps`: List<[`OmniumProjectWorkflowStep`](OmniumProjectWorkflowStep.md)>, nullable, max length 250 — All project workflow steps
- `deadline`: string (date-time), nullable — Deadline based on current workflow step (UTC)
- `projectDate`: string (date-time), nullable — Describing the date when the main activity of the project is performed.
- `rentalFrom`: string (date-time), nullable — Rental period start date (UTC). Only set for rental projects.
- `rentalTo`: string (date-time), nullable — Rental return date (UTC). The return day is not counted as a rental day. Only set for rental projects.
- `isRentalProject`: boolean — True if this project tracks a rental lifecycle
- `canceled`: string (date-time), nullable — Cancellation date of the project.
- `attachments`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — File attachments to project
- `attachmentsRootDirectory`: string, nullable — Blob storage root directory for attachments on this project
- `projectCategory`: string, nullable — Project category (e.g. Claim, Service)
- `rejectedByPartners`: List<string>, nullable, max length 250 — List of partnerIds for partners who have rejected a project
- `partnerCheckList`: List<[`OmniumProjectCheckListItem`](OmniumProjectCheckListItem.md)>, nullable, max length 250 — Project checklist
- `cancellationCode`: string, nullable — Cancellation code - reason for cancelling project
- `cancellationReason`: string, nullable — Reason for cancelling project - free text
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external project IDs
- `addresses`: List<[`OmniumAddress`](OmniumAddress.md)>, nullable, max length 250 — Project addresses
- `projectValue`: number (decimal) — Project value (Calculated if project has transactions)
- `projectAdditionalValue`: number (decimal) — Additional project value. To manually adjust project value. Will be added to project value together with the transaction values.
- `projectBudgetValue`: number (decimal) — Project budget value (Calculated if project has transactions)
- `projectParts`: List<[`OmniumProjectPart`](OmniumProjectPart.md)>, nullable, max length 250 — Project parts / sections
- `changeOrders`: List<[`OmniumProjectChangeOrder`](OmniumProjectChangeOrder.md)>, nullable, max length 250 — Project change orders
- `transactions`: List<[`OmniumProjectTransaction`](OmniumProjectTransaction.md)>, nullable, max length 250 — Project level transactions
- `transactionSummary`: [`OmniumProjectTransaction`](OmniumProjectTransaction.md)
- `projectTransactionTotal`: [`OmniumProjectTransaction`](OmniumProjectTransaction.md)
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable, max length 250 — List of errors
- `tags`: List<string>, nullable, max length 250 — Project tags
- `products`: List<[`OmniumProjectProductReference`](OmniumProjectProductReference.md)>, nullable — Products associated with the project
- `rmaNumbers`: List<string>, nullable, max length 250 — RMA numbers associated with the project. Set by Omnium when a claim is created from a return.

**Used directly by endpoints in:**

- [Obsolete](../endpoints/obsolete.md)
- [Projects](../endpoints/projects.md)
- [Projects | Change orders](../endpoints/projects/change-orders.md)
- [Projects | Parts](../endpoints/projects/parts.md)
- [Projects | Transactions](../endpoints/projects/transactions.md)
