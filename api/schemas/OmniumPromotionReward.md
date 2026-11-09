# OmniumPromotionReward

Reward for a promotion

**Fields:**

- `percentageSteps`: List<[`OmniumPromotionPercentageStep`](OmniumPromotionPercentageStep.md)>, nullable, max length 250 — Percentage steps for the promotion. Used for giving increasing discounts based on the amount spent.
- `amountSteps`: List<[`OmniumPromotionAmountStep`](OmniumPromotionAmountStep.md)>, nullable, max length 250 — Amount steps for the promotion. Used for giving increasing fixed amount discounts based on the amount spent.
- `promotionAmounts`: List<[`OmniumPromotionAmount`](OmniumPromotionAmount.md)>, nullable, max length 250 — Amounts for the promotion. Used for giving a fixed amount discount.
- `percentage`: number (decimal) — Percentage for the promotion. Used for giving a percentage discount.
- `usePercentage`: boolean — Use percentage for the promotion. Set to true if the promotion should give a percentage discount. False if it should give a fixed amount discount.
