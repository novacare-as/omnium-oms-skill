# OmniumCartTemplate

A cart templates contains a cart and meta data

**Fields:**

- `id`: string, nullable — Cart template ID
- `cart`: [`OmniumCart`](OmniumCart.md)
- `salesPersonId`: string, nullable — Sales person ID
- `salesPersonName`: string, nullable — Sales person name
- `modified`: string (date-time) — Modified
- `created`: string (date-time) — Created
- `name`: string, nullable — Name of the cart template
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Additional properties / meta data

**Used directly by endpoints in:**

- [Carts | Templates](../endpoints/carts/templates.md)
