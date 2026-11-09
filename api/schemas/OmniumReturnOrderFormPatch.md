# OmniumReturnOrderFormPatch

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
- `modified`: string (date-time), nullable — Date modified
- `created`: string (date-time), nullable — Date created
- `creditAmount`: number (decimal), nullable — Amount to credit
- `creditPayment`: boolean, nullable — True if payment should be credited
- `replacementOrderIds`: List<string>, nullable, max length 250 — References to any replacement orders related to the return
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — List of external return order IDs
- `sentNotificationIds`: List<string>, nullable, max length 250 — Notification IDs sent on this order
- `errors`: List<[`OmniumEntityError`](OmniumEntityError.md)>, nullable, max length 250 — List of errors on the return.
- `tags`: List<string>, nullable, max length 250 — Return tags (used by workflow filters and for grouping / filtering returns)
- `shouldAddMissingLineItems`: boolean — If it should add missing items when patching returnOrderLines
- `replaceLineItemsArray`: boolean — Use this if you want to entirely replace the returnItemsArray and not patch existing lines. This will give you more control, but comes at the cost of possibly losing orderlinedata you dont provide. Can not be used with ShouldAddMissingLineItems
- `shipments`: List<[`OmniumShipmentPatch`](OmniumShipmentPatch.md)>, nullable, max length 250 — All order shipments
- `lineItems`: List<[`OmniumOrderLinePatch`](OmniumOrderLinePatch.md)>, nullable, max length 1000 — All order lines / products
- `discounts`: List<[`OmniumDiscount`](OmniumDiscount.md)>, nullable, max length 1000 — All discounts
- `discountsMergeMode`: [`OmniumPatchMergeMode`](OmniumPatchMergeMode.md)
- `payments`: List<[`OmniumPaymentPatch`](OmniumPaymentPatch.md)>, nullable, max length 250 — All order payments
- `paymentsMergeMode`: [`OmniumPatchMergeMode`](OmniumPatchMergeMode.md)
- `shipmentsMergeMode`: [`OmniumPatchMergeMode`](OmniumPatchMergeMode.md)
- `shippingDiscountTotal`: number (decimal), nullable — Total shipping discounts
- `shippingSubTotal`: number (decimal), nullable — Shipping cost without discounts
- `shippingSubTotalExclTax`: number (decimal), nullable — shipping cost without discounts excl tax
- `cartName`: string, nullable — Name of cart / offer
- `cartId`: string, nullable — ID of original cart
- `couponCodes`: List<string>, nullable, max length 250 — List of CouponCodes added by user
- `couponCodesMergeMode`: [`OmniumPatchMergeMode`](OmniumPatchMergeMode.md)
- `shippingTotal`: number (decimal), nullable, read-only — Total shipping cost
- `handlingTotal`: number (decimal), nullable — Cost of handling
- `orderLevelTax`: number (decimal), nullable — Order level tax amount
- `taxTotal`: number (decimal), nullable — Total tax amount (line item level and order level)
- `discountAmount`: number (decimal), nullable — Total discount amount
- `subTotal`: number (decimal), nullable — Ordrer total without shipment cost
- `subTotalExclTax`: number (decimal), nullable — Ordrer total without shipment cost and without tax
- `total`: number (decimal), nullable — Order total, including shipment cost, tax, and discounts
- `totalExclTax`: number (decimal), nullable — Order total, including shipment cost and discounts, but without tax
- `authorizedPaymentTotal`: number (decimal), nullable — Total amount authorized by payment providers
- `capturedPaymentTotal`: number (decimal), nullable — Total amount captured by payment providers
- `creditPaymentTotal`: number (decimal), nullable — Total amount credited by payment providers
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties
- `charges`: List<[`OmniumCharge`](OmniumCharge.md)>, nullable, max length 250 — A list of additional charges for the order
- `fullRefund`: boolean, nullable — True if order should be fully refunded
- `isPriority`: boolean, nullable — Possible to mark the order with priority
- `chargeShipmentCostAmount`: number (decimal), nullable — Patch amount for shipment cost charged the customer
- `creditShipmentAmount`: number (decimal), nullable — Patch amount for shipment cost to credit customer
- `grossRoundoff`: number (decimal), nullable — Cash-rounding adjustment, added to orderform.total. Set by external systems (POS, in-store app) when a cash tender is rounded to the nearest currency unit.

**Used directly by endpoints in:**

- [Orders | Returns](../endpoints/orders/returns.md)
