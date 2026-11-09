# OmniumPromotionTypePatch

Promotion type data

**Fields:**

- `promotionType`: [`PromotionType`](PromotionType.md)
- `reward`: [`OmniumPromotionRewardPatch`](OmniumPromotionRewardPatch.md)
- `shippingMethods`: List<[`OmniumPromotionSelectedShipmentMethods`](OmniumPromotionSelectedShipmentMethods.md)>, nullable, max length 250 — Defines the shipping methods that the promotion is valid for (Only applies if PromotionType is ShippingPromotion).
- `amountCondition`: List<[`OmniumPromotionAmount`](OmniumPromotionAmount.md)>, nullable, max length 250 — Amount conditions for the promotion (Only applies if PromotionType is ShippingPromotion).
- `categoryAndBrandFilter`: [`OmniumCategoryAndBrandFilter`](OmniumCategoryAndBrandFilter.md)
- `promotionMultiBuyReward`: [`OmniumPromotionMultiBuyRewardPatch`](OmniumPromotionMultiBuyRewardPatch.md)
- `discountedCategories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, max length 250 — Discounted categories for Mix and match promotions. E.g buy one item of category A, get one item of category B free. (Only applies if PromotionType is MultiBuyPromotion).
- `discountedProducts`: List<[`OmniumPromotionProduct`](OmniumPromotionProduct.md)>, nullable, max length 20000 — Discounted products for Mix and match promotions. E.g buy one item of product or category A, get one item of product B free. (Only applies if PromotionType is MultiBuyPromotion).
- `productSearchRequest`: [`OmniumProductSearchRequest`](OmniumProductSearchRequest.md)
- `minQuantity`: integer (int32), nullable — Minimum total quantity of items required in the order (Only applies if PromotionType is OrderAmountPromotion).
- `conditionOperator`: [`OmniumConditionOperator`](OmniumConditionOperator.md)
- `includeProductsExcludedFromPromotions`: boolean, nullable — When true, products marked ExcludeFromPromotions still count towards the discount, so both the discount basis and the amount/quantity conditions cover the whole order (Only applies if PromotionType is OrderAmountPromotion). Order lines with a locked price or a selected unit are still left out.
- `promotionKitReward`: [`OmniumPromotionKitRewardPatch`](OmniumPromotionKitRewardPatch.md)
- `priceListId`: string, nullable — The Id of the price list to use for this promotion (Applies to PriceListPromotion and CostPricePromotion). For CostPricePromotion, the price list provides cost prices used as the discount base.
- `markupPercentage`: number (decimal), nullable — Percentage markup added to the cost price (Only applies if PromotionType is CostPricePromotion).
- `useStoreCostPrice`: boolean, nullable — When true, uses the StoreCostPrice from the price list item instead of the supplier cost price (Only applies if PromotionType is CostPricePromotion).
- `conditions`: [`OmniumProductConditionGroup`](OmniumProductConditionGroup.md)
- `basePriceListIds`: List<string>, nullable, max length 50 — The price lists the discount is calculated from (Only applies if PromotionType is RuleBasedPromotion). They decide the price, never the products: a product without a valid price in any of them gets no discount. When two lists price the same customers, the lower price is used. An empty list uses the product's ordinary price; leave out to keep the current lists.
- `onlyProductsAllowedOnPromotion`: boolean, nullable — Leaves out products that are blocked from discounts: marked as discount blocked, or with a fixed price period that has not ended (Only applies if PromotionType is RuleBasedPromotion). Leave out to keep the current value.
