# OmniumSupplier

Company that delivers purchase orders

**Fields:**

- `id`: string, nullable — Supplier ID
- `name`: string, nullable — Supplier company name
- `omniumStoreId`: string, nullable — Only use if the supplier is a store in Omnium
- `taxId`: string, nullable — Tax ID, or other governmental identification number
- `contacts`: List<[`OmniumContactPerson`](OmniumContactPerson.md)>, nullable, max length 250 — Supplier contact persons
- `address`: [`OmniumAddress`](OmniumAddress.md)
- `addresses`: List<[`OmniumAddress`](OmniumAddress.md)>, nullable — Additional addresses associated with the supplier (e.g., billing, delivery).
- `email`: string, nullable — Supplier e-mail
- `phone`: string, nullable — Supplier phone number
- `created`: string (date-time), nullable — Date created
- `modified`: string (date-time), nullable — Date modified
- `preferredLanguage`: string, nullable — Supplier language
- `preferredCurrency`: string, nullable — Supplier currency
- `defaultLeadTime`: integer (int32), nullable — Supplier default lead time
- `defaultLeadTimeSafetyMarginDays`: integer (int32), nullable — Safety margin added to the lead time to give an extra inventory buffer
- `defaultOrderIntervalDays`: integer (int32), nullable — Purchase interval in days (number of days to multiply by average daily sales)
- `paymentTerms`: integer (int32), nullable — Standard payment terms agreed with the supplier, expressed as number of days.
- `incoterms`: string, nullable — The Incoterms agreement that applies to purchases from this supplier (e.g., FOB, DDP).
- `shippingProvider`: string, nullable — The supplier’s standard freight provider (e.g., PostNord, DHL, Loomis).
- `shipmentCost`: number (decimal) — Default shipment costs applied when ordering from this supplier. Can represent either a fixed cost or a baseline for freight calculation.
- `storeIds`: List<string>, nullable, max length 1000 — Available store IDs
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 500 — Customer properties, (key values)
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external supplier IDs
- `versionId`: string, nullable — Version ID
- `previousVersionId`: string, nullable — Previous Version ID
- `tags`: List<string>, nullable — Tags used for categorization or search purposes.
- `storeGroupIds`: List<string>, nullable — List of store group IDs linked to this supplier.
- `minimumOrderAmount`: number (decimal), nullable — Minimum total order amount for purchase orders to this supplier.
- `maximumOrderAmount`: number (decimal), nullable — Maximum total order amount for purchase orders to this supplier.
- `assortmentCodes`: List<string>, nullable — Assortment codes that define which products can be ordered from this supplier.

**Used directly by endpoints in:**

- [Suppliers](../endpoints/suppliers.md)
