# Sales Restrictions

Source: https://docs.omnium.no/docs/Product/sales-restrictions

> Product fields for controlling embargo dates, fixed-price legislation, and discount blocking in sales channels

Omnium exposes a set of sales restriction fields on products that allow sales channels to enforce business rules such as embargo dates, fixed-price legislation, and discount prohibitions. These fields are available via the Product API and editable in the admin UI under **Products → \[Product\] → Settings**.

Omnium stores and returns these fields but does not enforce them automatically. Enforcement — such as blocking checkout before a sales start date — must be implemented in the sales channel or integration layer.

* * *

## Fields

| Field | Type | Description |
| --- | --- | --- |
| `salesStartDate` | datetime (nullable) | Embargo date. The product should not be sold before this date. The sales channel is responsible for checking this value and blocking purchases accordingly. |
| `fixedPriceCode` | string (nullable) | Fixed-price category code (e.g. used for book price law legislation). The sales channel uses this to identify products subject to fixed-price rules. |
| `fixedPriceEndDate` | datetime (nullable) | The date until which the fixed price applies. After this date the product may be discounted normally. |
| `discountBlocked` | bool (nullable) | When `true`, discounts must not be applied to this product, regardless of any active promotions. The sales channel is responsible for enforcing this. |

* * *

## Reading restriction fields via the API

The fields are returned as part of the standard product response:

```
GET /api/Products/{productId}
```

```json
{
  "id": "...",
  "salesStartDate": "2026-06-01T00:00:00Z",
  "fixedPriceCode": "BOOK",
  "fixedPriceEndDate": "2026-12-31T00:00:00Z",
  "discountBlocked": false
}
```

You can also include these fields when searching products or fetching variant listings.

* * *

## Setting restriction fields

Restriction fields can be set on individual products or variants via a PATCH request:

```
PATCH /api/Products/{productId}
Content-Type: application/json

{
  "salesStartDate": "2026-06-01T00:00:00Z",
  "discountBlocked": true
}
```

Setting a field to `null` in a PATCH request leaves the existing value unchanged. To clear a field, add its name to the `fieldsToForceNull` array in the PATCH body.

In the admin UI, these fields appear under **Products → \[Product\] → Settings** in the sales restriction section.

* * *

## Enforcement responsibility

Omnium does not block orders, cart additions, or shipments based on these fields. Your integration is responsible for:

*   Checking `salesStartDate` before allowing a product to be added to a cart or placed in an order.
*   Blocking discount application when `discountBlocked` is `true` or when the current date is before `fixedPriceEndDate`.
*   Using `fixedPriceCode` to identify products that fall under fixed-price legislation in your market.

For the full API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
