# OmniumUpdateProjectProductStatusRequest

Request model for updating the status of individual products in a project

**Fields:**

- `projectId`: string, nullable — Project ID
- `productStatusUpdates`: List<[`OmniumProductStatusUpdate`](OmniumProductStatusUpdate.md)>, nullable — Per-product status updates

**Used directly by endpoints in:**

- [Projects](../endpoints/projects.md)
