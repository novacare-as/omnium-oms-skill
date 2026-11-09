# B2B Pricing and Assortment Control

Source: https://docs.omnium.no/docs/Product/product-assortment/b2b-assortment

> Price based assortment in B2B scenarios

B2B (business-to-business) platforms commonly need to support differentiated pricing — meaning different customers or groups of customers pay different prices for the same products. This is in contrast to B2C (consumer) setups where typically everyone sees the same price.

An important and perhaps non-obvious point: prices aren't just about what something costs — they can also control whether a product is visible or purchasable for a given customer. If a customer or customer group has no price entry for a product, that product can be effectively hidden or blocked from their assortment. This gives you a clean way to tailor the product catalog per customer segment without duplicating the catalog itself.

* * *

## Price Model

Price properties that drives assortment:

| Property | Type | Description |
| --- | --- | --- |
| `customerId` | string | Id for the customer if this is a customer specific price |
| `customerGroup` | string | Id for the customer group if this a customer group specific price |
| `priceType` | string | The price type field allows the usage of special types of prices, such as a blocking price ("B") which can be used in combination with a customer ID. This would block the product from the customer's assortment. |
| `marketId` | string | Market for this price |

## OmniumBusinessCustomer Model

Customer properties that drives assortment:

| Property | Type | Description |
| --- | --- | --- |
| `isAssortmentRestricted` | bool | Set to 'true' if the business customer has a restricted assortment. This is controlled by prices. If the customer has a customer specific price for a product, the product is automatically included in the customer's assortment. If this is set to 'false', a non-customer specific price will be sufficient for the product to be part of the customer's assortment. |
| `customerGroups` | OmniumCustomerGroupReference\[\] | Customer groups that customer belongs to |

## How It Works

If a customer has `IsAssortmentRestricted=true` product assortment is limited to products with customer specific price. If a customer has `IsAssortmentRestricted=false` product assortment will

*   include all products with customer specific price
*   return all products with default price
*   exclude any products with customer specific price with PriceType “b”

### Example Prices

```json
{
  "prices": [
    {
      "unitPrice": 999.00,
      "currencyCode": "NOK",
      "customerGroup" : "123456",
      "marketId": "no",
      "validFrom": "2025-01-01T00:00:00Z",
      "validUntil": null
    },
    {
      "unitPrice": 899.00,
      "currencyCode": "NOK",
      "customerId": "995488745",
      "marketId": "no",
      "validFrom": "2025-01-01T00:00:00Z",
      "validUntil": null
    }
  ]
}
```

## Enabling the Feature

### 1\. Separate price index

Depending on the amount of customers and prices you might want to have prices in a separare index.
