# OmniumProjectStore

Store referenced by project

**Fields:**

- `storeId`: string, nullable — Store ID
- `name`: string, nullable — Store name
- `email`: string, nullable — Store email
- `phone`: string, nullable — Store phone
- `address`: [`OmniumStoreAddress`](OmniumStoreAddress.md)
- `role`: string, nullable — Store role in project
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Store properties
