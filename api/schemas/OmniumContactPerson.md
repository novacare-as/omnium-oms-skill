# OmniumContactPerson

Person class. Used for contact persons in businesses.

**Fields:**

- `firstName`: string, nullable — First name
- `lastName`: string, nullable — Last name
- `phone`: string, nullable — Phone number
- `email`: string, nullable — E-mail
- `address`: [`OmniumAddress`](OmniumAddress.md)
- `roles`: List<string>, nullable — Roles in company
- `role`: string, nullable, **deprecated** — Role in company (deprecated - use Roles instead for multiple roles support)
- `notify`: boolean — True if this contact person receive notifications
- `isPrimaryContact`: boolean — True if person is primary contact person for company
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external contact person IDs
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Contact properties, (key values)
- `id`: string, nullable — Contact person ID
- `privateCustomerId`: string, nullable — Reference to private customer. Used to connect contact person to private customer as a private person with consents, addresses, etc.

**Used directly by endpoints in:**

- [Customers | B2B | Contact persons](../endpoints/customers/b2b-contact-persons.md)
