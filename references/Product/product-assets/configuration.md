# Asset Configuration

Source: https://docs.omnium.no/docs/Product/product-assets/configuration

> Configure image processing settings for product assets in Omnium.

Product asset configuration is managed through tenant settings. This page covers image processing and asset organization settings.

* * *

## Storage

Asset files are stored in Azure Blob Storage with optional CDN delivery. Storage configuration is managed by Omnium and does not require manual setup.

Storage is configured by Omnium as part of tenant provisioning. CDN can be configured by the tenant admin under **Configuration > Settings > Platform > CDN**. See [CDN](cdn.md) for details.

* * *

## Image Settings

Configure image processing in `TenantSettings.ProductSettings`.

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `ImageAspectRatios` | List<AspectRatio> | Preview image sizes to generate |
| `ImageFileTypes` | List<FileTypeOptions> | Allowed image file types with compression |
| `IsImagesAutoResizedOnUpload` | bool | Enable automatic preview generation |
| `ImageMaxSize` | AspectRatio | Maximum image dimensions |
| `AssetPurposeKeys` | List<string> | Valid values for asset `Purpose` property |

### Configuration Example

```json
{
  "ProductSettings": {
    "IsImagesAutoResizedOnUpload": true,
    "ImageMaxSize": {
      "name": "max",
      "width": 2000,
      "height": 2000
    },
    "ImageAspectRatios": [
      {
        "name": "thumbnail",
        "translateKey": "Products.ImageSize.Thumbnail",
        "width": 150,
        "height": 150,
        "isDefault": false
      },
      {
        "name": "medium",
        "translateKey": "Products.ImageSize.Medium",
        "width": 600,
        "height": 600,
        "isDefault": true
      },
      {
        "name": "large",
        "translateKey": "Products.ImageSize.Large",
        "width": 1200,
        "height": 1200,
        "isDefault": false
      }
    ],
    "ImageFileTypes": [
      {
        "fileType": "jpg",
        "isDefault": true,
        "compressionOptions": {
          "quality": 85
        }
      },
      {
        "fileType": "png",
        "isDefault": false,
        "compressionOptions": {
          "quality": 90
        }
      },
      {
        "fileType": "webp",
        "isDefault": false,
        "compressionOptions": {
          "quality": 80
        }
      }
    ],
    "AssetPurposeKeys": [
      "hero",
      "thumbnail",
      "gallery",
      "documentation",
      "lifestyle"
    ]
  }
}
```

* * *

## AspectRatio Reference

The `AspectRatio` class defines image dimensions for preview generation.

| Property | Type | Description |
| --- | --- | --- |
| `Name` | string | Identifier for the size (used in file naming) |
| `TranslateKey` | string | UI translation key |
| `IsDefault` | bool | Mark as default size |
| `Width` | int | Width in pixels |
| `Height` | int | Height in pixels |

### How Previews Are Named

When preview images are generated, they follow this naming pattern:

```json
{original-filename}__preview_{size}.{extension}
```

The size is the target height, or `w{width}` when a width is used. Example:

*   Original: `product-image.jpg`
*   Height 150: `product-image__preview_150.jpg`
*   Height 600: `product-image__preview_600.jpg`
*   Width 300: `product-image__preview_w300.jpg`

* * *

## FileTypeOptions Reference

The `FileTypeOptions` class defines allowed image formats and compression.

| Property | Type | Description |
| --- | --- | --- |
| `FileType` | string | File extension (e.g., `jpg`, `png`, `webp`) |
| `IsDefault` | bool | Default format for conversions |
| `CompressionOptions` | CompressionOptions | Compression settings |

### CompressionOptions

| Property | Type | Description |
| --- | --- | --- |
| `Quality` | int | Compression quality (1-100) |

* * *

## Storage Containers

Assets are automatically organized into containers based on their context:

| Container | Usage |
| --- | --- |
| `products` | Product images and documents |
| `customer` | Customer attachments |
| `projects` | Project-related assets |

Container assignment is handled automatically by Omnium based on the upload context.

* * *

## Best Practices

### Image Settings

*   Configure `ImageMaxSize` to prevent excessively large uploads
*   Use `IsImagesAutoResizedOnUpload` to ensure consistent image sizes
*   Define aspect ratios that match your frontend design requirements

### Asset Purpose Keys

*   Define consistent purpose values across your catalog
*   Use purpose keys for filtering and organizing assets in the UI
*   Common values: `hero`, `thumbnail`, `gallery`, `detail`, `lifestyle`, `documentation`

Changing `ImageAspectRatios` after assets have been uploaded will not regenerate existing preview images. You'll need to re-upload assets or run a migration to regenerate previews.
