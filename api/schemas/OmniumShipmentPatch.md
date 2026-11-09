# OmniumShipmentPatch

Representing a shipment

**Fields:**

- `discounts`: List<[`OmniumDiscount`](OmniumDiscount.md)>, nullable, max length 1000 — Shipment discounts
- `shipmentId`: string, nullable — Unique identification for shipment
- `shippingMethodId`: string, nullable — ID of shipping method
- `shippingMethodName`: string, nullable — Name of shipping method
- `shippingLabel`: string, nullable — User friendly name - Populated from ShipmentOptions
- `shippingTax`: number (decimal), nullable — Shipment cost tax
- `shipmentTaxRate`: number (decimal), nullable — Shipment tax rate. If tax is 25%, value here should be 25.00. If not set, default tax rate from market will be used.
- `shipmentTrackingNumber`: string, nullable — Tracking number from external shipping provider
- `shipmentTrackingLink`: string, nullable — Tracking link for external shipping provider
- `shippingDiscountAmount`: number (decimal), nullable — Total discounts for shipping
- `shippingSubTotal`: number (decimal), nullable — Shipping cost, without discounts
- `shippingTotal`: number (decimal), nullable, read-only — Total shipping cost (Calculated, shippingSubTotal - shippingDiscountAmount)
- `shippingSubTotalExclTax`: number (decimal), nullable — Shipping cost without discounts excl tax
- `status`: string, nullable — Shipment status
- `orderStatus`: string, nullable — The shipment order status is used in workflows for partial shipments the same way as the order status is used for orders with single shipments. This means the values for the shipments OrderStatus could be the same values as the available order statuses.
- `prevStatus`: string, nullable — Previous status
- `subTotal`: number (decimal), nullable — Sum of all lineItems
- `total`: number (decimal), nullable — Sum of all lineItems and shipping cost
- `taxTotal`: number (decimal), nullable — LineItems tax total + shippingTax
- `warehouseCode`: string, nullable — Warehouse shipment is sent from
- `pickUpWarehouseCode`: string, nullable — Warehouse shipment is sent to (optional)
- `lineItems`: List<[`OmniumOrderLinePatch`](OmniumOrderLinePatch.md)>, nullable, max length 1000 — Shipment line items
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `address`: [`OmniumOrderAddress`](OmniumOrderAddress.md)
- `transit`: boolean, nullable — True if shipment is between two warehouses
- `comment`: string, nullable — Shipment comments
- `returnTrackingNumber`: string, nullable — Tracking number if return shipment is booked
- `returnTrackingLink`: string, nullable — Tracking link if return shipment is booked
- `returnLabelLink`: string, nullable — Link to return shipment label
- `servicePointId`: string, nullable — Id to third party shipment service/pickup point. If you only have id set this prop. If you have complete info about pickUp point, set PickUpPointInformation object
- `pickUpPointInformation`: [`OmniumShippingPickUpPoint`](OmniumShippingPickUpPoint.md)
- `expectedDeliveryDate`: string (date-time), nullable — Expected/Requested delivery date for this shipment
- `packages`: List<[`OmniumShipmentPackage`](OmniumShipmentPackage.md)>, nullable, max length 250 — Shipment packages, used by third party shipping providers
- `expectedShipmentDate`: string (date-time), nullable — Calculated - Expected shipment date (based on ATP)
- `shippingMethodProductId`: string, nullable — Shipping method product ID
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external shipment IDs
- `contactPerson`: [`OmniumContactPerson`](OmniumContactPerson.md)

**Used directly by endpoints in:**

- [Orders | Shipments](../endpoints/orders/shipments.md)
