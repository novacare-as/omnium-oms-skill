# Product Assets

Source: https://docs.omnium.no/docs/Product/product-assets

> Manage product images, documents, and media files in Omnium with automatic resizing and CDN delivery.

Product assets in Omnium provide a comprehensive system for managing images, documents, and other media files associated with products. Assets are stored securely with optional CDN delivery and support automatic preview image generation.

* * *

## Key Concepts

### What Are Product Assets?

Product assets are files attached to products, typically images but also documents, videos, or any file type. Each product can have multiple assets with rich metadata including:

*   Main image designation
*   Alt text for accessibility
*   Custom properties
*   Sort order
*   Purpose/category classification

### Storage Architecture

Assets are stored using a multi-tier architecture:

| Layer | Purpose |
| --- | --- |
| Metadata | Asset properties stored with products |
| Files | Binary file storage (managed by Omnium) |
| Delivery | CDN for fast global asset delivery (optional) |

### Asset Properties on Products

Products contain assets in two ways:

| Property | Type | Description |
| --- | --- | --- |
| `MainImageUrl` | string | URL to the primary product image |
| `Assets` | List<Asset> | Collection of all product assets |

* * *

## Feature Overview

### Automatic Upload

Asset URLs in `externalUrl` are automatically downloaded and stored in Omnium during product import or update operations. The exception is an asset whose `AssetType` is `External`: that file is never downloaded and keeps pointing at its source. See [Link-only assets](product-assets/asset-model.md#link-only-assets-external).

### Preview Image Generation

When enabled, Omnium automatically generates resized preview images at configured aspect ratios (e.g., thumbnails, hero images, square crops).

### CDN Integration

Asset URLs are automatically converted to CDN URLs when configured, ensuring fast global delivery.

### Main Image Management

The `IsMainImage` flag and `MainImageUrl` property are automatically synchronized across products and variants.

* * *

## Common Use Cases

### E-commerce Product Images

*   Primary product photos
*   Alternate angle images
*   Zoom images
*   Lifestyle/contextual images

### Documentation

*   Product manuals (PDF)
*   Specification sheets
*   Care instructions

### Marketing Assets

*   Campaign images
*   Banner graphics
*   Social media assets

* * *

## Documentation Sections

| Section | Description |
| --- | --- |
| [Configuration](product-assets/configuration.md) | Image processing settings |
| [Asset Model](product-assets/asset-model.md) | Complete property reference |
| [Product Assets](product-assets/product-assets.md) | Working with assets on products |
| [Asset Upload](product-assets/asset-upload.md) | Upload operations and services |
| [Preview Images](product-assets/preview-images.md) | Automatic image resizing |
| [CDN](product-assets/cdn.md) | CDN delivery for fast global access |
| [API Reference](product-assets/api-reference.md) | API endpoints for assets |

* * *

## Quick Start

### 1\. Add Assets to Products

Include assets when creating or updating products:

```json
{
  "productId": "shirt-001",
  "mainImageUrl": "https://example.com/images/shirt-front.jpg",
  "assets": [
    {
      "externalUrl": "https://example.com/images/shirt-front.jpg",
      "isMainImage": true,
      "altText": "Blue cotton shirt - front view"
    },
    {
      "externalUrl": "https://example.com/images/shirt-back.jpg",
      "altText": "Blue cotton shirt - back view",
      "sortOrder": 2
    }
  ]
}
```

### 2\. Assets Are Automatically Processed

Omnium will:

1.  Download external URLs to storage (except assets typed `External`)
2.  Generate preview images (if configured)
3.  Update asset URLs to internal/CDN URLs
4.  Index asset metadata with the product
