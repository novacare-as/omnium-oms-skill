# OmniumBusinessCustomer

Business customer (Company)

**Fields:**

- `name`: string, nullable — Name of company
- `taxId`: string, nullable — Tax ID, or other governmental identification number
- `contacts`: List<[`OmniumContactPerson`](OmniumContactPerson.md)>, nullable, max length 1000 — Contact persons in company
- `creditBalance`: number (decimal), nullable, **deprecated** — (Obsolete) Customer's credit balance. Use BusinessCustomerCredit instead.
- `creditLimit`: number (decimal), nullable, **deprecated** — (Obsolete) Customer's credit limit. Use BusinessCustomerCredit instead.
- `creditRemaining`: number (decimal), nullable, **deprecated** — (Obsolete) Customer's remaining credits. Use BusinessCustomerCredit instead.
- `isCreditDenied`: boolean, nullable, **deprecated** — (Obsolete) Customer's credit is denied if true. Use BusinessCustomerCredit instead.
- `discountGroups`: List<string>, nullable, max length 250 — List of customers discount groups
- `priceGroups`: List<string>, nullable, max length 250 — List of customers price groups
- `logo`: [`OmniumAsset`](OmniumAsset.md)
- `assets`: List<[`OmniumAsset`](OmniumAsset.md)>, nullable, max length 250 — Omnium assets for business customer
- `isAssortmentRestricted`: boolean, nullable — Set to 'true' if the business customer has a restricted assortment. This is controlled by prices. If the customer has a customer specific price for a product, the product is automatically included in the customer's assortment. If this is set to 'false', a non-customer specific price will be sufficient for the product to be part of the customer's assortment.
- `isCustomerReferenceRequired`: boolean, nullable — Set to 'true' if orders for the business customer must have a customer reference (requisition number). The in-store app then requires the customer reference before checkout.
- `punchOutUnitConversionList`: string, nullable — When using puch-out orders, unit conversion lists can be defined in settings. This reflects the corresponding Unit Conversion List for the customer.
- `punchOutPropertyOverrides`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — When using puch-out orders, this list will provide information about property mapping
- `punchOutDomain`: string, nullable — When using punch-out domain
- `assortmentCodes`: List<[`OmniumAssortmentCode`](OmniumAssortmentCode.md)>, nullable, max length 250 — Assortment codes for the business customer - should match assortment products set on products. Product searches will by default use the customer's assortment codes to filter on products.
- `notificationEmailAddresses`: List<string>, nullable, max length 250 — Emails for notifications (comma separated)
- `notificationPhoneNumbers`: List<string>, nullable, max length 250 — Phone numbers for notifications (comma separated)
- `tags`: List<string>, nullable, max length 250 — Tags for business customer
- `businessCustomerCredit`: List<[`OmniumBusinessCustomerCredit`](OmniumBusinessCustomerCredit.md)>, nullable, max length 250 — Credit information for customer on different markets
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

- [Customers | B2B](../endpoints/customers/b2b.md)
- [Customers | B2B | Assets](../endpoints/customers/b2b-assets.md)
- [Customers | B2C | Privacy](../endpoints/customers/b2c-privacy.md)
