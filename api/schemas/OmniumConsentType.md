# OmniumConsentType

Represents a consent type configuration for customer consent management

**Fields:**

- `type`: string, nullable — The consent type identifier
- `content`: string, nullable — The consent content/description text
- `isRequired`: boolean — Indicates whether this consent is required
- `isFeatured`: boolean — Indicates whether this consent should be featured/highlighted
- `marketIds`: List<string>, nullable — The markets this consent type applies to. An empty or missing list means the consent type applies to all markets.

**Used directly by endpoints in:**

- [Customers | B2B](../endpoints/customers/b2b.md)
- [Customers | B2C](../endpoints/customers/b2c.md)
