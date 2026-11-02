# OmniumShipment

Representing a shipment

**Fields:**

- `discounts`: List<[`OmniumDiscount`](OmniumDiscount.md)>, nullable, max length 1000 — Shipment discounts
- `shipmentId`: string, nullable — Unique identification for shipment. Required for all shipments.
- `shippingMethodId`: string, nullable — ID of shipping method
- `shippingMethodName`: string, nullable — Name of shipping method for this shipment. Should correspond to a shipment type in Omnium. Typical values would be "Bring", "PickUpInStore" or whatever provider or type of shipment that is configured.
- `shippingLabel`: string, nullable — User friendly name - Automatically populated from ShipmentOptions defined in Omnium as part of the order workflow.
- `shippingTax`: number (decimal) — Shipment cost tax
- `shipmentTaxRate`: number (decimal), nullable — Shipment tax rate. If tax is 25%, value here should be 25.00. If not set, default tax rate from market will be used.
- `shipmentTrackingNumber`: string, nullable — Tracking number from external shipping provider
- `shipmentTrackingLink`: string, nullable — Tracking link for external shipping provider
- `shipmentLabelLink`: string, nullable — Shipping label link
- `shippingDiscountAmount`: number (decimal) — Calculated - Total discounts for shipping. Calculated from the discount list
- `shippingSubTotal`: number (decimal) — Shipping cost, without discounts
- `shippingTotal`: number (decimal), read-only — Calculated - Total shipping cost (Calculated, shippingSubTotal - shippingDiscountAmount)
- `shippingSubTotalExclTax`: number (decimal) — Calculated - Shipping cost without discounts excl tax
- `shippingCreditedTotal`: number (decimal) — Total shipping cost credited
- `fiscalSaleId`: string, nullable — The POS fiscal sale this shipment is paid in (one payment event at the till, one receipt), when the order was paid in parts. Null while the shipment is unpaid.
- `receiptedAt`: string (date-time), nullable — When the receipt for this shipment was issued. Null while unpaid.
- `status`: string, nullable — Shipment status
- `orderStatus`: string, nullable — The shipment order status is used in workflows for partial shipments the same way as the order status is used for orders with single shipments. This means the values for the shipments OrderStatus should be the same values as the available order statuses.
- `orderType`: string, nullable — Shipment-level order type, used when shipments on a split order follow different workflows. Empty means the shipment follows the order's own order type.
- `allocationPlanId`: string, nullable — The allocation plan this shipment belongs to. Set by Omnium's allocation engine, and writable by a channel that simulated the allocation itself and wants the decision traceable.
- `allocationProfileKey`: string, nullable — The allocation profile the plan was chosen under, for example FewestShipments. Set by Omnium's allocation engine.
- `prevStatus`: string, nullable — Previous status. Automatically set by Omnium's workflow
- `subTotal`: number (decimal) — Calculated - Sum of all lineItems
- `total`: number (decimal) — Calculated - Sum of all lineItems and shipping cost
- `taxTotal`: number (decimal) — LineItems tax total + shippingTax
- `warehouseCode`: string, nullable — Warehouse shipment is sent from. Should correspond to a store ID in Omnium.
- `virtualWarehouseCode`: string, nullable — Only relevant when using Virtual Stock Locations - Specifies which of the virtual Warehouses the inventory should be reduced.
- `pickUpWarehouseCode`: string, nullable — Warehouse shipment is sent to (optional) for pickup. Should correspond to a store ID in Omnium.
- `lineItems`: List<[`OmniumOrderLine`](OmniumOrderLine.md)>, nullable, max length 1000 — Shipment line items / order lines
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `address`: [`OmniumOrderAddress`](OmniumOrderAddress.md)
- `transit`: boolean — True if shipment is between two warehouses
- `comment`: string, nullable — Shipment comments
- `returnTrackingNumber`: string, nullable — Tracking number if return shipment is booked
- `returnTrackingLink`: string, nullable — Tracking link if return shipment is booked
- `returnLabelLink`: string, nullable — Link to return shipment label
- `servicePointId`: string, nullable — Id to third party shipment service/pickup point. If you only have id set this prop. If you have complete info about pickUp point, set PickUpPointInformation object
- `pickUpPointInformation`: [`OmniumShippingPickUpPoint`](OmniumShippingPickUpPoint.md)
- `expectedDeliveryDate`: string (date-time), nullable — Expected/Requested delivery date for this shipment
- `packages`: List<[`OmniumShipmentPackage`](OmniumShipmentPackage.md)>, nullable, max length 250 — Shipment packages, used by third party shipping providers
- `expectedShipmentDate`: string (date-time), nullable — Calculated - Expected shipment date (based on ATP)
- `shippingMethodProductId`: string, nullable — Shipping method product ID. Used for external shipping providers that has shipping method product IDs defined.
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external shipment IDs
- `contactPerson`: [`OmniumContactPerson`](OmniumContactPerson.md)
- `isAllocated`: boolean — Determines if shipment is allocated, set to true if shipment should not be reallocated.
- `goodsDescription`: string, nullable — Describe shipment content
- `orderStatusLog`: List<[`OmniumOrderStatusLogItem`](OmniumOrderStatusLogItem.md)>, nullable — Timeline of all status changes for this shipment, including timestamps  and duration between statuses.
- `completed`: string (date-time), nullable — Completed date
- `updateStatusDate`: string (date-time), nullable — Date when shipment should be moved to next order status. (Processed by UpdateOrderStatusScheduledTask)
- `nextOrderStatus`: string, nullable — Shipment order status to transition to at UpdateStatusDate. (Processed by UpdateOrderStatusScheduledTask)

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
- [Orders | Shipments](../endpoints/orders/shipments.md)
