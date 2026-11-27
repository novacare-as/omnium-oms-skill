# Asset Model Reference

Source: https://docs.omnium.no/docs/Product/product-assets/asset-model

> Complete property reference for the Asset model in Omnium, including URLs, metadata, and custom properties.

This page documents all properties of the `Asset` model used for product images, documents, and media files.

* * *

## Asset Properties

| Property | Type | Description |
| --- | --- | --- |
| `AssetId` | string | Unique identifier for the asset |
| `AssetType` | string | Type classification (e.g., `image`, `document`). The built-in value `External` makes the asset link-only, see [Link-only assets](asset-model.md#link-only-assets-external) |
| `Name` | string | Display name |
| `Description` | string | Short description |
| `AltText` | string | Alternative text for images (accessibility/SEO) |
| `Purpose` | string | Asset purpose or use case (e.g., `hero`, `thumbnail`) |
| `SortOrder` | int? | Display order when listing assets |
| `IsMainImage` | bool | Flag indicating if asset is the main product image |
| `ParentId` | string | Optional parent folder/directory ID |

### URL Properties

| Property | Type | Description |
| --- | --- | --- |
| `Url` | string | Internal Omnium URL (set after upload) |
| `ExternalUrl` | string | External URL to be downloaded and stored in Omnium |

### File Properties

| Property | Type | Description |
| --- | --- | --- |
| `FileName` | string | File name including extension (e.g., `product.jpg`) |
| `ContentType` | string | MIME type (e.g., `image/jpeg`, `application/pdf`) |
| `Length` | long | File size in bytes |
| `Container` | string | Storage container name |
| `InternalName` | string | Internal reference name |
| `FileLoaderType` | string | Type of file loader used |

### Upload Control

| Property | Type | Description |
| --- | --- | --- |
| `ForceUpload` | bool? | Force upload external URL even if internal URL exists |

### Metadata

| Property | Type | Description |
| --- | --- | --- |
| `Properties` | List<PropertyItem> | Custom key-value properties |
| `Created` | DateTime | Creation timestamp |
| `Modified` | DateTime | Last modification timestamp |

* * *

## Key Concepts

### AssetId

The `AssetId` is a unique identifier for each asset. If not provided during creation, a GUID is automatically generated:

```json
{
  "assetId": "product-image-001"
}
```

### URL Handling

Assets support two URL properties that work together:

| Scenario | ExternalUrl | Url | Behavior |
| --- | --- | --- | --- |
| New asset | Set | Empty | External URL is downloaded to Omnium storage, `Url` is set |
| Uploaded asset | Any | Set | Uses existing internal URL |
| Force re-upload | Set | Set | Re-downloads external URL if `ForceUpload` is true |
| Link-only asset | Set | Mirrors `ExternalUrl` | `AssetType` is `External`: nothing is downloaded and `Url` is set to the external URL |

```json
{
  "externalUrl": "https://supplier.com/images/product.jpg",
  "url": null
}
```

After processing:

```json
{
  "externalUrl": "https://supplier.com/images/product.jpg",
  "url": "https://cdn.example.com/products/product.jpg"
}
```

### Link-only assets (External)

Set `AssetType` to `External` for files that should stay at their source instead of being copied into Omnium storage, for example certification and labelling marks that many products share and that the issuing body may update. For these assets:

*   Nothing is downloaded. `Url` is set to the same value as `ExternalUrl`, so consumers that read `Url` keep working.
*   `ForceUpload` is ignored and reset to `false`.
*   `IsMainImage` is ignored and reset to `false`. A link-only asset is never the main product image.
*   Changing `ExternalUrl` moves `Url` along with it. No re-upload happens.
*   Deleting the asset removes it from the product only. Nothing is deleted from storage.

Because the file is served from the external host, a change at the source shows on every product that references it without a new import. Use an `https` URL; browsers block `http` content on an `https` page.

```json
{
  "assetId": "grontpunkt",
  "assetType": "External",
  "externalUrl": "https://marks.example.org/grontpunkt.png",
  "name": "Grønt Punkt",
  "altText": "Grønt Punkt",
  "sortOrder": 100
}
```

After saving, `Url` equals `ExternalUrl`. Changing an already uploaded asset to `External` switches `Url` to the external URL; the copy previously stored in Omnium is not removed.

### IsMainImage

The `IsMainImage` flag designates the primary product image:

*   Only one asset per product should have `IsMainImage: true`
*   The main image URL is synchronized to `Product.MainImageUrl`
*   Main image is typically shown in product listings and search results

```json
{
  "assets": [
    {
      "assetId": "product-image-001",
      "externalUrl": "https://example.com/front.jpg",
      "isMainImage": true
    },
    {
      "assetId": "product-image-002",
      "externalUrl": "https://example.com/back.jpg",
      "isMainImage": false
    }
  ]
}
```

### Purpose

The `Purpose` property categorizes assets by their intended use:

| Purpose | Description |
| --- | --- |
| `hero` | Large banner/hero image |
| `thumbnail` | Small preview image |
| `gallery` | Product gallery image |
| `detail` | Detailed/zoom image |
| `lifestyle` | Lifestyle/contextual image |
| `documentation` | Product manuals, spec sheets |

Configure valid purpose values in tenant settings via `AssetPurposeKeys`.

### SortOrder

Control asset display order with `SortOrder`:

```json
{
  "assets": [
    { "assetId": "product-image-001", "sortOrder": 1 },
    { "assetId": "product-image-002", "sortOrder": 2 },
    { "assetId": "product-image-003", "sortOrder": 3 }
  ]
}
```

Lower values appear first. Assets without `SortOrder` typically appear last.

* * *

## Custom Properties

The `Properties` list allows storing arbitrary key-value metadata:

```json
{
  "assetId": "product-image-004",
  "properties": [
    { "key": "photographer", "value": "John Smith" },
    { "key": "shootDate", "value": "2024-01-15" },
    { "key": "copyright", "value": "2024 Acme Corp" },
    { "key": "color", "value": "blue" }
  ]
}
```

Use cases:

*   Image credits and copyright
*   Color/variant associations
*   Campaign or season tagging
*   Custom filtering criteria

* * *

## Complete Example

```json
{
  "assetId": "product-image-005",
  "assetType": "image",
  "name": "Front View",
  "description": "Blue cotton shirt - front view",
  "altText": "Blue cotton button-down shirt, front view",
  "purpose": "gallery",
  "sortOrder": 1,
  "isMainImage": true,
  "externalUrl": "https://supplier.com/images/shirt-001-front.jpg",
  "url": "https://cdn.example.com/products/shirt-001-front.jpg",
  "fileName": "shirt-001-front.jpg",
  "contentType": "image/jpeg",
  "length": 245678,
  "container": "products",
  "properties": [
    { "key": "variant", "value": "blue" },
    { "key": "angle", "value": "front" }
  ],
  "created": "2024-01-15T10:30:00Z",
  "modified": "2024-01-15T10:30:00Z"
}
```
