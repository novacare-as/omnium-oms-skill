# OmniumStorePatch

Physical store, Web shop, Warehouse, or other department of the company

**Fields:**

- `id`: string, nullable — Store ID (Unique ID)
- `name`: string, nullable — Store or warehouse name
- `storeGroupId`: string, nullable — Store group ID
- `address`: [`OmniumStoreAddress`](OmniumStoreAddress.md)
- `shippingAddress`: [`OmniumStoreAddress`](OmniumStoreAddress.md)
- `availableOnMarkets`: List<string>, nullable, max length 250 — A list of market ids
- `availableWarehouses`: List<[`OmniumStoreWarehousePatch`](OmniumStoreWarehousePatch.md)>, nullable, max length 250 — A list of available warehouses
- `availableReturnLocations`: List<[`OmniumStoreWarehousePatch`](OmniumStoreWarehousePatch.md)>, nullable, max length 250 — A list of available return locations
- `phoneNumber`: string, nullable — Store phone number
- `email`: string, nullable — Store e-mail
- `comment`: string, nullable — Comment or description of the store
- `created`: string (date-time), nullable — Date store is created (utc)
- `modified`: string (date-time), nullable — Date store is modified (utc)
- `url`: string, nullable — Store URL (URL to home page, web shop, etc)
- `latitude`: string, nullable — Location latitude
- `longitude`: string, nullable — Location longitude
- `googlePlaceId`: string, nullable — ID of Google Place (optional)
- `mondayOpeningHours`: [`OmniumOpeningHoursPatch`](OmniumOpeningHoursPatch.md)
- `tuesdayOpeningHours`: [`OmniumOpeningHoursPatch`](OmniumOpeningHoursPatch.md)
- `wednesdayOpeningHours`: [`OmniumOpeningHoursPatch`](OmniumOpeningHoursPatch.md)
- `thursdayOpeningHours`: [`OmniumOpeningHoursPatch`](OmniumOpeningHoursPatch.md)
- `fridayOpeningHours`: [`OmniumOpeningHoursPatch`](OmniumOpeningHoursPatch.md)
- `saturdayOpeningHours`: [`OmniumOpeningHoursPatch`](OmniumOpeningHoursPatch.md)
- `sundayOpeningHours`: [`OmniumOpeningHoursPatch`](OmniumOpeningHoursPatch.md)
- `additionalOpeningHours`: List<[`OmniumSpecialOpeningHoursPatch`](OmniumSpecialOpeningHoursPatch.md)>, nullable, max length 250 — Additional opening hours at specific dates, overriding regular opening hours. For instance during holidays.
- `useCustomPickLimits`: boolean, nullable — Indicates if this store uses custom pick limits instead of global settings
- `storePickLimit`: string, nullable — Time limit for store to pick an order
- `storeExtendedPickLimit`: string, nullable — Extended time limit for store to pick an order
- `customerPickupDeadlineLimit`: string, nullable — Time limit for customer to pick up their order
- `externalIds`: List<string>, nullable, max length 250 — Store IDs from external systems
- `externalIdsList`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — IDs from external systems (key value list)
- `isWarehouse`: boolean, nullable — True if store can have inventory
- `isPrimaryWarehouse`: boolean, nullable — True if this is a primary company warehouse
- `isPublicVisible`: boolean, nullable — True if store information should be visible to end customers
- `isWebWarehouse`: boolean, nullable — True if warehouse inventory should be available for sale on web
- `isPrimaryStore`: boolean, nullable — True if this store is the primary store
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `shortDescription`: string, nullable — Short store description
- `description`: string, nullable — Full store description
- `imageUrl`: string, nullable — Url to store image
- `logoUrl`: string, nullable — Url to store logo
- `employees`: List<[`OmniumEmployee`](OmniumEmployee.md)>, nullable, max length 250 — List of employees at store
- `notificationEmailAddresses`: List<string>, nullable, max length 250 — Email addresses used for notifications(recipient)
- `notificationPhoneNumbers`: List<string>, nullable, max length 250 — Phone numbers used for notifications(recipient)
- `documentFooter`: string, nullable — Footer in documents like order receipt pdf. If store does not have value, fallback to document footer on market
- `isInactive`: boolean, nullable — Store is inactive (soft delete)
- `storeRoleIds`: List<string>, nullable, max length 250 — Roles the store has
- `organizationalNumber`: string, nullable — Organizational number of the store
- `accountingDimensionCode`: string, nullable — Store dimension/account code emitted on accounting postings (e.g. inter-store cost-transfer lines). Falls back to the store id when not set.
- `stockBuffer`: number (decimal), nullable — Stock buffer quantity subtracted from available inventory for this store. Null leaves the existing value unchanged (use OmniumStore PUT to clear back to market/global fallback).
- `omniStockRules`: [`OmniumOmniStockRules`](OmniumOmniStockRules.md)
- `chartOfAccounts`: List<[`OmniumChartOfAccountEntry`](OmniumChartOfAccountEntry.md)>, nullable — The store's own accounts. Null leaves them unchanged; a value replaces the whole list, and an empty list removes them.
- `taxGroups`: List<[`OmniumTaxGroup`](OmniumTaxGroup.md)>, nullable — The store's own VAT rates. The codes must exist in the tenant VAT rates, unless the tenant has no VAT rates of its own: the stores then define the codes, a line without a row keeps the market VAT rate, and when the tenant has a default code each store with rows needs a row for it. Null leaves them unchanged; a value replaces the whole list, and an empty list removes them.

**Used directly by endpoints in:**

- [Stores](../endpoints/stores.md)
