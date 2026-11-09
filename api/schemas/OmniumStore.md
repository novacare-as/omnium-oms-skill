# OmniumStore

Physical store, Web shop, Warehouse, or other department of the company

**Fields:**

- `id`: string, required — Store ID (Unique ID)
- `name`: string, nullable — Store or warehouse name
- `storeGroupId`: string, nullable — Store group ID
- `address`: [`OmniumStoreAddress`](OmniumStoreAddress.md)
- `shippingAddress`: [`OmniumStoreAddress`](OmniumStoreAddress.md)
- `availableOnMarkets`: List<string>, nullable, max length 250 — A list of market ids
- `availableWarehouses`: List<[`OmniumStoreWarehouse`](OmniumStoreWarehouse.md)>, nullable, max length 250 — A list of available warehouses
- `availableReturnLocations`: List<[`OmniumStoreWarehouse`](OmniumStoreWarehouse.md)>, nullable, max length 250 — A list of available return locations
- `phoneNumber`: string, nullable — Store phone number
- `email`: string, nullable — Store e-mail
- `comment`: string, nullable — Comment or description of the store
- `created`: string (date-time) — Date store is created (utc)
- `modified`: string (date-time) — Date store is modified (utc)
- `url`: string, nullable — Store URL (URL to home page, web shop, etc)
- `latitude`: string, nullable — Location latitude
- `longitude`: string, nullable — Location longitude
- `googlePlaceId`: string, nullable — ID of Google Place (optional)
- `mondayOpeningHours`: [`OmniumOpeningHours`](OmniumOpeningHours.md)
- `tuesdayOpeningHours`: [`OmniumOpeningHours`](OmniumOpeningHours.md)
- `wednesdayOpeningHours`: [`OmniumOpeningHours`](OmniumOpeningHours.md)
- `thursdayOpeningHours`: [`OmniumOpeningHours`](OmniumOpeningHours.md)
- `fridayOpeningHours`: [`OmniumOpeningHours`](OmniumOpeningHours.md)
- `saturdayOpeningHours`: [`OmniumOpeningHours`](OmniumOpeningHours.md)
- `sundayOpeningHours`: [`OmniumOpeningHours`](OmniumOpeningHours.md)
- `additionalOpeningHours`: List<[`OmniumSpecialOpeningHours`](OmniumSpecialOpeningHours.md)>, nullable, max length 250 — Additional opening hours at specific dates, overriding regular opening hours. For instance during holidays.
- `useCustomPickLimits`: boolean — Indicates if this store uses custom pick limits instead of global settings
- `storePickLimit`: string — Time limit for store to pick an order
- `storeExtendedPickLimit`: string — Extended time limit for store to pick an order
- `customerPickupDeadlineLimit`: string — Time limit for customer to pick up their order
- `externalIds`: List<string>, nullable, max length 250 — Store IDs from external systems
- `externalIdsList`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — IDs from external systems (key value list)
- `isWarehouse`: boolean — True if store can have inventory
- `isPrimaryWarehouse`: boolean — True if this is a primary company warehouse
- `isPublicVisible`: boolean — True if store information should be visible to end customers
- `isWebWarehouse`: boolean — True if warehouse inventory should be available for sale on web
- `isPrimaryStore`: boolean — True if this store is the primary store
- `isVirtual`: boolean, nullable — Indicates a virtual warehouse. Only to be used with virtual stock locations in Omnium.
- `hasVirtualStockLocations`: boolean, nullable — Indicates that the warehouse has virtual warehouses in front. Only viable for physical warehouses. Only to be used with virtual stock locations in Omnium.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `bestBets`: List<string>, nullable, max length 250 — Best bets
- `shortDescription`: string, nullable — Short store description
- `description`: string, nullable — Full store description
- `imageUrl`: string, nullable — Url to store image
- `logoUrl`: string, nullable — Url to store logo
- `employees`: List<[`OmniumEmployee`](OmniumEmployee.md)>, nullable, max length 250 — List of employees at store
- `notificationEmailAddresses`: List<string>, nullable, max length 250 — Email addresses used for notifications(recipient)
- `notificationPhoneNumbers`: List<string>, nullable, max length 250 — Phone numbers used for notifications(recipient)
- `documentFooter`: string, nullable — Footer in documents like order receipt pdf. If store does not have value, fallback to document footer on market
- `zipCodeRanges`: List<[`OmniumZipCodeRange`](OmniumZipCodeRange.md)>, nullable, max length 5000 — Range of zip codes the store delivers to
- `organizationalNumber`: string, nullable — Organizational number of the store
- `iban`: string, nullable — International bank account number of the store
- `swift`: string, nullable — SWIFT code of the store
- `bank`: string, nullable — Bank name of the store
- `accountingDimensionCode`: string, nullable — Store dimension/account code emitted on accounting postings (e.g. inter-store cost-transfer lines). Falls back to the store id when not set.
- `chartOfAccounts`: List<[`OmniumChartOfAccountEntry`](OmniumChartOfAccountEntry.md)>, nullable — The store's own accounts. Each one replaces the tenant account it matches on category, discriminator, currency and tax group; every other tenant account still applies. Returned when a single store is read, and left out of store lists and searches. When posted, null keeps the store's accounts and an empty list removes them.
- `taxGroups`: List<[`OmniumTaxGroup`](OmniumTaxGroup.md)>, nullable — The store's own VAT rates, for a store that sells under another VAT scheme than the tenant. A row replaces every tenant row with the same code; every other tenant VAT rate still applies. The codes must exist in the tenant VAT rates, unless the tenant has no VAT rates of its own: the stores then define the codes, a line without a row keeps the market VAT rate, and when the tenant has a default code each store with rows needs a row for it. GET api/Stores/{storeId}/TaxGroups returns the rates the store resolves to. Returned when a single store is read, and left out of store lists and searches. When posted, null keeps the store's rows and an empty list removes them.
- `isInactive`: boolean, nullable — Store is inactive
- `storeRoleIds`: List<string>, nullable, max length 250 — Roles the store has
- `assortmentIncludeCategoryIds`: List<string>, nullable, max length 250 — CategoryIds included in the store's assortment. This is the categoryId from OmniumProductCategory, and is only a link to an existing ProductCategory in Omnium. When posted, if null, the property is not updated. If categories should be removed, send empty list.
- `assortmentExcludeCategoryIds`: List<string>, nullable, max length 250 — CategoryIds excluded from the store's assortment. This is the categoryId from OmniumProductCategory, and is only a link to an existing ProductCategory in Omnium. When posted, if null, the property is not updated. If categories should be removed, send empty list.
- `defaultOrderType`: string, nullable — The default order type that will be used when creating a cart for this store
- `stockBuffer`: number (decimal), nullable — Stock buffer quantity subtracted from available inventory for this store. Null falls back to the tenant global buffer; 0 explicitly disables fallback. Can be overridden per product via Properties.
- `omniStockRules`: [`OmniumOmniStockRules`](OmniumOmniStockRules.md)

**Used directly by endpoints in:**

- [Stores](../endpoints/stores.md)
