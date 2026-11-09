# OmniumPrivateCustomer

Private customer

**Fields:**

- `firstName`: string, nullable — First name
- `lastName`: string, nullable — Last name
- `fullName`: string, nullable, read-only — Calculated - Full name
- `gender`: string, nullable — Gender
- `birthDate`: string (date-time), nullable — Date of birth
- `discountCoupons`: List<[`OmniumDiscountCoupon`](OmniumDiscountCoupon.md)>, nullable, max length 250 — Personal discount coupons
- `isCustomerClubMember`: boolean — True if customer is part of customer club
- `bonusPoints`: integer (int32) — Number of bonus points earned by customer
- `tags`: List<string>, nullable, max length 250 — Tags for customer
- `customerId`: string, required — Unique ID
- `customerNumber`: string, nullable — Customer identifier - does not have to be unique for each store, etc
- `phone`: string, nullable — Customer phone number
- `address`: [`OmniumAddress`](OmniumAddress.md)
- `addresses`: List<[`OmniumAddress`](OmniumAddress.md)>, nullable, max length 200 — Customer additional addresses
- `email`: string, nullable — Customer e-mail
- `url`: string, nullable — Customer url
- `storeIds`: List<string>, nullable, max length 500 — Customer favorite stores
- `marketId`: string, nullable — Customer primary market
- `additionalMarketIds`: List<string>, nullable, max length 100 — Additional customer markets (beyond the primary MarketId)
- `marketGroupId`: string, nullable — Customer market group
- `preferredLanguage`: string, nullable — Preferred customer language code
- `preferredCurrency`: string, nullable — Customer preferred currency code (E.g. USD, NOK, EUR)
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 500 — Customer properties, (key values)
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external customer IDs
- `isGlobal`: boolean, nullable — If true, customer is available in all markets / stores
- `modifiedBy`: string, nullable — Name of the user or system the last modified the item
- `created`: string (date-time), nullable — Date and time the customer was created
- `modified`: string (date-time), nullable — Date and time the customer was modified
- `isInactive`: boolean, nullable — True if customer is inactive, and should not be able to make purchases
- `preferredShippingMethod`: string, nullable — Customer's preferred shipping method name (default selected in new carts)
- `paymentTerms`: string, nullable — Payment terms (free text)
- `paymentTermsNet`: integer (int32), nullable — Net payment terms (days)
- `customerGroups`: List<[`OmniumCustomerGroupReference`](OmniumCustomerGroupReference.md)>, nullable, max length 250 — Customer groups
- `consents`: List<[`OmniumConsent`](OmniumConsent.md)>, nullable, max length 500 — Customer consents
- `consentHistory`: List<[`OmniumConsentHistory`](OmniumConsentHistory.md)>, nullable, max length 1000 — Consent history
- `customerDetails`: string, nullable — Customer details (brief summary for customer service representatives)
- `customerRelations`: List<[`OmniumCustomerRelation`](OmniumCustomerRelation.md)>, nullable, max length 2000 — Related customers
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable, max length 250 — Read only: Errors recorded on the customer by Omnium (integration exports, validations etc). Ignored when posted.
- `assortmentIncludeCategoryIds`: List<string>, nullable, max length 250 — Product category IDs to include in customer's assortment. Only products in these categories will be available to the customer. When posted, if null, the property is not updated. If categories should be removed, send empty list.
- `assortmentExcludeCategoryIds`: List<string>, nullable, max length 250 — Product category IDs to exclude from customer's assortment. Products in these categories will not be available to the customer. When posted, if null, the property is not updated. If categories should be removed, send empty list.

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
- [Customers | B2C | Privacy](../endpoints/customers/b2c-privacy.md)
