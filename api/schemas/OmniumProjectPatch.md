# OmniumProjectPatch

Class containing information for projects, e.g. a claim from a customer, or a service provided to an end customer

**Fields:**

- `id`: string, nullable — Unique Project ID. Is set by Omnium.
- `projectNumber`: string, nullable — Project number
- `versionId`: string, nullable — Project version
- `externalReference`: string, nullable — An external reference to project (optional)
- `name`: string, nullable — Project name
- `publicUrl`: string, nullable — URL to public project website
- `storeId`: string, nullable — Store handling the project
- `stores`: List<[`OmniumProjectStore`](OmniumProjectStore.md)>, nullable — Additional stores with access to project
- `customer`: [`OmniumPrivateCustomer`](OmniumPrivateCustomer.md)
- `type`: string, nullable — Project type ID
- `subType`: string, nullable — Project subtype
- `status`: string, nullable — Project status (Active / Completed / New etc). Populate from constant class OmniumProjectStatus.
- `storeContact`: [`OmniumContactPerson`](OmniumContactPerson.md)
- `partners`: List<[`OmniumProjectPartner`](OmniumProjectPartner.md)>, nullable — Project partners (used if project type supports multiple partners)
- `hasMultiplePartners`: boolean, nullable, read-only — True if project has more than one partner
- `formData`: List<[`OmniumProjectFormEntry`](OmniumProjectFormEntry.md)>, nullable — Custom project data (e.g. from at public form)
- `created`: string (date-time), nullable — Date project is created (UTC)
- `modified`: string (date-time), nullable — Date project is modified (UTC)
- `deadline`: string (date-time), nullable — Deadline based on current workflow step (UTC)
- `projectCategory`: string, nullable — Project category (e.g. Claim, Service)
- `cancellationCode`: string, nullable — Cancellation code - reason for cancelling project
- `cancellationReason`: string, nullable — Reason for cancelling project - free text
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable — List of external project IDs
- `tags`: List<string>, nullable — Project tags
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable — List of errors on the project. Send an empty list to clear all errors.
- `keepExistingListItems`: boolean, nullable — Determines behaviour when updating list where items does not have unique id (errors). If true, new items will be added to the existing list. If false, the existing list will be replaced with the new list. 'True' by default.
- `projectValue`: number (decimal), nullable — Project value (Calculated if project has transactions)
- `projectBudgetValue`: number (decimal), nullable — Project budget value (Calculated if project has transactions)
- `products`: List<[`OmniumProjectProductReference`](OmniumProjectProductReference.md)>, nullable — Products associated with the project (replaces full product list when set)

**Used directly by endpoints in:**

- [Projects](../endpoints/projects.md)
