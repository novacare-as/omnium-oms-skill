# OmniumUpdateShipmentInfo

Class for updating shipment method and tracking info

**Fields:**

- `shipmentMethodName`: string, nullable — Set this if shipmentMethodName is changed, or this is a new shipment
- `trackingUrl`: string, nullable — Tracking url from carrier
- `trackingNumber`: string, nullable — Tracking number from carrier
- `labelLink`: string, nullable — Link to shipping label
- `returnLabelLink`: string, nullable — link to return shipping label
- `returnTrackingLink`: string, nullable — Link to return tracking
- `returnTrackingNumber`: string, nullable — Return tracking number
- `shipmentId`: string, nullable — Shipment to update. If id does not exists in Omnium, new shipment is created(only for partially update) else first shipment is used
- `orderStatus`: string, nullable — If set, order status will be updated on shipment only, unless all shipments have same status
- `comment`: string, nullable — If set, comment will be replaced on shipment
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — Add or update external IDs to shipment
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Add or update external IDs to shipment
- `warehouseCode`: string, nullable — Warehouse shipment is sent from
- `shippingMethodProductId`: string, nullable — If set, shipping method product ID will be replaced on shipment
- `packages`: List<[`OmniumShipmentPackage`](OmniumShipmentPackage.md)>, nullable, max length 250 — Shipment packages, with dimensions and optional tracking information
- `servicePointId`: string, nullable — Id to third party shipment service/pickup point. If you only have id set this prop. If you have complete info about pickUp point, set PickUpPointInformation object
- `pickUpPointInformation`: [`OmniumShippingPickUpPoint`](OmniumShippingPickUpPoint.md)
- `clearScheduledOrderStatus`: boolean, nullable — If true, clears the scheduled order status update (UpdateStatusDate and NextOrderStatus) on the shipment.
