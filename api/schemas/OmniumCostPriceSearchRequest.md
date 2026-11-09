# OmniumCostPriceSearchRequest

Contains all parameters for doing a cost price search.

**Fields:**

- `lastModified`: string (date-time), nullable — Set LastModified to a specific DateTime to get items only modified after that time
- `marketIds`: List<string>, nullable — Filter prices on market IDs
- `storeGroupId`: string, nullable — Filter prices on store group ID
- `storeIds`: List<string>, nullable — Filter prices on store IDs
- `productCodes`: List<string>, nullable — Filter prices on product codes (SKU / Product ID)
- `validFrom`: string (date-time), nullable — Filter prices on valid from date. If null, the search will not filter by this property.
- `validUntil`: string (date-time), nullable — Filter prices on valid until date. If null, the search will not filter by this property.

**Used directly by endpoints in:**

- [Products | Cost Prices](../endpoints/products/cost-prices.md)
