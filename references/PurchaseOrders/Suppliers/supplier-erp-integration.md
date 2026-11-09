# Integration Guide

Source: https://docs.omnium.no/docs/PurchaseOrders/Suppliers/supplier-erp-integration

> Step-by-step guide for integrating supplier data from an external system (such as M3, Dynamics 365, or SAP) into Omnium using the Suppliers API.

## Overview

This guide walks through how to synchronize supplier data from an external ERP system into Omnium using the public Suppliers API. It covers the most common integration pattern: pushing supplier master data from the ERP into Omnium, keeping both systems in sync.

The guide uses a generic ERP as the example, but the same approach applies to any system — M3, Dynamics 365, SAP, or custom solutions.

* * *

## Key concepts

### Upsert behavior

The `PUT /api/Suppliers` endpoint is an **upsert** — it creates the supplier if it doesn't exist, or updates it if it does. You don't need separate logic for insert vs. update.

```
PUT /api/Suppliers
├─ Supplier ID exists?   → Update existing record
└─ Supplier ID missing?  → Create new record
```

This means your integration can use the same endpoint and payload for both initial import and ongoing synchronization.

### Full replacement

The update is a **full replacement**. Any fields omitted from the request body are reset to their default values (null, 0, or empty). Always include all fields you want to keep.

If you only want to update a few fields, first read the existing supplier with `GET /api/Suppliers/{id}`, merge your changes, then send the full object back with `PUT`.

### External IDs for cross-referencing

Use the `ExternalIds` field to store the supplier's ID in your ERP system. This makes it easy to look up suppliers in Omnium by their ERP identifier.

```
"externalIds": [
  { "providerName": "M3", "id": "Y10500" }
]
```

| Property | Description |
| --- | --- |
| `providerName` | Name of the external system (e.g., `M3`, `SAP`, `Dynamics365`) |
| `id` | The supplier's identifier in that system |

* * *

## Recommended payload

Only the `id` field is required. All other fields are optional. Below is a payload with the fields most commonly used in ERP integrations.

### Minimal example

```
PUT /api/Suppliers

{
  "id": "SUPPLIER-40100",
  "name": "Pacific Coast Distributors",
  "externalIds": [
    { "providerName": "M3", "id": "Y40100" }
  ]
}
```

### Full example with common fields

```
PUT /api/Suppliers

{
  "id": "SUPPLIER-40100",
  "name": "Pacific Coast Distributors LLC",
  "taxId": "82-3456789",
  "email": "purchasing@paccoast.com",
  "phone": "+1-503-555-0172",
  "preferredCurrency": "USD",
  "preferredLanguage": "en",
  "defaultLeadTime": 10,
  "defaultLeadTimeSafetyMarginDays": 3,
  "defaultOrderIntervalDays": 14,
  "paymentTerms": 30,
  "incoterms": "FOB",
  "shippingProvider": "UPS",
  "shipmentCost": 45.00,
  "address": {
    "name": "Pacific Coast Distributors LLC",
    "line1": "2200 NW Industrial Ave",
    "line2": "Suite 300",
    "city": "Portland",
    "state": "OR",
    "postalCode": "97209",
    "countryCode": "US",
    "countryName": "United States"
  },
  "contacts": [
    {
      "firstName": "Sarah",
      "lastName": "Mitchell",
      "email": "sarah.mitchell@paccoast.com",
      "phone": "+1-503-555-0180",
      "roles": ["Sales"],
      "isPrimaryContact": true
    },
    {
      "firstName": "James",
      "lastName": "Rivera",
      "email": "james.rivera@paccoast.com",
      "phone": "+1-503-555-0185",
      "roles": ["Logistics"]
    }
  ],
  "externalIds": [
    { "providerName": "M3", "id": "Y40100" }
  ],
  "tags": ["domestic", "preferred"],
  "storeIds": ["warehouse-west", "warehouse-central"]
}
```

### Field reference for ERP integrations

The table below highlights the fields most relevant for ERP synchronization. For the complete model, see the [API Reference](supplier-api.md#supplier-model).

| Field | Type | Description |
| --- | --- | --- |
| **id** | string | **Required.** Unique supplier identifier. Use the same ID consistently across syncs. |
| **name** | string | Supplier company name |
| **taxId** | string | Tax ID, EIN, or VAT number |
| **email** | string | Primary email for order communication |
| **phone** | string | Primary phone number |
| **preferredCurrency** | string | ISO currency code (e.g., `USD`, `EUR`, `GBP`) |
| **preferredLanguage** | string | ISO language code (e.g., `en`, `de`, `fr`) |
| **defaultLeadTime** | int | Standard delivery time in days |
| **paymentTerms** | int | Payment terms in days (e.g., `30` for Net 30) |
| **incoterms** | string | Delivery terms (e.g., `FOB`, `DDP`, `EXW`, `CIF`) |
| **address** | object | Primary address (see [Address model](supplier-api.md#address-model)) |
| **contacts** | array | Contact persons (see [Contact model](supplier-api.md#contact-person-model)) |
| **externalIds** | array | Cross-references to ERP and other systems |

* * *

## Integration patterns

### Pattern 1: Full sync (initial import)

For the initial import of all suppliers, use `PUT /api/Suppliers/UpdateMany` to send suppliers in batches.

```
PUT /api/Suppliers/UpdateMany

[
  {
    "id": "SUPPLIER-40100",
    "name": "Pacific Coast Distributors LLC",
    "email": "purchasing@paccoast.com",
    "preferredCurrency": "USD",
    "defaultLeadTime": 10,
    "externalIds": [
      { "providerName": "M3", "id": "Y40100" }
    ]
  },
  {
    "id": "SUPPLIER-40200",
    "name": "Great Lakes Supply Co",
    "email": "orders@greatlakessupply.com",
    "preferredCurrency": "USD",
    "defaultLeadTime": 7,
    "externalIds": [
      { "providerName": "M3", "id": "Y40200" }
    ]
  },
  {
    "id": "SUPPLIER-40300",
    "name": "Southeastern Materials Inc",
    "email": "sales@sematerials.com",
    "preferredCurrency": "USD",
    "defaultLeadTime": 14,
    "externalIds": [
      { "providerName": "M3", "id": "Y40300" }
    ]
  }
]
```

All supplier IDs in a single `UpdateMany` request must be unique. Duplicate IDs will return a `400 Bad Request` error.

### Pattern 2: Incremental sync (ongoing updates)

For ongoing synchronization, send only the suppliers that have changed since the last sync. Use the single `PUT /api/Suppliers` endpoint for individual updates, or `UpdateMany` for batches.

The recommended flow:

```
1. ERP detects changed suppliers since last sync
2. For each changed supplier:
   a. GET /api/Suppliers/{id}         → Read current state from Omnium
   b. Merge ERP changes onto the existing object
   c. PUT /api/Suppliers              → Save the merged result
3. Record the sync timestamp for next run
```

If you control all supplier data from the ERP (i.e., Omnium users don't edit supplier fields that the ERP also manages), you can skip the read-merge step and push directly.

### Pattern 3: Looking up suppliers by ERP ID

To find a supplier in Omnium using the ERP system's ID:

```
POST /api/Suppliers/Search

{
  "externalIds": ["Y40100"],
  "take": 1,
  "page": 1
}
```

This searches across all `ExternalIds` on all suppliers and returns matches regardless of `providerName`. If you have multiple external systems, the supplier ID values should be unique across providers, or you can narrow results by checking the `providerName` in the response.

* * *

## Choosing a supplier ID strategy

The `id` field is the primary key in Omnium. Choose a consistent strategy:

| Strategy | Example | Pros | Cons |
| --- | --- | --- | --- |
| Use the ERP ID directly | `Y40100` | Simple, no mapping needed | May conflict if multiple ERPs exist |
| Prefix with system name | `M3-Y40100` | Avoids conflicts across systems | Slightly longer IDs |
| Generate a stable ID | `supplier-40100` | Clean, system-agnostic | Requires mapping table or ExternalIds |

Regardless of strategy, always store the ERP ID in `ExternalIds` so you can search for suppliers by their ERP identifier.

* * *

## Error handling

| Status | Meaning | Action |
| --- | --- | --- |
| `200 OK` | Supplier created or updated | Success — continue |
| `400 Bad Request` | Missing `id` field, empty body, or duplicate IDs in batch | Check the error message and fix the payload |
| `401 Unauthorized` | Invalid or missing API token | Verify authentication credentials |
| `403 Forbidden` | Token lacks **SupplierAdmin** role | Check API user role assignments |

* * *

## Tips for a robust integration

*   **Always include `externalIds`** — This is the easiest way to maintain cross-references between systems.
*   **Use `UpdateMany` for batch imports** — More efficient than individual calls when syncing multiple suppliers.
*   **Handle the full-replacement behavior** — If Omnium users also edit suppliers, read before writing to avoid overwriting their changes.
*   **Set `defaultLeadTime`** — This drives Omnium's purchase order and reorder suggestion features. Changes automatically propagate to all linked products.
*   **Monitor `Modified` timestamps** — Use the [Search endpoint](supplier-api.md#search-suppliers) with `ModifiedFrom` to detect changes made in Omnium that need to sync back to the ERP.
