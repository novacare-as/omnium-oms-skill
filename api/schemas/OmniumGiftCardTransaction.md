# OmniumGiftCardTransaction

Transactions on gift cards

**Fields:**

- `id`: string, nullable — The id of the transaction.
- `date`: string (date-time) — The time when the transaction was made.
- `amount`: number (decimal) — Amount of the transaction, in the given Currency.
- `currency`: string, nullable — The currency of the transaction. If null, the currency is the same as for the gift card.
- `description`: string, nullable — Optional explanation of the transaction.
- `reference`: string, nullable — Reference to where the transaction originated from. E.g. order number og receipt number.
- `storeId`: string, nullable — In which store this transaction was made.
- `salesPersonId`: string, nullable — The id of the sales person who made the transaction, if originates from pos.
- `amountInGiftCardCurrency`: number (decimal), nullable — The amount given in the gift card currency, in case the transaction was made in a different currency.
- `exchangeRate`: number (decimal), nullable — The exchange rate used to convert the amount to the gift card currency.
