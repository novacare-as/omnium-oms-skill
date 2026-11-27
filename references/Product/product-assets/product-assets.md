# Working with Product Assets

Source: https://docs.omnium.no/docs/Product/product-assets/product-assets

> How assets are managed on products, including main image handling, variant inheritance, and asset operations.

This page explains how assets are attached to products and the various operations available for managing product assets.

* * *

## Product Asset Properties

Products contain assets through two properties:

| Property | Type | Description |
| --- | --- | --- |
| `MainImageUrl` | string | URL to the primary product image |
| `Assets` | List<Asset> | Collection of all product assets |

### Relationship Between MainImageUrl and Assets

The `MainImageUrl` and `Assets` properties are synchronized:

*   When an asset has `IsMainImage: true`, its `Url` is copied to `MainImageUrl`
*   When `MainImageUrl` is set independently, a corresponding asset is created
*   Only one asset should have `IsMainImage: true` at a time

```json
{
  "productId": "shirt-001",
  "mainImageUrl": "https://cdn.example.com/products/shirt-front.jpg",
  "assets": [
    {
      "assetId": "product-image-001",
      "url": "https://cdn.example.com/products/shirt-front.jpg",
      "isMainImage": true
    },
    {
      "assetId": "product-image-002",
      "url": "https://cdn.example.com/products/shirt-back.jpg",
      "isMainImage": false
    }
  ]
}
```

* * *

## Adding Assets to Products

### Via API

Add assets when creating or updating products:

```json
{
  "productId": "shirt-001",
  "assets": [
    {
      "externalUrl": "https://supplier.com/images/front.jpg",
      "isMainImage": true,
      "altText": "Blue shirt front view"
    },
    {
      "externalUrl": "https://supplier.com/images/back.jpg",
      "sortOrder": 2
    }
  ]
}
```

### Asset ID Matching

When adding assets, existing assets with matching `AssetId` are replaced:

```json
{
  "assets": [
    {
      "assetId": "product-image-001",
      "externalUrl": "https://new-supplier.com/updated-front.jpg"
    }
  ]
}
```

If the product already has an asset with that `assetId`, it will be replaced.

### Link-Only External Files

To reference a file hosted outside Omnium without copying it, for example a certification or labelling mark shared by many products, set `assetType` to `External`. The file is not downloaded; `url` mirrors `externalUrl` and the file refreshes at its source. Reuse the same `assetId` (for example the mark code) on every product, so that [Update Assets](api-reference.md#update-assets) and [Delete Assets](api-reference.md#delete-assets) act on the mark across all products that carry it.

```json
{
  "assets": [
    {
      "assetId": "e_merket",
      "assetType": "External",
      "externalUrl": "https://marks.example.org/e_merket.png",
      "name": "E-merket",
      "altText": "E-merket",
      "sortOrder": 100
    }
  ]
}
```

* * *

## Updating Asset Metadata

Update asset properties without re-uploading the file:

```json
{
  "assets": [
    {
      "assetId": "product-image-001",
      "altText": "Updated alt text",
      "description": "Updated description",
      "sortOrder": 1
    }
  ]
}
```

### Updatable Properties

| Property | Update Behavior |
| --- | --- |
| `Name` | Set to empty string to clear, or new value to update |
| `Description` | Set to empty string to clear, or new value to update |
| `AltText` | Set to empty string to clear, or new value to update |
| `Purpose` | Set to empty string to clear, or new value to update |
| `SortOrder` | Any value updates the sort order |
| `Properties` | Entire list is replaced |
| `IsMainImage` | Updates main image designation |

* * *

## Deleting Assets

Remove assets from products by specifying the asset IDs to delete as query parameters. Omnium locates the products that own those assets, so no product ID is needed in the path:

```
DELETE /api/products/Assets/DeleteAssets?assetIds=asset-id-1&assetIds=asset-id-2
```

When assets are deleted:

1.  Asset is removed from the product's `Assets` list
2.  File is deleted from storage
3.  Associated preview images are also deleted

Link-only assets (`AssetType` is `External`) are only removed from the product. Their file lives on the external host and is not touched.

Asset deletion is permanent. The file is removed from storage and cannot be recovered.

* * *

## Variant Asset Handling

Product variants can have their own assets or inherit from the parent product.

### Asset Inheritance

When processing products with variants:

1.  Parent product assets are uploaded first
2.  Variant assets are processed with access to parent URLs
3.  Identical external URLs are only uploaded once (deduplication)

### Example: Variant with Shared Assets

```json
{
  "productId": "shirt-001",
  "mainImageUrl": "https://supplier.com/shirt-main.jpg",
  "assets": [
    {
      "externalUrl": "https://supplier.com/shirt-main.jpg",
      "isMainImage": true
    }
  ],
  "variants": [
    {
      "productId": "shirt-001-blue",
      "mainImageUrl": "https://supplier.com/shirt-main.jpg",
      "color": "Blue"
    },
    {
      "productId": "shirt-001-red",
      "mainImageUrl": "https://supplier.com/shirt-red.jpg",
      "color": "Red"
    }
  ]
}
```

In this example:

*   `shirt-main.jpg` is uploaded once and shared between parent and blue variant
*   `shirt-red.jpg` is uploaded separately for the red variant

### Variant-Specific Assets

Each variant can have unique assets:

```json
{
  "productId": "shirt-001",
  "variants": [
    {
      "productId": "shirt-001-blue",
      "assets": [
        {
          "externalUrl": "https://supplier.com/shirt-blue-front.jpg",
          "isMainImage": true
        },
        {
          "externalUrl": "https://supplier.com/shirt-blue-detail.jpg",
          "sortOrder": 2
        }
      ]
    }
  ]
}
```

* * *

## Main Image Management

### Setting the Main Image

The main image can be set in two ways:

**1\. Via IsMainImage flag:**

```json
{
  "assets": [
    {
      "assetId": "product-image-003",
      "externalUrl": "https://example.com/hero.jpg",
      "isMainImage": true
    }
  ]
}
```

**2\. Via MainImageUrl:**

```json
{
  "mainImageUrl": "https://example.com/hero.jpg"
}
```

### IsMainImage Synchronization

After asset processing, Omnium ensures:

*   Only one asset has `IsMainImage: true`
*   The asset with `IsMainImage: true` has its URL matching `MainImageUrl`
*   Other assets have `IsMainImage: false`

### Changing the Main Image

To change the main image:

```json
{
  "assets": [
    {
      "assetId": "product-image-004",
      "isMainImage": true
    }
  ]
}
```

The previous main image's `IsMainImage` is automatically set to `false`.

* * *

## Asset Processing Flow

When products are saved with external URLs, the following processing occurs:

```
1. Check if external URL needs uploading
   ├─ AssetType is External? → Set Url = ExternalUrl, skip upload
   ├─ Already has internal URL? → Skip (unless ForceUpload)
   └─ No internal URL? → Continue

2. Check deduplication cache
   ├─ URL already uploaded in this batch? → Reuse URL
   └─ New URL? → Upload to storage

3. Upload to Omnium storage
   ├─ Container: "products"
   └─ Path: {virtualFolderName}/{filename}

4. Generate preview images (if configured)

5. Update asset with internal URL

6. Synchronize IsMainImage flags
```

* * *

## Virtual Folder Naming

Assets are organized using virtual folders:

```
products/
├── shirt-001/
│   ├── front.jpg
│   ├── front__preview_150.jpg
│   ├── front__preview_600.jpg
│   ├── back.jpg
│   └── back__preview_150.jpg
└── pants-002/
    └── main.jpg
```

The virtual folder name is determined by:

1.  `Product.ProductId` if available
2.  `Product.Id` as fallback

* * *

## Deduplication

Omnium deduplicates asset uploads within a product save operation:

### How It Works

1.  A dictionary tracks `ExternalUrl → InternalUrl` mappings
2.  Before uploading, check if external URL exists in dictionary
3.  If found, reuse the internal URL without re-uploading
4.  This prevents duplicate uploads for shared images across variants

### Benefits

*   Reduces storage usage
*   Faster product processing
*   Consistent URLs across variants

### Example

```json
{
  "variants": [
    {
      "productId": "variant-1",
      "assets": [{ "externalUrl": "https://supplier.com/shared.jpg" }]
    },
    {
      "productId": "variant-2",
      "assets": [{ "externalUrl": "https://supplier.com/shared.jpg" }]
    }
  ]
}
```

Result: `shared.jpg` is uploaded once and both variants reference the same internal URL.

* * *

## Force Upload

To re-upload an asset that already has an internal URL, use `ForceUpload`:

```json
{
  "assets": [
    {
      "assetId": "product-image-005",
      "externalUrl": "https://supplier.com/updated-image.jpg",
      "url": "https://cdn.example.com/old-image.jpg",
      "forceUpload": true
    }
  ]
}
```

Use cases:

*   Image was updated at the source
*   Need to regenerate preview images
*   Fixing corrupted uploads

`ForceUpload` has no effect on link-only assets (`AssetType` is `External`). They are never uploaded.
