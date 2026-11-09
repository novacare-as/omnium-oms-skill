# OmniumAsset

**Fields:**

- `parentId`: string, nullable — Optional - ID of parent media or directory
- `assetId`: string, nullable — Optional - ID of asset. If not provided, an id will be generated
- `assetType`: string, nullable — Optional - Type of asset. Free text, except the built-in value "External": an external asset is link-only. It is never copied to Omnium storage, Url mirrors ExternalUrl, and the file is always served live from the external host so a change at the source shows on every product without re-import. Use it for files you do not want Omnium to download, such as certification marks shared by many products. External assets cannot be the main image, so do not point MainImageUrl at one. Changing an already uploaded asset to "External" switches Url to the external url and leaves the old copy in storage.
- `sortOrder`: integer (int32), nullable — Optional - Item sort index. Default is position in list
- `url`: string, nullable — Calculated: Omnium url. For "External" assets this is the ExternalUrl itself, since they are not copied to Omnium storage.
- `externalUrl`: string, nullable — External URL (original URL, will be uploaded and Omnium url will be added to Url). If FileName is not provided, externalUrl has to contain the file extension (e.g. .jpg). For "External" assets the url is kept as-is and never uploaded; use https, since an http image is blocked as mixed content in browsers.
- `fileName`: string, nullable — Preferred file name, used when uploaded to Omnium. Required to contain the correct file extension. File name and path from external URL will be used as fallback if null.
- `isMainImage`: boolean — If true, asset will be used as main image on parent item
- `name`: string, nullable — Optional - Asset name
- `description`: string, nullable — Optional - Asset description
- `altText`: string, nullable — Optional - Image alternative text
- `purpose`: string, nullable — Optional - Asset purpose or use
- `forceUpload`: boolean, nullable — Force upload external url to Omnium (if both external and internal url exists)
- `fileLoaderType`: string, nullable — Calculated - the service that serves the file, for assets that are not reachable through a plain url. Pass it as the serviceType to /api/Files/{serviceType}/Download, together with Url as the path, to download the file. Empty for assets stored in Omnium, which are downloaded from Url directly.
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Optional - List of properties. Key value pairs with any non strongly typed properties.
- `created`: string (date-time) — Date created
- `modified`: string (date-time) — Date modified
- `contentType`: string, nullable — Calculated - File type, e.g. image/jpg
- `length`: integer (int64) — Calculated - File size in bytes

**Used directly by endpoints in:**

- [Customers | B2B | Assets](../endpoints/customers/b2b-assets.md)
- [Products | Assets](../endpoints/products/assets.md)
- [Projects | Assets](../endpoints/projects/assets.md)
