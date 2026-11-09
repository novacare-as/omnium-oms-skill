# OmniumCustomerRelation

Customer reference for defining customers relations

**Fields:**

- `customerId`: string, nullable — ID of the customer referenced
- `customerType`: string, nullable — Customer type (B2B, B2C)
- `relationType`: string, nullable — Relation type (InvoiceReceiver, GoodsReceiver, etc - configurable in settings)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — External IDs
