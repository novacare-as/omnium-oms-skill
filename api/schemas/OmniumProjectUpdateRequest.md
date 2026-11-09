# OmniumProjectUpdateRequest

Class used for updating projects

**Fields:**

- `id`: string, nullable — Unique Project ID. Is set by Omnium.
- `projectNumber`: string, nullable — Project number
- `externalReference`: string, nullable — An external reference to project (optional)
- `name`: string, nullable — Project name
- `publicUrl`: string, nullable — URL to public project website
- `storeId`: string, nullable — Store handling the project
- `customer`: [`OmniumProjectCustomer`](OmniumProjectCustomer.md)
- `storeContact`: [`OmniumContactPerson`](OmniumContactPerson.md)
- `contactPersons`: List<[`OmniumContactPerson`](OmniumContactPerson.md)>, nullable, max length 250 — Contact persons
- `partner`: [`OmniumBusinessCustomer`](OmniumBusinessCustomer.md)
- `partners`: List<[`OmniumProjectPartner`](OmniumProjectPartner.md)>, nullable, max length 250 — Project partners (used if project type supports multiple partners)
- `formData`: List<[`OmniumProjectFormEntry`](OmniumProjectFormEntry.md)>, nullable, max length 250 — Custom project data (e.g. from at public form)
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external project IDs
- `addresses`: List<[`OmniumAddress`](OmniumAddress.md)>, nullable, max length 250 — Project addresses
- `projectValue`: number (decimal), nullable — Project value
- `projectParts`: List<[`OmniumProjectPart`](OmniumProjectPart.md)>, nullable, max length 250 — Project parts
- `transactions`: List<[`OmniumProjectTransaction`](OmniumProjectTransaction.md)>, nullable, max length 250 — Project transactions
- `changeOrders`: List<[`OmniumProjectChangeOrder`](OmniumProjectChangeOrder.md)>, nullable, max length 250 — Project change orders
- `stores`: List<[`OmniumProjectStore`](OmniumProjectStore.md)>, nullable, max length 250 — Additional stores with access to project
- `cancellationCode`: string, nullable — Cancellation code (should correspond to cancellation reasons in settings)
- `cancellationReason`: string, nullable — Custom cancellation reason (free text)
- `deadline`: string (date-time), nullable — Deadline based on current workflow step (UTC)
- `tags`: List<string>, nullable, max length 250 — Project tags
- `products`: List<[`OmniumProjectProductReference`](OmniumProjectProductReference.md)>, nullable, max length 250 — Products associated with the project

**Used directly by endpoints in:**

- [Projects](../endpoints/projects.md)
