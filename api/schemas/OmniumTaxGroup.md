# OmniumTaxGroup

A VAT rate (tax group): the rate, the VAT code of the ERP and the days it is valid on.

**Fields:**

- `code`: string, nullable — Short code that products, prices and order lines refer to, e.g. "HIGH" or "FOOD". On a store, the code must exist in the tenant VAT rates.
- `name`: string, nullable — Name shown in Omnium, e.g. "Standard 25%".
- `description`: string, nullable — Optional longer description.
- `rate`: number (decimal) — The VAT rate as a percentage, e.g. 25 for 25%.
- `externalCode`: string, nullable — The VAT code of the ERP or SAF-T, e.g. the Norwegian MVA code "3".
- `isOutsideVatScope`: boolean — True when the group is outside the scope of VAT, as opposed to a rate of 0%.
- `validFrom`: string (date-time), nullable — First day the row is valid. Null means valid with no start.
- `validTo`: string (date-time), nullable — Last day the row is valid. Null means valid with no end.
- `isActive`: boolean — False switches the row off. An inactive store row still replaces the tenant rows with its code, which switches that code off for the store.
- `overrideOutputVatAccountNumber`: string, nullable — Optional output VAT account for the group, used instead of the chart of accounts.
- `overrideSalesAccountNumber`: string, nullable — Optional sales account for the group, used instead of the chart of accounts.

**Used directly by endpoints in:**

- [Stores](../endpoints/stores.md)
