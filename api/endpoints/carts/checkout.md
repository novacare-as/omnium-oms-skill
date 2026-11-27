# Carts | Checkout

Source: https://api.omnium.no/documentation

> Contains endpoints for the cart checkout process. Adding payment, customer, discounts, validating cart etc.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `DELETE /api/Cart/{cartId}/DeleteShipments`

**Delete shipments from cart**

Operation ID: `CartDeleteShipments`

Delete shipments from cart.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID |

**Request body:** List<string> — Shipment IDs to delete

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Success
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Cart/{cartId}/Validate`

**Validate cart. Optionally specify which validators to run.**

Operation ID: `CartValidate`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID for the cart to validate |

**Request body:** [`OmniumCartValidationRequest`](../../schemas/OmniumCartValidationRequest.md) — Optional: specify which validators to run. If omitted or empty, all validators are executed.

**Responses:**

- 200: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — Cart validated successfully without errors or warning
- 404: string — Cart was not found
- 422: [`OmniumCartOmniumValidationResult`](../../schemas/OmniumCartOmniumValidationResult.md) — Validation completed with errors or warnings

---

## `PUT /api/Cart/{cartId}/RecalculatePrices`

**Recalculate prices**

Operation ID: `CartRecalculatePrices`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Cart with recalculated prices
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Cart was not found
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Cart/{cartId}/AddPayments`

**Add payments to existing cart**

Operation ID: `CartAddPaymentToCart`

Register payment transaction(s) from your payment provider on the cart.

The transactionId is typically provided by the payment provider and is often a GUID.
This ID ties together related transactions - the same transactionId is for instance used for
authorization, capture, and credit operations on the same payment.

For e-commerce orders: Use transactionType "Authorization" - Omnium workflows handle Capture/Credit/Void automatically.

For POS: Use transactionType "Sale" since payment is captured immediately.

Example - E-commerce payment (Klarna):

    PUT /api/carts/{cartId}/AddPayments
    [
        {
            "amount": 999.00,
            "paymentMethodName": "Klarna",
            "transactionId": "klarna-order-abc123",
            "transactionType": "Authorization",
            "status": "Processed"
        }
    ]

Example - POS sale:

    PUT /api/carts/{cartId}/AddPayments
    [
        {
            "amount": 599.00,
            "paymentMethodName": "Card",
            "transactionId": "terminal-tx-12345",
            "transactionType": "Sale",
            "status": "Processed"
        }
    ]

Example - Split payment (Gift card + Vipps):

    PUT /api/carts/{cartId}/AddPayments
    [
        {
            "amount": 200.00,
            "paymentMethodName": "GiftCard",
            "transactionId": "GC-ABC123",
            "transactionType": "Authorization",
            "status": "Processed"
        },
        {
            "amount": 799.00,
            "paymentMethodName": "Vipps",
            "transactionId": "vipps-order-xyz",
            "transactionType": "Authorization",
            "status": "Processed"
        }
    ]

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |
| `overwriteExisting` | query | boolean | No | Indicates whether to overwrite existing payments. Defaults to true. If true, replaces existing payments. If false, appends new payments |

**Request body:** List<[`OmniumPayment`](../../schemas/OmniumPayment.md)> — List of payments to add to cart

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Payments are added, and updated cart is returned
- 400: string — Cart ID or payments are invalid
- 404: string — Cart does not exist

---

## `PUT /api/Cart/{cartId}/RemovePayments`

**Remove payments from existing cart**

Operation ID: `CartRemovePaymentsFromCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |

**Request body:** [`OmniumPaymentFilters`](../../schemas/OmniumPaymentFilters.md)

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Payments are added, and updated cart is returned
- 400: string — Cart ID or payments are invalid
- 404: string — Cart does not exist

---

## `PUT /api/Cart/{cartId}/AddShipments`

**Add shipments to existing cart**

Operation ID: `CartAddShipmentsToCart`

Add shipping information to the cart. The shippingMethodName must match a configured shipping method in Omnium.

The shipmentId should always be set - it can be a simple value like "1" or a GUID.
It is used to reference the shipment for updates, deletions, and order workflows.

Example - Standard home delivery:
The warehouseCode should be the storeId of the store in Omnium that will send the shipment.

    PUT /api/carts/{cartId}/AddShipments
    [
        {
            "shipmentId": "1",
            "shippingMethodName": "Bring_SERVICEPAKKE",
            "warehouseCode": "central-warehouse-oslo-01"
        }
    ]

Example - Click and collect (pickup in store):
The pickUpWarehouseCode is the storeId of the store where the customer will pick up the order.
This is only needed if it differs from the sender (warehouseCode), which is often not the case.

    PUT /api/carts/{cartId}/AddShipments
    [
        {
            "shipmentId": "1",
            "shippingMethodName": "ClickAndCollect",
            "warehouseCode": "central-warehouse-oslo-01"
            "pickUpWarehouseCode": "STORE-OSLO-01"
        }
    ]

Example - Shipment with free shipping discount:

    PUT /api/carts/{cartId}/AddShipments
    [
        {
            "shipmentId": "1",
            "shippingMethodName": "PostNord_MyPack",
            "warehouseCode": "central-warehouse-oslo-01"
            "discounts": [
                {
                    "discountType": "Shipping",
                    "discountName": "Free shipping",
                    "discountValue": 100,
                    "rewardType": "Percentage"
                }
            ]
        }
    ]

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | ID of existing cart. (Required) |

**Request body:** List<[`OmniumShipment`](../../schemas/OmniumShipment.md)> — List of shipments to add to cart

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Shipments are added, and updated cart is returned
- 400: string — Cart ID or shipments are invalid
- 404: string — Cart does not exist

---

## `PUT /api/Cart/{cartId}/AddStore/{storeId}`

**Add store to cart**

Operation ID: `CartAddStoreToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `storeId` | path | string | Yes | Store selling the products |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Store or cart not found

---

## `PUT /api/Cart/{cartId}/AddCouponCode/{couponCode}`

**Adding coupon code to cart and recalculates discounts**

Operation ID: `CartAddCouponCodeToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `couponCode` | path | string | Yes | Coupon code to add |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Cart/{cartId}/ApplyVoucher/{voucherId}`

**Applying voucher to cart - A payment with the corresponding value will be added to the cart.**

Operation ID: `CartApplyVoucher`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `voucherId` | path | string | Yes | Id of voucher to apply |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Cart/{cartId}/RemoveVoucherFromCart/{voucherId}`

**Removing a voucher from the cart making the voucher available for use again.**

Operation ID: `CartRemoveVoucherFromCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `voucherId` | path | string | Yes | Id of voucher to remove |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Cart/{cartId}/AddPersonalDiscountCoupon/{couponId}`

**Adding personal discount coupon to cart by unique coupon Id and recalculates discounts**

Operation ID: `CartAddPersonalDiscountCouponToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `couponId` | path | string | Yes | Coupon code to add |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/Cart/{cartId}/RemoveCouponCode/{couponCode}`

**Removes coupon code from cart and recalculates discounts**

Operation ID: `CartRemoveCouponCodeFromCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `couponCode` | path | string | Yes | Coupon code to remove |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Not Found

---

## `PUT /api/Cart/{cartId}/AddGiftCard/{giftCardCode}`

**Add gift card payment to cart**

Operation ID: `CartAddGiftCardToCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `giftCardCode` | path | string | Yes | Gift card code to use for payment |
| `giftCardPin` | query | string | No | Gift card PIN, if required, along with the code provided by the gift card provider. |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Not Found

---

## `DELETE /api/Cart/{cartId}/RemoveGiftCard/{giftCardCode}`

**Remove gift card payment from cart**

Operation ID: `CartRemoveGiftCardFromCart`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID to update |
| `giftCardCode` | path | string | Yes | Gift card code to remove |

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Updated cart
- 400: string — Bad Request
- 404: string — Not Found

---

## `POST /api/Cart/{cartId}/Checkout`

**Checkout: convert cart to order with optional selective validation. Optionally applies a cart patch (which can attach payments / shipments) in the same call.**

Operation ID: `CartCheckout`

Converts a cart to an order in a single call. You can optionally patch the cart - including attaching
payments and shipments via the patch - avoiding the need for separate PatchCart / AddPayments / AddShipments
requests beforehand.

The cart is never persisted by this operation: mutations are applied in-memory only and consumed by the order creation.
On validation failure the cart in storage is untouched.

**Patching payments and shipments**: use {cartPatch.orderForm.paymentsMergeMode} and
{cartPatch.orderForm.shipmentsMergeMode} to control list behaviour:
<list type="bullet"><item>{UpdateOnly} (default) - match existing by ID; unknown IDs counted in NotFoundCount.</item><item>{AddOrUpdate} - match existing by ID; unknown IDs appended as new.</item><item>{Replace} - wipe existing list; use the supplied list wholesale.</item></list>{cartPatch.orderForm.discounts} and {cartPatch.orderForm.couponCodes} support the same merge modes via
{discountsMergeMode} and {couponCodesMergeMode} (discounts default to {AddOrUpdate}; coupon codes
default to legacy replace-when-non-empty).

Example - Minimal checkout (all defaults, no body required):

    POST /api/carts/{cartId}/Checkout

Example - Checkout with a consumer-specified order ID and order type:

    POST /api/carts/{cartId}/Checkout
    {
        "orderId": "PO-2026-000123",
        "cartPatch": { "orderType": "ClickAndCollect" }
    }

Example - Checkout adding a new payment and a new shipment via patch (common case):
{paymentsMergeMode} and {shipmentsMergeMode} are set to {AddOrUpdate} so the new items
are appended to the cart's existing lists (if any).

    POST /api/carts/{cartId}/Checkout
    {
        "cartPatch": {
            "orderForm": {
                "paymentsMergeMode": "AddOrUpdate",
                "payments": [
                    {
                        "amount": 499.00,
                        "paymentMethodName": "Klarna",
                        "status": "Processed",
                        "transactionId": "klarna-txn-abc123",
                        "transactionType": "Authorization"
                    }
                ],
                "shipmentsMergeMode": "AddOrUpdate",
                "shipments": [
                    {
                        "shipmentId": "1",
                        "shippingMethodName": "Bring_SERVICEPAKKE",
                        "warehouseCode": "central-warehouse-oslo-01"
                    }
                ]
            }
        }
    }

Example - Checkout that replaces the cart's payments and shipments wholesale:
{paymentsMergeMode} and {shipmentsMergeMode} are set to {Replace} so any existing
entries on the cart are discarded and the supplied lists take their place.

    POST /api/carts/{cartId}/Checkout
    {
        "cartPatch": {
            "orderForm": {
                "paymentsMergeMode": "Replace",
                "payments": [
                    {
                        "amount": 499.00,
                        "paymentMethodName": "Vipps",
                        "status": "Processed",
                        "transactionId": "vipps-txn-xyz789",
                        "transactionType": "Authorization"
                    }
                ],
                "shipmentsMergeMode": "Replace",
                "shipments": [
                    {
                        "shipmentId": "1",
                        "shippingMethodName": "Bring_SERVICEPAKKE",
                        "warehouseCode": "central-warehouse-oslo-01"
                    }
                ]
            }
        }
    }

Example - Checkout with customer data patched and a new payment, all in one call:

    POST /api/carts/{cartId}/Checkout
    {
        "cartPatch": {
            "customerEmail": "ola.nordmann@example.com",
            "customerPhone": "+4790000000",
            "billingAddress": {
                "name": "Ola Nordmann",
                "line1": "Lille Grensen 3",
                "postalCode": "0159",
                "city": "Oslo",
                "countryCode": "NO"
            },
            "properties": [
                { "keyGroup": "checkout", "key": "consentId", "value": "c-12345" }
            ],
            "orderForm": {
                "paymentsMergeMode": "AddOrUpdate",
                "payments": [
                    {
                        "amount": 499.00,
                        "paymentMethodName": "Vipps",
                        "status": "Processed",
                        "transactionId": "vipps-txn-final",
                        "transactionType": "Authorization"
                    }
                ]
            }
        }
    }

Validator selection via {validators}:
<list type="bullet"><item>Omitted or {null} - all configured validators are executed.</item><item>Empty array {[]} - no validators are run (the consumer has opted out of validation).</item><item>Non-empty array - only the named validators are run.</item></list>
Use GET {/api/carts/Validators} to discover the available validator names for the current tenant.

Example - Checkout running only selected validators:

    POST /api/carts/{cartId}/Checkout
    {
        "validators": ["StockValidator", "PriceValidator"],
    }

Example - Checkout skipping all validation (consumer opts out):

    POST /api/carts/{cartId}/Checkout
    {
        "validators": [],
    }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID |

**Request body:** [`OmniumCartCheckoutRequest`](../../schemas/OmniumCartCheckoutRequest.md) — Checkout request with optional cart patch, validator selection and order ID

**Responses:**

- 200: [`OmniumCartCheckoutResult`](../../schemas/OmniumCartCheckoutResult.md) — Checkout succeeded. Result contains the created order and any validation warnings.
- 400: string — Order creation already in progress for this cart.
- 404: string — Cart does not exist, or required market could not be resolved.
- 422: [`OmniumCartCheckoutResult`](../../schemas/OmniumCartCheckoutResult.md) — Validation failed or cart patch produced errors. Result contains validation details.

---

## `GET /api/Cart/Validators`

**Get available cart validators for the current tenant. Returns the names of validators that can be used in the Validate and Checkout endpoints.**

Operation ID: `CartGetValidators`

**Responses:**

- 200: List<string> — List of available validator names

---

## `GET /api/Cart/{id}/GetShippingOptions`

**Get valid shipping options for a cart.**

Operation ID: `CartGetShippingOptions`

Based on consignee/receivers postalCode and cart market, this will return valid shipping options with price

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Cart id |
| `postalCode` | query | string | No | Consignee/receivers postalCode |

**Responses:**

- 200: List<[`OmniumShippingOption`](../../schemas/OmniumShippingOption.md)> — A list of shippingOptions
- 400: string — Bad Request
- 404: string — Cart or shipment options not found

---

## `GET /api/Cart/GetShippingOptionsByZipCode`

**Get valid shipping options for a zip/postal code.**

Operation ID: `CartGetShippingOptionsByZipCode`

Based on consignee/receivers postalCode market, this will return valid shipping options with price
This will not calculate promotion discounts or price from Shipping provider. Then you should use GetShippingOptions
This endpoint can be used if Omnium does not have the cart, but you want to get configured shipping options

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `marketId` | query | string | No | market id |
| `postalCode` | query | string | No | Consignee/receivers postalCode |

**Responses:**

- 200: List<[`OmniumShippingOption`](../../schemas/OmniumShippingOption.md)> — A list of shippingOptions
- 400: string — Bad Request
- 404: string — Cart or shipment options not found

---

## `GET /api/Cart/{id}/GetPaymentOptions`

**Get valid payment options for a cart.**

Operation ID: `CartGetPaymentOptions`

Based on cart market, this will return valid payment options. If cart has storeId we will also filter on store

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | Cart id |

**Responses:**

- 200: List<[`OmniumPaymentOption`](../../schemas/OmniumPaymentOption.md)> — A list of payment options
- 400: string — Bad Request
- 404: string — Cart or payment options not found

---

## `PUT /api/Cart/{cartId}/AddDiscount`

**Add discount to cart**

Operation ID: `CartAddDiscount`

Add a discount to the cart. Use discountType to specify whether it applies to the order, specific line items, or other scenarios.

Note: Discounts are usually applied automatically to a cart - either by Omnium's promotions engine when adding items,
when adding a coupon code, or when adding a customer to the cart and items are recalculated.
If you are unsure whether you should use this endpoint or not, you probably shouldn't😵‍💫

Example - 20% order-level discount:

    PUT /api/carts/{cartId}/AddDiscount
    {
        "discountType": "Order",
        "discountName": "Summer sale 20%",
        "discountValue": 20,
        "rewardType": "Percentage"
    }

Example - Fixed amount discount (100 NOK off):

    PUT /api/carts/{cartId}/AddDiscount
    {
        "discountType": "Order",
        "discountName": "100 NOK rabatt",
        "discountValue": 100,
        "rewardType": "Money"
    }

Example - Line item discount on specific SKUs:

    PUT /api/carts/{cartId}/AddDiscount
    {
        "discountType": "LineItem",
        "discountName": "50% on selected items",
        "discountValue": 50,
        "rewardType": "Percentage",
        "skuIds": ["SKU-001", "SKU-002"]
    }

Example - 3 for 2 promotion:

    PUT /api/carts/{cartId}/AddDiscount
    {
        "discountType": "LineItem",
        "discountName": "3 for 2",
        "rewardType": "MultiBuys",
        "skuIds": ["SKU-001", "SKU-002", "SKU-003"],
        "promotionMultiBuyReward": {
            "requiredBuyAmount": 2,
            "numberOfDiscountedItems": 1,
            "percentage": 100
        }
    }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID |

**Request body:** [`OmniumDiscount`](../../schemas/OmniumDiscount.md) — Discount to add to cart

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Discount added and updated cart is returned
- 400: string — Bad Request
- 404: string — Cart was not found

---

## `PUT /api/Cart/{cartId}/UpdateDiscounts`

**Replacing discounts on cart**

Operation ID: `CartUpdateDiscounts`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `cartId` | path | string | Yes | Cart ID |

**Request body:** List<[`OmniumDiscount`](../../schemas/OmniumDiscount.md)> — List of discounts to place on cart

**Responses:**

- 200: [`OmniumCart`](../../schemas/OmniumCart.md) — Discount updated and cart is returned
- 400: string — Bad Request
- 404: string — Cart was not found
