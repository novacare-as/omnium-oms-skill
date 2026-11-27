# OmniumProjectPartner

**Fields:**

- `id`: string, nullable — Partner ID (Omnium business customer)
- `name`: string, nullable — Partner name
- `address`: [`OmniumAddress`](OmniumAddress.md)
- `addresses`: List<[`OmniumAddress`](OmniumAddress.md)>, nullable, max length 250 — Partner addresses
- `email`: string, nullable — Partner email address
- `phone`: string, nullable — Partner phone number
- `contacts`: List<[`OmniumContactPerson`](OmniumContactPerson.md)>, nullable, max length 250 — Partner contact persons
- `role`: string, nullable — Partner role (E.g. Carpenter)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
