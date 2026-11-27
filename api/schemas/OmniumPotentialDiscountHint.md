# OmniumPotentialDiscountHint

A hint describing a promotion that does not currently apply to the cart but would if
additional conditions were met (more items, higher order amount, club member, coupon, etc.).

**Fields:**

- `type`: [`OmniumPotentialDiscountHintType`](OmniumPotentialDiscountHintType.md)
- `promotionId`: string, nullable — Id of the promotion this hint relates to.
- `promotionName`: string, nullable — Display name of the promotion.
- `rewardPercentage`: number (decimal), nullable — Reward percentage of the promotion, when the reward is percentage-based.
- `rewardUsePercentage`: boolean — True if the reward is a percentage discount; false if it is a fixed amount.
- `missingQuantity`: integer (int32), nullable — Number of additional units required for the promotion to apply.
- `missingAmount`: number (decimal), nullable — Additional amount required for the promotion to apply.
- `potentialSavings`: number (decimal), nullable — Estimated savings if the missing condition is met.
- `currency`: string, nullable — Currency for MissingAmount and PotentialSavings.
- `relatedLineItemId`: string, nullable — Id of the cart line item this hint is related to, if any.
- `relatedProductId`: string, nullable — Id of a product associated with the hint (e.g. the missing kit component).
- `relatedProductName`: string, nullable — Name of the related product, if any.
- `relatedImageUrl`: string, nullable — Image URL of the related product, if any.
- `requiredCouponCode`: string, nullable — Coupon code required for the promotion to apply, when Type is CouponRequired.

**Used directly by endpoints in:**

- [Promotions](../endpoints/promotions.md)
