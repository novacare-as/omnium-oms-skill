# OmniumReturnOrderSearchRequest

Search request object for return orders

**Fields:**

- `id`: string, nullable — Return order ID
- `orderNumber`: string, nullable — Order number
- `rmaNumber`: string, nullable — RMA number
- `customerId`: string, nullable — Customer ID
- `projectId`: string, nullable — Project ID
- `email`: string, nullable — Customer e-mail
- `phone`: string, nullable — Customer phone
- `customerName`: string, nullable — Customer name
- `searchText`: string, nullable — Search text
- `selectedStores`: List<string>, nullable, max length 250 — Selected store IDs
- `createdFrom`: string (date-time), nullable — Created from
- `createdTo`: string (date-time), nullable — Created to
- `modifiedFrom`: string (date-time), nullable — Modified from date
- `modifiedTo`: string (date-time), nullable — Modified before date
- `completedFrom`: string (date-time), nullable — Return completed from date
- `completedTo`: string (date-time), nullable — Return completed before date
- `take`: integer (int32) — Take
- `page`: integer (int32) — Page

**Used directly by endpoints in:**

- [Orders | Returns](../endpoints/orders/returns.md)
