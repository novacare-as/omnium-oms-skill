# OmniumMarket

Market

**Fields:**

- `marketId`: string, nullable — Unique market ID (ENG, NOR, SWE, etc)
- `marketName`: string, nullable — Name of market
- `isDefaultMarket`: boolean, nullable — True if market should be used by default for new orders
- `isActive`: boolean, nullable — True if market is active. False if temporary unavailable.
- `isTaxExcluded`: boolean, nullable — True if tax should not be added to orders
- `language`: string, nullable — Market language name (English, Norwegian, German, etc...)
- `languageCode`: string, nullable — Market language code (two letter ISO: no, en, etc...)
- `isoLanguageCode`: string, nullable — ISO Language/Region-code (en-US, nb-NO, de-DE, etc...)
- `countryCode`: string, nullable — Two letter country code ("EN", "NO", etc...)
- `currency`: string, nullable — Default market currency (USD, EUR, NOK etc)
- `productContentLanguage`: string, nullable — Default market content language for products (en, se, no, etc)
- `marketGroupId`: string, nullable — Used for CompanyId in D365, but can also be used as a key to group multiple markets
- `marketGroupLabel`: string, nullable — Used for labeling market groups in UI
- `marketType`: string, nullable — B2C / B2B / Possible other values for other tenants
- `defaultTaxRate`: number (decimal), nullable — Default tax rate for market
- `defaultStoreId`: string, nullable — If set, this store is used as default store on new carts for this market. Prioritized over the customer's stores and the default warehouse, but not over the user's own store context.
- `websiteUrl`: string, nullable — Public website url
- `documentFooter`: string, nullable — Footer in documents like order receipt pdf. Used as fallback if store does not have value in DocumentFooter prop
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `shipmentOptions`: List<[`OmniumShipmentOption`](OmniumShipmentOption.md)>, nullable, max length 250 — List of shipment options available for market

**Used directly by endpoints in:**

- [Markets](../endpoints/markets.md)
