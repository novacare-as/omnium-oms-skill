# OmniumOrderFormPatch

Order form, containing shipments, payments and line items for order

**Fields:**

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
