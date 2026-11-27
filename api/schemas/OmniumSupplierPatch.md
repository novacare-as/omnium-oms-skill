# OmniumSupplierPatch

Supplier patch model for partial updates. Only the fields with a value are updated, the rest of the supplier is left unchanged.

**Fields:**

- `id`: string, nullable — Supplier ID - used to identify the supplier to patch
- `name`: string, nullable — Supplier company name
- `omniumStoreId`: string, nullable — Only use if the supplier is a store in Omnium
- `taxId`: string, nullable — Tax ID, or other governmental identification number
- `contacts`: List<[`OmniumContactPerson`](OmniumContactPerson.md)>, nullable, max length 250 — Supplier contact persons. Replaces the existing contact persons. An empty list removes all contact persons.
- `address`: [`OmniumAddress`](OmniumAddress.md)
- `addresses`: List<[`OmniumAddress`](OmniumAddress.md)>, nullable — Additional addresses associated with the supplier (e.g., billing, delivery). Replaces the existing addresses. An empty list removes all additional addresses.
- `email`: string, nullable — Supplier e-mail
- `phone`: string, nullable — Supplier phone number
- `preferredLanguage`: string, nullable — Supplier language
- `preferredCurrency`: string, nullable — Supplier currency
- `defaultLeadTime`: integer (int32), nullable — Supplier default lead time
- `defaultLeadTimeSafetyMarginDays`: integer (int32), nullable — Safety margin added to the lead time to give an extra inventory buffer
- `defaultOrderIntervalDays`: integer (int32), nullable — Purchase interval in days (number of days to multiply by average daily sales)
- `paymentTerms`: integer (int32), nullable — Standard payment terms agreed with the supplier, expressed as number of days.
- `incoterms`: string, nullable — The Incoterms agreement that applies to purchases from this supplier (e.g., FOB, DDP).
- `shippingProvider`: string, nullable — The supplier’s standard freight provider (e.g., PostNord, DHL, Loomis).
- `shipmentCost`: number (decimal), nullable — Default shipment costs applied when ordering from this supplier. Can represent either a fixed cost or a baseline for freight calculation.
- `minimumOrderAmount`: number (decimal), nullable — Minimum total order amount for purchase orders to this supplier.
- `maximumOrderAmount`: number (decimal), nullable — Maximum total order amount for purchase orders to this supplier.
- `storeIds`: List<string>, nullable, max length 1000 — Available store IDs. Replaces the existing store IDs. An empty list removes all store IDs.
- `storeGroupIds`: List<string>, nullable — List of store group IDs linked to this supplier. Replaces the existing store group IDs. An empty list removes all store group IDs.
- `tags`: List<string>, nullable — Tags used for categorization or search purposes. Replaces the existing tags. An empty list removes all tags.
- `assortmentCodes`: List<string>, nullable — Assortment codes that define which products can be ordered from this supplier. Replaces the existing assortment codes. An empty list removes all assortment codes.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 500 — Supplier properties (key values). Merged with the existing properties by key, unless Omnium.Public.Supplier.Models.OmniumSupplierPatch.KeepExistingProperties is 'false'.
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external supplier IDs. Merged with the existing external IDs by provider name.
- `fieldsToForceNull`: List<string>, nullable — Force nullable fields to null. Use the property name, e.g. "TaxId". Supported: OmniumStoreId, TaxId, Address, Email, Phone, PreferredLanguage, PreferredCurrency, DefaultLeadTime, DefaultLeadTimeSafetyMarginDays, DefaultOrderIntervalDays, PaymentTerms, Incoterms, ShippingProvider, MinimumOrderAmount and MaximumOrderAmount.
- `keepExistingProperties`: boolean, nullable — Set to 'false' to replace the existing properties with Omnium.Public.Supplier.Models.OmniumSupplierPatch.Properties. 'True' by default (merge).

**Used directly by endpoints in:**

- [Suppliers](../endpoints/suppliers.md)
