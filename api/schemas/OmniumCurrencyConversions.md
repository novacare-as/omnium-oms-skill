# OmniumCurrencyConversions

Represents foreign currency conversion details for registers handling multiple currencies.

**Fields:**

- `currencyCode`: string, nullable — The currency code of the foreign currency (3-letter ISO 4217, e.g., "EUR", "GBP", "NOK").
- `moneyExpected`: number (decimal) — The calculated expected amount for cash in the register in the foreign currency before counting.
- `moneyCounted`: number (decimal) — The actual counted amount for cash in the register in the foreign currency when closing.
- `moneyExpectedBase`: number (decimal) — The expected amount converted to the base/default currency of the register.
- `moneyCountedBase`: number (decimal) — The counted amount converted to the base/default currency of the register.
