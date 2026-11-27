# OmniumConsent

Used for storing GDPR constens. All customers can have multiple consents of any kind.

**Fields:**

- `date`: string (date-time), nullable — Date of consent
- `type`: string, nullable — Consent type. Could have any value.
- `content`: string, nullable — Content / text describing consent given-
- `description`: string, nullable — Consent description
- `source`: string, nullable — Consent source. E.g. Web, PoS, customer service call, etc.
- `status`: boolean — True if active
- `marketIds`: List<string>, nullable — MarketIds for access control of consents

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
