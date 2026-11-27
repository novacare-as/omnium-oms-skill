# API Reference

Source: https://docs.omnium.no/docs/Projects/project-api

A project in Omnium is used to handle all activities that are completed over a period of time. There are multiple use cases for projects, such as return and claim workflows, long-running sales, or selling services. Projects connect collections of carts, orders, and returns with all other data needed for project management.

### Key project features

*   Workflows
*   Partners
*   Project parts
*   Change orders
*   Transactions
*   Products with per-product status, reason codes, and custom properties

## Project Model

See the full project model definition:
[Omnium Project Model](https://api.omnium.no/documentation/index.html#/model-OmniumProject)

* * *

## Project Products

Projects can contain a list of products, typically used for claim projects or projects created from purchase orders. Each product in a project supports:

*   **Status** — per-product status (e.g. `Active`, `Cancelled`)
*   **CancellationCode** — complaint/cancellation reason code
*   **CancellationReason** — free text reason for cancellation or complaint
*   **Properties** — custom key-value properties per product

### Product Model

| Property | Type | Description |
| --- | --- | --- |
| `name` | string | Product name |
| `skuId` | string | Product SKU ID |
| `productId` | string | Product ID |
| `quantity` | decimal | Number of products |
| `status` | string | Per-product status (e.g. Active, Cancelled) |
| `cancellationCode` | string | Complaint/cancellation reason code |
| `cancellationReason` | string | Free text complaint/cancellation reason |
| `properties` | array | Custom properties (key/value pairs) |
| `referenceType` | string | Reference type (defined on project type) |
| `orderType` | string | Order type the product is related to |
| `orderId` | string | ID of the associated order |

### Update Product Status

Update the status of individual products within a project.

**Endpoint:** `POST /api/Projects/UpdateProjectProductStatus`

**Authorization:** Project Admin

**Request body:**

```json
{
  "projectId": "project-123",
  "productStatusUpdates": [
    {
      "skuId": "SKU-001",
      "status": "Cancelled",
      "cancellationCode": "Defect",
      "cancellationReason": "Product was damaged on arrival"
    },
    {
      "skuId": "SKU-002",
      "status": "Active"
    }
  ]
}
```

| Property | Type | Description |
| --- | --- | --- |
| `projectId` | string | The project ID (required) |
| `productStatusUpdates` | array | List of per-product status updates (required) |
| `productStatusUpdates[].skuId` | string | SKU ID of the product to update |
| `productStatusUpdates[].status` | string | New status for this product |
| `productStatusUpdates[].cancellationCode` | string | Cancellation/complaint code (optional) |
| `productStatusUpdates[].cancellationReason` | string | Free text reason (optional) |

**Response:** Updated `OmniumProject`

### Products via PUT / PATCH

Products can also be included in the standard `PUT /api/Projects` and `PATCH /api/Projects` endpoints by including the `products` array in the request body. When included via PATCH, the entire product list is replaced.

**Example (PATCH):**

```json
{
  "id": "project-123",
  "products": [
    {
      "skuId": "SKU-001",
      "productId": "PROD-001",
      "name": "Product A",
      "quantity": 1,
      "status": "Active",
      "properties": [
        { "key": "Color", "value": "Red" }
      ]
    }
  ]
}
```

* * *

## Searching Projects

Use the `SearchProjects` endpoint to find projects:

[Search Projects API](https://api.omnium.no/documentation/index.html#/Projects/ProjectsSearch)

### Example Request

```json
{
  "take": 10,
  "page": 1,
  "query": "Oppussing bad"
}
```

This request retrieves the first 10 projects that match the search query.

### Sorting Results

By default, projects are returned sorted by creation date in descending order. To sort the results, add the `sortOrder` property to the request:

```json
{
  "take": 10,
  "page": 1,
  "query": "Oppussing bad",
  "sortOrder": "CreatedDescending"
}
```

This example sorts projects by creation date in descending order.

#### Available Sort Orders

*   CreatedAscending
*   CreatedDescending
*   ModifiedAscending
*   ModifiedDescending
*   ProjectTypeNameAscending
*   ProjectTypeNameDescending
*   CustomerAscending
*   CustomerDescending
*   PartnerAscending
*   PartnerDescending
*   ProjectDeadlineAscending
*   ProjectDeadlineDescending
*   ProjectValueAscending
*   ProjectValueDescending
*   ProjectStoreContactAscending
*   ProjectStoreContactDescending
*   ProjectCurrentWorkflowStepAscending
*   ProjectCurrentWorkflowStepDescending

## Project Types

See the full project type model definition:
[Omnium Project Type Model](https://api.omnium.no/documentation/index.html#/model-OmniumProjectType)
