# OmniumUserModel

The OmniumUserModel contains data about users in Omnium

**Fields:**

- `id`: string, nullable — User unique ID
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable — List of external user IDs. Could be ids from other SCIM providers
- `b2CId`: string, nullable — Azure B2C Id for user
- `roles`: List<string>, nullable, max length 2000 — List of roles assigned to user
- `firstName`: string, nullable — User's first name
- `lastName`: string, nullable — User's last name
- `email`: string, nullable — User's contact email
- `phone`: string, nullable — User's phone number
- `projectTypes`: List<string>, nullable, max length 1000 — Project types of interest to user
- `lastLogin`: string (date-time), nullable — Last time the user logged in to Omnium. Null if the user has never logged in.
- `imageUrl`: string, nullable — Url to user image
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties for user
- `multiEmployeeUser`: boolean — Set to true for users that are shared between multiple users. Each employee should have a pin code to identify itself.
- `employees`: List<[`OmniumEmployee`](OmniumEmployee.md)>, nullable — List of Employees sharing this user entity.

**Used directly by endpoints in:**

- [Users](../endpoints/users.md)
