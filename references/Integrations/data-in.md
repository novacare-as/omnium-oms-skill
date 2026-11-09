# Data In

Source: https://docs.omnium.no/docs/Integrations/data-in

> Best practices for importing data to Omnium efficiently using batch operations and optimized endpoints.

## Overview

This guide shows how to import products, inventory, orders, and customers efficiently using Omnium's batch endpoints. When importing data to Omnium, batch operations are strongly recommended over single-item operations. Batch endpoints are optimized to handle high volumes efficiently and reduce API calls dramatically.

* * *

### Inventory Updates

If you're adding or updating inventory in Omnium, `UpdateMany` is your go-to endpoint, even for a single item. It automatically handles inserts, updates, and skips unchanged items.

Here's an example of how to send multiple inventory updates in one request. Note that `warehouseCode` is the store's identifier in Omnium, and `inventory` represents the absolute stock quantity (not a delta/adjustment):

```
PUT /api/inventory/UpdateMany

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
  }
]
```

**Why it matters:**

*   Ignores unchanged inventory items
*   Only updates items with actual changes
*   Handles up to 1000 items per batch
*   Automatically inserts new items or updates existing ones
*   Automatically creates inventory transactions
*   **Enriches existing inventory items** - preserves `reservedInventory` and other existing data
*   Optimal performance for bulk operations

**Best Practice:** Use UpdateMany even if you only have a single inventory update. The endpoint is optimized to handle both single and bulk operations efficiently.

* * *

### Product Updates

For most product changes, `PatchMany` (or `UpdateMany`) is the best choice. It batches updates efficiently and skips unchanged data.

Here's how to update multiple products at once:

```
PATCH /api/products/PatchMany

[
  {
    "id": "yellow-tshirt_no",
    "description": "Updated high-quality cotton t-shirt with improved fabric blend"
  },
  {
    "id": "blue-jeans_no",
    "isActive": false
  }
]
```

**Benefits:**

*   Only updates fields that have actual changes
*   Handles up to 1000 products per batch
*   Optimal performance - skips unnecessary updates
*   Preserves existing product data

**For single operations:**

```
PATCH /api/products/{productId}

{
  "description": "Updated product description"
}
```

**Note:** Batch operations don't create new product versions, but they're much faster and more efficient.

* * *

### Price Updates

Prices can be updated as part of the product (via api/products/PatchMany, for instance), but to ensure proper handling of existing prices, whether you want to retain or remove them, you should use the dedicated pricing endpoint

```
PUT /api/prices/AddMany

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
  },
  {
    "productId": "blue-jeans",
    "prices": [
      {
        "marketId": "nor",
        "unitPrice": 799.00,
        "currencyCode": "NOK",
        "validFrom": "2024-01-01T00:00:00Z"
      }
    ]
  }
]
```

**What you get:**

*   Automatically checks for actual price changes to avoid unnecessary updates
*   Optimized for high-frequency price updates from external systems
*   If you're using [separate prices](../Prices.md#separate-prices), always use this endpoint for updates

* * *

### Order Import

**Important:** For new order processing that requires workflow execution (queuing, fulfillment automation, notifications, etc.), **do not use batch operations**. Instead, use the individual POST/PUT endpoints documented at the [Orders Update API](https://apitest.omnium.no/documentation/index.html#/Orders%20%7C%20Update). These endpoints ensure orders are properly queued and workflows are triggered.

**Batch import orders** should only be used when importing from external systems for orders that don't need to trigger workflows, such as:

*   Historical order imports from legacy systems
*   POS orders that are already fulfilled
*   Reporting/analytics data imports

```
POST /api/orders/ImportMany

[
  {
    "orderId": "EXT-12345",
    "storeId": "oslo-online",
    "marketId": "nor",
    "customer": {
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "orderLines": [
      {
        "skuId": "yellow-tshirt-medium",
        "quantity": 2,
        "unitPrice": 299.00
      }
    ]
  },
  {
    "orderId": "EXT-12346",
    "storeId": "oslo-online",
    "marketId": "nor",
    "customer": {
      "email": "another@example.com",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "orderLines": [
      {
        "skuId": "blue-jeans-32",
        "quantity": 1,
        "unitPrice": 799.00
      }
    ]
  }
]
```

**Benefits:**

*   Process multiple orders in a single API call
*   Reduced overhead and faster processing
*   Better error handling with batch results

* * *

### Customer Import

Use the batch endpoint to add or update multiple customers efficiently:

```
PUT /api/PrivateCustomers/AddOrUpdateMany

[
  {
    "customerId": "CUST-001",
    "customerNumber": "42",
    "email": "frequent.shopper@example.com",
    "firstName": "Liv",
    "lastName": "Andersen",
    "gender": "Female",
    "birthDate": "1985-03-15T00:00:00Z",
    "phone": "+4798765432",
    "isCustomerClubMember": true,
    "bonusPoints": 1337,
    "tags": ["VIP"],
    "address": {
      "name": "Liv Andersen",
      "line1": "Storgata 15",
      "city": "Oslo",
      "postalCode": "0155",
      "countryCode": "NO",
      "countryName": "Norway",
      "email": "frequent.shopper@example.com",
      "phone": "+4799999999"
    }
  }
]
```

* * *

### ⚠️ Important

Batch endpoints (`*Many` endpoints) should be executed **synchronously**, not in high parallel. Running multiple batch operations simultaneously, especially for the same entity type, may lead to temporary throttling or trigger stricter rate limits. Process batches sequentially to ensure smooth sailing.

## Summary

Batch endpoints = performance, reliability, and fewer API calls.

*   **Inventory** → `UpdateMany`
*   **Products** → `PatchMany` or `UpdateMany`
*   **Prices** → `AddMany`
*   **Orders** → `ImportMany`
*   **Customers** → `AddOrUpdateMany`

### Batch sizes (starting points):

| Entity | Recommended Batch | Notes |
| --- | --- | --- |
| Inventory | 1000 | Optimized for high volume |
| Products | 500 | Reduce for complex product data |
| Orders | 250–500 | Lower if orders have many lines |
| Customers | 500 | Adjust for complex B2B data |
| Prices | 500–2000 | Larger batches OK for separate prices |

💡 Tune batch sizes based on your own API timings and entity complexity.

Batch operations save both time and API overhead — and keep your integrations predictable even under heavy load.

* * *

## Next Steps

Now that you understand data import patterns:

*   Review the [Data Out](data-out.md) for export strategies
*   Check out the [Omnichannel E-Commerce Tutorial](../GettingStartedWithAPI/Tutorials/omnichannel-ecom.md) for end-to-end examples
