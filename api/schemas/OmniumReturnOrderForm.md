# OmniumReturnOrderForm

Return order form

**Fields:**

- `returnId`: string, nullable — Return ID
- `rmaNumber`: string, nullable — RMA (return merchandise authorization) number
- `returnComment`: string, nullable — Return comment, used to describe reason for return
- `returnType`: string, nullable — Return type
- `storeId`: string, nullable — Store ID or warehouse where the product is returned
- `userId`: string, nullable — User ID creating the return
- `status`: string, nullable — Return status
- `claim`: [`OmniumClaim`](OmniumClaim.md)
- `modified`: string (date-time) — Date modified
- `created`: string (date-time) — Date created
- `completed`: string (date-time), nullable — Date the return was completed. Set by the SetCompletedDate return workflow step.
- `creditAmount`: number (decimal) — Amount to credit
- `creditPayment`: boolean — True if payment should be credited
- `replacementOrderIds`: List<string>, nullable, max length 250 — References to any replacement orders related to the return
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external return order IDs
- `sentNotificationIds`: List<string>, nullable, max length 250 — Notification IDs sent on this order
- `returnCharges`: List<[`OmniumReturnCharge`](OmniumReturnCharge.md)>, nullable, max length 250 — List of charges on the return (Currently only internal use for ChargeNotPickedUpAmount / ChargeShipmentCostAmount)
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable, max length 250 — List of errors on the return.
- `tags`: List<string>, nullable, max length 250 — Return tags (used by workflow filters and for grouping / filtering returns)
- `shipments`: List<[`OmniumShipment`](OmniumShipment.md)>, nullable, max length 250 — All order shipments
- `lineItems`: List<[`OmniumOrderLine`](OmniumOrderLine.md)>, nullable, max length 1000 — All order lines / products
- `discounts`: List<[`OmniumDiscount`](OmniumDiscount.md)>, nullable, max length 1000 — All discounts
- `payments`: List<[`OmniumPayment`](OmniumPayment.md)>, nullable, max length 250 — All order payments
- `shippingDiscountTotal`: number (decimal) — Calculated:Total shipping discounts
- `shippingSubTotal`: number (decimal) — Calculated: Shipping cost without discounts
- `shippingSubTotalExclTax`: number (decimal) — Calculated: shipping cost without discounts excl tax
- `shippingCreditedTotal`: number (decimal) — Calculated: Total shipping cost credited
- `cartName`: string, nullable — Name of cart / offer, such as "A special offer for a special customer". This is typically used in scenarios where a customer is presented with an offer (in form of a cart).
- `cartId`: string, nullable — Unique ID of cart
- `purchaseOrderId`: string, nullable — Purchase order ID (if order was created from a purchase order)
- `couponCodes`: List<string>, nullable, max length 250 — List of CouponCodes added by user
- `shippingTotal`: number (decimal), read-only — Calculated: Total shipping cost.
- `handlingTotal`: number (decimal) — Cost of handling
- `orderLevelTax`: number (decimal) — Order level tax amount
- `taxTotal`: number (decimal) — Calculated: Total tax amount (line item level and order level)
- `discountAmount`: number (decimal) — Calculated: Total discount amount
- `subTotal`: number (decimal) — Calculated: Order total without shipment cost
- `subTotalExclTax`: number (decimal) — Calculated: Order total without shipment cost and without tax
- `total`: number (decimal) — Calculated: Order total, including shipment cost, tax, and discounts
- `totalExclTax`: number (decimal) — Calculated: Order total, including shipment cost and discounts, but without tax
- `authorizedPaymentTotal`: number (decimal) — Total amount authorized by payment providers
- `capturedPaymentTotal`: number (decimal) — Total amount captured by payment providers
- `creditPaymentTotal`: number (decimal) — Total amount credited by payment providers
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `charges`: List<[`OmniumCharge`](OmniumCharge.md)>, nullable, **deprecated**, max length 250 — Obsolete: Add order lines instead. A list of additional charges for the order
- `fullRefund`: boolean — True if order should be fully refunded
- `isPriority`: boolean, nullable — Possible to mark the order with priority
- `grossRoundoff`: number (decimal), nullable — Set by external systems. Is added to orderform.total.

**Used directly by endpoints in:**

- [Orders | Returns](../endpoints/orders/returns.md)
