# Rental API

Source: https://docs.omnium.no/docs/Order/Rental/rental-api

> API reference for the Omnium Rental API. Create and manage rental product instances, check availability, and add rental items to carts.

The Rental API manages rental product instances and integrates them into the cart and order flow.

## Authentication

All rental endpoints require an API key with **product-level access**.

```
Authorization: Bearer {your-api-key}
```

## Base URL

```
https://api.omnium.no/api/rentals
```

* * *

## Create Rental Products

Creates a specified number of rental product instances from a source product. Each instance is a distinct physical unit that can be individually booked.

```
POST /api/rentals/CreateRentalProducts
```

### Request body

```json
{
  "sourceProductId": "prod-bicycle-touring-28",
  "storeId": "store-oslo-west",
  "count": 5,
  "warehouseCode": "WH-OSLO",
  "prices": [
    {
      "amount": 250.00,
      "currency": "NOK"
    },
    {
      "amount": 1500.00,
      "currency": "NOK",
      "priceType": "Deposit"
    }
  ]
}
```

### Request properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceProductId` | string | Yes | ID of the source product to create rental instances from |
| `storeId` | string | Yes | Store to associate the rental instances with |
| `count` | integer | Yes | Number of rental instances to create |
| `warehouseCode` | string | No | Warehouse to reduce stock from when creating the instances |
| `prices` | array | No | Prices to apply to the created instances. Use `priceType: "Deposit"` to mark a deposit price. |

### Response

```json
{
  "isSuccessful": true,
  "errorMessage": null,
  "createdProducts": [...],
  "inventoryReduced": 5
}
```

### Response properties

| Property | Type | Description |
| --- | --- | --- |
| `isSuccessful` | bool | Whether the operation succeeded |
| `errorMessage` | string | Error details if `isSuccessful` is `false` |
| `createdProducts` | array | List of product objects created |
| `inventoryReduced` | integer | Quantity deducted from the source product's inventory |

* * *

## Get Rental Products

Returns all rental product instances in a store.

```
GET /api/rentals/GetRentalProducts?storeId={storeId}
```

### Query parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `storeId` | string | Yes | Store ID to retrieve rental products for |

### Response

Returns a list of products where `isRental` is `true`. For the full product model, see the [swagger documentation](https://api.omnium.no/documentation/index.html).

* * *

## Get Rental Source Products

Returns all source products that have rental instances in a store.

```
GET /api/rentals/GetRentalSourceProducts?storeId={storeId}
```

### Query parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `storeId` | string | Yes | Store ID to filter by |

### Response

Returns a list of source products. For the full product model, see the [swagger documentation](https://api.omnium.no/documentation/index.html).

* * *

## Get Rental Products by Source

Returns rental instances associated with one or more source product SKUs.

```
POST /api/rentals/GetRentalProductsBySource
```

### Request body

```json
{
  "sourceProductSkuIds": ["bicycle-touring-28-black", "bicycle-touring-28-silver"],
  "storeId": "store-oslo-west"
}
```

### Request properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceProductSkuIds` | array | Yes | Source product SKU IDs to look up |
| `storeId` | string | No | Filter results to a specific store |

* * *

## Get Availability

Returns availability periods and active bookings for rental products derived from a source product SKU.

```
POST /api/rentals/GetAvailability
```

### Request body

```json
{
  "sourceProductSkuId": "bicycle-touring-28-black",
  "rentalProductIds": ["rental-001", "rental-002"],
  "from": "2026-06-01T00:00:00Z",
  "to": "2026-08-31T00:00:00Z",
  "storeId": "store-oslo-west"
}
```

### Request properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceProductSkuId` | string | Yes | Source product SKU to check availability for |
| `rentalProductIds` | array | No | Limit results to specific rental instance IDs. Omit to include all instances. |
| `from` | datetime | No | Start of the availability window |
| `to` | datetime | No | End of the availability window |
| `storeId` | string | No | Filter to a specific store |

### Response

```json
{
  "sourceProductSkuId": "bicycle-touring-28-black",
  "rentalProducts": ["rental-001", "rental-002"],
  "periods": [
    {
      "from": "2026-06-15T09:00:00Z",
      "to": "2026-06-21T17:00:00Z",
      "products": ["rental-002"]
    }
  ],
  "bookings": [
    {
      "rentalProductId": "rental-001",
      "projectId": "proj-8821",
      "projectName": "Rental — John Smith",
      "customerName": "John Smith",
      "rentalFrom": "2026-06-15T09:00:00Z",
      "rentalTo": "2026-06-21T15:00:00Z",
      "reservedUntil": "2026-06-21T17:00:00Z"
    }
  ],
  "returnBufferMinutes": 120
}
```

### Response properties

| Property | Type | Description |
| --- | --- | --- |
| `sourceProductSkuId` | string | Source product SKU the results relate to |
| `rentalProducts` | array | All rental instance IDs considered |
| `periods` | array | Contiguous time periods and which instances are available during each. The periods run from the earliest `rentalFrom` to the latest `reservedUntil` in `bookings`; outside them, within the queried window, every instance is available. |
| `periods[].from` | datetime | Period start |
| `periods[].to` | datetime | null | Period end |
| `periods[].products` | array | Rental instance IDs available during this period |
| `bookings` | array | Active bookings within the queried window. With a return buffer, see [Reservation after return](rental-api.md#reservation-after-return). |
| `bookings[].rentalProductId` | string | Rented instance ID |
| `bookings[].projectId` | string | ID of the rental tracking project |
| `bookings[].projectName` | string | Project name |
| `bookings[].customerName` | string | Customer name |
| `bookings[].rentalFrom` | datetime | Booking start |
| `bookings[].rentalTo` | datetime | Booking end |
| `bookings[].reservedUntil` | datetime | When the instance is available again: the registered return, or `rentalTo` while the instance is out, plus `returnBufferMinutes`. Equal to `rentalTo` when the tenant has no return buffer. Use this, not `rentalTo`, to decide when the instance can be rented again. |
| `returnBufferMinutes` | integer | Minutes an instance stays reserved after it is returned. `0` when the tenant has no return buffer. |

### Reservation after return

When the tenant sets **Reserve the unit after return (minutes)** in the order settings, each instance stays reserved for that many minutes after a rental, for example for checking and cleaning:

*   Each booking reserves its instance from `rentalFrom` until `reservedUntil`. The buffer counts from the registered return once the rental project's workflow has ended or the project is completed, and from `rentalTo` until then. An early return frees the instance earlier, and a late return keeps it reserved until the buffer has passed after the actual return.
*   The registered return time is used as it is, not rounded to the booked hour. With a 120-minute buffer, an instance booked until 15:00 and returned at 15:07 is reserved until 17:07.
*   Until a late return is registered, the instance is available again from `rentalTo` plus the buffer, even if it is not back yet.
*   `bookings` holds only the bookings that conflict with a rental from `from` to `to`: bookings that are reserved past `from` and start before `to` plus `returnBufferMinutes`. Bookings of completed rental projects are included while they are still reserved. A rental can start exactly at `reservedUntil`.
*   `periods` shows a booked instance as unavailable until `reservedUntil`.
*   Send `from` in the request. Without it, bookings of completed rental projects that are still inside their buffer are left out.
*   [Add Rental Product to Cart](rental-api.md#add-rental-product-to-cart) refuses an instance that is reserved in the requested period.

* * *

## Add Rental Product to Cart

Adds a rental line item to a cart. Optionally adds a deposit line item in the same call.

```
POST /api/rentals/AddRentalProductToCart
```

### Request body

```json
{
  "cartId": "cart-a1b2c3d4",
  "rentalProductSkuId": "rental-001",
  "rentalFrom": "2026-06-15T00:00:00Z",
  "rentalTo": "2026-06-21T00:00:00Z",
  "addDeposit": true
}
```

### Request properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `cartId` | string | Yes | Cart to add the rental line to |
| `rentalProductSkuId` | string | Yes | SKU of the rental instance to add |
| `rentalFrom` | datetime | Yes | Rental period start |
| `rentalTo` | datetime | Yes | Rental period end |
| `addDeposit` | bool | No | Whether to add a deposit line item. Defaults to `true`. |

The rental line item quantity is the number of daily rates: one for every started 24 hours from `rentalFrom` to `rentalTo`, and at least one. The hours are counted in the tenant's time zone. The line price is the rental product's daily rate.

If you set `addDeposit: false` and need to add the deposit later, use the [Add Rental Deposit to Cart](rental-api.md#add-rental-deposit-to-cart) endpoint.

### Instance already reserved

When the tenant uses a [return buffer](rental-api.md#reservation-after-return), the endpoint returns `409 Conflict` if the instance is reserved in the requested period, or if the cart already holds the same instance for a period less than the buffer apart. A rental must also end at least the buffer before the instance's next booking starts. The times in the message are in the tenant's time zone.

```json
{
  "message": "The rental unit is reserved from 2026-06-15 11:00 to 2026-06-21 19:00. A rental must be back 120 minutes before the next one starts."
}
```

When the cart already holds the instance, the message is `The rental unit is already in the cart for an overlapping period.`

Without a return buffer, the endpoint does not check availability. Use [Get Availability](rental-api.md#get-availability) before adding the rental.

* * *

## Add Rental Deposit to Cart

Adds a deposit line item to a cart for an existing rental line. Use this when you did not include the deposit in the initial `AddRentalProductToCart` call.

```
POST /api/rentals/AddRentalDepositToCart?cartId={cartId}&rentalProductSkuId={rentalProductSkuId}
```

### Query parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `cartId` | string | Yes | Cart to add the deposit to |
| `rentalProductSkuId` | string | Yes | SKU of the rental instance the deposit is for |

The deposit line item will have `DepositFor` set to `rentalProductSkuId` and a tax rate of `0`.

* * *

## Delete Rental Products

Deletes one or more rental product instances. Optionally reclaims their inventory back to a warehouse.

```
DELETE /api/rentals/DeleteRentalProducts
```

### Request body

```json
{
  "productIds": ["rental-001", "rental-005"],
  "reclaimInventory": true,
  "reclaimToWarehouse": "WH-OSLO"
}
```

### Request properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `productIds` | array | Yes | IDs of rental instances to delete |
| `reclaimInventory` | bool | No | If `true`, returns inventory to the warehouse. Defaults to `false`. |
| `reclaimToWarehouse` | string | No | Warehouse code to receive the reclaimed inventory. Required when `reclaimInventory` is `true`. |

Deleting a rental product does not cancel existing bookings or projects linked to that instance. Verify there are no active rentals before deleting.

* * *

## Build a booking flow

Use [Get Availability](rental-api.md#get-availability) and [Add Rental Product to Cart](rental-api.md#add-rental-product-to-cart) together to let a customer pick a rental instance, a pickup time and a return time. Read `returnBufferMinutes` from the availability response instead of hard-coding the buffer. It is a tenant setting, and it is `0` when the tenant has no [return buffer](rental-api.md#reservation-after-return).

### Show available pickup and return times

For each instance, a booking makes the instance unavailable from `rentalFrom` until `reservedUntil`.

*   A pickup time is available when it is not inside a booking of the instance. A pickup exactly at `reservedUntil` is allowed.
*   A return time is available when the instance's next booking starts at least `returnBufferMinutes` after it. `periods` only shows when an instance is booked, so check return times against `bookings` and `returnBufferMinutes`.
*   Request the whole range that your calendar shows, and always send `from`.

### Check a rental before you add it to the cart

Call Get Availability with the chosen pickup time as `from`, the chosen return time as `to`, and the instance in `rentalProductIds`. With a return buffer, `bookings` is empty only when the instance is free for that rental, with the buffer included. This is the check that Add Rental Product to Cart makes, except that the endpoint also checks the cart for the same instance (see [Change the dates of a rental in the cart](rental-api.md#change-the-dates-of-a-rental-in-the-cart)). Without a buffer, `bookings` also lists bookings that end at `from` or start at `to`, so compare the times.

```json
{
  "sourceProductSkuId": "bicycle-touring-28-black",
  "rentalProductIds": ["rental-001"],
  "from": "2026-06-22T08:00:00Z",
  "to": "2026-06-24T15:00:00Z"
}
```

### Keep availability current

Availability changes when a booking is made and when a return is registered, because an early return frees the instance earlier. Do not cache availability responses for long, and request them again before the customer confirms the rental.

### Handle a refused rental

With a return buffer, Add Rental Product to Cart returns `409 Conflict` when the instance is no longer free. See [Instance already reserved](rental-api.md#instance-already-reserved). The cart does not change: neither the rental line nor the deposit line is added. Tell the customer that the instance is no longer free, request availability again, and let the customer pick another instance or time.

### Change the dates of a rental in the cart

Remove the rental line and its deposit line from the cart before you add the instance again with new dates. Use [Remove item](../../Carts/cart-api.md#remove-item) for each line. With a return buffer, if the old rental line stays in the cart, the new dates must be at least the buffer away from the old dates, or the endpoint returns `409 Conflict`.

### Carts do not reserve instances

An instance is reserved when the [Create Rental Project from Order](../workflow-steps/rental/create-rental-project-from-order.md) workflow step creates the rental project for its order. Until then, two carts can hold the same instance for overlapping periods, and both orders can be placed. Check availability again just before checkout to reduce this risk.

* * *

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
