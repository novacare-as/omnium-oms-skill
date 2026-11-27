# OmniumOrderAddress

Order address

**Fields:**

- `name`: string, nullable — Address name (Organization address name for B2B / FirstName + LastName for B2C)
- `firstName`: string, nullable — Recipient first name
- `lastName`: string, nullable — Recipient last name
- `organization`: string, nullable — Organization name
- `organizationalNumber`: string, nullable — Organization number (e.g. VAT number, company registration number)
- `line1`: string, nullable — Address line 1
- `line2`: string, nullable — Address line 2
- `streetNumber`: string, nullable — Street / House number - if not included in Line 1. See Customer settings
- `apartmentNumber`: string, nullable — Apartment number e.g. "0402"
- `city`: string, nullable — City name
- `state`: string, nullable — State e.g. "Arizona", "California" etc.
- `countryCode`: string, nullable — Country code for shipment e.g. "SE", "DK"
- `countryName`: string, nullable — Country name, e.g. "USA", "Norway" ...
- `postalCode`: string, nullable — Postal / ZIP code
- `regionCode`: string, nullable — Region code for shipping
- `regionName`: string, nullable — Region name e.g. "Buskerud"
- `daytimePhoneNumber`: string, nullable — Contact phone number
- `eveningPhoneNumber`: string, nullable — Contact phone number at evening
- `phone`: string, nullable — Contact phone number
- `email`: string, nullable — Contact email
- `externalId`: string, nullable — If address has id from other external system
