# OmniumPriceSearchRequest

Contains all parameters for doing a price search. At least one parameter must be set

**Fields:**

- `lastModified`: string (date-time), nullable — Set LastModified to a specific DateTime to get items only modified after that time
- `customerId`: string, nullable — Filter prices on customer ID
- `customerGroupId`: string, nullable — Filter prices on Customer Group ID
- `marketId`: string, nullable, **deprecated** — Filter prices on market ID
- `marketIds`: List<string>, nullable — Filter prices on one or more market IDs. A price matches if its market ID is any of the provided values. Takes precedence over the obsolete MarketId.
- `productCodes`: List<string>, nullable, max length 20000 — Filter prices on product codes (SKU / Product ID)
- `priceType`: string, nullable — Filter prices on price type
- `scrollSize`: integer (int32), nullable — Optional: The number of items returned for each scroll request. Default value is 1000. Max is 20000 and minimum is 500.
- `unit`: string, nullable — Filter prices on unit
- `isCustomerSpecificPrice`: boolean, nullable — Filter prices by customer specific prices. Set to 'true' to get only customer specific prices. Set to 'false' to get prices that are not customer specific. If not assigned, no customer filtering will be applied.
- `validFrom`: string (date-time), nullable — Only return prices that are valid from this point in time, i.e. prices whose ValidFrom is on or before this value (prices without a ValidFrom are always included). Combine with ValidUntil set to the same timestamp to get prices valid at a single moment. If not set, no start-of-validity filtering is applied.
- `validUntil`: string (date-time), nullable — Only return prices that are still valid at this point in time, i.e. prices whose ValidUntil is on or after this value (prices without a ValidUntil never expire and are always included). Combine with ValidFrom set to the same timestamp to get prices valid at a single moment. If not set, no end-of-validity filtering is applied.

**Used directly by endpoints in:**

- [Products | Prices](../endpoints/products/prices.md)
