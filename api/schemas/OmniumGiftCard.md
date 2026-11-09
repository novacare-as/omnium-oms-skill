# OmniumGiftCard

Class for Gift card payment

**Fields:**

- `id`: string, nullable — Gift card id
- `balance`: number (decimal) — Current balance on gift card
- `type`: [`OmniumGiftCardType`](OmniumGiftCardType.md)
- `currency`: string, nullable — Gift card currency
- `customerId`: string, nullable — Unique customerId
- `customerName`: string, nullable — Name of customer
- `customerEmail`: string, nullable — Customer email
- `giftCardCode`: string, nullable — Gift card code/number
- `description`: string, nullable — Description
- `isClosed`: boolean, nullable — Is gift card closed/not usable
- `validUntil`: string (date-time), nullable — Gift card valid date
- `closed`: string (date-time), nullable — Date for when the gift card was closed
- `modified`: string (date-time), nullable — Last modified date
- `created`: string (date-time), nullable — Gift card created date
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — External ids
- `marketId`: string, nullable — The market the gift card originates from.
- `transactions`: List<[`OmniumGiftCardTransaction`](OmniumGiftCardTransaction.md)>, nullable — Transactions, used to show the history of the gift card.

**Used directly by endpoints in:**

- [Orders | Gift Cards](../endpoints/orders/gift-cards.md)
