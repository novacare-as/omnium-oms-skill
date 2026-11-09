# OmniumPromotionMultiBuyReward

Configuration for multi-buy promotions (e.g., "Buy 2, get 1 free" / "3 for 2").
Used when the discount's RewardType is "MultiBuys".
By default, the calculator prioritizes items from lowest to highest price (cheapest item is discounted).
This can be changed with the SortMultibuyItemsDescending setting.
Example "3 for 2": RequiredBuyAmount=2, NumberOfDiscountedItems=1, Percentage=100

**Fields:**

- `requiredBuyAmount`: integer (int32) — Number of items the customer must buy at full price to qualify for the discount. Example "3 for 2": Set to 2 (buy 2, get 1 free means you pay for 2) Example "Buy 3, get 1 free": Set to 3
- `numberOfDiscountedItems`: integer (int32) — Number of additional items that receive the discount when RequiredBuyAmount is met. Example "3 for 2": Set to 1 (1 item is free) Example "Buy 3, get 2 at 50% off": Set to 2
- `percentage`: number (decimal) — The percentage discount applied to the discounted items (0-100). Set to 100 for "free" items. Set to 50 for "50% off" on the discounted items. Example "3 for 2": Set to 100 (the discounted item is free)
- `promotionAmounts`: List<[`OmniumPromotionAmount`](OmniumPromotionAmount.md)>, nullable, max length 250 — Amounts for the promotion. Used for giving a fixed amount or fixed price discount.
- `usePercentage`: boolean — Use percentage for the promotion. Set to true if the promotion should give a percentage discount. False if it should give a fixed amount discount.
- `isFixedPrice`: boolean, nullable — Set to true for fixed price promotions (e.g., "3 for $99"). When true, use PromotionAmounts to specify the fixed price.
- `promotionAdvancedReward`: [`OmniumPromotionAdvancedReward`](OmniumPromotionAdvancedReward.md)
- `useTieredPricing`: boolean — Enable quantity-based tiered pricing. When true, use QuantityTiers instead of single-tier settings. Example: "2 for 499 NOK, 3 for 649 NOK, 4 for 799 NOK"
- `quantityTiers`: List<[`OmniumPromotionQuantityTier`](OmniumPromotionQuantityTier.md)>, nullable, max length 50 — List of quantity-based tiers. Each tier defines a quantity threshold and its associated pricing. Tiers must have unique quantities per market and should be sorted ascending by quantity. Only used when UseTieredPricing is true.
- `useConditionalPricing`: boolean — Enable conditional pricing behavior where promotional prices are only shown when condition is met
- `conditionalPricing`: [`OmniumConditionalPricingSettings`](OmniumConditionalPricingSettings.md)
