# OmniumShippingPickUpPoint

Object describing a pickUpPoint for a shipment

**Fields:**

- `servicePointId`: string, nullable — Id for this shippingPoint. Id can come from a shippingProvider, and used for lookup.
- `name`: string, nullable — A describing name for the pickUp point
- `address`: [`OmniumPickUpPointAddress`](OmniumPickUpPointAddress.md)
- `openingHours`: List<[`OmniumPickUpPointOpeningHour`](OmniumPickUpPointOpeningHour.md)>, nullable, max length 250 — If Opening hours is available, this will containe a list of days and from - to.
