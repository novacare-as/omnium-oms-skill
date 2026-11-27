# OmniumCustomerSearchRequest

Customer search request

**Fields:**

- `storeIds`: List<string>, nullable, max length 1000 — Filter for store IDs
- `marketIds`: List<string>, nullable, max length 250 — Filter for market IDs
- `marketGroupIds`: List<string>, nullable, max length 250 — Filter for market group IDs
- `isMarketGroupIdsRequired`: boolean, nullable — Set to 'true' to exclude customers without any MarketGroupId set. If 'false', customers without market group IDs will be returned when market group ID filter is used
- `isStoreIdsRequired`: boolean, nullable — Set to 'true' to exclude customers without any Store IDs set. If 'false', customers without store IDs will be returned when store ID filter is used
- `storeGroupId`: string, nullable — Filter by store group ID (will override StoreIds if set)
- `customerId`: string, nullable — Filter by customer
- `customerIds`: List<string>, nullable, max length 250 — Filter by multiple customer IDs
- `customerNumbers`: List<string>, nullable, max length 250 — Filter by multiple customer numbers
- `customerGroups`: List<string>, nullable — Filter by customer groups
- `createdFrom`: string (date-time), nullable — Customer created from date
- `createdTo`: string (date-time), nullable — Customer created before date
- `modifiedFrom`: string (date-time), nullable — Customer modified from date
- `modifiedTo`: string (date-time), nullable — Customer modified before date
- `taxId`: string, nullable — Filter by customer
- `email`: string, nullable — Filter by customer email
- `phone`: string, nullable — Filter by customer phone
- `hasErrors`: boolean — Only show customers with errors
- `selectedErrors`: List<string>, nullable — Only show customers carrying one of these error keys. A connector that a tenant runs several instances of prefixes its error keys with the connector alias, so pass the key exactly as it appears on the customer.
- `query`: string, nullable — Search by free text query
- `searchStoreGroups`: boolean — If true, search will include all stores with same store group ID as for the stores with given StoreIds
- `isInactive`: boolean, nullable — If true, search will include all customers marked as inactive. If false all customers marked as inactive will be excluded. Null returns all.
- `isGlobal`: boolean, nullable — If true, search will include all customers marked as global. If false all customers marked as global will be excluded. Null returns all.
- `isCustomerClubMember`: boolean, nullable — If true, search will only include customers that are members of a customer club. If false, only non-members. Null returns all
- `externalIds`: List<string>, nullable, max length 250 — Search by external IDs
- `consentTypes`: List<string>, nullable, max length 250 — List of consent types. Will filter customers for any active consent of given types.
- `projectTypeId`: string, nullable — Filter on customers available as partners on a project type. (Only available on business customer search)
- `sortOrder`: string, nullable — Sort order (ModifiedAscending, ModifiedDescending, CreatedAscending, CreatedDescending)
- `tags`: List<string>, nullable, max length 250 — Customer tags
- `excludedTags`: List<string>, nullable, max length 250 — Filter by excluding tags
- `take`: integer (int32) — Number of items to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — List with custom properties to search for

**Used directly by endpoints in:**

- [Customers | B2B](../endpoints/customers/b2b.md)
- [Customers | B2C](../endpoints/customers/b2c.md)
