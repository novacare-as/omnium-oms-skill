# OmniumShipmentPackage

Used by shipping providers to calculate freight cost and space on trucks

**Fields:**

- `weightInKg`: number (double) — Gross package weight in Kg, including packaging
- `netWeightInKg`: number (double), nullable — Net weight of the goods in the package in Kg, excluding packaging. Used for customs declarations (NVIT)
- `packageType`: string, nullable — Package type / kollitype, e.g. "package", "pallet". Valid values can depend on the shipping provider and transport agreement
- `shippingMarks`: string, nullable — Shipping marks (kollimerking), identifies the physical package towards the carrier and customs
- `goodsDescription`: string, nullable — Package description, if provider needs this
- `dimensions`: [`OmniumShipmentDimensions`](OmniumShipmentDimensions.md)
- `shipmentTracking`: [`OmniumShipmentTracking`](OmniumShipmentTracking.md)
- `volume`: number (double), nullable — Package volume in Liters
- `id`: string, nullable — Package ID
- `lineItemReferences`: List<[`ShipmentPackageLineItemReference`](ShipmentPackageLineItemReference.md)>, nullable — This lets you bind packages to LineItems and quantity
- `barcode`: string, nullable — Package Barcode, for goods reception for example
