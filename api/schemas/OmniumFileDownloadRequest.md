# OmniumFileDownloadRequest

**Fields:**

- `path`: string, required — Relative path of the file
- `fileName`: string, nullable — Optional - file name of the asset, as returned in the asset's fileName. The path is an identifier for the underlying service and does not have to contain a file extension, so without this the file is served as application/octet-stream.

**Used directly by endpoints in:**

- [Assets | Files](../endpoints/assets/files.md)
