# OmniumEmployee

Class for storing employees

**Fields:**

- `userName`: string, nullable — Omnium user name (used to connect users and employees)
- `firstName`: string, nullable — Employee first name
- `lastName`: string, nullable — Employee last name
- `position`: string, nullable — Employee position (CEO, Customer service, Warehouse associate, etc)
- `email`: string, nullable — Employee e-mail
- `phone`: string, nullable — Employee phone
- `imageUrl`: string, nullable — Image url
- `pin`: string, nullable — [Only relevant on OmniumUserModel] Employee pin for logging into multi user
- `isInactive`: boolean — [Only relevant on OmniumUserModel] Is Inactive
