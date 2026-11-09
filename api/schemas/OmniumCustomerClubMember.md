# OmniumCustomerClubMember

Class for customer club member

**Fields:**

- `customerId`: string, nullable — Unique customerId
- `firstName`: string, nullable — First name
- `lastName`: string, nullable — Last name
- `customerName`: string, nullable — Full name of customer
- `email`: string, nullable — Customer e-mail
- `phone`: string, nullable — Customer phone number
- `birthDate`: string (date-time), nullable — Date of birth
- `memberSince`: string (date-time) — When the membership started
- `membersshipApproved`: string (date-time), nullable — When the membership was approved by customer(can be null if customer has not approved yet)
- `membershipEndDate`: string (date-time), nullable — When the membership ended
- `summary`: [`OmniumCustomerClubPointsSummary`](OmniumCustomerClubPointsSummary.md)
- `tier`: [`OmniumCustomerClubMemberTier`](OmniumCustomerClubMemberTier.md)
- `consents`: [`OmniumCustomerClubConsents`](OmniumCustomerClubConsents.md)
- `customerClubConsents`: List<[`OmniumConsent`](OmniumConsent.md)>, nullable, max length 500
- `consentHistory`: List<[`OmniumConsentHistory`](OmniumConsentHistory.md)>, nullable, max length 1000
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Property list
- `validPoints`: List<[`OmniumCustomerClubValidPoints`](OmniumCustomerClubValidPoints.md)>, nullable, max length 250 — List of valid points, with created and expire dates
- `interests`: List<string>, nullable, max length 250 — Customer selected Interests
- `salesPersonId`: string, nullable — Id of the person who recruited the member
- `storeId`: string, nullable — Id of signup store
- `marketId`: string, nullable — Customer market

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
- [Obsolete](../endpoints/obsolete.md)
