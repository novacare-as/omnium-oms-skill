# Assets

Source: https://docs.omnium.no/docs/Product/api-reference/assets

> Getting started with assets

## Media File Model

Details on the media file model can be found [here](https://api.omnium.no/documentation/index.html#/model-OmniumAsset).

## Uploading Assets

Populate the `Assets` property with `OmniumAsset` objects to upload assets. External images from the `ExternalUrl` property will be uploaded to Omnium's CDN, replacing the `Url` property.

### Link-Only Assets

Assets with `AssetType` set to `External` are not uploaded. `Url` is set to the `ExternalUrl` and the file stays on the external host, so a file shared by many products, such as a certification mark, is stored once at its source. See [Link-only assets](../product-assets/asset-model.md#link-only-assets-external).

### Force Upload

If `ForceUpload` is set to true:

*   The `ExternalUrl` will be uploaded.
*   The `Url` will be replaced with the new CDN URL.
*   After replacement, `ForceUpload` is reset to false to avoid re-uploading.

* * *
