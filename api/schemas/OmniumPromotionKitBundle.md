# OmniumPromotionKitBundle

One complete kit definition inside a kit promotion - its own component groups and its own reward.
A kit promotion can hold several bundles, e.g. "ski + binding for 4000" and
"ski + binding + poles for 5000" as two bundles of the same promotion. When a cart matches more
than one bundle, the one giving the customer the largest discount is applied.

**Fields:**

- `id`: string, nullable — Stable id for the bundle. Optional - assign one to reference the bundle later, e.g. to distinguish it from other bundles in reporting.
- `name`: string, nullable — Optional merchandiser-facing label for the bundle, e.g. "Ski + binding".
- `promotionKitComponentGroups`: List<[`OmniumPromotionKitComponentGroup`](OmniumPromotionKitComponentGroup.md)>, nullable, max length 250 — Component groups that make up this bundle.
- `rewardType`: [`KitPromotionRewardType`](KitPromotionRewardType.md)
- `reward`: [`OmniumPromotionReward`](OmniumPromotionReward.md)
