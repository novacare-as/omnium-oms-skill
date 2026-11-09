# OmniumPrivateCustomerPatch

Private customer patch request

**Fields:**

- `firstName`: string, nullable — First name
- `lastName`: string, nullable — Last name
- `gender`: string, nullable — Gender
- `birthDate`: string (date-time), nullable — Date of birth
- `isCustomerClubMember`: boolean, nullable — True if customer is part of customer club
- `bonusPoints`: integer (int32), nullable — Number of bonus points earned by customer
- `tags`: List<string>, nullable, max length 250 — Tags for business customer
- `customerId`: string, required — Unique ID
- `customerNumber`: string, nullable — Customer identifier - does not have to be unique for each store, etc
- `phone`: string, nullable — Customer phone number
- `address`: [`OmniumAddress`](OmniumAddress.md)
- `addresses`: List<[`OmniumAddress`](OmniumAddress.md)>, nullable, max length 500 — Customer additional addresses
- `email`: string, nullable — Customer e-mail
- `url`: string, nullable — Customer url
- `storeIds`: List<string>, nullable, max length 500 — Customer favorite stores
- `marketId`: string, nullable — Customer primary market
- `additionalMarketIds`: List<string>, nullable, max length 100 — Additional customer markets (beyond the primary MarketId)
- `marketGroupId`: string, nullable — Customer market group
- `preferredLanguage`: string, nullable — Preferred customer language code
- `preferredCurrency`: string, nullable — Customer preferred currency code (E.g. USD, NOK, EUR)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Customer properties, (key values)
- `propertiesRemovalConditions`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Specifies conditions for removing existing properties before proceeding with the patch operation. Each item in this list is a property specification with multiple attributes that must all match an existing property for it to be removed. For instance, a condition { "KeyGroup": "KeyGroupToRemove", "ValueType": "List" } will remove properties only if both KeyGroup == "KeyGroupToRemove" and ValueType == "List". Multiple items in this list are evaluated with "OR" logic, so any matching condition will trigger removal.
- `keepExistingCustomProperties`: boolean, nullable — Set to 'false' if you want to update the whole 'properties' list. If true, new properties will be added to the existing list of properties. 'True' by default.
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external customer IDs
- `isGlobal`: boolean, nullable — If true, customer is available in all markets / stores
- `isInactive`: boolean, nullable — True if customer is inactive, and should not be able to make purchases
- `preferredShippingMethod`: string, nullable — Customer's preferred shipping method name (default selected in new carts)
- `paymentTerms`: string, nullable — Payment terms (free text)
- `paymentTermsNet`: integer (int32), nullable — Net payment terms (days)
- `customerGroups`: List<[`OmniumCustomerGroupReference`](OmniumCustomerGroupReference.md)>, nullable, max length 500 — Customer groups
- `consents`: List<[`OmniumConsent`](OmniumConsent.md)>, nullable, max length 200 — Customer consents
- `customerDetails`: string, nullable — Customer details (brief summary for customer service representatives)
- `customerRelations`: List<[`OmniumCustomerRelation`](OmniumCustomerRelation.md)>, nullable, max length 2000 — Related customers

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
