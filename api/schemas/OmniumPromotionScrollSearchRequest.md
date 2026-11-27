# OmniumPromotionScrollSearchRequest

Request model for the scroll promotion search endpoint (POST /api/Promotions/Search/Scroll).
Inherits all promotion filter fields from Omnium.Public.Promotions.Search.OmniumPromotionSearchRequestBase; adds
scroll batch sizing.

Use this for bulk extraction — exporting large promotion sets, syncing to other systems. The
response returns a ScrollId; pass it to GET /api/Promotions/Scroll/{id} to fetch subsequent
batches until no ScrollId is returned. For UI-style paginated search, use
Omnium.Public.Promotions.Search.OmniumPromotionSearchRequest with the regular search endpoint instead.

**Fields:**

- `scrollSize`: integer (int32), nullable — Number of items per scroll batch. Default applied when null: 500. Allowed range: 100–1000.
- `activatedBeforeDate`: string (date-time), nullable — Promotions that have started before this date. Only promotions where {Promotion.ActiveFrom <= activatedBeforeDate} will be included.
- `endedAfterDate`: string (date-time), nullable — Promotions that will end after this date. Only promotions where {Promotion.ActiveTo >= endedAfterDate} will be included.
- `activeFrom`: string (date-time), nullable — Promotions that will become active after this date. Only promotions where {Promotion.ActiveFrom >= activeFrom} will be included.
- `activeTo`: string (date-time), nullable — Promotions that will end before this date. Only promotions where {Promotion.ActiveTo <= activeTo} will be included.
- `modifiedFrom`: string (date-time), nullable — Only return promotions modified on or after this date. Useful for delta queries / polling for changes.
- `modifiedTo`: string (date-time), nullable — Only return promotions modified on or before this date.
- `createdFrom`: string (date-time), nullable — Only return promotions created on or after this date. Useful for delta queries / polling for newly created promotions.
- `createdTo`: string (date-time), nullable — Only return promotions created on or before this date.
- `marketIds`: List<string>, nullable, max length 250 — List of marketids to filter on
- `promotionTypes`: List<string>, nullable — List of promotion types to filter on. Valid types: ShippingPromotion, CategoryOrBrandPromotion, ProductSearchPromotion, PriceListPromotion, MultibuyPromotion, OrderAmountPromotion, KitPromotion, RuleBasedPromotion
- `promotionIds`: List<string>, nullable, max length 250 — Only return promotions with one of these ids. Use this to fetch a known set of promotions in one call, e.g. the ids found in {promotionIds} on products or in promotion events, instead of calling GET /api/Promotions/{id} once per promotion. Combines with the other filters. Maximum 250 ids per request.

**Used directly by endpoints in:**

- [Promotions](../endpoints/promotions.md)
