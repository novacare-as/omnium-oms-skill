# Omnichannel e-com

Source: https://docs.omnium.no/docs/GettingStartedWithAPI/Tutorials/omnichannel-ecom

> This guide shows how to set up a basic e-commerce store in Omnium, including markets, products, inventory, and a simple checkout flow.

## Prerequisites

Before starting, ensure you have:

*   **Access to Omnium**: You need an active Omnium account with appropriate permissions
*   **API Credentials**: You'll need a `ClientId` and `ClientSecret` for API authentication

If you don't have access yet, follow our [Get Access guide](../introtoapi.md) to request access and obtain your API credentials.

* * *

## 1\. Setup Markets

Markets define the geographical or business segments where you operate. They're essential for organizing your stores, pricing, and inventory.

### Create a Market

Use the Omnium GUI or API to create your first market:

**Via API:**

```
PUT /api/Markets/Update

{
  "marketId": "nor",
  "marketName": "Norway",
  "description": "Norwegian market",
  "currency": "NOK",
  "languageCode": "no",
  "productContentLanguage": "no",
  "countryCode": "NO",
  "isActive": true,
  "isDefaultMarket": true
}
```

**Via GUI:**

1.  Navigate to **Configuration > Markets**
2.  Click **"Add Market"**
3.  Fill in market details
4.  Save the market

* * *

## 2\. Add Stores

Stores represent your sales channels within a market. Let's create a complete omnichannel setup using the AddMany endpoint for best practices.

This example creates three store types:

*   **Online Store** (`oslo-online`): Your e-commerce website/app where customers place online orders
*   **Physical Store** (`oslo-downtown`): Retail location that can also serve as local warehouse for Click & Collect
*   **Central Warehouse** (`oslo-warehouse`): Main distribution center

**Via API:**

```
POST /api/Stores/AddMany

[
  {
    "id": "oslo-online",
    "name": "Oslo Clothes",
    "description": "Premium Norwegian fashion online store",
    "availableOnMarkets": ["nor"],
    "availableWarehouses": [
      {
        "warehouseCode": "oslo-downtown",
        "priority": 1
      },
      {
        "warehouseCode": "oslo-warehouse",
        "priority": 2
      }
    ]
  },
  {
    "id": "oslo-downtown",
    "name": "Oslo Clothes Downtown",
    "description": "Flagship store in downtown Oslo",
    "availableOnMarkets": ["nor"],
    "isWarehouse": true,
    "address": {
      "street": "Universitetsgate 22",
      "postalCode": "0162",
      "city": "Oslo",
      "country": "Norway"
    }
  },
  {
    "id": "oslo-warehouse",
    "name": "Oslo Clothes Central Warehouse",
    "description": "Main distribution center",
    "availableOnMarkets": ["nor"],
    "isWarehouse": true,
    "isPrimaryWarehouse": true
  }
]
```

**Key Properties Explained:**

*   `isWarehouse: true` - Allows the store to hold and fulfill inventory
*   `isPrimaryWarehouse: true` - Designates this as the main fulfillment source for the market(s), typically for a central warehouse
*   `availableWarehouses` - References which warehouses can fulfill orders for this store

This setup gives you a simple omnichannel setup with online sales, physical retail presence, and centralized inventory management.

### Search for Stores

**(Super simple) Search for warehouses (store with isWarehouse=true) for market "nor":**

```
POST /api/Stores/SearchStores

{
  "marketIds": ["nor"],
  "isWarehouse" : true
}
```

**Response structure (OmniumResult):**

```json
{
  "result": [
    {
      "id": "oslo-online",
      "name": "Oslo Clothes",
      "availableOnMarkets": ["nor"]
    }
  ],
  "totalHits": 1
}
```

**Note**: Store search returns an `OmniumResult` wrapper containing:

*   `result`: Array of matching stores
*   `totalHits`: Total number of matches

* * *

## 3\. Add Products

Products are the core of your e-commerce store. First, let's create product categories, then add products with variants.

### Create Product Categories

Before adding products, set up your category structure using the AddMany endpoint:

```
POST /api/ProductCategories/AddMany

[
  {
    "categoryId": "clothing",
    "name": "Clothing",
    "description": "Apparel and textiles",
    "language": "no",
    "id": "clothing_no",
    "isActive": true
  },
  {
    "categoryId": "mens-clothing",
    "name": "Men's Clothing",
    "description": "Clothing for dudes",
    "language": "no",
    "id": "mens-clothing_no",
    "parentId": "clothing",
    "isActive": true
  },
  {
    "categoryId": "tees",
    "name": "T-Shirts",
    "description": "T-shirts",
    "language": "no",
    "id": "tees_no",
    "parentId": "mens-clothing",
    "isActive": true
  }
]
```

### Create a Product with Variants

An example for a yellow t-shirt in multiple sizes:

```
POST /api/products

{
  "id": "yellow-tshirt_no",
  "productId": "yellow-tshirt",
  "marketId": "nor",
  "marketIds": ["nor"],
  "name": "Yellow T-Shirt",
  "description": "High-quality cotton t-shirt available in multiple sizes",
  "language": "no",
  "isActive": true,
  "color": "Yellow",
  "categories": [
    {
      "categoryId": "tees"
    }
  ],
  "prices": [
    {
      "marketId": "nor",
      "unitPrice": 299.00,
      "currency": "NOK"
    }
  ],
  "variants": [
    {
      "skuId": "yellow-tshirt-small",
      "name": "Yellow T-Shirt - Small",
      "size": "S"
    },
    {
      "skuId": "yellow-tshirt-medium",
      "name": "Yellow T-Shirt - Medium",
      "size": "M"
    },
    {
      "skuId": "yellow-tshirt-large",
      "name": "Yellow T-Shirt - Large",
      "size": "L"
    }
  ],
  "properties": [
    {
      "key": "material",
      "value": "100% Cotton"
    },
    {
      "key": "care",
      "value": "Machine washable"
    }
  ]
}
```

**Note**:

*   When variants have the same price, set the price at product level (best practice)
*   Product language is set to "no" for Norwegian
*   Only product IDs and category IDs have language suffixes ("\_no"), not SKUs, productId or categoryId

### Product Model

Important: To understand all available product fields and their properties, see our [Product Model documentation](../../Product.md). Familiarize yourself with the complete product structure to make the most of Omnium's product capabilities.

* * *

## 4\. Add Inventory

Omnium can act as the source of truth for inventory levels, or receive updates from external systems such as ERP or WMS. The recommended way to update inventory in Omnium is through the UpdateMany endpoint. Even when another system is the master for stock levels, Omnium typically manages reserved inventory as part of the order workflows.

### Set Initial Stock Levels

**Via API (UpdateMany endpoint - recommended):**

```
PUT /api/Inventory/UpdateMany

[
  {
    "sku": "yellow-tshirt-small",
    "warehouseCode": "oslo-warehouse",
    "inventory": 25
  },
  {
    "sku": "yellow-tshirt-medium",
    "warehouseCode": "oslo-warehouse",
    "inventory": 30
  },
  {
    "sku": "yellow-tshirt-large",
    "warehouseCode": "oslo-warehouse",
    "inventory": 40
  },
  {
    "sku": "yellow-tshirt-small",
    "warehouseCode": "oslo-downtown",
    "inventory": 10
  },
  {
    "sku": "yellow-tshirt-medium",
    "warehouseCode": "oslo-downtown",
    "inventory": 15
  },
  {
    "sku": "yellow-tshirt-large",
    "warehouseCode": "oslo-downtown",
    "inventory": 12
  }
]
```

This example shows inventory typically distributed across multiple locations:

*   **Central Warehouse** (`oslo-warehouse`): Higher quantities for main distribution
*   **Physical Store** (`oslo-downtown`): Smaller quantities for walk-in customers and Click & Collect

**Key Benefits of UpdateMany:**

*   Efficiently handles up to 1000 items per batch
*   Only updates items that have actual changes
*   Automatically inserts new inventory items or updates existing ones
*   **Enriches existing inventory items** - preserves `reservedInventory` and other existing data
*   Optimal performance for bulk inventory operations

* * *

## 5\. Query Products

Implement product search and retrieval for your e-commerce frontend.

### Search Products

#### Example 1: Free Text Search with Facets

**General product search with facets for filtering:**

```
POST /api/products/SearchProducts

{
  "searchText": "yellow t-shirt",
  "marketId": "nor",
  "take": 50,
  "includedFields": {
    "specificFields": ["assets", "name", "prices", "color"]
  }
}
```

This example searches for products containing "yellow t-shirt" and returns facets that can be used for filtering (categories, brands, sizes, etc.).

#### Example 2: Single Product Lookup

**Fetch specific product with contextual pricing:**

```
POST /api/products/SearchProducts

{
  "productIds": ["yellow-tshirt"],
  "marketId": "nor",
  "isFacetsDisabled": true
}
```

**Important**: SearchProducts automatically sets the correct pricing context based on your input parameters. When you specify `marketId`, you get market-specific pricing. If you also specify `customerId` or `customerGroup`, the API returns the correct price for that customer context (including any special pricing, discounts, or customer group rates).

**Key Search Parameters:**

*   **marketId**: Required for contextual pricing and market-specific results
*   **includedFields**: Use `includedFields.specificFields` to specify exactly which fields to return for better performance. Can be left out if you want to get the entire model back
*   **isFacetsDisabled**: For best possible performance, always set to `true` unless you actually need to return facets to display to your end customers
*   **take**: Number of results to return (replaces limit/offset pattern)

### SearchProducts Response Example

```json
{
  "result": [
    {
      "id": "yellow-tshirt_no",
      "name": "Yellow T-Shirt",
      "color": "Yellow",
      "assets": [
        {
          "url": "https://cdn.example.com/yellow-tshirt.jpg",
          "type": "image"
        }
      ],
      "prices": [
        {
          "marketId": "nor",
          "unitPrice": 299.00,
          "currency": "NOK"
        }
      ]
    }
  ],
  "facets": [
    {
      "name": "category",
      "values": [
        {
          "value": "Clothing",
          "count": 15
        },
        {
          "value": "Accessories",
          "count": 8
        }
      ]
    },
    {
      "name": "material",
      "values": [
        {
          "value": "Cotton",
          "count": 12
        },
        {
          "value": "Polyester",
          "count": 6
        }
      ]
    }
  ],
  "totalHits": 23
}
```

## 6\. Update Products

Keep your product data up-to-date with pricing, descriptions, and availability changes.

**Using PatchMany endpoint (recommended for product updates):**

```
PATCH /api/Products/PatchMany

[
  {
    "id": "yellow-tshirt_no",
    "description": "Updated high-quality cotton t-shirt with improved fabric blend"
  }
]
```

**Key Benefits of PatchMany:**

*   Only updates fields that have actual changes
*   Handles up to 1000 products per batch
*   Optimal performance - skips unnecessary updates
*   Preserves existing product data

## 7\. Price Updates

While prices can be updated via PatchMany, in many cases prices come from separate systems or different entities. For price management, we recommend using the dedicated pricing endpoint:

```
PUT /api/Prices/AddMany

[
  {
    "productId": "yellow-tshirt",
    "prices": [
      {
        "marketId": "nor",
        "unitPrice": 349.00,
        "currencyCode": "NOK",
        "validFrom": "2024-01-01T00:00:00Z"
      }
    ]
  }
]
```

**Benefits of dedicated price updates:**

*   Automatically checks for actual price changes to avoid unnecessary updates
*   Optimized for high-frequency price updates from external systems

* * *

## 8\. Cart Operations (Checkout)

Implement a complete shopping cart and checkout experience using Omnium's cart API workflow.

### Create a Cart by Adding First Item

**Create cart by adding an item (recommended approach):**

```
POST /api/Cart/AddItemToCart?skuId=yellow-tshirt-small&quantity=2&marketId=nor
```

This creates a new cart and adds the first item in one request. The response contains the new cart with a unique `cartId` for future operations.

### Add More Items to Cart

**Add additional items to existing cart:**

```
POST /api/Cart/AddItemToCart?cartId=C12345&skuId=yellow-tshirt-medium&quantity=1&marketId=nor
```

### Update Cart Items

**Change item quantity by SKU:**

```
POST /api/Cart/C12345/OrderLines/SetQuantity/Sku/yellow-tshirt-small/3
```

**Change quantity by OrderLine ID:**

```
POST /api/Cart/C12345/OrderLines/SetQuantity/OrderLineId/line_123/2
```

### Get Cart Details

**Retrieve current cart:**

```
GET /api/Cart/C12345
```

### Apply Gift Cards and Coupons

**Add Gift Card:**

```
PUT /api/Cart/C12345/AddGiftCard/ABC123
```

**Add Coupon Code:**

```
PUT /api/Cart/C12345/AddCouponCode/SUMMER2024
```

### Get Shipping and Payment Options

**Get available shipping options:**

```
GET /api/Cart/C12345/GetShippingOptions?postalCode=10001
```

**Get available payment methods:**

```
GET /api/Cart/C12345/GetPaymentOptions
```

### Add Shipment to Cart

**Add shipping method:**

```
PUT /api/Cart/C12345/AddShipments

[
  {
    "shipmentId": "1",
    "shippingMethodName": "Standard_Shipping",
    "warehouseCode": "oslo-warehouse"
  }
]
```

**Note**:

*   The `StoreId` on the order level identifies where the order is sold from, and `warehouseCode` on the shipment(s) identifies where the order will be sent from

### Add Payment to Cart

**Add payment method:**

```
PUT /api/Cart/C12345/AddPayments

[
  {
    "paymentId": "1",
    "paymentMethodName": "SomePaymentProvider",
    "amount": 598
  }
]
```

**Note**:

*   Omnium supports many integrated payment providers including Klarna, Dintero, Svea, Vipps, and many others

### Add Customer Information

**Add customer to cart:**

```
PUT /api/Cart/C12345/AddCustomer/{customerId}?enrichCart=true
```

**Or set customer details directly:**

```
PATCH /api/Cart/C12345/PatchCart

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "004712345678"
}
```

### Cart Validation

**Validate cart before or during checkout to validate inventory, active products or other validators that has been configured:**

```
POST /api/Cart/C12345/Validate
```

This ensures all cart data is valid before creating the order.

* * *

### Create Order from Cart

**Complete the checkout process:**

```
POST /api/Cart/CreateOrderFromCart/C12345
```

This creates the final order and returns the order confirmation with order ID and details.

## 9\. Click and Collect Orders

Omnium supports all kinds of order flow (like BOPIS, ROPIS, Ship from store and BORIS (C&C)). This shows how you would implement C&C.

### Setup Click and Collect Order Type

Before processing Click and Collect orders, you need to configure the order type in Omnium:

1.  **Via Omnium UI**: Navigate to **Configuration > Orders > Order Types**
2.  Create a new order type with type `ClickAndCollect`
3.  Configure pickup time limits, notifications, and store availability

### Create Click and Collect Cart

**Create cart with ClickAndCollect order type and store set to the physical store:**

```
POST /api/Cart/AddItemToCart?skuId=yellow-tshirt-small&quantity=2&marketId=nor&storeId=oslo-downtown
```

**Set order type to Click and Collect:**

```
PATCH /api/Cart/{cartId}/PatchCart

{
  "orderType": "ClickAndCollect"
}
```

### Add Customer (No Address Required)

For Click and Collect orders, you don't set a shipping address since the customer will pick up at the store:

```
PATCH /api/Cart/{cartId}/PatchCart

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "004712345678"
}
```

### Process Click and Collect Checkout

**Complete the Click and Collect order:**

```
POST /api/Cart/CreateOrderFromCart/{cartId}
```

## 10\. Customer Order History

Enable customers to view their order history by implementing order search functionality for "My Account" pages.

### Search Customer Orders

**Get all orders for a specific customer:**

```
POST /api/Orders/Search

{
  "customerId": "customer123",
  "take": 20,
  "page": 0,
  "sortOrder": "CreatedDescending"
}
```

The response includes complete order details with items, pricing, shipping information, and current status - suitable for implementing customer order history pages.

* * *

## Next Steps

Sweet! You've successfully set up a basic e-commerce solution with Omnium. Your store now has:

✅ Markets and stores configured ✅ Products with inventory management ✅ Search and product retrieval ✅ Complete cart and checkout functionality ✅ Click and Collect order processing ✅ Customer order history functionality
