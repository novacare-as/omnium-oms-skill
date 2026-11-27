# OmniumEpcTagRefreshRequest

Selects which EPC tags a product-info refresh should re-resolve. The refresh runs in the
background: it fills missing skuIds and re-syncs brand/product name from the products
currently in Omnium (e.g. after source tags arrived before their products, or after a
brand rename). Send an empty object to sweep all tags missing product info.

**Fields:**

- `skuIds`: List<string>, nullable — Only refresh tags with these SKU codes.
- `gtins`: List<string>, nullable — Only refresh tags with these GTINs.
- `onlyMissingProductInfo`: boolean — When no SkuIds/Gtins are given: true (default) sweeps only tags missing skuId or brand, false re-syncs every tag.

**Used directly by endpoints in:**

- [Products | RFID Tags](../endpoints/products/rfid-tags.md)
