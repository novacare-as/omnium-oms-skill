# Asset API Reference

Source: https://docs.omnium.no/docs/Product/product-assets/api-reference

> Complete API reference for product asset endpoints in Omnium, including CRUD operations and image uploads.

This page documents the public API endpoints for managing product assets in Omnium.

**Base URL:** `/api/products`

**Authentication:** All endpoints require authentication. Read operations require `ProductRead` access; write operations require `ProductAdmin` access.

* * *

## Endpoints Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/Assets/GetAssets` | Get assets by IDs |
| POST | `/Assets/AddAssets/{skuId}` | Add assets to a product |
| POST | `/Assets/UpdateAssets` | Update asset metadata |
| DELETE | `/Assets/DeleteAssets` | Delete assets from products |
| GET | `/AddProductImage` | Add image from URL (legacy) |

* * *

## Get Assets

Retrieve assets by their IDs.

```
GET /api/products/Assets/GetAssets?assetIds={id1}&assetIds={id2}
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `assetIds` | List<string> | Yes | Asset IDs to retrieve (query parameter array) |

### Response

```json
[
  {
    "assetId": "product-image-001",
    "url": "https://cdn.example.com/products/image.jpg",
    "externalUrl": "https://supplier.com/original.jpg",
    "fileName": "image.jpg",
    "name": "Product Image",
    "description": "Front view",
    "altText": "Blue shirt front view",
    "purpose": "gallery",
    "sortOrder": 1,
    "isMainImage": true,
    "assetType": "image",
    "contentType": "image/jpeg",
    "length": 245678,
    "created": "2024-01-15T10:30:00Z",
    "modified": "2024-01-15T10:30:00Z"
  }
]
```

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Assets found and returned |
| 404 | No asset IDs provided or assets not found |

* * *

## Add Assets

Add assets to a product. Existing assets with matching asset IDs are replaced.

```
POST /api/products/Assets/AddAssets/{skuId}?isAddedToVariant={boolean}
Content-Type: application/json
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `skuId` | string | Yes | Product ID, SKU, or variant SKU |
| `isAddedToVariant` | bool | No | If true, add to matching variant instead of parent |

### Request Body

```json
[
  {
    "externalUrl": "https://supplier.com/images/front.jpg",
    "isMainImage": true,
    "altText": "Product front view",
    "sortOrder": 1,
    "purpose": "gallery"
  },
  {
    "externalUrl": "https://supplier.com/images/back.jpg",
    "altText": "Product back view",
    "sortOrder": 2,
    "purpose": "gallery"
  }
]
```

### Asset Fields

| Field | Type | Description |
| --- | --- | --- |
| `assetId` | string | Unique identifier (auto-generated if not provided) |
| `externalUrl` | string | URL to download and store |
| `assetType` | string | Free text. `External` keeps the asset at `externalUrl` instead of uploading it, see [Link-only assets](asset-model.md#link-only-assets-external) |
| `isMainImage` | bool | Set as main product image |
| `name` | string | Display name |
| `description` | string | Asset description |
| `altText` | string | Alt text for images |
| `purpose` | string | Asset purpose |
| `sortOrder` | int | Display order |
| `properties` | List<PropertyItem> | Custom key-value metadata |

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Assets added successfully |
| 404 | Product or variant not found |

### Example: Add to Variant

```
POST /api/products/Assets/AddAssets/SKU-BLUE?isAddedToVariant=true
Content-Type: application/json

[
  {
    "externalUrl": "https://supplier.com/blue-variant.jpg",
    "isMainImage": true
  }
]
```

* * *

## Update Assets

Update metadata for existing assets without re-uploading files.

```
POST /api/products/Assets/UpdateAssets
Content-Type: application/json
```

### Request Body

```json
[
  {
    "assetId": "product-image-001",
    "altText": "Updated alt text",
    "description": "Updated description",
    "sortOrder": 2,
    "isMainImage": false
  }
]
```

### Updatable Fields

| Field | Update Behavior |
| --- | --- |
| `name` | Set to empty string to clear |
| `description` | Set to empty string to clear |
| `altText` | Set to empty string to clear |
| `purpose` | Set to empty string to clear |
| `sortOrder` | Any value updates |
| `properties` | Entire list replaced |
| `isMainImage` | Updates main image designation |
| `externalUrl` | New URL with `forceUpload: true` triggers re-upload |

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Assets updated successfully |
| 404 | No asset IDs provided or products not found |

### Force Re-upload

To re-upload an asset with a new external URL:

```json
[
  {
    "assetId": "product-image-001",
    "externalUrl": "https://new-supplier.com/updated-image.jpg",
    "forceUpload": true
  }
]
```

* * *

## Delete Assets

Delete assets from products and storage.

```
DELETE /api/products/Assets/DeleteAssets?assetIds={id1}&assetIds={id2}
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `assetIds` | List<string> | Yes | Asset IDs to delete |

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Assets deleted successfully |
| 400 | No asset IDs provided |
| 404 | Products with assets not found |

Deleting assets permanently removes files from storage, including preview images. This action cannot be undone.

Link-only assets (`assetType` is `External`) are removed from the product only. Nothing is deleted from storage.

* * *

## Add Product Image (Legacy)

Add an image to a product from a URL. This is a simplified endpoint for adding a single image.

```
GET /api/products/AddProductImage?url={imageUrl}&productId={productId}
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | External image URL |
| `productId` | string | Yes | Target product ID |

### Behavior

1.  Downloads image from external URL
2.  Uploads to Omnium storage
3.  Adds to product's assets
4.  Sets as main image if first asset

### Status Codes

| Code | Description |
| --- | --- |
| 200 | Image added successfully |
| 400 | Could not upload file |

* * *

## Common Use Cases

### Add Product with Assets

Include assets when creating or updating a product:

```
POST /api/products
Content-Type: application/json

{
  "productId": "shirt-001",
  "name": "Blue Cotton Shirt",
  "mainImageUrl": "https://supplier.com/shirt-main.jpg",
  "assets": [
    {
      "externalUrl": "https://supplier.com/shirt-main.jpg",
      "isMainImage": true,
      "altText": "Blue shirt front view"
    },
    {
      "externalUrl": "https://supplier.com/shirt-back.jpg",
      "altText": "Blue shirt back view",
      "sortOrder": 2
    }
  ]
}
```

### Add External Files Without Uploading

Set `assetType` to `External` to reference a file hosted outside Omnium, for example a certification mark. The file is not downloaded and `url` is set to the same value as `externalUrl`. Using the mark code as `assetId` lets one update or delete call act on the mark across every product that carries it.

```
POST /api/products/Assets/AddAssets/SHIRT-001?isAddedToVariant=false
Content-Type: application/json

[
  {
    "assetId": "grontpunkt",
    "assetType": "External",
    "externalUrl": "https://marks.example.org/grontpunkt.png",
    "name": "Grønt Punkt",
    "altText": "Grønt Punkt",
    "sortOrder": 100,
    "properties": [
      { "key": "ValidFrom", "value": "2026-08-25" }
    ]
  }
]
```

### Replace Main Image

Update an existing asset to become the main image:

```
POST /api/products/Assets/UpdateAssets
Content-Type: application/json

[
  {
    "assetId": "product-image-002",
    "isMainImage": true
  }
]
```

### Bulk Asset Update

Update multiple assets across products:

```
POST /api/products/Assets/UpdateAssets
Content-Type: application/json

[
  {
    "assetId": "product-image-001",
    "altText": "Updated alt text 1",
    "purpose": "hero"
  },
  {
    "assetId": "product-image-002",
    "altText": "Updated alt text 2",
    "purpose": "thumbnail"
  }
]
```

* * *

## Error Handling

All endpoints return standard HTTP status codes. Error responses include a message:

```json
{
  "message": "Products with asset ids not found"
}
```

| Status | Description |
| --- | --- |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Asset or product doesn't exist |
| 500 | Server Error - Internal error, retry later |

* * *

## Business Customer Assets

Assets can also be attached to business customers. These endpoints follow a similar pattern:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/BusinessCustomer/{id}/Assets/GetAssets` | Get customer assets |
| POST | `/api/BusinessCustomer/{id}/Assets/AddAsset` | Add asset from stream |
| POST | `/api/BusinessCustomer/{id}/Assets/AddAssets` | Add multiple assets |
| POST | `/api/BusinessCustomer/{id}/Assets/UpdateAssets` | Update customer assets |
| DELETE | `/api/BusinessCustomer/{id}/Assets/DeleteAssets` | Delete customer assets |

### Add Asset from Binary Stream

Upload a file directly as binary data:

```
POST /api/BusinessCustomer/{businessCustomerId}/Assets/AddAsset?fileName=document.pdf
Content-Type: application/octet-stream

[binary file data]
```

This endpoint accepts raw binary data in the request body, useful for:

*   Browser file uploads
*   Programmatic file creation
*   Integration with external systems
