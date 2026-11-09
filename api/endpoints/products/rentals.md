# Products | Rentals

Source: https://api.omnium.no/documentation

> Product Rentals.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/Rentals/GetRentalProducts`

**Get rental products in a certain store**

Operation ID: `RentalsGetRentalProducts`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | query | string | No |  |

**Responses:**

- 200: List<[`OmniumProduct`](../../schemas/OmniumProduct.md)> — Rental products found and returned

---

## `GET /api/Rentals/GetRentalSourceProducts`

**Get rental source products in a certain store**

Operation ID: `RentalsGetRentalSourceProducts`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `storeId` | query | string | No |  |

**Responses:**

- 200: List<[`OmniumProduct`](../../schemas/OmniumProduct.md)> — Rental products found and returned

---

## `POST /api/Rentals/GetAvailability`

**Get availability for the given source product(s) or rental product(s) in a given timespan. If fields are left blank, they will match all rental products.**

Operation ID: `RentalsGetAvailability`

**Request body:** [`OmniumRentalAvailabilityRequest`](../../schemas/OmniumRentalAvailabilityRequest.md)

**Responses:**

- 200: [`OmniumRentalAvailabilityResult`](../../schemas/OmniumRentalAvailabilityResult.md) — Availability and bookings successfully found and returned

---

## `POST /api/Rentals/CreateRentalProducts`

**Create rental products of a given source product**

Operation ID: `RentalsCreateRentalProducts`

**Request body:** [`OmniumRentalProductCreateRequest`](../../schemas/OmniumRentalProductCreateRequest.md)

**Responses:**

- 200: [`OmniumRentalProductCreateResult`](../../schemas/OmniumRentalProductCreateResult.md) — Rental products successfully created

---

## `POST /api/Rentals/GetRentalProductsBySource`

**Get rental products by the id of the source product**

Operation ID: `RentalsGetRentalProductsBySource`

**Request body:** [`OmniumGetRentalProductsBySourceRequest`](../../schemas/OmniumGetRentalProductsBySourceRequest.md)

**Responses:**

- 200: List<[`OmniumProductListItemViewModel`](../../schemas/OmniumProductListItemViewModel.md)> — Rental products found and returned

---

## `DELETE /api/Rentals/DeleteRentalProducts`

**Delete the given rental product(s). Optionally reclaim the inventory to a given warehouse**

Operation ID: `RentalsDeleteRentalProducts`

**Request body:** [`OmniumDeleteRentalProductsRequest`](../../schemas/OmniumDeleteRentalProductsRequest.md)

**Responses:**

- 200: integer (int64) — Rental products successfully deleted

---

## `POST /api/Rentals/AddRentalProductToCart`

**Add a rental product and deposit as line items in cart**

Operation ID: `RentalsAddRentalProductToCart`

**Request body:** [`OmniumAddRentalProductToCartRequest`](../../schemas/OmniumAddRentalProductToCartRequest.md)

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Rental product and deposit successfully added to cart
- 400: string — Bad Request
- 404: string — Not Found
- 422: string — Client Error

---

## `POST /api/Rentals/AddRentalDepositToCart`

**Add a deposit for a rental product as a line item in cart**

Operation ID: `RentalsAddRentalDepositToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | query | string | No | Id of the cart to add the deposit line item to |
| `rentalProductSkuId` | query | string | No | The SKU ID of the rental product to add the deposit for |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Rental deposit successfully added to cart
- 404: string — Not Found

---

## `POST /api/Rentals/UpdateRentalProductDailyRate`

**Update the daily rate price of a rental product**

Operation ID: `RentalsUpdateRentalProductDailyRate`

**Request body:** [`OmniumUpdateRentalProductPriceRequest`](../../schemas/OmniumUpdateRentalProductPriceRequest.md)

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Daily rate price successfully updated
- 404: string — Not Found
- 422: string — Client Error

---

## `POST /api/Rentals/UpdateRentalProductDeposit`

**Update the deposit price of a rental product**

Operation ID: `RentalsUpdateRentalProductDeposit`

**Request body:** [`OmniumUpdateRentalProductPriceRequest`](../../schemas/OmniumUpdateRentalProductPriceRequest.md)

**Responses:**

- 200: [`OmniumProduct`](../../schemas/OmniumProduct.md) — Deposit price successfully updated
- 404: string — Not Found
- 422: string — Client Error
