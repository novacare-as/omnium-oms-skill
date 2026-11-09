# OmniumPromotion

**Fields:**

- `id`: string, nullable
- `number`: string, nullable — Optional short, human-friendly promotion number from the tenant's promotion number series. Null when the tenant has no series configured.
- `name`: string, nullable
- `title`: string, nullable
- `description`: string, nullable
- `activeFrom`: string (date-time)
- `activeTo`: string (date-time)
- `costPriceActiveFrom`: string (date-time), nullable — Optional start date for cost prices on the linked price list (PriceListPromotion). If null, ActiveFrom is used.
- `costPriceActiveTo`: string (date-time), nullable — Optional end date for cost prices on the linked price list (PriceListPromotion). If null, ActiveTo is used.
- `storeCostPriceActiveFrom`: string (date-time), nullable — Optional start date for store cost prices on the linked price list (PriceListPromotion). If null, ActiveFrom is used.
- `storeCostPriceActiveTo`: string (date-time), nullable — Optional end date for store cost prices on the linked price list (PriceListPromotion). If null, ActiveTo is used.
- `markets`: List<string>, nullable, max length 250
- `marketGroups`: List<string>, nullable, max length 250
- `storeGroups`: List<string>, nullable, max length 250
- `stores`: List<string>, nullable, max length 250
- `excludedStores`: List<string>, nullable, max length 250
- `excludedStoreGroups`: List<string>, nullable, max length 250
- `filterOnWarehouseStores`: boolean
- `customerGroups`: List<[`OmniumCustomerGroupReference`](OmniumCustomerGroupReference.md)>, nullable, max length 250
- `privateCustomerIds`: List<string>, nullable, max length 250
- `businessCustomerIds`: List<string>, nullable, max length 250
- `promotionTranslations`: List<[`OmniumPromotionTranslation`](OmniumPromotionTranslation.md)>, nullable, max length 250
- `deactivated`: boolean
- `priority`: integer (int32)
- `promotionService`: string, nullable
- `promotionData`: [`OmniumPromotionType`](OmniumPromotionType.md)
- `couponCode`: string, nullable
- `additionalCoupons`: List<[`OmniumPromotionCoupon`](OmniumPromotionCoupon.md)>, nullable, max length 250
- `canBeCombinedWithOtherPromotions`: boolean
- `alwaysApply`: boolean
- `customerClubMembersOnly`: boolean
- `tenantId`: string, nullable
- `indexIdentifier`: string, nullable, read-only
- `createdDate`: string (date-time), nullable
- `updatedDate`: string (date-time), nullable
- `userId`: string, nullable — User ID of whoever created the promotion. Captured by Omnium on create; read-only.
- `userName`: string, nullable — Display name of whoever created the promotion. Captured by Omnium on create; read-only.
- `orderTypes`: List<string>, nullable, max length 250
- `tags`: List<string>, nullable, max length 250
- `canNotBeCombinedWithTags`: List<string>, nullable, max length 250 — The promotion is not applied to an order line that already has a discount from a promotion with one of these tags.
- `canOnlyBeCombinedWithTags`: List<string>, nullable, max length 250 — When the order line already has discounts, the promotion is applied only if each of them comes from a promotion with one of these tags. An order line without discounts is not affected by this rule.
- `requireCombinationWithTags`: boolean — Order line promotions other than price list promotions; ignored for the other types. Makes canOnlyBeCombinedWithTags strict: the promotion is applied only to an order line that already has a discount from a promotion with one of those tags, and only if every discount on the line comes from a promotion with one of them. Has no effect without canOnlyBeCombinedWithTags. A promotion with this set generates no product prices.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable
- `priceFilterMode`: string, nullable — Controls how the promotion filters products based on price type: None (default, no filtering), Exclude, or Include.
- `priceTypeFilter`: string, nullable — Comma-separated flags indicating which price types to filter: Discounted, MemberPrice, or both (Discounted, MemberPrice). Used with PriceFilterMode.
- `useDiscountedPriceAsBase`: boolean — When true, the promotion discount is calculated from the discounted price instead of the original price.
- `useMemberPriceAsBase`: boolean — When true, the promotion discount is calculated from the product's member (customer club) price. Other campaigns' prices are never used as the base; products without a member price fall back to the ordinary price. Takes precedence over UseDiscountedPriceAsBase.
- `convertToRegularPriceAt`: string (date-time), nullable — When set, indicates when the promotion price should be automatically converted to a regular price with a "Last Chance" label. Typically set to promotion start date + 30 days.
- `isConvertedToRegularPrice`: boolean — Whether this promotion has been converted to a regular price with Last Chance flag.
- `convertedToRegularPriceAt`: string (date-time), nullable — When the conversion to regular price was executed.
- `forceGeneratePrices`: boolean, nullable — When true, price records are generated even if the promotion has coupon codes or order type restrictions. false and null both use default behavior.
- `excludeFromLowestPriceHistory`: boolean, nullable — When true, prices generated by this promotion are excluded from the lowest price history calculation. false and null both use default behavior (included).
- `createPriceList`: boolean, nullable — When true, a price list is automatically created with the same ID as the promotion. The price list stores planning/budget data for non-PriceListPromotion types.

**Used directly by endpoints in:**

- [Promotions](../endpoints/promotions.md)
