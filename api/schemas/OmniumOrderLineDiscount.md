# OmniumOrderLineDiscount

Represents a discount applied specifically to an order line item.
This is used when retrieving orders to show which discounts were applied to each line item.
For line-item discounts from FixedPrice or MultiBuys promotions, the discount amounts are distributed across the involved order lines.

**Fields:**

- `discountAmountPrItem`: number (decimal) — The discount amount per single item/unit on this order line. Total line discount = DiscountAmountPrItem * Quantity Example: For a "3 for 2" promotion where each item is normally 100, this would be ~33.33 (the discount portion per item).
- `discountId`: string, nullable — Unique identifier for this discount. Used to track and reference specific discount instances.
- `discountAmount`: number (decimal) — The calculated discount amount in the order's currency. This is the actual monetary value that will be deducted from the order/line total. For percentage-based discounts, this is calculated from DiscountValue.
- `maxDiscountAmount`: number (decimal) — Maximum cap for the discount amount. Useful for percentage discounts where you want to limit the maximum deduction. Example: "20% off, maximum 100 NOK" - set DiscountValue=20, RewardType="Percentage", MaxDiscountAmount=100
- `discountCode`: string, nullable — Coupon or promotion code that triggered this discount. Used for tracking and for customers who enter promotional codes at checkout.
- `discountName`: string, nullable — Display name for the discount, shown to customers and in reports. Example: "Summer Sale 20%", "3 for 2 on selected items", "Free shipping"
- `discountReason`: [`OmniumDiscountReason`](OmniumDiscountReason.md)
- `discountValue`: number (decimal) — The discount value used together with RewardType to calculate the actual discount. - For RewardType "Money": The fixed amount to deduct (e.g., 50 = 50 NOK off) - For RewardType "Percentage": The percentage to deduct (e.g., 20 = 20% off) - For RewardType "Free": Typically 100 (100% off) - For RewardType "FixedPrice" and "MultiBuys": Use the corresponding reward objects instead
- `discountSource`: string, nullable — Indicates how the discount was created. Values: "Manual" (added by user/API), "Campaign" (from promotion engine), "Price" (carried by the product's price row, e.g. a sale price - scoped to the line it was priced for through LineItemIds, and maintained by Omnium as the line is repriced)
- `rewardType`: string, nullable — Defines how DiscountValue is interpreted and applied. Values: - "None" (0): No reward - "Money" (1): Fixed monetary discount (e.g., 50 NOK off) - "Percentage" (2): Percentage discount (e.g., 20% off) - "Free" (3): Item is free (100% off) - "FixedPrice" (4): Items for a fixed total price (e.g., "4 for 99"). Requires PromotionFixedPriceReward - "Gift" (5): Free gift item included - "MultiBuys" (6): Multi-buy offer (e.g., "3 for 2"). Requires PromotionMultiBuyReward - "Kit" (7): Set discount (buy one item from each of groups A, B, C and get discount on the set). Requires PromotionKitReward
- `priority`: integer (int32) — Priority determines the order in which discounts are applied when multiple discounts exist. Lower values are applied first (0 = highest priority, applied first). Important when combining discounts, as earlier discounts affect the base for later percentage calculations.
- `canBeCombinedWithOtherPromotions`: boolean — When true, this discount can be stacked with other promotions. When false, applying this discount may exclude other discounts depending on configuration.
- `alwaysApply`: boolean — When true, this discount is always applied regardless of CanBeCombinedWithOtherPromotions on other discounts. Use for discounts that should never be blocked by exclusivity rules.
- `isBonusPointsReward`: boolean — When true, the reward is given as customer club bonus points instead of a price reduction. Only applicable for customer club promotions.
- `promotionMultiBuyReward`: [`OmniumPromotionMultiBuyReward`](OmniumPromotionMultiBuyReward.md)
- `promotionFixedPriceReward`: [`OmniumPromotionFixedPriceReward`](OmniumPromotionFixedPriceReward.md)
- `promotionKitReward`: [`OmniumDiscountKitReward`](OmniumDiscountKitReward.md)
