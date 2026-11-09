# API Reference

Source: https://docs.omnium.no/docs/PurchaseOrders/purchase-order-api

> Complete guide to the Purchase Order API in Omnium. Learn how to create, manage, and fulfill purchase orders, handle deliveries and goods reception, and integrate with your procurement workflows.

## Introduction

Purchase orders in Omnium represent orders placed with suppliers to replenish inventory. They support the full procurement lifecycle — from creating orders based on reorder suggestions, through supplier confirmation, to goods reception at the warehouse.

Purchase orders can also represent **internal transfers** between warehouses, where one warehouse acts as the supplier for another.

### Purchase order lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     New      │────►│  Confirmed   │────►│  InProgress  │────►│  Completed   │
│              │     │              │     │              │     │              │
│ Create PO    │     │ Send to      │     │ Awaiting     │     │ All goods    │
│ Add lines    │     │ supplier     │     │ delivery     │     │ received     │
│ Validate     │     │ Set ETA      │     │              │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────────────┘
       │                    │                    │
       │  ┌──────────────┐  │                    │
       └─►│   Canceled   │◄─┘                    │
          │              │◄──────────────────────┘
          │ PO no longer │
          │ needed       │
          └──────────────┘
```

A purchase order can be canceled from any status that is not marked as completed or read-only.

### How purchase orders connect to other entities

```
┌─────────────────────┐
│   Supplier          │ ◄─── SupplierId on PO
│   (or Warehouse)    │
└─────────┬───────────┘
          │ supplies
          ▼
┌─────────────────────┐       ┌─────────────────────┐
│   Purchase Order    │──────►│   Delivery          │
│                     │       │                     │
│ • Line items        │       │ • Goods reception   │
│ • Requested ETA     │       │ • Tracking info     │
│ • Supplier info     │       │ • Invoice details   │
│ • Tags & properties │       │ • Received qtys     │
└─────────┬───────────┘       └─────────┬───────────┘
          │ reserves                     │ updates
          ▼                              ▼
┌─────────────────────┐       ┌─────────────────────┐
│   Sales Orders      │       │   Inventory         │
│                     │       │                     │
│ Orders waiting for  │       │ Stock levels updated │
│ incoming stock      │       │ on goods reception  │
└─────────────────────┘       └─────────────────────┘
```

### Base URL and authentication

All purchase order endpoints are available at:

```
https://api.omnium.no/api/PurchaseOrders
```

Endpoints require one of two authorization roles:

| Role | Access |
| --- | --- |
| **PurchaseOrderReadGroups** | GET endpoints, adding comments |
| **PurchaseOrderAdminGroups** | All write operations (POST, PUT, PATCH, DELETE) |

* * *

## Purchase order model

The `OmniumPurchaseOrder` model is used for creating, updating, and retrieving purchase orders. Below are the most important properties grouped by usage.

### Key properties

| Property | Type | Description |
| --- | --- | --- |
| **Id** | string | Unique purchase order ID. Auto-generated if not provided on creation. |
| **Status** | string | Current status (must match a configured purchase order status) |
| **SupplierId** | string | ID of the supplier |
| **SupplierName** | string | Supplier display name |
| **StoreId** | string | Receiving warehouse/store ID |
| **RequestedDeliveryDate** | DateTime? | When you need the goods delivered |
| **PurchaseOrderForm** | object | Contains line items and totals |
| **IsDelivery** | bool | When `true`, a delivery entity is created/synced with this PO |
| **DeliveryId** | string | ID of the associated delivery |

### Financial properties

| Property | Type | Description |
| --- | --- | --- |
| SubTotal | decimal | Sum of all line item totals |
| SubTotalExclTax | decimal | Subtotal excluding tax |
| TaxTotal | decimal | Total tax amount |
| Total | decimal | Grand total including tax |
| TotalExclTax | decimal | Grand total excluding tax |
| BillingCurrency | string | Currency code (e.g., "NOK", "EUR") |

### Supplier and purchaser

| Property | Type | Description |
| --- | --- | --- |
| SupplierId | string | Supplier identifier |
| SupplierName | string | Supplier name |
| SupplierEmail | string | Supplier contact email |
| SupplierPhone | string | Supplier contact phone |
| SupplierWarehouseCode | string | Set for internal transfers — the warehouse supplying the goods |
| PurchaserId | string | ID of the person who created the PO |
| PurchaserName | string | Name of the person who created the PO |

### Metadata

| Property | Type | Description |
| --- | --- | --- |
| PurchaseOrderNumber | string | Human-readable PO number |
| ReferenceNumber | string | External reference (e.g., supplier's order number) |
| Name | string | Optional name/description for the PO |
| Origin | string | Where the PO was created from |
| MarketId | string | Associated market |
| Tags | List<string> | Tags for filtering and workflow routing |
| Properties | List<OmniumPropertyItem> | Custom key-value properties |
| ExternalIds | List<OmniumExternalId> | IDs from external systems (ERP, WMS, etc.) |
| Errors | List<OmniumEntityError> | Validation errors on the PO |
| VersionId | string | Optimistic concurrency version |
| Created | DateTime? | Creation timestamp |
| Modified | DateTime? | Last modification timestamp |

### Comments

| Property | Type | Description |
| --- | --- | --- |
| PurchaseOrderNotes | List<OmniumComment> | Internal comments (visible only to your team) |
| PublicPurchaseOrderNotes | List<OmniumComment> | Public comments (can be sent to the supplier) |

* * *

## Purchase order line model

Each purchase order contains a `PurchaseOrderForm` with a list of `LineItems`. A line item represents a product being ordered from the supplier.

### Essential line properties

| Property | Type | Description |
| --- | --- | --- |
| **LineItemId** | string | Unique line ID (auto-generated if not provided) |
| **Code** | string | Product SKU |
| **Quantity** | decimal | Quantity to order |
| **PlacedPrice** | decimal | Unit cost price including tax |
| **PlacedPriceExclTax** | decimal | Unit cost price excluding tax |
| **Currency** | string | Price currency |

### Quantity tracking

These fields track the fulfillment progress of each line:

```
┌─────────────────────────────────────────────────────┐
│                    Quantity: 100                     │
│                                                     │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────┐ │
│  │ Delivered: 60│  │Cancel: 10│  │ Remaining: 30 │ │
│  └──────────────┘  └──────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────┘
```

| Property | Type | Description |
| --- | --- | --- |
| Quantity | decimal | Total quantity ordered |
| DeliveredQuantity | decimal | Quantity received via goods reception |
| CanceledQuantity | decimal | Quantity that has been canceled |
| CountedQuantity | decimal | Quantity verified during counting |

### Product information

| Property | Type | Description |
| --- | --- | --- |
| DisplayName | string | Product display name |
| Gtin | string | Global Trade Item Number (barcode) |
| Size | string | Product size |
| Color | string | Product color |
| Brand | string | Product brand |
| ImageUrl | string | Product image URL |
| SupplierSkuId | string | Supplier's own SKU reference |

### Pricing

| Property | Type | Description |
| --- | --- | --- |
| PlacedPrice | decimal | Unit price (before discounts) |
| PlacedPriceExclTax | decimal | Unit price excluding tax |
| ExtendedPrice | decimal | Total line price (quantity x price, with discounts) |
| ExtendedPriceExclTax | decimal | Extended price excluding tax |
| DiscountedPrice | decimal | Price after line-level discounts |
| LineItemDiscountAmount | decimal | Discount amount |
| TaxRate | decimal | Tax rate percentage |
| TaxTotal | decimal | Tax total for the line |

### Delivery and warehouse

| Property | Type | Description |
| --- | --- | --- |
| DeliveryId | string | ID of the delivery this line belongs to |
| EstimatedTimeOfArrival | DateTime? | Expected arrival date for this line |
| WarehouseCode | string | Receiving warehouse (if different from the PO's store) |
| Location | string | Specific inventory location within the warehouse |
| UpdateStock | bool | Whether goods reception should update inventory |
| UpdateCostPrice | bool | Whether to update the product's cost price on receipt |

### Packaging and units

| Property | Type | Description |
| --- | --- | --- |
| Unit | string | Unit of measurement |
| SupplierPackagingQuantity | decimal? | D-Pack quantity (supplier's package size) |
| AllowSupplierPackageBreak | bool? | Whether partial packages can be ordered |
| SelectedUnit | string | Selected unit if product supports multiple units |
| SelectedUnitConversionFactor | decimal? | Conversion factor from default unit |
| SelectedUnitQuantity | decimal? | Quantity expressed in the selected unit |
| IsPackage | bool | Whether this is a bundled/package product |
| Components | List<OmniumProductComponent> | Component products in a package |

### Virtual warehouse allocations

For warehouses with virtual stock locations (VSL), line items can be pre-allocated to specific locations:

| Property | Type | Description |
| --- | --- | --- |
| VirtualWarehouseAllocations | List<OmniumVirtualWarehouseAllocation> | Allocations to virtual stock locations |
| AllocateBasedOnRules | bool | Auto-allocate to VSLs using inventory rules |
| IsDisabledForAllocation | bool | Exclude this line from allocation |

Each `OmniumVirtualWarehouseAllocation` contains:

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Allocation ID |
| WarehouseCode | string | Virtual warehouse code |
| Quantity | decimal | Allocated quantity |
| DeliveredQuantity | decimal | Quantity delivered to this location |

* * *

## Creating a purchase order

```
POST /api/PurchaseOrders
```

Creates a new purchase order. If `Id` is not provided, Omnium generates one automatically.

### Minimal example

The simplest purchase order needs a supplier, a receiving store, and at least one line item:

```json
{
  "supplierId": "supplier-acme",
  "supplierName": "Acme Supplies",
  "storeId": "warehouse-central",
  "billingCurrency": "NOK",
  "status": "New",
  "requestedDeliveryDate": "2026-03-15T00:00:00Z",
  "purchaseOrderForm": {
    "lineItems": [
      {
        "code": "WIDGET-001",
        "displayName": "Standard Widget",
        "quantity": 500,
        "placedPrice": 12.50,
        "placedPriceExclTax": 10.00,
        "taxRate": 25,
        "currency": "NOK"
      },
      {
        "code": "WIDGET-002",
        "displayName": "Premium Widget",
        "quantity": 200,
        "placedPrice": 25.00,
        "placedPriceExclTax": 20.00,
        "taxRate": 25,
        "currency": "NOK"
      }
    ]
  }
}
```

**Response:** Returns the created `OmniumPurchaseOrder` with auto-generated `Id`, `LineItemId` values, and calculated totals.

### Creating an internal transfer

Internal transfers move stock between your own warehouses. Set `SupplierWarehouseCode` to the source warehouse:

```json
{
  "supplierWarehouseCode": "warehouse-central",
  "storeId": "store-oslo",
  "status": "New",
  "purchaseOrderForm": {
    "lineItems": [
      {
        "code": "WIDGET-001",
        "quantity": 50,
        "placedPrice": 12.50,
        "placedPriceExclTax": 10.00,
        "taxRate": 25,
        "currency": "NOK"
      }
    ]
  }
}
```

### Creating with a delivery

When `IsDelivery` is set to `true`, Omnium automatically creates a `Delivery` entity linked to the purchase order. This enables goods reception tracking:

```json
{
  "supplierId": "supplier-acme",
  "storeId": "warehouse-central",
  "status": "New",
  "isDelivery": true,
  "purchaseOrderForm": {
    "lineItems": [
      {
        "code": "WIDGET-001",
        "quantity": 500,
        "placedPrice": 12.50,
        "placedPriceExclTax": 10.00,
        "taxRate": 25,
        "currency": "NOK"
      }
    ]
  }
}
```

* * *

## Retrieving purchase orders

### Get a single purchase order

```
GET /api/PurchaseOrders/{purchaseOrderId}
```

Returns the full purchase order with all line items, properties, and metadata.

### Get extended purchase order

```
GET /api/PurchaseOrders/Extended/{purchaseOrderId}
```

Returns the purchase order along with related store and supplier details, plus extended line items that include customer order references. This is useful when you need to see which customer orders are waiting for items on this PO.

**Response structure:**

```json
{
  "purchaseOrder": { /* full OmniumPurchaseOrder */ },
  "supplier": { /* OmniumSupplier with contact info */ },
  "store": { /* OmniumStore with warehouse details */ },
  "purchaseOrderLines": [
    {
      "purchaseOrderLine": { /* line item details */ },
      "customerOrderNumber": "ORD-12345"
    }
  ]
}
```

### Search purchase orders

```
POST /api/PurchaseOrders/Search
```

Search and filter purchase orders with pagination. Supports text search, status filtering, date ranges, and more.

**Example: Find all confirmed POs from a specific supplier**

```json
{
  "supplierId": "supplier-acme",
  "selectedStatuses": ["Confirmed", "InProgress"],
  "take": 20,
  "page": 0,
  "sortOrder": "CreatedDescending"
}
```

**Example: Find POs containing a specific product**

```json
{
  "productNumbers": ["WIDGET-001", "WIDGET-002"],
  "selectedStatuses": ["New"],
  "take": 50,
  "page": 0
}
```

**Example: Find POs by date range and tags**

```json
{
  "createdFrom": "2026-01-01T00:00:00Z",
  "createdTo": "2026-01-31T23:59:59Z",
  "tags": ["Urgent"],
  "take": 100,
  "page": 0
}
```

**Response:**

```json
{
  "totalHits": 42,
  "result": [
    { /* OmniumPurchaseOrder */ },
    { /* OmniumPurchaseOrder */ }
  ]
}
```

#### Available search parameters

| Parameter | Type | Description |
| --- | --- | --- |
| SearchText | string | Free-text search across PO fields |
| OrderNumber | string | Search by PO number |
| Email | string | Search by supplier email |
| Phone | string | Search by supplier phone |
| SupplierId | string | Filter by supplier ID |
| SupplierName | string | Filter by supplier name |
| SupplierWarehouseCode | string | Filter by supplier warehouse (internal transfers) |
| OrderType | string | `"PurchaseOrder"` or `"InternalTransfer"` |
| SelectedStatuses | List<string> | Filter by one or more statuses |
| SelectedStores | List<string> | Filter by receiving store names |
| ProductNumbers | List<string> | Filter by product SKUs |
| Tags | List<string> | Include POs with these tags |
| ExcludedTags | List<string> | Exclude POs with these tags |
| ExternalIds | List<string> | Search by external ID values |
| CreatedFrom / CreatedTo | DateTime? | Creation date range |
| ModifiedFrom / ModifiedTo | DateTime? | Modification date range |
| RequestedDeliveryDateFrom / RequestedDeliveryDateTo | DateTime? | Delivery date range |
| Urgent | bool | Only include urgent POs |
| Take | int | Page size |
| Page | int | Page number (0-based) |
| SortOrder | string | Sort order (see below) |

#### Sort order options

| Value | Description |
| --- | --- |
| IdAscending / IdDescending | Sort by purchase order ID |
| StatusAscending / StatusDescending | Sort by status |
| SupplierAscending / SupplierDescending | Sort by supplier name |
| CreatedAscending / CreatedDescending | Sort by creation date |
| EtaAscending / EtaDescending | Sort by estimated delivery date |
| ReferenceNumberAscending / ReferenceNumberDescending | Sort by reference number |

### Scroll through large result sets

For processing large volumes of purchase orders, use the scroll API instead of paginated search. The scroll API maintains a cursor for efficient iteration.

**Step 1: Initialize the scroll**

```
POST /api/PurchaseOrders/Scroll
```

Request body is the same as the search endpoint (but `Page` is ignored).

**Step 2: Continue scrolling**

```
GET /api/PurchaseOrders/Scroll/{scrollId}
```

Use the `scrollId` from the previous response to get the next batch. Continue until the result set is empty.

**Response:**

```json
{
  "scrollId": "DXF1ZXJ5QW5kRmV0Y2g...",
  "totalHits": 5000,
  "result": [
    { /* OmniumPurchaseOrder */ }
  ]
}
```

* * *

## Updating purchase orders

Omnium provides three update strategies depending on your needs:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Update Strategies                           │
├─────────────────────┬───────────────────┬───────────────────────┤
│       PUT           │      PATCH        │  UpdateStatus (POST)  │
│                     │                   │                       │
│ Full replacement    │ Partial update    │ Change status and     │
│ of the PO           │ of specific       │ run workflow steps    │
│                     │ fields only       │                       │
│ Use when you have   │ Use when you need │ Use when advancing    │
│ the complete PO     │ to change a few   │ the PO through its    │
│ model               │ properties        │ lifecycle             │
└─────────────────────┴───────────────────┴───────────────────────┘
```

### Full update (PUT)

```
PUT /api/PurchaseOrders?updateAtpValues={true|false}
```

Replaces the entire purchase order. You must send the complete model. Uses a resource lock (30 seconds) to prevent concurrent updates.

Set `updateAtpValues=true` if you want Omnium to recalculate Available-to-Promise values for affected inventories.

Returns `409 Conflict` if another update is in progress.

### Partial update (PATCH)

```
PATCH /api/PurchaseOrders/{purchaseOrderId}?updateAtpValues={true|false}
```

Updates only the fields you provide. Unset fields remain unchanged.

**Example: Update supplier reference and requested delivery date**

```json
{
  "referenceNumber": "SUPP-REF-2026-001",
  "requestedDeliveryDate": "2026-04-01T00:00:00Z"
}
```

**Example: Add a new line item to an existing PO**

By default, `KeepExistingOrderLines` is `true`, meaning new lines are merged with existing ones:

```json
{
  "purchaseOrderForm": {
    "lineItems": [
      {
        "code": "WIDGET-003",
        "displayName": "Economy Widget",
        "quantity": 1000,
        "placedPrice": 7.50,
        "placedPriceExclTax": 6.00,
        "taxRate": 25,
        "currency": "NOK"
      }
    ]
  }
}
```

**Example: Replace all line items**

Set `KeepExistingOrderLines` to `false` to replace the entire line item list:

```json
{
  "keepExistingOrderLines": false,
  "purchaseOrderForm": {
    "lineItems": [
      {
        "code": "WIDGET-001",
        "quantity": 750,
        "placedPrice": 11.00,
        "placedPriceExclTax": 8.80,
        "taxRate": 25,
        "currency": "NOK"
      }
    ]
  }
}
```

#### Patch merge behavior

| Property | Default | Behavior |
| --- | --- | --- |
| KeepExistingListItems | true | `true`: merge new properties with existing. `false`: replace the entire properties list. |
| KeepExistingOrderLines | true | `true`: merge new lines (matched by LineItemId) with existing. `false`: replace all lines. |

### Update and run workflow

```
POST /api/PurchaseOrders/UpdateAndRunWorkflow?updateAtpValues={true|false}
```

Updates the purchase order **and** executes the workflow steps configured for the current status. Use this when you need to both modify data and trigger actions (e.g., export to ERP, send notifications).

**Request body:** Full `OmniumPurchaseOrder`

**Response:** `OmniumPurchaseOrderWorkflowExecutionResult` (see [Workflow execution results](purchase-order-api.md#workflow-execution-results))

### Update status

```
POST /api/PurchaseOrders/{purchaseOrderId}/UpdateStatus
```

Changes the purchase order status and runs the workflow steps configured for the new status. This is the primary endpoint for advancing a PO through its lifecycle.

Uses a resource lock (300 seconds) to ensure workflow steps complete without interference.

**Example: Confirm a purchase order**

```json
{
  "status": "Confirmed",
  "expectedDeliveryDate": "2026-03-20T00:00:00Z"
}
```

**Response:**

```json
{
  "isAborted": false,
  "purchaseOrder": { /* updated OmniumPurchaseOrder */ },
  "purchaseOrderActionExecutionResults": [
    {
      "actionType": "ExportPurchaseOrder",
      "actionStatus": "Success",
      "translateKey": "ExportPurchaseOrder",
      "cancelWorkflow": false,
      "isInvisible": false
    },
    {
      "actionType": "SetExpectedDeliveryDate",
      "actionStatus": "Success",
      "translateKey": "SetExpectedDeliveryDate",
      "cancelWorkflow": false,
      "isInvisible": false
    }
  ]
}
```

### Bulk update

```
PUT /api/PurchaseOrders/UpdateMany
```

Updates multiple purchase orders at once. Send a list of complete `OmniumPurchaseOrder` objects.

* * *

## Workflow execution results

When you use the status update or workflow endpoints, the response includes detailed results for each workflow step that was executed.

### Result model

| Property | Type | Description |
| --- | --- | --- |
| IsAborted | bool | `true` if the workflow was aborted due to an error |
| PurchaseOrder | OmniumPurchaseOrder | The updated purchase order after workflow execution |
| PurchaseOrderActionExecutionResults | List | Results for each workflow step |

### Action execution result

| Property | Type | Description |
| --- | --- | --- |
| ActionType | string | The workflow action that was executed |
| ActionStatus | string | `"Success"`, `"Warning"`, or `"Error"` |
| ErrorReason | string | Error description (if the step failed) |
| TranslateKey | string | Translation key for the result message |
| CancelWorkflow | bool | Whether this step caused the workflow to abort |
| IsInvisible | bool | Whether the result should be hidden from end users |

If `IsAborted` is `true`, the purchase order status is reverted to its previous value. Check the `PurchaseOrderActionExecutionResults` to identify which step failed and why.

* * *

## Line item operations

### Split a line item

```
POST /api/PurchaseOrders/{purchaseOrderId}/OrderLines/Split
```

Splits one or more line items into separate lines. This is useful when part of an order needs to be shipped to a different warehouse, or when you need to track partial deliveries separately.

```
Before split (Line A: 100 units)
┌──────────────────────────────────────────┐
│  WIDGET-001  │  Qty: 100                │
└──────────────────────────────────────────┘

After split (Line A: 70 units, Line B: 30 units)
┌──────────────────────────────────────────┐
│  WIDGET-001  │  Qty: 70                 │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│  WIDGET-001  │  Qty: 30  (new line)     │
└──────────────────────────────────────────┘
```

**Example: Split 30 units from a line**

```json
[
  {
    "lineItemId": "line-001",
    "quantityToSplit": 30
  }
]
```

**Example: Split with virtual warehouse allocations**

When the line has VSL allocations, you can specify which allocations to move to the new line:

```json
[
  {
    "lineItemId": "line-001",
    "quantityToSplit": 30,
    "virtualWarehouseAllocationsToSplit": [
      {
        "id": "alloc-vsl-store-b",
        "quantity": 30
      }
    ],
    "newLineItemId": "line-001-split"
  }
]
```

**Response:** Returns the updated `OmniumPurchaseOrder` with the split lines.

### Cancel a line item

```
POST /api/PurchaseOrders/{purchaseOrderId}/OrderLines/{lineItemId}/Cancel
```

Cancels the remaining quantity on a line item. The `CanceledQuantity` is set to the undelivered portion. Already delivered quantities are not affected.

* * *

## Comments

Purchase orders support both internal and public (supplier-facing) comments. Both endpoints support email and SMS notifications.

### Add an internal comment

```
POST /api/PurchaseOrders/{purchaseOrderId}/AddInternalPurchaseOrderComment
```

### Add a public comment

```
POST /api/PurchaseOrders/{purchaseOrderId}/AddPublicPurchaseOrderComment
```

**Example:**

```json
{
  "body": "Please expedite shipment — customer order is urgent.",
  "subject": "Urgent delivery request"
}
```

**Response:** Returns the updated list of comments.

* * *

## Deleting a purchase order

```
DELETE /api/PurchaseOrders/{id}
```

Permanently deletes the purchase order. Returns `404` if the PO does not exist.

Deletion is irreversible. Consider using the `OrderCanceled` status instead if you need to retain the PO for historical records.

* * *

## Merging purchase orders

```
POST /api/PurchaseOrders/{purchaseOrderId}/Merge
```

Merges a source purchase order into a destination purchase order. All line items from the source are moved to the destination, all cross-system references are updated, and the source is deleted. Returns the updated destination purchase order.

### Request body

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| **DestinationPurchaseOrderId** | string | Yes | The ID of the purchase order to merge into |

The `{purchaseOrderId}` in the URL is the **source** purchase order (the one being merged and deleted).

### Example

```
POST /api/PurchaseOrders/PO-100/Merge

{
  "destinationPurchaseOrderId": "PO-200"
}
```

### Validation rules

Both purchase orders must satisfy these conditions, otherwise the request returns `400 Bad Request`:

*   Both purchase orders must exist
*   Source and destination must be different
*   Both must have the **same supplier** (`SupplierId`)
*   Both must have the **same warehouse** (`StoreId`)

### What gets updated

When merging source into destination, Omnium automatically updates all references across the system:

| Entity | Field | What happens |
| --- | --- | --- |
| **Purchase order line items** | `PurchaseOrderId` | All source lines are moved to the destination |
| **Customer order lines** | `ReservedInventoryPurchaseOrderId` | Reservations are re-pointed to the destination |
| **Customer order forms** | `PurchaseOrderId` | Order-level PO references are updated |
| **Inventory ATP entries** | `PurchaseOrderId` | Available-to-Promise entries reference the destination |

Historical and immutable data is intentionally **not** updated. This includes inventory transactions, stats order lines, and analytics reorder suggestions — these retain the original purchase order ID as a historical record.

Line item IDs are preserved during the merge. Only the `PurchaseOrderId` on each line changes, so `ReservedInventoryPurchaseOrderLineId` and `InventoryAtp.PurchaseOrderLineId` references remain valid without modification.

### Response

Returns the updated destination `OmniumPurchaseOrder` with all merged line items.

* * *

## Recalculate ATP values

```
POST /api/PurchaseOrders/{id}
```

Triggers a recalculation of Available-to-Promise (ATP) values for all inventories referenced in the purchase order. Use this after external changes to inventory or delivery dates that Omnium may not be aware of.

* * *

## Working with deliveries

Deliveries represent the physical receipt of goods from a supplier. A purchase order can have one or more deliveries, and each delivery tracks which line items and quantities were received.

### Delivery lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Created    │────►│  In Transit  │────►│   Received   │
│              │     │              │     │              │
│ PO confirmed │     │ Goods shipped│     │ Goods receipt │
│ Delivery     │     │ by supplier  │     │ completed    │
│ created      │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Delivery model

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Delivery ID |
| WarehouseCode | string | Receiving warehouse |
| SupplierWarehouseCode | string | Source warehouse (for internal transfers) |
| DeliveryStatus | string | Current delivery status |
| DeliveryTrackingNumber | string | Carrier tracking number |
| DeliveryTrackingLink | string | URL to carrier tracking page |
| DeliveryProvider | string | Shipping carrier name |
| InvoiceNumber | string | Supplier invoice number |
| InvoiceDate | DateTime? | Invoice date |
| EstimatedTimeOfDeparture | DateTime? | Expected departure from supplier |
| EstimatedTimeOfArrival | DateTime? | Expected arrival at warehouse |
| IsCounted | bool | Whether quantities were verified before goods reception |
| OrderType | string | `"PurchaseOrder"` or `"InternalTransfer"` |
| Suppliers | List<string> | Supplier names on this delivery |
| SupplierIds | List<string> | Supplier IDs on this delivery |
| Tags | List<string> | Delivery tags |
| Properties | List<OmniumPropertyItem> | Custom properties |
| DeliveryNotes | List<OmniumComment> | Internal comments |
| PublicDeliveryNotes | List<OmniumComment> | Public comments |

### Goods reception

Goods reception is the process of recording which items have arrived at the warehouse. When goods are received:

1.  **Line item quantities** are updated (`DeliveredQuantity` incremented)
2.  **Inventory levels** are increased at the receiving warehouse
3.  **Cost prices** can be updated on products (if `UpdateCostPrice` is set)
4.  **Customer order reservations** are fulfilled (orders waiting for this stock are updated)
5.  **PO status** may auto-advance to completed (if configured via `GoodsReceptionCompletedStatus`)

#### Goods reception line model

| Property | Type | Description |
| --- | --- | --- |
| **LineItemId** | string | The PO line item being received |
| **DeliveredQuantity** | decimal | Quantity received in this reception |
| CostPrice | decimal | Currently unused — reserved for future use. The recorded inventory cost is derived from the PO line (DiscountedPriceExclTax / Quantity), not from this field. |
| WarehouseCode | string | Receiving warehouse (optional, defaults to PO warehouse) |
| UpdateProductCostPrice | bool | Update the product master with this cost price |
| ReceiveAsUnallocated | bool | For VSL warehouses: receive as unallocated inventory |
| AllocateBasedOnRules | bool | For VSL warehouses: auto-allocate using inventory rules |
| GoodsReceptionId | string | Idempotency key to prevent duplicate reception |

Goods reception is performed via the Delivery API. Use `POST /api/Deliveries/{deliveryId}/ProcessGoodsReception` to record received quantities. The delivery ID is available on the purchase order's `DeliveryId` property.

#### Goods reception flow

```
                    Goods Reception Request
                           │
                           ▼
                ┌─────────────────────┐
                │ Update PO line      │
                │ DeliveredQuantity   │
                └──────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────────┐
    │   Update     │ │  Update  │ │   Fulfill    │
    │  inventory   │ │  cost    │ │   customer   │
    │   levels     │ │  prices  │ │   orders     │
    └──────────────┘ └──────────┘ └──────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Check if PO is      │
                │ fully received      │
                │ → Auto-complete     │
                └─────────────────────┘
```

* * *

## Practical scenarios

### Scenario 1: Complete procurement workflow

This example walks through a typical purchase order lifecycle from creation to completion.

**Step 1: Create the purchase order**

```
POST /api/PurchaseOrders
```

```json
{
  "supplierId": "supplier-nordic-parts",
  "supplierName": "Nordic Parts AB",
  "supplierEmail": "orders@nordicparts.se",
  "storeId": "warehouse-oslo",
  "billingCurrency": "NOK",
  "status": "New",
  "requestedDeliveryDate": "2026-03-01T00:00:00Z",
  "isDelivery": true,
  "tags": ["Import"],
  "purchaseOrderForm": {
    "lineItems": [
      {
        "code": "NP-BOLT-M8",
        "displayName": "M8 Stainless Bolt",
        "quantity": 5000,
        "placedPrice": 2.50,
        "placedPriceExclTax": 2.00,
        "taxRate": 25,
        "currency": "NOK",
        "supplierSkuId": "NP-10042"
      },
      {
        "code": "NP-NUT-M8",
        "displayName": "M8 Stainless Nut",
        "quantity": 5000,
        "placedPrice": 1.25,
        "placedPriceExclTax": 1.00,
        "taxRate": 25,
        "currency": "NOK",
        "supplierSkuId": "NP-10043"
      }
    ]
  }
}
```

**Step 2: Confirm and send to supplier**

```
POST /api/PurchaseOrders/PO-2026-001/UpdateStatus
```

```json
{
  "status": "Confirmed",
  "expectedDeliveryDate": "2026-03-01T00:00:00Z"
}
```

This triggers configured workflow steps (e.g., export to ERP, send notification to supplier).

**Step 3: Move to in-progress when goods are shipped**

```
POST /api/PurchaseOrders/PO-2026-001/UpdateStatus
```

```json
{
  "status": "InProgress"
}
```

**Step 4: Receive goods** (via the delivery/goods reception API)

Goods reception updates the `DeliveredQuantity` on each line. If all lines are fully received and `GoodsReceptionCompletedStatus` is configured, the PO automatically moves to the completed status.

### Scenario 2: Partial delivery

When a supplier ships part of the order:

**First delivery — 3000 of 5000 bolts arrive:**

The goods reception records `DeliveredQuantity: 3000` on the bolt line. The PO remains in `InProgress` because not all items are received.

**Second delivery — remaining 2000 bolts and all 5000 nuts arrive:**

After this reception, all lines are fully delivered. If `GoodsReceptionCompletedStatus` is set to `"Completed"`, the PO automatically moves to that status.

### Scenario 3: Splitting lines for multiple warehouses

You ordered 500 widgets on a single line, but need to distribute them across two warehouses:

```
POST /api/PurchaseOrders/PO-2026-002/OrderLines/Split
```

```json
[
  {
    "lineItemId": "line-widgets",
    "quantityToSplit": 200,
    "newLineItemId": "line-widgets-store-b"
  }
]
```

Now you have two lines:

*   `line-widgets`: 300 units for the original warehouse
*   `line-widgets-store-b`: 200 units that can be assigned to a different warehouse via PATCH

* * *

## Error handling

### HTTP status codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 400 | Bad request — check request body for validation errors |
| 404 | Purchase order not found |
| 409 | Conflict — another update is in progress (resource locked) |
| 500 | Server error — check error details in response |

### Concurrency control

Omnium uses two mechanisms to prevent conflicting updates:

1.  **Resource locking** — Write endpoints (PUT, PATCH, UpdateStatus) acquire a distributed lock on the purchase order. If another request is already modifying the same PO, you'll receive a `409 Conflict`. The lock is held for the duration of the operation (30 seconds for updates, 300 seconds for status changes with workflows).

2.  **Optimistic concurrency** — The `VersionId` field tracks the version of the purchase order. If the PO has been modified since you last retrieved it, the update will fail.

**Best practice:** Always retrieve the latest version before updating, and handle `409` responses by re-fetching and retrying.

### Validation errors

Validation errors are returned in the `Errors` list on the purchase order:

```json
{
  "errors": [
    {
      "key": "NonPurchasableAssortmentCode",
      "message": "Product WIDGET-X has a non-purchasable assortment code",
      "severity": "Error",
      "occurred": "2026-02-11T10:30:00Z"
    }
  ]
}
```

Common error keys:

| Key | Description |
| --- | --- |
| NonPurchasableAssortmentCode | Product has an assortment code in the non-purchasable list |
| WrongOrMissingSupplierOnProduct | Product's supplier doesn't match the PO supplier |
| PackageBreak | Package quantity constraints violated |
| ProductDiscontinued | Product has been discontinued |

* * *

## API endpoint reference

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/PurchaseOrders/{id}` | Get a purchase order by ID |
| GET | `/api/PurchaseOrders/Extended/{id}` | Get PO with store, supplier, and customer order details |
| POST | `/api/PurchaseOrders/Search` | Search and filter purchase orders |
| POST | `/api/PurchaseOrders/Scroll` | Initialize scroll for large result sets |
| GET | `/api/PurchaseOrders/Scroll/{scrollId}` | Continue scrolling |
| POST | `/api/PurchaseOrders` | Create a new purchase order |
| PUT | `/api/PurchaseOrders` | Full update of a purchase order |
| PATCH | `/api/PurchaseOrders/{id}` | Partial update of a purchase order |
| POST | `/api/PurchaseOrders/UpdateAndRunWorkflow` | Update and execute workflow |
| POST | `/api/PurchaseOrders/{id}/UpdateStatus` | Change status and run workflow |
| PUT | `/api/PurchaseOrders/UpdateMany` | Bulk update multiple POs |
| DELETE | `/api/PurchaseOrders/{id}` | Delete a purchase order |
| POST | `/api/PurchaseOrders/{id}/Merge` | Merge into another purchase order |
| POST | `/api/PurchaseOrders/{id}` | Recalculate ATP values |
| POST | `/api/PurchaseOrders/{id}/OrderLines/Split` | Split line items |
| POST | `/api/PurchaseOrders/{id}/OrderLines/{lineId}/Cancel` | Cancel a line item |
| POST | `/api/PurchaseOrders/{id}/AddPublicPurchaseOrderComment` | Add public comment |
| POST | `/api/PurchaseOrders/{id}/AddInternalPurchaseOrderComment` | Add internal comment |
