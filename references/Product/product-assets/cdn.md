# CDN

Source: https://docs.omnium.no/docs/Product/product-assets/cdn

> Serve product images and assets through a Content Delivery Network for faster global delivery.

Omnium supports serving product images and assets through a Content Delivery Network (CDN). When configured, image URLs returned by the API are automatically rewritten to use the CDN endpoint, delivering content from edge locations closer to end users.

### CDN Options

Omnium can set up and manage a CDN for your tenant. Contact Omnium support to get started.

Alternatively, you can bring your own CDN by configuring your preferred CDN provider to serve content from your Omnium storage origin, and entering the CDN URL in the settings below.

* * *

## How It Works

Product files are stored in Omnium's cloud storage. When a CDN URL is configured for your tenant, Omnium automatically rewrites the storage URLs to CDN URLs in API responses.

**Without CDN:**

```
https://yourstorage.blob.core.windows.net/products/e362fa07.jpg
```

**With CDN:**

```
https://yourcdn.azureedge.net/products/e362fa07.jpg
```

The conversion is transparent. No changes are needed in your API requests or integrations. If no CDN is configured, original storage URLs are returned.

* * *

## What Is Affected

The following URL fields are converted to CDN URLs:

| Field | Description |
| --- | --- |
| Product `mainImageUrl` | The product's main image |
| Product `assets[].url` | All product asset URLs (images, files) |
| Product category images | Category image URLs |
| Product feed exports | Image URLs in feeds such as Google Shopping |
| Cart orderline `imageUrl` | Image URLs on cart orderlines |
| Order orderline `imageUrl` | Image URLs on order orderlines |

The `assets[].externalUrl` field always contains the original source URL (e.g. from your PIM system) and is **not** converted to a CDN URL.

* * *

## Configuration

If Omnium manages your CDN, it is configured automatically and no action is needed.

To use your own CDN, enter the endpoint URL in the Omnium UI under **Configuration > Settings > Platform > CDN**.

| Setting | Description |
| --- | --- |
| CDN URL | The CDN endpoint URL. Must use HTTPS and end with a trailing slash (e.g. `https://yourcdn.azureedge.net/`). |

When both an Omnium-managed CDN and a custom CDN URL are configured, the custom URL takes precedence. Leave the field empty to use the Omnium-managed CDN, or to serve images directly from storage if no CDN is configured.

Ensure the CDN URL is correct before saving. An incorrect URL will cause product image links in API responses to be broken.
