# OmniumPriceList

Represents a price list in the OMS.

**Fields:**

- `id`: string, required — Unique identifier for the price list.
- `name`: string, required — The name of the price list.
- `priceListType`: [`OmniumPriceListTypeEnum`](OmniumPriceListTypeEnum.md)
- `priceType`: [`OmniumPriceTypeEnum`](OmniumPriceTypeEnum.md)
- `marketId`: string, nullable, **deprecated** — Identifier for the market this price list applies to (deprecated - use MarketIds or MarketGroupId instead).
- `marketIds`: List<string>, nullable — List of market IDs this price list applies to. Replaces MarketId for multi-market support. Mutually exclusive with MarketGroupId.
- `marketGroupId`: string, nullable — Market group ID this price list applies to. All markets in the group will be included. Mutually exclusive with MarketIds.
- `storeIds`: List<string>, nullable, max length 1000 — List of store IDs where this price list is applicable. Limited to a maximum of 1000 store IDs.
- `currencyCode`: string, required — The currency code for the prices in this price list
- `costCurrencyCode`: string, nullable — Currency code for the cost price. Defaults to the same as CurrencyCode
- `costCurrencyExchangeRate`: number (decimal), nullable — The exchange rate from cost currency to the currency for the price list. If not given, it will be calculated and set to today's exchange rate.
- `customerIds`: List<string>, nullable, max length 250 — List of customer IDs this price list applies to. Limited to a maximum of 250 customer IDs.
- `customerGroups`: List<[`OmniumCustomerGroupReference`](OmniumCustomerGroupReference.md)>, nullable, max length 250 — List of customer groups eligible for this price list. Limited to a maximum of 250 customer groups.
- `validFrom`: string (date-time), nullable — The start date and time from which the price list is valid.
- `validTo`: string (date-time), nullable — The end date and time until which the price list is valid. If null, the price list does not expire.
- `costPriceValidFrom`: string (date-time), nullable — Optional start date for cost prices. Allows the buying window to differ from the selling window (e.g. a store buying stock earlier than the campaign sells). If null, ValidFrom is used.
- `costPriceValidTo`: string (date-time), nullable — Optional end date for cost prices. Allows the buying window to differ from the selling window. If null, ValidTo is used.
- `storeCostPriceValidFrom`: string (date-time), nullable — Optional start date for store cost prices (only relevant when IsStoreCostPriceEnabled is true). If null, ValidFrom is used.
- `storeCostPriceValidTo`: string (date-time), nullable — Optional end date for store cost prices (only relevant when IsStoreCostPriceEnabled is true). If null, ValidTo is used.
- `unit`: string, nullable — The unit of measurement for the price list (e.g., "KG", "PCS"). IMPORTANT: Only use this if price list should apply to other units than the main sales unit
- `roundingDecimals`: integer (int32), nullable — Number of decimal places to use when calculating unit price.
- `isCustomerClubSpecificPrice`: boolean, nullable — If the prices should be customer specific
- `taxRate`: number (decimal), nullable — The tax rate for the price list. If not given, the default tax rate for the market will be set.
- `isExcludingTax`: boolean — If tax should be ignored on the price list
- `isActive`: boolean — Calculated: True if the price list is activated.
- `isPromotionsAllowed`: boolean, nullable — True if prices from the price list can be combined with promotions
- `published`: string (date-time), nullable — Calculated: The time when the price list was activated
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable — Optional properties on the price list
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable — Optional external ids on the price list
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable — Calculated: If something is wrong with the price list
- `created`: string (date-time), nullable — Created date
- `modified`: string (date-time), nullable — Calculated: Modified date
- `priceFactor`: number (decimal), nullable — PriceFactor and PurchaseDiscountPercentage is used to calculate 'configurable product prices. PriceFactor works as a exchange rate (with mark-up) when calculating the placed price (example SEK) from the inputted list price (NOK).
- `purchaseDiscountPercentage`: number (decimal) — Only relevant for configurable products when calculating cost price from inputted list price
- `isPriceEditable`: boolean — Allow editing the calculated prices which are disabled by default
- `useLatestExchangeRateForCost`: boolean — When enabled, the latest available currency exchange rate is always used to calculate the cost
- `supplierId`: string, nullable
- `tags`: List<string>, nullable, max length 250 — Tags for categorizing/labeling price lists (e.g. "Last Chance", "Clearance"). Downstream systems can use these tags for display logic.
- `isStoreCostPriceEnabled`: boolean — Enable store cost pricing with separate market/store group dimensions
- `storeCostPriceMarketIds`: List<string>, nullable — Market IDs for store cost price dimension
- `storeCostPriceStoreGroupIds`: List<string>, nullable — Store group IDs for store cost price dimension
- `promotionId`: string, nullable — Reference to the owning promotion.
- `isMetadataOnly`: boolean — When true, this price list contains only planning/budget metadata and does not push prices to products.

**Used directly by endpoints in:**

- [Products | Price Lists](../endpoints/products/price-lists.md)
