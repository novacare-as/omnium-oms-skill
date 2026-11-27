# Preview Images

Source: https://docs.omnium.no/docs/Product/product-assets/preview-images

> Automatic generation of resized preview images at configured aspect ratios for product assets.

Omnium can automatically generate preview images at different sizes when product assets are uploaded. This feature creates optimized images for thumbnails, galleries, and other display contexts.

* * *

## How It Works

When `IsImagesAutoResizedOnUpload` is enabled, Omnium generates preview images for each configured aspect ratio:

```
Original: product-image.jpg (2000x2000)
    ↓
Previews Generated:
├── product-image__preview_150.jpg (150x150)
├── product-image__preview_600.jpg (600x600)
└── product-image__preview_1200.jpg (1200x1200)
```

### Processing Flow

1.  Asset is uploaded to blob storage
2.  If auto-resize is enabled and aspect ratios are configured:
    *   For each aspect ratio, a preview is generated
    *   Preview is stored alongside the original
3.  Previews are created lazily (on-demand) or during upload

* * *

## Configuration

### Enable Auto-Resize

```json
{
  "ProductSettings": {
    "IsImagesAutoResizedOnUpload": true
  }
}
```

### Configure Aspect Ratios

Define the sizes to generate:

```json
{
  "ProductSettings": {
    "ImageAspectRatios": [
      {
        "name": "thumbnail",
        "translateKey": "ProductsImageSizeThumbnail",
        "width": 150,
        "height": 150,
        "isDefault": false
      },
      {
        "name": "medium",
        "translateKey": "ProductsImageSizeMedium",
        "width": 600,
        "height": 600,
        "isDefault": true
      },
      {
        "name": "large",
        "translateKey": "ProductsImageSizeLarge",
        "width": 1200,
        "height": 1200,
        "isDefault": false
      }
    ]
  }
}
```

* * *

## Preview File Naming

Preview files follow a consistent naming pattern:

```json
{original-name}__preview_{size}.{extension}
```

### By Height

When only height is specified:

```
product-image__preview_150.jpg
product-image__preview_600.jpg
```

### By Width

When width is specified:

```
product-image__preview_w300.jpg
product-image__preview_w800.jpg
```

### Examples

| Original | Preview Size | Preview Filename |
| --- | --- | --- |
| `front.jpg` | 150px height | `front__preview_150.jpg` |
| `front.jpg` | 600px height | `front__preview_600.jpg` |
| `front.jpg` | 300px width | `front__preview_w300.jpg` |

* * *

## Storage Location

Preview images are stored in the same container and virtual folder as the original:

```
products/
└── shirt-001/
    ├── front.jpg                    (original)
    ├── front__preview_150.jpg       (thumbnail)
    ├── front__preview_600.jpg       (medium)
    ├── front__preview_1200.jpg      (large)
    ├── back.jpg                     (original)
    ├── back__preview_150.jpg        (thumbnail)
    └── ...
```

* * *

## Supported Formats

Preview generation supports common image formats:

| Format | Supported | Notes |
| --- | --- | --- |
| JPEG | Yes | Most common, good compression |
| PNG | Yes | Supports transparency |
| GIF | Yes | Animated GIFs not resized |
| WebP | Yes | Modern format, good compression |
| SVG | No | Vector format, returned as-is |

SVG images are vector-based and don't need resizing. When an SVG is requested, the original URL is returned without preview generation.

* * *

## On-Demand Generation

Previews can also be generated on-demand when requested:

### Request a Preview

```
GET /api/ImagesDelivery/GetImageUrl?url={assetUrl}&maxHeight=150&maxWidth=0
```

### Behavior

1.  Check if preview already exists
2.  If exists and valid (size > 0), return the preview URL
3.  If not exists, generate from original:
    *   Download original image
    *   Resize to target dimensions
    *   Upload preview to storage
    *   Return preview URL

### Caching

Generated previews are stored permanently. Subsequent requests return the existing preview without regeneration.

* * *

## Aspect Ratio Properties

| Property | Type | Description |
| --- | --- | --- |
| `Name` | string | Identifier (used in filename) |
| `TranslateKey` | string | UI translation key |
| `IsDefault` | bool | Mark as default size |
| `Width` | int | Target width in pixels |
| `Height` | int | Target height in pixels |

### Sizing Behavior

*   If only `Height` is specified: Image is scaled proportionally to fit height
*   If only `Width` is specified: Image is scaled proportionally to fit width
*   If both are specified: Image is scaled to fit within the bounding box

* * *

## Common Size Configurations

### E-commerce Standard

```json
{
  "ImageAspectRatios": [
    { "name": "thumb", "height": 100, "width": 100 },
    { "name": "listing", "height": 300, "width": 300 },
    { "name": "product", "height": 600, "width": 600 },
    { "name": "zoom", "height": 1200, "width": 1200 }
  ]
}
```

### Responsive Images

```json
{
  "ImageAspectRatios": [
    { "name": "mobile", "width": 400, "height": 400 },
    { "name": "tablet", "width": 800, "height": 800 },
    { "name": "desktop", "width": 1200, "height": 1200 }
  ]
}
```

* * *

## Preview Cleanup

When assets are deleted, associated preview images are also removed:

1.  Find all preview images matching the original filename pattern
2.  Delete each preview from storage
3.  Delete the original image

### Pattern Matching

Previews are found using regex pattern:

```json
{original-name}__preview_{size}.{extension}
```

* * *

## Performance Considerations

### Generation Time

*   Preview generation adds processing time during upload
*   For large catalogs, consider generating previews asynchronously
*   First-time on-demand generation may be slow

### Storage

*   Each aspect ratio adds storage for every image
*   Storage cost = (Number of images) × (Number of ratios + 1)
*   Consider your actual size needs before adding many ratios

### Best Practices

1.  **Limit aspect ratios**: Only configure sizes you actually need
2.  **Use appropriate dimensions**: Don't generate 4K previews for thumbnails
3.  **Consider CDN**: Use CDN for preview delivery to reduce latency

Changing `ImageAspectRatios` after assets have been uploaded will not regenerate existing previews. New previews will only be created for newly uploaded assets or when on-demand generation is triggered.

* * *

## Troubleshooting

### Previews Not Generated

| Issue | Cause | Solution |
| --- | --- | --- |
| No previews created | `IsImagesAutoResizedOnUpload` is false | Enable in tenant settings |
| No previews created | `ImageAspectRatios` is empty | Configure aspect ratios |
| Format not supported | Unsupported image format | Convert to supported format |

### Invalid Previews

| Issue | Cause | Solution |
| --- | --- | --- |
| Empty preview files | Image processing error | Re-upload original asset |
| Corrupted previews | Source image corrupted | Verify original image quality |
| Wrong dimensions | Configuration changed | Delete and regenerate previews |
