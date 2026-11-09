# OmniumGiftCardSearchRequest

**Fields:**

- `take`: integer (int32) — Number of items to take
- `page`: integer (int32) — Page (Fetches from [Page * Take] to [(Page + 1) * Take])
- `createdFrom`: string (date-time), nullable — GiftCard created from date
- `createdTo`: string (date-time), nullable — GiftCard created before date
- `giftCardCodes`: List<string>, nullable — Search by multiple gift card codes.
- `marketIds`: List<string>, nullable — Filter by gift cards created in specific markets.
- `marketId`: string, nullable, **deprecated** — Filter by gift card created in specific market.
- `isExpired`: boolean, nullable — Filter by gift cards expired or not.

**Used directly by endpoints in:**

- [Orders | Gift Cards](../endpoints/orders/gift-cards.md)
