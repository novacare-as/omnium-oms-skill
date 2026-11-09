# OmniumPromotionMultiBuyRewardPatch

Reward model for multi-buy promotions (i.e., "2 for the price of 1"). Only used if reward type is "MultiBuys".

**Fields:**

- `requiredBuyAmount`: integer (int32), nullable — Required amount of items to buy to get a discount on additional items
- `numberOfDiscountedItems`: integer (int32), nullable — Number of discounted items if required buy amount is fulfilled
- `percentage`: number (decimal), nullable — Percentage discount (0-100) when UsePercentage is true. Not used when IsFixedPrice is true (use PromotionAmounts instead).
- `promotionAmounts`: List<[`OmniumPromotionAmount`](OmniumPromotionAmount.md)>, nullable, max length 250 — Amounts for the promotion. Used for giving a fixed amount discount.
- `usePercentage`: boolean, nullable — Use percentage for the promotion. Set to true if the promotion should give a percentage discount. False if it should give a fixed amount discount.
- `isFixedPrice`: boolean, nullable — Set to true for fixed price promotions (e.g., "3 for $99"). When true, use PromotionAmounts to specify the fixed price.
- `promotionAdvancedReward`: [`OmniumPromotionAdvancedReward`](OmniumPromotionAdvancedReward.md)
