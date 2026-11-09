# OmniumVoucher

Vouchers

**Fields:**

- `id`: string, nullable — Voucher ID
- `customerId`: string, nullable — Id of customer owning the voucher
- `voucherNumber`: string, nullable — Voucher number
- `amount`: number (decimal) — The amount the voucher is worth
- `currency`: string, nullable — Currency of the voucher amount
- `status`: string, nullable — Voucher status [Available, Applied, Redeemed, Expired]
- `created`: string (date-time), nullable — Created date
- `modified`: string (date-time), nullable — Modified date
- `expiryDate`: string (date-time), nullable — Expiry date of the Voucher
- `externalIds`: List<[`OmniumExternalId`](OmniumExternalId.md)>, nullable, max length 250 — External IDs

**Used directly by endpoints in:**

- [Vouchers](../endpoints/vouchers.md)
