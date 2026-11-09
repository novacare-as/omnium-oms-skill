# OmniumCustomerClubMemberPatchRequest

Used to update a customerClub member, with consents and interests

**Fields:**

- `consents`: [`OmniumCustomerClubConsents`](OmniumCustomerClubConsents.md)
- `customerClubConsents`: List<[`OmniumConsent`](OmniumConsent.md)>, nullable — List of consents. This will override existing consents
- `interests`: List<string>, nullable, max length 500 — Interests. This will override existing interests
- `storeId`: string, nullable — Signup store id, could we webShop, or a physical store

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
