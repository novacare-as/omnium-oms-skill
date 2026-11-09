# OmniumPickUpPoint

**Fields:**

- `servicePointId`: string, nullable
- `name`: string, nullable
- `routeDistance`: integer (int32)
- `routingCode`: string, nullable
- `visitingAddress`: [`OmniumVisitingaddress`](OmniumVisitingaddress.md)
- `deliveryAddress`: [`OmniumDeliveryaddress`](OmniumDeliveryaddress.md)
- `coordinate`: [`OmniumCoordinate`](OmniumCoordinate.md)
- `openingHours`: List<[`OmniumOpeninghour`](OmniumOpeninghour.md)>, nullable, max length 250
