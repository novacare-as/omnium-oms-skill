# OmniumPromotionPatch

Request for adding a promotion

**Fields:**

- `id`: string, nullable — Unique Id of the promotion, GUID will be generated if not provided.
- `number`: string, nullable — Optional short, human-friendly promotion number.
- `name`: string, nullable — Name of the promotion
- `title`: string, nullable — Descriptive title of the promotion
- `activeFrom`: string (date-time), nullable — Start date of the promotion
- `activeTo`: string (date-time), nullable — End date of the promotion.
- `costPriceActiveFrom`: string (date-time), nullable — Optional start date for cost prices on the linked price list (PriceListPromotion). If null, ActiveFrom is used.
- `costPriceActiveTo`: string (date-time), nullable — Optional end date for cost prices on the linked price list (PriceListPromotion). If null, ActiveTo is used.
- `storeCostPriceActiveFrom`: string (date-time), nullable — Optional start date for store cost prices on the linked price list (PriceListPromotion). If null, ActiveFrom is used.
- `storeCostPriceActiveTo`: string (date-time), nullable — Optional end date for store cost prices on the linked price list (PriceListPromotion). If null, ActiveTo is used.
- `markets`: List<string>, nullable, max length 250 — Promotion is only valid for carts with these markets.
- `marketGroups`: List<string>, nullable, max length 250 — Promotion is only valid for carts with these market groups.
- `stores`: List<string>, nullable, max length 250 — Promotion is only valid for carts with these stores.
- `storeGroups`: List<string>, nullable, max length 250 — Promotion is only valid for carts with these store groups.
- `excludedStores`: List<string>, nullable, max length 250 — Promotion will not apply for carts with these stores. Exclude takes priority over include.
- `excludedStoreGroups`: List<string>, nullable, max length 250 — Promotion will not apply for carts with stores in these store groups. Exclude takes priority over include.
- `filterOnWarehouseStores`: boolean, nullable — Only discount for products sent from chosen stores. (Only applies if stores are set). Default is false.
- `customerGroups`: List<[`OmniumCustomerGroupReference`](OmniumCustomerGroupReference.md)>, nullable, max length 250 — Promotion is only valid for customers in these customer groups.
- `privateCustomerIds`: List<string>, nullable, max length 250 — Promotion is only valid for these specific private (B2C) customers by ID.
- `businessCustomerIds`: List<string>, nullable, max length 250 — Promotion is only valid for these specific business (B2B) customers by ID.
- `promotionTranslations`: List<[`OmniumPromotionTranslation`](OmniumPromotionTranslation.md)>, nullable, max length 250 — Title and Description translations for different markets.
- `priority`: integer (int32), nullable — Priority of the promotion. Promotions with higher priority will be applied first. 0 is the highest priority.
- `promotionData`: [`OmniumPromotionTypePatch`](OmniumPromotionTypePatch.md)
- `couponCode`: string, nullable — Coupon code for the promotion. If not set, the promotion will be applied automatically.
- `additionalCoupons`: List<[`OmniumPromotionCoupon`](OmniumPromotionCoupon.md)>, nullable, max length 250 — Additional coupon codes for the promotion. (Personal coupon codes / single usage coupon codes).
- `canBeCombinedWithOtherPromotions`: boolean, nullable — Promotion can be combined with other promotions on the same orderLine (e.g. 10% off + 5$ off).
- `alwaysApply`: boolean, nullable — Promotion can be combined also with promotions that have are canBeCombinedWithOtherPromotions = false.
- `customerClubMembersOnly`: boolean, nullable — Promotion is valid only for customers that are members of the customer club.
- `isBonusPointsReward`: boolean, nullable — Is reward given in bonus points instead of discount (CustomerClub and CategoryOrBrand promotions only).
- `orderTypes`: List<string>, nullable, max length 250 — Promotion is valid only for these order types (e.g. online, clickAndCollect, pos).
- `tags`: List<string>, nullable, max length 250 — Tag for filtering promotions. E.g. "BlackFriday"
- `canNotBeCombinedWithTags`: List<string>, nullable, max length 250 — The promotion is not applied to an order line that already has a discount from a promotion with one of these tags.
- `canOnlyBeCombinedWithTags`: List<string>, nullable, max length 250 — When the order line already has discounts, the promotion is applied only if each of them comes from a promotion with one of these tags. An order line without discounts is not affected by this rule.
- `requireCombinationWithTags`: boolean, nullable — Order line promotions other than price list promotions; ignored for the other types. Makes canOnlyBeCombinedWithTags strict: the promotion is applied only to an order line that already has a discount from a promotion with one of those tags, and only if every discount on the line comes from a promotion with one of them. Has no effect without canOnlyBeCombinedWithTags. A promotion with this set generates no product prices.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Additional properties / meta data
- `forcePriceUpdate`: boolean, nullable — Force update of all product prices for this promotion, regardless of whether changes are detected. This will remove existing promotion prices and recalculate them based on the current promotion configuration. Only applies to promotions where prices are not calculated in cart.
- `priceFilterMode`: string, nullable — Controls how the promotion filters products based on price type: None (default, no filtering), Exclude, or Include.
- `priceTypeFilter`: string, nullable — Comma-separated flags indicating which price types to filter: Discounted, MemberPrice, or both (Discounted, MemberPrice). Used with PriceFilterMode.
- `useDiscountedPriceAsBase`: boolean, nullable — When true, the promotion discount is calculated from the discounted price instead of the original price. Default is false.
- `useMemberPriceAsBase`: boolean, nullable — When true, the promotion discount is calculated from the product's member (customer club) price. Other campaigns' prices are never used as the base; products without a member price fall back to the ordinary price. Takes precedence over UseDiscountedPriceAsBase.
- `convertToRegularPriceAt`: string (date-time), nullable — When set, indicates when the promotion price should be automatically converted to a regular price with a "Last Chance" label. Typically set to promotion start date + 30 days. Set to null to clear.
- `forceGeneratePrices`: boolean, nullable — When true, price records are generated even if the promotion has coupon codes or order type restrictions. false and null both use default behavior.
- `excludeFromLowestPriceHistory`: boolean, nullable — When true, prices generated by this promotion are excluded from the lowest price history calculation. false and null both use default behavior (included).
- `createPriceList`: boolean, nullable — When true, a price list is automatically created with the same ID as the promotion. The price list stores planning/budget data for non-PriceListPromotion types.

**Used directly by endpoints in:**

- [Promotions](../endpoints/promotions.md)
