# OmniumChartOfAccountEntry

An account in a chart of accounts: the account that postings of one category book to.

**Fields:**

- `accountNumber`: string, nullable — The account number in the general ledger, e.g. "3000".
- `name`: string, nullable — Name of the account.
- `description`: string, nullable — Optional longer description.
- `category`: [`OmniumAccountCategory`](OmniumAccountCategory.md)
- `discriminator`: string, nullable — Narrows the category, e.g. the VAT rate as a fraction ("0.25") for sales and output VAT, or the payment method name for payment accounts.
- `vatCode`: string, nullable — VAT code written on the ledger lines of the account.
- `vatRate`: number (decimal), nullable — VAT rate written on the ledger lines of the account.
- `currencyCode`: string, nullable — Currency the account applies to. Null applies to every currency.
- `isActive`: boolean — False switches the account off. An inactive store account still replaces the tenant account it matches, which switches that account off for the store.
- `taxGroupCode`: string, nullable — Tax group code the account applies to. It takes precedence over a rate in Discriminator.
- `properties`: Dictionary<string, string>, nullable — Custom properties of the account.
