# OmniumAddress

Address class

**Fields:**

- `name`: string, nullable — Name of address (location / customer / business)
- `line1`: string, nullable — Address line 1 (E.g. street address)
- `line2`: string, nullable — Address line 2 (E.g. building number, floor, etc)
- `streetNumber`: string, nullable — Street / House number - if not included in Line 1. See Customer settings
- `apartmentNumber`: string, nullable — Apartment number
- `city`: string, nullable — City (E.g. New York, Oslo, Tokyo)
- `state`: string, nullable — State or county
- `countryCode`: string, nullable — Country code
- `countryName`: string, nullable — Country name
- `postalCode`: string, nullable — Postal / ZIP code
- `regionCode`: string, nullable — Region code (optional)
- `regionName`: string, nullable — Region name (optional)
- `purposes`: List<string>, nullable, max length 250 — Home/Billing/Invoice/++. This should not be set from a text field, but be selected from a set of configurable options.
- `externalId`: string, nullable — Optional property - used for mapping addresses to other external systems
- `email`: string, nullable — Optional property - Email address on billing address
- `phone`: string, nullable — Optional property - Phone number on billing address
- `locationName`: string, nullable — Name of location
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Address properties, (key values)
