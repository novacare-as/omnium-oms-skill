# OmniumCustomerGroup

Customer group

**Fields:**

- `id`: string, nullable — Customer group ID
- `name`: string, nullable — Customer group name
- `displayName`: string, nullable — Customer group display name
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — Customer group external Ids
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Customer group properties
- `created`: string (date-time), nullable — Customer group created date
- `modified`: string (date-time), nullable — Customer group modified date

**Used directly by endpoints in:**

- [Customers | Customer groups](../endpoints/customers/customer-groups.md)
