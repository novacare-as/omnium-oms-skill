# OmniumOrderExportRequest

Request model for exporting orders to a connector

**Fields:**

- `connectorId`: string, nullable — The connector ID to export orders to, for example "f60203b3-82fa-4f5c-8578-7777d4faf5e4", "19527b9b-6ebf-4d34-8e32-28ff618ff168"
- `connectorName`: string, nullable — Exporter name, the name of the exporter for example "inretrn", "sitoo"
- `orderIds`: List<string>, required — List of order IDs to export

**Used directly by endpoints in:**

- [Orders | Others](../endpoints/orders/others.md)
