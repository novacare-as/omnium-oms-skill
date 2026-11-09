# OmniumDiscountCoupon

Discount Coupon

**Fields:**

- `id`: string, nullable — Unique identifier of this coupon
- `promotionId`: string, nullable — PromotionId
- `couponCode`: string, nullable — Coupon Code - Apply to cart to apply the discount
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — External Ids
- `validFrom`: string (date-time), nullable — Coupon valid from
- `validTo`: string (date-time), nullable — Coupon expiration date
