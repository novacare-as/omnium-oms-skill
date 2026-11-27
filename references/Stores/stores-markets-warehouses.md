# Stores, Markets & Warehouses

Source: https://docs.omnium.no/docs/Stores/stores-markets-warehouses

> How Omnium's location model works — the unified store entity, markets as regional context, warehouses as inventory locations, and how they all connect.

## The Unified Location Model

Understanding Omnium's location architecture starts with one key insight: **stores and warehouses are the same entity**.

In Omnium, a "store" is any location associated with your business — a physical retail shop, an e-commerce site, a central warehouse, or a regional distribution center. What distinguishes a warehouse from a store is a single flag: `IsWarehouse`. When set to `true`, the store can hold inventory. When `false`, it's a pure sales channel that relies on other stores (warehouses) for fulfillment.

This unified model means you manage all locations through the same API, the same data model, and the same configuration tools. A physical retail store with its own stock is both a sales channel _and_ a warehouse. A web shop is a store that points to one or more warehouses for inventory.

```
           ALL LOCATIONS ARE STORES
  ┌──────────────────────────────────────────────┐
  │                                              │
  │  Physical Store     Web Shop                 │
  │  (IsWarehouse:      (IsWarehouse:            │
  │   true)              false)                  │
  │                                              │
  │  Central Warehouse  Pickup Point             │
  │  (IsWarehouse:      (IsWarehouse:            │
  │   true)              false)                  │
  │                                              │
  └──────────┬─────────────────┬─────────────────┘
             │                 │
             ▼                 ▼

              MARKET CONTEXT
  ┌──────────────────────────────────────────────┐
  │  Market: NOR               Market: SWE       │
  │  NOK · Norwegian · 25%    SEK · Swedish · 25%│
  └──────────────────────────────────────────────┘
```

* * *

## The Three Concepts

### Stores — your locations

A store represents any location in your business. Every order in Omnium is tied to a store (the seller), and every shipment is tied to a warehouse (the sender) — but both are the same type of entity.

Stores serve four core purposes:

| Purpose | How it works |
| --- | --- |
| **Sales channel** | Orders are always connected to a store, tracking where the sale originated |
| **Access control** | Users are granted access to specific stores, restricting what data they can see |
| **Inventory location** | Stores with `IsWarehouse: true` hold product inventory |
| **Product assortment** | Stores can define which product categories are available for sale |

Key store flags that define behavior:

| Flag | Effect |
| --- | --- |
| `IsWarehouse` | Store can hold inventory |
| `IsPrimaryWarehouse` | Default warehouse for the tenant |
| `IsWebWarehouse` | Inventory available for online sales |
| `IsReturnLocation` | Store accepts returns |
| `IsPrimaryStore` | Primary store designation |
| `IsPublicVisible` | Visible to end customers (e.g., in store locators) |
| `IsInactive` | Temporarily disabled |

For the full store data model and API, see the [Store API reference](store-api.md).

### Markets — regional context

A market is not a location — it's a **configuration context** that determines how Omnium behaves for a given region, country, or business segment. Markets control:

*   **Language and localization** — product content language, date/number formatting
*   **Currency** — which currency is used for prices and orders
*   **Tax rules** — whether prices include tax, default tax rates
*   **Shipping options** — which carriers and methods are available
*   **Payment settings** — default payment types
*   **Communication** — email templates, branding, document footers
*   **Number sequences** — order numbers, customer numbers, invoice numbers

Every order requires a market. The market determines the currency, language, and operational rules for that order.

Stores are linked to markets through the `AvailableOnMarkets` property. A single store can operate in multiple markets — for example, a Nordic web shop might serve both NOR (Norwegian kroner) and SWE (Swedish kronor) markets.

For market configuration details, see the [Markets overview](../Markets.md) and [Market configuration](../Markets/markets-config.md).

### Warehouses — inventory locations

A warehouse is a store with `IsWarehouse: true`. There is no separate warehouse entity.

Each store can specify which warehouses it can fulfill from through the `AvailableWarehouses` property. This is how Omnium knows which stock locations to check when processing an order:

```json
{
  "id": "webshop-no",
  "name": "Norwegian Web Shop",
  "isWarehouse": false,
  "availableOnMarkets": ["NOR"],
  "availableWarehouses": [
    { "warehouseCode": "warehouse-central", "priority": 1 },
    { "warehouseCode": "warehouse-east", "priority": 2 }
  ]
}
```

When an order arrives for this web shop, Omnium allocates it to one of the available warehouses based on priority, stock availability, and [allocation rules](../Inventory/inventory-config.md).

For advanced scenarios where a single physical warehouse serves multiple sales channels with separate inventory pools, see [Virtual Stock Locations](../Inventory/virtual-stock-locations.md).

* * *

## How They Connect

The relationship between stores, markets, and warehouses flows through orders:

```
  Store ──────── placed at ────────┐
  (seller)                         │
                               ┌───▼───────────┐
  Market ───── currency, tax ──▶  Order #12345  │
  (context)    language        └───▲───────────┘
                                   │
  Warehouse ── ships from ─────────┘
  (sender)
```

*   The **store** is the sales channel where the order was placed
*   The **market** provides the operational context (currency, tax, language, shipping options)
*   The **warehouse** is the physical location that fulfills and ships the order

A store and its warehouse can be the same entity (a physical retail store with its own stock) or different entities (a web shop fulfilled by a central warehouse).

* * *

## Organizing Locations

Omnium provides two grouping mechanisms for different purposes:

### Store groups — organizing stores

Store groups organize stores into logical groupings like regions, brands, or franchise networks. A store belongs to one group at a time via `StoreGroupId`.

Use store groups for:

*   Regional reporting ("Northern Region", "Southern Region")
*   Brand divisions ("Premium Stores", "Outlet Stores")
*   Franchise networks or business units
*   Bulk operations on related stores

### Market groups — organizing markets

Market groups organize markets that share configuration. Markets reference a group via `MarketGroupId`.

Use market groups for:

*   Shared email templates across regional markets
*   ERP company mapping (the `MarketGroupId` is used as CompanyId in Dynamics 365)
*   Shared number sequences across related markets

### Store roles — defining capabilities

Unlike groups (which organize), store roles define what a store _can do_. A store can have multiple roles via `StoreRoleIds`.

Common roles:

*   **Ship From Store** — physical stores that can fulfill online orders
*   **Click and Collect** — stores that support in-store pickup
*   **Web Warehouse** — warehouses dedicated to e-commerce fulfillment
*   **Returns Processing** — locations that accept and process returns

Store roles integrate with [warehouse allocation rules](../Inventory/inventory-config.md) to control which locations are eligible for specific order types.

For configuration details, see [Store configuration](store-config.md).

* * *

## Store Availability

Stores have three mechanisms that control where and how they can operate:

### Market availability

`AvailableOnMarkets` specifies which markets a store operates in. A store only appears in queries filtered by its assigned markets, and orders placed at the store must use one of these markets.

### Warehouse availability

`AvailableWarehouses` lists which warehouses a store can ship from, each with a priority. When Omnium allocates an order to a warehouse, it considers these warehouses in priority order.

`AvailableReturnLocations` similarly lists which warehouses accept returns for the store.

### Zip code ranges

`ZipCodeRanges` defines the geographic delivery areas a store or warehouse can service. Each range specifies a from/to zip code and an optional market restriction:

```json
{
  "zipCodeRanges": [
    { "zipCodeFrom": "0001", "zipCodeTo": "1299", "marketId": "NOR" },
    { "zipCodeFrom": "1300", "zipCodeTo": "1399", "marketId": "NOR" }
  ]
}
```

Zip code ranges are used by [warehouse allocation workflows](../Order/workflow-steps.md) to route orders to the nearest or most appropriate warehouse based on the delivery address.

* * *

## Common Setup Patterns

### Single-country retailer

The simplest setup: one market, one web shop, one warehouse.

| Entity | Configuration |
| --- | --- |
| Market: `NOR` | Norwegian, NOK, 25% tax |
| Store: `webshop` | IsWarehouse: false, AvailableOnMarkets: \["NOR"\] |
| Store: `warehouse-central` | IsWarehouse: true, IsPrimaryWarehouse: true |

The web shop points to the central warehouse via `AvailableWarehouses`.

### Multi-country e-commerce

Multiple markets with shared warehouse infrastructure.

| Entity | Configuration |
| --- | --- |
| Market: `NOR` | Norwegian, NOK |
| Market: `SWE` | Swedish, SEK |
| Market: `FIN` | Finnish, EUR |
| Store: `webshop-nordic` | AvailableOnMarkets: \["NOR", "SWE", "FIN"\] |
| Store: `warehouse-oslo` | IsWarehouse: true, AvailableOnMarkets: \["NOR", "SWE"\] |
| Store: `warehouse-helsinki` | IsWarehouse: true, AvailableOnMarkets: \["FIN"\] |

Market groups ("Nordic") can share email templates and number sequences across the three markets.

### Omnichannel with Ship From Store

Physical stores that both sell in-store and fulfill online orders.

| Entity | Configuration |
| --- | --- |
| Store: `webshop` | IsWarehouse: false |
| Store: `warehouse-central` | IsWarehouse: true, StoreRoleIds: \["web-warehouse"\] |
| Store: `store-oslo` | IsWarehouse: true, StoreRoleIds: \["ship-from-store", "click-and-collect"\] |
| Store: `store-bergen` | IsWarehouse: true, StoreRoleIds: \["ship-from-store", "click-and-collect"\] |

The web shop lists all three warehouses in `AvailableWarehouses`. Store roles control which locations are eligible for different order types. The central warehouse handles standard web orders, while physical stores handle ship-from-store and click-and-collect.

### B2B and B2C separation

Separate markets for different customer segments, sharing the same warehouse.

| Entity | Configuration |
| --- | --- |
| Market: `NOR-B2C` | MarketType: "B2C", IsTaxExcluded: false |
| Market: `NOR-B2B` | MarketType: "B2B", IsTaxExcluded: true |
| Store: `webshop-b2c` | AvailableOnMarkets: \["NOR-B2C"\] |
| Store: `webshop-b2b` | AvailableOnMarkets: \["NOR-B2B"\] |
| Store: `warehouse` | IsWarehouse: true, AvailableOnMarkets: \["NOR-B2C", "NOR-B2B"\] |

B2C orders show prices including tax; B2B orders exclude tax. Both use the same warehouse.

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| Store data model and API | [Store API Reference](store-api.md) |
| Store groups, roles, and properties | [Store Configuration](store-config.md) |
| Market setup and model | [Markets](../Markets.md) |
| Market configuration reference | [Market Configuration](../Markets/markets-config.md) |
| Inventory management | [Inventory](../Inventory.md) |
| Inventory settings and allocation | [Inventory Configuration](../Inventory/inventory-config.md) |
| Virtual stock locations | [Virtual Stock Locations](../Inventory/virtual-stock-locations.md) |
| Order allocation to warehouses | [Order Lifecycle](../Order/order-lifecycle.md) |
| Access control and permissions | [Authentication & Roles](../Security/authentication-roles.md) |
