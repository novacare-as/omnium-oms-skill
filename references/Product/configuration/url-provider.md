# Omnium URL Provider

Source: https://docs.omnium.no/docs/Product/configuration/url-provider

> Configure automatic SEO-friendly URL generation for products in Omnium

The Omnium URL Provider is a built-in feature that automatically generates SEO-friendly URLs for products each time they are saved or updated. When enabled, it populates the `uri` and `uriSegment` fields on the product's SEO information — without requiring any external integration.

This is useful for product feeds, sitemap generation, and downstream systems that consume product URLs from Omnium, such as an e-commerce frontend or a PIM integration.

* * *

## Configuration

URL Provider settings are found under **Configuration → Settings → Products → General Product Settings → Url**.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `isOmniumUrlProviderEnabled` | bool | false | Enables the built-in URL provider. When enabled, Omnium automatically generates SEO URLs for products on save. |
| `omniumUrlProviderTemplate` | string | null | Template string for generating the product `uri`. Supports dynamic placeholders. If left empty, only `uriSegment` is populated. |

### Sample

```
"ProductSettings": {
  "IsOmniumUrlProviderEnabled": true,
  "OmniumUrlProviderTemplate": "/products/{productCategory}/{productId}"
}
```

* * *

## URL Template Placeholders

The template string supports the following placeholders. All values are converted to URL-friendly format: lowercase, ASCII equivalents for accented characters, and hyphens in place of spaces and punctuation.

| Placeholder | Resolved value |
| --- | --- |
| `{productId}` | The product's SKU if set, otherwise the product ID. |
| `{productName}` | The product's name. |
| `{productCategory}` | The product's main category name. Falls back to the literal string `category` if no main category is found. |
| `{productLanguage}` | The product's language code (e.g. `en`, `sv`). Useful for tenants with product content languages enabled. |

### Example templates

| Template | Example output |
| --- | --- |
| `/product/{productId}` | `/product/sku-12345` |
| `/products/{productCategory}/{productId}` | `/products/mens-shoes/sku-12345` |
| `/product/{productId}?name={productName}` | `/product/sku-12345?name=running-shoe-pro` |
| `/{productCategory}/{productName}` | `/mens-shoes/running-shoe-pro` |
| `/{productLanguage}/products/{productId}` | `/en/products/sku-12345` |
| `/{productLanguage}/{productCategory}/{productName}` | `/en/mens-shoes/running-shoe-pro` |

* * *

## SEO Fields Populated

When the URL Provider runs on product save, the following SEO fields are set on the product:

| Field | How it is populated |
| --- | --- |
| `uriSegment` | Always set to the URL-friendly product name (e.g. `running-shoe-pro`). |
| `uri` | Set by applying the template with placeholder substitution. Only populated when a template is configured. |
| `title` | Set to the product name if the field is not already populated. |
| `description` | Set from the product's short description (HTML stripped) if not already populated. |
| `keywords` | Set from the product property `meta_keyword` if not already present. |

Existing values for `title`, `description`, and `keywords` are never overwritten. The URL Provider only populates these fields when they are empty.

* * *

## Behavior Notes

**SKU vs. product ID** — `{productId}` uses the product's SKU when one is set. If no SKU exists, the product ID is used instead.

**Main category fallback** — `{productCategory}` resolves using the category marked as the main category, or the category whose parent is the root. If neither is found, the placeholder resolves to the string `category`. Ensure products have a main category assigned if you rely on this placeholder.

**Language resolution** — `{productLanguage}` uses the language set on the product. A variant without its own language inherits the language of its parent product, and a product without a language falls back to the tenant's default product content language. The placeholder therefore always resolves to a language code, never to an empty segment.

**Template required for `uri`** — If `omniumUrlProviderTemplate` is empty, the URL Provider only sets `uriSegment`. The `uri` field is not populated.

**No bulk re-index** — Enabling or changing the template does not automatically update existing products. URLs are regenerated when a product is next saved through any channel (UI, API, import, or integration sync).

* * *

## Enabling the URL Provider

1.  Go to **Configuration → Settings → Products** and click **Edit**.
2.  Open the **General Product Settings** tab.
3.  In the **Url** panel, enable the **Enable Omnium URL provider** toggle.
4.  Enter your URL structure in the **URL provider template** field.
5.  Click **Save**.

After saving, trigger a product save (manual edit, re-import, or integration sync) to generate URLs for existing products.
