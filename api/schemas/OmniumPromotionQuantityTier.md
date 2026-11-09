# OmniumPromotionQuantityTier

Represents a quantity-based pricing tier for MultiBuy promotions in the public API.
Enables tiered discounts like "2 for 499 NOK, 3 for 649 NOK, 4 for 799 NOK".

**Fields:**

- `quantity`: integer (int32) — The quantity threshold for this tier (e.g., 2, 3, 4). Customers must purchase at least this many items to qualify for this tier's pricing.
- `fixedPrice`: number (decimal) — Fixed price for this quantity tier. Used when promotion IsFixedPrice is true. Example: For "2 for 499", this would be 499.
- `percentage`: number (decimal) — Discount percentage for this tier. Used when UsePercentage is true. Value should be between 0-100 (e.g., 20 for 20% off).
- `discountAmount`: number (decimal) — Discount amount per item for this tier. Used when UsePercentage is false and IsFixedPrice is false.
- `marketId`: string, nullable — Market ID for this tier (e.g., "NO", "SE", "DK").
- `currency`: string, nullable — Currency for this tier (e.g., "NOK", "SEK", "DKK").
