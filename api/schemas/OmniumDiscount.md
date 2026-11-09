# OmniumDiscount

Represents a discount that can be applied to an order, line items, or shipping.
Add discounts to orderForm.discounts for order-level or line-item discounts,
or to shipment.discounts for shipping discounts.

**Fields:**

- `discountType`: string, nullable — Specifies at what level the discount is applied. Values: - "None" (0): No specific type - "LineItem" (1): Discount applied to specific order lines. Use SkuIds to specify which products - "Order" (2): Discount applied to the entire order total - "Shipping" (3): Discount applied to shipping cost. Should be added to shipment.discounts - "Manual" (4): Manually applied discount (typically from UI) - "BonusPoints" (5): Discount paid with customer club bonus points
- `skuIds`: List<string>, nullable, max length 250 — List of SKU codes (product variant codes) that this discount applies to. Required for LineItem discounts and for FixedPrice/MultiBuys promotions to identify which products are part of the offer. Example: ["SKU-001", "SKU-002"] for a "Buy any 2 of these for 199" promotion.
- `lineItemIds`: List<string>, nullable, max length 250 — Restricts the discount to specific order lines, on top of SkuIds. Leave it out - the usual case - and the discount applies to every line carrying one of the SkuIds. Set it when the same sku sits on more than one line and only some of them are discounted, or when two lines of the same sku are discounted by different amounts. This is how a discount coming from the product's price ("Price" DiscountSource) is recorded, since the price is resolved per line. A line split off one of these lines by a partial delivery is covered as well. A manual line discount (DiscountType "LineItem", DiscountSource "Manual") that names lines is an operator's discount for those lines and their whole line discount: it is applied on every unit still on the line, replaces the discount the line's price row carries, and no promotion or other line discount is added to it. Bonus points and order discounts still apply to the line. Leave LineItemIds out for a manual discount that should come on top of the price. Example: ["1", "3"]
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

**Used directly by endpoints in:**

- [Carts | Checkout](../endpoints/carts/checkout.md)
