# Asset Upload

Source: https://docs.omnium.no/docs/Product/product-assets/asset-upload

> How to upload assets to Omnium via external URLs and binary streams.

Omnium supports multiple methods for uploading assets. This page covers the upload mechanisms and best practices.

* * *

## Upload Methods

Omnium provides two ways to upload assets via the public API:

| Method | Use Case | Input |
| --- | --- | --- |
| External URL | Import from external source | URL to download |
| Binary Stream | Programmatic / single-file upload | Raw binary request body |

* * *

## External URL Upload

The most common upload method. Omnium downloads the file from an external URL and stores it internally.

### How It Works

1.  Provide an asset with `ExternalUrl` set
2.  Omnium downloads the file from the URL
3.  File is stored in Omnium's asset storage
4.  Asset's `Url` property is updated with the internal URL

### Example

**Input:**

```json
{
  "assets": [
    {
      "externalUrl": "https://supplier.com/images/product.jpg",
      "fileName": "product.jpg"
    }
  ]
}
```

**After Processing:**

```json
{
  "assets": [
    {
      "externalUrl": "https://supplier.com/images/product.jpg",
      "url": "https://cdn.example.com/products/shirt-001/product.jpg",
      "fileName": "product.jpg",
      "contentType": "image/jpeg",
      "length": 245678,
      "created": "2024-01-15T10:30:00Z",
      "modified": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### File Name Handling

The upload process determines the file name using this priority:

1.  `asset.FileName` if provided
2.  Extracted from the URL path
3.  With content type extension added if missing

Always include the file extension in `FileName` to ensure correct MIME type handling. Files without extensions may not display correctly in browsers.

### Assets That Are Not Uploaded

Assets with `AssetType` set to `External` skip the upload entirely. Omnium keeps the file at its external URL and sets `Url` to the same value as `ExternalUrl`, so a file shared by many products, such as a certification mark, is stored once at its source and refreshes there. See [Link-only assets](asset-model.md#link-only-assets-external).

* * *

## Binary Stream Upload

Upload a single file directly as raw binary data. Useful for programmatic uploads or files generated in code.

### API Usage

The request body is the raw file content. The file name (including extension) is supplied as a query string parameter (`?fileName=...`) so Omnium can determine the MIME type.

```
POST /api/products/Assets/AddAsset/{productId}?fileName=product-image.jpg
Content-Type: application/octet-stream

[binary file data]
```

### When to Use

*   Generating files programmatically (PDFs, images)
*   Processing binary data from external systems
*   Converting between formats

### Response

Returns the created asset with populated metadata:

```json
{
  "assetId": "product-image-001",
  "name": "product-image.jpg",
  "fileName": "product-image.jpg",
  "url": "https://cdn.example.com/products/product-image.jpg",
  "contentType": "image/jpeg",
  "length": 245678,
  "created": "2024-01-15T10:30:00Z",
  "modified": "2024-01-15T10:30:00Z"
}
```

### Metadata Populated

| Property | Source |
| --- | --- |
| `Name` | File name from the request |
| `FileName` | File name from the request |
| `ContentType` | Detected from the file extension |
| `Length` | File size in bytes |
| `AssetId` | Auto-generated GUID |
| `Created` | Current UTC time |
| `Modified` | Current UTC time |

An unknown or missing file extension on `fileName` returns `400 Bad Request` ("Unknown file type"). A non-existent `productId` returns `404 Not Found`.

* * *

## Storage Containers

Assets are automatically organized into containers based on context:

| Container | Usage |
| --- | --- |
| `products` | Product images and documents |
| `customer` | Customer attachments |
| `projects` | Project-related assets |

Container assignment is handled automatically by Omnium based on the upload context.

* * *

## Virtual Folders

Assets are organized using virtual folder paths within containers:

```
products/
├── shirt-001/
│   ├── front.jpg
│   ├── back.jpg
│   └── detail.jpg
└── pants-002/
    └── main.jpg
```

### Folder Naming

For product assets, the virtual folder name is:

*   `Product.ProductId` if available
*   `Product.Id` as fallback

* * *

## Upload Behavior

### Automatic Metadata

During upload, the following properties are automatically set:

| Property | Value |
| --- | --- |
| `Created` | Current UTC time (if not already set) |
| `Modified` | Current UTC time |
| `ContentType` | Detected from file or provided |
| `Length` | File size in bytes |
| `Url` | Internal asset URL |
| `Name` | Extracted from filename if not provided |
| `FileName` | Extracted from blob name if not provided |

### CDN URL Conversion

When a CDN is configured for your tenant, internal asset URLs are automatically converted to CDN URLs for faster delivery. This conversion happens in the mapping layer when returning assets via the API.

* * *

## Error Handling

Upload operations may fail for several reasons:

| Error | Cause | Resolution |
| --- | --- | --- |
| Empty URL | `ExternalUrl` is null or empty | Provide valid external URL |
| Download failed | External URL unreachable | Verify URL accessibility |
| Storage error | Storage service issue | Contact Omnium support |
| Invalid content | File is corrupted or invalid | Verify source file |

Failed uploads are typically logged but do not cause the entire product save to fail. Check asset URLs after save to verify successful uploads.

* * *

## Best Practices

### File Names

*   Always include file extensions (`.jpg`, `.png`, `.pdf`)
*   Use URL-safe characters (alphanumeric, hyphens, underscores)
*   Avoid spaces and special characters

### External URLs

*   Use HTTPS URLs when possible
*   Ensure URLs are publicly accessible (no authentication required)
*   Verify URLs are stable (not temporary/signed)

### Performance

*   Use batch operations for multiple assets
*   Take advantage of deduplication for shared images
*   Consider CDN for production deployments

### File Types

Common supported file types:

| Type | Extensions | Common MIME Types |
| --- | --- | --- |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| Documents | `.pdf`, `.doc`, `.docx` | `application/pdf`, `application/msword` |
| Video | `.mp4`, `.webm` | `video/mp4`, `video/webm` |
