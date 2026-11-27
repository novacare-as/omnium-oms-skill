# Order Guide

Source: https://docs.omnium.no/docs/Order/order-api

> Conceptual guide to working with orders in Omnium. Covers the order model, payments, discounts, pricing, order types, and common integration patterns.

## Introduction to Omnium Orders

An order in Omnium could originate from any sales channel and operate and behave in different ways. For instance, it could be an order placed from a web shop, a sale from POS, or a click-and-collect reservation. As a modern order management system, Omnium accepts all types of orders, and offers customizable workflows for all kinds.

In this section you’ll (hopefully) learn everything you need to know to get started importing, managing and reading orders using Omnium’s API.

* * *

## Order properties

When working with the Order API, the same model is used for adding, updating and fetching orders.

### Crucial properties

**ID**
The ID of the order must be unique. If you want Omnium to generate an order number, this is possible using the X API when adding orders. Customer ID: This is usually set to the customer’s phone number, email or ID from an external system. We accept everything, but try avoid 'special characters' such as '+' or '%'.

**MarketId**
The order must have a market ID which corresponds to a market added to Omnium. A market would typically be “Epic Enterprise Norway”, which would contain stores such as “Epic Enterprise Webshop” and “Epic Enterprise Store New York”. Markets are not entities that are added to Omnium, but settings that are configured.

**StoreId**
The order must also have a “StoreId” set which corresponds to a store in Omnium. The StoreId should represent the selling store. Unlike markets, stores are entities that are created or imported to Omnium.

**OrderType**
The OrderType must be set to a corresponding OrderType defined in the Omnium configuration, which will ensure the correct workflow is executed when the order is processed.

**Status**
The order status defines the current state of the order and should also match a status defined for the current OrderType. Typically, this would be set to "New" for orders that has yet been processed (not yet shipped for instance, and/or payment has not been captured).

**Complete model**

The full order model definition can be found in [swagger](https://api.omnium.no/documentation/index.html#/model-OmniumOrder).

## OrderForm and LineItems(Order Lines)

Each order contains an order form. The order form contains lists of order lines, payments and shipments. LineItems is a list of order lines, each order line contains price(s), quantity, product data and various meta data.

### Shipments

The order form contains one or multiple shipments. A shipment contains shipping information and order lines. An order will usually only contain a single shipment, but for partial deliveries or multiple senders or recipients, there will be multiple shipments. A shipment contains one or multiple order lines, and an order line cannot be added to multiple shipments. A shipment must also contain a "warehouseCode". This should be set to the ID of a store in Omnium that is the shipment sender.

### Payments

For every order, there should be a payment corresponding to the total amount of the order. Most commonly, an order will be sent to Omnium after the order has been placed from an e-commerce site. That means that the payment should already be authenticated in the payment provider (such as Klarna, Paypal or Vipps). Omnium will then be able to void, capture or credit the payment later on in the order process.

For an overview of supported payment providers and integration setup, see [Payments](../plugins/Payments.md).

#### Key Concepts

*   **Omnium does not provide a checkout widget.** Your **frontend application** is responsible for integrating directly with the payment provider (using their SDK, redirect, or widget).

*   **Omnium stores and manages payment records.** Once the provider has authorized the transaction, you must attach the payment details to the cart in Omnium.

*   **Omnium executes post-order operations.** After the order is created, Omnium can capture, refund, or void the payment through the configured provider integration.

#### Checkout Flow

The checkout flow typically looks like this:

1.  **Customer completes checkout** in your storefront.
2.  **Frontend initiates payment** with the chosen provider.
3.  **Provider returns transaction details** such as transaction ID, amount, and status.
4.  **Frontend calls Omnium APIs** to build the cart:
    *   `AddPaymentToCart`
    *   `AddShipmentToCart`
    *   `AddCustomer`
    *   `AddStore`
5.  **Cart is placed as an order** in Omnium.
6.  **Omnium can later capture, refund, or void** the payment.

#### Adding a Payment to a Cart

Once the provider confirms the payment, you must register it in Omnium.

**Endpoint**

```
PUT /api/Carts/{cartId}/AddPayments
```

**Example payload**

```json
{
  "amount": 2070,
  "paymentMethodName": "Dintero",
  "paymentType": "Dintero",
  "status": "Processed",
  "transactionId": "T13456746.5zfEvTWmkBBjw6fTYSEE",
  "transactionType": "Authorization"
}
```

#### Payment Properties

| Property | Type | Description | Information |
| --- | --- | --- | --- |
| PaymentMethodName | string | Value to identify correct payment provider ("Klarna" for instance) | Required |
| TransactionId | string | Unique id for this payment (from payment provider) | Required |
| TransactionType | string | "Authorization", "Capture", "Credit", "Invoiced" or "ReleaseRemainingAuthorization" | Required |
| Status | string | "Processed" when successful, and "Failed" on unsuccessful | Required |
| Amount | decimal | The amount for this payment transaction | Required |

#### Multiple Payments

An order can have multiple payment transactions. Common scenarios include:

*   **Gift card + credit card**: Customer pays partially with a gift card and the rest with a credit card
*   **Split payments**: Payment split across multiple methods (e.g., invoice + card)
*   **Bonus points + card**: Customer uses loyalty points for part of the purchase

When an order has multiple payments:

1.  Payments are stored in a list (`orderForm.payments`)
2.  During capture, Omnium processes payments **in the order they appear in the list**
3.  For refunds, Omnium typically credits back to the original payment methods

**Example: Gift Card + Klarna**

```json
{
  "orderForm": {
    "payments": [
      {
        "amount": 100,
        "paymentMethodName": "GiftCard",
        "transactionId": "GC-12345",
        "transactionType": "Authorization",
        "status": "Processed"
      },
      {
        "amount": 899,
        "paymentMethodName": "Klarna",
        "transactionId": "klarna-order-abc123",
        "transactionType": "Authorization",
        "status": "Processed"
      }
    ]
  }
}
```

#### Transaction Types

Understanding transaction types is essential for managing payments correctly.

**Common Transaction Types (for API consumers)**

| Type | Description | When to use |
| --- | --- | --- |
| `Authorization` | Payment is reserved but not yet charged | E-commerce checkout - initial payment |
| `Capture` | Payment has been charged from customer | When order is shipped/fulfilled |
| `Sale` | Immediate capture (no separate authorization) | **POS/in-store orders** where payment is taken immediately |
| `Credit` | Refund back to customer | Returns, cancellations, or partial refunds |
| `Invoiced` | Invoice-based payment | Klarna invoice, Walley invoice, etc. |
| `Void` | Authorization cancelled | When cancelling an order before capture |

**Internal Transaction Types (set by Omnium)**

These are typically set by Omnium internally and not by API consumers:

| Type | Description |
| --- | --- |
| `AwaitingAuthorization` | Used for paylinks and in-store payments waiting for customer to complete payment |
| `ReleaseRemainingAuthorization` | When releasing unused authorization after partial capture |
| `Settlement` / `SettlementFee` / `SettlementRefund` | Provider settlement and reconciliation transactions |
| `Bookkeeping` / `CreditBookkeeping` | Internal accounting transactions |

**POS vs E-commerce**

**POS / In-store orders:**

*   Use `transactionType: "Sale"` - payment is captured immediately at point of sale
*   No separate authorization/capture flow needed

**E-commerce orders:**

*   Use `transactionType: "Authorization"` when registering the payment from checkout
*   Omnium workflows automatically handle `Capture`, `Credit`, and `Void` based on order status changes

**Payment Lifecycle**

```
Customer pays → Authorization → Order shipped → Capture → (Optional) Refund/Credit
```

1.  **Authorization**: Payment provider reserves funds on customer's account
2.  **Capture**: When you ship the order, Omnium captures (charges) the payment
3.  **Credit**: If customer returns items, Omnium can issue a refund

**Important**: Authorizations expire! Most providers allow 7-30 days before the authorization expires. Check `authorizationExpires` field.

#### Payment API Endpoints

**On Cart (before order is created)**

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/Carts/{id}/AddPayments` | PUT | Add or update payments on cart |
| `/api/Carts/{id}/RemovePayments` | PUT | Remove payments from cart |
| `/api/Carts/{id}/GetPaymentOptions` | GET | Get available payment methods for the cart's market |

**On Order (after order is created)**

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/Orders/{id}/AddPayments` | POST | Add new payments to an existing order |
| `/api/Orders/{id}/PutPayments` | PUT | Replace all payments on an order |
| `/api/Orders/{id}/GetPaymentOptions` | GET | Get available payment methods |

**Which Endpoint Should I Use?**

*   **Adding payment during checkout**: Use `PUT /api/Carts/{id}/AddPayments`
*   **Need to update payment after order is created**: Use `POST /api/Orders/{id}/AddPayments`
*   **Need to completely replace payment list**: Use `PUT /api/Orders/{id}/PutPayments`

#### In-Store Payments and Paylinks

Many Omnium payment integrations also support **in-store payments**. This is typically done by generating a **paylink**, which is sent to the customer so they can complete the payment on their own device.

Paylinks are most commonly used for:

*   Payments over the phone
*   Offsite payments where the customer is not physically present

For **web checkouts**, the approach is different:

*   Your website must implement the full checkout flow with the provider.
*   You must also handle the provider's authorization callback before registering the payment in Omnium.

## Discount

Omnium supports a flexible discount system that allows you to apply discounts at different levels (order, line item, shipping) and in different ways (fixed amount, percentage, multi-buy offers, etc.).

### Ways to Add Discounts

There are three main approaches to adding discounts:

| Approach | Where | Use case |
| --- | --- | --- |
| **Simple** | `lineItem.discounted` | Quick, flat discount amount on a single order line |
| **Advanced** | `orderForm.discounts[]` | Order-level or line-item discounts with full control (%, fixed, multi-buy, etc.) |
| **Shipping** | `shipment.discounts[]` | Free shipping or reduced shipping cost |

**Simple Discount:** Set the `discounted` property directly on an order line. This is the easiest way to apply a flat discount to a specific product. The `discounted` value is the total discount amount for that line item.

**Advanced Discount:** Add discount objects to the `orderForm.discounts` array. This gives you full control over:

*   Discount type (order-level vs. line-item)
*   Reward type (percentage, fixed amount, multi-buy, fixed price bundles)
*   Which SKUs the discount applies to
*   Priority and stacking rules

**Shipment-Specific Discount:** Add discount objects to `shipment.discounts`. Typically used for "free shipping" promotions.

### Reward Types

The reward type determines how `discountValue` is interpreted:

| Value | Type | Description | Example |
| --- | --- | --- | --- |
| 0 | None | No reward | \- |
| 1 | Money | Fixed monetary discount | `discountValue: 50` = 50 NOK off |
| 2 | Percentage | Percentage off | `discountValue: 20` = 20% off |
| 3 | Free | Item is free (100% off) | Typically `discountValue: 100` |
| 4 | FixedPrice | Multiple items for a fixed total | "4 items for 99" - use `promotionFixedPriceReward` |
| 5 | Gift | Free gift included | \- |
| 6 | MultiBuys | Buy X get Y free/discounted | "3 for 2" - use `promotionMultiBuyReward` |
| 7 | Kit | Set discount | Buy one from each group A, B, C - get discount on the set |

### Discount Types

The discount type determines what the discount applies to:

| Value | Type | Description |
| --- | --- | --- |
| 0 | None | No specific type |
| 1 | LineItem | Applies to specific order lines (use `skuIds` to specify which) |
| 2 | Order | Applies to the entire order total |
| 3 | Shipping | Applies to shipping cost (add to `shipment.discounts`) |
| 4 | Manual | Manually added discount (from UI) |
| 5 | BonusPoints | Paid with customer club bonus points |

### Priority and Combining Discounts

When multiple discounts exist, use the `priority` field to control the order of application:

*   Lower values are applied first (0 = highest priority, applied first)
*   This is important because earlier discounts affect the base for later percentage calculations

Use `canBeCombinedWithOtherPromotions` to control whether discounts can stack:

*   `true`: This discount can stack with other promotions
*   `false`: This discount may exclude other discounts (depending on configuration)

Use `alwaysApply: true` for discounts that should never be blocked by exclusivity rules.

* * *

### Examples

#### Simple: Discounted Order Line

```
"lineItems": [
  {
    "lineItemId": "1",
    "code": "0123ABC",
    "placedPrice": 200.0,
    "quantity": 1.0,
    "discounted": 20.0,
    "taxRate": 25
  }
]
```

#### Advanced: 20% Order-Level Discount

```
"orderForm": {
  "discounts": [
    {
      "discountType": "Order",
      "discountName": "Splendid discount! 60 percent discount!",
      "discountValue": 60,
      "rewardType": "Percentage"
    }
  ]
}
```

#### Advanced: $10 Order-Level Discount

```
"orderForm": {
  "discounts": [
    {
      "discountType": "Order",
      "discountName": "Ten bucks off!",
      "discountValue": 10,
      "rewardType": "Money"
    }
  ]
}
```

#### Advanced: Fixed Price Order Line Discount

All items involved in the fixed price promotion should be added to the list `skuIds`. The promotion calculator will prioritize items from highest to lowest price.

If the setting `SplitMultibuyPromotionOrderLines` is true, the order lines involved in the promotion will be split to have `quantity = 1` per order line.

```
"orderForm": {
  "discounts": [
    {
      "discountType": "LineItem",
      "discountName": "4 items for 99.90",
      "rewardType": "FixedPrice",
      "skuIds": ["sku-1", "sku-2"],
      "promotionFixedPriceReward": {
        "fixedPriceQuantity": 4,
        "fixedPricePrice": 99.90
      }
    }
  ]
}
```

#### Advanced: 3 for 2 Order Line Discount

All items involved in the multi-buys promotion should be added to the list `skuIds`. By default, the promotion calculator will prioritize items from lowest to highest price. This can be changed with the setting `SortMultibuyItemsDescending`.

```
"orderForm": {
  "discounts": [
    {
      "discountType": "LineItem",
      "discountName": "3 for 2 bikes!",
      "rewardType": "MultiBuys",
      "skuIds": ["sku-1", "sku-2"],
      "promotionMultiBuyReward": {
        "requiredBuyAmount": 2,
        "numberOfDiscountedItems": 1,
        "percentage": 100
      }
    }
  ]
}
```

#### Advanced: Combination of Fixed Price and Percentage Order Line Discounts

Order the discounts from highest priority.

```
"orderForm": {
  "discounts": [
    {
      "discountType": "LineItem",
      "discountName": "4 items for 99.90",
      "rewardType": "FixedPrice",
      "skuIds": ["sku-1", "sku-2"],
      "promotionFixedPriceReward": {
        "fixedPriceQuantity": 4,
        "fixedPricePrice": 99.90
      }
    },
    {
      "discountType": "LineItem",
      "discountName": "Fifty percent discount!",
      "discountValue": 50,
      "rewardType": "Percentage",
      "skuIds": ["sku-1"]
    }
  ]
}
```

#### Shipping Discount

```
"orderForm": {
  "shipments": [
    {
      "discounts": [
        {
          "discountType": "Shipping",
          "discountName": "Free shipping 4 you!",
          "discountValue": 100,
          "rewardType": "Percentage"
        }
      ]
    }
  ]
}
```

## Price properties

The order line consists of multiple price properties. Generally, only the PlacedPrice and TaxRate should be set, in order for the other price properties to be calculated correctly.

**PlacedPrice** The full price per item, without any discounts added. The PlacedPrice should not be multiplied by quantity.

**DiscountedPrice**

_This price is calculated by the order calculator and should not be set manually._

The discounted price is the total price of the order line reduced by the **order line level** discounts applied. Any **order** level discounts are not applied to the discounted price.

The discounted price is calculated with the following formula:

> DiscountedPrice = ( ( Quantity - CanceledQuantity ) \* PlacedPrice ) - ( ( Discounted / Quantity ) \* ( Quantity - CanceledQuantity ) )

**ExtendedPrice**

_This price is calculated by the order calculator and should not be set manually._

The extended price is the total line item price with all discounts applied, **including** both order line level and order level discounts.

The extended price is calculated with the following formula:

> ExtendedPrice = DiscountedPrice - ( ( DiscountedPrice / ( \[ Sum of DiscountedPrice for all order lines \] ) \* DiscountAmount )

**SuggestedRetailPrice**

_This price is **not** used in any calculations, and will not be changed by Omnium._

The placed price could be a customer-specific price based on price agreements (e.g., 10% off suggested retail price). In these scenarios, the placed price would already contain a discount, and the suggested retail price could be used to indicate savings for the end customer by comparing suggested retail price to the discounted price.

The price could also be used for reports or statistics by third-party applications.

**Price Example** This is an example of how the prices would look after calculation when a 10% order discount is added to the order. The case is that the customer bought two products with an original price of $500, but with a 10% discount. So, the customer paid 2 x (500 - 10%) = 900.

```json
{
    "lineItemId": "1",
    "quantity": 2,
    "placedPrice": 500,
    "placedPriceExclTax": 400,     // Calculated
    "discountedPrice": 1000,       // Calculated
    "discountedPriceExclTax": 800, // Calculated
    "discounted": 0,               // Discount was added as an order discount, not as a "basic" order line discount.
    "discountedExclTax": 0,
    "orderDiscountAmount": 100,    // Calculated
    "extendedPrice": 900,          // Calculated
    "extendedPriceExclTax": 720,   // Calculated
    "taxTotal": 180,               // Calculated
    "taxRate": 25,                 // Calculated
    ...
}
```

## Order types

The order type is used for triggering different workflows. A point of sale order can have a different process than an online order.

The order type string is a free text string, but orders in Omnium should have a [corresponding order type in the settings](https://docs.omnium.no/configuration?id=order-types) in order for workflows to run correctly.

Omnium has five predefined order types, commonly used:

| Order type | Description |
| --- | --- |
| Pos | Order from Point of Sale system |
| Online | Order from B2B / B2C web portals |
| ClickAndCollect | Click and collect orders (Not paid) |
| Bopis | Buy online, pick up in store (Paid) |
| PreOrder | Orders placed for products that are not yet released |

## Adding orders

An order can be added to Omnium in numerous ways. It can be:

*   Imported via API
*   Created from a cart via API
*   Created from a cart via Omnium's UI
*   Created from Omnium's UI
*   Imported from Excel via Omnium's UI

### Example: Creating an order

In order to meet multiple demands and be as flexible as Omnium is, Omnium’s order model is rather large and contains many fields. Most likely, you’ll not be in need of all of them. Below is a basic example of how to add an order, using the [POST ​/api​/Orders](https://api.omnium.no/documentation/index.html#/Orders/post_api_Order) API.

```json
{
	"id": "EPIC000001",
	"customerId": "4793246662",
	"billingCurrency": "NOK",
	"customerName": "Ola Nordmann",
	"marketId": "epic_market_no",
	"storeId": "epic_webshop_no",
	"customerPhone": "4793246662",
	"customerEmail": "ola.nordmann@example.com",
	"status": "New",
	"billingAddress": {
		"daytimePhoneNumber": "4793246662",
		"name": "Ola Nordmann",
		"line1": "Lille Grensen 3",
		"city": "Oslo",
		"countryCode": "NO",
		"countryName": "Norge",
		"postalCode": "1415",
		"email": "ola.nordmann@example.com"
	},
	"orderForm": {
		"payments": [
			{
				"amount": 49.5,
				"paymentMethodName": "Klarna",
				"status": "Processed",
				"transactionId": "123456789",
				"transactionType": "Authorization"
			}
		],
		"shipments": [
			{
				"shipmentId": "1",
				"shippingMethodName": "PostNord",
				"warehouseCode": "epic_company_main_warehouse",
				"lineItems": [
					{
						"lineItemId": "1",
						"code": "0123ABC",
						"placedPrice": 99.0,
						"quantity": 1.0,
						"taxRate": 25
					}
				],
				"address": {
					"name": "Ola Nordmann",
					"line1": "Lille Grensen 3",
					"city": "Oslo",
					"countryName": "Norge",
					"countryCode": "NO",
					"postalCode": "0159",
					"email": "ola.nordmann@example.com"
				}
			}
		],
		"lineItems": [
			{
				"lineItemId": "1",
				"code": "0123ABC",
				"placedPrice": 99.0,
				"quantity": 1.0,
				"taxRate": 25
			}
		],
		"discounts": [
			{
				"discountType": "Order",
				"discountName": "Fifty percent discount!",
				"discountValue": 50,
				"rewardType": "Percentage"
			}
		]
	},
	"orderType": "Online"
}
```

[Relevant swagger documentation](https://api.omnium.no/documentation/index.html#/Orders/post_api_Orders)

## Fetching orders

There are multiple endpoints that could be used to retrieve an order, as there are various ways of searching for an order. This could be faceted free-text searching, filtered search by customer metadata or product data, or simply fetching a single order using the order ID.

### Get a single order

### Standard Online order

This is the data from the order created in the order creation example.

```json
{
	"id": "ORDR000001",
	"orderNumber": "ORDR000001", // Enriched from ID
	"customerId": "4793246662",
	"customerNumber": "4793246662", // Enriched from customerId
	"billingCurrency": "NOK",
	"customerName": "Ola Nordmann",
	"customerPhone": "4793246662",
	"customerEmail": "ola.nordmann@example.com",
	"customerType": "B2C", // Enriched from market configuration
	"marketId": "NOR",
	"billingAddress": {
		"name": "Ola Nordmann",
		"line1": "Lille Grensen 3",
		"city": "Oslo",
		"countryCode": "NO",
		"countryName": "Norge",
		"postalCode": "1415",
		"daytimePhoneNumber": "4793246662",
		"eveningPhoneNumber": "",
		"email": "ola.nordmann@example.com"
	},
	"orderForm": {
		"shipments": [
			{
				"shipmentId": "1",
				"shippingMethodName": "PostNord",
				"shippingLabel": "PostNord", // Enriched from shipping provider
				"shippingTax": 0,
				"shippingDiscountAmount": 0,
				"shippingSubTotal": 0,
				"shippingTotal": 0,
				"shippingSubTotalExclTax": 0,
				"status": "AwaitingInventory", // Default status
				"orderStatus": "New", // Default status
				"subTotal": 49.5,
				"total": 49.5,
				"taxTotal": 9.9,
				"warehouseCode": "epic_company_main_warehouse",
				"lineItems": [
					{
						"lineItemId": "1",
						"code": "0123ABC",
						"displayName": "Omnium Super Stylish sweater /w logo", // Enriched from product
						"alternativeProductName": "Logo sweater", // Enriched from product
						"placedPrice": 99,
						"placedPriceExclTax": 79.2,
						"extendedPrice": 49.5, // Calculated total line amount
						"extendedPriceExclTax": 39.6,
						"discountedPrice": 99, // Calculated discounted amount, excluding order level discount
						"discountedPriceExclTax": 79.2,
						"suggestedRetailPrice": 0, // Optional values, used by 3rd party systems and reporting
						"suggestedRetailPriceExclTax": 0,
						"orderDiscountAmount": 49.5, // The order level discount amount
						"quantity": 1,
						"unit": "pcs", // Enriched from product
						"returnQuantity": 0,
						"canceledQuantity": 0,
						"deliveredQuantity": 0,
						"isGift": false,
						"isReadOnly": false, // Read only is only used in the Omnium UI
						"cost": 19, // the product/provide cost of the order line, per unit. Enriched from product
						"costTotal": 19,
						"discounted": 0, // The order line level discount
						"discountedExclTax": 0,
						"taxTotal": 9.9, // Calculated tax rate
						"taxRate": 25,
						"size": "M", // Enriched from product
						"color": "Black", // Enriched from product
						"brand": "Omnium Sweaters 'n Jeans", // Enriched from product
						"productId": "ABC-123_no", // Enriched from product
						"webSiteProductUrl": "https://www.yourshop.com/product/0123abc", // Enriched from product
						"updateStock": false,
						"isPackage": false
					}
				],
				"address": {
					"name": "Ola Nordmann",
					"line1": "Lille Grensen 3",
					"city": "Oslo",
					"countryCode": "NO",
					"countryName": "Norge",
					"postalCode": "0159",
					"daytimePhoneNumber": "",
					"eveningPhoneNumber": "",
					"email": "ola.nordmann@example.com"
				},
				"transit": false,
				"expectedDeliveryDate": "0001-01-01T00:00:00"
			}
		],
		"lineItems": [
			{
				"lineItemId": "1",
				"code": "0123ABC",
				"displayName": "Omnium Super Stylish sweater /w logo", // Enriched from product
				"alternativeProductName": "Logo sweater", // Enriched from product
				"placedPrice": 99,
				"placedPriceExclTax": 79.2,
				"extendedPrice": 49.5, // Calculated total line amount
				"extendedPriceExclTax": 39.6,
				"discountedPrice": 99, // Calculated discounted amount, excluding order level discount
				"discountedPriceExclTax": 79.2,
				"suggestedRetailPrice": 0, // Optional values, used by 3rd party systems and reporting
				"suggestedRetailPriceExclTax": 0,
				"orderDiscountAmount": 49.5, // The order level discount amount
				"quantity": 1,
				"unit": "pcs", // Enriched from product
				"returnQuantity": 0,
				"canceledQuantity": 0,
				"deliveredQuantity": 0,
				"isGift": false,
				"isReadOnly": false, // Read only is only used in the Omnium UI
				"cost": 19, // the product/provide cost of the order line, per unit. Enriched from product
				"costTotal": 19,
				"discounted": 0, // The order line level discount
				"discountedExclTax": 0,
				"taxTotal": 9.9, // Calculated tax rate
				"taxRate": 25,
				"size": "M", // Enriched from product
				"color": "Black", // Enriched from product
				"brand": "Omnium Sweaters 'n Jeans", // Enriched from product
				"productId": "ABC-123_no", // Enriched from product
				"webSiteProductUrl": "https://www.yourshop.com/product/0123abc", // Enriched from product
				"updateStock": false,
				"isPackage": false
			}
		],
		"discounts": [
			{
				"discountType": "Order",
				"discountAmount": 49.5,
				"discountName": "Fifty percent discount!",
				"discountValue": 50,
				"discountSource": "Manual", // Manual or Campaign
				"rewardType": "Percentage"
			}
		],
		"payments": [
			{
				"amount": 49.5,
				"paymentId": 0,
				"paymentMethodId": "00000000-0000-0000-0000-000000000000",
				"paymentMethodName": "Klarna",
				"status": "Processed",
				"transactionId": "123456789",
				"transactionType": "Authorization",
				"created": "2022-12-04T07:28:50.1521376Z",
				"isManuallyAdded": false
			}
		],
		"shippingDiscountTotal": 0,
		"shippingSubTotal": 0,
		"shippingSubTotalExclTax": 0,
		"shippingTotal": 0,
		"handlingTotal": 0,
		"orderLevelTax": 0,
		"taxTotal": 9.9,
		"discountAmount": 49.5,
		"subTotal": 49.5,
		"subTotalExclTax": 39.6,
		"total": 49.5,
		"totalExclTax": 39.6,
		"authorizedPaymentTotal": 0,
		"capturedPaymentTotal": 0,
		"fullRefund": false
	},
	"shippingDiscountTotal": 0,
	"shippingSubTotal": 0,
	"status": "New",
	"remainingPayment": 0,
	"modified": "2022-12-04T07:28:50.152347Z",
	"created": "2022-12-04T07:28:50.1523193Z",
	"orderType": "Online",
	"storeId": "epic_webshop_no",
	"lineItemsCost": 0,
	"netTotal": 49.5, // Calculated order form total minus return order form totals
	"netTotalExclTax": 39.6,
	"isReadOnly": false,
	"isNotificationsDisabled": false
}
```

### Updating orders

There are multiple ways an order could be update, and multipe reasons to update an order. Sometimes, you would only like to update data on an order, without triggering any other logic. For this, the patch endpoint would typically be a good fit.

### Triggering workflows

An order update often involves a status update which should trigger a workflow in Omnium. A workflow contains workflow steps which triggeres actions configured for the current status. Examples of this could be to capture payment, send email/sms, book shipping, or reduce inventory. Workflows are an essencial part of how Omnium works. [More information](order-config.md#order-statuses)

There are endpoints specifically created for the purpose of updating order status and the workflow connected to the status: [More information](https://api.omnium.no/documentation/index.html#/Orders%20%7C%20Workflow)

Order/order-config#workflow-steps

### Get Order by Secret Key

The secret key endpoint allows you to retrieve orders using a secure, randomly generated key without requiring authentication. This is useful for guest order tracking, customer support links, and email notifications.

**Endpoint**

```
GET /api/orders/secret/{secretKey}
```

**Parameters**

| Parameter | Type | Location | Required | Description |
| --- | --- | --- | --- | --- |
| `secretKey` | string | path | Yes | The secret key associated with the order |

**Response**

Returns a complete `OmniumOrder` object if a matching order is found, or `404 Not Found` if no order matches the secret key or the caller doesn't have access.

**Example Request**

```
GET /api/orders/secret/aB3xR9mK2pQw7Vn5
```

**Example Response**

```json
{
  "id": "ORDR000123",
  "orderNumber": "ORDR000123",
  "secretKey": "aB3xR9mK2pQw7Vn5",
  "customerId": "customer@example.com",
  "customerName": "John Doe",
  "status": "InProgress",
  "total": 299.99,
  "orderForm": {
    // ... full order details
  }
}
```

**Security Considerations**

*   **No authentication required**: The secret key itself acts as the authorization mechanism
*   **Cryptographically secure**: Keys are generated using .NET's `RandomNumberGenerator` for unpredictability
*   **URL safety**: Default character set uses only alphanumeric characters (A-Z, a-z, 0-9)
*   **Key length**: Default 16 characters provides adequate security for most use cases
*   **Access control**: Standard tenant isolation and access rules still apply

**Use Cases**

1.  **Order tracking emails**

    ```
    Track your order: https://yoursite.com/track?key={ORDER_SECRET_KEY}
    ```

2.  **Guest checkout** Allow customers to view their order without creating an account

3.  **Customer service** Provide support agents with secure links to specific orders

4.  **SMS notifications** Send short tracking links via text message

**Generating Secret Keys**

Secret keys are typically generated automatically using the [Generate Secret Key](workflow-steps/enrichment/generate-secret-key.md) workflow step. You can configure:

*   **Key length** (default: 16, max: 64 characters)
*   **Character set** (default: alphanumeric)
*   **Overwrite behavior** (whether to regenerate existing keys)

Add the workflow step to your order creation process:

```json
{
  "ActionType": "GenerateSecretKey",
  "Properties": [
    { "Key": "KeyLength", "Value": "24" },
    { "Key": "OverwriteExisting", "Value": "false" }
  ]
}
```

**Using in Notifications**

Reference the secret key in email templates using the replacement token:

```json
{ORDER_SECRET_KEY}
```

This will be replaced with the actual secret key when the notification is sent.

**Related Documentation**

*   [Generate Secret Key Workflow Step](workflow-steps/enrichment/generate-secret-key.md) - Detailed configuration
*   [Notification Templates](workflow-steps/notifications/notification.md) - Using replacement tokens

### Errors

The orders contain a list of errors in the property _Errors_. This is a list of OmniumEntityError, a class designed to capture detailed information about errors related to order processing. To add error messages to an order, simply add new items to this list.

```json
{
	"id": "123",
	"orderNumber": "123",
	"errors": [
		{
			"Key": "Provider1Key",
			"Message": "This is a critical error.",
			"Details": "Detailed information about the error.",
			"Severity": "Error",
			"Occurred": "2022-10-16T12:34:56.789Z"
		},
		{
			"Key": "Provider2Key",
			"Message": "This is a warning.",
			"Details": "Additional details for the warning.",
			"Severity": "Warning",
			"Occurred": "2022-10-16T12:34:56.789Z"
		}
	]
}
```

## Validate Order

Webhook validation for orders can be enabled from order settings in configuration. The validator will be run on all updates to the order from the UI. It’s possible to add custom validation using the webhook validator. The webhook validator will post the [order](https://api.omnium.no/documentation/index.html#/model-OmniumOrder) to a provided endpoint, and accept the validated order as response.

Add the webhook validator to Connectors in settings:

Required properties

| Property | Sample value | Description |
| --- | --- | --- |
| Name | webhookOrderValidator | Name of Omnium connector provider. In this case it must be "webhookOrderValidator" |
| Host | [https://acme.com](https://acme.com) | Endpoint host |
| Implementations | "IWebhookOrderValidator" | Connector capabilities. Must include IWebhookOrderValidator. |

#### Sample configuration

```json
{
	"connectors": [
		{
			"name": "webhookOrderValidator",
			"host": "https://acme.com/api/ValidatorEndpoint",
			"isAuthenticatedManually": false,
			"timeOut": "00:00:00",
			"implementations": ["IWebhookOrderValidator"],
			"disableStandardErrorPolicy": false
		}
	]
}
```
