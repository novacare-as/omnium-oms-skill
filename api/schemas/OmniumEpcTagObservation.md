# OmniumEpcTagObservation

The latest observation of a tag: when and where it was last seen, and by what.

**Fields:**

- `date`: string (date-time), nullable — When the tag was last seen.
- `storeId`: string, nullable — Store where the tag was last seen.
- `location`: string, nullable — In-store zone or area, e.g. "Goods reception" or a shelf location.
- `source`: string, nullable — The flow that produced the observation, e.g. "InventoryCount", "GoodsReception", "Checkout" or "Api".
- `deviceId`: string, nullable — The device that read the tag.
