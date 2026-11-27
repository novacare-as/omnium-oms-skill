# OmniumPromotionType

**Fields:**

- `promotionType`: string, nullable
- `calculateProductPricesCouponCodeNotApplied`: boolean
- `totalHits`: integer (int64)
- `lastPriceUpdate`: string (date-time), nullable
- `reward`: [`OmniumPromotionReward`](OmniumPromotionReward.md)
- `shippingMethods`: List<[`OmniumPromotionSelectedShipmentMethods`](OmniumPromotionSelectedShipmentMethods.md)>, nullable, max length 250
- `amountCondition`: List<[`OmniumPromotionAmount`](OmniumPromotionAmount.md)>, nullable, max length 250
- `categoryAndBrandFilter`: [`OmniumCategoryAndBrandFilter`](OmniumCategoryAndBrandFilter.md)
- `promotionMultiBuyReward`: [`OmniumPromotionMultiBuyReward`](OmniumPromotionMultiBuyReward.md)
- `discountedCategories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, max length 250
- `discountedProducts`: List<[`OmniumPromotionProduct`](OmniumPromotionProduct.md)>, nullable, max length 20000
- `productSearchRequest`: [`OmniumProductSearchRequest`](OmniumProductSearchRequest.md)
- `minQuantity`: integer (int32), nullable — Minimum total quantity of items required in the order (Only applies if PromotionType is OrderAmountPromotion).
- `conditionOperator`: [`OmniumConditionOperator`](OmniumConditionOperator.md)
- `includeProductsExcludedFromPromotions`: boolean, nullable — When true, products marked ExcludeFromPromotions still count towards the discount, so both the discount basis and the amount/quantity conditions cover the whole order (Only applies if PromotionType is OrderAmountPromotion). Order lines with a locked price or a selected unit are still left out. False and null both default to off.
- `promotionKitReward`: [`OmniumPromotionKitReward`](OmniumPromotionKitReward.md)
- `promotionKitBundles`: List<[`OmniumPromotionKitBundle`](OmniumPromotionKitBundle.md)>, nullable, max length 250 — Several complete kit definitions in one promotion, each with its own component groups and its own reward (Only applies if PromotionType is KitPromotion). Empty for a kit promotion that only ever had a single kit - see Omnium.Public.Promotions.Models.PromotionDataModels.OmniumPromotionType.PromotionKitReward for that shape.
- `priceListId`: string, nullable — The Id of the price list to use for this promotion (Applies to PriceListPromotion and CostPricePromotion). For CostPricePromotion, the price list provides cost prices used as the discount base.
- `markupPercentage`: number (decimal) — Percentage markup added to the cost price (Only applies if PromotionType is CostPricePromotion).
- `useStoreCostPrice`: boolean — When true, uses the StoreCostPrice from the price list item instead of the supplier cost price (Only applies if PromotionType is CostPricePromotion).
- `conditions`: [`OmniumProductConditionGroup`](OmniumProductConditionGroup.md)
- `basePriceListIds`: List<string>, nullable, max length 50 — The price lists the discount is calculated from (RuleBasedPromotion).
- `onlyProductsAllowedOnPromotion`: boolean, nullable — Whether products blocked from discounts are left out (RuleBasedPromotion).
