# API Reference

Source: https://docs.omnium.no/docs/Product/container-deposits/api-reference

> Product deposit fields, the JSON shape of a container deposit line on carts and orders, orders received with deposits, returns of deposits and analytics rows for deposits

This page covers the API surface of container deposits (pant): the fields on products, the deposit lines Omnium generates on carts and orders, how to send orders that already carry deposits, how to refund a deposit on a return, and how deposits appear in analytics. The deposit types themselves are tenant settings, see [Configuration](configuration.md).

* * *

## Product fields

| Field | Type | Description |
| --- | --- | --- |
| `depositTypeCode` | string | Code of the deposit type, from the tenant's deposit types, that the product carries a container deposit for. `null` when the product has no deposit. |
| `depositQuantity` | int | Deposit units per sales unit, for example `4` for a 4-pack. `null` or `0` counts as `1`. |

Both fields exist on the product and on each variant. A variant's value replaces the parent product's for that variant. They are read and written with the product endpoints (`GET /api/Products/{productId}`, `POST` and `PUT /api/Products`, `PATCH /api/Products/{productId}`, and the variant endpoints under `/api/Products/{productId}/Variants`). See [Product updates](../api-reference/product-updates.md) for update best practice.

```
PATCH /api/Products/beer-pilsner-033-4pk
Content-Type: application/json

{
  "depositTypeCode": "PANT2",
  "depositQuantity": 4
}
```

To remove the deposit from a product, clear the field with `fieldsToForceNull`:

```json
{
  "depositTypeCode": null,
  "fieldsToForceNull": ["DepositTypeCode"]
}
```

* * *

## Deposit lines on carts and orders

A deposit line is an ordinary order line in `orderForm.lineItems`, placed directly after the product line it belongs to and in the same shipment. Recognise it by `productType` being `ContainerDeposit`, or by the property `ContainerDepositFor`. Its product line is `packageLineItemId`.

| Field | Type | Value on a generated deposit line |
| --- | --- | --- |
| `code` | string | SKU of the deposit article |
| `productType` | string | `ContainerDeposit` |
| `packageLineItemId` | string | `lineItemId` of the product line the deposit was charged for |
| `packageSkuId` | string | SKU of that product line |
| `quantity` | decimal | Product quantity multiplied by the deposit units per item |
| `canceledQuantity` | decimal | Product cancelled quantity multiplied by the deposit units per item |
| `placedPrice` | decimal | The deposit article's price for the order's market |
| `taxRate` | decimal | The rate of the article's tax group or tax rate. In a market where tax is excluded from the cart total, the line is priced excluding tax at rate `0`, unless tax groups are enabled and the article has a tax group, whose rate then applies. |
| `isReadOnly` | bool | `true` |
| `isPriceLocked` | bool | `true` |
| `isExcludedFromPromotions` | bool | `true` |
| `isSkuAccessory` | bool | `true` |
| `updateStock` | bool | `false` |
| `createPurchaseOrder` | bool | `false` |
| `properties` | array | `ContainerDepositFor` (the product line's `lineItemId`), `ContainerDepositType` (the deposit type code), `ContainerDepositUnitsPerItem` (the units per item when the deposit was charged) and `ExcludedFromPromotions` (`True`) |

```json
{
  "orderForm": {
    "lineItems": [
      {
        "lineItemId": "10001-1",
        "code": "BEER-PILS-033-4PK",
        "displayName": "Pilsner 0,33 l, 4-pack",
        "quantity": 2,
        "placedPrice": 119.90,
        "extendedPrice": 239.80,
        "taxRate": 25
      },
      {
        "lineItemId": "10001-2",
        "code": "PANT-NO-2",
        "displayName": "Pant 2 kr",
        "productType": "ContainerDeposit",
        "packageLineItemId": "10001-1",
        "packageSkuId": "BEER-PILS-033-4PK",
        "quantity": 8,
        "canceledQuantity": 0,
        "placedPrice": 2.00,
        "extendedPrice": 16.00,
        "taxRate": 0,
        "isReadOnly": true,
        "isPriceLocked": true,
        "isExcludedFromPromotions": true,
        "isSkuAccessory": true,
        "updateStock": false,
        "createPurchaseOrder": false,
        "properties": [
          { "key": "ContainerDepositFor", "value": "10001-1" },
          { "key": "ContainerDepositType", "value": "PANT2" },
          { "key": "ContainerDepositUnitsPerItem", "value": "4" },
          { "key": "ExcludedFromPromotions", "value": "True" }
        ]
      }
    ]
  }
}
```

### Carts

Every [Cart API](../../Carts/cart-api.md) call that saves or recalculates the cart re-derives the deposit lines: adding a product with a deposit type adds its deposit line, changing the quantity changes the deposit's quantity, and removing the product removes the deposit. Read the deposit lines back from the response; do not add, edit or delete them yourself. The deposit total shown in the Omnium UI is the sum of the lines whose `productType` is `ContainerDeposit`.

### Orders

On an existing order, Omnium adds a deposit line only for a product line that is added to the order now, never for lines the customer already paid for. Deposit lines keep following their product's quantity and cancelled quantity with the units per item recorded in `ContainerDepositUnitsPerItem`, whatever the product's deposit settings are today.

* * *

## Orders received with deposits

When you create an order with `POST /api/Orders` (see the [Order API](../../Order/order-api.md)), the tenant's policy for [orders from external channels](configuration.md#orders-from-external-channels) is applied once the order has been enriched.

Send each deposit as a line of its own, with `code` set to the deposit article's SKU and the quantity and price your channel charged. Omnium recognises the article and tags the line: `productType` becomes `ContainerDeposit`, the line is excluded from promotions, and it gets the article's tax group when it has none. Prices are kept as sent.

To link the deposit to the product it belongs to, so that it follows the product's quantity when the order is edited, is cancelled with it, and is refunded with it when a return is registered in the Omnium UI, also send `packageLineItemId`. Do not set `productType` yourself: a line that already carries the deposit product type is left as sent and is not tagged, so it would miss the promotion exclusion, the deposit type property and the article's tax group.

```json
{
  "lineItemId": "web-2",
  "code": "PANT-NO-2",
  "quantity": 8,
  "placedPrice": 2.00,
  "packageLineItemId": "web-1"
}
```

A deposit line sent without `packageLineItemId` is kept as sent and is never merged with a generated one. It is not added automatically to returns registered in the UI.

Under the **Generate** policy, a linked deposit line is re-derived like a cart line once the order is received: its quantity is set to the product's quantity times the deposit units per item, and it is replaced when its article is not the one the product's deposit type resolves to for the order's market.

Under **Validate and warn** and **Generate**, an order whose deposit-bearing products arrive without the deposit units they call for gets an entry in its `errors` with the key `ContainerDepositMissing`, the message `The order is missing container deposit lines` and the expected and found units per article in its details. See [Order errors](../../Order/order-logging/order-errors.md).

* * *

## Returns

A deposit line is returned like any other line: include its `lineItemId` and the quantity to refund in `returns` of `POST /api/Returns/{orderId}/Return` (see the [Return API](../../Order/Returns/return-api.md)). Omnium does not add deposit lines to returns created through the API, because a return settled by a POS or another system carries exactly the amounts refunded there. Returns registered in the Omnium UI add them automatically.

Refund the deposit in the same proportion as the product: one 4-pack returned means four deposit units. A deposit line never updates stock.

```json
{
  "returns": [
    {
      "lineItemId": "10001-1",
      "returnQuantity": 1,
      "returnType": "StandardReturn",
      "isStockUpdated": true
    },
    {
      "lineItemId": "10001-2",
      "returnQuantity": 4,
      "returnType": "StandardReturn",
      "isStockUpdated": false
    }
  ],
  "storeId": "oslo-sentrum",
  "creditPayment": true
}
```

* * *

## Analytics rows for deposits

The analytics order line search, `POST /api/AnalyticsOrders/Search` and `POST /api/AnalyticsOrders/SearchGrouped`, indexes one row per order line and per return line. A deposit row, charged or refunded, is flagged on the row's `orderLine`:

| Field | Type | Description |
| --- | --- | --- |
| `isContainerDeposit` | bool | `true` for a container deposit row, charged or refunded |
| `depositTypeCode` | string | The code of the deposit type the deposit was charged for |
| `depositForLineItemId` | string | The `lineItemId` of the order line the deposit was charged for. Empty for a deposit line a channel sent without a link to its product. |

A deposit row's `costTotal` equals its `extendedPriceExclTax`, so `profit` and `profitPercent` are `0`: the store pays the same deposit to its supplier as it charges the customer.

The request field `includeContainerDeposits` selects deposit rows:

| Value | Rows returned |
| --- | --- |
| not set (default) | Deposit rows count as the order lines and return lines they are, so `includeOrderLines` and `includeReturns` decide whether they are included. |
| `true` | Deposit rows, charged and refunded, are included whatever `includeOrderLines`, `includeReturns` and `includeShipping` say. Those switches then cover the rows that are not deposits. |
| `false` | Deposit rows are left out. |

Deposit rows can be grouped with `groupBy` set to `DepositTypeCode` or `AnalyticsOrderLineType`.

```
POST /api/AnalyticsOrders/SearchGrouped
Content-Type: application/json

{
  "includeOrderLines": false,
  "includeReturns": false,
  "includeShipping": false,
  "includeContainerDeposits": true,
  "groupBy": "DepositTypeCode"
}
```

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
