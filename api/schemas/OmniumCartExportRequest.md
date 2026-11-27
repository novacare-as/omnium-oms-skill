# OmniumCartExportRequest

Request model for exporting carts to a connector

**Fields:**

- `connectorId`: string, nullable — The connector ID to export carts to, for example "f60203b3-82fa-4f5c-8578-7777d4faf5e4"
- `connectorName`: string, nullable — Exporter name, the name of the exporter for example "sitoo", "shopify"
- `cartIds`: List<string>, required — List of cart IDs to export

**Used directly by endpoints in:**

- [Carts | Update](../endpoints/carts/update.md)
