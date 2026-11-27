# OmniumProjectSearchRequest

**Fields:**

- `take`: integer (int32) — Number of items to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `projectId`: string, nullable — Project ID
- `projectNumber`: string, nullable — Project number
- `stepName`: string, nullable — Filter by current step name
- `email`: string, nullable — Customer e-mail
- `phone`: string, nullable — Customer phone number
- `storeContact`: string, nullable — Search projects by store contact
- `contactPersonEmails`: List<string>, nullable, max length 250 — Filter by contact person emails
- `contactPersonPhones`: List<string>, nullable, max length 250 — Filter by contact person phone numbers
- `customerId`: string, nullable — Customer name
- `customerName`: string, nullable — Customer name
- `postalCode`: string, nullable — Customer postal code
- `addressFilter`: [`OmniumAddressSearchRequest`](OmniumAddressSearchRequest.md)
- `city`: string, nullable — Customer city
- `partnerName`: string, nullable — Partner name
- `partnerId`: string, nullable — Partner ID
- `statuses`: List<string>, nullable, max length 250 — Statuses  (E.g. New, Completed, WorkflowCompleted, CancelledByCustomer etc)
- `query`: string, nullable — Search query
- `createdFrom`: string (date-time), nullable — Project created after date
- `createdTo`: string (date-time), nullable — Project created before date
- `modifiedFrom`: string (date-time), nullable — Project modified after date
- `modifiedTo`: string (date-time), nullable — Project modified before date
- `active`: boolean — Search only active projects
- `storeIds`: List<string>, nullable, max length 1000 — Filter by store IDs
- `projectTypeIds`: List<string>, nullable, max length 250 — Project type IDs
- `sortOrder`: string, nullable — Sort order
- `stepIds`: List<string>, nullable, max length 250 — Filter by current step ids
- `excludeRejectedPartnerIds`: List<string>, nullable, max length 250 — Filter by projects without rejected partner ids in list
- `rejectedPartnerIds`: List<string>, nullable, max length 250 — Filter projects by rejected partner ids in list
- `externalIds`: List<string>, nullable, max length 250 — Filter by external IDs
- `externalIdsProvider`: string, nullable — If set, only external IDs with given provider is returned
- `tags`: List<string>, nullable, max length 250 — Filter by tags
- `excludeTags`: List<string>, nullable, max length 250 — Exclude projects with tags
- `formEntries`: List<[`OmniumProjectFormEntry`](OmniumProjectFormEntry.md)>, nullable, max length 250 — Filter by form entries
- `projectFormEntryAdvancedSearch`: [`OmniumProjectFormEntryAdvancedSearch`](OmniumProjectFormEntryAdvancedSearch.md)
- `isUrgent`: boolean — If true, only projects with expired workflow steps (urgent) are returned
- `includeComments`: boolean, nullable — If true or null - attaches comments to projects before returning

**Used directly by endpoints in:**

- [Projects](../endpoints/projects.md)
- [Projects | Reports](../endpoints/projects/reports.md)
- [Projects | Transactions](../endpoints/projects/transactions.md)
