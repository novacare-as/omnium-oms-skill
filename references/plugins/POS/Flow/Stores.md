# Stores

Source: https://docs.omnium.no/docs/plugins/POS/Flow/Stores

> Store, warehouse, and organization synchronization from Omnium to Flow Retail.

## Overview

The Flow integration exports stores **one-way** from Omnium to Flow Retail. When a store is exported, the integration also creates the associated organization, warehouses, and optionally a store-specific price list in Flow.

Only stores marked as **primary stores** are exported. Non-primary stores (e.g. standalone warehouses) are synced as warehouses under their parent primary store.

## Export Trigger

Stores are exported via the `IStoreExporter` interface when a store is saved or updated in Omnium. The export processes all stores together, grouped by market or market group.

## Export Process

1.  **Filter** — Only stores with `IsPrimaryStore = true` are exported
2.  **Group by tenant** — Stores are grouped by market (or market group if `UseMarketGroupFlowTenants` is enabled)
3.  **For each store:**
    *   Ensure the **organization** exists in Flow (create if missing)
    *   **Create or update** the store in Flow
    *   **Create or update warehouses** associated with the store
    *   Optionally create a **store price list** in Flow

## Store Mapping

### Create

| Flow | Omnium | Notes |
| --- | --- | --- |
| `storeUid` | `Id` | [UID-sanitized](../Flow.md#uid-sanitization) |
| `name` | `Name` |  |
| `address` | `StreetName` + `StreetNumber` | Combined street address |
| `city` | `Address.City` |  |
| `postalCode` | `Address.Zipcode` |  |
| `countryCode` | `Address.CountryCode` |  |
| `email` | `Email` |  |
| `phone` | `PhoneNumber` |  |
| `latitude` | `Latitude` | Parsed from string |
| `longitude` | `Longitude` | Parsed from string |
| `isActive` | `!IsInactive` | Inverted — active when not inactive |
| `externalId` | First available market |  |
| `vatNumber` | `OrganizationalNumber` |  |
| `organizationUid` | `OrganizationalNumber` | [UID-sanitized](../Flow.md#uid-sanitization), falls back to configured default |
| `salesPriceUid` | Configured `MainPricesListUid` | From connector properties |
| `purchaseNumberSeriesUid` | Configured value | From connector properties |
| `voucherNumberSeriesUid` | Configured value | From connector properties |
| `openingHours` | Per-day opening hours | See [Opening Hours](Stores.md#opening-hours) |

### Update

The update mapping is identical to create, with the following exceptions:

| Field | Behavior on Update |
| --- | --- |
| `defaultReturnWarehouseUid` | Set to first available return location |
| `defaultWarehouseUid` | Set to first available return location |
| `purchaseNumberSeriesUid` | Not sent |
| `salesPriceUid` | Not sent |
| `voucherNumberSeriesUid` | Not sent |

## Opening Hours

Opening hours are synced for all seven days of the week. Each day is sent in the format `"HH:mm - HH:mm"` (e.g. `"09:00 - 17:00"`). If no opening hours are configured for a day, an empty string is sent.

## Organizations

Each store belongs to an organization in Flow. During export, the integration checks if the organization exists and creates it if needed.

The organization UID is derived from the store's `OrganizationalNumber`. If the store has no organizational number, the configured `OrganizationUid` from the connector properties is used as a fallback.

### Organization Mapping

| Flow | Omnium | Notes |
| --- | --- | --- |
| `organizationUid` | `OrganizationalNumber` | [UID-sanitized](../Flow.md#uid-sanitization) |
| `name` | `Name` |  |
| `address` | `Address` | Full address string |
| `city` | `Address.City` |  |
| `postalCode` | `Address.Zipcode` |  |
| `countryCode` | `Address.CountryCode` |  |
| `email` | `Email` |  |
| `phone` | `PhoneNumber` |  |
| `isActive` | `!IsInactive` |  |

## Warehouses

Each primary store in Flow can have multiple warehouses attached to it. The integration creates warehouses from two sources:

1.  **The store itself** — If the store has `IsWarehouse = true`, a warehouse is created with the store's own ID
2.  **Linked warehouses** — Each entry in the store's `AvailableWarehouses` list becomes a warehouse under the store in Flow

### Warehouse Mapping

| Flow | Omnium | Notes |
| --- | --- | --- |
| `warehouseUid` | `Id` | [UID-sanitized](../Flow.md#uid-sanitization) |
| `name` | `Name` | Store/warehouse name |

Warehouses are created or updated during every store export. If warehouse creation fails, the error is recorded on the store but does not prevent the store itself from being exported.

## Store Price Lists

When `StorePriceListsInFlow` is enabled, the integration creates a dedicated price list in Flow for each store. The price list UID matches the store ID, and the price list name matches the store name.

This is useful when stores need individual pricing that differs from the main price list.

## Configuration Reference

| Setting | Description | Default |
| --- | --- | --- |
| `OrganizationUid` | Default organization UID for stores without an organizational number | Required |
| `MainPricesListUid` | Main price list UID assigned to stores on creation | Required |
| `PurchaseNumberSeriesUid` | Number series for purchase orders in the store | If using PO export |
| `VoucherNumberSeriesUid` | Number series for vouchers in the store | If using vouchers |
| `StorePriceListsInFlow` | Create a per-store price list in Flow | `false` |
| `UseMarketGroupFlowTenants` | Group stores by market group instead of individual market | `false` |

## Error Handling

The store export tracks errors separately for store creation and warehouse creation. If an export fails, the error is recorded on the store entity in Omnium with a market-specific key (e.g. `FlowRetail{marketId} storeExport`). Errors are automatically cleared on the next successful export.
