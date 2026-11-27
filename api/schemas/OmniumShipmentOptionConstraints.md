# OmniumShipmentOptionConstraints

Physical and service-area limits of a transport product. Every value is optional; an unset one
places no limit.

**Fields:**

- `maxWeightKg`: number (double), nullable — Maximum shipment weight in kilograms
- `maxLengthCm`: integer (int32), nullable — Maximum package length in centimetres
- `maxWidthCm`: integer (int32), nullable — Maximum package width in centimetres
- `maxHeightCm`: integer (int32), nullable — Maximum package height in centimetres
- `maxVolumeLiters`: number (double), nullable — Maximum package volume in litres
- `maxTotalDimensionsCm`: integer (int32), nullable — Length plus width plus height, which is how several carriers express their limit
- `allowedCountryCodes`: List<string>, nullable, max length 250 — Two letter country codes this option can deliver to. Empty means no restriction
- `postalCodeRanges`: List<[`OmniumZipCodeRange`](OmniumZipCodeRange.md)>, nullable, max length 250 — The service area. Empty means the option is not restricted by postal code
- `excludedPostalCodeRanges`: List<[`OmniumZipCodeRange`](OmniumZipCodeRange.md)>, nullable, max length 250 — Postal code ranges the option cannot deliver to
- `maxDistanceKmFromWarehouse`: number (double), nullable — For example a crane delivery that only runs within a radius of the sending warehouse
- `requiredWarehouseCapabilities`: List<string>, nullable, max length 250 — Capabilities the sending warehouse must have, for example temperature or ADR handling
- `allowedCustomerTypes`: List<string>, nullable, max length 250 — B2C, B2B, or both when empty
- `excludeFromCentralWarehouses`: boolean, nullable — Keeps the option off shipments sent from a central warehouse
