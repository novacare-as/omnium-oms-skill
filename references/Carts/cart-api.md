# API Reference

Source: https://docs.omnium.no/docs/Carts/cart-api

> Complete guide to building shopping cart experiences with the Omnium Cart API. Learn how to create carts, manage line items, apply discounts, and complete checkout in headless e-commerce scenarios.

The Cart API enables you to build complete shopping cart experiences for headless e-commerce, point-of-sale systems, and custom checkout flows. This guide focuses on the most common workflows for integrating with Omnium.

## Overview

A cart in Omnium represents a shopping session that can be converted into an order. Carts support:

*   Line items with automatic price calculation and promotions
*   Multiple shipping methods and split shipments
*   Various payment methods including split payments
*   Customer association and customer-specific pricing
*   Validation before order creation
*   Gift cards and coupon codes

### Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Your App      │         │   Omnium API    │         │   Omnium OMS    │
│   (Frontend)    │◄───────►│   /api/Cart     │◄───────►│   (Backend)     │
└─────────────────┘  REST   └─────────────────┘         └─────────────────┘
        │                           │                           │
        │  1. AddItemToCart         │                           │
        │  2. GetShippingOptions    │  ┌─────────────────────┐  │
        │  3. AddShipments          │  │ Automatic:          │  │
        │  4. AddPayments           │  │ • Price calculation │  │
        │  5. CreateOrderFromCart   │  │ • Promotions        │  │
        │                           │  │ • Tax calculation   │  │
        └───────────────────────────┘  │ • Inventory check   │  │
                                       └─────────────────────┘  │
```

### Base URL

All Cart API endpoints are available at:

```
https://api.omnium.no/api/Cart
```

Full API reference: [Omnium Cart API Documentation](https://api.omnium.no/documentation/index.html#/Carts)

* * *

## Cart model

The cart object contains all information about a shopping session. It inherits from the Order model with additional cart-specific properties.

### Cart properties

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Unique cart identifier (e.g., "C12345") |
| Session | string | Session code for linking to a web session |
| ExpiredDate | DateTime? | When the cart expires and should no longer be shown to the customer |
| IsReadOnly | bool | If true, the cart cannot be modified |
| MarketId | string | Market identifier (affects pricing, currency, shipping options) |
| StoreId | string | Store identifier (affects inventory, pricing) |
| CustomerId | string | Associated customer ID |
| BillingCurrency | string | Currency code (e.g., "NOK", "SEK", "EUR") |
| OrderForm | OrderForm | Contains line items, shipments, payments, and totals |
| Status | string | Cart status (typically "Draft") |

### OrderForm structure

| Property | Type | Description |
| --- | --- | --- |
| LineItems | List<OrderLine> | Products in the cart |
| Shipments | List<Shipment> | Shipping selections |
| Payments | List<Payment> | Payment transactions |
| Discounts | List<Discount> | Applied discounts |
| SubTotal | decimal | Sum of line items before discounts |
| ShippingTotal | decimal | Total shipping cost |
| TaxTotal | decimal | Total tax amount |
| Total | decimal | Final total including tax |
| DiscountTotal | decimal | Total discount amount |

### OrderLine structure

| Property | Type | Description |
| --- | --- | --- |
| LineItemId | string | Unique line item identifier (GUID) |
| Code | string | Product SKU |
| DisplayName | string | Product name |
| Quantity | decimal | Quantity ordered |
| PlacedPrice | decimal | Unit price |
| ExtendedPrice | decimal | Total price (quantity × unit price) |
| LineItemDiscountAmount | decimal | Discount applied to this line |
| IsBundle | bool | True if this is a bundle product |
| Components | List<ProductComponent> | Bundle components (if applicable) |

* * *

## Checkout flow

The typical headless e-commerce checkout follows this flow:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. Create   │───►│  2. Build    │───►│  3. Checkout │───►│  4. Complete │
│     Cart     │    │     Cart     │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │                   │
  AddItemToCart      AddItemToCart       AddShipments       CreateOrder
  (no cartId)        SetQuantity         AddPayments        FromCart
                     DeleteLineItem      AddCustomer
                     AddCouponCode       Validate
```

### Step 1: Create a cart

Create a new cart by adding the first item. When you call `AddItemToCart` without a `cartId`, a new cart is created automatically.

**Endpoint:** `POST /api/Cart/AddItemToCart`

**Parameters:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| skuId | string | Yes | Product SKU identifier |
| quantity | decimal | No | Quantity to add (default: 1) |
| marketId | string | No | Market ID for pricing/currency |
| storeId | string | No | Store ID for inventory |
| customerId | string | No | Customer ID for personalized pricing |

**Example request:**

```
POST /api/Cart/AddItemToCart?skuId=SHOE-BLACK-42&quantity=1&marketId=NOR
```

**Example response:**

```json
{
  "id": "C123456",
  "marketId": "NOR",
  "billingCurrency": "NOK",
  "status": "Draft",
  "orderForm": {
    "lineItems": [
      {
        "lineItemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "code": "SHOE-BLACK-42",
        "displayName": "Running Shoe - Black - Size 42",
        "quantity": 1,
        "placedPrice": 999.00,
        "extendedPrice": 999.00
      }
    ],
    "subTotal": 999.00,
    "shippingTotal": 0,
    "taxTotal": 199.80,
    "total": 999.00
  }
}
```

Save the `id` from the response - you'll need it for all subsequent cart operations.

### Step 2: Build the cart

#### Add more items

**Endpoint:** `POST /api/Cart/AddItemToCart`

```
POST /api/Cart/AddItemToCart?cartId=C123456&skuId=SOCK-WHITE-M&quantity=2
```

#### Add multiple items at once

For better performance when adding multiple items, use `AddItemsToCart`:

**Endpoint:** `POST /api/Cart/AddItemsToCart`

```json
{
  "cartId": "C123456",
  "lineItemRequests": [
    { "skuId": "SHOE-BLACK-42", "quantity": 1 },
    { "skuId": "SOCK-WHITE-M", "quantity": 2 },
    { "skuId": "LACES-BLACK", "quantity": 1 }
  ]
}
```

#### Update quantity

Update the quantity of an existing line item by SKU or line item ID.

**By SKU:** `POST /api/Cart/{cartId}/OrderLines/SetQuantity/Sku/{skuId}/{quantity}`

```
POST /api/Cart/C123456/OrderLines/SetQuantity/Sku/SOCK-WHITE-M/3
```

**By LineItemId:** `POST /api/Cart/{cartId}/OrderLines/SetQuantity/OrderLineId/{orderLineId}/{quantity}`

```
POST /api/Cart/C123456/OrderLines/SetQuantity/OrderLineId/a1b2c3d4-e5f6-7890-abcd-ef1234567890/2
```

Setting quantity to 0 removes the item from the cart. For bundle products, the quantity of all component items is automatically recalculated.

#### Remove item

**Endpoint:** `DELETE /api/Cart/{cartId}/OrderLines/{lineItemId}`

```
DELETE /api/Cart/C123456/OrderLines/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

For bundle products, add `?deleteComponents=true` to remove all component line items as well.

#### Apply coupon code

**Endpoint:** `PUT /api/Cart/{cartId}/AddCouponCode/{couponCode}`

```
PUT /api/Cart/C123456/AddCouponCode/SUMMER20
```

The cart is automatically recalculated with the promotion applied. If the coupon is invalid or expired, a 400 Bad Request is returned.

#### Apply gift card

**Endpoint:** `PUT /api/Cart/{cartId}/AddGiftCard/{giftCardCode}`

```
PUT /api/Cart/C123456/AddGiftCard/GC-ABC123
```

For gift cards with a PIN, add it as a query parameter:

```
PUT /api/Cart/C123456/AddGiftCard/GC-ABC123?giftCardPin=1234
```

### Step 3: Checkout

#### Get shipping options

Fetch available shipping methods for the cart based on the delivery address.

**Endpoint:** `GET /api/Cart/{cartId}/GetShippingOptions`

| Parameter | Type | Description |
| --- | --- | --- |
| postalCode | string | Delivery postal code (for calculating shipping) |

```
GET /api/Cart/C123456/GetShippingOptions?postalCode=0275
```

**Example response:**

```json
[
  {
    "shippingMethodName": "Bring_SERVICEPAKKE",
    "label": "Bring Servicepakke",
    "description": "Delivery to pickup point, 2-4 business days",
    "shippingSubTotal": 79.00
  },
  {
    "shippingMethodName": "Bring_PAKKE_I_POSTKASSEN",
    "label": "Mailbox Parcel",
    "description": "Delivery to your mailbox, 2-3 business days",
    "shippingSubTotal": 49.00
  },
  {
    "shippingMethodName": "ClickAndCollect",
    "label": "Click & Collect",
    "description": "Pick up in store - Free",
    "shippingSubTotal": 0.00
  }
]
```

#### Add shipment

Add the customer's selected shipping method to the cart.

**Endpoint:** `PUT /api/Cart/{cartId}/AddShipments`

**Standard home delivery:**

```json
[
  {
    "shipmentId": "1",
    "shippingMethodName": "Bring_SERVICEPAKKE",
    "warehouseCode": "WebShop"
  }
]
```

**Click and collect (pickup in store):**

```json
[
  {
    "shipmentId": "1",
    "shippingMethodName": "ClickAndCollect",
    "warehouseCode": "WebShop",
    "pickUpWarehouseCode": "STORE-OSLO-01"
  }
]
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| shipmentId | string | Yes | Unique ID for the shipment (can be "1" or a GUID) |
| shippingMethodName | string | Yes | Must match a configured shipping method |
| warehouseCode | string | Yes | Store ID that will fulfill the order |
| pickUpWarehouseCode | string | No | Store ID for pickup (click & collect only) |

#### Get payment options

Fetch available payment methods for the cart.

**Endpoint:** `GET /api/Cart/{cartId}/GetPaymentOptions`

```
GET /api/Cart/C123456/GetPaymentOptions
```

**Example response:**

```json
[
  {
    "paymentMethodName": "Klarna",
    "displayName": "Klarna - Pay later"
  },
  {
    "paymentMethodName": "Vipps",
    "displayName": "Vipps"
  },
  {
    "paymentMethodName": "Card",
    "displayName": "Credit/Debit Card"
  }
]
```

#### Add payment

Register a payment transaction on the cart. This is typically done after the customer completes payment with your payment provider.

**Endpoint:** `PUT /api/Cart/{cartId}/AddPayments`

**E-commerce payment (authorization):**

```json
[
  {
    "amount": 1127.00,
    "paymentMethodName": "Klarna",
    "transactionId": "klarna-order-abc123",
    "transactionType": "Authorization",
    "status": "Processed"
  }
]
```

**POS payment (immediate capture):**

```json
[
  {
    "amount": 1127.00,
    "paymentMethodName": "Card",
    "transactionId": "terminal-tx-12345",
    "transactionType": "Sale",
    "status": "Processed"
  }
]
```

**Split payment (gift card + card):**

```json
[
  {
    "amount": 200.00,
    "paymentMethodName": "GiftCard",
    "transactionId": "GC-ABC123",
    "transactionType": "Authorization",
    "status": "Processed"
  },
  {
    "amount": 927.00,
    "paymentMethodName": "Vipps",
    "transactionId": "vipps-order-xyz",
    "transactionType": "Authorization",
    "status": "Processed"
  }
]
```

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| amount | decimal | Yes | Payment amount in the cart's currency |
| paymentMethodName | string | Yes | Must match a configured payment method |
| transactionId | string | Yes | Payment provider's transaction reference |
| transactionType | string | Yes | "Authorization" (e-commerce) or "Sale" (POS) |
| status | string | Yes | Typically "Processed" |

For e-commerce, use `transactionType: "Authorization"`. Omnium workflows handle capture and credit automatically when the order is fulfilled or returned.

#### Add customer

Associate a customer with the cart. This enables customer-specific pricing and saves the order to the customer's order history.

**Endpoint:** `PUT /api/Cart/{cartId}/AddCustomer/{customerId}`

| Parameter | Type | Description |
| --- | --- | --- |
| enrichCart | bool | Copy customer name and contact info to cart |
| isPriceRecalculated | bool | Recalculate prices based on customer tier |
| customerSpecificPrices | bool | Apply customer-specific contract prices |

```
PUT /api/Cart/C123456/AddCustomer/CUST-001?enrichCart=true&isPriceRecalculated=true
```

#### Validate cart

Before creating an order, validate the cart to catch any issues.

**Endpoint:** `POST /api/Cart/{cartId}/Validate`

```
POST /api/Cart/C123456/Validate
```

By default, validation runs every validator configured for the tenant. To run only specific validators, send their names in the request body:

```json
{
  "validators": ["inventoryValidator", "paymentsValidator"]
}
```

To list the validator names available for the current tenant, call `GET /api/Cart/Validators`:

```json
["inventoryValidator", "paymentsValidator", "activeProductsValidator"]
```

**Success response (200 OK):**

```json
{
  "value": { /* cart object */ },
  "validationErrors": [],
  "validationWarnings": []
}
```

**Validation issues (422 Unprocessable Entity):**

```json
{
  "value": { /* cart object */ },
  "validationErrors": [
    {
      "message": "Product SHOE-BLACK-42 is out of stock",
      "errorCode": "InsufficientInventory",
      "validationType": "Inventory",
      "referenceId": "SHOE-BLACK-42"
    }
  ],
  "validationWarnings": [
    {
      "message": "Customer credit limit exceeded by 500.00",
      "errorCode": "InsufficientCredit",
      "validationType": "Payment"
    }
  ]
}
```

Built-in validators check inventory, active products, payment totals, and more. See [Cart Configuration](cart-config.md#cart-validators) for the full list.

### Step 4: Create order

Convert the cart into an order to trigger fulfillment workflows.

**Endpoint:** `POST /api/Cart/CreateOrderFromCart/{cartId}`

| Parameter | Type | Description |
| --- | --- | --- |
| orderType | string | Order type (e.g., "Online", "ClickAndCollect") |

```
POST /api/Cart/CreateOrderFromCart/C123456?orderType=Online
```

**Example response:**

```json
{
  "id": "ORD-2024-123456",
  "orderNumber": "ORD-2024-123456",
  "status": "New",
  "orderType": "Online",
  "orderForm": {
    "lineItems": [ /* ... */ ],
    "shipments": [ /* ... */ ],
    "payments": [ /* ... */ ],
    "total": 1127.00
  },
  "created": "2024-01-15T14:30:00Z"
}
```

The order is now created and workflow steps (notifications, ERP sync, etc.) will execute based on your order type configuration.

* * *

## Single-call checkout

The `Checkout` endpoint converts a cart to an order in a single request. It can optionally patch the cart first — including attaching payments and shipments — so you can skip separate `PatchCart`, `AddPayments`, and `AddShipments` calls before checkout.

**Endpoint:** `POST /api/Cart/{cartId}/Checkout`

The cart is not persisted by this operation. Patches are applied in memory and consumed by order creation, so if validation fails the stored cart is left unchanged.

### Request body

All fields are optional — send an empty body to check out the cart as-is.

| Property | Type | Description |
| --- | --- | --- |
| `validators` | array | Validator names to run. Omit (or send `null`) to run all configured validators; send an empty array `[]` to skip validation entirely; send specific names to run only those. |
| `orderId` | string | ID for the resulting order. When set, it is used directly as both the order ID and order number. When omitted, Omnium generates the ID. |
| `cartPatch` | object | A cart patch applied before checkout. Same shape as the body of the `PatchCart` endpoint. |

An empty `validators` array (`"validators": []`) is not the same as omitting it: an empty array skips all validation, whereas omitting the field (or sending an empty body) runs every configured validator.

To attach payments or shipments through `cartPatch.orderForm`, set the merge mode that controls how the supplied list combines with the cart's existing entries:

| Merge mode | Behavior |
| --- | --- |
| `UpdateOnly` | Default. Match existing entries by ID; unknown IDs are reported but not added. |
| `AddOrUpdate` | Match existing entries by ID; unknown IDs are appended as new entries. |
| `Replace` | Discard the existing list and use the supplied list wholesale. |

Set `paymentsMergeMode` and `shipmentsMergeMode` on `cartPatch.orderForm`.

### Examples

**Minimal checkout (no body required):**

```
POST /api/Cart/C123456/Checkout
```

**Checkout with a consumer-specified order ID and order type:**

```json
{
  "orderId": "PO-2026-000123",
  "cartPatch": { "orderType": "ClickAndCollect" }
}
```

**Checkout adding a payment and a shipment in the same call:**

```json
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
```

**Checkout running only selected validators:**

```json
{
  "validators": ["inventoryValidator", "paymentsValidator"]
}
```

### Response

On success the endpoint returns the created order together with validation details. When the request included a `cartPatch`, `patchResult` summarizes what the patch changed; otherwise it is `null`.

```json
{
  "isValidatedSuccessful": true,
  "value": {
    "id": "PO-2026-000123",
    "orderNumber": "PO-2026-000123",
    "status": "New",
    "orderForm": { /* ... */ }
  },
  "validationErrors": [],
  "validationWarnings": [],
  "patchResult": null
}
```

| Status | Meaning |
| --- | --- |
| 200 | Checkout succeeded. The result contains the created order and any validation warnings. |
| 400 | Order creation is already in progress for this cart. |
| 404 | Cart does not exist, or a required market could not be resolved. |
| 422 | Validation failed, or the cart patch produced errors. The result contains the details. |
| 500 | Unexpected error during checkout. |

`Checkout` is an alternative to the step-by-step [Create order](cart-api.md#step-4-create-order) flow. Use it when you want to apply final cart changes, run validation, and create the order in one request.

* * *

## Additional endpoints

### Get cart

Retrieve an existing cart by ID.

**Endpoint:** `GET /api/Cart/{cartId}`

```
GET /api/Cart/C123456
```

### Get carts by customer

Retrieve the latest carts for a customer (returns up to 50).

**Endpoint:** `GET /api/Cart/GetCartsByCustomer`

```
GET /api/Cart/GetCartsByCustomer?customerId=CUST-001
```

### Search carts

Search for carts with filters.

**Endpoint:** `POST /api/Cart/Search`

```json
{
  "storeIds": ["WebShop"],
  "customerId": "CUST-001",
  "searchQuery": "black shoe",
  "take": 20,
  "page": 1
}
```

### Save complete cart

Create or update a cart with a complete cart object. Use this when your system already has prices and metadata.

**Endpoint:** `PUT /api/Cart`

```json
{
  "id": "C123456",
  "marketId": "NOR",
  "orderForm": {
    "lineItems": [
      {
        "code": "SHOE-BLACK-42",
        "displayName": "Running Shoe",
        "quantity": 1,
        "placedPrice": 999.00
      }
    ]
  }
}
```

### Recalculate prices

Force recalculation of all prices on the cart (useful after price updates).

**Endpoint:** `PUT /api/Cart/{cartId}/RecalculatePrices`

```
PUT /api/Cart/C123456/RecalculatePrices
```

### Delete cart

Permanently delete a cart.

**Endpoint:** `DELETE /api/Cart/{cartId}`

```
DELETE /api/Cart/C123456
```

Deleted carts cannot be recovered. Use `DeactivateCart` if you want to hide the cart without permanent deletion.

* * *

## Bundle and package products

Omnium supports bundle products (fixed product combinations) and package products (configurable components).

### Add bundle to cart

**Endpoint:** `POST /api/Cart/AddBundleToCart`

```
POST /api/Cart/AddBundleToCart?cartId=C123456&skuId=BUNDLE-STARTER-KIT&quantity=1
```

If the bundle contains products with variants, specify the selected variants in the request body:

```json
[
  {
    "componentId": "821cdfd1-4bf1-48fe-8944-4cc51d62bc66",
    "productId": "tshirt-basic",
    "skuId": "tshirt-basic-M-BLUE",
    "quantity": 1
  }
]
```

### Update bundle components

Update variant selections for a bundle already in the cart.

**Endpoint:** `POST /api/Cart/{cartId}/UpdateComponentsInCart/orderLineId/{orderLineId}`

```json
[
  {
    "componentId": "821cdfd1-4bf1-48fe-8944-4cc51d62bc66",
    "skuId": "tshirt-basic-L-RED",
    "quantity": 1
  }
]
```

* * *

## Product options and customizations

Add product options like engraving or gift wrapping to an existing line item.

**Endpoint:** `POST /api/Cart/AddProductOptionsItemToCart`

```json
{
  "cartId": "C123456",
  "parentLineItemId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "productOptions": [
    {
      "skuId": "ENGRAVING",
      "title": "Engraving",
      "value": "Happy Birthday!",
      "price": 99.00
    },
    {
      "skuId": "GIFT-WRAP",
      "title": "Gift Wrapping"
    }
  ]
}
```

Product options are added as separate line items linked to the parent product.

* * *

## Units of measure (B2B)

For B2B scenarios where products can be sold in different units (each, box, pallet), use the unit-aware endpoints.

### Add item with unit

```
POST /api/Cart/AddItemToCart?cartId=C123456&skuId=BOLT-M8&quantity=5&unitId=BOX-12
```

### Update unit quantity

**Endpoint:** `POST /api/Cart/{cartId}/OrderLines/SetSelectedUnitQuantity/Sku/{skuId}/{selectedUnit}/{selectedUnitQuantity}`

```
POST /api/Cart/C123456/OrderLines/SetSelectedUnitQuantity/Sku/BOLT-M8/BOX-12/5
```

The actual quantity is calculated as: `selectedUnitQuantity × conversionFactor`

* * *

## Error handling

The Cart API uses standard HTTP status codes:

| Status | Meaning |
| --- | --- |
| 200 | Success |
| 201 | Created (new cart) |
| 400 | Bad request (invalid parameters) |
| 404 | Cart or resource not found |
| 422 | Validation errors (cart returned with errors) |
| 500 | Server error |

### Error response format

```json
{
  "message": "Cart not found",
  "isSuccessful": false,
  "httpStatusCode": 404
}
```

### Validation error response

```json
{
  "value": { /* cart object */ },
  "validationErrors": [
    {
      "message": "Insufficient inventory for SHOE-BLACK-42",
      "validationType": "Inventory",
      "referenceId": "SHOE-BLACK-42"
    }
  ],
  "validationWarnings": []
}
```

* * *

## Complete checkout example

Here's a realistic example of a cart service that mirrors the customer journey. Each method represents a separate user action that happens at different times during the shopping session.

```
public class OmniumCartService
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "https://api.omnium.no/api/Cart";

    public OmniumCartService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    /// <summary>
    /// Called when customer adds an item to cart (e.g., clicks "Add to cart" button)
    /// </summary>
    public async Task<OmniumCart> AddItemToCartAsync(
        string? cartId, string skuId, decimal quantity, string marketId)
    {
        var url = string.IsNullOrEmpty(cartId)
            ? $"{BaseUrl}/AddItemToCart?skuId={skuId}&quantity={quantity}&marketId={marketId}"
            : $"{BaseUrl}/AddItemToCart?cartId={cartId}&skuId={skuId}&quantity={quantity}";

        var response = await _httpClient.PostAsync(url, null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumCart>();
    }

    /// <summary>
    /// Called when customer changes quantity in cart
    /// </summary>
    public async Task<OmniumCart> UpdateQuantityAsync(
        string cartId, string skuId, decimal quantity)
    {
        var response = await _httpClient.PostAsync(
            $"{BaseUrl}/{cartId}/OrderLines/SetQuantity/Sku/{skuId}/{quantity}", null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumCart>();
    }

    /// <summary>
    /// Called when customer removes item from cart
    /// </summary>
    public async Task<OmniumCart> RemoveItemAsync(string cartId, string lineItemId)
    {
        var response = await _httpClient.DeleteAsync(
            $"{BaseUrl}/{cartId}/OrderLines/{lineItemId}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumCart>();
    }

    /// <summary>
    /// Called when customer applies a coupon code
    /// </summary>
    public async Task<OmniumCart> ApplyCouponAsync(string cartId, string couponCode)
    {
        var response = await _httpClient.PutAsync(
            $"{BaseUrl}/{cartId}/AddCouponCode/{couponCode}", null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumCart>();
    }

    /// <summary>
    /// Called when customer enters delivery address to show shipping options
    /// </summary>
    public async Task<List<OmniumShippingOption>> GetShippingOptionsAsync(
        string cartId, string postalCode)
    {
        var response = await _httpClient.GetAsync(
            $"{BaseUrl}/{cartId}/GetShippingOptions?postalCode={postalCode}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<List<OmniumShippingOption>>();
    }

    /// <summary>
    /// Called when customer selects a shipping method
    /// </summary>
    public async Task<OmniumCart> SelectShippingAsync(
        string cartId, string shippingMethodName, string warehouseCode)
    {
        var shipments = new[]
        {
            new { shipmentId = "1", shippingMethodName, warehouseCode }
        };
        var response = await _httpClient.PutAsJsonAsync(
            $"{BaseUrl}/{cartId}/AddShipments", shipments);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumCart>();
    }

    /// <summary>
    /// Called when customer logs in or identifies themselves
    /// </summary>
    public async Task<OmniumCart> SetCustomerAsync(
        string cartId, string customerId, bool applyCustomerPrices = true)
    {
        var response = await _httpClient.PutAsync(
            $"{BaseUrl}/{cartId}/AddCustomer/{customerId}?enrichCart=true&isPriceRecalculated={applyCustomerPrices}",
            null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumCart>();
    }

    /// <summary>
    /// Called after customer completes payment with your payment provider
    /// </summary>
    public async Task<OmniumCart> RegisterPaymentAsync(
        string cartId, decimal amount, string paymentMethod, string transactionId)
    {
        var payments = new[]
        {
            new
            {
                amount,
                paymentMethodName = paymentMethod,
                transactionId,
                transactionType = "Authorization",
                status = "Processed"
            }
        };
        var response = await _httpClient.PutAsJsonAsync(
            $"{BaseUrl}/{cartId}/AddPayments", payments);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumCart>();
    }

    /// <summary>
    /// Called before redirecting to payment to check for issues
    /// </summary>
    public async Task<OmniumValidationResult<OmniumCart>> ValidateCartAsync(string cartId)
    {
        var response = await _httpClient.PostAsync($"{BaseUrl}/{cartId}/Validate", null);
        return await response.Content.ReadFromJsonAsync<OmniumValidationResult<OmniumCart>>();
    }

    /// <summary>
    /// Called after successful payment to create the order
    /// </summary>
    public async Task<OmniumOrder> CreateOrderAsync(string cartId, string orderType = "Online")
    {
        var response = await _httpClient.PostAsync(
            $"{BaseUrl}/CreateOrderFromCart/{cartId}?orderType={orderType}", null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<OmniumOrder>();
    }
}
```

**Example: Customer journey through your e-commerce site**

```
var cartService = new OmniumCartService(httpClient);

// Customer browsing products, clicks "Add to cart"
var cart = await cartService.AddItemToCartAsync(
    cartId: null,  // First item creates a new cart
    skuId: "SHOE-BLACK-42",
    quantity: 1,
    marketId: "NOR");

// Store cartId in session/cookie for subsequent requests
var cartId = cart.Id;

// Customer continues shopping, adds another item
cart = await cartService.AddItemToCartAsync(cartId, "SOCK-WHITE-M", 2, "NOR");

// Customer changes quantity
cart = await cartService.UpdateQuantityAsync(cartId, "SOCK-WHITE-M", 3);

// Customer applies coupon code
cart = await cartService.ApplyCouponAsync(cartId, "WELCOME10");

// Customer proceeds to checkout, enters postal code
var shippingOptions = await cartService.GetShippingOptionsAsync(cartId, "0275");

// Customer selects shipping method
cart = await cartService.SelectShippingAsync(cartId, "Bring_SERVICEPAKKE", "WebShop");

// Customer logs in (optional - can also be guest checkout)
cart = await cartService.SetCustomerAsync(cartId, "CUST-001");

// Validate before redirecting to payment provider
var validation = await cartService.ValidateCartAsync(cartId);
if (validation.ValidationErrors?.Any() == true)
{
    // Show errors to customer (e.g., out of stock)
    return;
}

// ... Customer completes payment with Vipps/Klarna/Stripe ...
// Payment provider calls your webhook with transaction details

// Register the completed payment
cart = await cartService.RegisterPaymentAsync(
    cartId,
    amount: cart.OrderForm.Total,
    paymentMethod: "Vipps",
    transactionId: "vipps-order-xyz");

// Create the order - triggers fulfillment workflows
var order = await cartService.CreateOrderAsync(cartId, "Online");

// Redirect customer to order confirmation page
```

Remember to configure authentication headers on the HttpClient. See the [Authentication](../GettingStartedWithAPI/introtoapi.md#authentication) documentation for details.
