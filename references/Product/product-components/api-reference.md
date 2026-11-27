# Component API Reference

Source: https://docs.omnium.no/docs/Product/product-components/api-reference

> API reference for working with product components, packages, and bundles in Omnium.

This page documents the API endpoints and patterns for working with product components.

* * *

## Product Endpoints with Components

### Get Product

Retrieve a product including its components.

```
GET /api/products/{productId}
```

#### Response with Components

```json
{
  "productId": "starter-kit",
  "name": "Photography Starter Kit",
  "isPackage": true,
  "components": [
    {
      "componentId": "camera-001",
      "productId": "camera-x100",
      "skuId": "camera-x100-black",
      "quantity": 1,
      "isRequired": true
    },
    {
      "componentId": null,
      "productId": "standard-lens",
      "quantity": 1,
      "componentName": "Choose Your Lens",
      "options": [
        { "skuId": "lens-18-55" },
        { "skuId": "lens-18-135" }
      ]
    }
  ]
}
```

`componentId` is only populated if it was explicitly set when the product was created or updated. If not set, it will be `null` in the response. The system auto-generates a `componentId` only when the package is added to a cart or order — this generated ID is not written back to the product.

### Get Raw Product

Retrieve raw product data as stored.

```
GET /api/products/{id}/raw
```

Returns product with all component data exactly as stored.

* * *

## Creating Package Products

### Create Package

```
POST /api/products
Content-Type: application/json

{
  "productId": "new-bundle",
  "name": "New Bundle Product",
  "isPackage": true,
  "components": [
    {
      "componentId": "comp-001",
      "productId": "product-a",
      "skuId": "product-a-default",
      "quantity": 1,
      "isRequired": true
    },
    {
      "componentId": "comp-002",
      "productId": "product-b",
      "quantity": 2,
      "isRequired": true
    }
  ]
}
```

### Create Bundle

```
POST /api/products
Content-Type: application/json

{
  "productId": "configurable-bundle",
  "name": "Build Your Own Bundle",
  "isBundle": true,
  "components": [
    {
      "componentId": "choice-1",
      "componentName": "Choose First Item",
      "quantity": 1,
      "options": [
        { "productId": "option-a" },
        { "productId": "option-b" },
        { "productId": "option-c" }
      ]
    }
  ]
}
```

* * *

## Component Fields

### Required Fields

| Field | Type | Description |
| --- | --- | --- |
| `productId` | string | Product ID of the component |
| `quantity` | decimal | Quantity in the package |

### Optional Fields

| Field | Type | Description |
| --- | --- | --- |
| `componentId` | string | Identifier for this component. Optional on the product — auto-generated at cart-time if not set. Set this if you need to reference components by ID. |
| `skuId` | string | Specific variant SKU |
| `options` | array | Selectable variants |
| `isRequired` | bool | Component is required |
| `componentName` | string | Display name for selection UI |
| `shipTogetherWithComponentId` | string | `componentId` of a sibling component this component must always ship with. Linked components are allocated to the same warehouse, even when the package is allowed to split. |

* * *

## Component Options

### Option with Price Offset

```json
{
  "componentId": "upgrade-option",
  "productId": "base-product",
  "options": [
    {
      "skuId": "standard-sku",
      "priceOffsets": []
    },
    {
      "skuId": "premium-sku",
      "priceOffsets": [
        {
          "marketId": "default",
          "amount": 50.00,
          "currency": "USD"
        }
      ]
    }
  ]
}
```

### Option with ProductId Only

```json
{
  "options": [
    { "productId": "product-a" },
    { "productId": "product-b" }
  ]
}
```

Allows customer to select any variant of the specified product.

* * *

## Updating Components

### Replace All Components

```
PUT /api/products
Content-Type: application/json

{
  "productId": "existing-package",
  "components": [
    {
      "componentId": "new-comp-001",
      "productId": "new-product",
      "quantity": 1
    }
  ]
}
```

### Add Component to Existing Package

Fetch product, modify components array, and update:

```
GET /api/products/existing-package
# Add to components array
PUT /api/products
```

* * *

## Searching for Packages

### Find Packages Containing Product

Find all packages that include a specific component product. Use the `componentIds` field on the product search request — it matches against each component's `componentId`, `productId`, and `skuId`.

```
POST /api/products/SearchProducts
Content-Type: application/json

{
  "componentIds": ["camera-x100"]
}
```

### Search by Component SKU

The same `componentIds` field matches component SKUs, so pass the SKU there.

```
POST /api/products/SearchProducts
Content-Type: application/json

{
  "componentIds": ["specific-sku"]
}
```

* * *

## Order Endpoints with Components

### Add Package to Order

Add an order line by posting an order line body to the order's `OrderLines` route.

```
POST /api/orders/{orderId}/OrderLines/
Content-Type: application/json

{
  "code": "starter-kit",
  "quantity": 1
}
```

With auto-breakdown enabled, this creates:

1.  Package line item
2.  Component line items linked to package

### Add Package to Cart

Add an item to a cart by SKU and quantity (passed as query parameters):

```
POST /api/cart/{cartId}/OrderLines/Add?skuId=starter-kit&quantity=2
```

Alternatively, post an order line body to add a fully specified line:

```
PUT /api/cart/{cartId}/OrderLines
Content-Type: application/json

{
  "code": "starter-kit",
  "quantity": 2
}
```

Selecting component options is a separate step — use the `UpdateComponentsInCart` endpoint (`POST /api/cart/{cartId}/UpdateComponentsInCart/orderLineId/{orderLineId}/`) rather than passing component selections on the add-line call.

* * *

## Response Models

### OmniumProductComponent

The API returns components using the public model:

```json
{
  "componentId": "string",
  "productId": "string",
  "skuId": "string",
  "quantity": 1.0,
  "options": [
    {
      "skuId": "string",
      "productId": "string",
      "priceOffsets": [
        {
          "marketId": "string",
          "amount": 0.0,
          "currency": "string"
        }
      ]
    }
  ],
  "isRequired": true,
  "componentName": "string",
  "shipTogetherWithComponentId": "string"
}
```

### OrderLine with Package Info

```json
{
  "lineItemId": "string",
  "code": "string",
  "quantity": 1,
  "isPackageProduct": true,
  "isPackageBrokeDown": true,
  "packageLineItemId": "string",
  "packageSkuId": "string",
  "componentId": "string",
  "components": [...]
}
```

* * *

## Common Patterns

### Create Package with All Features

```json
{
  "productId": "complete-kit",
  "name": "Complete Kit",
  "isPackage": true,
  "price": 299.00,
  "components": [
    {
      "componentId": "main-product",
      "productId": "main-item",
      "skuId": "main-item-default",
      "quantity": 1,
      "isRequired": true
    },
    {
      "componentId": "accessory-choice",
      "productId": "accessory",
      "componentName": "Choose Accessory",
      "quantity": 1,
      "isRequired": true,
      "options": [
        {
          "skuId": "accessory-basic",
          "priceOffsets": []
        },
        {
          "skuId": "accessory-premium",
          "priceOffsets": [
            { "marketId": "default", "amount": 25.00 }
          ]
        }
      ]
    },
    {
      "componentId": "bonus-item",
      "productId": "free-gift",
      "skuId": "free-gift-sku",
      "quantity": 1,
      "isRequired": false,
      "componentName": "Free Gift (Optional)"
    }
  ]
}
```

### Variant Package

Create a variant that is a package:

```json
{
  "productId": "single-product",
  "name": "Product",
  "variants": [
    {
      "skuId": "single",
      "name": "Single",
      "isPackage": false
    },
    {
      "skuId": "three-pack",
      "name": "3-Pack",
      "isPackage": true,
      "components": [
        {
          "componentId": "item",
          "productId": "single-product",
          "skuId": "single",
          "quantity": 3
        }
      ]
    }
  ]
}
```

* * *

## Error Handling

### Common Errors

| Error | Cause | Solution |
| --- | --- | --- |
| Component product not found | Invalid `productId` | Verify component product exists |
| Invalid component SKU | SKU doesn't exist on product | Check variant SKUs |
| Circular reference | Package contains itself | Remove self-reference |

### Validation

The API validates:

*   Component products exist
*   SKUs belong to the specified products
*   No circular references in nested packages
*   Required fields are present
