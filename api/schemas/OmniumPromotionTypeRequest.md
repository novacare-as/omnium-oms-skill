# OmniumPromotionTypeRequest

Promotion type data

**Fields:**

- `promotionType`: [`PromotionType`](PromotionType.md)
- `reward`: [`OmniumPromotionReward`](OmniumPromotionReward.md)
- `shippingMethods`: List<[`OmniumPromotionSelectedShipmentMethods`](OmniumPromotionSelectedShipmentMethods.md)>, nullable, max length 250 — Defines the shipping methods that the promotion is valid for (Only applies if PromotionType is ShippingPromotion).
- `amountCondition`: List<[`OmniumPromotionAmount`](OmniumPromotionAmount.md)>, nullable, max length 250 — Amount conditions for the promotion (Applies to ShippingPromotion and OrderAmountPromotion). For ShippingPromotion: minimum order amount for free/discounted shipping. For OrderAmountPromotion: minimum order amount for the promotion to apply.
- `categoryAndBrandFilter`: [`OmniumCategoryAndBrandFilter`](OmniumCategoryAndBrandFilter.md)
- `promotionMultiBuyReward`: [`OmniumPromotionMultiBuyReward`](OmniumPromotionMultiBuyReward.md)
- `discountedCategories`: List<[`OmniumProductCategory`](OmniumProductCategory.md)>, nullable, max length 250 — Discounted categories for Mix and match promotions. E.g buy one item of category A, get one item of category B free. (Only applies if PromotionType is MultiBuyPromotion).
- `discountedProducts`: List<[`OmniumPromotionProduct`](OmniumPromotionProduct.md)>, nullable, max length 20000 — Discounted products for Mix and match promotions. E.g buy one item of product or category A, get one item of product B free. (Only applies if PromotionType is MultiBuyPromotion).
- `promotionKitReward`: [`OmniumPromotionKitReward`](OmniumPromotionKitReward.md)
- `promotionKitBundles`: List<[`OmniumPromotionKitBundle`](OmniumPromotionKitBundle.md)>, nullable, max length 250 — Several complete kit definitions in one promotion, each with its own component groups and its own reward (Only applies if PromotionType is KitPromotion). When the cart matches more than one bundle, the one giving the customer the largest discount is applied. Leave empty and use Omnium.Public.Promotions.Models.PromotionDataModels.OmniumPromotionTypeRequest.PromotionKitReward instead for a promotion with a single kit.
- `productSearchRequest`: [`OmniumProductSearchRequest`](OmniumProductSearchRequest.md)
- `minQuantity`: integer (int32), nullable — Minimum total quantity of items required in the order (Only applies if PromotionType is OrderAmountPromotion).
- `conditionOperator`: [`OmniumConditionOperator`](OmniumConditionOperator.md)
- `includeProductsExcludedFromPromotions`: boolean, nullable — When true, products marked ExcludeFromPromotions still count towards the discount, so both the discount basis and the amount/quantity conditions cover the whole order (Only applies if PromotionType is OrderAmountPromotion). Order lines with a locked price or a selected unit are still left out. False and null both default to off.
- `priceListId`: string, nullable — The Id of the price list to use for this promotion (Applies to PriceListPromotion and CostPricePromotion). For CostPricePromotion, the price list provides cost prices used as the discount base.
- `markupPercentage`: number (decimal), nullable — Percentage markup added to the cost price (Only applies if PromotionType is CostPricePromotion). Example: 10 means a 10% markup on the cost price.
- `useStoreCostPrice`: boolean, nullable — When true, uses the StoreCostPrice from the price list item instead of the supplier cost price (Only applies if PromotionType is CostPricePromotion).
- `conditions`: [`OmniumProductConditionGroup`](OmniumProductConditionGroup.md)
- `basePriceListIds`: List<string>, nullable, max length 50 — The price lists the discount is calculated from (Only applies if PromotionType is RuleBasedPromotion). They decide the price, never the products: a product without a valid price in any of them gets no discount. When two lists price the same customers, the lower price is used. Empty uses the product's ordinary price.
- `onlyProductsAllowedOnPromotion`: boolean, nullable — Leaves out products that are blocked from discounts: marked as discount blocked, or with a fixed price period that has not ended (Only applies if PromotionType is RuleBasedPromotion). Defaults to true.
