# API Reference

Source: https://docs.omnium.no/docs/PurchaseOrders/Suppliers/supplier-api

> Complete guide to the Supplier API in Omnium. Learn how to create, search, update, and manage suppliers through the public REST API.

## Introduction

The Supplier API lets you manage the companies and entities that provide goods to your business. Suppliers are referenced by purchase orders and products, and carry logistics parameters such as lead time and shipping terms that drive Omnium's replenishment features.

This page covers the public API at `https://api.omnium.no/api/Suppliers`. For an overview of the supplier concept, see the [Suppliers overview](../Suppliers.md).

### How suppliers connect to other entities

```
┌─────────────────────────┐
│       Supplier          │
│                         │
│  • Contact info         │
│  • Lead time            │
│  • Shipping terms       │
│  • Store assignments    │
│  • Reorder suggestions  │
└────────┬────────────────┘
         │
         │ SupplierId
         ├──────────────────────────────────────┐
         ▼                                      ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│    Purchase Order        │      │       Product           │
│                         │      │                         │
│  • SupplierId           │      │  • SupplierId (primary) │
│  • SupplierName         │      │  • AdditionalSuppliers  │
│  • SupplierEmail        │      │  • SupplierLeadTime     │
│  • SupplierPhone        │      │  • SupplierSkuId        │
│  • SupplierWarehouse-   │      │                         │
│    Code (internal POs)  │      │                         │
└─────────────────────────┘      └─────────────────────────┘
```

When you update a supplier's `DefaultLeadTime`, the new value is automatically propagated to all products linked to that supplier. This keeps product-level lead time data in sync without requiring separate product updates.

### Base URL and authentication

All supplier endpoints are available at:

```
https://api.omnium.no/api/Suppliers
```

Endpoints require one of two authorization roles:

| Role | Access |
| --- | --- |
| **SupplierRead** | `GET` endpoints and search |
| **SupplierAdmin** | All write operations (`PUT`, `DELETE`) |

The `Admin` and `ApiOwner` roles include full access to all supplier endpoints.

* * *

## Supplier model

The `OmniumSupplier` model is used for creating, updating, and retrieving suppliers. Properties are grouped by usage below.

### Identity and contact

| Property | Type | Description |
| --- | --- | --- |
| **Id** | string | Unique supplier identifier. **Required** for all write operations. |
| **Name** | string | Supplier display name |
| TaxId | string | Tax registration / VAT number |
| Email | string | Primary email address |
| Phone | string | Primary phone number |
| Address | [Address](supplier-api.md#address-model) | Primary address |
| Addresses | List<[Address](supplier-api.md#address-model)\> | Additional addresses (billing, delivery, etc.) |
| Contacts | List<[ContactPerson](supplier-api.md#contact-person-model)\> | Contact persons at the supplier (max 250) |

### Logistics and purchasing

These properties drive purchase order defaults and replenishment calculations.

| Property | Type | Description |
| --- | --- | --- |
| DefaultLeadTime | int? | Standard delivery time in days. Changes propagate to linked products automatically. |
| DefaultLeadTimeSafetyMarginDays | int? | Buffer days added to lead time to account for variability |
| DefaultOrderIntervalDays | int? | Typical purchasing cycle in days — how many days of demand each PO should cover |
| PaymentTerms | int? | Agreed payment terms in days (e.g., `30` = Net 30) |
| Incoterms | string | Delivery terms agreement (e.g., `FOB`, `DDP`, `EXW`) |
| ShippingProvider | string | Standard freight carrier (e.g., `PostNord`, `DHL`) |
| ShipmentCost | decimal | Default shipping cost per order |
| PreferredCurrency | string | ISO currency code for transactions (e.g., `NOK`, `EUR`) |
| PreferredLanguage | string | ISO language code for communication (e.g., `en`, `nb`) |

```
Lead time calculation for replenishment:

 ◄──────── DefaultLeadTime ────────►◄── SafetyMargin ──►
 │                                  │                    │
 ┌──────────────────────────────────┬────────────────────┐
 │ Order placed                     │ Expected arrival   │ Safety buffer
 │ with supplier                    │ (optimistic)       │ ends here
 └──────────────────────────────────┴────────────────────┘
 Day 0                              Day N                Day N+M

 N = DefaultLeadTime
 M = DefaultLeadTimeSafetyMarginDays
```

### Internal transfers

A supplier can represent one of your own stores for internal stock transfers:

| Property | Type | Description |
| --- | --- | --- |
| OmniumStoreId | string | Links the supplier to an internal Omnium store. When set, purchase orders to this supplier represent internal stock movements. |

### Extensibility

| Property | Type | Description |
| --- | --- | --- |
| Tags | List<string> | Free-text labels for categorization and filtering |
| Properties | List<[PropertyItem](supplier-api.md#property-item-model)\> | Custom key-value properties (max 500) |
| ExternalIds | List<[ExternalId](supplier-api.md#external-id-model)\> | Identifiers from external systems such as ERP or accounting (max 250) |
| StoreIds | List<string> | Store IDs linked to this supplier (max 1000) |
| StoreGroupIds | List<string> | Store group IDs linked to this supplier |

### Versioning and timestamps

| Property | Type | Description |
| --- | --- | --- |
| VersionId | string | Current version identifier (read-only, managed by Omnium) |
| PreviousVersionId | string | Previous version identifier |
| Created | DateTime? | Record creation timestamp (set automatically) |
| Modified | DateTime? | Last modification timestamp (set automatically) |

* * *

## Get a supplier

```
GET /api/Suppliers/{supplierId}
```

Returns a single supplier by ID.

**Response:** `200 OK` with an `OmniumSupplier` object.

### Example request

```
GET /api/Suppliers/supplier-acme
```

### Example response

```json
{
  "id": "supplier-acme",
  "name": "Acme Supplies AS",
  "taxId": "NO123456789MVA",
  "email": "orders@acme-supplies.no",
  "phone": "+4712345678",
  "address": {
    "name": "Acme Supplies AS",
    "line1": "Industriveien 42",
    "postalCode": "0580",
    "city": "Oslo",
    "countryCode": "NO"
  },
  "contacts": [
    {
      "firstName": "Kari",
      "lastName": "Nordmann",
      "email": "kari@acme-supplies.no",
      "phone": "+4798765432",
      "roles": ["Sales"],
      "isPrimaryContact": true
    }
  ],
  "preferredCurrency": "NOK",
  "preferredLanguage": "nb",
  "defaultLeadTime": 14,
  "defaultLeadTimeSafetyMarginDays": 3,
  "defaultOrderIntervalDays": 30,
  "paymentTerms": 30,
  "incoterms": "DDP",
  "shippingProvider": "PostNord",
  "shipmentCost": 250.00,
  "storeIds": ["warehouse-central", "warehouse-south"],
  "tags": ["domestic", "priority"],
  "properties": [
    { "key": "MinimumOrderValue", "value": "5000", "valueType": "Number" }
  ],
  "externalIds": [
    { "providerName": "Fortnox", "id": "SUP-10042" }
  ],
  "versionId": "a1b2c3d4",
  "previousVersionId": "z9y8x7w6",
  "created": "2025-06-15T10:30:00Z",
  "modified": "2026-02-10T14:22:00Z"
}
```

### Error responses

| Status | Description |
| --- | --- |
| `400 Bad Request` | Missing or empty `supplierId` parameter |
| `404 Not Found` | No supplier exists with the given ID |

* * *

## Get a supplier version

```
GET /api/Suppliers/{supplierId}/{versionId}
```

Returns a specific historical version of a supplier. Use this to audit changes or compare versions. The `VersionId` of the current version is returned with every supplier response.

**Response:** `200 OK` with an `OmniumVersion<OmniumSupplier>` object.

### Version response model

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Supplier ID |
| VersionId | string | Version identifier |
| Created | DateTime | When this version was created |
| CreatedBy | string | User who made the change |
| Type | string | Entity type (`Supplier`) |
| Value | OmniumSupplier | The supplier data at this version |

### Example request

```
GET /api/Suppliers/supplier-acme/a1b2c3d4
```

### Example response

```json
{
  "id": "supplier-acme",
  "versionId": "a1b2c3d4",
  "created": "2026-02-10T14:22:00Z",
  "createdBy": "admin@tenant.com",
  "type": "Supplier",
  "value": {
    "id": "supplier-acme",
    "name": "Acme Supplies AS",
    "defaultLeadTime": 14,
    "...": "full supplier object"
  }
}
```

### Error responses

| Status | Description |
| --- | --- |
| `400 Bad Request` | Missing `supplierId` or `versionId` parameter |
| `404 Not Found` | No version found for the given supplier ID and version ID |

* * *

## Search suppliers

```
POST /api/Suppliers/Search
```

Searches for suppliers using free-text queries, date filters, and property-based filtering. Results are paginated.

**Response:** `200 OK` with an `OmniumSearchResult<OmniumSupplier>` object.

### Search request model

| Property | Type | Description |
| --- | --- | --- |
| Take | int | Number of results per page. Defaults to `10` if `0` or omitted. |
| Page | int | Page number (1-based). Defaults to `1` if `0` or omitted. |
| SearchText | string | Free-text search query (see [search behavior](supplier-api.md#search-behavior) below) |
| SupplierId | string | Filter by exact supplier ID |
| StoreIds | List<string> | Filter by linked store IDs (max 1000) |
| CreatedFrom | DateTime? | Suppliers created on or after this date |
| CreatedTo | DateTime? | Suppliers created on or before this date |
| ModifiedFrom | DateTime? | Suppliers modified on or after this date |
| ModifiedTo | DateTime? | Suppliers modified on or before this date |
| Properties | List<[PropertyItem](supplier-api.md#property-item-model)\> | Filter by custom properties (max 250) |
| ExternalIds | List<string> | Filter by external ID values (max 250) |

### Search behavior

When `SearchText` is provided, Omnium searches across these fields:

```
┌──────────────────────────────────────────────────────────┐
│  SearchText matches against:                             │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Name       │  │   Id         │  │   Phone      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Email      │  │ Address.City │  │Address.Line1 │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
```

The search uses three matching strategies combined with OR logic, so any match is returned:

1.  **Fuzzy matching** — tolerates up to 2 character typos (e.g., `"acm"` finds `"Acme"`)
2.  **Prefix matching** — matches the beginning of the supplier name (e.g., `"Acm"` finds `"Acme Supplies"`)
3.  **Multi-field matching** — searches across all six fields simultaneously

All search terms within the query are combined with AND logic, so `"acme oslo"` matches suppliers where both words appear across the searched fields.

### Search response model

| Property | Type | Description |
| --- | --- | --- |
| TotalHits | long | Total number of matching suppliers |
| Result | List<OmniumSupplier> | Supplier objects for the current page |

### Example: Basic text search

Find all suppliers matching "acme":

```json
{
  "searchText": "acme",
  "take": 20,
  "page": 1
}
```

### Example: Filter by date range

Find suppliers modified in the last 7 days:

```json
{
  "modifiedFrom": "2026-02-10T00:00:00Z",
  "take": 50,
  "page": 1
}
```

### Example: Filter by store

Find suppliers linked to specific warehouses:

```json
{
  "storeIds": ["warehouse-central", "warehouse-south"],
  "take": 20,
  "page": 1
}
```

### Example: Filter by custom property

Find suppliers with a specific classification:

```json
{
  "properties": [
    { "key": "SupplierTier", "value": "Gold" }
  ],
  "take": 20,
  "page": 1
}
```

If you omit the `key` and provide only a `value`, the search matches any property with that value regardless of key.

### Example: Filter by external ID

Find suppliers by their ID in an external system (e.g., ERP):

```json
{
  "externalIds": ["SUP-10042"],
  "take": 10,
  "page": 1
}
```

### Example: Combining filters

Filters are combined with AND logic. This example finds suppliers named "Acme" that are linked to "warehouse-central" and were modified in 2026:

```json
{
  "searchText": "acme",
  "storeIds": ["warehouse-central"],
  "modifiedFrom": "2026-01-01T00:00:00Z",
  "modifiedTo": "2026-12-31T23:59:59Z",
  "take": 20,
  "page": 1
}
```

### Error responses

| Status | Description |
| --- | --- |
| `400 Bad Request` | Missing request body |

* * *

## Create or update a supplier

```
PUT /api/Suppliers
```

Creates a new supplier or updates an existing one. If a supplier with the given `Id` already exists, it is overwritten with the provided data. This is a **full replacement** — all fields you want to keep must be included in the request.

This endpoint performs a full replacement. Any fields omitted from the request body will be set to their default values (null, 0, empty list). Always read the existing supplier first and merge your changes before updating.

**Response:** `200 OK` with the saved `OmniumSupplier` object (including server-managed fields like `Modified` and `VersionId`).

### Example: Creating a new supplier

```json
{
  "id": "supplier-nordic-parts",
  "name": "Nordic Parts AB",
  "taxId": "SE5567891234",
  "email": "orders@nordicparts.se",
  "phone": "+46701234567",
  "address": {
    "name": "Nordic Parts AB",
    "line1": "Hamngatan 15",
    "postalCode": "111 47",
    "city": "Stockholm",
    "countryCode": "SE"
  },
  "contacts": [
    {
      "firstName": "Erik",
      "lastName": "Svensson",
      "email": "erik@nordicparts.se",
      "phone": "+46709876543",
      "roles": ["Sales", "Support"],
      "isPrimaryContact": true
    }
  ],
  "preferredCurrency": "SEK",
  "preferredLanguage": "sv",
  "defaultLeadTime": 7,
  "defaultLeadTimeSafetyMarginDays": 2,
  "defaultOrderIntervalDays": 14,
  "paymentTerms": 30,
  "incoterms": "DDP",
  "shippingProvider": "PostNord",
  "shipmentCost": 350.00,
  "storeIds": ["warehouse-central"],
  "tags": ["international", "electronics"],
  "properties": [
    { "key": "MinimumOrderValue", "value": "2000", "valueType": "Number" },
    { "key": "CertifiedISO9001", "value": "true", "valueType": "Boolean" }
  ],
  "externalIds": [
    { "providerName": "Dynamics365", "id": "V-00142" }
  ]
}
```

### Example: Setting up a supplier for internal transfers

When one of your own warehouses acts as a supplier (e.g., a central warehouse supplying stores), link it using `OmniumStoreId`:

```json
{
  "id": "internal-central-warehouse",
  "name": "Central Warehouse (Internal)",
  "omniumStoreId": "warehouse-central",
  "storeIds": ["store-oslo", "store-bergen", "store-trondheim"],
  "preferredCurrency": "NOK"
}
```

Purchase orders to this supplier will behave as internal stock transfers.

### Read-modify-write pattern

Since the update is a full replacement, the recommended pattern for partial updates is:

```
1. GET  /api/Suppliers/{id}         → Read current supplier
2. Modify the fields you need       → Apply your changes
3. PUT  /api/Suppliers              → Save the full object back
```

### Side effect: Lead time propagation

If you change `DefaultLeadTime`, Omnium updates the `SupplierLeadTime` on every product linked to this supplier. This happens automatically during the save and may take a moment for suppliers with many products.

### Error responses

| Status | Description |
| --- | --- |
| `400 Bad Request` | Missing request body or missing `Id` field |

* * *

## Update many suppliers

```
PUT /api/Suppliers/UpdateMany
```

Updates multiple suppliers in a single request. Each supplier in the list follows the same full-replacement semantics as the single update endpoint.

All supplier IDs in the list must be unique. The endpoint validates this and returns an error if duplicates are found.

**Response:** `200 OK` on success (no body).

### Example request

```json
[
  {
    "id": "supplier-acme",
    "name": "Acme Supplies AS",
    "defaultLeadTime": 10,
    "preferredCurrency": "NOK",
    "storeIds": ["warehouse-central"]
  },
  {
    "id": "supplier-nordic-parts",
    "name": "Nordic Parts AB",
    "defaultLeadTime": 7,
    "preferredCurrency": "SEK",
    "storeIds": ["warehouse-central"]
  }
]
```

### Error responses

| Status | Description |
| --- | --- |
| `400 Bad Request` | Empty list, or duplicate supplier IDs in the list. The error message includes the first duplicate ID found. |

* * *

## Delete a supplier

```
DELETE /api/Suppliers/{id}
```

Permanently deletes a supplier. This removes the supplier from search and storage.

Deleting a supplier does not remove references to it from existing purchase orders or products. Those entities retain the `SupplierId` and `SupplierName` as historical data.

**Response:** `200 OK` on success.

### Error responses

| Status | Description |
| --- | --- |
| `404 Not Found` | No supplier exists with the given ID |

* * *

## Supporting models

### Address model

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Address label (e.g., company name or location) |
| Line1 | string | Street address |
| Line2 | string | Additional address info (floor, building, etc.) |
| StreetNumber | string | Street/house number if not part of Line1 |
| ApartmentNumber | string | Apartment number |
| City | string | City name |
| State | string | State or county |
| CountryCode | string | Country code (e.g., `NO`, `SE`, `US`) |
| CountryName | string | Country name |
| PostalCode | string | Postal / ZIP code |
| RegionCode | string | Region code |
| RegionName | string | Region name |
| Purposes | List<string> | Address purpose labels (e.g., `Billing`, `Delivery`) |
| ExternalId | string | ID for mapping to external systems |
| Email | string | Email associated with this address |
| Phone | string | Phone associated with this address |
| LocationName | string | Name of the physical location |
| Properties | List<[PropertyItem](supplier-api.md#property-item-model)\> | Custom key-value properties |

### Contact person model

| Property | Type | Description |
| --- | --- | --- |
| Id | string | Contact person ID |
| FirstName | string | First name |
| LastName | string | Last name |
| Phone | string | Phone number |
| Email | string | Email address |
| Address | [Address](supplier-api.md#address-model) | Contact address |
| Roles | List<string> | Roles in the company (e.g., `Sales`, `Logistics`, `Accounting`) |
| Notify | bool | Whether this contact receives notifications |
| IsPrimaryContact | bool | Whether this is the primary contact |
| PrivateCustomerId | string | Reference to an Omnium private customer record |
| ExternalIds | List<[ExternalId](supplier-api.md#external-id-model)\> | External system identifiers |
| Properties | List<[PropertyItem](supplier-api.md#property-item-model)\> | Custom key-value properties |

### Property item model

| Property | Type | Description |
| --- | --- | --- |
| Key | string | Property key (e.g., `MinimumOrderValue`) |
| Value | string | Property value (e.g., `5000`) |
| ValueType | string | Data type hint: `String`, `Number`, `Boolean`, `DateTime`, `Xhtml` |
| KeyGroup | string | Group name for organizing properties in the UI |

### External ID model

| Property | Type | Description |
| --- | --- | --- |
| ProviderName | string | Name of the external system (e.g., `Fortnox`, `Dynamics365`, `SAP`) |
| Id | string | The supplier's ID in that external system |

* * *

## Practical scenarios

### Scenario: ERP supplier synchronization

When integrating Omnium with an ERP system, use external IDs to maintain cross-references. On initial import, create each supplier with the ERP ID stored in `ExternalIds`. For ongoing syncs, use the Search endpoint to find suppliers by their external ID.

**Initial import:**

```json
{
  "id": "supplier-12345",
  "name": "Fabrikam Industries",
  "email": "orders@fabrikam.com",
  "preferredCurrency": "EUR",
  "defaultLeadTime": 21,
  "externalIds": [
    { "providerName": "Dynamics365", "id": "V-00098" }
  ]
}
```

**Find by ERP ID during sync:**

```json
{
  "externalIds": ["V-00098"],
  "take": 1,
  "page": 1
}
```

### Scenario: Multi-warehouse supplier assignment

Assign a supplier to specific warehouses to control which locations can order from them. This is especially useful when different warehouses source from different regional suppliers.

```json
{
  "id": "supplier-south-logistics",
  "name": "South Logistics GmbH",
  "storeIds": ["warehouse-hamburg", "warehouse-munich"],
  "storeGroupIds": ["region-south"],
  "preferredCurrency": "EUR",
  "defaultLeadTime": 5
}
```

### Scenario: Delta sync for changed suppliers

To periodically fetch suppliers that have been modified (e.g., for a nightly sync job), use the `ModifiedFrom` filter:

```json
{
  "modifiedFrom": "2026-02-16T00:00:00Z",
  "take": 100,
  "page": 1
}
```

Page through results until `Result` is empty or the number of returned items is less than `Take`.

### Scenario: Using properties for business classification

Properties let you attach custom structured data to suppliers without schema changes. Combine with property-based search to build custom workflows.

```
┌─────────────────────────────────────────────────┐
│  Supplier: Acme Supplies AS                     │
│                                                 │
│  Properties:                                    │
│  ┌─────────────────────┬────────────┬────────┐  │
│  │ Key                 │ Value      │ Type   │  │
│  ├─────────────────────┼────────────┼────────┤  │
│  │ SupplierTier        │ Gold       │ String │  │
│  │ MinimumOrderValue   │ 5000       │ Number │  │
│  │ CertifiedISO9001    │ true       │ Boolean│  │
│  │ ContractExpires     │ 2027-01-01 │DateTime│  │
│  └─────────────────────┴────────────┴────────┘  │
└─────────────────────────────────────────────────┘
```

**Search for all Gold-tier suppliers:**

```json
{
  "properties": [
    { "key": "SupplierTier", "value": "Gold" }
  ],
  "take": 50,
  "page": 1
}
```

* * *

## Error handling

All endpoints return standard HTTP status codes. Error responses include a descriptive message in the response body as a plain string.

| Status | Meaning |
| --- | --- |
| `200 OK` | Request succeeded |
| `400 Bad Request` | Invalid input — check the error message for details |
| `401 Unauthorized` | Missing or invalid authentication token |
| `403 Forbidden` | Authenticated but lacking required role |
| `404 Not Found` | The requested supplier or version does not exist |
