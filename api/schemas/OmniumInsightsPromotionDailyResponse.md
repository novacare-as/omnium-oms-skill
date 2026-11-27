# OmniumInsightsPromotionDailyResponse

Daily promotion redemption statistics for the Insights API.
One row per (date, store, promotion). RevenueFromPromoted overlaps across promotions on multi-promotion lines —
the sum across promotions can exceed total revenue. See DiscountValue and DiscountValueCoverage for attribution caveats.

**Fields:**

- `date`: string, nullable — The day this row covers, formatted as yyyy-MM-dd in the tenant's timezone.
- `storeId`: string, nullable — The internal Omnium store ID.
- `promotionId`: string, nullable — The promotion ID.
- `promotionName`: string, nullable — The promotion name.
- `redemptions`: integer (int32) — Number of unique orders that used this promotion on this day.
- `revenueFromPromoted`: number (decimal) — Sum of order-line ExtendedPrice (incl. VAT) for lines containing this promotion.
- `discountValue`: number (decimal) — Order-level discount allocated to this promotion, summed across order lines where this is the sole promotion. Computed as the sum of (DiscountedPrice − ExtendedPrice). Lines with multiple promotions are excluded because the index does not store per-promotion discount amounts. Note: line-level promotion discounts (e.g., percentage-off-this-SKU) are not captured here — only the order-level portion is recoverable from the analytics index.
- `discountValueCoverage`: number (decimal) — Fraction of this row's Redemptions reflected in DiscountValue (single_promo_redemptions / Redemptions), in the range 0–1. A value of 1.0 means full coverage; lower values mean DiscountValue is incomplete.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
