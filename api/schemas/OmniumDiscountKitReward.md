# OmniumDiscountKitReward

Configuration for kit promotions on a discount (e.g., "Buy tights and a half zip together for 599").
Used when the discount's RewardType is "Kit".
The kit is priced when every required component group is present on the order lines in SkuIds.
Example "tights + half zip for 599 SEK": RewardType="FixedPrice", PromotionAmounts=[{ amount: 599, currency: "SEK" }],
and one required component group per product.

**Fields:**

- `rewardType`: [`KitPromotionRewardType`](KitPromotionRewardType.md)
- `percentage`: number (decimal), nullable — The percentage discount applied to the discounted components (0-100). Used when RewardType is "Percentage".
- `usePercentage`: boolean — Set to true if the kit gives a percentage discount. False if it gives a fixed amount or fixed price.
- `promotionAmounts`: List<[`OmniumPromotionAmount`](OmniumPromotionAmount.md)>, nullable, max length 250 — Amount per currency. Used when RewardType is "Amount" (the amount off the kit) or "FixedPrice" (the price of the kit). The amount in the order's billing currency is used.
- `promotionKitComponentGroups`: List<[`OmniumDiscountKitComponentGroup`](OmniumDiscountKitComponentGroup.md)>, nullable, max length 50 — Component groups that make up the kit.
