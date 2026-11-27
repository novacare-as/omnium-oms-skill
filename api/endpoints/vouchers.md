# Vouchers

Source: https://api.omnium.no/documentation

> Vouchers

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `PUT /api/Vouchers`

**Add or save a voucher. If ID is null, it will be created.**

Operation ID: `VouchersPut`

**Request body:** [`OmniumVoucher`](../schemas/OmniumVoucher.md) — The voucher object

**Responses:**

- 201: Success
- 400: string — Bad Request

---

## `DELETE /api/Vouchers/{id}`

**Deletes a single voucher from the OMS**

Operation ID: `VouchersDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes |  |

**Responses:**

- 204: Success
- 400: string — Bad Request

---

## `POST /api/Vouchers/Search`

**Search for vouchers**

Operation ID: `VouchersSearchVouchers`

**Request body:** [`OmniumVoucherSearchRequest`](../schemas/OmniumVoucherSearchRequest.md)

**Responses:**

- 200: [`OmniumVoucherOmniumSearchResult`](../schemas/OmniumVoucherOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `POST /api/Vouchers/ScrollSearch`

**Scroll large amounts of vouchers**

Operation ID: `VouchersScrollSearchVouchers`

The scroll Id obtained here should be passed to the scroll endpoint to continue the scroll operation (fetch the next page of results). Page/take not relevant default is 5000 vouchers in each batch.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

**Request body:** [`OmniumVoucherSearchRequest`](../schemas/OmniumVoucherSearchRequest.md)

**Responses:**

- 200: [`OmniumVoucherOmniumSearchResult`](../schemas/OmniumVoucherOmniumSearchResult.md) — Success
- 400: string — Bad Request

---

## `GET /api/Vouchers/Scroll/{id}`

**Scroll vouchers is used to get a large amount of vouchers.**

Operation ID: `VouchersScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumVoucherOmniumResult`](../schemas/OmniumVoucherOmniumResult.md) — Success
