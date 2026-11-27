# OmniumPromotionFixedPriceReward

Configuration for fixed price promotions (e.g., "4 items for 99.90").
Used when the discount's RewardType is "FixedPrice".
The promotion calculator will prioritize items from highest to lowest price.
Example: FixedPriceQuantity=4, FixedPricePrice=99.90 means "Buy any 4 items from the promotion for 99.90 total"

**Fields:**

- `fixedPriceQuantity`: integer (int32) — The number of items required to qualify for the fixed price. Example: For "4 items for 99", set this to 4.
- `fixedPricePrice`: number (decimal) — The total price for the bundle of items. Example: For "4 items for 99", set this to 99. The discount is calculated as: (sum of original prices) - FixedPricePrice
